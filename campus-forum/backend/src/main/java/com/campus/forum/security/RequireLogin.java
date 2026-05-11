package com.campus.forum.security;

import com.campus.forum.common.BizException;
import com.campus.forum.common.ErrorCode;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequireLogin {
}
