
 'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import MissingSupabaseConfig from '@/components/MissingSupabaseConfig'
import { useSupabaseBrowserClient } from '@/lib/useSupabaseBrowserClient'
 
 type Stock = { id:string; product_key:string; account_type:string|null; quantity:number|null; price:number|null; created_at:string }
 
 export default function AdminPage(){
   const router = useRouter()
  const { client: supabase, error: supabaseError } = useSupabaseBrowserClient()
   const [authed,setAuthed]=useState(false)
   const [rows,setRows]=useState<Stock[]>([])
   const [sel,setSel]=useState<string>('')
   const [buyer,setBuyer]=useState('')
   const [buyerEmail,setBuyerEmail]=useState('')
   const [social,setSocial]=useState('')
   const [amount,setAmount]=useState<number>(0)
 
   useEffect(()=>{
    if(!supabase) return
     supabase.auth.getUser().then(async ({data})=>{
       if(!data.user){ router.replace('/login?next=/admin'); return }
       setAuthed(true)
       await load()
     })
  },[supabase])
 
   async function load(){
    if(!supabase) return
     const { data, error } = await supabase.from('stocks').select('id,product_key,account_type,quantity,price,created_at').order('created_at',{ascending:false})
     if(error){ alert(error.message); return }
     setRows((data||[]) as Stock[])
   }
 
   async function getOne(){
    if(!supabase) return
     if(!sel){ alert('Select a stock'); return }
     const { data, error } = await supabase.rpc('admin_grant_and_decrement', { p_stock_id: sel })
     if(error){ alert(error.message); return }
     alert('Account granted. Details are now logged under your admin record.')
     await load()
   }
 
   async function recordSale(e:React.FormEvent){
    if(!supabase) return
     e.preventDefault()
     if(!sel){ alert('Select a stock'); return }
     const { error } = await supabase.from('account_records').insert({
       stock_id: sel,
       buyer_name: buyer || null,
       buyer_email: buyerEmail || null,
       social_link: social || null,
       amount: amount || 0
     })
     if(error){ alert(error.message); return }
     alert('Sale recorded.')
     router.push('/admin/records')
   }

  async function logout(){
    if(!supabase) return
    await supabase.auth.signOut(); router.replace('/')
  }

  if(!supabase){
    return supabaseError ? <MissingSupabaseConfig error={supabaseError} /> : null
  }
 
   if(!authed) return <main className="card"><p className="p">Checking access…</p></main>
 
   return (
     <main className="card">
       <div className="pills"><a className="btn" href="/">← Back</a><a className="btn" href="/admin/records">Buyer Records</a><button className="btn primary" onClick={logout}>Logout</button></div>
       <h1 className="h1">Admin Panel</h1>
       <p className="p">Select available stock, then either <b>Get Account</b> or <b>Record Sale</b>.</p>
 
       <div className="grid">
         <select className="input" value={sel} onChange={e=>setSel(e.target.value)}>
           <option value="">Select stock…</option>
           {rows.filter(r=>(r.quantity ?? 0) > 0).map(r=>(
             <option key={r.id} value={r.id}>
               {r.product_key} • {r.account_type ?? ''} • qty:{r.quantity} • ₱{r.price ?? 0}
             </option>
           ))}
         </select>
 
         <div className="pills">
           <button className="btn primary" onClick={getOne}>Get Account</button>
           <button className="btn" onClick={load}>Refresh</button>
         </div>
 
         <form onSubmit={recordSale} className="grid">
