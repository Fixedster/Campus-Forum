package com.campus.forum.controller;

import com.campus.forum.common.Result;
import com.campus.forum.entity.Category;
import com.campus.forum.entity.Tag;
import com.campus.forum.security.RequireLogin;
import com.campus.forum.security.RequireRole;
import com.campus.forum.service.CategoryService;
import com.campus.forum.vo.TagVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/list")
    public Result<List<Category>> listCategories() {
        return Result.success(categoryService.listActive());
    }

    @GetMapping("/tags")
    public Result<List<TagVO>> listTags(@RequestParam(required = false) Long categoryId) {
        return Result.success(categoryService.listTags(categoryId));
    }

    @RequireLogin
    @RequireRole(1)
    @PostMapping("/add")
    public Result<Void> addCategory(@RequestBody Category category) {
        categoryService.addCategory(category);
        return Result.success();
    }

    @RequireLogin
    @RequireRole(1)
    @PutMapping("/update")
    public Result<Void> updateCategory(@RequestBody Category category) {
        categoryService.updateCategory(category);
        return Result.success();
    }

    @RequireLogin
    @RequireRole(1)
    @PostMapping("/tag/add")
    public Result<Void> addTag(@RequestBody Tag tag) {
        categoryService.addTag(tag);
        return Result.success();
    }

    @RequireLogin
    @RequireRole(1)
    @PutMapping("/tag/update")
    public Result<Void> updateTag(@RequestBody Tag tag) {
        categoryService.updateTag(tag);
        return Result.success();
    }
}
