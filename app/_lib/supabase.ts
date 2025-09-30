import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

if (!url || !key)
  throw new Error("Supabase environment variables cannot be found");

export const supabase = createClient(url, key);
