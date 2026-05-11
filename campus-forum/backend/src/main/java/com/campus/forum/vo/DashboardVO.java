package com.campus.forum.vo;

import lombok.Data;
import java.util.Map;

@Data
public class DashboardVO {
    private Long totalUsers;
    private Long totalArticles;
    private Long totalComments;
    private Long todayNewUsers;
    private Long todayNewArticles;
    private Map<String, Long> categoryArticleCount;
}
