"use client";

import * as React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { getAppTheme } from "@/theme/theme";
import ThemeRegistry from "./ThemeRegistry";

type ThemeMode = "light" | "dark";

const ThemeModeContext = React.createContext({
  mode: "light" as ThemeMode,
  toggleMode: () => {},
});

export function useThemeMode() {
  return React.useContext(ThemeModeContext);
}

const getStoredMode = () => {
  if (typeof window === "undefined") return null;
  const saved = window.localStorage.getItem("themeMode");
  return saved === "light" || saved === "dark" ? (saved as ThemeMode) : null;
};

const getSystemMode = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export default function Providers({ children }) {
  const [mode, setMode] = React.useState<ThemeMode>("light");
  const [isThemeReady, setIsThemeReady] = React.useState(false);
  const userPreferenceRef = React.useRef(false);

  React.useEffect(() => {
    const saved = getStoredMode();
    if (saved) {
      userPreferenceRef.current = true;
      setMode(saved);
      setIsThemeReady(true);
      return;
    }

    const attrMode = document.documentElement.dataset.theme;
    if (attrMode === "light" || attrMode === "dark") {
      setMode(attrMode);
    } else {
      setMode(getSystemMode());
    }
    setIsThemeReady(true);
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
          <div style={{ visibility: isThemeReady ? "visible" : "hidden" }}>
            {children}
          </div>
        </ThemeProvider>
      </ThemeRegistry>
    </ThemeModeContext.Provider>
  );
}
