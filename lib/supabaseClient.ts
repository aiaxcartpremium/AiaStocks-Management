'use client'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | undefined

function getEnv(name: 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing Supabase environment variable: ${name}`)
  }
  return value
}

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    const url = getEnv('NEXT_PUBLIC_SUPABASE_URL')
    const anonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
    browserClient = createClient(url, anonKey)
  }
  return browserClient
}
