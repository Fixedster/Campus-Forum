package com.campus.forum.common;

import lombok.Data;

import java.util.List;

@Data
public class PageResult<T> {
    private long total;
    private long page;
    private long size;
    private long pages;
    private List<T> list;

    public static <T> PageResult<T> of(long total, long page, long size, List<T> list) {
        PageResult<T> result = new PageResult<>();
        result.setTotal(total);
        result.setPage(page);
        result.setSize(size);
        result.setPages((total + size - 1) / size);
        result.setList(list);
        return result;
    }
}
