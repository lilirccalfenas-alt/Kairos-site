import { createClient } from "@supabase/supabase-js";
// Somente no servidor. Nunca importar em componentes "use client".
export const db = createClient((process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL)!, (process.env.SUPABASE_SERVICE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY)!, {
  auth: { persistSession: false },
});
