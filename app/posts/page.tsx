import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { buildPostArchive } from "@/lib/post-archive";
import { getAllPosts } from "@/lib/posts";

type PostsPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export const metadata: Metadata = {
  title: "文章",
  description: "浏览邓的个人博客中的全部文章与笔记。"
};

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const archive = buildPostArchive(getAllPosts(), {
    query: params.q,
    page: params.page
  });
  const posts = archive.posts;
  const hasPreviousPage = archive.currentPage > 1;
  const hasNextPage = archive.currentPage < archive.totalPages;

  return (
    <div className="stack gap-xl">
      <section className="page-heading">
        <p className="eyebrow">归档</p>
        <h1>全部文章</h1>
        <p>
          关于产品工程、设计约束，以及可持续技术工作的文章与笔记。
        </p>
      </section>

      <form className="archive-search" action="/posts">
        <label htmlFor="post-search">搜索文章</label>
        <div className="archive-search-row">
          <input
            id="post-search"
            name="q"
            type="search"
            placeholder="搜索标题、描述或标签"
            defaultValue={archive.query}
          />
          <button className="button" type="submit">
            搜索
          </button>
          {archive.query ? (
            <Link className="button secondary" href="/posts">
              清除
            </Link>
          ) : null}
        </div>
        <p>
          {archive.query
            ? `找到 ${archive.totalPosts} 篇与“${archive.query}”相关的文章`
            : `共 ${archive.totalPosts} 篇文章`}
        </p>
      </form>

      <section className="post-list" aria-label="全部博客文章">
        {posts.length > 0 ? (
          posts.map((post) => (
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
          ))
        ) : (
          <div className="empty-state">
            <h2>没有找到相关文章</h2>
            <p>换一个关键词试试，或返回全部文章。</p>
            <Link className="button secondary" href="/posts">
              查看全部文章
            </Link>
          </div>
        )}
      </section>

      {archive.totalPages > 1 ? (
        <nav className="pagination" aria-label="文章分页">
          <PaginationLink
            disabled={!hasPreviousPage}
            href={buildArchiveHref(archive.query, archive.currentPage - 1)}
          >
            上一页
          </PaginationLink>
          <span>
            第 {archive.currentPage} / {archive.totalPages} 页
          </span>
          <PaginationLink disabled={!hasNextPage} href={buildArchiveHref(archive.query, archive.currentPage + 1)}>
            下一页
          </PaginationLink>
        </nav>
      ) : null}
    </div>
  );
}

function PaginationLink({
  children,
  disabled,
  href
}: {
  children: ReactNode;
  disabled: boolean;
  href: string;
}) {
  if (disabled) {
    return <span className="pagination-disabled">{children}</span>;
  }

  return <Link href={href}>{children}</Link>;
}

function buildArchiveHref(query: string, page: number): string {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const search = params.toString();

  return search ? `/posts?${search}` : "/posts";
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00Z`));
}
