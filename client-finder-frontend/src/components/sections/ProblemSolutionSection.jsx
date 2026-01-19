"use client";

import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useTheme } from "@mui/material/styles";
import Section from "@/components/layout/Section";
import { maxHeroWidth, sectionGap } from "@/lib/layoutTokens";
import { cardPad, secondarySurface } from "@/lib/uiStyles";

const problems = [
  { lead: "Breaks on phones", detail: "even if desktop looks fine." },
  { lead: "No clear contact path", detail: "so leads bounce." },
  { lead: "Slow load times", detail: "make the site feel outdated." },
  { lead: "DIY fixes pile up", detail: "and the story stays muddy." },
];

const solution = [
  { lead: "A focused rebuild", detail: "that makes it obvious who you are and how to reach you." },
  { lead: "Performance-first pages", detail: "that load fast and feel modern." },
  { lead: "Clear messaging", detail: "that guides visitors to one action." },
  { lead: "Support handled for you", detail: "so momentum never slips." },
];

const cardSx = {
  height: "100%",
  borderRadius: "var(--radius-card)",
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    opacity: 0.85,
    pointerEvents: "none",
  },
};

export default function ProblemSolutionSection() {
  const theme = useTheme();
  const warmGlow =
    theme.palette.mode === "dark"
      ? "radial-gradient(circle at top right, rgba(253, 186, 116, 0.2), transparent 55%)"
      : "radial-gradient(circle at top right, rgba(249, 115, 22, 0.18), transparent 55%)";
  const coolGlow =
    theme.palette.mode === "dark"
      ? "radial-gradient(circle at top right, rgba(93, 169, 255, 0.22), transparent 55%)"
      : "radial-gradient(circle at top right, rgba(11, 61, 145, 0.18), transparent 55%)";
  return (
    <Section
      id="problems"
      eyebrow="Why this matters"
      title="Your website might be costing you customers."
      subtitle="Most sites fail for predictable reasons. Fixing them is straightforward when you know what to prioritize."
      variant="plain"
      disableSpine
    >
      <Grid
        container
        spacing={sectionGap}
        alignItems="stretch"
        sx={{ maxWidth: maxHeroWidth, mx: "auto", position: "relative", zIndex: 1 }}
      >
        <Grid size={{ xs: 12, sm: 6, md: 5 }}>
          <Card
            sx={{
              ...cardSx,
              ...secondarySurface,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(253, 186, 116, 0.08)"
                  : "rgba(249, 115, 22, 0.06)",
              "&::after": { ...cardSx["&::after"], background: warmGlow },
            }}
            className="reveal"
            style={{ "--delay": "80ms" }}
          >
            <CardContent
              sx={{
                position: "relative",
                zIndex: 1,
                p: cardPad,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack spacing={2} sx={{ height: "100%" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(249, 115, 22, 0.12)",
                    }}
                  >
                    <WarningAmberOutlinedIcon color="warning" />
                  </Box>
                  <Typography variant="h6">Problem signals</Typography>
                </Stack>
                <Stack spacing={1.25}>
                  {problems.map((problem) => (
                    <Stack
                      key={problem.lead}
                      direction="row"
                      spacing={1.5}
                      alignItems="flex-start"
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: "warning.main",
                          flexShrink: 0,
                          transform: "translateY(6px)",
                        }}
                      />
                      <Typography color="text.secondary">
                        <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                          {problem.lead}
                        </Box>{" "}
                        {problem.detail}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 7 }}>
          <Card
            sx={{
              ...cardSx,
              ...secondarySurface,
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                background: coolGlow,
                opacity: 0.95,
                pointerEvents: "none",
              },
            }}
            className="reveal"
            style={{ "--delay": "140ms" }}
          >
            <CardContent
              sx={{
                position: "relative",
                zIndex: 1,
                p: cardPad,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack spacing={2} sx={{ height: "100%" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "rgba(93, 169, 255, 0.14)",
                    }}
                  >
                    <CheckCircleOutlineIcon color="primary" />
                  </Box>
                  <Typography variant="h6">What changes after the rebuild</Typography>
                </Stack>
                <Stack spacing={1.25}>
                  {solution.map((item) => (
                    <Stack key={item.lead} direction="row" spacing={1.5} alignItems="flex-start">
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
                      <Typography color="text.secondary">
                        <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                          {item.lead}
                        </Box>{" "}
                        {item.detail}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Section>
  );
}
