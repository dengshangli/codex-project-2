import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "文章",
  description: "浏览邓的个人博客中的全部文章与笔记。"
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="stack gap-xl">
      <section className="page-heading">
        <p className="eyebrow">归档</p>
        <h1>全部文章</h1>
        <p>
          关于产品工程、设计约束，以及可持续技术工作的文章与笔记。
        </p>
      </section>

      <section className="post-list" aria-label="全部博客文章">
        {posts.map((post) => (
          <article className="post-row" key={post.slug}>
            <div className="post-meta">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span>{post.readingTime}</span>
            </div>
            <h2>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.description}</p>
            <div className="tag-list" aria-label="标签">
              {post.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00Z`));
}
