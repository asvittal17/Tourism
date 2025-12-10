import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Determine initial theme by checking the pre-painted html class first,
  // then localStorage, then fallback to "light".
  const getInitial = () => {
    try {
      if (typeof window !== "undefined") {
        // If index.html pre-paint script already added 'dark', respect it.
        if (document.documentElement.classList.contains("dark")) return "dark";

        const stored = localStorage.getItem("tm_theme");
        if (stored === "dark" || stored === "light") return stored;

        // optional: respect OS preference if nothing stored or pre-painted
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
        }
      }
    } catch (e) {
      // ignore errors and fallback
    }
    return "light";
  };

  const [theme, setTheme] = useState(getInitial);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    try {
      localStorage.setItem("tm_theme", theme);
    } catch (e) {
      // ignore storage write errors
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
