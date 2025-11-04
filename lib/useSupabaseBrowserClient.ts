'use client'

import { useMemo } from 'react'
import {
  getSupabaseBrowserClient,
  MissingSupabaseEnvError,
  type SupabaseClient,
} from '@/lib/supabaseClient'

type SupabaseClientResult = {
  client: SupabaseClient | null
  error: MissingSupabaseEnvError | null
}

export function useSupabaseBrowserClient(): SupabaseClientResult {
  return useMemo(() => {
    try {
      return { client: getSupabaseBrowserClient(), error: null }
    } catch (error) {
      if (error instanceof MissingSupabaseEnvError) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(error.message)
        }
        return { client: null, error }
      }
      throw error
    }
  }, [])
}
