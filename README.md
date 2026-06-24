# 邓的笔记

一个中文个人博客，用 Next.js、TypeScript 和本地 Markdown 写文章。它不接 CMS，也不依赖远程内容服务。文章放在仓库里，页面从文件系统读取，适合慢慢维护。

## 现在有什么

- 首页展示博客介绍和最近文章。
- `/posts` 提供文章列表、搜索和分页。
- `/posts/[slug]` 渲染单篇 Markdown 文章。
- 支持亮色/暗色主题切换，选择会保存在浏览器本地。
- 文章元数据、阅读时间和 HTML 渲染由 `lib/posts.ts` 处理。

## 技术栈

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Vitest
- ESLint
- `gray-matter`
- `remark` 和 `remark-html`

## 开始运行

先安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

默认访问 `http://localhost:3000`。

## 常用命令

```bash
npm test
npm run lint
npm run build
```

`npm test` 跑 Vitest。`npm run lint` 检查代码风格和常见问题。`npm run build` 验证生产构建。

## 写一篇新文章

在 `content/posts/` 下新增一个 `.md` 文件。文件名会变成文章 slug，例如：

```text
content/posts/my-new-note.md
```

每篇文章需要 frontmatter：

```markdown
---
title: "文章标题"
description: "一句话说明这篇文章讲什么。"
date: "2026-06-24"
tags:
  - Next.js
  - 写作
---

正文从这里开始。
```

`date` 使用 ISO 风格日期，方便排序。`tags` 用数组。正文可以写普通 Markdown。

## 目录说明

- `app/`：页面、布局和路由。
- `components/`：复用组件。
- `components/ui/`：基础 UI 组件。
- `content/posts/`：博客文章。
- `lib/`：文章加载、归档、主题等业务逻辑。
- `tests/`：Vitest 测试。
- `docs/superpowers/`：历史计划和设计说明。

## 改动前后怎么检查

只改文章时，通常跑 `npm test` 就够了。改到页面、主题、文章加载或归档逻辑时，建议跑完整一组：

```bash
npm test
npm run lint
npm run build
```

如果只是改文案，也至少在本地页面看一眼。中文排版的问题，测试不一定能帮你发现。
