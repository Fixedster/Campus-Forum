package com.campus.forum.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("user_like")
public class UserLike {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long targetId;
    private Integer targetType;
    private LocalDateTime createTime;
}
