"use client";

import { Box, Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Section from "@/components/layout/Section";
import { maxHeroWidth } from "@/lib/layoutTokens";
import { cardPad, primarySurface } from "@/lib/uiStyles";

export default function FinalCtaSection() {
  const theme = useTheme();

  return (
    <Section id="final-cta" variant="plain" disableSpine>
      <Box sx={{ maxWidth: maxHeroWidth, mx: "auto" }}>
        <Card
          sx={{
            borderRadius: "var(--radius-card)",
            ...primarySurface(theme.palette.mode),
            boxShadow: "var(--shadow-strong)",
          }}
        >
          <CardContent sx={{ p: cardPad }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              alignItems={{ xs: "flex-start", md: "center" }}
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h5" fontWeight={800}>
                  Not sure which option fits?
                </Typography>
                <Typography color="text.secondary">
                  Request 5-minute review.
                </Typography>
              </Box>
              <Stack spacing={1} alignItems={{ xs: "flex-start", md: "flex-end" }}>
                <Button variant="contained" size="large" component="a" href="#review">
                  Request 5-minute review
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Ongoing support is optional — you’re not locked into anything.
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Section>
  );
}
