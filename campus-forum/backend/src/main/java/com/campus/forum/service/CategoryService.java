package com.campus.forum.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.forum.entity.Category;
import com.campus.forum.entity.Tag;
import com.campus.forum.mapper.CategoryMapper;
import com.campus.forum.mapper.TagMapper;
import com.campus.forum.vo.TagVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService extends ServiceImpl<CategoryMapper, Category> {

    private final TagMapper tagMapper;

    public List<Category> listActive() {
        return list(new LambdaQueryWrapper<Category>()
                .eq(Category::getStatus, 1)
                .orderByAsc(Category::getSort));
    }

    public List<TagVO> listTags(Long categoryId) {
        LambdaQueryWrapper<Tag> wrapper = new LambdaQueryWrapper<Tag>().eq(Tag::getStatus, 1);
        if (categoryId != null && categoryId > 0) {
            wrapper.eq(Tag::getCategoryId, categoryId);
        }
        return tagMapper.selectList(wrapper).stream().map(tag -> {
            TagVO vo = new TagVO();
            vo.setId(tag.getId());
            vo.setName(tag.getName());
            vo.setCategoryId(tag.getCategoryId());
            return vo;
        }).collect(Collectors.toList());
    }

    public void addCategory(Category category) {
        save(category);
    }

    public void updateCategory(Category category) {
        updateById(category);
    }

    public void addTag(Tag tag) {
        tagMapper.insert(tag);
    }

    public void updateTag(Tag tag) {
        tagMapper.updateById(tag);
    }
}
