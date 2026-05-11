package com.campus.forum.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.forum.common.PageResult;
import com.campus.forum.dto.ArticleQueryDTO;
import com.campus.forum.dto.ConfigDTO;
import com.campus.forum.entity.*;
import com.campus.forum.mapper.*;
import com.campus.forum.vo.ArticleVO;
import com.campus.forum.vo.DashboardVO;
import com.campus.forum.vo.UserVO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserMapper userMapper;
    private final ArticleMapper articleMapper;
    private final CommentMapper commentMapper;
    private final CategoryMapper categoryMapper;
    private final GlobalConfigMapper globalConfigMapper;
    private final StringRedisTemplate redisTemplate;

    public DashboardVO getDashboard() {
        DashboardVO vo = new DashboardVO();
        vo.setTotalUsers(userMapper.selectCount(null));
        vo.setTotalArticles(articleMapper.selectCount(null));
        vo.setTotalComments(commentMapper.selectCount(null));
        LocalDateTime todayStart = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        vo.setTodayNewUsers(userMapper.selectCount(
                new LambdaQueryWrapper<User>().ge(User::getCreateTime, todayStart)));
        vo.setTodayNewArticles(articleMapper.selectCount(
                new LambdaQueryWrapper<Article>().ge(Article::getCreateTime, todayStart)));
        List<Category> categories = categoryMapper.selectList(
                new LambdaQueryWrapper<Category>().eq(Category::getStatus, 1));
        Map<String, Long> categoryCount = new HashMap<>();
        for (Category cat : categories) {
            Long count = articleMapper.selectCount(
                    new LambdaQueryWrapper<Article>()
                            .eq(Article::getCategoryId, cat.getId())
                            .eq(Article::getStatus, 1));
            categoryCount.put(cat.getName(), count);
        }
        vo.setCategoryArticleCount(categoryCount);
        return vo;
    }

    public PageResult<UserVO> listUsers(int page, int size) {
        Page<User> userPage = userMapper.selectPage(new Page<>(page, size),
                new LambdaQueryWrapper<User>().orderByDesc(User::getCreateTime));
        List<UserVO> voList = userPage.getRecords().stream().map(user -> {
            UserVO vo = new UserVO();
            vo.setId(user.getId());
            vo.setUsername(user.getUsername());
            vo.setNickname(user.getNickname());
            vo.setEmail(user.getEmail());
            vo.setRole(user.getRole());
            vo.setCreateTime(user.getCreateTime());
            return vo;
        }).collect(Collectors.toList());
        return PageResult.of(userPage.getTotal(), userPage.getCurrent(), userPage.getSize(), voList);
    }

    public void changeUserRole(Long userId, Integer role) {
        User user = userMapper.selectById(userId);
        if (user == null) return;
        user.setRole(role);
        userMapper.updateById(user);
    }

    public void changeUserStatus(Long userId, Integer status) {
        User user = userMapper.selectById(userId);
        if (user == null) return;
        user.setStatus(status);
        userMapper.updateById(user);
    }

    public PageResult<ArticleVO> listAllArticles(ArticleQueryDTO query) {
        LambdaQueryWrapper<Article> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(query.getKeyword())) {
            wrapper.like(Article::getTitle, query.getKeyword());
        }
        if (query.getCategoryId() != null && query.getCategoryId() > 0) {
            wrapper.eq(Article::getCategoryId, query.getCategoryId());
        }
        wrapper.orderByDesc(Article::getCreateTime);
        Page<Article> page = articleMapper.selectPage(
                new Page<>(query.getPage(), query.getSize()), wrapper);
        List<ArticleVO> voList = page.getRecords().stream().map(article -> {
            ArticleVO vo = new ArticleVO();
            vo.setId(article.getId());
            vo.setTitle(article.getTitle());
            vo.setStatus(article.getStatus());
            vo.setCreateTime(article.getCreateTime());
            User author = userMapper.selectById(article.getUserId());
            if (author != null) vo.setAuthorName(author.getNickname());
            return vo;
        }).collect(Collectors.toList());
        return PageResult.of(page.getTotal(), page.getCurrent(), page.getSize(), voList);
    }

    public Map<String, String> getAllConfigs() {
        List<GlobalConfig> configs = globalConfigMapper.selectList(null);
        Map<String, String> map = new HashMap<>();
        for (GlobalConfig config : configs) {
            map.put(config.getConfigKey(), config.getConfigValue());
        }
        return map;
    }

    public void updateConfig(ConfigDTO dto) {
        GlobalConfig config = globalConfigMapper.selectOne(
                new LambdaQueryWrapper<GlobalConfig>().eq(GlobalConfig::getConfigKey, dto.getConfigKey()));
        if (config != null) {
            config.setConfigValue(dto.getConfigValue());
            globalConfigMapper.updateById(config);
        } else {
            config = new GlobalConfig();
            config.setConfigKey(dto.getConfigKey());
            config.setConfigValue(dto.getConfigValue());
            config.setComment(dto.getComment());
            globalConfigMapper.insert(config);
        }
        redisTemplate.delete("config:" + dto.getConfigKey());
    }

    public String getConfigValue(String key) {
        String cacheKey = "config:" + key;
        String value = redisTemplate.opsForValue().get(cacheKey);
        if (value != null) return value;
        GlobalConfig config = globalConfigMapper.selectOne(
                new LambdaQueryWrapper<GlobalConfig>().eq(GlobalConfig::getConfigKey, key));
        if (config != null) {
            redisTemplate.opsForValue().set(cacheKey, config.getConfigValue());
            return config.getConfigValue();
        }
        return null;
    }
}
