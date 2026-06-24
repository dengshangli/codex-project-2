import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "邓的笔记",
    template: "%s | 邓的笔记"
  },
  description: "一个记录软件工程、设计约束和可持续工作方式的个人博客。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="mx-auto flex min-h-screen w-[calc(100%-2rem)] max-w-6xl flex-col">
          <header className="flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:justify-between">
            <Link
              className="text-lg font-black tracking-tight text-foreground no-underline transition-colors hover:text-primary"
              href="/"
              aria-label="邓的笔记首页"
            >
              邓的笔记
            </Link>
            <nav className="flex gap-5 text-sm font-medium text-muted-foreground" aria-label="主导航">
              <Link className="transition-colors hover:text-primary" href="/">
                首页
              </Link>
              <Link className="transition-colors hover:text-primary" href="/posts">
                文章
              </Link>
            </nav>
          </header>
          <main className="flex-1 py-10 sm:py-14 lg:py-16">{children}</main>
          <footer className="border-t py-7">
            <p className="text-sm leading-7 text-muted-foreground">
              使用 Next.js 与 Markdown 构建，服务于长期、稳定的写作。
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
