"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { maxTextWidth, sectionPaddingY } from "@/lib/layoutTokens";

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  sx = {},
  variant = "plain",
  disableSpine = false,
}: any) {
  const theme = useTheme();
  const hasHeader = Boolean(eyebrow || title || subtitle);
  const lightMode = theme.palette.mode === "light";

  const background =
    variant === "tinted"
      ? lightMode
        ? "linear-gradient(180deg, rgba(11, 61, 145, 0.04), rgba(255, 255, 255, 0.9))"
        : "linear-gradient(180deg, rgba(93, 169, 255, 0.06), rgba(17, 22, 31, 0.92))"
      : variant === "paper"
        ? theme.palette.background.paper
        : "transparent";

  return (
    <Box
      component="section"
      id={id}
      sx={{
        py: sectionPaddingY,
        scrollMarginTop: { xs: 88, md: 104 },
        position: "relative",
        overflow: "hidden",
        background,
        borderBottom: `1px solid ${theme.palette.divider}`,
        ...sx,
      }}
    >
      <Container maxWidth="lg" className="ui-max">
        <Box
          className="ui-spine"
          sx={{
            "--spine-pad": disableSpine ? { xs: 0, md: "24px" } : { xs: "16px", md: "24px" },
            "--spine-body-pad": disableSpine ? { xs: 0, md: "16px" } : { xs: "10px", md: "16px" },
            ...(disableSpine ? { "&::before": { display: "none" } } : null),
          }}
        >
          {hasHeader ? (
            <Stack spacing={1.5} sx={{ maxWidth: maxTextWidth }}>
              {eyebrow ? (
                <Typography
                  variant="overline"
                  sx={{ letterSpacing: "0.18em", opacity: 0.7 }}
                >
                  {eyebrow}
                </Typography>
              ) : null}

              {title ? (
                <Typography component="h2" variant="h3" fontWeight={700}>
                  {title}
                </Typography>
              ) : null}

              {subtitle ? (
                <Typography color="text.secondary" sx={{ maxWidth: maxTextWidth }}>
                  {subtitle}
                </Typography>
              ) : null}
            </Stack>
          ) : null}

          <Box className="ui-spine-body" sx={{ mt: hasHeader ? 5 : 0 }}>
            {children}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
