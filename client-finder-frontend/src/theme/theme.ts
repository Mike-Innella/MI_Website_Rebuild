import { createTheme } from "@mui/material/styles";

const LIGHT = {
  mode: "light",
  primary: { main: "#0B3D91", dark: "#062B6A", light: "#2F6BC4" },
  secondary: { main: "#F97316" },
  background: {
    default: "var(--page-bg)",
    paper: "var(--surface-1)",
  },
  text: {
    primary: "#0B1220",
    secondary: "#334155",
  },
  divider: "#E2E8F0",
};

const DARK = {
  mode: "dark",
  primary: { main: "#5DA9FF", dark: "#2B6CB0", light: "#8CC2FF" },
  secondary: { main: "#FDBA74" },
  background: {
    default: "var(--page-bg)",
    paper: "var(--surface-1)",
  },
  text: {
    primary: "#E5E7EB",
    secondary: "#A1A1AA",
  },
  divider: "#2F3642",
};

export const getAppTheme = (mode = "light") => {
  const palette = (mode === "dark" ? DARK : LIGHT) as any;
  const shadows = Array.from({ length: 25 }, (_, index) => {
    if (index === 0) return "none";
    if (index < 4) {
      return mode === "dark"
        ? "0 10px 30px rgba(0, 0, 0, 0.35)"
        : "0 10px 30px rgba(15, 23, 42, 0.12)";
    }
    return mode === "dark"
      ? "0 18px 45px rgba(0, 0, 0, 0.4)"
      : "0 18px 45px rgba(15, 23, 42, 0.16)";
  }) as any;

  return createTheme({
    palette,
    shadows,
    shape: {
      borderRadius: 16,
    },
    typography: {
      fontFamily: "var(--font-body)",
      h1: {
        fontFamily: "var(--font-head)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        fontSize: "clamp(2.4rem, 1.6rem + 2.8vw, 4rem)",
      },
      h2: {
        fontFamily: "var(--font-head)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        fontSize: "clamp(2rem, 1.4rem + 2.2vw, 3.4rem)",
      },
      h3: {
        fontFamily: "var(--font-head)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        fontSize: "clamp(1.7rem, 1.2rem + 1.6vw, 2.6rem)",
      },
      h4: {
        fontFamily: "var(--font-head)",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        fontSize: "clamp(1.5rem, 1.15rem + 1.2vw, 2.1rem)",
      },
      h5: {
        fontWeight: 700,
        letterSpacing: "-0.015em",
        fontSize: "clamp(1.25rem, 1.05rem + 0.8vw, 1.6rem)",
      },
      h6: {
        fontWeight: 700,
        letterSpacing: "-0.01em",
        fontSize: "clamp(1.05rem, 0.95rem + 0.6vw, 1.35rem)",
      },
      subtitle1: { fontSize: "clamp(1rem, 0.95rem + 0.3vw, 1.1rem)" },
      body1: { fontSize: "clamp(1rem, 0.95rem + 0.25vw, 1.05rem)" },
      body2: { fontSize: "clamp(0.95rem, 0.9rem + 0.2vw, 1rem)" },
      button: { textTransform: "none", fontWeight: 700, fontSize: "clamp(0.95rem, 0.9rem + 0.2vw, 1rem)" },
      overline: { fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase" },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            color: palette.text.primary,
            backgroundColor: palette.background.default,
            backgroundImage:
              mode === "dark"
                ? "radial-gradient(circle at top, rgba(93, 169, 255, 0.12), transparent 50%), radial-gradient(circle at 20% 20%, rgba(253, 186, 116, 0.08), transparent 45%)"
                : "radial-gradient(circle at top, rgba(11, 61, 145, 0.1), transparent 45%), radial-gradient(circle at 20% 20%, rgba(249, 115, 22, 0.1), transparent 40%)",
            backgroundAttachment: "fixed",
          },
        },
      },
      MuiContainer: {
        defaultProps: {
          maxWidth: "lg",
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 999,
            minHeight: 44,
            paddingLeft: 18,
            paddingRight: 18,
            paddingTop: 10,
            paddingBottom: 10,
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow:
                mode === "dark"
                  ? "0 12px 24px rgba(0, 0, 0, 0.35)"
                  : "0 12px 24px rgba(15, 23, 42, 0.12)",
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
          variant: "outlined",
        },
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: `1px solid ${palette.divider}`,
            boxShadow: "var(--shadow-soft)",
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            border: "none",
            boxShadow: "none",
          },
        },
      },
      MuiCard: {
        defaultProps: {
          elevation: 0,
          variant: "outlined",
        },
        styleOverrides: {
          root: {
            borderRadius: 18,
            border: `1px solid ${palette.divider}`,
            boxShadow: "var(--shadow-soft)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "@media (hover: hover) and (pointer: fine)": {
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "var(--shadow-strong)",
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: ({ ownerState }) => ({
            borderRadius: 999,
            fontWeight: 600,
            backgroundColor:
              ownerState.color === "default" && ownerState.variant !== "outlined"
                ? mode === "dark"
                  ? "rgba(93, 169, 255, 0.14)"
                  : "rgba(11, 61, 145, 0.08)"
                : undefined,
            "&.MuiChip-outlined": {
              backgroundColor: "transparent",
            },
          }),
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "outlined",
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 14,
          },
        },
      },
    },
  });
};
