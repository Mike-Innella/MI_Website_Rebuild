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
      eyebrow="Proof"
      title="Recent rebuild"
      subtitle="Howard Motor Co. — production rebuild for auto inspection + repair."
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
        <Grid container spacing={{ xs: 4, md: 5 }} alignItems="stretch">
          <Grid size={{ xs: 12, lg: 6 }} sx={{ display: "flex" }}>
            <Stack spacing={2.5} sx={{ height: "100%", justifyContent: "flex-start" }}>
              <Box>
                <Typography variant="overline" color="text.secondary">
                  RECENT REBUILD
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                  Howard Motor Co.
                </Typography>
              </Box>
              <Stack spacing={1.2} color="text.secondary">
                {[
                  "Production website rebuild",
                  "Mobile-first layout",
                  "Clear contact + lead intake flow",
                  "Deployed and maintained in production",
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
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 1 }}>
                <Button
                  size="large"
                  variant="outlined"
                  component="a"
                  href="https://www.howardmotorco.net/"
                  target="_blank"
                  rel="noreferrer"
                  sx={{ whiteSpace: "nowrap" }}
                >
                  View Howard Motor
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
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
                  src="/assets/howmoco.webp"
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
          </Grid>
        </Grid>
      </Card>
    </Section>
  );
}
