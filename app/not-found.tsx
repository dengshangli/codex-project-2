import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl text-center">
      <p className="mb-4 text-xs font-black uppercase tracking-[0.22em] text-primary">404</p>
      <h1 className="text-5xl font-black leading-[0.96] tracking-[-0.075em] text-foreground sm:text-6xl">
        页面未找到
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
        你访问的页面不存在，或已经移动到其他位置。
      </p>
      <Link className={buttonVariants({ className: "mt-8" })} href="/">
        返回首页
      </Link>
    </section>
  );
}
