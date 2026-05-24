function requireEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing Supabase environment variable: ${name}`);
  }

  return value;
}

function getSupabasePublishableKeyValue() {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function getSupabaseBrowserEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = getSupabasePublishableKeyValue();

  if (!url || !publishableKey) {
    return null;
  }

  return { url, publishableKey };
}

export function getMissingSupabaseBrowserEnv() {
  const missing: string[] = [];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    missing.push("NEXT_PUBLIC_SUPABASE_URL");
  }

  if (!getSupabasePublishableKeyValue()) {
    missing.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY o NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return missing;
}

export function getSupabaseUrl() {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabasePublishableKey() {
  return requireEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    getSupabasePublishableKeyValue()
  );
}

export function getSupabaseSecretKey() {
  return requireEnv(
    "SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY",
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
