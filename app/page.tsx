import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="grid gap-16 lg:gap-20">
      <section className="max-w-4xl">
        <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-primary">个人博客</p>
        <h1 className="max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.075em] text-foreground sm:text-6xl lg:text-7xl">
          关于软件工程、设计约束与可持续工作的笔记。
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          这里记录实践文章、项目札记，以及那些让工程工作随着时间推移更容易理解的小决策。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className={buttonVariants()} href="/posts">
            阅读文章
          </Link>
          <a className={buttonVariants({ variant: "secondary" })} href="mailto:hello@example.com">
            联系我
          </a>
        </div>
      </section>

      <section
        className="grid gap-8 rounded-[2rem] border bg-card/75 p-7 shadow-sm backdrop-blur md:grid-cols-[0.8fr_1.2fr] md:p-9"
        aria-labelledby="about-heading"
      >
        <div>
          <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-primary">关于</p>
          <h2 id="about-heading" className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            把写作当作工作的笔记本
          </h2>
        </div>
        <div className="grid gap-4 text-muted-foreground">
          <p className="leading-8">
            这个博客收集关于软件构建的现场笔记：清晰边界、有效约束，以及能经受真实项目压力的工作习惯。
          </p>
          <p className="leading-8">
            这里更偏爱聚焦的小文章，而不是冗长宣言：一次写清一个想法、一个取舍，或一个可复用的模式。
          </p>
        </div>
      </section>

      <section className="grid gap-8" aria-labelledby="recent-posts-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-black uppercase tracking-[0.22em] text-primary">最新写作</p>
            <h2 id="recent-posts-heading" className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              最近文章
            </h2>
          </div>
          <Link className={buttonVariants({ variant: "link" })} href="/posts">
            查看全部文章
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <article key={post.slug}>
              <Card className="h-full bg-card/90 transition-colors hover:border-primary/40">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted-foreground">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span>/</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <CardTitle className="text-xl tracking-tight">
                    <Link className="transition-colors hover:text-primary" href={`/posts/${post.slug}`}>
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-5">
                  <p className="text-sm leading-7 text-muted-foreground">{post.description}</p>
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
