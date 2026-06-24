"use client";

import { useSyncExternalStore } from "react";
import {
  type Theme,
  applyTheme,
  getNextTheme,
  readStoredTheme,
  resolveInitialTheme,
  storeTheme
} from "@/lib/theme";

const THEME_CHANGE_EVENT = "theme-toggle-change";
const DARK_MODE_QUERY = "(prefers-color-scheme: dark)";

function getServerSnapshot(): Theme {
  return "light";
}

function getStoredThemeFromBrowser(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return readStoredTheme(window.localStorage);
  } catch {
    return null;
  }
}

function getPrefersDarkSnapshot(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  try {
    return window.matchMedia(DARK_MODE_QUERY).matches;
  } catch {
    return false;
  }
}

function getMediaQueryList(): MediaQueryList | null {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return null;
  }

  try {
    return window.matchMedia(DARK_MODE_QUERY);
  } catch {
    return null;
  }
}

function getBrowserSnapshot(): Theme {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "light";
  }

  if (document.documentElement.classList.contains("dark")) {
    return "dark";
  }

  const storedTheme = getStoredThemeFromBrowser();
  const prefersDark = getPrefersDarkSnapshot();

  return resolveInitialTheme(storedTheme, prefersDark);
}

function subscribe(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const mediaQuery = getMediaQueryList();
  const handleThemeChange = () => {
    onStoreChange();
  };
  const handleSystemThemeChange = (event?: MediaQueryListEvent) => {
    if (getStoredThemeFromBrowser() === null && typeof document !== "undefined") {
      const prefersDark = event ? event.matches : getPrefersDarkSnapshot();
      const resolvedTheme = resolveInitialTheme(null, prefersDark);
      applyTheme(resolvedTheme, document.documentElement);
      onStoreChange();
    }
  };

  window.addEventListener(THEME_CHANGE_EVENT, handleThemeChange);
  if (mediaQuery) {
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handleThemeChange);
    if (mediaQuery) {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    }
  };
}

export function ThemeToggle(): JSX.Element {
  const theme = useSyncExternalStore(subscribe, getBrowserSnapshot, getServerSnapshot);

  const nextTheme = getNextTheme(theme);
  const nextThemeLabel = nextTheme === "dark" ? "暗色" : "浅色";

  function handleClick() {
    const updatedTheme = getNextTheme(theme);

    applyTheme(updatedTheme, document.documentElement);
    try {
      storeTheme(updatedTheme, window.localStorage);
    } catch {
      // Keep DOM/state updates even if storage access itself is blocked.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
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
