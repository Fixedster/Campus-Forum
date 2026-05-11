package com.campus.forum.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    SUCCESS(200, "操作成功"),
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未登录或登录已过期"),
    FORBIDDEN(403, "无权限访问"),
    NOT_FOUND(404, "资源不存在"),
    INTERNAL_ERROR(500, "服务器内部错误"),

    USER_NOT_FOUND(1001, "用户不存在"),
    USER_ALREADY_EXISTS(1002, "用户名已存在"),
    PASSWORD_ERROR(1003, "密码错误"),
    USER_DISABLED(1004, "用户已被禁用"),

    ARTICLE_NOT_FOUND(2001, "文章不存在"),
    ARTICLE_ALREADY_PUBLISHED(2002, "文章已发布"),

    COMMENT_NOT_FOUND(3001, "评论不存在"),

    PARAM_ERROR(4001, "参数错误"),
    DATA_NOT_EXIST(4002, "数据不存在");

    private final int code;
    private final String message;
}
