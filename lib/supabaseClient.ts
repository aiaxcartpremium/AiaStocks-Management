'use client'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type EnvVar = 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'

declare global {
  // eslint-disable-next-line no-var
  var __supabaseBrowserClient: SupabaseClient | undefined
}

function requireEnv(name: EnvVar): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing Supabase environment variable: ${name}`)
  }
  return value
}

function getCachedClient(): SupabaseClient | undefined {
  return globalThis.__supabaseBrowserClient
}

function setCachedClient(client: SupabaseClient): SupabaseClient {
  globalThis.__supabaseBrowserClient = client
  return client
}

export function getSupabaseBrowserClient(): SupabaseClient {
  const cached = getCachedClient()
  if (cached) {
    return cached
  }

  const url = requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  const anonKey = requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return setCachedClient(createClient(url, anonKey))
}

export type { SupabaseClient }
