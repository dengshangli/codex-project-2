import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="stack gap-xl">
      <section className="hero">
        <p className="eyebrow">个人博客</p>
        <h1>关于软件工程、设计约束与可持续工作的笔记。</h1>
        <p className="hero-copy">
          这里记录实践文章、项目札记，以及那些让工程工作随着时间推移更容易理解的小决策。
        </p>
        <div className="actions">
          <Link className="button" href="/posts">
            阅读文章
          </Link>
          <a className="button secondary" href="mailto:hello@example.com">
            联系我
          </a>
        </div>
      </section>

      <section className="section-grid" aria-labelledby="about-heading">
        <div>
          <p className="eyebrow">关于</p>
          <h2 id="about-heading">把写作当作工作的笔记本</h2>
        </div>
        <div className="about-copy">
          <p>
            这个博客收集关于软件构建的现场笔记：清晰边界、有效约束，以及能经受真实项目压力的工作习惯。
          </p>
          <p>
            这里更偏爱聚焦的小文章，而不是冗长宣言：一次写清一个想法、一个取舍，或一个可复用的模式。
          </p>
        </div>
      </section>

      <section className="stack" aria-labelledby="recent-posts-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">最新写作</p>
            <h2 id="recent-posts-heading">最近文章</h2>
          </div>
          <Link href="/posts">查看全部文章</Link>
        </div>
        <div className="post-grid">
          {recentPosts.map((post) => (
            <article className="post-card" key={post.slug}>
              <div className="post-meta">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span>{post.readingTime}</span>
              </div>
              <h3>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h3>
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
        </div>
      </section>
    </div>
  );
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00Z`));
}
