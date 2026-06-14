# ---- 构建阶段：用 pnpm 安装依赖并构建静态产物 ----
FROM node:22-alpine AS build
WORKDIR /app

# 非交互环境下禁止 corepack 下载确认提示，避免构建挂起
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0

# 启用 Corepack 并钉死与本地一致的 pnpm 版本，保证锁文件解析一致
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

# 先拷贝清单与锁文件，利用层缓存
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 拷贝源码并构建
COPY . .
RUN pnpm build

# ---- 运行阶段：用 nginx 托管静态产物并反代后端 ----
FROM nginx:alpine
# 自定义站点配置：静态托管 + /api 反代 + 短码跳转反代
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
