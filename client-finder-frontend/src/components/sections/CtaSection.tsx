"use client";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import Section from "@/components/layout/Section";
import { sendLeadEmail } from "@/lib/sendLeadEmail";
import { maxHeroWidth, sectionPaddingCta } from "@/lib/layoutTokens";
import { primarySurface, secondarySurface } from "@/lib/uiStyles";

const initialState = {
  name: "",
  email: "",
  websiteUrl: "",
  businessType: "",
  company: "",
  message: "",
};

const businessTypes = ["Local service", "Online service", "Ecommerce", "Creator/portfolio", "Other"];

export default function CtaSection() {
  const theme = useTheme();
  const [form, setForm] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const trimmedName = form.name.trim();
  const trimmedEmail = form.email.trim();
  const trimmedWebsiteUrl = form.websiteUrl.trim();
  const trimmedBusinessType = form.businessType.trim();
  const trimmedMessage = form.message.trim();

  const errors = {
    name: trimmedName ? "" : "Name is required.",
    email: trimmedEmail.length ? (emailPattern.test(trimmedEmail) ? "" : "Enter a valid email.") : "Email is required.",
    websiteUrl: trimmedWebsiteUrl ? "" : "Website URL is required.",
    businessType: trimmedBusinessType ? "" : "Business type is required.",
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const normalizeUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isLoading) return;

    setHasSubmitted(true);
    setErrorMessage("");
    setIsSuccess(false);
    setIsLoading(true);

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
        email: trimmedEmail,
        websiteUrl: normalizedUrl,
        businessType: trimmedBusinessType,
        message: trimmedMessage || "No additional notes provided.",
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

  return (
    <Section
      id="review"
      eyebrow="Contact"
      title="Request 5-minute review"
      subtitle="I’ll record a short Loom video reviewing your site and showing what’s holding it back."
      variant="paper"
      disableSpine
      sx={{
        py: sectionPaddingCta,
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(93, 169, 255, 0.08), rgba(17, 22, 31, 0.95))"
            : "linear-gradient(180deg, rgba(11, 61, 145, 0.06), rgba(255, 255, 255, 0.95))",
      }}
    >
      <Box id="contact" sx={{ position: "relative", top: "-80px", height: 0 }} />
      <Grid
        container
        spacing={{ xs: 3, md: 4 }}
        alignItems="stretch"
        sx={{ maxWidth: maxHeroWidth, mx: "auto" }}
      >
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            className="reveal"
            style={{ "--delay": "80ms" } as any}
            sx={{
              borderRadius: "var(--radius-card)",
              ...primarySurface(theme.palette.mode),
              transition: "border 0.2s ease, box-shadow 0.2s ease",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 }, height: "100%", display: "flex", flexDirection: "column" }}>
              {isSuccess ? (
                <Stack spacing={1.5} sx={{ flex: 1, justifyContent: "center" }}>
                  <Typography variant="h6">Thanks — review on the way.</Typography>
                  <Typography color="text.secondary">
                    I’ll send a short recording that calls out the biggest fixes to make.
                  </Typography>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setForm(initialState);
                      setIsSuccess(false);
                      setHasSubmitted(false);
                      setErrorMessage("");
                    }}
                    sx={{ width: "fit-content", px: 1, py: 0.5 }}
                  >
                    Send another
                  </Button>
                </Stack>
              ) : (
                <Box component="form" onSubmit={handleSubmit}>
                  <Stack spacing={2.25}>
                    <Stack spacing={0.5}>
                      <Typography variant="h5">Required fields only</Typography>
                      <Typography variant="body2" color="text.secondary">
                        A quick form so I can tailor the recording to your business.
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
                      error={hasSubmitted && Boolean(errors.name)}
                      helperText={hasSubmitted && errors.name ? errors.name : ""}
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
                      error={hasSubmitted && Boolean(errors.email)}
                      helperText={hasSubmitted && errors.email ? errors.email : ""}
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
                      error={hasSubmitted && Boolean(errors.websiteUrl)}
                      helperText={hasSubmitted && errors.websiteUrl ? errors.websiteUrl : ""}
                      fullWidth
                    />
                    <TextField
                      id="cta-business-type"
                      select
                      label="Business type"
                      name="businessType"
                      value={form.businessType}
                      onChange={handleChange}
                      required
                      disabled={isLoading}
                      error={hasSubmitted && Boolean(errors.businessType)}
                      helperText={hasSubmitted && errors.businessType ? errors.businessType : ""}
                      fullWidth
                      >
                      {businessTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                          {type}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      id="cta-message"
                      label="Anything specific you want me to look at? (optional)"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      disabled={isLoading}
                      placeholder='e.g., "Not getting calls", "Unsure what to change first", "Old site needs a refresh"'
                      multiline
                      rows={4}
                      helperText="This helps me tailor the review — not required."
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
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isLoading}
                      sx={{ minHeight: 54 }}
                    >
                      {isLoading ? "Sending..." : "Request 5-minute review"}
                    </Button>
                    <Typography variant="body2" color="text.secondary">
                      You’ll usually get your review within 24–48 hours.
                    </Typography>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            className="reveal"
            style={{ "--delay": "140ms" } as any}
            sx={{
              borderRadius: "var(--radius-card)",
              ...secondarySurface,
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent
              sx={{
                p: { xs: 2.5, md: 3.5 },
                display: "flex",
                flexDirection: "column",
                gap: 2.5,
                height: "100%",
              }}
            >
              <Box sx={{ color: "text.secondary" }}>
                <Typography>
                  I’ll record a short Loom pointing out what’s blocking inquiries and where quick wins are hiding.
                </Typography>
              </Box>
              <Box sx={{ display: "grid", gap: 2 }}>
                <Box>
                  <Typography variant="h6">What you’ll receive</Typography>
                  <Stack spacing={1.25} color="text.secondary" sx={{ mt: 1.25 }}>
                    <Typography>• A recorded walkthrough of your current site</Typography>
                    <Typography>• The biggest blockers to getting more inquiries</Typography>
                    <Typography>• The fastest fixes to test first</Typography>
                    <Typography>• A short plan on what to improve first</Typography>
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="h6">What I’ll check</Typography>
                  <Stack spacing={1.25} color="text.secondary" sx={{ mt: 1.25 }}>
                    <Typography>• Clarity of your offer and next step</Typography>
                    <Typography>• How easy it is to contact you on mobile</Typography>
                    <Typography>• Whether pages make people trust you quickly</Typography>
                    <Typography>• Speed, layout, and obvious call-to-action</Typography>
                  </Stack>
                </Box>
              </Box>
              <Box
                sx={{
                  mt: "auto",
                  p: 2,
                  borderRadius: "var(--radius-panel)",
                  backgroundColor:
                    theme.palette.mode === "dark" ? "rgba(93, 169, 255, 0.08)" : "rgba(11, 61, 145, 0.06)",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography color="text.secondary">
                  If the fit isn’t right, I’ll tell you — no obligation to move forward.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Section>
  );
}
