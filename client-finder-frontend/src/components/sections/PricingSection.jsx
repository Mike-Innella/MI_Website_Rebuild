"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Section from "@/components/layout/Section";
import { maxHeroWidth, sectionGap, sectionPaddingCompact } from "@/lib/layoutTokens";
import { cardPad, cardPadTight, mutedSurface, primarySurface, secondarySurface } from "@/lib/uiStyles";

const starterCard = {
  title: "$500 SPA",
  purpose: "Best for quick launches",
  subtitle: "High-conversion single-page site for portfolios, creators, and personal brands.",
  features: [
    "Mobile-first single-page layout",
    "Up to 5 sections",
    "Project or link showcase",
    "Contact or CTA section",
  ],
  useCases: ["Portfolio refresh", "Creator landing page", "Personal brand"],
  pill: "Clear scope. Fast turnaround.",
  cta: "Start my SPA",
};

const rebuildFeatures = [
  "Strategy and structure refresh",
  "Mobile-first layout",
  "Speed, SEO, and Lighthouse optimization",
  "Launch and handoff",
];

const rebuildUseCases = ["Full rebuild and redesign", "Conversion-focused refresh", "SEO and speed uplift"];

const careFeatures = [
  "Hosting and monitoring",
  "Monthly updates",
  "Small edits and fixes",
  "Priority support",
];

const careUseCases = ["Routine updates", "Monitoring and backups", "Quick fixes"];

const intentLabelSx = { fontSize: "0.85rem", opacity: 0.75 };

const useCaseHeadingSx = {
  fontSize: "0.8rem",
  fontWeight: 600,
  letterSpacing: "0.02em",
  opacity: 0.7,
  textTransform: "uppercase",
};

