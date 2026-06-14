# 墨链 MoLink

墨链是 elari39 的个人短链接项目，线上地址为 https://shorten.miku831.fun。

它支持长链接缩短、302 跳转、自定义短码、过期时间、点击统计和最近访问明细，适合日常分享、作品链接与临时跳转。

- GitHub 个人主页：https://github.com/elari39
- 项目仓库：https://github.com/Elari39/MoLink

## 技术栈

- 后端：JDK 17、Spring Boot 3、Spring Data JPA、Spring Data Redis、MySQL
- 前端：React 19、TypeScript、Vite、Tailwind CSS 4、pnpm
- 部署：Docker Compose、nginx 反向代理

## 本地运行

后端需要 MySQL 与 Redis。可使用本机服务，也可以直接启动全栈容器：

```bash
docker compose up --build
```

容器启动后：

- 前端：http://localhost:8763
- 后端：仅供 Docker 内网访问，不再直接暴露宿主机端口

默认生成的短链域名会根据当前请求自动识别，例如本地访问为 `http://localhost:8763`。1Panel / 生产部署时通常无需设置 `APP_BASE_URL`；如需固定为某个公网地址，可通过 `APP_BASE_URL` 覆盖，例如反代后的 HTTPS 域名。

## 1Panel 远程存储部署

如需在 1Panel 中使用已有的远程 MySQL / Redis，不需要启动本仓库内置的 `mysql` 和 `redis` 服务，使用专用编排即可：

```bash
docker compose -f docker-compose.1panel.yml --env-file .env.1panel up --build -d
```

可先复制 `.env.1panel.example` 为 `.env.1panel`，再替换为 1Panel 中真实的内网或受信任地址。关键变量如下：

```env
APP_DISPLAY_NAME="Notes of Ashen"
WEB_PORT=8763
APP_TIMEOUT=610000

# 可选：留空时根据 Host / X-Forwarded-* 自动识别；需要固定短链域名时再填写。
APP_BASE_URL=

APP_REMOTE_STORAGE_ENABLED=true
APP_DATABASE_DSN=notes_user:replace-with-db-password@tcp(mysql.example.com:3306)/notes_of_ashen?charset=utf8mb4&parseTime=true&loc=Local
APP_DATABASE_MAX_OPEN_CONNS=20
APP_DATABASE_MAX_IDLE_CONNS=10

APP_REDIS_ADDR=redis.example.com:6379
APP_REDIS_PASSWORD=replace-with-redis-password
APP_REDIS_DB=1
```

- `APP_REMOTE_STORAGE_ENABLED=false` 时不启用远程存储适配，后端继续使用 `MYSQL_HOST` / `MYSQL_PORT` / `MYSQL_DB` / `MYSQL_USER` / `MYSQL_PASSWORD` 与 `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD`。
- `APP_BASE_URL` 留空时，后端会优先根据 `X-Forwarded-Proto`、`X-Forwarded-Host`、`Host` 自动生成短链域名；填写后则始终使用该固定地址。
- `APP_DATABASE_DSN` 兼容 `user:password@tcp(host:port)/database?...` 格式，其中 `charset` 会映射为 JDBC 字符编码，`loc=Local` 会映射为 `Asia/Shanghai`，`parseTime` 对 Java/JPA 无需处理。
- `APP_DATABASE_MAX_IDLE_CONNS` 会自动限制为不超过 `APP_DATABASE_MAX_OPEN_CONNS`。

前端开发模式：

```bash
cd frontend
pnpm install
pnpm dev
```

后端开发模式：

```bash
mvn spring-boot:run
```

默认会连接 `localhost:3306` 的 MySQL（`root/root`）和 `localhost:6379` 的 Redis。若看到 `Access denied for user 'root'`，请先确认本机 MySQL 账号密码，或通过 `MYSQL_HOST` / `MYSQL_USER` / `MYSQL_PASSWORD` 覆盖；若要直接连 1Panel 远程存储，则使用上方 `APP_REMOTE_STORAGE_ENABLED=true` 的变量运行。

## 验证

后端：

```bash
mvn test
```

前端：

```bash
cd frontend
pnpm lint
pnpm build
```

## 接口

- `POST /api/links`：创建短链
- `GET /api/links/{code}/stats?logLimit=20`：查询统计
- `GET /{code}`：短码跳转

所有 `/api` 接口返回 `{ code, message, data }`，其中 `code=0` 表示成功。

短链示例：`https://shorten.miku831.fun/molink`
