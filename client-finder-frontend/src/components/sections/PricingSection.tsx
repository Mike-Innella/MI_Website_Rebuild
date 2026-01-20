"use client";

import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Section from "@/components/layout/Section";
import { maxHeroWidth, sectionGap, sectionPaddingCompact } from "@/lib/layoutTokens";
import { cardPad, mutedSurface, secondarySurface } from "@/lib/uiStyles";

const supportIncludes = [
  "Small updates and content changes",
  "Fixes if something breaks",
  "Basic monitoring and upkeep",
  "Priority response",
];

const supportIsNot = ["Not required.", "Only available after a build.", "No long commitments."];

export default function PricingSection() {
  const theme = useTheme();
  const lightMode = theme.palette.mode === "light";

  return (
    <Section
      id="offer-support"
      eyebrow="For clients who want continued support"
      title="Ongoing Website Support"
      subtitle="Optional add-on after a build for clients who want their site handled, not babysat."
      variant="tinted"
      disableSpine
      sx={{ py: sectionPaddingCompact }}
    >
      <Box sx={{ maxWidth: maxHeroWidth, mx: "auto" }}>
        <Grid container spacing={sectionGap}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card
              className="reveal"
              style={{ "--delay": "60ms" } as any}
              sx={{
                borderRadius: "var(--radius-card)",
                ...secondarySurface,
                height: "100%",
              }}
            >
              <CardContent sx={{ p: cardPad, display: "grid", gap: 2.5 }}>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    What it includes
                  </Typography>
                  <Stack spacing={1.2} sx={{ mt: 1 }}>
                    {supportIncludes.map((item) => (
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
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    What it is not
                  </Typography>
                  <Stack spacing={0.9} sx={{ mt: 1 }}>
                    {supportIsNot.map((item) => (
                      <Typography key={item} color="text.secondary">
                        {item}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Card
              className="reveal"
              style={{ "--delay": "120ms" } as any}
              sx={{
                borderRadius: "var(--radius-card)",
                ...mutedSurface(theme.palette.mode),
                height: "100%",
                display: "flex",
                flexDirection: "column",
                boxShadow: "var(--shadow-soft)",
              }}
            >
              <CardContent sx={{ p: cardPad, display: "grid", gap: 2 }}>
                <Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    Pricing
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 900 }}>
                    $100 / month
                  </Typography>
                </Box>
                <Typography color="text.secondary">
                  A calm retention offer for post-build clients who want someone watching the site.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  component="a"
                  href="#review"
                >
                  Request 5-minute review
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Section>
  );
}
