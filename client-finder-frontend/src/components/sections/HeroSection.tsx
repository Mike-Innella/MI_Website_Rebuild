"use client";

import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { maxHeroWidth, maxTextWidth, sectionPaddingY } from "@/lib/layoutTokens";

const heroOptions = [
  {
    title: "My site needs credibility",
    caption:
      "You want it to look professional and trustworthy. Clean messaging, strong proof, and a modern layout make it feel legit.",
    targetId: "review",
    cta: "Request 5-minute review",
  },
  {
    title: "My site isn’t getting inquiries",
    caption:
      "You want more people to contact you. I’ll point out the drop-off points and tighten the path to your CTA.",
    targetId: "review",
    cta: "Request 5-minute review",
  },
  {
    title: "I’m ready to rebuild",
    caption:
      "You want a clear plan for the new site before starting. We’ll map pages, content priorities, and scope before design begins.",
    targetId: "review",
    cta: "Request 5-minute review",
  },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function HeroSection() {
  const theme = useTheme();

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
            ? `linear-gradient(180deg, rgba(93, 169, 255, 0.2) 0%, ${theme.palette.background.default} 100%)`
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
              : "radial-gradient(circle, rgba(11, 61, 145, 0.24), transparent 70%)",
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
        <Box sx={{ maxWidth: maxHeroWidth, mx: "auto" }}>
          <Stack spacing={{ xs: 3, md: 4 }} sx={{ textAlign: "left" }}>
            <Typography
              component="h1"
              variant="h1"
              fontWeight={900}
              sx={{
                letterSpacing: "-0.03em",
                lineHeight: 1.04,
                maxWidth: { xs: "100%", md: maxTextWidth },
              }}
              className="reveal"
            >
              Websites built to convert — delivered fast.
            </Typography>

            <Typography
              variant="h6"
              sx={{
                maxWidth: maxTextWidth,
                color: theme.palette.mode === "dark" ? "rgba(229, 231, 235, 0.82)" : "text.secondary",
              }}
              className="reveal"
              style={{ "--delay": "80ms" } as any}
            >
              If your site looks fine but isn’t generating inquiries, I’ll show you exactly why — in 5 minutes.
            </Typography>

            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              sx={{ mt: 1 }}
              className="reveal"
              style={{ "--delay": "140ms" } as any}
            >
              {heroOptions.map((option) => (
                <Grid key={option.title} size={{ xs: 12, md: 4 }}>
                  <Paper
                    component="a"
                    href="#review"
                    aria-label={`${option.title} - ${option.caption}`}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollToId(option.targetId);
                    }}
                    sx={{
                      borderRadius: "var(--radius-card)",
                      p: { xs: 2.5, md: 3 },
                      height: "100%",
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(17, 22, 31, 0.75)"
                          : "rgba(255, 255, 255, 0.9)",
                      cursor: "pointer",
                      display: "grid",
                      gap: 1,
                      alignContent: "space-between",
                      minHeight: { xs: 0, md: 180 },
                      boxShadow: "var(--shadow-soft)",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                      "@media (hover: hover) and (pointer: fine)": {
                        "&:hover": {
                          transform: "translateY(-6px)",
                          boxShadow: "var(--shadow-strong)",
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                        {option.title}
                      </Typography>
                      <Typography color="text.secondary">{option.caption}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                      <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>
                        {option.cta}
                      </Typography>
                      <ArrowForwardIcon fontSize="small" color="primary" />
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Typography
              variant="body2"
              color="text.secondary"
              className="reveal"
              style={{ "--delay": "200ms" } as any}
            >
              Send your site — I’ll reply with the top fixes you should make first.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
