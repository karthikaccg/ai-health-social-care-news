// This is a statically exported site (no server), so the Supabase Edge
// Functions are called directly from the browser. These NEXT_PUBLIC_ values
// are inlined into the build. The key is safe to expose (edge functions here
// have JWT verification disabled and do their own auth, and this key can't
// touch anything beyond invoking them). Supports both of Supabase's key
// systems: the newer `sb_publishable_...` key (NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
// and the legacy JWT anon key (NEXT_PUBLIC_SUPABASE_ANON_KEY), whichever your
// project's dashboard gave you.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fyghjspzdfoddahxuugj.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "";
