import { useEffect } from "react";

const THEMES = {
  "mono-dark": [],
  "mono-light": ["light"],
  "everforest-dark": ["everforest"],
  "everforest-light": ["everforest", "light"],
};

const ThemeInitializer = () => {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    document.documentElement.classList.remove("light", "everforest");
    if (saved && THEMES[saved]) {
      THEMES[saved].forEach((c) => document.documentElement.classList.add(c));
    }
  }, []);

  return null;
};

export default ThemeInitializer;
