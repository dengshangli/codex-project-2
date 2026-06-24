# Agent 指南

## 项目概览

这是一个使用 Next.js App Router、React、TypeScript、Tailwind CSS 和本地 Markdown 内容构建的个人博客。

- 路由位于 `app/`。
- 可复用 UI 组件位于 `components/`。
- 博客内容位于 `content/posts/*.md`。
- Markdown 加载、解析和文章元数据逻辑位于 `lib/posts.ts`。
- 测试位于 `tests/`，使用 Vitest。
- 计划和设计说明可能位于 `docs/superpowers/`；继续已有计划时应先查阅。

## 常用命令

- `npm run dev` 启动本地开发服务器。
- `npm test` 运行 Vitest 测试套件。
- `npm run lint` 运行 ESLint。
- `npm run build` 验证 Next.js 生产构建。

在声明实现工作完成前，先运行相关的聚焦测试。对于范围较大或面向用户的变更，在可行时运行 `npm test`、`npm run lint` 和 `npm run build`。

## 开发准则

- 保持第一版静态且简单：除非用户明确要求，不要添加 CMS、认证、评论、分析或外部服务。
- 将 `content/posts` 视为博客文章的事实来源。
- 保持现有 TypeScript 和 React 风格：使用具名辅助函数，在有价值时显式导出类型，并保持组件简洁。
- 在引入新的组件模式前，优先使用 `components/ui` 中已有的 UI 基元。
- 样式应与 `app/globals.css` 和现有 Tailwind utility 模式保持一致。
- 避免无关重构或纯格式改动。
- 除非用户明确要求，否则不要创建 git commit。

## 内容准则

- Markdown 文章应包含 `lib/posts.ts` 期望的有效 frontmatter 字段：`title`、`description`、`date` 和 `tags`。
- 日期应保持为可排序的 ISO 风格字符串。
- 除非用户要求其他语气，否则中文文案应自然、简洁。

## 测试指导

- 修改 `lib/` 行为、文章排序、解析逻辑、主题辅助函数或归档逻辑时，添加或更新 Vitest 覆盖。
- 对于仅涉及路由和 UI 的变更，优先进行聚焦的手动检查并配合 lint/build；如果存在可复用行为，再直接编写测试。
- 如果无法运行某个验证命令，应清楚说明原因。
