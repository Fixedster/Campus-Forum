CREATE DATABASE IF NOT EXISTS `campus_forum` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `campus_forum`;

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `username` varchar(64) NOT NULL DEFAULT '' COMMENT '用户名',
    `password` varchar(128) NOT NULL DEFAULT '' COMMENT '密码',
    `email` varchar(100) NOT NULL DEFAULT '' COMMENT '邮箱',
    `avatar` varchar(256) NOT NULL DEFAULT '' COMMENT '头像URL',
    `nickname` varchar(64) NOT NULL DEFAULT '' COMMENT '昵称',
    `bio` varchar(300) NOT NULL DEFAULT '' COMMENT '个人简介',
    `college` varchar(100) NOT NULL DEFAULT '' COMMENT '学院',
    `major` varchar(100) NOT NULL DEFAULT '' COMMENT '专业',
    `student_id` varchar(50) NOT NULL DEFAULT '' COMMENT '学号',
    `github_id` varchar(64) DEFAULT NULL COMMENT 'GitHub用户ID',
    `role` tinyint NOT NULL DEFAULT 0 COMMENT '角色：0-普通用户 1-管理员 2-超级管理员',
    `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-正常',
    `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_username` (`username`),
    KEY `idx_email` (`email`),
    KEY `idx_github_id` (`github_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户表';

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `name` varchar(64) NOT NULL DEFAULT '' COMMENT '分类名称',
    `icon` varchar(128) NOT NULL DEFAULT '' COMMENT '图标',
    `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
    `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='分类表';

INSERT INTO `category` (`name`, `sort`, `status`) VALUES
('全部', 0, 1),
('前端开发', 1, 1),
('后端开发', 2, 1),
('人工智能', 3, 1),
('移动开发', 4, 1),
('数据科学', 5, 1),
('运维部署', 6, 1),
('开源项目', 7, 1);

DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `name` varchar(64) NOT NULL DEFAULT '' COMMENT '标签名称',
    `category_id` int unsigned NOT NULL DEFAULT 0 COMMENT '所属分类ID',
    `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：0-禁用 1-启用',
    `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='标签表';

INSERT INTO `tag` (`name`, `category_id`, `status`) VALUES
('React', 2, 1), ('Vue', 2, 1), ('TypeScript', 2, 1), ('CSS', 2, 1),
('Java', 3, 1), ('Spring Boot', 3, 1), ('MySQL', 3, 1), ('Redis', 3, 1),
('PyTorch', 4, 1), ('LLM', 4, 1), ('机器学习', 4, 1),
('Android', 5, 1), ('Flutter', 5, 1),
('Docker', 7, 1), ('Kubernetes', 7, 1), ('Nginx', 7, 1);

DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` int unsigned NOT NULL DEFAULT 0 COMMENT '作者ID',
    `category_id` int unsigned NOT NULL DEFAULT 0 COMMENT '分类ID',
    `title` varchar(120) NOT NULL DEFAULT '' COMMENT '文章标题',
    `summary` varchar(300) NOT NULL DEFAULT '' COMMENT '文章摘要',
    `cover_image` varchar(256) NOT NULL DEFAULT '' COMMENT '封面图',
    `content` longtext COMMENT '文章内容(Markdown)',
    `content_html` longtext COMMENT '文章内容(HTML)',
    `source` tinyint NOT NULL DEFAULT 2 COMMENT '来源：1-转载 2-原创 3-翻译',
    `source_url` varchar(256) NOT NULL DEFAULT '' COMMENT '原文链接',
    `status` tinyint NOT NULL DEFAULT 0 COMMENT '状态：0-草稿 1-已发布 2-审核中 3-已下架',
    `topping_stat` tinyint NOT NULL DEFAULT 0 COMMENT '置顶：0-否 1-是',
    `recommend_stat` tinyint NOT NULL DEFAULT 0 COMMENT '加精：0-否 1-是',
    `view_count` int unsigned NOT NULL DEFAULT 0 COMMENT '浏览数',
    `like_count` int unsigned NOT NULL DEFAULT 0 COMMENT '点赞数',
    `comment_count` int unsigned NOT NULL DEFAULT 0 COMMENT '评论数',
    `collect_count` int unsigned NOT NULL DEFAULT 0 COMMENT '收藏数',
    `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_category_id` (`category_id`),
    KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='文章表';

DROP TABLE IF EXISTS `article_tag`;
CREATE TABLE `article_tag` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `article_id` int unsigned NOT NULL DEFAULT 0 COMMENT '文章ID',
    `tag_id` int unsigned NOT NULL DEFAULT 0 COMMENT '标签ID',
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_article_id` (`article_id`),
    KEY `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='文章标签关联表';

DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `article_id` int unsigned NOT NULL DEFAULT 0 COMMENT '文章ID',
    `user_id` int unsigned NOT NULL DEFAULT 0 COMMENT '评论者ID',
    `content` varchar(1000) NOT NULL DEFAULT '' COMMENT '评论内容',
    `parent_id` int unsigned NOT NULL DEFAULT 0 COMMENT '父评论ID',
    `reply_user_id` int unsigned NOT NULL DEFAULT 0 COMMENT '被回复者ID',
    `like_count` int unsigned NOT NULL DEFAULT 0 COMMENT '点赞数',
    `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_article_id` (`article_id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_parent_id` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='评论表';

DROP TABLE IF EXISTS `user_like`;
CREATE TABLE `user_like` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` int unsigned NOT NULL DEFAULT 0 COMMENT '用户ID',
    `target_id` int unsigned NOT NULL DEFAULT 0 COMMENT '目标ID',
    `target_type` tinyint NOT NULL DEFAULT 1 COMMENT '类型：1-文章 2-评论',
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_target` (`user_id`, `target_id`, `target_type`),
    KEY `idx_target` (`target_id`, `target_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户点赞表';

