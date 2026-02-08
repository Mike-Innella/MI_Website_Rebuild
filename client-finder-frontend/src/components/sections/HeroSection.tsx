import {
  Box,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { maxHeroWidth, maxTextWidth, sectionPaddingY } from "@/lib/layoutTokens";

const heroOptions = [
  {
    title: "My site needs credibility",
    caption:
      "You want it to look professional and trustworthy. Clean messaging, strong proof, and a modern layout make it feel legit.",
    cta: "Request 5-minute review",
  },
  {
    title: "My site isn’t getting inquiries",
    caption:
      "You want more people to contact you. I’ll point out the drop-off points and tighten the path to your CTA.",
    cta: "Request 5-minute review",
  },
  {
    title: "I’m ready to rebuild",
    caption:
      "You want a clear plan for the new site before starting. We’ll map pages, content priorities, and scope before design begins.",
    cta: "Request 5-minute review",
  },
];

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M5 12h12M13 6l6 6-6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        py: sectionPaddingY,
        borderBottom: "1px solid var(--divider)",
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: "calc(100svh - 72px)", md: "auto" },
        background: "linear-gradient(180deg, var(--glow-1) 0%, var(--page-bg) 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: { xs: -120, md: -160 },
          right: { xs: -80, md: -120 },
          width: { xs: 220, md: 320 },
          height: { xs: 220, md: 320 },
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--glow-1), transparent 70%)",
          opacity: 0.7,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(1200px at 20% -10%, var(--glow-1), transparent 60%), radial-gradient(900px at 80% 0%, var(--glow-2), transparent 55%)",
          opacity: 0.65,
          pointerEvents: "none",
        }}
      />
      <Container maxWidth="lg" className="ui-max" sx={{ px: { xs: 2, md: 3 } }}>
        <Box sx={{ maxWidth: maxHeroWidth, mx: "auto" }}>
          <Stack spacing={{ xs: 3, md: 4 }} sx={{ textAlign: "left" }}>
            <Typography
              component="h1"
              variant="h1"
              fontWeight={700}
              sx={{
                letterSpacing: "-0.03em",
                lineHeight: 1.04,
                maxWidth: { xs: "100%", md: maxTextWidth },
              }}
            >
              7-Day Website Rebuilds for Small Businesses
            </Typography>

            <Typography
              variant="h6"
              sx={{ maxWidth: maxTextWidth, color: "text.secondary" }}
              className="reveal"
              style={{ "--delay": "80ms" } as any}
            >
              If your site looks fine but isn’t generating inquiries, I’ll show you exactly why — in 5 minutes.
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              className="reveal"
              style={{ "--delay": "110ms" } as any}
            >
              Start with{" "}
              <Box component="a" href="#offer-business" sx={{ color: "primary.main", textDecoration: "underline" }}>
                pricing and scope
              </Box>{" "}
              or jump to{" "}
              <Box component="a" href="#review" sx={{ color: "primary.main", textDecoration: "underline" }}>
                request your 5-minute review
              </Box>
              .
            </Typography>

            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              sx={{ mt: 1 }}
              className="reveal"
              style={{ "--delay": "140ms" } as any}
            >
              {heroOptions.map((option) => (
                <Grid key={option.title} size={{ xs: 12, md: 4 }}>
                  <Paper
                    component="a"
                    href="#review"
                    aria-label={`${option.title} - ${option.caption}`}
                    sx={{
                      borderRadius: "var(--radius-card)",
                      p: { xs: 2.5, md: 3 },
                      height: "100%",
                      border: "1px solid",
                      borderColor: "divider",
                      backgroundColor: "var(--surface-1)",
                      cursor: "pointer",
                      display: "grid",
                      gap: 1,
                      alignContent: "space-between",
                      minHeight: { xs: 220, md: 180 },
                      boxShadow: "var(--shadow-soft)",
                      transition: "transform 0.2s ease",
                      "@media (hover: hover) and (pointer: fine)": {
                        "&:hover": {
                          transform: "translateY(-6px)",
                          borderColor: "primary.main",
                        },
                      },
                    }}
                  >
                    <Stack spacing={1}>
                      <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                        {option.title}
                      </Typography>
                      <Typography color="text.secondary">{option.caption}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ fontWeight: 700, lineHeight: 1.25 }}
                      >
                        {option.cta}
                      </Typography>
                      <Box component="span" sx={{ color: "primary.main" }}>
                        <ArrowIcon />
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <Typography
              variant="body2"
              color="text.secondary"
              className="reveal"
              style={{ "--delay": "200ms" } as any}
            >
              Send your site — I’ll reply with the top fixes you should make first.
            </Typography>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
