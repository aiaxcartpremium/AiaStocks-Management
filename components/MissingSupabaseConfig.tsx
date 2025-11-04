'use client'

import type { MissingSupabaseEnvError } from '@/lib/supabaseClient'

type Props = {
  error: MissingSupabaseEnvError
}

export default function MissingSupabaseConfig({ error }: Props) {
  return (
    <main className="card">
      <h1 className="h1">Connect Supabase to continue</h1>
      <p className="p">
        The app can&apos;t talk to Supabase yet. Add the following environment
        variable{error.missing.length > 1 ? 's' : ''} to your Vercel project (or
        <code> .env.local</code> when running locally), then redeploy.
      </p>
      <ul className="p" style={{ listStyle: 'disc', paddingLeft: 24 }}>
        {error.missing.map((name) => (
          <li key={name}>
            <code>{name}</code>
          </li>
        ))}
      </ul>
      <p className="p">
        Vercel automatically rebuilds every time you push to GitHub. After
        saving the values, trigger a redeploy from the Vercel dashboard to pick
        them up immediately.
      </p>
    </main>
  )
}
