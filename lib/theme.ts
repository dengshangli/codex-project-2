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
  let storedTheme: string | null = null;

  try {
    storedTheme = storage.getItem(THEME_STORAGE_KEY);
  } catch {
    return null;
  }

  return isTheme(storedTheme) ? storedTheme : null;
}

export function storeTheme(theme: Theme, storage: Pick<Storage, "setItem">): void {
  try {
    storage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Ignore persistence failures and keep the in-memory/DOM theme updated.
  }
}
