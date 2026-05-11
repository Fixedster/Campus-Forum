package com.campus.forum.dto;

import lombok.Data;

@Data
public class ArticleQueryDTO {
    private String keyword;
    private Long categoryId;
    private Long tagId;
    private String sort;
    private Integer page = 1;
    private Integer size = 10;
}
