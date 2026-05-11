package com.campus.forum.controller;

import com.campus.forum.common.Result;
import com.campus.forum.dto.CommentDTO;
import com.campus.forum.security.RequireLogin;
import com.campus.forum.service.CommentService;
import com.campus.forum.vo.CommentVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comment")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/article/{articleId}")
    public Result<List<CommentVO>> getArticleComments(@PathVariable Long articleId) {
        return Result.success(commentService.getArticleComments(articleId));
    }

    @RequireLogin
    @PostMapping("/add")
    public Result<Long> addComment(@Valid @RequestBody CommentDTO dto) {
        return Result.success(commentService.addComment(dto));
    }

    @RequireLogin
    @DeleteMapping("/{id}")
    public Result<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return Result.success();
    }
}
