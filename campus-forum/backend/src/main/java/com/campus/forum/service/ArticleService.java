package com.campus.forum.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.campus.forum.common.BizException;
import com.campus.forum.common.ErrorCode;
import com.campus.forum.common.PageResult;
import com.campus.forum.dto.ArticleDTO;
import com.campus.forum.dto.ArticleQueryDTO;
import com.campus.forum.entity.*;
import com.campus.forum.mapper.*;
import com.campus.forum.security.UserContext;
import com.campus.forum.vo.ArticleVO;
import com.campus.forum.vo.TagVO;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArticleService extends ServiceImpl<ArticleMapper, Article> {

    private final ArticleTagMapper articleTagMapper;
    private final CategoryMapper categoryMapper;
    private final TagMapper tagMapper;
    private final UserMapper userMapper;
    private final UserLikeMapper userLikeMapper;
    private final UserCollectMapper userCollectMapper;
    private final StringRedisTemplate redisTemplate;

    public PageResult<ArticleVO> listArticles(ArticleQueryDTO query) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<Article>()
                .eq(Article::getStatus, 1);
        if (query.getCategoryId() != null && query.getCategoryId() > 0) {
            wrapper.eq(Article::getCategoryId, query.getCategoryId());
        }
        if (StringUtils.hasText(query.getKeyword())) {
            wrapper.and(w -> w.like(Article::getTitle, query.getKeyword())
                    .or().like(Article::getSummary, query.getKeyword()));
        }
        if (query.getTagId() != null) {
            List<Long> articleIds = articleTagMapper.selectList(
                    new LambdaQueryWrapper<ArticleTag>().eq(ArticleTag::getTagId, query.getTagId()))
                    .stream().map(ArticleTag::getArticleId).collect(Collectors.toList());
            if (articleIds.isEmpty()) {
                return PageResult.of(0, query.getPage(), query.getSize(), Collections.emptyList());
            }
            wrapper.in(Article::getId, articleIds);
        }
        if ("hot".equals(query.getSort())) {
            wrapper.orderByDesc(Article::getViewCount);
        } else if ("like".equals(query.getSort())) {
            wrapper.orderByDesc(Article::getLikeCount);
        } else {
            wrapper.orderByDesc(Article::getToppingStat).orderByDesc(Article::getCreateTime);
        }
        Page<Article> page = page(new Page<>(query.getPage(), query.getSize()), wrapper);
        List<ArticleVO> voList = page.getRecords().stream().map(this::toArticleVO).collect(Collectors.toList());
        return PageResult.of(page.getTotal(), page.getCurrent(), page.getSize(), voList);
    }

    public ArticleVO getArticle(Long id) {
        Article article = getById(id);
        if (article == null || article.getStatus() != 1) {
            throw new BizException(ErrorCode.ARTICLE_NOT_FOUND);
        }
        String viewKey = "article:view:" + id;
        if (Boolean.TRUE.equals(redisTemplate.hasKey(viewKey))) {
            return toArticleVO(article);
        }
        update(new LambdaUpdateWrapper<Article>()
                .eq(Article::getId, id)
                .setSql("view_count = view_count + 1"));
        redisTemplate.opsForValue().set(viewKey, "1", 5, TimeUnit.MINUTES);
        article.setViewCount(article.getViewCount() + 1);
        return toArticleVO(article);
    }

    @Transactional
    public Long publishArticle(ArticleDTO dto) {
        Long userId = UserContext.getUserId();
        Article article = new Article();
        article.setUserId(userId);
        article.setTitle(dto.getTitle());
        article.setSummary(dto.getSummary());
        article.setCoverImage(dto.getCoverImage());
        article.setContent(dto.getContent());
        article.setContentHtml(dto.getContent());
        article.setCategoryId(dto.getCategoryId());
        article.setSource(dto.getSource() != null ? dto.getSource() : 2);
        article.setSourceUrl(dto.getSourceUrl());
        article.setStatus(1);
        article.setViewCount(0);
        article.setLikeCount(0);
        article.setCommentCount(0);
        article.setCollectCount(0);
        save(article);
        if (dto.getTagIds() != null && !dto.getTagIds().isEmpty()) {
            for (Long tagId : dto.getTagIds()) {
                ArticleTag at = new ArticleTag();
                at.setArticleId(article.getId());
                at.setTagId(tagId);
                articleTagMapper.insert(at);
            }
        }
        return article.getId();
    }

    @Transactional
    public void updateArticle(ArticleDTO dto) {
        if (dto.getId() == null) throw new BizException(ErrorCode.PARAM_ERROR);
        Article article = getById(dto.getId());
        if (article == null) throw new BizException(ErrorCode.ARTICLE_NOT_FOUND);
        Long userId = UserContext.getUserId();
        if (!article.getUserId().equals(userId) && !UserContext.isAdmin()) {
            throw new BizException(ErrorCode.FORBIDDEN);
        }
        article.setTitle(dto.getTitle());
        article.setSummary(dto.getSummary());
        article.setCoverImage(dto.getCoverImage());
        article.setContent(dto.getContent());
        article.setContentHtml(dto.getContent());
        article.setCategoryId(dto.getCategoryId());
        article.setSource(dto.getSource());
        article.setSourceUrl(dto.getSourceUrl());
        updateById(article);
        articleTagMapper.delete(new LambdaQueryWrapper<ArticleTag>().eq(ArticleTag::getArticleId, article.getId()));
        if (dto.getTagIds() != null) {
            for (Long tagId : dto.getTagIds()) {
                ArticleTag at = new ArticleTag();
                at.setArticleId(article.getId());
                at.setTagId(tagId);
                articleTagMapper.insert(at);
            }
        }
    }

    @Transactional
    public void deleteArticle(Long id) {
        Article article = getById(id);
        if (article == null) throw new BizException(ErrorCode.ARTICLE_NOT_FOUND);
        Long userId = UserContext.getUserId();
        if (!article.getUserId().equals(userId) && !UserContext.isAdmin()) {
            throw new BizException(ErrorCode.FORBIDDEN);
        }
        removeById(id);
    }

    public void toggleLike(Long articleId) {
        Long userId = UserContext.getUserId();
        UserLike like = userLikeMapper.selectOne(
                new LambdaQueryWrapper<UserLike>()
                        .eq(UserLike::getUserId, userId)
                        .eq(UserLike::getTargetId, articleId)
                        .eq(UserLike::getTargetType, 1));
        if (like == null) {
            like = new UserLike();
            like.setUserId(userId);
            like.setTargetId(articleId);
            like.setTargetType(1);
            userLikeMapper.insert(like);
            update(new LambdaUpdateWrapper<Article>()
                    .eq(Article::getId, articleId)
                    .setSql("like_count = like_count + 1"));
        } else {
            userLikeMapper.deleteById(like.getId());
            update(new LambdaUpdateWrapper<Article>()
                    .eq(Article::getId, articleId)
                    .setSql("like_count = GREATEST(like_count - 1, 0)"));
        }
    }

    public void toggleCollect(Long articleId) {
        Long userId = UserContext.getUserId();
        UserCollect collect = userCollectMapper.selectOne(
                new LambdaQueryWrapper<UserCollect>()
                        .eq(UserCollect::getUserId, userId)
                        .eq(UserCollect::getArticleId, articleId));
        if (collect == null) {
            collect = new UserCollect();
            collect.setUserId(userId);
            collect.setArticleId(articleId);
            userCollectMapper.insert(collect);
            update(new LambdaUpdateWrapper<Article>()
                    .eq(Article::getId, articleId)
                    .setSql("collect_count = collect_count + 1"));
        } else {
            userCollectMapper.deleteById(collect.getId());
            update(new LambdaUpdateWrapper<Article>()
                    .eq(Article::getId, articleId)
                    .setSql("collect_count = GREATEST(collect_count - 1, 0)"));
        }
    }

    public List<ArticleVO> getUserArticles(Long userId, int page, int size) {
        Page<Article> articlePage = page(new Page<>(page, size),
                new LambdaQueryWrapper<Article>()
                        .eq(Article::getUserId, userId)
                        .eq(Article::getStatus, 1)
                        .orderByDesc(Article::getCreateTime));
        return articlePage.getRecords().stream().map(this::toArticleVO).collect(Collectors.toList());
    }

    public List<ArticleVO> getUserCollects(Long userId, int page, int size) {
        List<UserCollect> collects = userCollectMapper.selectList(
                new LambdaQueryWrapper<UserCollect>()
                        .eq(UserCollect::getUserId, userId)
                        .orderByDesc(UserCollect::getCreateTime)
                        .last("LIMIT " + size + " OFFSET " + (page - 1) * size));
        if (collects.isEmpty()) return Collections.emptyList();
        List<Long> articleIds = collects.stream().map(UserCollect::getArticleId).collect(Collectors.toList());
        List<Article> articles = listByIds(articleIds);
        return articles.stream().map(this::toArticleVO).collect(Collectors.toList());
    }

    public void toggleTop(Long articleId, Integer stat) {
        if (!UserContext.isAdmin()) throw new BizException(ErrorCode.FORBIDDEN);
        update(new LambdaUpdateWrapper<Article>()
                .eq(Article::getId, articleId)
                .set(Article::getToppingStat, stat));
    }

    public void toggleRecommend(Long articleId, Integer stat) {
        if (!UserContext.isAdmin()) throw new BizException(ErrorCode.FORBIDDEN);
        update(new LambdaUpdateWrapper<Article>()
                .eq(Article::getId, articleId)
                .set(Article::getRecommendStat, stat));
    }

    public void changeStatus(Long articleId, Integer status) {
        if (!UserContext.isAdmin()) throw new BizException(ErrorCode.FORBIDDEN);
        update(new LambdaUpdateWrapper<Article>()
                .eq(Article::getId, articleId)
                .set(Article::getStatus, status));
    }

    private ArticleVO toArticleVO(Article article) {
        ArticleVO vo = new ArticleVO();
        vo.setId(article.getId());
        vo.setUserId(article.getUserId());
        vo.setCategoryId(article.getCategoryId());
        vo.setTitle(article.getTitle());
        vo.setSummary(article.getSummary());
        vo.setCoverImage(article.getCoverImage());
        vo.setContent(article.getContent());
        vo.setSource(article.getSource());
        vo.setSourceUrl(article.getSourceUrl());
        vo.setStatus(article.getStatus());
        vo.setToppingStat(article.getToppingStat());
        vo.setRecommendStat(article.getRecommendStat());
        vo.setViewCount(article.getViewCount());
        vo.setLikeCount(article.getLikeCount());
        vo.setCommentCount(article.getCommentCount());
        vo.setCollectCount(article.getCollectCount());
        vo.setCreateTime(article.getCreateTime());
        vo.setUpdateTime(article.getUpdateTime());
        User author = userMapper.selectById(article.getUserId());
        if (author != null) {
            vo.setAuthorName(author.getNickname());
            vo.setAuthorAvatar(author.getAvatar());
        }
        Category category = categoryMapper.selectById(article.getCategoryId());
        if (category != null) {
            vo.setCategoryName(category.getName());
        }
        List<ArticleTag> articleTags = articleTagMapper.selectList(
                new LambdaQueryWrapper<ArticleTag>().eq(ArticleTag::getArticleId, article.getId()));
        if (!articleTags.isEmpty()) {
            List<Long> tagIds = articleTags.stream().map(ArticleTag::getTagId).collect(Collectors.toList());
            List<Tag> tags = tagMapper.selectBatchIds(tagIds);
            vo.setTags(tags.stream().map(t -> {
                TagVO tagVO = new TagVO();
                tagVO.setId(t.getId());
                tagVO.setName(t.getName());
                tagVO.setCategoryId(t.getCategoryId());
                return tagVO;
            }).collect(Collectors.toList()));
        }
        Long currentUserId = UserContext.getUserId();
        if (currentUserId != null) {
            UserLike like = userLikeMapper.selectOne(
                    new LambdaQueryWrapper<UserLike>()
                            .eq(UserLike::getUserId, currentUserId)
                            .eq(UserLike::getTargetId, article.getId())
                            .eq(UserLike::getTargetType, 1));
            vo.setLiked(like != null);
            UserCollect collect = userCollectMapper.selectOne(
                    new LambdaQueryWrapper<UserCollect>()
                            .eq(UserCollect::getUserId, currentUserId)
                            .eq(UserCollect::getArticleId, article.getId()));
            vo.setCollected(collect != null);
        } else {
            vo.setLiked(false);
            vo.setCollected(false);
        }
        return vo;
    }
}
