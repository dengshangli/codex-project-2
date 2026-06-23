import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-heading centered">
      <p className="eyebrow">404</p>
      <h1>页面未找到</h1>
      <p>你访问的页面不存在，或已经移动到其他位置。</p>
      <Link className="button" href="/">
        返回首页
      </Link>
    </section>
  );
}
