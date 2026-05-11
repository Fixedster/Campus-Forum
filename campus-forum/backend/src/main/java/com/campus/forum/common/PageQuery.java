package com.campus.forum.common;

import com.baomidou.mybatisplus.core.metadata.IPage;

public class PageQuery {
    private Integer page = 1;
    private Integer size = 10;

    public Integer getPage() {
        return Math.max(page, 1);
    }

    public Integer getSize() {
        return Math.min(Math.max(size, 1), 50);
    }

    public <T> PageResult<T> toPageResult(IPage<T> page) {
        return PageResult.of(page.getTotal(), page.getCurrent(), page.getSize(), page.getRecords());
    }
}
