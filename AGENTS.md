# Agent 工作说明

## 这个项目是什么

这是一个中文个人博客，用 Next.js App Router、React、TypeScript、Tailwind CSS 和本地 Markdown 搭起来。目标很简单：文章好写，页面好改，构建不要变复杂。

目录大致这样分：

- `app/` 放页面和路由。
- `components/` 放可复用组件，`components/ui/` 是已有的基础 UI 组件。
- `content/posts/*.md` 是文章内容来源。
- `lib/posts.ts` 读取 Markdown，解析 frontmatter，生成文章摘要和正文 HTML。
- `tests/` 放 Vitest 测试。
- `docs/superpowers/` 里可能有以前的计划和设计说明。接着做旧任务时，先看这里。

## 常用命令

- `npm run dev`：启动本地开发服务器。
- `npm test`：运行 Vitest 测试。
- `npm run lint`：运行 ESLint。
- `npm run build`：验证生产构建。

不要凭感觉说“完成”。小改动至少跑相关测试；改到页面、内容管线或构建结果时，能跑就跑 `npm test`、`npm run lint` 和 `npm run build`。

## 开发约定

- 默认保持静态和简单。除非用户明确要求，不要加入 CMS、登录、评论、统计、远程 API 或其他外部服务。
- `content/posts` 是文章的事实来源，不要另起一套内容存储。
- 修改 TypeScript 和 React 代码时，贴近现有写法：组件保持简洁，辅助逻辑用清楚的具名函数，必要时导出明确类型。
- 做 UI 时先复用 `components/ui` 里的基础组件，再考虑新增组件。
- 样式跟着 `app/globals.css` 和现有 Tailwind 写法走，不要顺手换一套视觉语言。
- 只改和任务有关的内容，避免无关重构、批量格式化或元数据噪音。
- 除非用户明确要求，不要创建 git commit。

## 内容约定

新增或修改 Markdown 文章时，frontmatter 必须符合 `lib/posts.ts` 的要求：

- `title`
- `description`
- `date`
- `tags`

`date` 使用可排序的 ISO 风格字符串。中文文案要自然、具体、克制，优先写给真实读者看，而不是写成模板化说明。

## 测试约定

改到 `lib/` 行为、文章排序、Markdown 解析、主题逻辑或归档逻辑时，要补充或更新 Vitest 测试。只改页面结构或视觉样式时，可以做聚焦的手动检查，再配合 lint/build；如果里面有可复用逻辑，把它沉到能测试的位置。

如果某个验证命令没有运行，最终说明里要直接写清楚原因，不要暗示它已经通过。
