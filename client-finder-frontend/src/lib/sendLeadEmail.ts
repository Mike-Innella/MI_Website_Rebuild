import emailjs from "@emailjs/browser";

// EmailJS template must reference: {{name}} {{email}} {{websiteUrl}} {{businessType}} {{message}}

export async function sendLeadEmail({ name, email, websiteUrl, businessType, message }) {
  const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
  const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EmailJS is not configured.");
  }

  const required = { name, email, websiteUrl, businessType };
  const missing = Object.entries(required)
    .filter(([, value]) => typeof value !== "string" || value.trim().length === 0)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(", ")}.`);
  }

  await emailjs.send(
    serviceId,
    templateId,
    { name, email, websiteUrl, businessType, message },
    publicKey
  );

  return { ok: true };
}
