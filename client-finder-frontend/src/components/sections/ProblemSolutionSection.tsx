"use client";

import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Section from "@/components/layout/Section";
import { maxHeroWidth, sectionGap } from "@/lib/layoutTokens";
import { cardPad, secondarySurface } from "@/lib/uiStyles";

const offerPoints = [
  "Designed to showcase your work clearly",
  "Easy to share instead of linktrees or PDFs",
  "No maintenance headaches",
  "Delivered in days, not weeks",
];

export default function ProblemSolutionSection() {
  const theme = useTheme();

  return (
    <Section
      id="offer-single"
      eyebrow="For Creators & Independent Professionals"
      title="Single-Page Sites for Clear, Professional Credibility"
      subtitle="A clean, fast site that shows what you do and makes you easy to trust."
      variant="tinted"
      disableSpine
    >
      <Grid container spacing={sectionGap} alignItems="stretch" sx={{ maxWidth: maxHeroWidth, mx: "auto" }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            className="reveal"
            style={{ "--delay": "80ms" } as any}
            sx={{
              borderRadius: "var(--radius-card)",
              ...secondarySurface,
              height: "100%",
            }}
          >
            <CardContent sx={{ p: cardPad }}>
              <Stack spacing={2.5}>
                <Typography variant="subtitle1" color="primary" sx={{ letterSpacing: "0.05em" }}>
                  What you get
                </Typography>
                <Stack spacing={1.25}>
                  {offerPoints.map((point) => (
                    <Stack key={point} direction="row" spacing={1.5} alignItems="flex-start">
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                          flexShrink: 0,
                          transform: "translateY(6px)",
                        }}
                      />
                      <Typography color="text.secondary">{point}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Box
                  sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: "var(--radius-panel)",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(93, 169, 255, 0.08)"
                        : "rgba(11, 61, 145, 0.06)",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 0.75 }}>
                    What this replaces
                  </Typography>
                  <Typography color="text.secondary">
                    Replaces: messy personal sites, link-in-bio pages, scattered links, outdated portfolios
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            className="reveal"
            style={{ "--delay": "120ms" } as any}
            sx={{
              borderRadius: "var(--radius-card)",
              ...secondarySurface,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent sx={{ p: cardPad, display: "grid", gap: 2.5 }}>
              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Delivery
                </Typography>
                <Typography variant="h6" sx={{ mt: 0.5, fontWeight: 800 }}>
                  Typically 3–5 days
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Pricing
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 800 }}>
                  Starting at $500
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Clear scope for a credible single-page site.
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                  Best fit if you need a professional presence — not a complex site.
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                onClick={() => {
                  const el = document.getElementById("cta");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
              >
                Request a Review (Recorded)
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Section>
  );
}
