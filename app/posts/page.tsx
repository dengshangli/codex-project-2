import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    <div className="grid gap-12 lg:gap-16">
      <section className="max-w-4xl">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-primary">归档</p>
        <h1 className="text-5xl font-black leading-[0.96] tracking-[-0.075em] text-foreground sm:text-6xl lg:text-7xl">
          全部文章
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          关于产品工程、设计约束，以及可持续技术工作的文章与笔记。
        </p>
      </section>

      <Card className="bg-card/80 backdrop-blur">
        <form className="grid gap-4 p-6" action="/posts">
          <label className="text-sm font-bold text-foreground" htmlFor="post-search">
            搜索文章
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              className="sm:flex-1"
              id="post-search"
              name="q"
              type="search"
              placeholder="搜索标题、描述或标签"
              defaultValue={archive.query}
            />
            <Button type="submit">搜索</Button>
            {archive.query ? (
              <Link className={buttonVariants({ variant: "secondary" })} href="/posts">
                清除
              </Link>
            ) : null}
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            {archive.query
              ? `找到 ${archive.totalPosts} 篇与“${archive.query}”相关的文章`
              : `共 ${archive.totalPosts} 篇文章`}
          </p>
        </form>
      </Card>

      <section className="grid gap-5" aria-label="全部博客文章">
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post.slug}>
              <Card className="bg-card/90 transition-colors hover:border-primary/40">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>/</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <CardTitle className="text-2xl tracking-tight">
                    <Link className="transition-colors hover:text-primary" href={`/posts/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <p className="leading-7 text-muted-foreground">{post.description}</p>
                  <div className="flex flex-wrap gap-2" aria-label="标签">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </article>
          ))
        ) : (
          <Card className="bg-card/80">
            <CardHeader>
              <CardTitle>没有找到相关文章</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-5">
              <p className="leading-7 text-muted-foreground">换一个关键词试试，或返回全部文章。</p>
              <Link className={buttonVariants({ variant: "secondary" })} href="/posts">
                查看全部文章
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {archive.totalPages > 1 ? (
        <nav
          className="flex flex-col items-stretch gap-3 rounded-3xl border bg-card/80 p-4 text-center text-sm font-bold text-muted-foreground shadow-sm sm:flex-row sm:items-center sm:justify-between"
          aria-label="文章分页"
        >
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
    return (
      <span className={buttonVariants({ variant: "secondary", size: "sm", className: "opacity-50" })}>
        {children}
      </span>
    );
  }

  return (
    <Link className={buttonVariants({ variant: "secondary", size: "sm" })} href={href}>
      {children}
    </Link>
  );
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
