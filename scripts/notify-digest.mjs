// Posts recently-published articles to the `notify` Supabase Edge Function,
// which emails the digest to subscribers. Run after fetch-news.mjs in CI.
//
// Sends a full 24h lookback window every run (not just "since last run") —
// the notify function itself dedupes against articles it has already
// emailed (see supabase/functions/notify), so this stays idempotent even if
// the workflow re-runs or overlaps with the previous window.
//
// Required env: SUPABASE_URL, NOTIFY_SECRET. Missing/blank vars are treated
// as "not configured yet" and the script exits quietly (0) so the deploy
// isn't blocked before the Supabase project is set up.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_FILE = join(ROOT, "data", "news.json");
const LOOKBACK_MS = 24 * 3600 * 1000;

async function main() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const notifySecret = process.env.NOTIFY_SECRET;

  if (!supabaseUrl || !notifySecret) {
    console.log("notify-digest: SUPABASE_URL/NOTIFY_SECRET not set — skipping (feature not configured yet).");
    return;
  }

  const { articles } = JSON.parse(readFileSync(NEWS_FILE, "utf8"));
  const cutoff = Date.now() - LOOKBACK_MS;
  const recent = articles.filter((a) => Date.parse(a.date) >= cutoff);

  if (recent.length === 0) {
    console.log("notify-digest: no articles in the last 24h — nothing to send.");
    return;
  }

  const res = await fetch(`${supabaseUrl}/functions/v1/notify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-notify-secret": notifySecret },
    body: JSON.stringify({ articles: recent }),
  });

  const body = await res.text();
  if (!res.ok) {
    // Non-fatal: don't fail the whole deploy just because email sending had
    // a problem. Logged loudly so it's visible in the Action run.
    console.error(`notify-digest: notify function returned ${res.status}: ${body}`);
    return;
  }
  console.log(`notify-digest: ${body}`);
}

main().catch((err) => {
  console.error("notify-digest: unexpected error (non-fatal):", err);
});
