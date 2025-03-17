import { createContext, useState, useContext, useEffect } from "react";

// Create a Context
const ThemeContext = createContext();

// Custom hook to use the ThemeContext
export const useTheme = () => useContext(ThemeContext);

// ThemeProvider Component
export const ThemeProvider = ({ children }) => {
  // Get stored theme from localStorage or default to "light"
  const storedTheme = localStorage.getItem("theme") || "light";

  // State to manage theme
  const [theme, setTheme] = useState(storedTheme);

  // Toggle Theme Function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme); // Persist theme in localStorage
  };

  // Apply theme class to the body
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
