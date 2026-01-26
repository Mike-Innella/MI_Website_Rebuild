"use client";

import { Box, Typography } from "@mui/material";
import Section from "@/components/layout/Section";
import { maxTextWidth } from "@/lib/layoutTokens";

export default function AboutSection() {
  return (
    <Section
      id="about"
      eyebrow="Who am I?"
      title="About"
      variant="tinted"
      disableSpine
    >
      <Box sx={{ maxWidth: maxTextWidth }}>
        <Typography color="text.secondary">
          Hi — I’m Mike.
          <br />I rebuild small business websites that look outdated or unclear
          into fast, modern pages that make it obvious what to do next.
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1.5 }}>
          I focus on clean frontend execution, clear messaging, and simple
          conversion flows — because most sites don’t fail from lack of effort,
          they fail from lack of clarity.
        </Typography>
      </Box>
    </Section>
  );
}
