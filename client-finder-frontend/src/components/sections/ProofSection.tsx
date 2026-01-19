"use client";

import Image from "next/image";
import { Box, Button, Card, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import Section from "@/components/layout/Section";

const projects = [
  {
    title: "Howard Motor Co.",
    description: "Rebuilt the site for clarity, stronger contact paths, and a mobile-first browsing experience.",
    before: "Buried contact info and slow mobile pages made it hard to book a visit.",
    after: "Simplified navigation, bold tap-to-call, and faster load times across devices.",
    resultLine: "Helped an automotive business increase contact form fills by making their site simpler.",
    industry: "Home services",
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
      subtitle="A before/after example that shows the pattern: clarity, flow, and a clear next step."
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
        <Box
          key={project.title}
          sx={{
            mx: "auto",
            maxWidth: 1200,
            px: { xs: 2, md: 3 },
          }}
        >
          <Grid container spacing={{ xs: 4, md: 5 }} alignItems="stretch">
            <Grid size={{ xs: 12, lg: 5 }} sx={{ display: "flex", height: "100%" }}>
              <Stack
                spacing={2.25}
                className="reveal"
                style={{ "--delay": `${80 + index * 80}ms` } as any}
                sx={{ height: "100%", justifyContent: "center" }}
              >
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
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {project.resultLine}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Industries served: landscaping, contractors, and home services.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => {
                    const el = document.getElementById("cta");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  sx={{ mt: 0.5 }}
                >
                  Get a free site review
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, lg: 7 }} sx={{ display: "flex", height: "100%" }}>
              <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
                <Card
                  className="reveal"
                  style={{ "--delay": `${140 + index * 80}ms` } as any}
                  sx={{
                    flex: 1,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: 4,
                    overflow: "hidden",
                    bgcolor: "rgba(255,255,255,0.03)",
                  }}
                  variant="outlined"
                >
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      aspectRatio: { xs: "16 / 10", md: "16 / 9" },
                      maxHeight: { md: 520, lg: 560 },
                      flexGrow: 1,
                      minHeight: { xs: 260, md: 340 },
                    }}
                  >
                    <Image
                      src="/assets/howmoco.png"
                      alt={`${project.title} homepage preview`}
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
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 2,
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
                    {project.link ? (
                      <Button
                        size="small"
                        variant="outlined"
                        component="a"
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        View live site
                      </Button>
                    ) : null}
                  </Box>
                </Card>

                <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
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
                      After, at a glance
                    </Typography>
                  </Stack>
                  <Stack spacing={0.9}>
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
                          bgcolor: "success.main",
                          flexShrink: 0,
                          transform: "translateY(6px)",
                        }}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                        After: Simplified navigation, bold tap-to-call, and faster load times across devices.
                      </Typography>
                    </Stack>
                  </Stack>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Section>
  );
}
