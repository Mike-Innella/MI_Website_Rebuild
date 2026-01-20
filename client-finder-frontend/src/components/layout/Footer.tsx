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
        <>
          I focus on fast, conversion-ready rebuilds: clearer messaging, a sharper CTA
          path, mobile polish, and performance improvements so visitors take action.
        </>
      ),
    },
    {
      id: "privacy",
      label: "Privacy?",
      title: "Privacy",
      body: (
        <>
          Your details are only used to send the review and follow-up. I never share or
          sell contact information.
        </>
      ),
    },
    {
      id: "speed",
      label: "How fast?",
      title: "How fast is the review?",
      body: (
        <>
          Most reviews go out within 24-48 hours. If I need more context, I will ask a
          quick follow-up.
        </>
      ),
    },
    {
      id: "start",
      label: "How do I start?",
      title: "How do I start?",
      body: (
        <>
          Send your site, and I will reply with the biggest friction points and quick
          wins. If it looks like a fit, we can book a short kickoff.
        </>
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
        mt: { xs: 6, md: 8 },
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
                      ? "/assets/MILogo_dark.png"
                      : "/assets/MILogo.png"
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
        <DialogContent sx={{ pt: 0, pb: 2 }}>
          <Typography color="text.secondary">{activeContent?.body}</Typography>
        </DialogContent>
        <DialogActions sx={{ pr: 2, pb: 2 }}>
          <Button onClick={() => setActiveModal(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
