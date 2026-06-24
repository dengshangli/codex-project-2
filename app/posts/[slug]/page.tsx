import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "文章未找到"
    };
  }

  return {
    title: post.title,
    description: post.description
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl">
      <Link className={buttonVariants({ variant: "link", className: "mb-8" })} href="/posts">
        返回全部文章
      </Link>
      <header className="border-b pb-8">
        <div className="mb-5 flex flex-wrap gap-2 text-sm font-semibold text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>/</span>
          <span>{post.readingTime}</span>
        </div>
        <h1 className="text-5xl font-black leading-[0.96] tracking-[-0.075em] text-foreground sm:text-6xl lg:text-7xl">
          {post.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{post.description}</p>
        <div className="mt-6 flex flex-wrap gap-2" aria-label="标签">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </header>
      <div className="article-body pt-8" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00Z`));
}
