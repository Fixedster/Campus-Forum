package com.campus.forum.vo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ArticleVO {
    private Long id;
    private Long userId;
    private String authorName;
    private String authorAvatar;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String summary;
    private String coverImage;
    private String content;
    private Integer source;
    private String sourceUrl;
    private Integer status;
    private Integer toppingStat;
    private Integer recommendStat;
    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;
    private Integer collectCount;
    private Boolean liked;
    private Boolean collected;
    private List<TagVO> tags;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
