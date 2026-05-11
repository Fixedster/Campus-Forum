package com.campus.forum.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user_follow")
public class UserFollow {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long followUserId;
    private Integer status;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
