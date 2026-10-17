import { createClient } from "@supabase/supabase-js";
// Somente no servidor. Nunca importar em componentes "use client".
export const db = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!, {
  auth: { persistSession: false },
});
