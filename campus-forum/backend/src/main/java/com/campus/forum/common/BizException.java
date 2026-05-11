package com.campus.forum.common;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BizException extends RuntimeException {
    private final int code;
    private final String message;

    public BizException(ErrorCode errorCode) {
        this.code = errorCode.getCode();
        this.message = errorCode.getMessage();
    }

    public BizException(ErrorCode errorCode, String message) {
        this.code = errorCode.getCode();
        this.message = message;
    }
}
