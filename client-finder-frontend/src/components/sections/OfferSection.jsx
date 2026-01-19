"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import Section from "@/components/layout/Section";
import { maxHeroWidth, sectionGap } from "@/lib/layoutTokens";
import { cardPad, cardPadTight, mutedSurface, secondarySurface } from "@/lib/uiStyles";

const included = [
  "5-page modern website",
  "Mobile-first design and responsive layouts",
  "Lighthouse > 90 (mobile target)",
  "Contact form with review CTA",
  "Basic analytics included",
  "Domain and hosting setup",
  "Launch checklist and handoff",
];

const excluded = [
  { label: "Custom web apps", detail: "Dedicated builds need a separate scope." },
  { label: "Complex dashboards", detail: "Best handled as product work." },
  { label: "E-commerce with inventory", detail: "Requires deeper ops + integrations." },
  { label: "Unlimited revisions", detail: "Keeps momentum and timelines tight." },
];

const timeline = [
  { day: "Day 1", label: "Plan", detail: "Audit + kickoff", icon: DescriptionOutlinedIcon },
  { day: "Day 3", label: "Build", detail: "Layout + content", icon: ConstructionOutlinedIcon },
  { day: "Day 5", label: "Review", detail: "Revise + polish", icon: FactCheckOutlinedIcon },
  { day: "Day 7", label: "Launch", detail: "Ship + handoff", icon: RocketLaunchOutlinedIcon },
];

