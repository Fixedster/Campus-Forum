package com.campus.forum.controller;

import com.campus.forum.common.PageResult;
import com.campus.forum.common.Result;
import com.campus.forum.security.RequireLogin;
import com.campus.forum.security.UserContext;
import com.campus.forum.service.NotificationService;
import com.campus.forum.vo.NotificationVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @RequireLogin
    @GetMapping("/list")
    public Result<PageResult<NotificationVO>> getNotifications(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Result.success(notificationService.getNotifications(page, size));
    }

    @RequireLogin
    @GetMapping("/unread-count")
    public Result<Long> getUnreadCount() {
        return Result.success(notificationService.getUnreadCount());
    }

    @RequireLogin
    @PostMapping("/read/{id}")
    public Result<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return Result.success();
    }

    @RequireLogin
    @PostMapping("/read-all")
    public Result<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return Result.success();
    }
}
