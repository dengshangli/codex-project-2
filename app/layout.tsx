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
        <div className="site-shell">
          <header className="site-header">
            <Link className="brand" href="/" aria-label="邓的笔记首页">
              邓的笔记
            </Link>
            <nav className="site-nav" aria-label="主导航">
              <Link href="/">首页</Link>
              <Link href="/posts">文章</Link>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="site-footer">
            <p>使用 Next.js 与 Markdown 构建，服务于长期、稳定的写作。</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
