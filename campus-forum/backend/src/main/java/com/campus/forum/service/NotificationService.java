package com.campus.forum.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.forum.common.PageResult;
import com.campus.forum.entity.Notification;
import com.campus.forum.entity.User;
import com.campus.forum.mapper.NotificationMapper;
import com.campus.forum.mapper.UserMapper;
import com.campus.forum.security.UserContext;
import com.campus.forum.vo.NotificationVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService extends ServiceImpl<NotificationMapper, Notification> {

    private final UserMapper userMapper;

    public PageResult<NotificationVO> getNotifications(int page, int size) {
        Long userId = UserContext.getUserId();
        Page<Notification> notiPage = page(new Page<>(page, size),
                new LambdaQueryWrapper<Notification>()
                        .eq(Notification::getUserId, userId)
                        .orderByDesc(Notification::getCreateTime));
        List<NotificationVO> voList = notiPage.getRecords().stream().map(this::toVO).collect(Collectors.toList());
        return PageResult.of(notiPage.getTotal(), notiPage.getCurrent(), notiPage.getSize(), voList);
    }

    public long getUnreadCount() {
        Long userId = UserContext.getUserId();
        return count(new LambdaQueryWrapper<Notification>()
                .eq(Notification::getUserId, userId)
                .eq(Notification::getIsRead, 0));
    }

    public void markAsRead(Long notificationId) {
        update(new LambdaUpdateWrapper<Notification>()
                .eq(Notification::getId, notificationId)
                .set(Notification::getIsRead, 1));
    }

    public void markAllAsRead() {
        Long userId = UserContext.getUserId();
        update(new LambdaUpdateWrapper<Notification>()
                .eq(Notification::getUserId, userId)
                .eq(Notification::getIsRead, 0)
                .set(Notification::getIsRead, 1));
    }

    private NotificationVO toVO(Notification noti) {
        NotificationVO vo = new NotificationVO();
        vo.setId(noti.getId());
        vo.setFromUserId(noti.getFromUserId());
        vo.setType(noti.getType());
        vo.setTargetId(noti.getTargetId());
        vo.setContent(noti.getContent());
        vo.setIsRead(noti.getIsRead());
        vo.setCreateTime(noti.getCreateTime());
        User fromUser = userMapper.selectById(noti.getFromUserId());
        if (fromUser != null) {
            vo.setFromUserName(fromUser.getNickname());
            vo.setFromUserAvatar(fromUser.getAvatar());
        }
        return vo;
    }
}
