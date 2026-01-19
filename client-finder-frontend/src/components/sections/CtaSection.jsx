"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Section from "@/components/layout/Section";
import { sendLeadEmail } from "@/lib/sendLeadEmail";
import { maxHeroWidth, sectionPaddingCta } from "@/lib/layoutTokens";
import { primarySurface, secondarySurface } from "@/lib/uiStyles";

const initialState = {
  name: "",
  businessName: "",
  websiteUrl: "",
  email: "",
  message: "",
  company: "",
};

const ctaCardPad = { xs: 2, md: 3 };

export default function CtaSection() {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const [form, setForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const nameErrorId = "cta-name-error";
  const businessErrorId = "cta-business-error";
  const websiteErrorId = "cta-website-error";
  const emailErrorId = "cta-email-error";
  const messageHelperId = "cta-message-help";

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedName = form.name.trim();
  const trimmedBusinessName = form.businessName.trim();
  const trimmedWebsiteUrl = form.websiteUrl.trim();
  const trimmedEmail = form.email.trim();
  const errors = {
    name: trimmedName ? "" : "Name is required.",
    businessName: trimmedBusinessName ? "" : "Business name is required.",
    websiteUrl: trimmedWebsiteUrl ? "" : "Website URL is required.",
    email: trimmedEmail.length
      ? emailPattern.test(trimmedEmail)
        ? ""
        : "Enter a valid email."
      : "Email is required.",
  };

  const infoIconSx = {
    fontSize: 18,
    color: "primary.main",
    flexShrink: 0,
  };

  const nameError = hasSubmitted && Boolean(errors.name);
  const businessError = hasSubmitted && Boolean(errors.businessName);
  const websiteError = hasSubmitted && Boolean(errors.websiteUrl);
  const emailError = hasSubmitted && Boolean(errors.email);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizeUrl = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) {
      return;
    }
    setHasSubmitted(true);
    setIsLoading(true);
    setErrorMessage("");
    setIsSuccess(false);

    if (form.company) {
      setIsLoading(false);
      setIsSuccess(true);
      return;
    }

    if (Object.values(errors).some(Boolean)) {
      setIsLoading(false);
      return;
    }

    try {
      const normalizedUrl = normalizeUrl(form.websiteUrl);
      await sendLeadEmail({
        name: trimmedName,
        businessName: trimmedBusinessName,
        websiteUrl: normalizedUrl,
        email: trimmedEmail,
        message: form.message.trim() || "No message provided.",
      });

      setIsSuccess(true);
      setForm(initialState);
      setHasSubmitted(false);
    } catch (error) {
      setErrorMessage(error?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialState);
    setIsSuccess(false);
    setHasSubmitted(false);
    setErrorMessage("");
  };

  return (
    <Section
      id="cta"
      eyebrow="FREE REVIEW"
      title="Send your website - I'll tell you if it's costing you customers."
      subtitle={
        <Box component="span">
          <Box component="span" sx={{ display: "block", color: "text.primary", opacity: 0.82 }}>
            Share your site and I&apos;ll call out the biggest friction points to fix first.
          </Box>
          <Box
            component="span"
            sx={{
              display: "block",
              mt: 0.6,
              fontSize: { xs: "0.85rem", md: "0.95rem" },
              color: "text.secondary",
            }}
          >
            No pressure. I&apos;ll reply with a short, honest action plan.
          </Box>
        </Box>
      }
      variant="paper"
      disableSpine
      sx={{
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(93, 169, 255, 0.08), rgba(17, 22, 31, 0.95))"
            : "linear-gradient(180deg, rgba(11, 61, 145, 0.06), rgba(255, 255, 255, 0.95))",
        py: sectionPaddingCta,
        "& .MuiTypography-overline": {
          letterSpacing: "0.24em",
          opacity: 0.85,
          color: "text.primary",
        },
        "& .MuiTypography-h3": {
          fontSize: { xs: "clamp(1.85rem, 4.8vw, 2.3rem)", md: "clamp(2.4rem, 2.7vw, 2.9rem)" },
        },
        "& .ui-spine > .MuiStack-root": {
          gap: { xs: 1, md: 1.2 },
        },
      }}
    >
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        alignItems="stretch"
        sx={{ maxWidth: maxHeroWidth, mx: "auto" }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            className="reveal"
            style={{ "--delay": "80ms" }}
            sx={{
              borderRadius: "var(--radius-card)",
              ...primarySurface(theme.palette.mode),
              transition: "border 0.2s ease, box-shadow 0.2s ease",
              "&:focus-within": {
                borderColor: "primary.main",
                boxShadow: "0 24px 60px rgba(11, 61, 145, 0.2)",
              },
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{ p: ctaCardPad, height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Stack spacing={3} sx={{ flex: 1 }}>
                {isSuccess ? (
                  <Stack spacing={1.5} sx={{ flex: 1, justifyContent: "center" }}>
                    <Typography variant="h6">Got it - I&apos;ll take a look.</Typography>
                    <Typography color="text.secondary">
                      I&apos;ll reply with the biggest friction points and quick wins.
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      onClick={handleReset}
                      sx={{ width: "fit-content", px: 1, py: 0.5 }}
                    >
                      Send another
                    </Button>
                  </Stack>
                ) : (
                  <Box component="form" onSubmit={handleSubmit} sx={{ position: "relative" }}>
                    <Stack spacing={2}>
                      <Stack spacing={1}>
                        <Typography variant="h5">Get a free site review</Typography>
                        <Typography variant="body2" color="text.secondary">
                          A few details help me tailor the feedback to your goals.
                        </Typography>
                      </Stack>
                      <TextField
                        id="cta-name"
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        error={nameError}
                        helperText={nameError ? errors.name : ""}
                        FormHelperTextProps={nameError ? { id: nameErrorId } : undefined}
                        inputProps={{
                          "aria-describedby": nameError ? nameErrorId : undefined,
                          "aria-invalid": nameError ? "true" : undefined,
                        }}
                        fullWidth
                      />
                      <TextField
                        id="cta-business"
                        label="Business name"
                        name="businessName"
                        value={form.businessName}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        error={businessError}
                        helperText={businessError ? errors.businessName : ""}
                        FormHelperTextProps={businessError ? { id: businessErrorId } : undefined}
                        inputProps={{
                          "aria-describedby": businessError ? businessErrorId : undefined,
                          "aria-invalid": businessError ? "true" : undefined,
                        }}
                        fullWidth
                      />
                      <TextField
                        id="cta-website"
                        label="Website URL"
                        name="websiteUrl"
                        value={form.websiteUrl}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        error={websiteError}
                        helperText={websiteError ? errors.websiteUrl : ""}
                        FormHelperTextProps={websiteError ? { id: websiteErrorId } : undefined}
                        inputProps={{
                          inputMode: "url",
                          autoComplete: "url",
                          "aria-describedby": websiteError ? websiteErrorId : undefined,
                          "aria-invalid": websiteError ? "true" : undefined,
                        }}
                        fullWidth
                      />
                      <TextField
                        id="cta-email"
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        error={emailError}
                        helperText={emailError ? errors.email : ""}
                        FormHelperTextProps={emailError ? { id: emailErrorId } : undefined}
                        inputProps={{
                          "aria-describedby": emailError ? emailErrorId : undefined,
                          "aria-invalid": emailError ? "true" : undefined,
                        }}
                        fullWidth
                      />
                      <TextField
                        id="cta-message"
                        label="Message (optional)"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder="What are you hoping to improve? (e.g., more calls, faster load, better mobile layout)"
                        multiline
                        rows={isMdUp ? 5 : 4}
                        helperText="Optional - but helps me give you a better action plan."
                        FormHelperTextProps={{ id: messageHelperId }}
                        inputProps={{
                          maxLength: 1000,
                          "aria-describedby": messageHelperId,
                        }}
                        fullWidth
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          left: "-10000px",
                          top: "auto",
                          width: 1,
                          height: 1,
                          overflow: "hidden",
                        }}
                      >
                        <TextField
                          label="Company"
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          tabIndex={-1}
                          autoComplete="off"
                        />
                      </Box>
                      {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}
                      <Box>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={isLoading}
                          sx={{
                            minHeight: 54,
                            px: 4,
                            transition:
                              "transform 0.15s ease, box-shadow 0.2s ease, background-color 0.2s ease",
                            "&:hover": {
                              backgroundColor: theme.palette.primary.dark,
                            },
                            "&:active": {
                              transform: "scale(0.98)",
                            },
                          }}
                        >
                          {isLoading ? "Sending..." : "Get my free site review"}
                        </Button>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                          No obligation. I&apos;ll tell you if a rebuild is not needed.
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={2.5} className="reveal" style={{ "--delay": "140ms" }}>
            <Card
              sx={{
                borderRadius: "var(--radius-card)",
                ...secondarySurface,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent
                sx={{ p: ctaCardPad, height: "100%", display: "flex", flexDirection: "column" }}
              >
                <Stack spacing={2} sx={{ flex: 1 }}>
                  <Stack spacing={1.6}>
                    <Typography variant="h6">What happens next</Typography>
                    <Stack
                      component="ul"
                      spacing={4}
                      sx={{ m: 0, p: 0, listStyle: "none", color: "text.secondary" }}
                    >
                      {[
                        "I review your site and note the biggest friction points.",
                        "You get a short list of fixes and priorities.",
                        "We decide if the 7-day rebuild is a fit.",
                      ].map((item) => (
                        <Stack
                          key={item}
                          component="li"
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <CheckCircleOutlineIcon sx={infoIconSx} />
                          <Typography color="text.secondary">{item}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Typical reply: within 24-48 hours.
                    </Typography>
                  </Stack>
                  <Divider sx={{ my: 2, opacity: 0.6 }} />
                  <Stack spacing={1.6}>
                    <Typography variant="h6">What I check</Typography>
                    <Stack
                      component="ul"
                      spacing={4}
                      sx={{ m: 0, p: 0, listStyle: "none", color: "text.secondary" }}
                    >
                      {[
                        "Mobile layout and speed targets",
                        "Clear contact path and CTA",
                        "Messaging and layout hierarchy",
                      ].map((item) => (
                        <Stack
                          key={item}
                          component="li"
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <CheckCircleOutlineIcon sx={infoIconSx} />
                          <Typography color="text.secondary">{item}</Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Section>
  );
}
