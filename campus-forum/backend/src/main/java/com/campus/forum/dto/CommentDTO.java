package com.campus.forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CommentDTO {
    @NotNull(message = "文章ID不能为空")
    private Long articleId;
    @NotBlank(message = "评论内容不能为空")
    @Size(max = 1000, message = "评论最长1000字")
    private String content;
    private Long parentId;
    private Long replyUserId;
}
