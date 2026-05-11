package com.campus.forum.security;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class UserContext {
    private static final ThreadLocal<Long> CURRENT_USER_ID = new ThreadLocal<>();
    private static final ThreadLocal<Integer> CURRENT_USER_ROLE = new ThreadLocal<>();

    public static void setUserId(Long userId) {
        CURRENT_USER_ID.set(userId);
    }

    public static Long getUserId() {
        return CURRENT_USER_ID.get();
    }

    public static void setRole(Integer role) {
        CURRENT_USER_ROLE.set(role);
    }

    public static Integer getRole() {
        return CURRENT_USER_ROLE.get();
    }

    public static void clear() {
        CURRENT_USER_ID.remove();
        CURRENT_USER_ROLE.remove();
    }

    public static boolean isLogin() {
        return CURRENT_USER_ID.get() != null;
    }

    public static boolean isAdmin() {
        Integer role = CURRENT_USER_ROLE.get();
        return role != null && role >= 1;
    }

    public static boolean isSuperAdmin() {
        Integer role = CURRENT_USER_ROLE.get();
        return role != null && role >= 2;
    }
}
