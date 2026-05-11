package com.campus.forum.controller;

import com.campus.forum.common.PageResult;
import com.campus.forum.common.Result;
import com.campus.forum.dto.ArticleQueryDTO;
import com.campus.forum.dto.ConfigDTO;
import com.campus.forum.security.RequireLogin;
import com.campus.forum.security.RequireRole;
import com.campus.forum.service.AdminService;
import com.campus.forum.vo.ArticleVO;
import com.campus.forum.vo.DashboardVO;
import com.campus.forum.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @RequireRole(1)
    @GetMapping("/dashboard")
    public Result<DashboardVO> getDashboard() {
        return Result.success(adminService.getDashboard());
    }

    @RequireRole(1)
    @GetMapping("/users")
    public Result<PageResult<UserVO>> listUsers(@RequestParam(defaultValue = "1") int page,
                                                 @RequestParam(defaultValue = "10") int size) {
        return Result.success(adminService.listUsers(page, size));
    }

    @RequireRole(2)
    @PutMapping("/user/{id}/role")
    public Result<Void> changeUserRole(@PathVariable Long id, @RequestParam Integer role) {
        adminService.changeUserRole(id, role);
        return Result.success();
    }

    @RequireRole(1)
    @PutMapping("/user/{id}/status")
    public Result<Void> changeUserStatus(@PathVariable Long id, @RequestParam Integer status) {
        adminService.changeUserStatus(id, status);
        return Result.success();
    }

    @RequireRole(1)
    @GetMapping("/articles")
    public Result<PageResult<ArticleVO>> listArticles(ArticleQueryDTO query) {
        return Result.success(adminService.listAllArticles(query));
    }

    @RequireRole(1)
    @GetMapping("/configs")
    public Result<Map<String, String>> getAllConfigs() {
        return Result.success(adminService.getAllConfigs());
    }

    @RequireRole(2)
    @PutMapping("/config")
    public Result<Void> updateConfig(@RequestBody ConfigDTO dto) {
        adminService.updateConfig(dto);
        return Result.success();
    }
}
