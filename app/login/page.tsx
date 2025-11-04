'use client'

export const dynamic = 'force-dynamic'

 import { useEffect, useState } from 'react'
 import { useRouter, useSearchParams } from 'next/navigation'
import MissingSupabaseConfig from '@/components/MissingSupabaseConfig'
import { useSupabaseBrowserClient } from '@/lib/useSupabaseBrowserClient'
 
 export default function LoginPage(){
   const router = useRouter()
   const params = useSearchParams()
   const next = params.get('next') ?? '/'
 const { client: supabase, error: supabaseError } = useSupabaseBrowserClient()
 
   const [email,setEmail]=useState('')
   const [password,setPassword]=useState('')
   const [msg,setMsg]=useState<string|null>(null)
 
   useEffect(()=>{
    if(!supabase) return
     // support /login?logout=1
     if(params.get('logout')){
       supabase.auth.signOut().finally(()=>router.replace('/'))
     }
  },[supabase, params, router])
 
   async function signIn(e:React.FormEvent){
    if(!supabase) return
     e.preventDefault()
     const { error } = await supabase.auth.signInWithPassword({ email, password })
     if(error){ setMsg(error.message); return }
     router.replace(next)
   }
 
   function preset(kind:'admin'|'owner'){
     setEmail(kind==='admin' ? process.env.NEXT_PUBLIC_LOGIN_ADMIN_EMAIL! : process.env.NEXT_PUBLIC_LOGIN_OWNER_EMAIL!)
     setPassword(kind==='admin' ? process.env.NEXT_PUBLIC_LOGIN_ADMIN_PASSWORD! : process.env.NEXT_PUBLIC_LOGIN_OWNER_PASSWORD!)
   }
 
  if(!supabase){
    return supabaseError ? <MissingSupabaseConfig error={supabaseError} /> : null
  }

   return (
     <main className="card">
       <h1 className="h1">Login</h1>
       <p className="p">Tap a preset or enter credentials.</p>
       {msg && <p className="p"><span className="badge">{msg}</span></p>}
       <div className="pills">
         <button className="btn primary" onClick={()=>preset('admin')}>Use Admin</button>
         <button className="btn" onClick={()=>preset('owner')}>Use Owner</button>
       </div>
       <form onSubmit={signIn} className="grid" style={{marginTop:12}}>
         <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
         <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
         <div className="pills">
           <button className="btn primary" type="submit">Login</button>
           <a className="btn" href="/">Back</a>
         </div>
       </form>
     </main>
   )
 }
