'use client'
import { useState } from 'react'
import { sbBrowser } from '@/lib/supabaseBrowser'
import { useSearchParams } from 'next/navigation'

export default function LoginPage(){
  const supabase = sbBrowser()
  const q = useSearchParams()
  const next = q.get('next') || '/'
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [loading,setLoading] = useState(false)

  async function doLogin(e:React.FormEvent){
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if(error) alert(error.message)
    else window.location.href = next
  }

  function fill(role:'admin'|'owner'){
    if(role==='admin'){
      setEmail(process.env.NEXT_PUBLIC_LOGIN_ADMIN_EMAIL || '')
      setPassword(process.env.NEXT_PUBLIC_LOGIN_ADMIN_PASSWORD || '')
    }else{
      setEmail(process.env.NEXT_PUBLIC_LOGIN_OWNER_EMAIL || '')
      setPassword(process.env.NEXT_PUBLIC_LOGIN_OWNER_PASSWORD || '')
    }
  }

  return (
    <main>
      <header className="nav">
        <a className="btn" href="/">Home</a>
      </header>
      <div className="card">
        <h1>Login</h1>
        <div className="pills">
          <button className="btn" onClick={()=>fill('admin')}>Fill Admin</button>
          <button className="btn" onClick={()=>fill('owner')}>Fill Owner</button>
        </div>
        <form className="grid" onSubmit={doLogin}>
          <div>
            <label>Email</label>
            <input className="input" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label>Password</label>
            <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="btn primary" disabled={loading}>{loading?'Signing in…':'Login'}</button>
        </form>
      </div>
    </main>
  )
}