export default function PricingSection() {
  const theme = useTheme();
  const lightMode = theme.palette.mode === "light";

  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title="Simple pricing. No games."
      subtitle="Focused rebuilds and an optional care plan."
      variant="plain"
      disableSpine
      sx={{ py: sectionPaddingCompact }}
    >
      <Box
        sx={{
          maxWidth: maxHeroWidth,
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          borderRadius: "var(--radius-card)",
          background: lightMode
            ? "linear-gradient(180deg, rgba(15, 23, 42, 0.02), rgba(255, 255, 255, 0.9))"
            : "linear-gradient(180deg, rgba(17, 22, 31, 0.8), rgba(17, 22, 31, 0.95))",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Grid container spacing={sectionGap} alignItems="stretch">
          <Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 2, md: 1 } }}>
            <Card
              className="reveal"
              style={{ "--delay": "40ms" }}
              sx={{
                borderRadius: "var(--radius-card)",
                ...secondarySurface,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                zIndex: 1,
                minHeight: { xs: "auto", md: 420 },
                "&:hover": {
                  transform: "none",
                  boxShadow: "var(--shadow-soft)",
                },
              }}
            >
              <CardContent
                sx={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", p: cardPadTight }}
              >
                <Stack spacing={2} sx={{ flex: 1 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="h4" fontWeight={700}>
                      {starterCard.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={intentLabelSx}>
                      {starterCard.purpose}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic", opacity: 0.7, fontSize: "0.85rem" }}
                    >
                      $250 upfront, $250 on completion.
                    </Typography>
                    <Typography color="text.secondary">{starterCard.subtitle}</Typography>
                  </Stack>
                  <Stack spacing={1.1}>
                    {starterCard.features.map((feature) => (
                      <Stack key={feature} direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: "divider",
                            flexShrink: 0,
                          }}
                        />
                        <Typography color="text.secondary">{feature}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
                <Stack spacing={1.5} sx={{ mt: "auto", pt: 2, alignItems: "flex-start" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      px: 1.5,
                      py: 0.4,
                      borderRadius: "999px",
                      width: "fit-content",
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: lightMode
                        ? "rgba(15, 23, 42, 0.02)"
                        : "rgba(15, 23, 42, 0.35)",
                    }}
                  >
                    {starterCard.pill}
                  </Typography>
                  <Stack spacing={0.6}>
                    <Typography variant="body2" color="text.secondary" sx={useCaseHeadingSx}>
                      Typical use cases
                    </Typography>
                    <Stack spacing={0.3}>
                      {starterCard.useCases.map((useCase) => (
                        <Typography key={useCase} variant="body2" color="text.secondary">
                          - {useCase}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const el = document.getElementById("cta");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    sx={{
                      color: "text.primary",
                      borderColor: lightMode ? "rgba(11, 61, 145, 0.2)" : "rgba(93, 169, 255, 0.3)",
                    }}
                  >
                    {starterCard.cta}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 1, md: 2 } }}>
            <Card
              className="reveal pulse-border"
              style={{ "--delay": "80ms" }}
              sx={{
                borderRadius: "var(--radius-card)",
                ...primarySurface(theme.palette.mode),
                borderColor: lightMode
                  ? "rgba(11, 61, 145, 0.35)"
                  : "rgba(93, 169, 255, 0.55)",
                boxShadow: lightMode
                  ? "0 16px 44px rgba(15, 23, 42, 0.12)"
                  : "0 16px 52px rgba(0, 0, 0, 0.38)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                zIndex: 2,
                minHeight: { xs: "auto", md: 500 },
                transform: { xs: "none", md: "translateY(-8px) scale(1.02)" },
                "@media (hover: hover) and (pointer: fine)": {
                  "&:hover": {
                    transform: "translateY(-10px) scale(1.02)",
                    boxShadow: lightMode
                      ? "0 18px 48px rgba(15, 23, 42, 0.14)"
                      : "0 18px 56px rgba(0, 0, 0, 0.42)",
                  },
                },
              }}
            >
              <CardContent
                sx={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", p: cardPad }}
              >
                <Stack spacing={2} sx={{ flex: 1 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="h3" fontWeight={800}>
                      $1,000 rebuild
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={intentLabelSx}>
                      Best for growing businesses
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontStyle: "italic", opacity: 0.7, fontSize: "0.85rem" }}
                    >
                      $500 upfront, $500 on completion.
                    </Typography>
                    <Chip
                      label="Most popular"
                      color="primary"
                      size="small"
                      sx={{
                        alignSelf: "stretch",
                        justifyContent: "center",
                        px: 2,
                        bgcolor: lightMode
                          ? "rgba(11, 61, 145, 0.12)"
                          : "rgba(93, 169, 255, 0.2)",
                      }}
                    />
                    <Typography color="text.secondary">
                      One-time setup for the full 7-day rebuild.
                    </Typography>
                  </Stack>
                  <Stack spacing={1.2}>
                    {rebuildFeatures.map((feature) => (
                      <Stack key={feature} direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                            boxShadow: lightMode
                              ? "0 0 0 4px rgba(11, 61, 145, 0.12)"
                              : "0 0 0 4px rgba(93, 169, 255, 0.16)",
                            flexShrink: 0,
                          }}
                        />
                        <Typography color="text.secondary">{feature}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
                <Stack spacing={1.5} sx={{ mt: "auto", pt: 2, alignItems: "flex-start" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      px: 1.5,
                      py: 0.4,
                      borderRadius: "999px",
                      width: "fit-content",
                      backgroundColor: lightMode
                        ? "rgba(11, 61, 145, 0.12)"
                        : "rgba(93, 169, 255, 0.18)",
                    }}
                  >
                    Clear scope. Launch in 7 days.
                  </Typography>
                  <Stack spacing={0.6}>
                    <Typography variant="body2" color="text.secondary" sx={useCaseHeadingSx}>
                      Typical use cases
                    </Typography>
                    <Stack spacing={0.3}>
                      {rebuildUseCases.map((useCase) => (
                        <Typography key={useCase} variant="body2" color="text.secondary">
                          - {useCase}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                  <Button
                    variant="contained"
                    onClick={() => {
                      const el = document.getElementById("cta");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    sx={{ minHeight: 50, px: 4 }}
                  >
                    Request a free review
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ order: { xs: 3, md: 3 } }}>
            <Card
              className="reveal"
              style={{ "--delay": "140ms" }}
              sx={{
                borderRadius: "var(--radius-card)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                zIndex: 1,
                minHeight: { xs: "auto", md: 420 },
                ...mutedSurface(theme.palette.mode),
                "&:hover": {
                  transform: "none",
                  boxShadow: "none",
                },
              }}
            >
              <CardContent
                sx={{ display: "flex", flexDirection: "column", flex: 1, height: "100%", p: cardPad }}
              >
                <Stack spacing={2.5} sx={{ flex: 1 }}>
                  <Stack spacing={0.5}>
                    <Typography variant="h4">$100/month</Typography>
                    <Typography variant="body2" color="text.secondary" sx={intentLabelSx}>
                      For ongoing peace of mind
                    </Typography>
                    <Chip
                      label="Optional"
                      size="small"
                      sx={{
                        width: "100%",
                        bgcolor: lightMode ? "rgba(15, 23, 42, 0.06)" : "rgba(15, 23, 42, 0.35)",
                        color: "text.secondary",
                      }}
                    />
                    <Typography color="text.secondary">
                      Maintenance care plan (hosting, updates, small edits).
                    </Typography>
                  </Stack>
                  <Stack spacing={1.1}>
                    {careFeatures.map((feature) => (
                      <Stack key={feature} direction="row" spacing={1.5} alignItems="center">
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            bgcolor: "divider",
                            flexShrink: 0,
                          }}
                        />
                        <Typography color="text.secondary">{feature}</Typography>
                      </Stack>
                    ))}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    No contracts. Cancel anytime.
                  </Typography>
                </Stack>
                <Stack spacing={1.5} sx={{ mt: "auto", pt: 2, alignItems: "flex-start" }}>
                  <Stack spacing={0.6}>
                    <Typography variant="body2" color="text.secondary" sx={useCaseHeadingSx}>
                      Typical use cases
                    </Typography>
                    <Stack spacing={0.3}>
                      {careUseCases.map((useCase) => (
                        <Typography key={useCase} variant="body2" color="text.secondary">
                          - {useCase}
                        </Typography>
                      ))}
                    </Stack>
                  </Stack>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const el = document.getElementById("cta");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    sx={{
                      color: "text.secondary",
                      borderColor: "divider",
                      backgroundColor: lightMode ? "rgba(15, 23, 42, 0.04)" : "rgba(15, 23, 42, 0.3)",
                      "&:hover": {
                        backgroundColor: lightMode ? "rgba(15, 23, 42, 0.08)" : "rgba(15, 23, 42, 0.4)",
                        borderColor: "divider",
                      },
                    }}
                  >
                    Learn about care plan
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: "center" }}>
        No long-term contracts.
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
        Built for performance, clarity, and long-term maintainability.
      </Typography>
    </Section>
  );
}
