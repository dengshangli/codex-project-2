# Next.js 个人博客设计

## 目标
使用 Next.js、TypeScript 和本地 Markdown 内容文件构建一个中文个人博客。站点应作为精致的静态博客运行，并保留后续扩展为动态站点的空间，同时不改变本地写作模型。

## 已确认决策
- 框架：Next.js App Router。
- 语言：TypeScript。
- 内容来源：`content/posts` 下的本地 Markdown 文件。
- 核心页面：首页、文章列表、文章详情和关于模块。
- 验证方式：内容加载测试、lint 检查和生产构建检查。

## 架构
应用使用小型静态内容管线。Markdown 文件提供 frontmatter 和正文内容。`lib/posts.ts` 负责读取与校验文章，派生 `slug` 和 `readingTime` 等字段，并向路由组件暴露辅助函数。

UI 保持简洁：`app/layout.tsx` 提供共享布局，`app/globals.css` 提供全局样式，`app/page.tsx` 是首页，`app/posts/page.tsx` 是文章列表，`app/posts/[slug]/page.tsx` 是生成式文章详情页。

## 组件与数据流
- `content/posts/*.md`：作者维护的文章源文件。
- `lib/posts.ts`：内容加载、frontmatter 解析、排序、slug 查询和阅读时间计算。
- `app/page.tsx`：展示站点定位、关于内容和最近文章。
- `app/posts/page.tsx`：按日期倒序展示文章归档。
- `app/posts/[slug]/page.tsx`：展示渲染后的 Markdown 文章详情。

## 错误处理
缺失或无效的文章元数据应在测试或构建阶段明确失败。未知 slug 使用 Next.js 的 `notFound()` 行为。初始实现不加入 CMS 或网络兜底，因为本地内容是当前版本的事实来源。

## 测试
内容辅助函数需要覆盖文章发现、必填元数据、按日期倒序、slug 查询、缺失 slug 处理和阅读时间计算。生产构建用于验证路由集成。

## Superpowers 覆盖情况
- `using-superpowers`：最先加载，用于遵循技能选择规则。
- `brainstorming`：用于检查空仓库、确认技术栈和内容来源、比较方案并获得设计批准。
- `writing-plans`：用于创建项目实施计划。
- `using-git-worktrees`：用于在实现前检查仓库是否已经处于隔离工作区。
- `test-driven-development`：用于在生产实现前定义内容辅助函数行为。
- `systematic-debugging`：当依赖安装、测试、lint 或构建异常失败时用于定位根因。
- `dispatching-parallel-agents`：适用于独立失败域；设计阶段没有并行失败域。
- `subagent-driven-development`：已评估；该绿地小项目采用内联执行并保留评审门禁。
- `executing-plans`：作为内联计划执行方式使用。
- `requesting-code-review`：在功能实现后用于请求代码评审。
- `receiving-code-review`：用于在修改代码前评估评审反馈。
- `verification-before-completion`：用于在任何完成声明前提供新鲜验证证据。
- `finishing-a-development-branch`：用于验证后给出集成选项。
- `writing-skills`：因用户要求覆盖所有 Superpowers 技能而加载；本博客不需要创建新技能。

## 范围边界
当前版本不包含认证、评论、分析、搜索索引、CMS 集成或部署自动化。这些能力可以后续在不改变本地内容契约的前提下添加。
