"use client";

import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Section from "@/components/layout/Section";
import { maxHeroWidth, sectionGap } from "@/lib/layoutTokens";
import { cardPad, mutedSurface, primarySurface, secondarySurface } from "@/lib/uiStyles";

const changesAfterRebuild = [
  "Clear messaging",
  "Faster load times",
  "Obvious next steps",
  "More calls and form submissions",
];

const processSteps = [
  "Audit your current site",
  "Rewrite structure and messaging",
  "Rebuild with conversion focus",
  "Launch with analytics in place",
];

export default function OfferSection() {
  const theme = useTheme();
  const lightMode = theme.palette.mode === "light";

  return (
    <Section
      id="offer-business"
      eyebrow="For Small Businesses"
      title="5-Page Business Websites Built to Drive Inquiries"
      subtitle={<Box component="span" sx={{ fontWeight: 800, color: "text.primary" }}>The primary offer for businesses that need more inquiries fast.</Box>}
      variant="paper"
      disableSpine
      sx={{
        py: { xs: 10, md: 14 },
        background:
          lightMode
            ? "linear-gradient(180deg, rgba(11, 61, 145, 0.05), rgba(255, 255, 255, 0.95))"
            : "linear-gradient(180deg, rgba(93, 169, 255, 0.12), rgba(17, 22, 31, 0.96))",
      }}
    >
      <Grid
        container
        spacing={sectionGap}
        alignItems="stretch"
        sx={{ maxWidth: maxHeroWidth, mx: "auto" }}
      >
        <Grid size={{ xs: 12, md: 7 }} sx={{ display: "flex" }}>
          <Card
            className="reveal"
            style={{ "--delay": "60ms" } as any}
            sx={{
              flex: 1,
              borderRadius: "var(--radius-card)",
              ...secondarySurface,
              minHeight: { xs: "auto", md: 520 },
            }}
          >
            <CardContent
              sx={{
                p: cardPad,
                display: "grid",
                gap: 2.5,
              }}
            >
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: "var(--radius-panel)",
                  backgroundColor:
                    lightMode ? "rgba(249, 115, 22, 0.08)" : "rgba(253, 186, 116, 0.12)",
                  border: "1px solid",
                  borderColor: lightMode ? "rgba(249, 115, 22, 0.25)" : "rgba(253, 186, 116, 0.28)",
                  boxShadow: "var(--shadow-soft)",
                }}
                >
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Pain-first framing
                  </Typography>
                  <Typography color="text.secondary">
                    Most small business websites look fine — but fail to convert.
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1.5 }}>
                    They’re slow, unclear, outdated, or don’t explain why someone should call you.
                  </Typography>
                </Box>

              <Box>
                <Typography variant="subtitle1" color="text.secondary" sx={{ letterSpacing: "0.05em", mb: 1 }}>
                  What changes after rebuild
                </Typography>
                <Stack spacing={1.25}>
                  {changesAfterRebuild.map((item) => (
                    <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
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
                      <Typography color="text.secondary">{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>

              <Box sx={{ mt: 1.5 }}>
                <Typography variant="subtitle1" color="text.secondary" sx={{ letterSpacing: "0.05em", mb: 1 }}>
                  Who this is for
                </Typography>
                <Stack spacing={1.1}>
                  {[
                    "You’re ready to make changes in the next 30 days.",
                    "You want clear next steps, not a generic design critique.",
                    "You need predictable inquiries, not another redesign cycle.",
                  ].map((item) => (
                    <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
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
                      <Typography color="text.secondary">{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }} sx={{ display: "flex" }}>
          <Card
            className="reveal"
            style={{ "--delay": "120ms" } as any}
            sx={{
              flex: 1,
              borderRadius: "var(--radius-card)",
              ...primarySurface(theme.palette.mode),
              minHeight: { xs: "auto", md: 520 },
            }}
          >
            <CardContent
              sx={{
                p: cardPad,
                display: "grid",
                gap: 2.5,
                height: "100%",
              }}
            >
              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Delivery
                </Typography>
                <Typography variant="h4" sx={{ mt: 0.75, fontWeight: 900 }}>
                  7 days
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="text.secondary">
                  Pricing
                </Typography>
                <Typography variant="h5" sx={{ mt: 0.75, fontWeight: 800 }}>
                  Typically $1,000–$1,500
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Set pricing floors to pre-qualify serious projects.
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  Most projects land near the middle of this range.
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" color="text.secondary" sx={{ letterSpacing: "0.05em", mb: 1 }}>
                  Rebuild process
                </Typography>
                <Stack spacing={1.2}>
                  {processSteps.map((step, index) => (
                    <Stack
                      key={step}
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{
                        p: 1.25,
                        borderRadius: "var(--radius-panel)",
                        backgroundColor:
                          lightMode && index === 0
                            ? "rgba(11, 61, 145, 0.06)"
                            : lightMode
                              ? "rgba(15, 23, 42, 0.02)"
                              : "rgba(17, 22, 31, 0.5)",
                        border: "1px solid",
                        borderColor: lightMode ? "rgba(11, 61, 145, 0.15)" : "rgba(93, 169, 255, 0.18)",
                      }}
                    >
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: lightMode ? "rgba(11, 61, 145, 0.12)" : "rgba(93, 169, 255, 0.18)",
                          color: "primary.main",
                          fontWeight: 800,
                          fontSize: "0.95rem",
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography sx={{ fontWeight: 700 }}>{step}</Typography>
                    </Stack>
                  ))}
                </Stack>
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
