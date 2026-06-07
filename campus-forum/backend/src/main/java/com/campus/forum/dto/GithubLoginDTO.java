package com.campus.forum.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class GithubLoginDTO {
    @NotBlank(message = "授权码不能为空")
    private String code;
}
