// nodemailer via Deno's npm: specifier — deno.land/x (where this used to
// import `denomailer` from) has been deprecated in favor of JSR, and the old
// URL no longer resolves. npm: imports are the officially recommended way
// to pull npm packages into Supabase Edge Functions (see their own docs),
// so this is both the fix and the more future-proof choice.
import nodemailer from "npm:nodemailer@6.9.16";

type SendEmailArgs = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

function requireEnv(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing required secret: ${name}`);
  return value;
}

/**
 * Sends one email over SMTP (Gmail by default — see .env.example for setup).
 * Opens a fresh connection per call: Edge Functions are short-lived and
 * stateless, so there's no long-running process to keep a pooled connection
 * on, and volumes here (subscriber counts for a niche news digest) are far
 * below Gmail's ~500/day limit.
 */
export async function sendEmail({ to, subject, html, text }: SendEmailArgs) {
  const host = requireEnv("SMTP_HOST");
  const port = Number(Deno.env.get("SMTP_PORT") ?? "465");
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");
  const from = Deno.env.get("EMAIL_FROM") || `CareZeno <${user}>`;

  const transporter = nodemailer.createTransport({
    host,
    port,
    // 465 = implicit TLS (Gmail's default); 587 would use STARTTLS instead.
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({ from, to, subject, text, html });
}
