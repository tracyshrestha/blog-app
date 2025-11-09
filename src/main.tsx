import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./App.css";

// Initialize theme before React renders to prevent flash
const initializeTheme = () => {
  const THEME_STORAGE_KEY = "blog-app-theme";
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const root = document.documentElement;

  let themeToApply;

  if (storedTheme === "light" || storedTheme === "dark") {
    themeToApply = storedTheme;
  } else {
    // Check system preference
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    themeToApply = prefersDark ? "dark" : "light";
    // Save system preference to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, themeToApply);
  }

  root.classList.remove("light", "dark");
  root.classList.add(themeToApply);
  root.setAttribute("data-theme", themeToApply);
};

initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
