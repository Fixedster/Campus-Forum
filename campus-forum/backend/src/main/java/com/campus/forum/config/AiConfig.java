package com.campus.forum.config;

import dev.langchain4j.model.image.ImageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import dev.langchain4j.model.openai.OpenAiImageModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;

@Slf4j
@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "ai.openai", name = "enabled", havingValue = "true")
public class AiConfig {

    private final AiProperties aiProperties;

    @Bean
    public OpenAiChatModel openAiChatModel() {
        if (!StringUtils.hasText(aiProperties.getApiKey())) {
            log.warn("OpenAI API Key is not configured, AI chat functionality will not be available");
            return null;
        }
        return OpenAiChatModel.builder()
                .apiKey(aiProperties.getApiKey())
                .baseUrl(aiProperties.getBaseUrl())
                .modelName(aiProperties.getModelName())
                .logRequests(true)
                .logResponses(true)
                .build();
    }

    @Bean
    public ImageModel openAiImageModel() {
        if (!StringUtils.hasText(aiProperties.getApiKey())) {
            log.warn("OpenAI API Key is not configured, AI image generation will not be available");
            return null;
        }
        return OpenAiImageModel.builder()
                .apiKey(aiProperties.getApiKey())
                .baseUrl(aiProperties.getBaseUrl())
                .modelName(aiProperties.getImageModelName())
                .size(aiProperties.getImageSize())
                .build();
    }
}
