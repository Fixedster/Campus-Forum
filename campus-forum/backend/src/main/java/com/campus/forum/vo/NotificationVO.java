package com.campus.forum.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationVO {
    private Long id;
    private Long fromUserId;
    private String fromUserName;
    private String fromUserAvatar;
    private Integer type;
    private Long targetId;
    private String content;
    private Integer isRead;
    private LocalDateTime createTime;
}