export default function OfferSection() {
  const theme = useTheme();
  const lightMode = theme.palette.mode === "light";
  const [activeTimeline, setActiveTimeline] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveTimeline((prev) => (prev + 1) % timeline.length);
    }, 2800);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <Section
      id="offer"
      eyebrow="The offer"
      title="The 7-Day Website Rebuild"
      subtitle="A fast, focused rebuild designed to get customers to contact you."
      variant="tinted"
      disableSpine
    >
      <Grid
        container
        spacing={sectionGap}
        alignItems="stretch"
        sx={{ maxWidth: maxHeroWidth, mx: "auto" }}
      >
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex" }}>
          <Card
            className="reveal"
            style={{ "--delay": "80ms" }}
            sx={{
              flex: 1,
              height: "100%",
              borderRadius: "var(--radius-card)",
              ...secondarySurface,
              minHeight: { xs: "auto", md: 520 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                flex: 1,
                height: "100%",
                p: cardPad,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack spacing={2.5} sx={{ height: "100%", flex: 1 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-panel)",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: lightMode
                        ? "rgba(11, 61, 145, 0.12)"
                        : "rgba(93, 169, 255, 0.18)",
                    }}
                  >
                    <ListAltOutlinedIcon color="primary" />
                  </Box>
                  <Typography variant="h6">What is included</Typography>
                </Stack>
                <Stack spacing={1.5} sx={{ flex: 1 }}>
                  {included.map((item) => (
                    <Stack key={item} direction="row" spacing={1.5} alignItems="center">
                      <CheckCircleOutlineIcon color="primary" fontSize="small" />
                      <Typography>{item}</Typography>
                    </Stack>
                  ))}
                </Stack>
                <Box sx={{ mt: "auto", pt: 1 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => {
                      const el = document.getElementById("cta");
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                  >
                    Start with a free review
                  </Button>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex" }}>
          <Card
            className="reveal"
            style={{ "--delay": "140ms" }}
            sx={{
              flex: 1,
              borderRadius: "var(--radius-card)",
              border: "1px solid",
              borderColor: lightMode ? "rgba(249, 115, 22, 0.45)" : "rgba(253, 186, 116, 0.4)",
              backgroundColor: lightMode ? "rgba(249, 115, 22, 0.08)" : "rgba(253, 186, 116, 0.1)",
              boxShadow: "var(--shadow-soft)",
              minHeight: { xs: "auto", md: 520 },
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                flex: 1,
                p: cardPad,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack spacing={1.5} sx={{ flex: 1, height: "100%" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-panel)",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: lightMode
                        ? "rgba(249, 115, 22, 0.16)"
                        : "rgba(253, 186, 116, 0.2)",
                    }}
                  >
                    <TimerOutlinedIcon color="secondary" />
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      px: 1.5,
                      py: 0.25,
                      borderRadius: "999px",
                      backgroundColor: lightMode
                        ? "rgba(249, 115, 22, 0.16)"
                        : "rgba(253, 186, 116, 0.2)",
                    }}
                  >
                    7-day delivery
                  </Typography>
                </Stack>
                <Typography color="text.secondary">
                  You get a focused rebuild with one clear revision round so launch never drifts.
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    pl: 3,
                    mt: 1.5,
                    flex: 1,
                    display: "flex",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      left: 7,
                      top: 12,
                      bottom: 12,
                      width: 2,
                      bgcolor: lightMode
                        ? "rgba(249, 115, 22, 0.35)"
                        : "rgba(253, 186, 116, 0.4)",
                    },
                  }}
                >
                  <Stack sx={{ flex: 1, justifyContent: "space-between", py: 1.5 }}>
                    {timeline.map((item, index) => {
                      const isActive = index === activeTimeline;
                      const Icon = item.icon;
                      return (
                        <Box
                          key={item.day}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr auto",
                            columnGap: 1.5,
                            rowGap: 0.35,
                            alignItems: "center",
                            pr: 1,
                            opacity: isActive ? 1 : 0.7,
                            transition: "opacity 0.35s ease",
                          }}
                        >
                          <Box
                            sx={{
                              width: 14,
                              height: 14,
                              display: "grid",
                              placeItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <Box
                              sx={{
                                width: isActive ? 12 : 8,
                                height: isActive ? 12 : 8,
                                borderRadius: "50%",
                                bgcolor: isActive ? "secondary.main" : "divider",
                                boxShadow: isActive
                                  ? lightMode
                                    ? "0 0 0 4px rgba(249, 115, 22, 0.18)"
                                    : "0 0 0 4px rgba(253, 186, 116, 0.2)"
                                  : "none",
                                transition:
                                  "width 0.35s ease, height 0.35s ease, background-color 0.35s ease, box-shadow 0.35s ease",
                              }}
                            />
                          </Box>
                          <Typography
                            variant="subtitle2"
                            color={isActive ? "text.primary" : "text.secondary"}
                            sx={{
                              fontWeight: isActive ? 700 : 600,
                              fontSize: "0.98rem",
                              lineHeight: 1.25,
                              transition: "color 0.35s ease",
                            }}
                          >
                            {item.day}: {item.label}
                          </Typography>
                          <Icon
                            sx={{
                              fontSize: "1.9rem",
                              color: isActive ? "secondary.main" : "text.disabled",
                              opacity: isActive ? 1 : 0.7,
                              transform: isActive ? "scale(1.06)" : "scale(1)",
                              transition: "color 0.35s ease, opacity 0.35s ease, transform 0.35s ease",
                            }}
                          />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              gridColumn: "2 / 4",
                              display: "block",
                              fontSize: "0.88rem",
                              lineHeight: 1.2,
                              pl: 0.5,
                            }}
                          >
                            {item.detail}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }} sx={{ display: "flex" }}>
          <Card
            className="reveal"
            style={{ "--delay": "200ms" }}
            sx={{
              flex: 1,
              borderRadius: "var(--radius-card)",
              ...mutedSurface(theme.palette.mode),
              minHeight: { xs: "auto", md: 520 },
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                transform: "none",
                boxShadow: "none",
              },
            }}
          >
            <CardContent
              sx={{
                flex: 1,
                p: cardPadTight,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack spacing={1.5} sx={{ flex: 1, height: "100%" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "var(--radius-panel)",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: lightMode
                        ? "rgba(148, 163, 184, 0.18)"
                        : "rgba(148, 163, 184, 0.22)",
                    }}
                  >
                    <BlockOutlinedIcon color="action" />
                  </Box>
                  <Typography variant="subtitle1" color="text.secondary">
                    What is not included
                  </Typography>
                </Stack>
                <Stack sx={{ flex: 1, justifyContent: "space-between", py: 1 }}>
                  {excluded.map((item) => (
                    <Box
                      key={item.label}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                        columnGap: 1.5,
                        rowGap: 0.35,
                        alignItems: "center",
                      }}
                    >
                      <HighlightOffOutlinedIcon color="action" fontSize="small" />
                      <Typography color="text.secondary" sx={{ fontWeight: 600 }}>
                        {item.label}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ gridColumn: "2 / 3", pl: 0.25 }}
                      >
                        {item.detail}
                      </Typography>
                    </Box>
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
