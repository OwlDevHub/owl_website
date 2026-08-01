import { useEffect } from "react";

const ThemeInitializer = () => {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    document.documentElement.classList.remove("light");
    if (saved === "light") {
      document.documentElement.classList.add("light");
    }
  }, []);

  return null;
};

export default ThemeInitializer;
