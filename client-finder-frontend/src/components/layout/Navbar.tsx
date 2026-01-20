"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import MenuIcon from "@mui/icons-material/Menu";
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
                    ? "/assets/MILogo_dark.png"
                    : "/assets/MILogo.png"
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
                <MenuIcon />
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
                <LightModeOutlinedIcon />
              ) : (
                <DarkModeOutlinedIcon />
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
