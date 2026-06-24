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

  it("treats storage read errors as missing stored theme", () => {
    const storage = {
      getItem: () => {
        throw new Error("storage blocked");
      }
    };

    expect(readStoredTheme(storage)).toBeNull();
  });

  it("stores the chosen theme under the shared key", () => {
    const storage = { setItem: vi.fn() };

    storeTheme("dark", storage);

    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, "dark");
  });

  it("does not throw when storage write fails", () => {
    const storage = {
      setItem: vi.fn(() => {
        throw new Error("storage blocked");
      })
    };

    expect(() => storeTheme("dark", storage)).not.toThrow();
    expect(storage.setItem).toHaveBeenCalledWith(THEME_STORAGE_KEY, "dark");
  });
});
