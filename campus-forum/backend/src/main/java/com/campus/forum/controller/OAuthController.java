package com.campus.forum.controller;

import com.campus.forum.common.Result;
import com.campus.forum.dto.GithubLoginDTO;
import com.campus.forum.service.OAuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/oauth")
@RequiredArgsConstructor
public class OAuthController {

    private final OAuthService oAuthService;

    @Value("${oauth.github.client-id:}")
    private String githubClientId;

    @Value("${oauth.github.redirect-uri:}")
    private String githubRedirectUri;

    /**
     * 获取 GitHub OAuth 配置（前端用来拼接授权 URL）
     */
    @GetMapping("/github/config")
    public Result<Map<String, String>> getGithubConfig() {
        return Result.success(Map.of(
            "clientId", githubClientId,
            "redirectUri", githubRedirectUri
        ));
    }

    /**
     * GitHub 登录回调
     * 接收前端发来的授权码，交换 token 并创建/登录用户
     */
    @PostMapping("/github/callback")
    public Result<Map<String, String>> githubCallback(@Valid @RequestBody GithubLoginDTO dto) {
        Map<String, String> tokens = oAuthService.handleGithubCallback(dto.getCode());
        return Result.success(tokens);
    }
}
