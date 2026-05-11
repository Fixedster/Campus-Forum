package com.campus.forum.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.access-token-secret}")
    private String accessSecret;

    @Value("${jwt.refresh-token-secret}")
    private String refreshSecret;

    @Value("${jwt.access-token-expire}")
    private long accessExpire;

    @Value("${jwt.refresh-token-expire}")
    private long refreshExpire;

    public String generateAccessToken(Long userId, Integer role) {
        return JWT.create()
                .withClaim("userId", userId)
                .withClaim("role", role)
                .withClaim("type", "access")
                .withExpiresAt(new Date(System.currentTimeMillis() + accessExpire))
                .sign(Algorithm.HMAC256(accessSecret));
    }

    public String generateRefreshToken(Long userId) {
        return JWT.create()
                .withClaim("userId", userId)
                .withClaim("type", "refresh")
                .withExpiresAt(new Date(System.currentTimeMillis() + refreshExpire))
                .sign(Algorithm.HMAC256(refreshSecret));
    }

    public DecodedJWT verifyAccessToken(String token) {
        return JWT.require(Algorithm.HMAC256(accessSecret)).build().verify(token);
    }

    public DecodedJWT verifyRefreshToken(String token) {
        return JWT.require(Algorithm.HMAC256(refreshSecret)).build().verify(token);
    }

    public Long getUserIdFromAccess(String token) {
        return verifyAccessToken(token).getClaim("userId").asLong();
    }

    public Integer getRoleFromAccess(String token) {
        return verifyAccessToken(token).getClaim("role").asInt();
    }

    public Long getUserIdFromRefresh(String token) {
        return verifyRefreshToken(token).getClaim("userId").asLong();
    }
}
