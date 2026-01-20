import { extractFieldsFromText } from "./leadScoring.js";

const HIRE_INTENT =
  /\b(hire|work with you|get started|book|schedule|quote|estimate|pricing)\b/i;

const NEEDS_SITE =
  /\b(need a website|rebuild|redesign|new site|new website|landing page)\b/i;

export function detectLeadSignals(text: string) {
  const fields = extractFieldsFromText(text);

  const signals: string[] = [];
  let score = 0;

  if (fields.email) {
    score += 2;
    signals.push("has_email");
  }
  if (fields.websiteUrl) {
    score += 2;
    signals.push("has_website");
  }
  if (fields.businessName) {
    score += 1;
    signals.push("has_business_name");
  }

  if (HIRE_INTENT.test(text)) {
    score += 2;
    signals.push("hire_intent");
  }
  if (NEEDS_SITE.test(text)) {
    score += 1;
    signals.push("needs_website");
  }

  return { score, signals, fields };
}
