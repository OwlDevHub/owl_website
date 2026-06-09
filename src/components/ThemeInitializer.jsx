import { useEffect } from "react";

const ThemeInitializer = () => {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  return null;
};

export default ThemeInitializer;
