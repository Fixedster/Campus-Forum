package com.campus.forum.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.campus.forum.common.BizException;
import com.campus.forum.common.ErrorCode;
import com.campus.forum.entity.User;
import com.campus.forum.mapper.UserMapper;
import com.campus.forum.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class OAuthService {

    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;
    private final RestTemplate restTemplate;

    @Value("${oauth.github.client-id:}")
    private String githubClientId;

    @Value("${oauth.github.client-secret:}")
    private String githubClientSecret;

    public Map<String, String> handleGithubCallback(String code) {
        if (!StringUtils.hasText(githubClientId) || !StringUtils.hasText(githubClientSecret)) {
            throw new BizException(ErrorCode.INTERNAL_ERROR, "GitHub OAuth 未配置，请联系管理员");
        }

        // 1. 用 code 换 GitHub access_token
        String githubToken = exchangeGithubToken(code);
        if (githubToken == null) {
            throw new BizException(ErrorCode.UNAUTHORIZED, "GitHub 授权失败，请重试");
        }

        // 2. 用 access_token 获取 GitHub 用户信息
        Map<String, Object> githubUser = fetchGithubUser(githubToken);
        if (githubUser == null) {
            throw new BizException(ErrorCode.UNAUTHORIZED, "获取 GitHub 用户信息失败");
        }

        String githubId = String.valueOf(githubUser.get("id"));
        String login = (String) githubUser.get("login");
        String avatarUrl = (String) githubUser.get("avatar_url");
        String name = (String) githubUser.get("name");
        String email = (String) githubUser.get("email");

        // 3. 查本地用户
        User user = userMapper.selectOne(
                new LambdaQueryWrapper<User>().eq(User::getGithubId, githubId));

        if (user != null) {
            // 更新用户信息（GitHub 头像/昵称可能改了）
            boolean needUpdate = false;
            if (StringUtils.hasText(avatarUrl) && !avatarUrl.equals(user.getAvatar())) {
                user.setAvatar(avatarUrl);
                needUpdate = true;
            }
            if (StringUtils.hasText(name) && !name.equals(user.getNickname())) {
                user.setNickname(name);
                needUpdate = true;
            }
            if (StringUtils.hasText(login) && !login.equals(user.getUsername())) {
                user.setUsername(login);
                needUpdate = true;
            }
            if (needUpdate) {
                userMapper.updateById(user);
            }
        } else {
            // 创建新用户
            user = new User();
            user.setUsername(login != null ? login : "github_" + githubId);
            user.setPassword(UUID.randomUUID().toString());
            user.setGithubId(githubId);
            user.setAvatar(avatarUrl != null ? avatarUrl : "");
            user.setNickname(name != null ? name : login);
            user.setBio("");
            user.setCollege("");
            user.setMajor("");
            user.setStudentId("");
            user.setEmail(email != null ? email : "");
            user.setRole(0);
            user.setStatus(1);
            userMapper.insert(user);
        }

        // 4. 生成 JWT
        return generateTokens(user);
    }

    /**
     * 用授权码交换 GitHub access_token
     */
    private String exchangeGithubToken(String code) {
        try {
            String url = "https://github.com/login/oauth/access_token";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.setAccept(java.util.Collections.singletonList(MediaType.APPLICATION_JSON));

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("client_id", githubClientId);
            body.add("client_secret", githubClientSecret);
            body.add("code", code);

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String accessToken = (String) response.getBody().get("access_token");
                if (StringUtils.hasText(accessToken)) {
                    return accessToken;
                }
                String error = (String) response.getBody().get("error_description");
                log.error("GitHub OAuth error: {}", error);
            }
        } catch (Exception e) {
            log.error("Failed to exchange GitHub token: {}", e.getMessage());
        }
        return null;
    }

    /**
     * 获取 GitHub 用户信息
     */
    private Map<String, Object> fetchGithubUser(String accessToken) {
        try {
            String url = "https://api.github.com/user";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.setAccept(java.util.Collections.singletonList(MediaType.APPLICATION_JSON));

            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<Map> response = restTemplate.exchange(
                    url, HttpMethod.GET, request, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.error("Failed to fetch GitHub user: {}", e.getMessage());
        }
        return null;
    }

    private Map<String, String> generateTokens(User user) {
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;
    }
}
