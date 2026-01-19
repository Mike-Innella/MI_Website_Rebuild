"use client";

import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useTheme } from "@mui/material/styles";
import Section from "@/components/layout/Section";
import { maxHeroWidth, sectionGap } from "@/lib/layoutTokens";
import { cardPad, secondarySurface } from "@/lib/uiStyles";

const problems = [
  { lead: "Customers bounce before calling", detail: "because the site feels slow or dated." },
  { lead: "Mobile visitors give up", detail: "when tap-to-call or maps are buried." },
  { lead: "Forms break or go unanswered", detail: "so real leads never reach you." },
  { lead: "Your offer isn’t clear in 5 seconds", detail: "so people don’t know if you serve them." },
];

const solution = [
  { lead: "Faster load times", detail: "so customers stay long enough to reach out." },
  { lead: "Mobile-friendly design", detail: "so phones turn into calls." },
  { lead: "Easy contact forms", detail: "that actually work and route to you." },
  { lead: "Clear offer + location", detail: "so the right local buyers pick you." },
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
      eyebrow="Value proposition"
      title="I rebuild your site so more customers contact you."
      subtitle="The business problem is missed inquiries. The outcome is a site that loads fast, reads clearly, and makes it easy to reach you."
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
                  <Typography variant="h6">The business problem</Typography>
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
                  <Typography variant="h6">You get</Typography>
                </Stack>
                <Stack spacing={4}>
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
    </Section>
  );
}
