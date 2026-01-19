"use client";

import * as React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getAppTheme } from "@/theme/theme";
import ThemeRegistry from "./ThemeRegistry";

const ThemeModeContext = React.createContext({
  mode: "light",
  toggleMode: () => {},
});

export function useThemeMode() {
  return React.useContext(ThemeModeContext);
}

const getStoredMode = () => {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem("themeMode");
  return saved === "light" || saved === "dark" ? saved : null;
};

const getSystemMode = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function Providers({ children }) {
  const [mode, setMode] = React.useState("light");
  const userPreferenceRef = React.useRef(false);

  React.useEffect(() => {
    const saved = getStoredMode();
    if (saved) {
      userPreferenceRef.current = true;
      setMode(saved);
      return;
    }
    setMode(getSystemMode());
  }, []);

  React.useEffect(() => {
    if (!userPreferenceRef.current) return;
    window.localStorage.setItem("themeMode", mode);
  }, [mode]);

  React.useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    if (!userPreferenceRef.current) {
      setMode(mediaQuery.matches ? "dark" : "light");
    }
    const handleChange = (event) => {
      if (userPreferenceRef.current) return;
      setMode(event.matches ? "dark" : "light");
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  const toggleMode = React.useCallback(() => {
    userPreferenceRef.current = true;
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const theme = React.useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeRegistry>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ThemeRegistry>
    </ThemeModeContext.Provider>
  );
}
