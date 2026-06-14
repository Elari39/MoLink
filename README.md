# 墨链 MoLink

墨链是一个短链接服务，支持长链接缩短、302 跳转、自定义短码、过期时间、点击统计和最近访问明细。

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

- 前端：http://localhost
- 后端：http://localhost:8080

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
