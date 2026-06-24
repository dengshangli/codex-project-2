# 极简主题与暗黑模式实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将博客改为更清爽的极简技术文档风格，并支持「首次跟随系统、手动切换、持久化选择」的暗黑模式。

**Architecture:** 主题逻辑拆到 `lib/theme.ts`，便于在 Node 环境下用 Vitest 测试优先级和状态切换。`components/theme-toggle.tsx` 只负责客户端交互；`app/layout.tsx` 负责在 hydration 前设置初始主题并放置按钮；`app/globals.css` 通过 Tailwind v4 token 提供浅色和 `.dark` 暗色主题。

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Vitest, ESLint。

## Global Constraints

- 不新增主题依赖，不使用 `next-themes` 或图标库。
- 不改变文章解析、归档、搜索、分页或路由行为。
- 只支持浅色和暗色两套主题。
- 首次访问且没有保存选择时，必须跟随系统 `prefers-color-scheme: dark`。
- 用户手动切换后，必须把选择写入 `localStorage` 并在后续访问中优先使用。
- 顶部导航使用文字按钮：当前为浅色时显示「暗色」，当前为暗色时显示「浅色」。
- 不要创建 git commit，除非用户明确要求。

---

## File Structure

- `lib/theme.ts`: 新增主题类型、存储 key、纯函数和客户端辅助函数。这个文件不依赖 React。
- `tests/theme.test.ts`: 新增主题逻辑测试，覆盖保存值优先级、系统偏好 fallback、无效保存值、下一主题计算。
- `components/theme-toggle.tsx`: 新增客户端按钮组件，读取 `<html>` 当前状态，点击后更新 DOM class 和 `localStorage`。
- `app/layout.tsx`: 修改根布局，加入 hydration 前主题初始化脚本，并把 `ThemeToggle` 放到导航旁。
- `app/globals.css`: 修改 Tailwind v4 token、全局背景、`.dark` 覆盖、文章正文样式，使站点呈现 B 方向的极简技术文档风格。

---

### Task 1: Theme State Utilities

**Files:**
- Create: `lib/theme.ts`
- Create: `tests/theme.test.ts`

**Interfaces:**
- Produces: `type Theme = "light" | "dark"`
- Produces: `const THEME_STORAGE_KEY = "codex-project-2-theme"`
- Produces: `function isTheme(value: unknown): value is Theme`
- Produces: `function resolveInitialTheme(storedTheme: unknown, prefersDark: boolean): Theme`
- Produces: `function getNextTheme(theme: Theme): Theme`
- Produces: `function applyTheme(theme: Theme, root: Pick<Document["documentElement"], "classList">): void`
- Produces: `function readStoredTheme(storage: Pick<Storage, "getItem">): Theme | null`
- Produces: `function storeTheme(theme: Theme, storage: Pick<Storage, "setItem">): void`

- [ ] **Step 1: Write the failing tests**

Create `tests/theme.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import {
  THEME_STORAGE_KEY,
  applyTheme,
  getNextTheme,
  isTheme,
  readStoredTheme,
  resolveInitialTheme,
  storeTheme
} from "@/lib/theme";

describe("theme utilities", () => {
  it("recognizes only supported themes", () => {
    expect(isTheme("light")).toBe(true);
    expect(isTheme("dark")).toBe(true);
    expect(isTheme("system")).toBe(false);
    expect(isTheme(null)).toBe(false);
  });

  it("uses a saved theme before system preference", () => {
    expect(resolveInitialTheme("light", true)).toBe("light");
    expect(resolveInitialTheme("dark", false)).toBe("dark");
  });

  it("falls back to system preference when saved theme is missing or invalid", () => {
    expect(resolveInitialTheme(null, true)).toBe("dark");
    expect(resolveInitialTheme(undefined, false)).toBe("light");
    expect(resolveInitialTheme("sepia", true)).toBe("dark");
  });

  it("returns the opposite theme for manual toggling", () => {
    expect(getNextTheme("light")).toBe("dark");
    expect(getNextTheme("dark")).toBe("light");
  });

  it("applies the dark class only for dark mode", () => {
    const classList = {
      add: vi.fn(),
      remove: vi.fn()
    };

    applyTheme("dark", { classList });
    expect(classList.add).toHaveBeenCalledWith("dark");

    applyTheme("light", { classList });
    expect(classList.remove).toHaveBeenCalledWith("dark");
  });

  it("reads only valid stored themes", () => {
    expect(readStoredTheme({ getItem: () => "dark" })).toBe("dark");
    expect(readStoredTheme({ getItem: () => "system" })).toBeNull();
  });

  it("stores the chosen theme under the shared key", () => {
    const storage = { setItem: vi.fn() };

    storeTheme("dark", storage);

    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, "dark");
  });
});
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- tests/theme.test.ts`

