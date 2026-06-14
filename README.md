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

默认生成的短链域名为 `http://localhost:8763`；1Panel / 生产部署时请通过 `APP_BASE_URL` 覆盖为最终公网访问地址，例如 `http://你的域名:8763` 或反代后的 HTTPS 域名。

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

短链示例：`https://shorten.miku831.fun/molink`
