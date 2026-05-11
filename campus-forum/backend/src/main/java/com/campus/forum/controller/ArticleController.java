package com.campus.forum.controller;

import com.campus.forum.common.PageResult;
import com.campus.forum.common.Result;
import com.campus.forum.dto.ArticleDTO;
import com.campus.forum.dto.ArticleQueryDTO;
import com.campus.forum.security.RequireLogin;
import com.campus.forum.security.RequireRole;
import com.campus.forum.security.UserContext;
import com.campus.forum.service.ArticleService;
import com.campus.forum.vo.ArticleVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/article")
@RequiredArgsConstructor
public class ArticleController {

    private final ArticleService articleService;

    @GetMapping("/list")
    public Result<PageResult<ArticleVO>> listArticles(ArticleQueryDTO query) {
        return Result.success(articleService.listArticles(query));
    }

    @GetMapping("/{id}")
    public Result<ArticleVO> getArticle(@PathVariable Long id) {
        return Result.success(articleService.getArticle(id));
    }

    @RequireLogin
    @PostMapping("/publish")
    public Result<Long> publishArticle(@Valid @RequestBody ArticleDTO dto) {
        return Result.success(articleService.publishArticle(dto));
    }

    @RequireLogin
    @PutMapping("/update")
    public Result<Void> updateArticle(@Valid @RequestBody ArticleDTO dto) {
        articleService.updateArticle(dto);
        return Result.success();
    }

    @RequireLogin
    @DeleteMapping("/{id}")
    public Result<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return Result.success();
    }

    @RequireLogin
    @PostMapping("/{id}/like")
    public Result<Void> toggleLike(@PathVariable Long id) {
        articleService.toggleLike(id);
        return Result.success();
    }

    @RequireLogin
    @PostMapping("/{id}/collect")
    public Result<Void> toggleCollect(@PathVariable Long id) {
        articleService.toggleCollect(id);
        return Result.success();
    }

    @GetMapping("/user/{userId}")
    public Result<List<ArticleVO>> getUserArticles(@PathVariable Long userId,
                                                    @RequestParam(defaultValue = "1") int page,
                                                    @RequestParam(defaultValue = "10") int size) {
        return Result.success(articleService.getUserArticles(userId, page, size));
    }

    @RequireLogin
    @GetMapping("/collects")
    public Result<List<ArticleVO>> getMyCollects(@RequestParam(defaultValue = "1") int page,
                                                  @RequestParam(defaultValue = "10") int size) {
        return Result.success(articleService.getUserCollects(UserContext.getUserId(), page, size));
    }

    @RequireLogin
    @RequireRole(1)
    @PostMapping("/{id}/top")
    public Result<Void> toggleTop(@PathVariable Long id, @RequestParam Integer stat) {
        articleService.toggleTop(id, stat);
        return Result.success();
    }

    @RequireLogin
    @RequireRole(1)
    @PostMapping("/{id}/recommend")
    public Result<Void> toggleRecommend(@PathVariable Long id, @RequestParam Integer stat) {
        articleService.toggleRecommend(id, stat);
        return Result.success();
    }

    @RequireLogin
    @RequireRole(1)
    @PostMapping("/{id}/status")
    public Result<Void> changeStatus(@PathVariable Long id, @RequestParam Integer status) {
        articleService.changeStatus(id, status);
        return Result.success();
    }
}
