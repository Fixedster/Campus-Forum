package com.campus.forum;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableAsync
@EnableScheduling
@MapperScan("com.campus.forum.mapper")
@SpringBootApplication
public class CampusForumApplication {
    public static void main(String[] args) {
        SpringApplication.run(CampusForumApplication.class, args);
    }
}
