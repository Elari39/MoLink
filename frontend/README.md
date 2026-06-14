# MoLink Frontend

墨链前端是 React + TypeScript + Vite 单页应用，提供短链创建、统计查询、API 文档、明暗主题与中英文切换。

## 主要目录

- `src/api/`：后端请求封装与 DTO 类型
- `src/components/`：导航、表单、结果卡片、统计展示和静态内容区块
- `src/contexts/`：主题与国际化上下文
- `src/i18n/`：中文与英文文案字典
- `src/pages/`：React Router 页面

## 开发

```bash
pnpm install
pnpm dev
```

开发服务器会把 `/api` 代理到 `http://localhost:8080`。生产环境中，nginx 负责静态托管、`/api` 反代和根路径短码跳转反代。

## 验证

```bash
pnpm lint
pnpm build
```

`pnpm build` 会先执行 TypeScript 项目构建，再运行 Vite 构建。

## 约定

- 依赖管理只使用 `pnpm`。
- 新增接口字段时同步更新 `src/api/types.ts`、调用方和 API 文档展示。
- 页面交互需要覆盖 Loading、Error、Empty State。
- 中英文文案结构以 `zh.ts` 的 `Messages` 类型为准，`en.ts` 必须保持同结构。
