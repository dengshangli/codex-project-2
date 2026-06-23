# Next.js 个人博客实施计划

> **给 agentic workers：** 必须使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans，按任务逐步实现本计划。步骤使用复选框（`- [ ]`）语法便于跟踪。

**目标：** 构建一个静态生成的中文个人博客，使用 Next.js、TypeScript、本地 Markdown 文章、响应式样式和验证覆盖。

**架构：** Next.js App Router 负责渲染站点。`content/posts` 存放带 frontmatter 的 Markdown 文章。`lib/posts.ts` 是文件系统内容和 UI 路由之间的边界。

**技术栈：** Next.js、React、TypeScript、Vitest、ESLint，通过 `gray-matter` 和 `remark` 处理 Markdown。

## 全局约束
- 不编辑 `.cursor/plans/nextjs-blog_fe24a59e.plan.md`。
- 除非用户明确要求，否则不创建 git commit。
- 使用本地 Markdown 文件作为文章来源。
- 第一版保持静态和 YAGNI：不加入 CMS、认证、评论或分析。
- 在声明完成前运行 `npm test`、`npm run lint` 和 `npm run build`。

---

## 文件结构
- 创建 `package.json`、`tsconfig.json`、`next.config.ts`、`eslint.config.mjs`、`vitest.config.ts` 和 `next-env.d.ts` 作为项目工具链。
- 创建 `app/layout.tsx`、`app/page.tsx`、`app/posts/page.tsx`、`app/posts/[slug]/page.tsx`、`app/globals.css` 和 `app/not-found.tsx` 作为站点页面。
- 创建 `content/posts/*.md` 作为示例文章。
- 创建 `lib/posts.ts` 负责类型化文章加载。
- 创建 `tests/posts.test.ts` 覆盖内容辅助函数行为。

### 任务 1：搭建工具链和内容测试

**文件：**
- 创建：`package.json`
- 创建：`tsconfig.json`
- 创建：`next.config.ts`
- 创建：`eslint.config.mjs`
- 创建：`vitest.config.ts`
- 创建：`next-env.d.ts`
- 创建：`tests/posts.test.ts`

**接口：**
- 产出：项目脚本 `npm test`、`npm run lint` 和 `npm run build`。
- 产出：从 `lib/posts` 导入的辅助函数 API：`getAllPosts()`、`getPostBySlug(slug)` 和 `calculateReadingTime(markdown)`。

- [ ] **步骤 1：编写失败的内容测试**

```ts
import { describe, expect, it } from "vitest";
import { calculateReadingTime, getAllPosts, getPostBySlug } from "../lib/posts";

describe("博客文章加载", () => {
  it("按时间倒序加载文章", () => {
    const posts = getAllPosts();
    expect(posts.map((post) => post.slug)).toEqual([
      "designing-with-constraints",
      "building-a-sustainable-writing-rhythm",
      "hello-nextjs-blog",
    ]);
  });

  it("按 slug 加载中文文章元数据和渲染内容", () => {
    const post = getPostBySlug("hello-nextjs-blog");
    expect(post?.title).toBe("你好，Next.js 博客");
    expect(post?.tags).toContain("Next.js");
    expect(post?.readingTime).toMatch(/分钟阅读$/);
  });

  it("找不到 slug 时返回 null", () => {
    expect(getPostBySlug("missing")).toBeNull();
  });

  it("阅读时间至少为一分钟", () => {
    expect(calculateReadingTime("短文章")).toBe("1 分钟阅读");
  });
});
```

- [ ] **步骤 2：运行测试验证 RED**

运行：`npm test`

预期：命令失败，因为项目依赖或 `lib/posts` 尚不存在。

- [ ] **步骤 3：添加最小工具链文件**

添加 Next.js、React、TypeScript、Vitest、ESLint、`gray-matter`、`remark` 和 `remark-html`。仅当 CSS 方案需要时才添加额外依赖。

- [ ] **步骤 4：安装依赖**

运行：`npm install`

预期：依赖安装完成，并创建 lockfile。

### 任务 2：实现 Markdown 内容管线

**文件：**
- 创建：`lib/posts.ts`
- 创建：`content/posts/hello-nextjs-blog.md`
- 创建：`content/posts/building-a-sustainable-writing-rhythm.md`
- 创建：`content/posts/designing-with-constraints.md`
- 修改：`tests/posts.test.ts`

**接口：**
- 产出：`PostSummary`、`Post`、`getAllPosts()`、`getPostBySlug(slug: string): Post | null` 和 `calculateReadingTime(markdown: string): string`。

- [ ] **步骤 1：实现最小内容辅助函数**

从 `content/posts` 读取 Markdown 文件，解析 frontmatter，派生 `slug`，按最新优先排序，并将 Markdown 正文渲染为 HTML。

- [ ] **步骤 2：运行 GREEN 验证**

运行：`npm test`

预期：全部内容辅助函数测试通过。

### 任务 3：构建博客路由和样式

**文件：**
- 创建：`app/layout.tsx`
- 创建：`app/page.tsx`
- 创建：`app/posts/page.tsx`
- 创建：`app/posts/[slug]/page.tsx`
- 创建：`app/not-found.tsx`
- 创建：`app/globals.css`

**接口：**
- 消费：`getAllPosts()` 和 `getPostBySlug(slug)`。
- 产出：首页、文章列表、文章详情和未找到状态的静态页面。

- [ ] **步骤 1：实现应用布局**

添加 metadata、站点导航、页脚、语义化主内容和全局 CSS 导入。

- [ ] **步骤 2：实现路由页面**

首页展示 hero、关于内容和最近文章。文章索引展示全部文章。文章详情渲染元数据和文章 HTML。未知 slug 调用 `notFound()`。

- [ ] **步骤 3：添加响应式样式**

在 `app/globals.css` 使用普通 CSS，提供可访问的颜色对比、易读排版、卡片、标签和移动端友好布局。

### 任务 4：验证、评审和收尾

**文件：**
- 根据验证或评审发现按需修改。

**接口：**
- 产出：已验证的项目状态。

- [ ] **步骤 1：运行完整验证**

运行：
```bash
npm test
npm run lint
npm run build
```

预期：所有命令退出码为 0。

- [ ] **步骤 2：请求代码评审**

针对最终 diff 发起评审，并在修改前评估每条发现。

- [ ] **步骤 3：应用有效评审反馈**

使用 receiving-code-review 纪律：修改前先在代码库中验证每条发现。

- [ ] **步骤 4：完成分支收尾流程**

使用 finishing-a-development-branch 在验证后展示集成选项。
