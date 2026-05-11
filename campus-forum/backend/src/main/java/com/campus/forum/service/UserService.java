package com.campus.forum.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.forum.common.BizException;
import com.campus.forum.common.ErrorCode;
import com.campus.forum.common.PageResult;
import com.campus.forum.dto.LoginDTO;
import com.campus.forum.dto.RegisterDTO;
import com.campus.forum.dto.UserProfileDTO;
import com.campus.forum.entity.Article;
import com.campus.forum.entity.User;
import com.campus.forum.entity.UserFollow;
import com.campus.forum.mapper.ArticleMapper;
import com.campus.forum.mapper.UserFollowMapper;
import com.campus.forum.mapper.UserMapper;
import com.campus.forum.security.JwtUtil;
import com.campus.forum.security.UserContext;
import com.campus.forum.vo.UserVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserService extends ServiceImpl<UserMapper, User> {

    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;
    private final ArticleMapper articleMapper;
    private final UserFollowMapper userFollowMapper;

    public Map<String, String> register(RegisterDTO dto) {
        User exist = getOne(new LambdaQueryWrapper<User>().eq(User::getUsername, dto.getUsername()));
        if (exist != null) {
            throw new BizException(ErrorCode.USER_ALREADY_EXISTS);
        }
        User user = new User();
        user.setUsername(dto.getUsername());
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        user.setPassword(encoder.encode(dto.getPassword()));
        user.setEmail(dto.getEmail() != null ? dto.getEmail() : "");
        user.setNickname(dto.getNickname() != null ? dto.getNickname() : dto.getUsername());
        user.setCollege(dto.getCollege() != null ? dto.getCollege() : "");
        user.setMajor(dto.getMajor() != null ? dto.getMajor() : "");
        user.setStudentId(dto.getStudentId() != null ? dto.getStudentId() : "");
        user.setRole(0);
        user.setStatus(1);
        save(user);
        return generateTokens(user);
    }

    public Map<String, String> login(LoginDTO dto) {
        User user = getOne(new LambdaQueryWrapper<User>().eq(User::getUsername, dto.getUsername()));
        if (user == null) {
            throw new BizException(ErrorCode.USER_NOT_FOUND);
        }
        if (user.getStatus() == 0) {
            throw new BizException(ErrorCode.USER_DISABLED);
        }
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        if (!encoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BizException(ErrorCode.PASSWORD_ERROR);
        }
        return generateTokens(user);
    }

    public Map<String, String> refreshToken(String refreshToken) {
        Long userId = jwtUtil.getUserIdFromRefresh(refreshToken);
        User user = getById(userId);
        if (user == null || user.getStatus() == 0) {
            throw new BizException(ErrorCode.UNAUTHORIZED);
        }
        return generateTokens(user);
    }

    public void logout(String token) {
        if (StringUtils.hasText(token)) {
            String key = "token:blacklist:" + token;
            redisTemplate.opsForValue().set(key, "1", 2, TimeUnit.HOURS);
        }
    }

    private Map<String, String> generateTokens(User user) {
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        return tokens;
    }

    public UserVO getUserInfo(Long userId) {
        User user = getById(userId);
        if (user == null) {
            throw new BizException(ErrorCode.USER_NOT_FOUND);
        }
        return toUserVO(user);
    }

    public void updateProfile(UserProfileDTO dto) {
        Long userId = UserContext.getUserId();
        User user = getById(userId);
        if (user == null) {
            throw new BizException(ErrorCode.USER_NOT_FOUND);
        }
        if (StringUtils.hasText(dto.getNickname())) user.setNickname(dto.getNickname());
        if (dto.getAvatar() != null) user.setAvatar(dto.getAvatar());
        if (dto.getBio() != null) user.setBio(dto.getBio());
        if (dto.getCollege() != null) user.setCollege(dto.getCollege());
        if (dto.getMajor() != null) user.setMajor(dto.getMajor());
        if (dto.getStudentId() != null) user.setStudentId(dto.getStudentId());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        updateById(user);
    }

    public void follow(Long followUserId) {
        Long userId = UserContext.getUserId();
        if (userId.equals(followUserId)) {
            throw new BizException(ErrorCode.PARAM_ERROR, "不能关注自己");
        }
        UserFollow follow = userFollowMapper.selectOne(
                new LambdaQueryWrapper<UserFollow>()
                        .eq(UserFollow::getUserId, userId)
                        .eq(UserFollow::getFollowUserId, followUserId));
        if (follow == null) {
            follow = new UserFollow();
            follow.setUserId(userId);
            follow.setFollowUserId(followUserId);
            follow.setStatus(1);
            userFollowMapper.insert(follow);
        } else {
            follow.setStatus(follow.getStatus() == 1 ? 0 : 1);
            userFollowMapper.updateById(follow);
        }
    }

    public PageResult<UserVO> getFollowers(Long userId, int page, int size) {
        Page<UserFollow> followPage = userFollowMapper.selectPage(
                new Page<>(page, size),
                new LambdaQueryWrapper<UserFollow>()
                        .eq(UserFollow::getFollowUserId, userId)
                        .eq(UserFollow::getStatus, 1));
        return null;
    }

    private UserVO toUserVO(User user) {
        UserVO vo = new UserVO();
        vo.setId(user.getId());
        vo.setUsername(user.getUsername());
        vo.setNickname(user.getNickname());
        vo.setAvatar(user.getAvatar());
        vo.setBio(user.getBio());
        vo.setCollege(user.getCollege());
        vo.setMajor(user.getMajor());
        vo.setStudentId(user.getStudentId());
        vo.setEmail(user.getEmail());
        vo.setRole(user.getRole());
        vo.setCreateTime(user.getCreateTime());
        Long articleCount = articleMapper.selectCount(
                new LambdaQueryWrapper<Article>()
                        .eq(Article::getUserId, user.getId())
                        .eq(Article::getStatus, 1));
        vo.setArticleCount(articleCount.intValue());
        Long followerCount = userFollowMapper.selectCount(
                new LambdaQueryWrapper<UserFollow>()
                        .eq(UserFollow::getFollowUserId, user.getId())
                        .eq(UserFollow::getStatus, 1));
        vo.setFollowerCount(followerCount.intValue());
        Long followingCount = userFollowMapper.selectCount(
                new LambdaQueryWrapper<UserFollow>()
                        .eq(UserFollow::getUserId, user.getId())
                        .eq(UserFollow::getStatus, 1));
        vo.setFollowingCount(followingCount.intValue());
        return vo;
    }
}
