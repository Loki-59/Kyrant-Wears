import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Note: do NOT create or export a service-role (admin) client from
// a module that is imported by client-side code. Service role keys
// are server-only secrets. Create a server-only helper (e.g. in an
// API route or a file imported only on the server) when you need
// server-side access with the service role key.
