'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type Rec = { id:string; created_at:string; product_key:string; buyer_name:string|null; buyer_email:string|null; social_link:string|null; amount:number|null }

export default function RecordsPage(){
  const [rows,setRows]=useState<Rec[]>([])
  const [page,setPage]=useState(1)
  const [per,setPer]=useState(10)
  const [q,setQ]=useState('')
  const [product,setProduct]=useState('')

  useEffect(()=>{ load() }, [page, per, q, product])

  async function load(){
    const from = (page-1)*per
    const to = from + per - 1
    let query = supabase.from('account_records').select('*').order('created_at', { ascending:false }).range(from, to)
    if(product) query = query.eq('product_key', product)
    if(q) query = query.ilike('buyer_email', `%${q}%`)
    const { data, error } = await query
    if(error){ alert(error.message); return }
    setRows(data as any)
  }

  return (
    <main className="card">
      <div className="pills"><a className="btn" href="/admin">← Back</a></div>
      <h1 className="h1">Buyer Records</h1>
      <div className="row">
        <input className="input" placeholder="Search buyer email…" value={q} onChange={e=>setQ(e.target.value)} />
        <input className="input" placeholder="Filter by product key…" value={product} onChange={e=>setProduct(e.target.value)} />
      </div>

      <div style={{overflowX:'auto', marginTop:12}}>
        <table className="table">
          <thead><tr><th>Date</th><th>Product</th><th>Buyer</th><th>Email</th><th>Social</th><th>Amount</th></tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>{r.product_key}</td>
                <td>{r.buyer_name ?? '-'}</td>
                <td>{r.buyer_email ?? '-'}</td>
                <td>{r.social_link ? <a href={r.social_link} target="_blank">{r.social_link}</a> : '-'}</td>
                <td>{typeof r.amount==='number' ? `₱${r.amount.toFixed(2)}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pills" style={{marginTop:12}}>
        <button className="btn" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
        <span className="badge">Page {page}</span>
        <button className="btn" onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>
    </main>
  )
}
