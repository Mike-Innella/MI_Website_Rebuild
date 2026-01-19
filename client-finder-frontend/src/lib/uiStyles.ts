export const surfaceGradient = (mode, tint = "blue") => {
  if (tint === "orange") {
    return mode === "dark"
      ? "linear-gradient(140deg, rgba(253, 186, 116, 0.18), rgba(17, 22, 31, 0.86))"
      : "linear-gradient(140deg, rgba(249, 115, 22, 0.12), rgba(255, 255, 255, 0.86))";
  }
  return mode === "dark"
    ? "linear-gradient(140deg, rgba(93, 169, 255, 0.16), rgba(17, 22, 31, 0.86))"
    : "linear-gradient(140deg, rgba(11, 61, 145, 0.12), rgba(255, 255, 255, 0.86))";
};

export const cardPad = { xs: 2.5, md: 3 };
export const cardPadTight = { xs: 2, md: 2.5 };

export const subtleOutline = {
  border: "1px solid",
  borderColor: "divider",
};

export const primarySurface = (mode) => ({
  border: "1px solid",
  borderColor: mode === "dark" ? "rgba(93, 169, 255, 0.45)" : "rgba(11, 61, 145, 0.24)",
  background: surfaceGradient(mode),
  backgroundColor: mode === "dark" ? "rgba(17, 22, 31, 0.68)" : "rgba(255, 255, 255, 0.7)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)",
  boxShadow:
    mode === "dark"
      ? "var(--shadow-strong), 0 0 0 1px rgba(93, 169, 255, 0.3)"
      : "var(--shadow-strong)",
});

export const secondarySurface = {
  border: "1px solid",
  borderColor: "divider",
  backgroundColor: "background.paper",
  boxShadow: "var(--shadow-soft)",
};

export const mutedSurface = (mode) => ({
  border: "1px solid",
  backgroundColor: mode === "dark" ? "rgba(15, 23, 42, 0.25)" : "rgba(15, 23, 42, 0.02)",
  borderColor: "divider",
  boxShadow: "none",
  opacity: 0.8,
  filter: "saturate(0.85)",
});
