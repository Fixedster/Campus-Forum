package com.campus.forum.vo;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class CommentVO {
    private Long id;
    private Long articleId;
    private Long userId;
    private String userName;
    private String userAvatar;
    private String content;
    private Long parentId;
    private Long replyUserId;
    private String replyUserName;
    private Integer likeCount;
    private Boolean liked;
    private List<CommentVO> children;
    private LocalDateTime createTime;
}
