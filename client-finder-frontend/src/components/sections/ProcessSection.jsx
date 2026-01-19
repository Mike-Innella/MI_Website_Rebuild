"use client";

import { useState } from "react";
import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import Section from "@/components/layout/Section";
import { maxHeroWidth } from "@/lib/layoutTokens";
import { secondarySurface } from "@/lib/uiStyles";

const steps = [
  {
    title: "Send your current website",
    detail: "Share your URL and the biggest issues you see today.",
    outcome: { label: "Send", icon: FactCheckOutlinedIcon },
  },
  {
    title: "I rebuild it in 7 days",
    detail: "Copy, design, and speed tuned for more calls and inquiries.",
    outcome: { label: "Rebuild", icon: ConstructionOutlinedIcon },
  },
  {
    title: "You approve changes",
    detail: "One focused review round so nothing slows down.",
    outcome: { label: "Approve", icon: AutoFixHighOutlinedIcon },
  },
  {
    title: "Site goes live + I handle hosting",
    detail: "Launch, hosting, and small updates handled for you.",
    outcome: { label: "Launch", icon: RocketLaunchOutlinedIcon },
  },
];

export default function ProcessSection() {
  const theme = useTheme();
  const lightMode = theme.palette.mode === "light";
  const [activeIndex, setActiveIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);

  return (
    <Section
      id="process"
      eyebrow="Process"
      title="How it works"
      subtitle="A simple, predictable process that gets you live fast."
      variant="tinted"
      disableSpine
    >
      <Box sx={{ maxWidth: maxHeroWidth, mx: "auto", position: "relative" }}>
        <Box
          sx={{
            display: "none",
          }}
        />
        <Stack spacing={3} alignItems={{ xs: "stretch", md: "flex-end" }}>
          {steps.map((step, index) => {
            const isActive = activeIndex === index;
            const isHovered = hoverIndex === index;
            const isEmphasized = isActive || isHovered;
            const showBadge = true;
            const OutcomeIcon = step.outcome.icon;
            const borderTint = lightMode
              ? alpha(theme.palette.primary.main, 0.14 + index * 0.05)
              : alpha(theme.palette.primary.main, 0.22 + index * 0.06);
            return (
              <Box
                key={step.title}
                className="reveal"
                style={{ "--delay": `${80 + index * 80}ms` }}
                sx={{
                  position: "relative",
                  mt: { xs: 0, md: index % 2 === 0 ? 0 : 1.5 },
                  pt: { xs: 11, sm: 0 },
                  overflow: "visible",
                  width: "100%",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: { xs: "50%", sm: 0 },
                    top: { xs: 0, sm: 24 },
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: isActive
                      ? "primary.main"
                      : lightMode
                        ? "rgba(255, 255, 255, 0.55)"
                        : "rgba(15, 23, 42, 0.55)",
                    backdropFilter: isActive ? "none" : "blur(8px)",
                    WebkitBackdropFilter: isActive ? "none" : "blur(8px)",
                    border: isActive ? "none" : "1px solid",
                    borderColor: isActive ? "transparent" : "divider",
                    boxShadow: "var(--shadow-strong)",
                    zIndex: 3,
                    opacity: showBadge ? 1 : 0,
                    transform: showBadge
                      ? { xs: "translateX(-50%) scale(1)", sm: "scale(1)" }
                      : { xs: "translateX(-50%) scale(0.92)", sm: "scale(0.92)" },
                    transition:
                      "opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                    pointerEvents: "none",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={800}
                    color={isActive ? "common.white" : "text.primary"}
                    sx={{ fontSize: "1.25rem", transition: "color 0.3s ease" }}
                  >
                    {index + 1}
                  </Typography>
                </Box>
                <Card
                  tabIndex={0}
                  onClick={() => {
                    setActiveIndex((prev) => (prev === index ? null : index));
                  }}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  onFocus={() => setHoverIndex(index)}
                  onBlur={() => setHoverIndex(null)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setActiveIndex((prev) => (prev === index ? null : index));
                    }
                  }}
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "auto",
                    cursor: "pointer",
                    width: { xs: "100%", md: "88%" },
                    ml: { xs: 0, md: "auto" },
                    mr: { xs: 0, md: 0 },
                    ...secondarySurface,
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: isActive ? alpha(theme.palette.primary.main, 0.75) : borderTint,
                    boxShadow: isEmphasized ? "var(--shadow-strong)" : "var(--shadow-soft)",
                    transform: isActive
                      ? { xs: "translateY(-2px)", md: "translateX(40px) scale(1.03)" }
                      : isHovered
                        ? { xs: "translateY(-1px)", md: "translateX(20px) scale(1.01)" }
                        : "none",
                    backgroundColor: "background.paper",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                    "@media (hover: hover) and (pointer: fine)": {
                      "&:hover": {
                        transform: isActive
                          ? { xs: "translateY(-2px)", md: "translateX(40px) scale(1.03)" }
                          : { xs: "translateY(-1px)", md: "translateX(20px) scale(1.01)" },
                      },
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      height: "100%",
                      flex: 1,
                      pl: { xs: 3, md: 4 },
                      py: isActive ? { xs: 2.5, md: 3 } : { xs: 1.5, md: 2 },
                    }}
                  >
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: { xs: "1fr", sm: "1fr 1.8fr 0.7fr" },
                        columnGap: { xs: 1.5, sm: 2 },
                        rowGap: { xs: 1.25, sm: 0 },
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h6" sx={{ fontSize: "1.05rem", lineHeight: 1.3 }}>
                          {step.title}
                        </Typography>
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: "0.95rem",
                            whiteSpace: { xs: "normal", md: "nowrap" },
                            opacity: isActive ? 1 : 0.55,
                            filter: isActive ? "blur(0px)" : "blur(3px)",
                            transform: isActive ? "translateY(0)" : "translateY(-4px)",
                            transition: "opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease",
                          }}
                        >
                          {step.detail}
                        </Typography>
                      </Box>
                      <Stack
                        spacing={0.6}
                        alignItems={{ xs: "center", sm: "center" }}
                        sx={{
                          minWidth: 0,
                          justifySelf: { xs: "center", sm: "end" },
                        }}
                      >
                        <Box
                          sx={{
                            width: 52,
                            height: 52,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: lightMode
                              ? "rgba(11, 61, 145, 0.06)"
                              : "rgba(93, 169, 255, 0.1)",
                            color: isActive ? "primary.main" : "text.disabled",
                            opacity: isActive ? 1 : 0.55,
                            transition: "opacity 0.3s ease, color 0.3s ease",
                          }}
                        >
                          <OutcomeIcon
                            sx={{
                              fontSize: 28,
                              transform: isActive ? "scale(1.05)" : "scale(1)",
                              transition: "transform 0.3s ease",
                            }}
                          />
                        </Box>
                        <Typography
                          variant="subtitle2"
                          sx={{
                            letterSpacing: "0.01em",
                            color: "text.secondary",
                            opacity: isActive ? 0.85 : 0.6,
                            transition: "opacity 0.3s ease, color 0.3s ease",
                          }}
                        >
                          {step.outcome.label}
                        </Typography>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Stack>
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              const el = document.getElementById("cta");
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Get a free site review
          </Button>
        </Box>
      </Box>
    </Section>
  );
}