DROP TABLE IF EXISTS `user_collect`;
CREATE TABLE `user_collect` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` int unsigned NOT NULL DEFAULT 0 COMMENT '用户ID',
    `article_id` int unsigned NOT NULL DEFAULT 0 COMMENT '文章ID',
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_article` (`user_id`, `article_id`),
    KEY `idx_article_id` (`article_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户收藏表';

DROP TABLE IF EXISTS `user_follow`;
CREATE TABLE `user_follow` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` int unsigned NOT NULL DEFAULT 0 COMMENT '用户ID',
    `follow_user_id` int unsigned NOT NULL DEFAULT 0 COMMENT '被关注者ID',
    `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态：0-取消关注 1-已关注',
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_user_follow` (`user_id`, `follow_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户关注表';

DROP TABLE IF EXISTS `notification`;
CREATE TABLE `notification` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `user_id` int unsigned NOT NULL DEFAULT 0 COMMENT '接收者ID',
    `from_user_id` int unsigned NOT NULL DEFAULT 0 COMMENT '发送者ID',
    `type` tinyint NOT NULL DEFAULT 0 COMMENT '类型：1-评论 2-回复 3-点赞 4-关注 5-系统',
    `target_id` int unsigned NOT NULL DEFAULT 0 COMMENT '关联目标ID',
    `content` varchar(500) NOT NULL DEFAULT '' COMMENT '通知内容',
    `is_read` tinyint NOT NULL DEFAULT 0 COMMENT '已读：0-未读 1-已读',
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='消息通知表';

DROP TABLE IF EXISTS `global_config`;
CREATE TABLE `global_config` (
    `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `config_key` varchar(128) NOT NULL DEFAULT '' COMMENT '配置Key',
    `config_value` varchar(1024) NOT NULL DEFAULT '' COMMENT '配置Value',
    `comment` varchar(256) NOT NULL DEFAULT '' COMMENT '备注',
    `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除',
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='全局配置表';

INSERT INTO `global_config` (`config_key`, `config_value`, `comment`) VALUES
('site_name', 'Campus Forum', '站点名称'),
('site_description', '校园技术交流论坛', '站点描述'),
('allow_register', 'true', '是否允许注册'),
('article_review', 'false', '文章是否需要审核');

INSERT INTO `user` (`username`, `password`, `email`, `nickname`, `bio`, `college`, `major`, `role`, `status`) VALUES
('admin', '$2a$10$dXJ3SW6G7P50lGmMQOlNnuGLvNA6Yj3Xjt6gX7gV4zLQgysLzvJga', 'admin@campus.com', '管理员', '热爱技术，专注于全栈开发', '计算机学院', '软件工程', 2, 1),
('user1', '$2a$10$dXJ3SW6G7P50lGmMQOlNnuGLvNA6Yj3Xjt6gX7gV4zLQgysLzvJga', 'user1@campus.com', '前端开发者', 'React/Vue/TypeScript', '信息工程学院', '计算机科学与技术', 0, 1),
('user2', '$2a$10$dXJ3SW6G7P50lGmMQOlNnuGLvNA6Yj3Xjt6gX7gV4zLQgysLzvJga', 'user2@campus.com', '后端工程师', 'Java/Spring Boot/MySQL', '软件学院', '软件工程', 0, 1),
('user3', '$2a$10$dXJ3SW6G7P50lGmMQOlNnuGLvNA6Yj3Xjt6gX7gV4zLQgysLzvJga', 'user3@campus.com', 'AI研究员', '机器学习/深度学习/PyTorch', '人工智能学院', '人工智能', 0, 1),
('user4', '$2a$10$dXJ3SW6G7P50lGmMQOlNnuGLvNA6Yj3Xjt6gX7gV4zLQgysLzvJga', 'user4@campus.com', '运维工程师', 'Docker/K8s/Redis', '计算机学院', '网络工程', 0, 1);

-- 插入文章
INSERT INTO `article` (`user_id`, `category_id`, `title`, `summary`, `content`, `content_html`, `source`, `status`, `topping_stat`, `recommend_stat`, `view_count`, `like_count`, `comment_count`, `collect_count`) VALUES
-- 管理员发布的文章
(1, 3, 'Spring Boot 3.2 实战系列：JWT 双 Token 认证详解', '本文详细讲解了如何使用 Spring Boot 3.2 实现 JWT 双 Token 认证机制，包括 Access Token 和 Refresh Token 的生成、验证和刷新流程。', '# Spring Boot 3.2 JWT 双 Token 认证实战\n\n## 前言\n\n在现代 Web 应用中，JWT (JSON Web Token) 已成为主流的身份认证方案。本文将详细介绍如何在 Spring Boot 3.2 中实现双 Token 认证机制。\n\n## 什么是双 Token 机制？\n\n双 Token 机制包含：\n\n1. **Access Token**：短期令牌，用于接口访问验证\n2. **Refresh Token**：长期令牌，用于刷新 Access Token\n\n## 核心实现\n\n### 1. Token 生成\n\n```java\npublic Map<String, String> generateTokens(User user) {\n    String accessToken = JwtUtil.generateAccessToken(user.getId());\n    String refreshToken = JwtUtil.generateRefreshToken(user.getId());\n    \n    return Map.of(\n        "accessToken", accessToken,\n        "refreshToken", refreshToken\n    );\n}\n```\n\n### 2. Token 验证\n\n```java\npublic boolean validateToken(String token) {\n    try {\n        JwtUtil.parseToken(token);\n        // 检查 Redis 黑名单\n        return !redisTemplate.hasKey("token:blacklist:" + token);\n    } catch (Exception e) {\n        return false;\n    }\n}\n```\n\n## 总结\n\n双 Token 机制可以有效提升应用安全性，建议在生产环境中使用。', '<h1>Spring Boot 3.2 JWT 双 Token 认证实战</h1>', 2, 1, 1, 1, 1523, 89, 23, 45),

(1, 3, 'MyBatis-Plus 3.5 高级特性：逻辑删除与自动填充', 'MyBatis-Plus 提供了强大的逻辑删除和自动填充功能，本文通过实例详细讲解其配置和使用方法。', '# MyBatis-Plus 逻辑删除与自动填充\n\n## 逻辑删除配置\n\n在 application.yml 中配置：\n\n```yaml\nmybatis-plus:\n  global-config:\n    db-config:\n      logic-delete-field: deleted\n      logic-delete-value: 1\n      logic-not-delete-value: 0\n```\n\n## 自动填充\n\n实现 MetaObjectHandler 接口：\n\n```java\n@Component\npublic class MyMetaObjectHandler implements MetaObjectHandler {\n    \n    @Override\n    public void insertFill(MetaObject metaObject) {\n        this.strictInsertFill(metaObject, "createTime", LocalDateTime.class, LocalDateTime.now());\n    }\n    \n    @Override\n    public void updateFill(MetaObject metaObject) {\n        this.strictUpdateFill(metaObject, "updateTime", LocalDateTime.class, LocalDateTime.now());\n    }\n}\n```\n\n## 注意事项\n\n- 逻辑删除仅对自动注入的 SQL 生效\n- 自定义 SQL 需要手动添加删除条件', '<h1>MyBatis-Plus 逻辑删除与自动填充</h1>', 2, 1, 0, 1, 856, 42, 12, 18),

-- user1 发布的文章
(2, 2, 'React 18 新特性深度解析：Concurrent Mode 实战', 'React 18 带来了全新的 Concurrent Mode，本文深入解析了其核心概念和实际应用。', '# React 18 新特性深度解析\n\n## Concurrent Mode 核心特性\n\n### 1. automatic batching\n\nReact 18 自动批处理所有状态更新，即使在 setTimeout、Promise 中：\n\n```jsx\nsetTimeout(() => {\n  setCount(c => c + 1);\n  setFlag(f => !f);\n  // 只触发一次渲染\n}, 0);\n```\n\n### 2. useTransition\n\n用于标记非紧急更新：\n\n```jsx\nimport { useTransition } from \"react\";\n\nfunction App() {\n  const [isPending, startTransition] = useTransition();\n  \n  function handleClick() {\n    startTransition(() => {\n      setCount(count + 1);\n    });\n  }\n}\n```\n\n### 3. Suspense\n\n数据获取和代码分割的最佳伴侣。\n\n## 迁移建议\n\n1. 先升级到 React 18\n2. 移除遗留的 Strict Mode 代码\n3. 测试并发特性', '<h1>React 18 新特性深度解析</h1>', 2, 1, 1, 1, 2341, 156, 45, 78),

(2, 2, 'TypeScript 5.0 装饰器：完整指南与实战', 'TypeScript 5.0 正式支持装饰器语法，本文详解装饰器的使用方法及最佳实践。', '# TypeScript 5.0 装饰器指南\n\n## 装饰器基础\n\n```typescript\nfunction logged(target: any, methodName: string, descriptor: PropertyDescriptor) {\n  const original = descriptor.value;\n  descriptor.value = function(...args: any[]) {\n    console.log(`Calling ${methodName}`);\n    return original.apply(this, args);\n  };\n  return descriptor;\n}\n\nclass Calculator {\n  @logged\n  add(a: number, b: number) {\n    return a + b;\n  }\n}\n```\n\n## 装饰器组合\n\n多个装饰器从下到上执行：\n\n```typescript\n@decorator1\n@decorator2\nclass MyClass {}\n```\n\n## 实战场景\n\n- 日志记录\n- 权限验证\n- 性能监控\n- 缓存处理', '<h1>TypeScript 5.0 装饰器指南</h1>', 2, 1, 0, 1, 1234, 67, 19, 34),

(2, 2, 'Vue 3 Composition API 最佳实践', '深入讲解 Vue 3 Composition API 的使用方法、代码组织方式和性能优化技巧。', '# Vue 3 Composition API 最佳实践\n\n## 为什么使用 Composition API？\n\n1. 更好的逻辑复用\n2. 更灵活的代码组织\n3. 更好的 TypeScript 支持\n\n## 核心概念\n\n### setup() 函数\n\n```vue\n<script setup>\nimport { ref, computed, onMounted } from \"vue\";\n\nconst count = ref(0);\nconst doubled = computed(() => count.value * 2);\n\nonMounted(() => {\n  console.log(\"Component mounted\");\n});\n</script>\n```\n\n### Composables\n\n将逻辑抽离到可复用的函数中：\n\n```typescript\n// useCounter.js\nexport function useCounter() {\n  const count = ref(0);\n  const increment = () => count.value++;\n  return { count, increment };\n}\n```', '<h1>Vue 3 Composition API 最佳实践</h1>', 2, 1, 0, 1, 987, 54, 21, 29),

-- user2 发布的文章
(3, 3, 'Redis 7.0 新特性一览：Redis Functions 与 ACL v2', 'Redis 7.0 带来了许多激动人心的新特性，本文详细介绍 Redis Functions 和 ACL v2 的使用方法。', '# Redis 7.0 新特性一览\n\n## Redis Functions\n\nRedis 7.0 引入了全新的 Functions 概念，允许在 Redis 中执行 Lua 脚本：\n\n```redis\n# 定义函数\nRedis.register_function({\n  redis_function_based_function = function(keys, args)\n    return \"Hello, \" .. args[1]\n  end,\n  flags = { \"no-writes\" }\n});\n\n# 调用函数\nFCALL my_function 0 \"World\"\n```\n\n## ACL v2\n\n更细粒度的权限控制：\n\n```redis\nACL SETUSER alice ON >password ~cached:* &get +get ~articles:* ON\n```\n\n## 其他新特性\n\n- Sharded Pub/Sub\n- Improved Latency\n- 多集群代理\n\n## 升级建议\n\n生产环境升级前请充分测试！', '<h1>Redis 7.0 新特性一览</h1>', 2, 1, 0, 0, 756, 38, 11, 22),

(3, 3, 'Docker Compose 实战：搭建高可用 MySQL 主从复制', '本文详细介绍如何使用 Docker Compose 搭建 MySQL 主从复制架构，包含完整的配置文件示例。', '# Docker Compose 搭建 MySQL 主从复制\n\n## 架构说明\n\n```\n┌─────────────┐\n│   Master    │\n│  (写操作)   │\n└──────┬──────┘\n       │\n       ▼\n┌─────────────┐\n│   Slave 1   │\n│  (读操作)   │\n└─────────────┘\n```\n\n## docker-compose.yml\n\n```yaml\nversion: \"3.8\"\nservices:\n  mysql-master:\n    image: mysql:8.0\n    environment:\n      MYSQL_ROOT_PASSWORD: root123\n    volumes:\n      - ./master/data:/var/lib/mysql\n      - ./master/conf:/etc/mysql/conf.d\n\n  mysql-slave:\n    image: mysql:8.0\n    environment:\n      MYSQL_ROOT_PASSWORD: root123\n    volumes:\n      - ./slave/data:/var/lib/mysql\n      - ./slave/conf:/etc/mysql/conf.d\n```\n\n## 主从配置\n\n在 master 的 my.cnf 中添加：\n\n```ini\nserver-id=1\nlog-bin=mysql-bin\n```\n\n在 slave 中配置：\n\n```sql\nCHANGE MASTER TO\n  MASTER_HOST=\"mysql-master\",\n  MASTER_USER=\"replica\",\n  MASTER_PASSWORD=\"password\";\n```', '<h1>Docker Compose 搭建 MySQL 主从复制</h1>', 2, 1, 0, 0, 1123, 56, 17, 33),

(3, 3, 'Java 17 新特性：密封类与模式匹配完全指南', 'Java 17 引入了密封类和模式匹配等重要特性，本文通过实例讲解其使用方法。', '# Java 17 新特性完全指南\n\n## 密封类 (Sealed Classes)\n\n限制类的继承层次：\n\n```java\npublic sealed class Shape permits Circle, Rectangle, Square {\n}\n\npublic final class Circle extends Shape {\n}\n\npublic non-sealed class Rectangle extends Shape {\n}\n\npublic sealed class Square extends Shape permits SmallSquare {\n}\n```\n\n## 模式匹配 (Pattern Matching)\n\n### 类型模式匹配\n\n```java\nstatic String formatter(Object obj) {\n    return switch (obj) {\n        case Integer i -> String.format(\"int %d\", i);\n        case String s -> String.format(\"String %s\", s);\n        case null, default -> \"unknown\";\n    };\n}\n```\n\n## 最佳实践\n\n1. 优先使用密封类限制继承\n2. 结合模式匹配简化代码\n3. 使用 record 提高不可变数据类的编写效率', '<h1>Java 17 新特性完全指南</h1>', 2, 1, 0, 0, 678, 45, 14, 21),

-- user3 发布的文章
(4, 4, 'PyTorch 2.0 编译优化：torch.compile 实战指南', 'PyTorch 2.0 的 torch.compile 带来了显著的性能提升，本文详解其使用方法和新编译器后端。', '# PyTorch 2.0 torch.compile 实战指南\n\n## torch.compile 简介\n\ntorch.compile 将 PyTorch 代码编译成优化后的图：\n\n```python\nimport torch\n\n@torch.compile\ndef forward(x):\n    return x.sin() + x.cos()\n\nmodel = MyModel()\ncompiled_model = torch.compile(model)\n```\n\n## 编译模式\n\n```python\n# default 模式\nmodel = torch.compile(model)\n\n# reduce-overhead 减少开销\nmodel = torch.compile(model, mode=\"reduce-overhead\")\n\n# max-autotune 最大性能\nmodel = torch.compile(model, mode=\"max-autotune\")\n```\n\n## 性能对比\n\n| 模式 | 加速比 |\n|------|--------|\n| eager | 1x |\n| default | 1.5x |\n| max-autotune | 2.3x |\n\n## 注意事项\n\n- 部分动态操作可能不兼容\n- 首次编译有开销', '<h1>PyTorch 2.0 torch.compile 实战指南</h1>', 2, 1, 1, 1, 1892, 112, 38, 56),

(4, 4, '大语言模型微调实战：LoRA 原理与实现', '本文详细介绍 LoRA (Low-Rank Adaptation) 的核心原理，并通过实际案例展示如何在 LLM 上应用 LoRA 进行微调。', '# LoRA 原理与实现\n\n## 为什么需要 LoRA？\n\n全参数微调需要大量 GPU 资源，LoRA 通过冻结预训练模型权重，只训练少量低秩矩阵来大幅降低计算成本。\n\n## 核心原理\n\nLoRA 对 Transformer 的注意力权重进行分解：\n\n```python\n# 原始权重更新\n# W = W + ΔW\n\n# LoRA 低秩分解\n# ΔW = B * A\n# 其中 B ∈ R^(d×r), A ∈ R^(r×k), r << min(d,k)\n```\n\n## PyTorch 实现\n\n```python\nclass LoRALinear(nn.Module):\n    def __init__(self, in_features, out_features, rank=4):\n        super().__init__()\n        self.weight = nn.Parameter(torch.randn(out_features, in_features))\n        self.lora_A = nn.Parameter(torch.randn(rank, in_features))\n        self.lora_B = nn.Parameter(torch.zeros(out_features, rank))\n    \n    def forward(self, x):\n        return F.linear(x, self.weight) + F.linear(x, self.lora_B @ self.lora_A)\n```\n\n## 训练技巧\n\n1. rank 从 4-8 开始调\n2. 目标模块选择 attention\n3. 学习率可适当提高', '<h1>LoRA 原理与实现</h1>', 2, 1, 0, 1, 2156, 134, 42, 67),

(4, 4, 'RAG 系统构建：向量数据库与语义搜索实战', 'Retrieval Augmented Generation 是当前热门的 LLM 应用架构，本文手把手教你构建一个完整的 RAG 系统。', '# RAG 系统构建实战\n\n## RAG 架构\n\n```\n┌──────────┐    ┌─────────────┐    ┌──────────┐\n│  Document│───▶│ Embedding   │───▶│ Vector   │\n│  Loader  │    │  Model      │    │  Store   │\n└──────────┘    └─────────────┘    └──────────┘\n                                       │\n                                       ▼\n┌──────────┐    ┌─────────────┐    ┌──────────┐\n│  LLM     │◀───│   Prompt    │◀───│ Retrieval│\n│  Output  │    │  Template   │    │  Query   │\n└──────────┘    └─────────────┘    └──────────┘\n```\n\n## 核心代码\n\n### 文档向量化\n\n```python\nfrom langchain.embeddings import OpenAIEmbeddings\nfrom langchain.vectorstores import Chroma\n\nembeddings = OpenAIEmbeddings()\nvectorstore = Chroma.from_documents(documents, embeddings)\n```\n\n### 语义检索\n\n```python\nresults = vectorstore.similarity_search(query, k=5)\ncontext = \"\\n\".join([doc.page_content for doc in results])\n```\n\n## 向量数据库选择\n\n| 数据库 | 适用场景 |\n|--------|----------|\n| Chroma | 轻量级 Demo |\n| Milvus | 生产级大规模 |\n| Pinecone | 云原生 |\n\n## 优化策略\n\n1. chunk_size 调优\n2. 重排序 (Rerank)\n3. 混合检索', '<h1>RAG 系统构建实战</h1>', 2, 1, 0, 1, 1678, 98, 31, 48),

-- user4 发布的文章
(5, 7, 'Kubernetes 1.28 高可用集群搭建实战', '本文详细介绍如何使用 kubeadm 在生产环境搭建高可用的 Kubernetes 集群，包含完整的配置步骤。', '# Kubernetes 高可用集群搭建\n\n## 集群架构\n\n```\n┌─────────────────────────────────────────┐\n│              Load Balancer              │\n└──────────────┬──────────────────────────┘\n               │\n    ┌──────────┴──────────┐\n    ▼                     ▼\n┌────────┐           ┌────────┐\n│Control │           │Control │\n│Plane 1 │           │Plane 2 │\n└────────┘           └────────┘\n    │                     │\n    └──────────┬──────────┘\n               │\n    ┌──────────┴──────────┐\n    ▼                     ▼\n┌────────┐           ┌────────┐\n│ Worker │           │ Worker │\n│ Node 1 │           │ Node 2 │\n└────────┘           └────────┘\n```\n\n## 环境准备\n\n```bash\n# 所有节点执行\nsudo hostnamectl set-hostname k8s-master-1\n\n# 关闭 swap\nsudo swapoff -a\nsudo sed -i \"/ swap /s/^/#/\" /etc/fstab\n\n# 加载内核模块\ncat <<EOF | sudo tee /etc/modules-load.d/k8s.conf\noverlay\nbr_netfilter\nEOF\n\nsudo modprobe overlay\nsudo modprobe br_netfilter\n```\n\n## 安装 kubeadm\n\n```bash\nsudo apt-get update\nsudo apt-get install -y kubelet kubeadm kubectl\nsudo apt-mark hold kubelet kubeadm kubectl\n```\n\n## 初始化主节点\n\n```bash\nkubeadm init --control-plane-endpoint \"lb.k8s.local:6443\" \\\n  --upload-certs \\\n  --pod-network-cidr=10.244.0.0/16\n```', '<h1>Kubernetes 高可用集群搭建</h1>', 2, 1, 1, 1, 1456, 78, 25, 41),

(5, 7, 'Nginx 性能优化：从配置到内核调优', '全面讲解 Nginx 性能优化的技巧，包括配置优化、缓存策略、反向代理调优以及内核参数调整。', '# Nginx 性能优化指南\n\n## 连接优化\n\n```nginx\nevents {\n    worker_connections 65535;\n    multi_accept on;\n    use epoll;\n}\n```\n\n## 缓存配置\n\n```nginx\nproxy_cache_path /data/nginx/cache levels=1:2 \n  keys_zone=my_cache:10m max_size=10g inactive=60m;\n\nlocation / {\n    proxy_cache my_cache;\n    proxy_cache_valid 200 60m;\n    proxy_cache_use_stale error timeout http_500 http_502;\n    add_header X-Cache-Status $upstream_cache_status;\n}\n```\n\n## Gzip 压缩\n\n```nginx\ngzip on;\ngzip_vary on;\ngzip_min_length 1024;\ngzip_types text/plain text/css application/json application/javascript;\n```\n\n## 内核参数调优\n\n```bash\ncat >> /etc/sysctl.conf << EOF\nnet.core.somaxconn = 65535\nnet.ipv4.tcp_max_syn_backlog = 65535\nnet.ipv4.tcp_fin_timeout = 15\nEOF\n\nsysctl -p\n```\n\n## 监控指标\n\n- active connections\n- request per second\n- connection errors\n- upstream response time', '<h1>Nginx 性能优化指南</h1>', 2, 1, 0, 0, 892, 46, 15, 27),

(5, 7, 'Docker 镜像优化：构建更小更快的容器', '本文介绍多种 Docker 镜像优化策略，包括多阶段构建、.dockerignore 优化、基础镜像选择等技巧。', '# Docker 镜像优化实战\n\n## 多阶段构建\n\n```dockerfile\n# 构建阶段\nFROM golang:1.21 AS builder\nWORKDIR /app\nCOPY . .\nRUN CGO_ENABLED=0 go build -o myapp\n\n# 运行阶段\nFROM alpine:latest\nCOPY --from=builder /app/myapp /myapp\nENTRYPOINT [\"/myapp\"]\n```\n\n## .dockerignore\n\n```\n.git\n.gitignore\nnode_modules\ndist\n*.log\n.env*\nREADME.md\n```\n\n## 优化技巧\n\n| 优化项 | 操作 |\n|--------|------|\n| 合并 RUN 指令 | 减少层数 |\n| 顺序依赖包 | 利用缓存 |\n| 使用 alpine | 减少基础镜像大小 |\n| 标签不加 latest | 版本明确 |\n\n## 体积对比\n\n| 镜像 | 大小 |\n|------|------|\n| ubuntu:22.04 | ~77MB |\n| alpine:3.18 | ~7MB |\n| distroless | ~3MB |\n\n## 最佳实践\n\n1. 使用 BuildKit 并行构建\n2. 定期清理临时文件\n3. 扫描安全漏洞', '<h1>Docker 镜像优化实战</h1>', 2, 1, 0, 0, 1034, 52, 18, 31);

-- 插入文章标签关联
INSERT INTO `article_tag` (`article_id`, `tag_id`) VALUES
(1, 6), (1, 8), -- Spring Boot, Redis
(2, 6), (2, 7), -- Spring Boot, MySQL
(3, 1), (3, 2), (3, 3), -- React, Vue, TypeScript
(4, 3), (4, 2), -- TypeScript, Vue
(5, 2), (5, 3), -- Vue, TypeScript
(6, 8), (6, 15), -- Redis, Docker
(7, 7), (7, 15), -- MySQL, Docker
(8, 5), (8, 6), -- Java, Spring Boot
(9, 9), (9, 10), (9, 11), -- PyTorch, LLM, 机器学习
(10, 9), (10, 10), -- PyTorch, LLM
(11, 10), (11, 11), -- LLM, 机器学习
(12, 16), (12, 15), -- Kubernetes, Docker
(13, 17), (13, 16), -- Nginx, Kubernetes
(14, 15), (14, 16); -- Docker, Kubernetes

-- 插入评论
INSERT INTO `comment` (`article_id`, `user_id`, `content`, `parent_id`, `reply_user_id`) VALUES
-- 文章1的评论
(1, 2, '写的很详细！请问 Access Token 过期后如何处理用户体验？', 0, 0),
(1, 3, '通常的做法是返回 401 前端自动用 Refresh Token 换取新的 Access Token', 1, 2),
(1, 4, '补充一下，还需要处理 Refresh Token 也过期的情况，比如跳转到登录页', 2, 3),
(1, 5, 'Redis 黑名单的过期时间要和 Access Token 过期时间一致吗？', 0, 0),

-- 文章2的评论
(2, 3, '逻辑删除确实比物理删除安全多了，请问如何处理物理删除的关联数据？', 0, 0),
(2, 1, '一般通过外键约束或者软删除级联处理', 5, 3),

-- 文章3的评论
(3, 1, 'Concurrent Mode 确实很强大，但迁移旧项目要注意 break change', 0, 0),
(3, 4, 'React 18 的 Suspense for Data Fetching 什么时候能稳定？', 0, 0),

-- 文章4的评论
(4, 5, '装饰器组合的顺序问题很容易踩坑，感谢总结', 0, 0),
(4, 2, 'TypeScript 5.0 的装饰器还有哪些限制？', 0, 0),

-- 文章9的评论
(9, 1, 'LoRA 确实大幅降低了微调成本，我们线上已经在用了', 0, 0),
(9, 3, 'rank 参数怎么选择有什么经验吗？', 0, 0),
(9, 2, '通常 rank 在 4-16 之间效果就不错了，太大了反而容易过拟合', 12, 3),
(9, 5, 'LoRA 配合 QLoRA 效果更好，显存占用能再降一半', 0, 0),

-- 文章11的评论
(11, 2, 'RAG 是目前落地方案最成熟的 LLM 应用架构', 0, 0),
(11, 4, '向量数据库选择有什么建议？个人项目用 Chroma 够吗？', 0, 0),
(11, 3, 'Chroma 足够个人项目用了，生产环境推荐 Milvus 或 Pinecone', 17, 4),

-- 文章12的评论
(12, 5, '高可用集群搭建步骤很详细，收藏了！', 0, 0),
(12, 1, 'etcd 集群有专门的优化参数吗？', 0, 0),

-- 文章14的评论
(14, 3, '多阶段构建确实能大幅减小镜像体积', 0, 0),
(14, 4, '我们项目用 distroless 基础镜像，只有 2MB', 0, 0);

-- 插入点赞记录
INSERT INTO `user_like` (`user_id`, `target_id`, `target_type`) VALUES
(2, 1, 1), (3, 1, 1), (4, 1, 1), (5, 1, 1),
(1, 3, 1), (3, 3, 1), (4, 3, 1),
(2, 5, 1), (4, 5, 1), (5, 5, 1),
(1, 9, 1), (2, 9, 1), (3, 9, 1), (5, 9, 1),
(1, 10, 1), (2, 10, 1), (4, 10, 1),
(1, 11, 1), (2, 11, 1), (3, 11, 1),
(1, 12, 1), (2, 12, 1), (5, 12, 1),
(3, 14, 1), (4, 14, 1);

-- 插入收藏记录
INSERT INTO `user_collect` (`user_id`, `article_id`) VALUES
(2, 1), (3, 1), (4, 1),
(1, 3), (4, 3), (5, 3),
(1, 9), (2, 9), (5, 9),
(1, 11), (2, 11),
(1, 12), (5, 12);

-- 插入关注关系
INSERT INTO `user_follow` (`user_id`, `follow_user_id`, `status`) VALUES
(2, 1, 1), (3, 1, 1), (4, 1, 1), (5, 1, 1),
(1, 2, 1), (3, 2, 1),
(1, 3, 1), (2, 3, 1), (4, 3, 1),
(1, 4, 1), (2, 4, 1);

-- 插入通知消息
INSERT INTO `notification` (`user_id`, `from_user_id`, `type`, `target_id`, `content`, `is_read`) VALUES
(1, 2, 1, 1, '前端开发者 评论了你的文章《Spring Boot 3.2 实战系列》', 1),
(1, 3, 3, 1, 'AI研究员 点赞了你的文章《Spring Boot 3.2 实战系列》', 1),
(1, 4, 3, 1, '运维工程师 点赞了你的文章《Spring Boot 3.2 实战系列》', 0),
(2, 1, 1, 3, '管理员 回复了你的评论', 0),
(3, 2, 4, 1, '前端开发者 关注了你', 0),
(4, 1, 1, 9, '管理员 评论了你的文章《PyTorch 2.0 编译优化》', 0),
(5, 3, 1, 11, 'AI研究员 评论了你的文章《RAG 系统构建》', 0);
