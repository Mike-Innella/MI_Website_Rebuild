"use client";

import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Section from "@/components/layout/Section";
import { maxHeroWidth, sectionGap } from "@/lib/layoutTokens";
import { cardPad, mutedSurface, secondarySurface } from "@/lib/uiStyles";

const steps = [
  { title: "5-minute review", detail: "I reply with the top fixes and a clear next step." },
  { title: "Scope confirmation", detail: "We agree on the pages and goals before build starts." },
  { title: "Build + review", detail: "I rebuild quickly, then we do one focused review." },
  {
    title: "Step 4 — Launch & support",
    detail: "Site goes live. Most clients add optional ongoing support so they don’t have to think about hosting or small updates.",
  },
];

export default function ProcessSection() {
  const theme = useTheme();
  const lightMode = theme.palette.mode === "light";
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalDuration = 2600;

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, intervalDuration);
    return () => window.clearInterval(intervalId);
  }, [intervalDuration]);

  return (
    <Section
      id="process"
      eyebrow="Process"
      title="How This Works"
      subtitle="Short, predictable steps to get you live."
      variant="plain"
      disableSpine
    >
      <Grid
        container
        spacing={sectionGap}
        alignItems="stretch"
        sx={{ maxWidth: maxHeroWidth, mx: "auto" }}
      >
        <Grid size={{ xs: 12, md: 8 }}>
          <Card
            className="reveal"
            style={{ "--delay": "60ms" } as any}
            sx={{
              borderRadius: "var(--radius-card)",
              ...secondarySurface,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: cardPad, display: "grid", gap: 1.75 }}>
              <Typography variant="subtitle1" color="text.secondary">
                Steps
              </Typography>
              <Stack spacing={1.5}>
                {steps.map((step, index) => (
                  <Stack
                    key={step.title}
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{
                      p: 1.25,
                      borderRadius: "var(--radius-panel)",
                      border: "1px solid",
                      borderColor: lightMode ? "rgba(11, 61, 145, 0.14)" : "rgba(93, 169, 255, 0.18)",
                      backgroundColor:
                        activeIndex === index
                          ? lightMode
                            ? "rgba(11, 61, 145, 0.06)"
                            : "rgba(93, 169, 255, 0.1)"
                          : "transparent",
                      transition: "background-color 0.4s ease, border-color 0.4s ease",
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: lightMode ? "rgba(11, 61, 145, 0.12)" : "rgba(93, 169, 255, 0.18)",
                        color: activeIndex === index ? "primary.main" : "text.secondary",
                        fontWeight: 800,
                        flexShrink: 0,
                        transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                        transition: "transform 0.3s ease, color 0.3s ease",
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: activeIndex === index ? "text.primary" : "text.secondary",
                          transition: "color 0.3s ease",
                        }}
                      >
                        {step.title}
                      </Typography>
                      <Typography color="text.secondary">{step.detail}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            className="reveal"
            style={{ "--delay": "120ms" } as any}
            sx={{
              borderRadius: "var(--radius-card)",
              ...mutedSurface(theme.palette.mode),
              height: "100%",
              boxShadow: "var(--shadow-soft)",
            }}
          >
            <CardContent
              sx={{
                p: cardPad,
                display: "flex",
                flexDirection: "column",
                gap: 1,
                height: "100%",
              }}
            >
              <Stack spacing={4} sx={{ flex: 1, height: "100%" }}>
                <Box component="div">
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Risk reduction
                  </Typography>
                  <Typography color="text.secondary">
                    If the first draft doesn’t feel right, you don’t move forward.
                  </Typography>
                </Box>
                <Box component="div" sx={{ mt:2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                    Transparency
                  </Typography>
                  <Typography color="text.secondary">
                    I work with a small number of clients at a time to stay focused.
                  </Typography>
                </Box>
              </Stack>
              <Button variant="contained" size="large" component="a" href="#review" sx={{ mt: "auto" }}>
                Request 5-minute review
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Section>
  );
}
