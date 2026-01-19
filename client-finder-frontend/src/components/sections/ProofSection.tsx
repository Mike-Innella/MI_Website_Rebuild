"use client";

import Image from "next/image";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Section from "@/components/layout/Section";
import { maxHeroWidth } from "@/lib/layoutTokens";
import { cardPad, secondarySurface } from "@/lib/uiStyles";

export default function ProofSection() {
  const theme = useTheme();
  const lightMode = theme.palette.mode === "light";
  const proofGlow = lightMode
    ? "radial-gradient(circle, rgba(11, 61, 145, 0.12), transparent 70%)"
    : "radial-gradient(circle, rgba(93, 169, 255, 0.18), transparent 70%)";

  return (
    <Section
      id="recent-rebuild"
      eyebrow="Recent Rebuild"
      title="Howard Motor Co. — inspection and repair site"
      subtitle="A clear example of the outcome pattern: clearer messaging → easier contact → more inquiries."
      variant="tinted"
      disableSpine
      sx={{
        "&::after": {
          content: '""',
          position: "absolute",
          right: { xs: -40, md: 60 },
          top: { xs: 40, md: 20 },
          width: { xs: 160, md: 220 },
          height: { xs: 160, md: 220 },
          borderRadius: "50%",
          background: proofGlow,
          opacity: 0.7,
          pointerEvents: "none",
        },
      }}
    >
      <Card
        sx={{
          mx: "auto",
          maxWidth: maxHeroWidth,
          ...secondarySurface,
          borderRadius: "var(--radius-card)",
          p: cardPad,
          position: "relative",
          overflow: "hidden",
          boxShadow: "var(--shadow-soft)",
        }}
      >
        <Grid container spacing={{ xs: 4, md: 5 }} alignItems="stretch" sx={{ mt: { xs: 3, md: 0 } }}>
          <Grid size={{ xs: 12, lg: 6 }} sx={{ display: "flex" }}>
            <Stack spacing={2.25} sx={{ height: "100%", justifyContent: "flex-start" }}>
              <Typography variant="overline" color="text.secondary">
                RECENT REBUILD
              </Typography>
              <Stack spacing={1.75}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Client type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    Local small business (auto inspection + repair)
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Problem
                  </Typography>
                  <Typography color="text.secondary">
                    Buried contact info, unclear services, low mobile conversions.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    What changed
                  </Typography>
                  <Stack spacing={1.1} sx={{ mt: 0.5 }}>
                    {[
                      "Simplified navigation so core services surface faster.",
                      "Made contact paths obvious (tap-to-call + clear CTA).",
                      "Tightened mobile layout for speed and trust.",
                    ].map((item) => (
                      <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
                        <Box
                          sx={{
                            width: 9,
                            height: 9,
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
                  <Typography variant="subtitle2" color="text.secondary">
                    Result
                  </Typography>
                  <Typography color="text.secondary">
                    Clearer customer understanding and increased inbound inquiries.
                  </Typography>
                </Box>
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 1 }}>
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
                <Button
                  size="large"
                  variant="outlined"
                  component="a"
                  href="https://www.howardmotorco.net/"
                  target="_blank"
                  rel="noreferrer"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  View live site
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack spacing={2.5} sx={{ height: "100%" }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  borderRadius: "var(--radius-card)",
                  overflow: "hidden",
                  border: "1px solid",
                  borderColor: "divider",
                  minHeight: { xs: 240, md: 320 },
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <Image
                  src="/assets/howmoco.png"
                  alt="Howard Motor Company homepage preview"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 1200px) 100vw, 720px"
                  loading="lazy"
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(180deg, rgba(15, 23, 42, 0) 40%, rgba(15, 23, 42, 0.55) 100%)",
                  }}
                />
              </Box>
              <Box
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: "var(--radius-card)",
                  p: cardPad,
                  backgroundColor: "background.paper",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" component="span" sx={{ lineHeight: 1.2 }}>
                    Before
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      lineHeight: 1,
                      fontSize: "1em",
                      position: "relative",
                      top: "-3px",
                    }}
                  >
                    →
                  </Typography>
                  <Typography variant="subtitle2" component="span" sx={{ lineHeight: 1.2 }}>
                    After (at a glance)
                  </Typography>
                </Stack>
                <Stack spacing={1.1}>
                  <Stack direction="row" spacing={1.25} alignItems="flex-start">
                    <Box
                      sx={{
                        mt: 0,
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        flexShrink: 0,
                        transform: "translateY(6px)",
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                      Before: Buried contact info and slow mobile pages made it hard to book a visit.
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1.25} alignItems="flex-start">
                    <Box
                      sx={{
                        mt: 0,
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        flexShrink: 0,
                        transform: "translateY(6px)",
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                      After: Simplified navigation, bold tap-to-call, and faster load times across devices.
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </Section>
  );
}
