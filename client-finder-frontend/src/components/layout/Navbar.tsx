"use client";

import Image from "next/image";
import { useEffect, useState, type SVGProps } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useThemeMode } from "@/app/providers";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

const navLinks = [
  { id: "process", label: "Process" },
  { id: "recent-rebuild", label: "Recent Rebuild" },
];
const navPillWidth = 160;

const SunIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    <path
      d="M12 3.5v2.2M12 18.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const MoonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    <path
      d="M20 14.6A8.5 8.5 0 0 1 9.4 4a7 7 0 1 0 10.6 10.6Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MenuIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    <path
      d="M4 7h16M4 12h16M4 17h16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Navbar() {
  const theme = useTheme();
  const { mode, toggleMode } = useThemeMode();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [activeSection, setActiveSection] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const elements = navLinks
      .map((link) => document.getElementById(link.id))
      .filter(Boolean);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (!visible.length) return;
        const mostVisible = visible.sort(
          (a, b) => b.intersectionRatio - a.intersectionRatio,
        )[0];
        setActiveSection(mostVisible.target.id);
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: [0.2, 0.5, 0.8],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        backdropFilter: "blur(10px)",
        backgroundColor:
          mode === "dark" ? "rgba(17,22,31,0.82)" : "rgba(255,255,255,0.82)",
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ flexShrink: 0, gap: 2 }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Image
                src={
                  mode === "light"
                    ? "/assets/MILogo_dark_ui.webp"
                    : "/assets/MILogo_ui.webp"
                }
                alt="MI Website Rebuilds logo"
                width={48}
                height={48}
                sizes="48px"
                priority
              />
            </Box>
            <Typography
              variant="subtitle1"
              fontWeight={800}
              sx={{ letterSpacing: "-0.02em" }}
            >
              Website Rebuilds
            </Typography>
          </Stack>

          {!isMobile && (
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                ml: { md: 2 },
                mr: { md: 2 },
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              {navLinks.map((link) => (
                <Button
                  key={link.id}
                  color="inherit"
                  onClick={() => scrollToId(link.id)}
                  sx={{
                    borderBottom: "2px solid",
                    borderColor:
                      activeSection === link.id
                        ? "primary.main"
                        : "transparent",
                    color:
                      activeSection === link.id
                        ? "primary.main"
                        : "text.primary",
                    borderRadius: "var(--radius-pill)",
                    width: navPillWidth,
                    minWidth: navPillWidth,
                    justifyContent: "center",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    py: 0.9,
                    px: 1.25,
                    marginRight: "16px",
                  }}
                >
                  {link.label}
                </Button>
              ))}
            </Stack>
          )}

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ ml: { xs: "auto", md: 0 }, flexShrink: 0, gap: 2 }}
          >
            {!isMobile && (
              <Button
                variant="contained"
                onClick={() => scrollToId("review")}
                sx={{
                  width: navPillWidth,
                  minWidth: navPillWidth,
                  justifyContent: "center",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                }}
              >
                Request a Review
              </Button>
            )}
            {isMobile && (
              <IconButton
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
                sx={{
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                }}
              >
                <MenuIcon width={22} height={22} />
              </IconButton>
            )}
            <IconButton
              aria-label="Toggle theme"
              onClick={toggleMode}
              sx={{
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 2,
              }}
            >
              {mode === "dark" ? (
                <SunIcon width={20} height={20} />
              ) : (
                <MoonIcon width={20} height={20} />
              )}
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          BackdropProps: {
            sx: {
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              backgroundColor:
                mode === "dark"
                  ? "rgba(15, 23, 42, 0.4)"
                  : "rgba(15, 23, 42, 0.18)",
            },
          },
        }}
        PaperProps={{
          sx: {
            width: "min(320px, 80vw)",
            p: 2,
            backgroundColor: "background.paper",
          },
        }}
      >
        <Stack spacing={2}>
          <Typography variant="subtitle1" fontWeight={700}>
            Navigate
          </Typography>
          <List disablePadding>
            {navLinks.map((link) => (
              <ListItemButton
                key={link.id}
                onClick={() => {
                  scrollToId(link.id);
                  setMobileOpen(false);
                }}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>
          <Button
            variant="contained"
            onClick={() => {
              scrollToId("review");
              setMobileOpen(false);
            }}
          >
            Free Review
          </Button>
        </Stack>
      </Drawer>
    </AppBar>
  );
}
