package com.campus.forum.security;

import com.campus.forum.common.BizException;
import com.campus.forum.common.ErrorCode;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuthAspect {

    @Around("@annotation(requireLogin)")
    public Object checkLogin(ProceedingJoinPoint joinPoint, RequireLogin requireLogin) throws Throwable {
        if (!UserContext.isLogin()) {
            throw new BizException(ErrorCode.UNAUTHORIZED);
        }
        return joinPoint.proceed();
    }

    @Around("@annotation(requireRole)")
    public Object checkRole(ProceedingJoinPoint joinPoint, RequireRole requireRole) throws Throwable {
        if (!UserContext.isLogin()) {
            throw new BizException(ErrorCode.UNAUTHORIZED);
        }
        Integer role = UserContext.getRole();
        if (role == null || role < requireRole.value()) {
            throw new BizException(ErrorCode.FORBIDDEN);
        }
        return joinPoint.proceed();
    }
}