Expected: FAIL because `@/lib/theme` does not exist.

- [ ] **Step 3: Implement the theme utility module**

Create `lib/theme.ts`:

```ts
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "codex-project-2-theme";

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

export function resolveInitialTheme(storedTheme: unknown, prefersDark: boolean): Theme {
  if (isTheme(storedTheme)) {
    return storedTheme;
  }

  return prefersDark ? "dark" : "light";
}

export function getNextTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}

export function applyTheme(theme: Theme, root: Pick<Document["documentElement"], "classList">): void {
  if (theme === "dark") {
    root.classList.add("dark");
    return;
  }

  root.classList.remove("dark");
}

export function readStoredTheme(storage: Pick<Storage, "getItem">): Theme | null {
  const storedTheme = storage.getItem(THEME_STORAGE_KEY);

  return isTheme(storedTheme) ? storedTheme : null;
}

export function storeTheme(theme: Theme, storage: Pick<Storage, "setItem">): void {
  storage.setItem(THEME_STORAGE_KEY, theme);
}
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `npm test -- tests/theme.test.ts`

Expected: PASS for all `theme utilities` tests.

- [ ] **Step 5: Run lint for the new files**

Run: `npm run lint -- tests/theme.test.ts lib/theme.ts`

Expected: PASS with no ESLint errors.

---

### Task 2: Theme Toggle Component

**Files:**
- Create: `components/theme-toggle.tsx`

**Interfaces:**
- Consumes: `Theme`, `applyTheme`, `getNextTheme`, `readStoredTheme`, `resolveInitialTheme`, `storeTheme` from `lib/theme.ts`
- Produces: `function ThemeToggle(): JSX.Element`

- [ ] **Step 1: Create the client component**

Create `components/theme-toggle.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import {
  type Theme,
  applyTheme,
  getNextTheme,
  readStoredTheme,
  resolveInitialTheme,
  storeTheme
} from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = readStoredTheme(window.localStorage);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = resolveInitialTheme(storedTheme, prefersDark);

    applyTheme(initialTheme, document.documentElement);
    setTheme(initialTheme);
  }, []);

  const nextTheme = getNextTheme(theme);
  const nextThemeLabel = nextTheme === "dark" ? "暗色" : "浅色";

  function handleClick() {
    const updatedTheme = getNextTheme(theme);

    applyTheme(updatedTheme, document.documentElement);
    storeTheme(updatedTheme, window.localStorage);
    setTheme(updatedTheme);
  }

  return (
    <button
      aria-label={`切换到${nextThemeLabel}模式`}
      className="inline-flex min-h-9 items-center justify-center rounded-full border border-border bg-card px-3 text-xs font-bold text-muted-foreground shadow-sm transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      type="button"
      onClick={handleClick}
    >
      {nextThemeLabel}
    </button>
  );
}
```

- [ ] **Step 2: Run lint for the component**

Run: `npm run lint -- components/theme-toggle.tsx`

Expected: PASS with no ESLint errors.

---

### Task 3: Root Layout Theme Bootstrap

**Files:**
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `ThemeToggle` from `components/theme-toggle.tsx`
- Consumes: `THEME_STORAGE_KEY` value, but duplicates the literal key inside inline script because the script runs as raw browser JavaScript before modules hydrate.
- Produces: `<html lang="zh-CN" suppressHydrationWarning>` with pre-hydration theme script.

- [ ] **Step 1: Modify imports and add the initialization script**

Update `app/layout.tsx` near the imports:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const themeInitScript = `
  (function() {
    try {
      var storageKey = "codex-project-2-theme";
      var storedTheme = window.localStorage.getItem(storageKey);
      var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      var theme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : prefersDark ? "dark" : "light";
      document.documentElement.classList.toggle("dark", theme === "dark");
    } catch (error) {
      document.documentElement.classList.remove("dark");
    }
  })();
