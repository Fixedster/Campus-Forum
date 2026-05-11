package com.campus.forum.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("article")
public class Article {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long categoryId;
    private String title;
    private String summary;
    private String coverImage;
    private String content;
    private String contentHtml;
    private Integer source;
    private String sourceUrl;
    private Integer status;
    private Integer toppingStat;
    private Integer recommendStat;
    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;
    private Integer collectCount;
    @TableLogic
    private Integer deleted;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
