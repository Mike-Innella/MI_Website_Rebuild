"use client";

import Image from "next/image";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { cardPad, primarySurface, secondarySurface } from "@/lib/uiStyles";

export default function Footer() {
  const theme = useTheme();
  const year = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const footerLinks = [
    {
      id: "included",
      label: "What's included?",
      title: "What's included",
      body: (
        <Stack spacing={1.5}>
          <Typography color="text.secondary">Deliverables:</Typography>
          <Stack spacing={0.75} color="text.secondary">
            <Typography>• Design refresh with clearer messaging</Typography>
            <Typography>• Mobile-first layout polish</Typography>
            <Typography>• Performance basics (speed + stability)</Typography>
            <Typography>• CTA clarity and contact flow</Typography>
            <Typography>• Contact form setup (EmailJS)</Typography>
          </Stack>
          <Typography color="text.secondary">Not included:</Typography>
          <Stack spacing={0.75} color="text.secondary">
            <Typography>• Custom web apps or dashboards</Typography>
            <Typography>• Large ecommerce migrations</Typography>
            <Typography>• Ongoing content production</Typography>
          </Stack>
        </Stack>
      ),
    },
    {
      id: "privacy",
      label: "Privacy?",
      title: "Privacy",
      body: (
        <Stack spacing={1.5}>
          <Typography color="text.secondary">
            Your info is used only to reply and discuss the rebuild.
          </Typography>
          <Typography color="text.secondary">
            EmailJS sends the email — no database storage or third-party resale.
          </Typography>
        </Stack>
      ),
    },
    {
      id: "speed",
      label: "How fast?",
      title: "How fast is the rebuild?",
      body: (
        <Stack spacing={1.5}>
          <Typography color="text.secondary">
            Typical timeline is 7 days from kickoff to launch.
          </Typography>
          <Stack spacing={0.75} color="text.secondary">
            <Typography>• Day 1: Goals + content priorities</Typography>
            <Typography>• Days 2–5: Rebuild + revisions</Typography>
            <Typography>• Days 6–7: QA + launch</Typography>
          </Stack>
          <Typography color="text.secondary">
            I’ll need assets, access, and any must-have copy to keep the timeline tight.
          </Typography>
        </Stack>
      ),
    },
    {
      id: "start",
      label: "How do I start?",
      title: "How do I start?",
      body: (
        <Stack spacing={1.5}>
          <Stack spacing={0.75} color="text.secondary">
            <Typography>Step 1: Submit the form.</Typography>
            <Typography>Step 2: I reply with the top fixes + next step.</Typography>
            <Typography>Step 3: We kick off the rebuild.</Typography>
          </Stack>
        </Stack>
      ),
    },
  ];

  const scrollToCta = () => {
    const el = document.getElementById("review");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const activeContent = footerLinks.find((link) => link.id === activeModal);

  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: "divider",
        py: { xs: 5, md: 8 },
        mt: 0,
        backdropFilter: "blur(12px)",
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(10, 15, 24, 0.9), rgba(10, 15, 24, 0.98))"
            : "linear-gradient(180deg, rgba(245, 247, 251, 0.9), rgba(255, 255, 255, 0.98))",
      }}
    >
      <Container>
        <Stack spacing={{ xs: 4, md: 5 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 3, md: 6 }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Stack spacing={1.5} sx={{ maxWidth: 420 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Image
                  src={
                    theme.palette.mode === "light"
                      ? "/assets/MILogo_dark_ui.webp"
                      : "/assets/MILogo_ui.webp"
                  }
                  alt="MI Website Rebuilds logo"
                  width={46}
                  height={46}
                  sizes="46px"
                  loading="lazy"
                />
                <Typography variant="subtitle1">M. I. Website Rebuilds</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                Fast, modern websites that get more customers to reach out. 7-day rebuild — no tech headaches.
              </Typography>
            </Stack>
            <Box
              sx={{
                width: { xs: "100%", md: 460 },
                borderRadius: "var(--radius-card)",
                ...primarySurface(theme.palette.mode),
                px: cardPad,
                py: cardPad,
                boxShadow: "var(--shadow-strong)",
              }}
            >
              <Stack spacing={1.5}>
                <Typography variant="h6">Request 5-minute review</Typography>
                <Typography variant="body2" color="text.secondary">
                  Send me your site and I&apos;ll tell you what to fix first.
                </Typography>
                <Button
                  component="a"
                  href="#review"
                  onClick={scrollToCta}
                  variant="contained"
                  size="large"
                  sx={{
                    alignSelf: "flex-start",
                    mt: 0.5,
                    borderRadius: "var(--radius-pill)",
                    px: 3,
                  }}
                >
                  Request 5-minute review
                </Button>
              </Stack>
            </Box>
          </Stack>
          <Divider />
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 1.5, md: 3 }}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Typography variant="body2" color="text.secondary">
              Copyright {year} M. I. Website Rebuilds
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {footerLinks.map((link) => (
                <Button
                  key={link.id}
                  variant="text"
                  size="small"
                  onClick={() => setActiveModal(link.id)}
                  sx={{ px: 0.5 }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Container>
      <Dialog
        open={Boolean(activeModal)}
        onClose={() => setActiveModal(null)}
        aria-labelledby="footer-dialog-title"
        maxWidth="sm"
        fullWidth
        BackdropProps={{
          sx: {
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            backgroundColor: theme.palette.mode === "dark" ? "rgba(10, 15, 24, 0.55)" : "rgba(10, 15, 24, 0.35)",
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "var(--radius-card)",
            ...secondarySurface,
            boxShadow: "var(--shadow-soft)",
          },
        }}
      >
        <DialogTitle id="footer-dialog-title" sx={{ fontWeight: 800 }}>
          {activeContent?.title}
        </DialogTitle>
        <DialogContent sx={{ pt: 0, pb: 2 }}>{activeContent?.body}</DialogContent>
        <DialogActions sx={{ pr: 2, pb: 2 }}>
          <Button onClick={() => setActiveModal(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
