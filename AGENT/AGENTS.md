# AGENTS.md — 墨链 MoLink 短链接服务

> 本文件记录项目约定，后续任务优先遵循此处规范；与全局 `~/.claude/CLAUDE.md` 冲突时以本文件为准。

## 项目简介

墨链 MoLink 是 elari39 的个人水墨风短链接服务，线上地址为 `https://shorten.miku831.fun`：把长链接转为短码并支持 302 跳转、点击统计与自定义短码。
前端为单页应用，支持明/暗主题与中英文切换，不提供定价页面。

## 技术栈

| 层 | 技术 |
|---|---|
| 后端 | JDK 17 · Spring Boot 3.5 · Maven · Spring Data JPA · Spring Data Redis · Bean Validation |
| 存储 | MySQL 8（持久化）· Redis 7（发号 / 短链缓存 / 点击计数） |
| 前端 | React 19 · TypeScript · Vite 8 · Tailwind CSS 4（`@tailwindcss/vite`）· pnpm |
| 部署 | Docker / docker-compose（全栈：mysql + redis + backend + frontend/nginx） |

## 目录结构

```
short-link/
├── pom.xml                      # 后端 Maven 配置（Spring Boot 父 POM）
├── Dockerfile                   # 后端镜像（多阶段 maven → jre17）
├── docker-compose.yml           # 全栈编排
├── src/main/java/shortlink/elari39/github/
│   ├── ShortLinkApplication.java
│   ├── config/                  # AppProperties / RedisConfig / WebConfig(CORS)
│   ├── entity/                  # ShortLink / AccessLog（JPA 实体）
│   ├── repository/              # Spring Data JPA 仓储
│   ├── dto/                     # CreateLinkRequest / LinkResponse / LinkStatsResponse / ApiResult
│   ├── util/                    # Base62 编解码
│   ├── service/                 # ShortLinkService(Impl) / ClickStatService
│   ├── controller/              # ShortLinkController(/api) / RedirectController(/{code})
│   └── exception/               # GlobalExceptionHandler + 业务异常
├── src/main/resources/application.yml
├── src/test/java/...            # Base62Test / ShortLinkServiceImplTest
└── frontend/
    ├── Dockerfile               # 前端镜像（node 构建 → nginx）
    ├── nginx.conf               # 静态托管 + /api 反代 + 短码反代
    ├── vite.config.ts           # Tailwind 插件 + /api dev 代理
    └── src/
        ├── api/                 # client(fetch 封装) / links / types
        ├── contexts/            # ThemeProvider / I18nProvider + 上下文定义
        ├── hooks/               # useTheme / useI18n
        ├── i18n/                # zh / en 文案字典
        ├── pages/               # Home / Features / ApiDocs / About / Stats / NotFound
        ├── components/          # Navbar / HeroSection / ShortenForm / ResultCard / FeatureCards / Footer / InkBackdrop / InkSeal / icons
        └── App.tsx
```

## 短码生成策略

Redis `INCR shortlink:seq`（首次初始化为 `app.seq-start - 1`，默认 238328=62³ 保证首码 ≥4 位）
→ `Base62.encode(seq)` 得到短码。自定义短码先校验长度与唯一性（DB + 唯一索引兜底）。

## 缓存与计数

- `shortlink:url:{code}` → 原始链接，TTL = min(配置缓存时长, 距过期时间)。
- 跳转时 `shortlink:clicks:{code}` 自增并加入脏集合 `shortlink:clicks:dirty`；访问明细异步入库。
- 定时任务（`app.flush-interval-ms`，默认 30s）先读取 Redis 增量并提交数据库，数据库成功后用 Lua 原子扣减 Redis 计数；数据库失败时保留计数和脏标记等待重试。
- `pendingClicks()` 读取 Redis 待回写增量时必须防御异常值，避免统计接口因脏数据 500。

## REST 接口约定

所有 `/api` 接口返回统一包装 `ApiResult<T>`：`{ code, message, data }`，`code=0` 表示成功。

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/api/links` | 创建短链。body：`{ originalUrl, customCode?, expireTime? }` → `LinkResponse` |
| GET | `/api/links/{code}/stats?logLimit=20` | 点击统计 → `LinkStatsResponse`，`logLimit` 范围 1~100 |
| GET | `/{code}` | 302 跳转（不存在→404 HTML，过期→410 HTML） |

> 接口字段或结构变更时，必须同步更新前端 `frontend/src/api/types.ts` 与调用方。

## 常用命令

### 后端
```bash
# 测试
mvn test
# 本地运行（需先启动 MySQL/Redis）
mvn spring-boot:run
```

### 前端（严格使用 pnpm）
```bash
cd short-link/frontend
pnpm install
pnpm dev      # 开发，自动代理 /api 到 localhost:8080
pnpm lint
pnpm build    # 含 tsc 类型检查
```

### 全栈容器
```bash
cd short-link
docker compose up --build      # 前端 http://localhost，后端 http://localhost:8080
```

## 约定与注意

- 前端依赖统一 `pnpm add xxx@latest`，禁止 npm/yarn。
- 页面交互须覆盖 Loading / Error / Empty 三态。
- 移动端必须保留可访问导航入口；复制类操作要提供成功/失败反馈，并用 `aria-live` 暴露状态变化。
- 自定义短码前端默认按 4~16 位字母数字提示和预校验；后端 Service 仍是最终校验来源。
- 主题用 `<html>.dark` 类策略；颜色经 CSS 变量 + Tailwind `@theme inline` 暴露为 `bg-paper`/`text-ink` 等原子类。
- 生产 nginx 负责 `/api` 反代与根路径短码跳转反代；Vite 开发代理只代理 `/api`。
- 敏感配置（DB/Redis 账号、域名）经环境变量注入，不硬编码。
- `target/`、`frontend/dist/`、`frontend/node_modules/`、Redis 本地持久化文件和日志属于生成/运行产物，不作为业务改动提交。
- 未通过 `mvn test` / `pnpm build` 不声称完成。
