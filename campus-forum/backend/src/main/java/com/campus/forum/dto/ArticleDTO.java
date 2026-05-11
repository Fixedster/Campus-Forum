package com.campus.forum.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class ArticleDTO {
    private Long id;
    @NotBlank(message = "标题不能为空")
    @Size(max = 120, message = "标题最长120字")
    private String title;
    @Size(max = 300, message = "摘要最长300字")
    private String summary;
    private String coverImage;
    @NotBlank(message = "内容不能为空")
    private String content;
    @NotNull(message = "分类不能为空")
    private Long categoryId;
    private List<Long> tagIds;
    private Integer source;
    private String sourceUrl;
}
