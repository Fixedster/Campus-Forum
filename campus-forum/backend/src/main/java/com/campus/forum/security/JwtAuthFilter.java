package com.campus.forum.security;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.campus.forum.entity.User;
import com.campus.forum.mapper.UserMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final StringRedisTemplate redisTemplate;
    private final UserMapper userMapper;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String token = extractToken(request);
        if (token != null) {
            try {
                String blackKey = "token:blacklist:" + token;
                if (Boolean.TRUE.equals(redisTemplate.hasKey(blackKey))) {
                    filterChain.doFilter(request, response);
                    return;
                }

                DecodedJWT jwt = jwtUtil.verifyAccessToken(token);
                Long userId = jwt.getClaim("userId").asLong();
                Integer role = jwt.getClaim("role").asInt();

                User user = userMapper.selectById(userId);
                if (user != null && user.getStatus() == 1) {
                    UserContext.setUserId(userId);
                    UserContext.setRole(role);
                }
            } catch (JWTVerificationException e) {
                log.debug("JWT verification failed: {}", e.getMessage());
            }
        }
        try {
            filterChain.doFilter(request, response);
        } finally {
            UserContext.clear();
        }
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        return null;
    }
}
