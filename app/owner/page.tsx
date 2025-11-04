'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabaseClient'
import { PRODUCT_KEYS, ACCOUNT_TYPES, TERM_OPTIONS } from '@/lib/catalog'

type StockInsert = {
  product_key: string;
  account_type: string;
  term_days: number;
  email?: string|null;
  password?: string|null;
  profile?: string|null;
  pin?: string|null;
  quantity?: number|null;
  price?: number|null;
  notes?: string|null;
}

export default function OwnerPage(){
  const router = useRouter()
  const supabase = useMemo(() => getSupabaseBrowserClient(), [])
  const [authed,setAuthed]=useState(false)
  const [form,setForm]=useState<StockInsert>({
    product_key: 'netflix',
    account_type: 'shared profile',
    term_days: 30,
    quantity: 1,
    price: null
  })
  const [saving,setSaving]=useState(false)

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      if(!data.user){ router.replace('/login?next=/owner'); return }
      setAuthed(true)
    })
  },[])

  async function addStock(e:React.FormEvent){
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('stocks').insert({
      product_key: form.product_key,
      account_type: form.account_type,
      term_days: form.term_days,
      email: form.email || null,
      password: form.password || null,
      profile: form.profile || null,
      pin: form.pin || null,
      quantity: form.quantity ?? 1,
      price: form.price ?? null,
      notes: form.notes || null
    })
    setSaving(false)
    if(error){ alert(error.message); return }
    alert('Stock added.')
    router.refresh()
  }

  async function logout(){
    await supabase.auth.signOut(); router.replace('/')
  }

  if(!authed) return <main className="card"><p className="p">Checking access…</p></main>

  return (
    <main className="card">
      <div className="pills"><a className="btn" href="/">← Back</a><button className="btn primary" onClick={logout}>Logout</button></div>
      <h1 className="h1">Owner Panel</h1>
      <p className="p">Add stocks. Expiration auto-computed from term (e.g., 30 days).</p>

      <form onSubmit={addStock} className="grid">
        <div className="row">
          <label><span className="p">Product</span>
            <select className="input" value={form.product_key} onChange={e=>setForm({...form, product_key:e.target.value})}>
              {PRODUCT_KEYS.map(k=><option key={k} value={k}>{k}</option>)}
            </select>
          </label>
          <label><span className="p">Account type</span>
            <select className="input" value={form.account_type} onChange={e=>setForm({...form, account_type:e.target.value})}>
              {ACCOUNT_TYPES.map(k=><option key={k} value={k}>{k}</option>)}
            </select>
          </label>
        </div>

        <div className="row">
          <label><span className="p">Term</span>
            <select className="input" value={form.term_days} onChange={e=>setForm({...form, term_days: Number(e.target.value)})}>
              {TERM_OPTIONS.map(o=><option key={o.days} value={o.days}>{o.label}</option>)}
            </select>
          </label>
          <label><span className="p">Quantity</span>
            <input className="input" type="number" value={form.quantity ?? 1} onChange={e=>setForm({...form, quantity: Number(e.target.value)})} />
          </label>
        </div>

        <div className="row">
          <input className="input" placeholder="Email (optional)" value={form.email ?? ''} onChange={e=>setForm({...form, email:e.target.value})}/>
          <input className="input" placeholder="Password (optional)" value={form.password ?? ''} onChange={e=>setForm({...form, password:e.target.value})}/>
        </div>
        <div className="row">
          <input className="input" placeholder="Profile (optional)" value={form.profile ?? ''} onChange={e=>setForm({...form, profile:e.target.value})}/>
          <input className="input" placeholder="PIN (optional)" value={form.pin ?? ''} onChange={e=>setForm({...form, pin:e.target.value})}/>
        </div>

        <div className="row">
          <input className="input" type="number" placeholder="Price (optional)" value={form.price ?? ''} onChange={e=>setForm({...form, price: e.target.value ? Number(e.target.value) : null})}/>
          <input className="input" placeholder="Notes (optional)" value={form.notes ?? ''} onChange={e=>setForm({...form, notes:e.target.value})}/>
        </div>

        <div className="pills">
          <button className="btn primary" disabled={saving} type="submit">{saving ? 'Saving…' : 'Add Stock'}</button>
        </div>
      </form>
    </main>
  )
}
