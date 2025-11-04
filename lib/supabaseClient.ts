'use client'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

type EnvVar = 'NEXT_PUBLIC_SUPABASE_URL' | 'NEXT_PUBLIC_SUPABASE_ANON_KEY'

type SupabaseEnv = {
  url: string
  anonKey: string
}

export class MissingSupabaseEnvError extends Error {
  public readonly missing: EnvVar[]

  constructor(missing: EnvVar[]) {
    const list = missing.join(' and ')
    super(`Supabase client cannot start. Missing environment variable${missing.length > 1 ? 's' : ''}: ${list}`)
    this.name = 'MissingSupabaseEnvError'
    this.missing = missing
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __supabaseBrowserClient: SupabaseClient | undefined
  // eslint-disable-next-line no-var
  var __supabaseBrowserClientError: MissingSupabaseEnvError | undefined
}

function cacheClient(client: SupabaseClient): SupabaseClient {
  globalThis.__supabaseBrowserClient = client
  globalThis.__supabaseBrowserClientError = undefined
  return client
}

function cacheError(error: MissingSupabaseEnvError): never {
  globalThis.__supabaseBrowserClient = undefined
  globalThis.__supabaseBrowserClientError = error
  throw error
}

function readEnv(): SupabaseEnv {
  const missing: EnvVar[] = []
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) missing.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!anonKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')

  if (missing.length > 0) {
    return cacheError(new MissingSupabaseEnvError(missing))
  }

  return { url: url!, anonKey: anonKey! }
}

export function getSupabaseBrowserClient(): SupabaseClient {
  if (globalThis.__supabaseBrowserClient) {
    return globalThis.__supabaseBrowserClient
  }

  if (globalThis.__supabaseBrowserClientError) {
    throw globalThis.__supabaseBrowserClientError
  }

  const { url, anonKey } = readEnv()
  return cacheClient(createClient(url, anonKey))
}

export type { SupabaseClient }
