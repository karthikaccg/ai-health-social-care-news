// npm: specifier, matching Supabase's own current Edge Function docs —
// more reliable than pulling from esm.sh's build of the package.
import { createClient } from "npm:@supabase/supabase-js@2";

// SUPABASE_URL and a service-role key are injected automatically into every
// Edge Function's environment — never set these yourself with
// `supabase secrets set`. Which service-role env var exists depends on
// whether the project has moved to Supabase's newer publishable/secret API
// key system: legacy projects get `SUPABASE_SERVICE_ROLE_KEY` directly;
// newer ones expose `SUPABASE_SECRET_KEYS` as a JSON dictionary instead.
// Support both so this keeps working either way.
function getServiceRoleKey(): string | undefined {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;

  const secretKeysJson = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (secretKeysJson) {
    try {
      const parsed = JSON.parse(secretKeysJson);
      return parsed?.default;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function supabaseAdmin() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = getServiceRoleKey();
  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL / service-role key not available (checked SUPABASE_SERVICE_ROLE_KEY and SUPABASE_SECRET_KEYS)"
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
