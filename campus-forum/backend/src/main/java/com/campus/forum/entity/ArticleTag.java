package com.campus.forum.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("article_tag")
public class ArticleTag {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long articleId;
    private Long tagId;
    private LocalDateTime createTime;
}
