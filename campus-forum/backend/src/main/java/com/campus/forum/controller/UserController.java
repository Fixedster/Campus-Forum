package com.campus.forum.controller;

import com.campus.forum.common.Result;
import com.campus.forum.dto.LoginDTO;
import com.campus.forum.dto.RegisterDTO;
import com.campus.forum.security.RequireLogin;
import com.campus.forum.security.UserContext;
import com.campus.forum.service.UserService;
import com.campus.forum.vo.UserVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public Result<Map<String, String>> register(@Valid @RequestBody RegisterDTO dto) {
        return Result.success(userService.register(dto));
    }

    @PostMapping("/login")
    public Result<Map<String, String>> login(@Valid @RequestBody LoginDTO dto) {
        return Result.success(userService.login(dto));
    }

    @PostMapping("/refresh")
    public Result<Map<String, String>> refresh(@RequestParam String refreshToken) {
        return Result.success(userService.refreshToken(refreshToken));
    }

    @RequireLogin
    @PostMapping("/logout")
    public Result<Void> logout(@RequestHeader(value = "Authorization", required = false) String auth) {
        String token = auth != null && auth.startsWith("Bearer ") ? auth.substring(7) : null;
        userService.logout(token);
        return Result.success();
    }

    @GetMapping("/info/{id}")
    public Result<UserVO> getUserInfo(@PathVariable Long id) {
        return Result.success(userService.getUserInfo(id));
    }

    @RequireLogin
    @GetMapping("/info")
    public Result<UserVO> getCurrentUser() {
        return Result.success(userService.getUserInfo(UserContext.getUserId()));
    }

    @RequireLogin
    @PutMapping("/profile")
    public Result<Void> updateProfile(@RequestBody com.campus.forum.dto.UserProfileDTO dto) {
        userService.updateProfile(dto);
        return Result.success();
    }

    @RequireLogin
    @PostMapping("/follow/{userId}")
    public Result<Void> follow(@PathVariable Long userId) {
        userService.follow(userId);
        return Result.success();
    }
}
