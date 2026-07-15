import { handleOptions, jsonResponse } from "../_shared/cors.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { sendEmail } from "../_shared/mailer.ts";
import { welcomeEmail } from "../_shared/templates.ts";

// Deliberately permissive check (not a full RFC 5322 validator) — good
// enough to catch typos without rejecting real addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  let email: unknown;
  try {
    const body = await req.json();
    email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : undefined;
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email)) {
    return jsonResponse({ error: "Please enter a valid email address" }, 400);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;

  try {
    const supabase = supabaseAdmin();

    // Upsert so re-subscribing (or double-clicking) never errors, and always
    // returns the row's unsubscribe token whether it's new or already existed.
    const { data, error } = await supabase
      .from("subscribers")
      .upsert({ email }, { onConflict: "email", ignoreDuplicates: false })
      .select("id, unsubscribe_token, created_at")
      .single();

    if (error) throw error;

    // Link straight at the Edge Function: clicking it unsubscribes and shows a
    // confirmation. This works even when the static site isn't deployed, and
    // never 404s (the function is always live).
    const unsubscribeUrl = `${supabaseUrl}/functions/v1/unsubscribe?token=${data.unsubscribe_token}`;
    const { subject, html, text } = welcomeEmail(unsubscribeUrl);

    // Don't fail the signup if the welcome email bounces/fails to send — the
    // subscription itself already succeeded and is what matters most. But do
    // surface the failure (in the response *and* on the row) instead of
    // swallowing it silently — that was making this impossible to debug
    // without digging through dashboard logs.
    let emailSent = false;
    let emailError: string | undefined;
    try {
      await sendEmail({ to: email, subject, html, text });
      emailSent = true;
    } catch (err) {
      emailError = err instanceof Error ? err.message : String(err);
      console.error("Welcome email failed to send:", err);
    }

    await supabase.from("subscribers").update({ welcome_sent: emailSent }).eq("id", data.id);

    return jsonResponse({ ok: true, emailSent, emailError }, 200);
  } catch (err) {
    console.error("subscribe error:", err);
    return jsonResponse({ error: "Something went wrong, please try again" }, 500);
  }
});
