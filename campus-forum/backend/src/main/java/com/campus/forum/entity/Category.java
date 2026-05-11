package com.campus.forum.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("category")
public class Category {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String icon;
    private Integer sort;
    private Integer status;
    @TableLogic
    private Integer deleted;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
