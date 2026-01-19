"use client";

import Image from "next/image";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import { maxHeroWidth, maxTextWidth, sectionPaddingY } from "@/lib/layoutTokens";
import { cardPad, mutedSurface, primarySurface } from "@/lib/uiStyles";

const previewSteps = [
  { label: "This is what I fix", detail: "Problem signals", sectionId: "problems" },
  { label: "This is how it changes", detail: "7-day rebuild", sectionId: "offer" },
  { label: "This is the outcome", detail: "Clarity + contact", sectionId: "proof" },
];

const heroHighlights = [
  { icon: BoltOutlinedIcon, label: "7-day turnaround", accent: true },
  { icon: PhoneIphoneOutlinedIcon, label: "Mobile-first" },
  { icon: TrackChangesOutlinedIcon, label: "Lead-focused" },
];

export default function HeroSection() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [showPricing, setShowPricing] = useState(false);

  useEffect(() => {
    const revealTimeout = window.setTimeout(() => setShowPricing(true), 1200);
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setShowPricing(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.clearTimeout(revealTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % previewSteps.length);
    }, 2800);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const scrollToCta = () => {
    const el = document.getElementById("cta");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box
      component="section"
      sx={{
        py: sectionPaddingY,
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: "relative",
        overflow: "hidden",
        background:
          theme.palette.mode === "dark"
            ? `linear-gradient(180deg, rgba(93, 169, 255, 0.18) 0%, ${theme.palette.background.default} 100%)`
            : `linear-gradient(180deg, rgba(11, 61, 145, 0.16) 0%, ${theme.palette.background.default} 100%)`,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: { xs: -120, md: -160 },
          right: { xs: -80, md: -120 },
          width: { xs: 220, md: 320 },
          height: { xs: 220, md: 320 },
          borderRadius: "50%",
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(circle, rgba(93, 169, 255, 0.35), transparent 70%)"
              : "radial-gradient(circle, rgba(11, 61, 145, 0.3), transparent 70%)",
          opacity: 0.7,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            theme.palette.mode === "dark"
              ? "radial-gradient(1200px at 20% -10%, rgba(93, 169, 255, 0.18), transparent 60%), radial-gradient(900px at 80% 0%, rgba(253, 186, 116, 0.12), transparent 55%)"
              : "radial-gradient(1200px at 20% -10%, rgba(11, 61, 145, 0.16), transparent 60%), radial-gradient(900px at 80% 0%, rgba(249, 115, 22, 0.12), transparent 55%)",
          opacity: 0.65,
          pointerEvents: "none",
        }}
      />
      <Container maxWidth="lg" className="ui-max" sx={{ px: { xs: 2, md: 3 } }}>
        <Grid
          container
          spacing={{ xs: 5, md: 7 }}
          alignItems="flex-start"
          sx={{ maxWidth: maxHeroWidth, mx: "auto" }}
        >
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3} sx={{ maxWidth: { xs: "100%", md: 720 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems="stretch"
                className="reveal"
                style={{ "--delay": "40ms" }}
                sx={{ width: "100%", maxWidth: { xs: "100%", md: 560 } }}
              >
                {heroHighlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Paper
                      key={item.label}
                      variant="outlined"
                      sx={{
                        borderRadius: "var(--radius-pill)",
                        px: 2,
                        py: 0.75,
                        borderColor: "divider",
                        boxShadow: "none",
                        bgcolor:
                          theme.palette.mode === "dark"
                            ? "rgba(15, 23, 42, 0.45)"
                            : "rgba(15, 23, 42, 0.04)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.75,
                        flex: 1,
                        minWidth: 0,
                        textAlign: "center",
                      }}
                    >
                      <Icon fontSize="small" color={item.accent ? "primary" : "action"} />
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, color: item.accent ? "text.primary" : "text.secondary" }}
                      >
                        {item.label}
                      </Typography>
                    </Paper>
                  );
                })}
              </Stack>

              <Typography
                variant="h2"
                fontWeight={900}
                sx={{
                  letterSpacing: "-0.03em",
                  lineHeight: 1.05,
                  maxWidth: { xs: "100%", md: 620 },
                  color: theme.palette.mode === "dark" ? "common.white" : "text.primary",
                }}
                className="reveal"
                style={{ "--delay": "120ms" }}
              >
                I rebuild outdated websites for small businesses so customers can actually find and contact you.
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  maxWidth: maxTextWidth,
                  color:
                    theme.palette.mode === "dark"
                      ? "rgba(229, 231, 235, 0.8)"
                      : "text.secondary",
                }}
                className="reveal"
                style={{ "--delay": "200ms" }}
              >
                Fast, modern, and clear. You get a polished site that looks sharp on every device and makes it easy to
                take the next step.
              </Typography>

              <Box
                className="reveal"
                style={{ "--delay": "260ms" }}
                sx={{
                  pt: 3,
                  pb: 1.5,
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    onClick={scrollToCta}
                  >
                    Send my site for a free review
                  </Button>
                  <Button
                    variant="text"
                    size="large"
                    onClick={() => {
                      const el = document.getElementById("pricing");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    sx={{
                      color: "text.secondary",
                      opacity: showPricing ? 1 : 0,
                      transform: showPricing ? "translateY(0)" : "translateY(8px)",
                      transition: "opacity 0.5s ease, transform 0.5s ease",
                      ml: { sm: "auto" },
                    }}
                  >
                    See pricing
                  </Button>
                </Stack>
              </Box>

              <Paper
                variant="outlined"
                className="reveal"
                style={{ "--delay": "360ms" }}
                sx={{
                  mt: 2,
                  p: 2,
                  borderRadius: "var(--radius-pill)",
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  width: "fit-content",
                  boxShadow: "var(--shadow-soft)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "@media (hover: hover) and (pointer: fine)": {
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "var(--shadow-strong)",
                    },
                  },
                }}
              >
                <Image
                  src={theme.palette.mode === "light" ? "/assets/MILogo_dark.png" : "/assets/MILogo.png"}
                  alt="MI Logo"
                  width={28}
                  height={28}
                  sizes="28px"
                  loading="lazy"
                />
                <Typography color="text.secondary">
                  Built for clarity, speed, and one action: contact you.
                </Typography>
              </Paper>
            </Stack>
          </Grid>
          <Grid
            size={{ xs: 12, md: 5 }}
            sx={{
              position: { md: "sticky" },
              top: { md: 104 },
              alignSelf: "flex-start",
            }}
          >
            <Stack
              spacing={2}
              className="reveal"
              style={{ "--delay": "200ms" }}
              sx={{ maxWidth: 520, ml: { md: "auto" } }}
            >
              <Paper
                variant="outlined"
                sx={{
                  ...primarySurface(theme.palette.mode),
                  p: cardPad,
                  borderRadius: "var(--radius-card)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  "@media (hover: hover) and (pointer: fine)": {
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "var(--shadow-strong)",
                    },
                  },
                  width: "100%",
                  position: "relative",
                  overflow: "hidden",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      theme.palette.mode === "dark"
                        ? "radial-gradient(circle at top right, rgba(93, 169, 255, 0.2), transparent 55%)"
                        : "radial-gradient(circle at top right, rgba(11, 61, 145, 0.18), transparent 55%)",
                    opacity: 0.7,
                    pointerEvents: "none",
                  },
                }}
              >
                <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
                  <Typography variant="overline" color="text.secondary">
                    Rebuild process
                  </Typography>
                  <Box sx={{ display: "grid", gap: 1.5 }}>
                    {previewSteps.map((step, index) => {
                      const isActive = activeStep === index;
                      return (
                        <Box
                          key={step.label}
                          sx={{
                            borderRadius: "var(--radius-panel)",
                            p: 1.5,
                            border: "1px solid",
                            borderColor: isActive ? "primary.main" : "divider",
                            backgroundColor: isActive
                              ? theme.palette.mode === "dark"
                                ? "rgba(93, 169, 255, 0.12)"
                                : "rgba(11, 61, 145, 0.08)"
                              : "transparent",
                            transition: "border 0.3s ease, background-color 0.3s ease",
                          }}
                        >
                          <Box
                            sx={{
                              display: "grid",
                              gridTemplateColumns: "auto 1fr",
                              columnGap: 1.5,
                              rowGap: 0.25,
                              alignItems: "center",
                            }}
                          >
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: "50%",
                                bgcolor: isActive ? "primary.main" : "divider",
                              }}
                            />
                            <Typography
                              variant="subtitle2"
                              color={isActive ? "text.primary" : "text.secondary"}
                              sx={{ fontWeight: 700 }}
                            >
                              {step.label}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ gridColumn: "2 / 3" }}
                            >
                              {step.detail}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Stack>
              </Paper>
              <Paper
                variant="outlined"
                sx={{
                  ...mutedSurface(theme.palette.mode),
                  p: cardPad,
                  borderRadius: "var(--radius-card)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  width: "100%",
                  "@media (hover: hover) and (pointer: fine)": {
                    "&:hover": {
                      transform: "translateY(-3px)",
                      boxShadow: "var(--shadow-strong)",
                    },
                  },
                }}
              >
                <Stack spacing={1.5}>
                  <Typography variant="overline" color="text.secondary">
                    Rebuild focus
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      "Clearer contact path",
                      "Mobile-first layout",
                      "Faster load target (90+ Lighthouse)",
                    ].map((item) => (
                      <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                          }}
                        />
                        <Typography color="text.secondary">{item}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
