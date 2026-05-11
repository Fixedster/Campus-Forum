package com.campus.forum.dto;

import lombok.Data;

@Data
public class UserProfileDTO {
    private String nickname;
    private String avatar;
    private String bio;
    private String college;
    private String major;
    private String studentId;
    private String email;
}
