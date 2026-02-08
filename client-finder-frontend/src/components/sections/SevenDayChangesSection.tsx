"use client";

import { Box, Stack, Typography } from "@mui/material";
import Section from "@/components/layout/Section";
import { maxTextWidth } from "@/lib/layoutTokens";

export default function SevenDayChangesSection() {
  return (
    <Section
      id="seven-day-changes"
      eyebrow="7 Days"
      title="What changes in 7 days"
      variant="paper"
      disableSpine
      sx={{ py: { xs: 8, md: 10 } }}
    >
      <Stack spacing={2.25} sx={{ maxWidth: maxTextWidth }}>
        <Typography color="text.secondary">
          You are not getting a cosmetic refresh. You are getting a focused rebuild that removes friction and gives you
          clear performance data from day one.
        </Typography>
        <Typography color="text.secondary">
          You don&apos;t need to understand the tools - you just need a site that removes friction and shows you what&apos;s
          working.
        </Typography>
        <Box component="ol" sx={{ pl: 2.5, display: "grid", gap: 1.25 }}>
          <Typography component="li" color="text.secondary">
            Clear first impression: visitors understand what you do in seconds, so you get less confusion and more
            engaged prospects.
          </Typography>
          <Typography component="li" color="text.secondary">
            Faster, steadier experience: your pages load quickly and behave predictably on mobile, which helps reduce
            bounce (validated using{" "}
            <Box
              component="a"
              href="https://pagespeed.web.dev/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "primary.main", textDecoration: "underline" }}
            >
              Google PageSpeed Insights
            </Box>
            ).
          </Typography>
          <Typography component="li" color="text.secondary">
            Clear next step: visitors face fewer decisions and can act quickly from any screen, especially on mobile.
          </Typography>
          <Typography component="li" color="text.secondary">
            Lead-source visibility: you can see where inquiries come from and which pages drive action, so you are not
            guessing anymore (tracked in{" "}
            <Box
              component="a"
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "primary.main", textDecoration: "underline" }}
            >
              Google Analytics
            </Box>
            ).
          </Typography>
          <Typography component="li" color="text.secondary">
            SEO clarity and cleanup: your pages are clearer for people, easier for search engines to understand, and
            less likely to hide technical issues (aligned with{" "}
            <Box
              component="a"
              href="https://web.dev/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: "primary.main", textDecoration: "underline" }}
            >
              web.dev best practices
            </Box>
            ).
          </Typography>
        </Box>
      </Stack>
    </Section>
  );
}
