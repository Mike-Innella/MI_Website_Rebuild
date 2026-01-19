"use client";

import Image from "next/image";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Section from "@/components/layout/Section";
import { maxHeroWidth, sectionGap } from "@/lib/layoutTokens";

const projects = [
  {
    title: "Howard Motor Co.",
    description: "Rebuilt the site for clarity, stronger contact paths, and a mobile-first browsing experience.",
    outcomes: [
      "Clarified the contact path to an actionable item.",
      "Streamlined navigation so core services surface faster.",
      "Rebuilt the mobile layout for speed and trust.",
    ],
    link: "https://www.howardmotorco.net/",
  },
];

export default function ProofSection() {
  const theme = useTheme();
  const lightMode = theme.palette.mode === "light";
  const proofGlow = lightMode
    ? "radial-gradient(circle, rgba(11, 61, 145, 0.12), transparent 70%)"
    : "radial-gradient(circle, rgba(93, 169, 255, 0.18), transparent 70%)";

  return (
    <Section
      id="proof"
      eyebrow="Proof"
      title="This is what happens when I rebuild"
      subtitle="A recent rebuild that shows the pattern: clarity, flow, and a clear next step."
      variant="plain"
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
      {projects.map((project, index) => (
        <Grid
          key={project.title}
          container
          spacing={sectionGap}
          alignItems="center"
          sx={{ maxWidth: maxHeroWidth, mx: "auto" }}
        >
          <Grid size={{ xs: 12, md: 4 }}>
            <Stack spacing={2} className="reveal" style={{ "--delay": `${80 + index * 80}ms` }}>
              <Typography variant="overline" color="text.secondary">
                Outcome pattern
              </Typography>
              <Typography variant="h5">{project.title}</Typography>
              <Typography color="text.secondary">{project.description}</Typography>
              <Stack spacing={1.25}>
                {project.outcomes.map((item) => (
                  <Stack key={item} direction="row" spacing={1.5} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: lightMode
                          ? "rgba(11, 61, 145, 0.1)"
                          : "rgba(93, 169, 255, 0.18)",
                        flexShrink: 0,
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor: "primary.main",
                        }}
                      />
                    </Box>
                    <Typography color="text.secondary">{item}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  pt: 2,
                  borderTop: "1px solid",
                  borderColor: "divider",
                }}
              >
                This is the result of every rebuild.
              </Typography>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card
              className="reveal"
              style={{ "--delay": `${140 + index * 80}ms` }}
              sx={{
                borderRadius: "var(--radius-card)",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "var(--radius-panel)",
                  minHeight: 260,
                  overflow: "hidden",
                  backgroundColor: "background.paper",
                  aspectRatio: "16 / 9",
                }}
              >
                <Image
                  src="/assets/howmoco.png"
                  alt={`${project.title} homepage preview`}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 900px) 100vw, 720px"
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
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 12,
                    left: 12,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: "999px",
                    backgroundColor: "rgba(15, 23, 42, 0.7)",
                    display: { xs: "none", sm: "inline-flex" },
                  }}
                >
                  <Typography variant="caption" color="common.white">
                    {project.title}
                  </Typography>
                </Box>
                {project.link ? (
                  <Button
                    size="small"
                    variant="outlined"
                    component="a"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    sx={{
                      position: "absolute",
                      top: { xs: "auto", sm: 12 },
                      right: 12,
                      bottom: { xs: 12, sm: "auto" },
                      borderRadius: "999px",
                      backgroundColor: "rgba(15, 23, 42, 0.7)",
                      color: "common.white",
                      borderColor: "rgba(255, 255, 255, 0.4)",
                      transform: "none",
                      zIndex: 2,
                      display: { xs: "none", sm: "inline-flex" },
                      transition:
                        "background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease",
                      "&:hover": {
                        borderColor: "rgba(255, 255, 255, 0.7)",
                        backgroundColor: "rgba(15, 23, 42, 0.85)",
                        transform: "none",
                      },
                    }}
                  >
                    View live site
                  </Button>
                ) : null}
              </Box>
              {project.link ? (
                <Box
                  sx={{
                    display: { xs: "flex", sm: "none" },
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    pt: 1.5,
                    borderTop: "1px solid",
                    borderColor: "divider",
                    backgroundColor: "background.paper",
                  }}
                >
                  <Box
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      borderRadius: "999px",
                      backgroundColor: "rgba(15, 23, 42, 0.7)",
                    }}
                  >
                    <Typography variant="caption" color="common.white">
                      {project.title}
                    </Typography>
                  </Box>
                  <Button
                    size="small"
                    variant="outlined"
                    component="a"
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View live site
                  </Button>
                </Box>
              ) : null}
            </Card>
          </Grid>
        </Grid>
      ))}
    </Section>
  );
}
