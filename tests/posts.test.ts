import { describe, expect, it } from "vitest";
import { calculateReadingTime, getAllPosts, getPostBySlug } from "../lib/posts";

describe("博客文章加载", () => {
  it("按时间倒序加载文章", () => {
    const posts = getAllPosts();
    expect(posts.map((post) => post.slug)).toEqual([
      "ai-assisted-coding-workflow",
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
    expect(post?.html).toContain("<p>");
  });

  it("找不到 slug 时返回 null", () => {
    expect(getPostBySlug("missing")).toBeNull();
  });

  it("阅读时间至少为一分钟", () => {
    expect(calculateReadingTime("短文章")).toBe("1 分钟阅读");
  });
});
