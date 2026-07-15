import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Opened directly as a link from inside an email client. Supabase forces
// `Content-Type: text/plain` on responses from the *.supabase.co functions
// domain, so we return a single, human-readable line (NOT an HTML document —
// that would show as raw markup). Clicking the link updates the database
// (removes the subscriber) and this message confirms it.
function textResponse(message: string): Response {
  return new Response(message, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

Deno.serve(async (req) => {
  const token = new URL(req.url).searchParams.get("token");

  // The token column is a uuid, so a missing/malformed token can never match a
  // row — treat it as an already-used/invalid link.
  if (!token || !UUID_RE.test(token)) {
    return textResponse("This unsubscribe link is invalid or has already been used. You can close this tab.");
  }

  try {
    const supabase = supabaseAdmin();
    const { error, count } = await supabase
      .from("subscribers")
      .delete({ count: "exact" })
      .eq("unsubscribe_token", token);

    if (error) throw error;

    return textResponse(
      count && count > 0
        ? "You've been unsubscribed from CareZeno. You won't receive any more emails. You can close this tab."
        : "You're already unsubscribed — there's nothing more to do. You can close this tab."
    );
  } catch (err) {
    console.error("unsubscribe error:", err);
    return textResponse("Sorry, something went wrong. Please try clicking the link again later.");
  }
});
