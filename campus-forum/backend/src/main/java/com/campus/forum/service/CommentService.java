package com.campus.forum.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.campus.forum.common.BizException;
import com.campus.forum.common.ErrorCode;
import com.campus.forum.dto.CommentDTO;
import com.campus.forum.entity.Article;
import com.campus.forum.entity.Comment;
import com.campus.forum.entity.Notification;
import com.campus.forum.entity.User;
import com.campus.forum.mapper.ArticleMapper;
import com.campus.forum.mapper.CommentMapper;
import com.campus.forum.mapper.NotificationMapper;
import com.campus.forum.mapper.UserMapper;
import com.campus.forum.security.UserContext;
import com.campus.forum.vo.CommentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService extends ServiceImpl<CommentMapper, Comment> {

    private final ArticleMapper articleMapper;
    private final UserMapper userMapper;
    private final NotificationMapper notificationMapper;

    public List<CommentVO> getArticleComments(Long articleId) {
        List<Comment> comments = list(new LambdaQueryWrapper<Comment>()
                .eq(Comment::getArticleId, articleId)
                .eq(Comment::getParentId, 0)
                .orderByDesc(Comment::getCreateTime));
        List<CommentVO> result = new ArrayList<>();
        for (Comment comment : comments) {
            CommentVO vo = toCommentVO(comment);
            List<Comment> children = list(new LambdaQueryWrapper<Comment>()
                    .eq(Comment::getArticleId, articleId)
                    .eq(Comment::getParentId, comment.getId())
                    .orderByAsc(Comment::getCreateTime));
            vo.setChildren(children.stream().map(this::toCommentVO).collect(Collectors.toList()));
            result.add(vo);
        }
        return result;
    }

    @Transactional
    public Long addComment(CommentDTO dto) {
        Long userId = UserContext.getUserId();
        Article article = articleMapper.selectById(dto.getArticleId());
        if (article == null) throw new BizException(ErrorCode.ARTICLE_NOT_FOUND);
        Comment comment = new Comment();
        comment.setArticleId(dto.getArticleId());
        comment.setUserId(userId);
        comment.setContent(dto.getContent());
        comment.setParentId(dto.getParentId() != null ? dto.getParentId() : 0);
        comment.setReplyUserId(dto.getReplyUserId() != null ? dto.getReplyUserId() : 0);
        comment.setLikeCount(0);
        save(comment);
        articleMapper.update(null, new LambdaUpdateWrapper<Article>()
                .eq(Article::getId, dto.getArticleId())
                .setSql("comment_count = comment_count + 1"));
        sendCommentNotification(article, userId, dto);
        return comment.getId();
    }

    @Async
    void sendCommentNotification(Article article, Long fromUserId, CommentDTO dto) {
        if (article.getUserId().equals(fromUserId)) return;
        Notification notification = new Notification();
        notification.setUserId(article.getUserId());
        notification.setFromUserId(fromUserId);
        notification.setTargetId(article.getId());
        if (dto.getParentId() != null && dto.getParentId() > 0) {
            notification.setType(2);
            notification.setContent("回复了你的评论");
            Comment parent = getById(dto.getParentId());
            if (parent != null && !parent.getUserId().equals(fromUserId)) {
                Notification replyNotify = new Notification();
                replyNotify.setUserId(parent.getUserId());
                replyNotify.setFromUserId(fromUserId);
                replyNotify.setTargetId(article.getId());
                replyNotify.setType(2);
                replyNotify.setContent("回复了你的评论");
                replyNotify.setIsRead(0);
                notificationMapper.insert(replyNotify);
            }
        } else {
            notification.setType(1);
            notification.setContent("评论了你的文章");
        }
        notification.setIsRead(0);
        notificationMapper.insert(notification);
    }

    public void deleteComment(Long commentId) {
        Comment comment = getById(commentId);
        if (comment == null) throw new BizException(ErrorCode.COMMENT_NOT_FOUND);
        Long userId = UserContext.getUserId();
        if (!comment.getUserId().equals(userId) && !UserContext.isAdmin()) {
            throw new BizException(ErrorCode.FORBIDDEN);
        }
        removeById(commentId);
        articleMapper.update(null, new LambdaUpdateWrapper<Article>()
                .eq(Article::getId, comment.getArticleId())
                .setSql("comment_count = GREATEST(comment_count - 1, 0)"));
    }

    private CommentVO toCommentVO(Comment comment) {
        CommentVO vo = new CommentVO();
        vo.setId(comment.getId());
        vo.setArticleId(comment.getArticleId());
        vo.setUserId(comment.getUserId());
        vo.setContent(comment.getContent());
        vo.setParentId(comment.getParentId());
        vo.setReplyUserId(comment.getReplyUserId());
        vo.setLikeCount(comment.getLikeCount());
        vo.setCreateTime(comment.getCreateTime());
        User user = userMapper.selectById(comment.getUserId());
        if (user != null) {
            vo.setUserName(user.getNickname());
            vo.setUserAvatar(user.getAvatar());
        }
        if (comment.getReplyUserId() != null && comment.getReplyUserId() > 0) {
            User replyUser = userMapper.selectById(comment.getReplyUserId());
            if (replyUser != null) vo.setReplyUserName(replyUser.getNickname());
        }
        vo.setLiked(false);
        vo.setChildren(Collections.emptyList());
        return vo;
    }
}
