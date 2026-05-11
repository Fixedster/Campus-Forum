package com.campus.forum.controller;

import com.campus.forum.common.Result;
import com.campus.forum.config.AiProperties;
import com.campus.forum.security.RequireLogin;
import dev.langchain4j.model.image.ImageModel;
import dev.langchain4j.model.openai.OpenAiChatModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/ai")
public class AiController {

    @Autowired(required = false)
    @Nullable
    private OpenAiChatModel chatModel;

    @Autowired(required = false)
    @Nullable
    private ImageModel imageModel;

    private final AiProperties aiProperties;

    public AiController(AiProperties aiProperties) {
        this.aiProperties = aiProperties;
    }

    @PostMapping("/chat")
    @RequireLogin
    public Result<String> chat(@RequestBody Map<String, String> request) {
        if (chatModel == null) {
            return Result.error(503, "AI 服务未配置，请联系管理员设置 OpenAI API Key");
        }

        String message = request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return Result.error(400, "消息不能为空");
        }

        try {
            String response = chatModel.generate(message);
            return Result.success(response);
        } catch (Exception e) {
            log.error("AI chat error: {}", e.getMessage());
            return Result.error(500, "AI 服务暂时不可用，请稍后重试");
        }
    }

    @PostMapping("/generate-image")
    @RequireLogin
    public Result<String> generateImage(@RequestBody Map<String, String> request) {
        if (imageModel == null) {
            return Result.error(503, "AI 图像服务未配置，请联系管理员设置 OpenAI API Key");
        }

        String prompt = request.get("prompt");
        if (prompt == null || prompt.trim().isEmpty()) {
            return Result.error(400, "描述不能为空");
        }

        try {
            String imageUrl = imageModel.generate(prompt).content().url().toString();
            return Result.success(imageUrl);
        } catch (Exception e) {
            log.error("AI image generation error: {}", e.getMessage());
            return Result.error(500, "图像生成失败，请稍后重试");
        }
    }

    @PostMapping("/help-write")
    @RequireLogin
    public Result<String> helpWrite(@RequestBody Map<String, String> request) {
        if (chatModel == null) {
            return Result.error(503, "AI 服务未配置，请联系管理员设置 OpenAI API Key");
        }

        String topic = request.get("topic");
        String type = request.get("type");
        if (topic == null || topic.trim().isEmpty()) {
            return Result.error(400, "主题不能为空");
        }

        String prompt = String.format(
            "请帮我写一篇关于\"%s\"的技术文章。要求：\n" +
            "1. 文章类型：%s\n" +
            "2. 使用 Markdown 格式\n" +
            "3. 包含标题、正文内容\n" +
            "4. 语言简洁专业，适合技术社区\n" +
            "5. 字数在 800-1500 字之间",
            topic,
            type != null ? type : "技术分享"
        );

        try {
            String response = chatModel.generate(prompt);
            return Result.success(response);
        } catch (Exception e) {
            log.error("AI help write error: {}", e.getMessage());
            return Result.error(500, "AI 写作助手暂时不可用，请稍后重试");
        }
    }

    @GetMapping("/status")
    public Result<Map<String, Object>> status() {
        boolean chatAvailable = chatModel != null && aiProperties.isEnabled();
        boolean imageAvailable = imageModel != null && aiProperties.isEnabled();
        return Result.success(Map.of(
            "enabled", aiProperties.isEnabled(),
            "chatAvailable", chatAvailable,
            "imageAvailable", imageAvailable,
            "model", aiProperties.getModelName(),
            "imageModel", aiProperties.getImageModelName()
        ));
    }
}
