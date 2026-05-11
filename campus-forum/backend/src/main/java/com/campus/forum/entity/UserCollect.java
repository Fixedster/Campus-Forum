package com.campus.forum.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user_collect")
public class UserCollect {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long articleId;
    private LocalDateTime createTime;
}
