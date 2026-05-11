package com.campus.forum.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "ai.openai")
public class AiProperties {

    private String apiKey;
    private String baseUrl;
    private String modelName;
    private String imageModelName;
    private String imageSize;
    private boolean enabled;
}
