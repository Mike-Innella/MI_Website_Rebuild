function firstMatch(regex, text) {
  const m = String(text || "").match(regex);
  return m?.[1]?.trim() || null;
}

export function extractFieldsFromText(text) {
  const combined = String(text || "");

  const websiteUrl =
    firstMatch(/\b(https?:\/\/[^\s)]+)\b/i, combined) ||
    firstMatch(/\b((?:www\.)[a-z0-9.-]+\.[a-z]{2,})(?:[^\w]|$)/i, combined);

  const email = firstMatch(
    /\b([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,})\b/i,
    combined,
  );

  const businessName =
    firstMatch(/\b(?:business|company)\s*name\s*[:\-]\s*([^\n]{2,80})/i, combined) ||
    firstMatch(/\bwe(?:'| a)?re\s+([A-Z][A-Za-z0-9&' -]{1,60})\b/, combined);

  return {
    websiteUrl: websiteUrl?.startsWith("http") ? websiteUrl : websiteUrl ? `https://${websiteUrl}` : null,
    email,
    businessName,
  };
}

export function scoreLead({ websiteUrl, businessName, goalText, timelineText }) {
  const signals = [];
  let score = 0;

  if (websiteUrl) {
    score += 2;
    signals.push("has_website");
  }
  if (businessName) {
    score += 1;
    signals.push("has_business_name");
  }

  const goal = String(goalText || "").toLowerCase();
  if (/\b(calls?|leads?|appointments?|bookings?)\b/.test(goal)) {
    score += 2;
    signals.push("wants_leads");
  }

  const timeline = String(timelineText || "").toLowerCase();
  if (/\b(asap|urgent|this week|next week|today|tomorrow)\b/.test(timeline)) {
    score += 1;
    signals.push("urgent_timeline");
  }

  return { score, signals };
}

