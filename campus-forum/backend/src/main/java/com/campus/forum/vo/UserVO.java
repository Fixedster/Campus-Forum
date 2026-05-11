package com.campus.forum.vo;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserVO {
    private Long id;
    private String username;
    private String nickname;
    private String avatar;
    private String bio;
    private String college;
    private String major;
    private String studentId;
    private String email;
    private Integer role;
    private Integer articleCount;
    private Integer followerCount;
    private Integer followingCount;
    private LocalDateTime createTime;
}
