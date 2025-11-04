'use client'
import { getSupabaseBrowserClient } from './supabaseClient'

/**
 * @deprecated Use getSupabaseBrowserClient directly from ./supabaseClient instead.
 */
export function sbBrowser() {
  return getSupabaseBrowserClient()
}
