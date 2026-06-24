import { describe, expect, it } from "vitest";
import { buildPostArchive, postsPerPage } from "../lib/post-archive";
import type { PostSummary } from "../lib/posts";

const posts: PostSummary[] = [
  createPost("ai-assisted-coding-workflow", "把 AI 放进编程工作流", "让 AI 辅助编程保持可靠。", ["AI", "工程"]),
  createPost("designing-with-constraints", "带着约束做设计", "明确取舍带来更好的软件。", ["设计", "系统"]),
  createPost("writing-rhythm", "建立可持续的写作节奏", "轻量的定期发布方式。", ["写作", "习惯"]),
  createPost("nextjs-blog", "你好，Next.js 博客", "本地 Markdown 写作角落。", ["Next.js", "个人博客"]),
  createPost("testing-notes", "测试笔记", "短反馈循环让修改更可靠。", ["测试", "工程"]),
  createPost("review-habits", "代码审查习惯", "用小批量变更降低风险。", ["工程", "协作"]),
  createPost("tooling-notes", "工具链笔记", "让重复工作自动化。", ["工具", "效率"])
];

describe("文章归档过滤和分页", () => {
  it("按标题、描述和标签搜索文章", () => {
    expect(buildPostArchive(posts, { query: "AI", page: "1" }).posts.map((post) => post.slug)).toEqual([
      "ai-assisted-coding-workflow"
    ]);
    expect(buildPostArchive(posts, { query: "短反馈", page: "1" }).posts.map((post) => post.slug)).toEqual([
      "testing-notes"
    ]);
    expect(buildPostArchive(posts, { query: "工程", page: "1" }).totalPosts).toBe(3);
  });

  it("按固定数量分页并保留总页数", () => {
    const archive = buildPostArchive(posts, { query: "", page: "2" });

    expect(postsPerPage).toBe(6);
    expect(archive.currentPage).toBe(2);
    expect(archive.totalPages).toBe(2);
    expect(archive.posts.map((post) => post.slug)).toEqual(["tooling-notes"]);
  });

  it("页码无效或越界时回退到可用范围", () => {
    expect(buildPostArchive(posts, { query: "", page: "bad" }).currentPage).toBe(1);
    expect(buildPostArchive(posts, { query: "", page: "99" }).currentPage).toBe(2);
    expect(buildPostArchive([], { query: "", page: "2" }).currentPage).toBe(1);
  });
});

function createPost(slug: string, title: string, description: string, tags: string[]): PostSummary {
  return {
    slug,
    title,
    description,
    tags,
    date: "2026-01-01",
    readingTime: "1 分钟阅读"
  };
}