`;
```

- [ ] **Step 2: Update the HTML and body start**

Change the root return so `<html>` suppresses expected hydration differences, and the script runs before visible page content:

```tsx
return (
  <html lang="zh-CN" suppressHydrationWarning>
    <body>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      <div className="mx-auto flex min-h-screen w-[calc(100%-2rem)] max-w-6xl flex-col">
```

- [ ] **Step 3: Place the theme toggle beside navigation**

Replace the current `<nav>` block in `app/layout.tsx` with:

```tsx
<div className="flex items-center gap-4">
  <nav className="flex gap-5 text-sm font-medium text-muted-foreground" aria-label="主导航">
    <Link className="transition-colors hover:text-primary" href="/">
      首页
    </Link>
    <Link className="transition-colors hover:text-primary" href="/posts">
      文章
    </Link>
  </nav>
  <ThemeToggle />
</div>
```

- [ ] **Step 4: Run lint for layout and component**

Run: `npm run lint -- app/layout.tsx components/theme-toggle.tsx lib/theme.ts`

Expected: PASS with no ESLint errors.

---

### Task 4: Minimal Visual Theme Tokens

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `.dark` class on `<html>` from Tasks 2 and 3.
- Produces: Light and dark CSS variables used by Tailwind utility classes such as `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, and `ring-ring`.

- [ ] **Step 1: Replace the theme tokens**

Update the `@theme` block in `app/globals.css` to use the new cool minimal light palette:

```css
@theme {
  --color-background: oklch(98.5% 0.008 247);
  --color-foreground: oklch(18% 0.032 260);
  --color-card: oklch(100% 0 0);
  --color-card-foreground: oklch(18% 0.032 260);
  --color-popover: oklch(100% 0 0);
  --color-popover-foreground: oklch(18% 0.032 260);
  --color-primary: oklch(50% 0.18 265);
  --color-primary-foreground: oklch(99% 0.004 247);
  --color-secondary: oklch(94.5% 0.018 250);
  --color-secondary-foreground: oklch(28% 0.05 260);
  --color-muted: oklch(93.8% 0.012 250);
  --color-muted-foreground: oklch(48% 0.035 257);
  --color-accent: oklch(92.5% 0.035 265);
  --color-accent-foreground: oklch(30% 0.09 265);
  --color-destructive: oklch(57.7% 0.245 27.3);
  --color-destructive-foreground: oklch(99% 0.004 247);
  --color-border: oklch(88.5% 0.018 250);
  --color-input: oklch(88.5% 0.018 250);
  --color-ring: oklch(56% 0.17 265);
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-2xl: 2rem;
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

- [ ] **Step 2: Add dark mode token overrides**

Add this inside `@layer base` before the `*` rule:

```css
:root {
  color-scheme: light;
}

.dark {
  color-scheme: dark;
  --color-background: oklch(14.5% 0.028 260);
  --color-foreground: oklch(94.5% 0.012 250);
  --color-card: oklch(19% 0.035 260);
  --color-card-foreground: oklch(94.5% 0.012 250);
  --color-popover: oklch(19% 0.035 260);
  --color-popover-foreground: oklch(94.5% 0.012 250);
  --color-primary: oklch(72% 0.14 265);
  --color-primary-foreground: oklch(16% 0.035 260);
  --color-secondary: oklch(25% 0.038 260);
  --color-secondary-foreground: oklch(91% 0.018 250);
  --color-muted: oklch(24% 0.032 260);
  --color-muted-foreground: oklch(70% 0.028 255);
  --color-accent: oklch(28% 0.055 265);
  --color-accent-foreground: oklch(88% 0.05 265);
  --color-destructive: oklch(62% 0.22 27.3);
  --color-destructive-foreground: oklch(98% 0.01 250);
  --color-border: oklch(30% 0.035 260);
  --color-input: oklch(30% 0.035 260);
  --color-ring: oklch(72% 0.14 265);
}
```

- [ ] **Step 3: Replace the body background with a cool minimal treatment**

Update the `body` rule:

```css
body {
  min-height: 100vh;
  margin: 0;
  background:
    radial-gradient(circle at top left, color-mix(in oklch, var(--color-primary) 10%, transparent), transparent 30rem),
    radial-gradient(circle at bottom right, color-mix(in oklch, var(--color-accent) 26%, transparent), transparent 34rem),
    linear-gradient(180deg, var(--color-background), color-mix(in oklch, var(--color-background) 92%, var(--color-card)));
  color: var(--color-foreground);
  font-family: var(--font-sans);
  text-rendering: optimizeLegibility;
}
```

- [ ] **Step 4: Polish article body states**

Keep the existing `.article-body` structure, but update or add these rules so long-form reading works in both themes:

```css
.article-body {
  color: var(--color-foreground);
  font-size: 1.075rem;
  line-height: 1.85;
}

.article-body p {
  margin: 0 0 1.35rem;
  color: var(--color-muted-foreground);
}

.article-body a {
  color: var(--color-primary);
  font-weight: 700;
  text-decoration-line: underline;
  text-decoration-color: color-mix(in oklch, var(--color-primary) 35%, transparent);
}

.article-body a:hover {
  text-decoration-color: var(--color-primary);
}
```

- [ ] **Step 5: Run lint and tests after CSS changes**

Run: `npm run lint`

Expected: PASS with no ESLint errors.

Run: `npm test`

Expected: PASS for existing post tests and new theme utility tests.

---

### Task 5: Manual Visual Verification

**Files:**
- No code changes expected.

**Interfaces:**
- Consumes: implemented theme behavior and global styles from Tasks 1-4.
- Produces: confidence that user-facing pages match the confirmed design.

- [ ] **Step 1: Start the local dev server**

Run: `npm run dev`

Expected: Next.js dev server starts and prints a local URL.

- [ ] **Step 2: Verify first-visit system behavior**

In a browser with no saved `codex-project-2-theme` value:

1. Set OS or browser emulation to light mode.
2. Load `/`.
3. Confirm `<html>` does not have the `dark` class and the button displays「暗色」.
4. Set OS or browser emulation to dark mode.
5. Reload `/`.
6. Confirm `<html>` has the `dark` class and the button displays「浅色」.

- [ ] **Step 3: Verify manual override persistence**

In the same browser:

1. Click the theme button.
2. Confirm the page switches theme immediately.
3. Reload the page.
4. Confirm the selected theme remains active.
5. Confirm `localStorage.getItem("codex-project-2-theme")` returns `"light"` or `"dark"`.

- [ ] **Step 4: Verify primary pages**

Visit these routes:

- `/`
- `/posts`
- One article URL from the archive, such as `/posts/hello-nextjs-blog`

Expected:

- Cards use the cooler minimal palette and lighter borders.
- Links and buttons use the blue-violet primary color.
- Metadata and descriptions remain readable in both themes.
- The article page remains focused and comfortable for long-form reading.
- The theme button is keyboard-focusable and has a visible focus ring.

---

## Self-Review

- Spec coverage: Tasks 1-3 implement the theme precedence, manual toggle, persistence, and hydration timing. Task 4 implements the B visual direction through tokens and global styles. Task 5 covers manual verification across the requested pages and theme states.
- Placeholder scan: The plan contains no `TBD`, `TODO`, or unresolved open decisions.
- Type consistency: `Theme`, `THEME_STORAGE_KEY`, `resolveInitialTheme`, `getNextTheme`, `applyTheme`, `readStoredTheme`, and `storeTheme` are defined in Task 1 and consumed consistently in later tasks.
