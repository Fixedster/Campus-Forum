package com.campus.forum.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("tag")
public class Tag {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private Long categoryId;
    private Integer status;
    @TableLogic
    private Integer deleted;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
