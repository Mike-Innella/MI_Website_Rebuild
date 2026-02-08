"use client";

import { Box, Stack, Typography } from "@mui/material";
import Section from "@/components/layout/Section";
import { maxTextWidth } from "@/lib/layoutTokens";

const fitPoints = [
  "Local service businesses that want more qualified calls, quote requests, and booked jobs from their current traffic.",
  "Contractors and trades teams that already have a site, but the messaging is unclear and the next step is buried.",
  "Solo operators who need a practical rebuild, not a long design process with unclear ROI.",
  "Owners with existing websites that look acceptable but do not convert visitors into real inquiries consistently.",
  "Not for large ecommerce builds, custom app platforms, or teams that need multi-month brand strategy first.",
];

export default function AudienceFitSection() {
  return (
    <Section
      id="fit"
      eyebrow="Fit"
      title="Who this is for / Not for"
      variant="tinted"
      disableSpine
      sx={{ py: { xs: 8, md: 10 } }}
    >
      <Stack spacing={2.25} sx={{ maxWidth: maxTextWidth }}>
        <Typography color="text.secondary">
          This offer is built for small business owners who need faster results from the website they already have.
          The goal is simple: clarify the offer, reduce friction, and make contacting you the easiest step on the page.
        </Typography>
        <Box component="ul" sx={{ pl: 2.5, display: "grid", gap: 1.2 }}>
          {fitPoints.map((point) => (
            <Typography key={point} component="li" color="text.secondary">
              {point}
            </Typography>
          ))}
        </Box>
      </Stack>
    </Section>
  );
}
