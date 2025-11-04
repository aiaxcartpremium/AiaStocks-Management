'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabaseClient'

type Stock = { id:string; product_key:string; account_type:string|null; quantity:number|null; price:number|null; created_at:string }
type RecordInsert = { buyer_name:string; buyer_email:string; social_link:string; amount:number; stock_id:string }

export default function AdminPage(){
  const router = useRouter()
  const [authed,setAuthed]=useState(false)
  const [rows,setRows]=useState<Stock[]>([])
  const [sel,setSel]=useState<string>('')
  const [buyer,setBuyer]=useState('')
  const [buyerEmail,setBuyerEmail]=useState('')
  const [social,setSocial]=useState('')
  const [amount,setAmount]=useState<number>(0)

  useEffect(()=>{
    supabase.auth.getUser().then(async ({data})=>{
      if(!data.user){ router.replace('/login?next=/admin'); return }
      setAuthed(true)
      await load()
    })
  },[])

  async function load(){
    const { data, error } = await supabase.from('stocks').select('id,product_key,account_type,quantity,price,created_at').order('created_at',{ascending:false})
    if(error){ alert(error.message); return }
    setRows((data||[]) as Stock[])
  }

  async function getOne(){
    if(!sel){ alert('Select a stock'); return }
    const { data, error } = await supabase.rpc('admin_grant_and_decrement', { p_stock_id: sel })
    if(error){ alert(error.message); return }
    alert('Account granted. Details are now logged under your admin record.')
    await load()
  }

  async function recordSale(e:React.FormEvent){
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

  async function logout(){ await supabase.auth.signOut(); router.replace('/') }

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
          <div className="row">
            <input className="input" placeholder="Buyer name" value={buyer} onChange={e=>setBuyer(e.target.value)} />
            <input className="input" placeholder="Buyer email" value={buyerEmail} onChange={e=>setBuyerEmail(e.target.value)} />
          </div>
          <input className="input" placeholder="Buyer social link" value={social} onChange={e=>setSocial(e.target.value)} />
          <input className="input" type="number" placeholder="Amount" value={amount} onChange={e=>setAmount(Number(e.target.value||0))} />
          <div className="pills">
            <button className="btn primary" type="submit">Record Sale</button>
          </div>
        </form>
      </div>

      <div style={{overflowX:'auto', marginTop:16}}>
        <table className="table">
          <thead><tr><th>Product</th><th>Type</th><th>Qty</th><th>Price</th><th>Added</th></tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id}>
                <td>{r.product_key}</td>
                <td>{r.account_type ?? '-'}</td>
                <td>{r.quantity ?? 0}</td>
                <td>{r.price ?? '-'}</td>
                <td>{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
