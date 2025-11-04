'use client'
import { useEffect, useState } from 'react'
import { sbBrowser } from '@/lib/supabaseBrowser'
import { shortId } from '@/lib/catalog'

export default function Records(){
  const supabase = sbBrowser()
  const [stockId,setStockId]=useState('')
  const [buyer,setBuyer]=useState('')
  const [buyerSocial,setBuyerSocial]=useState('')
  const [channel,setChannel]=useState('tg')
  const [months,setMonths]=useState(1)
  const [price,setPrice]=useState<number>(0)

  const [myRows,setMyRows]=useState<any[]>([])
  const [page,setPage]=useState(1); const pageSize=10
  const [qChan,setQChan]=useState('all')

  useEffect(()=>{
    supabase.auth.getSession().then(async ({data})=>{
      if(!data.session){ window.location.href='/login?next=/admin/records'; return }
      const uid = data.session.user.id
      const { data: recs } = await supabase
        .from('sales')
        .select('*')
        .eq('created_by', uid)        /* privacy: only my records */
        .order('created_at',{ascending:false})
      setMyRows(recs||[])
    })
  },[])

  async function record(){
    if(!stockId) return alert('Enter stock id (uuid)')
    const { error } = await supabase.rpc('record_sale_update_expiry', {
      p_stock_id: stockId,
      p_months: months,
      p_buyer: buyer || null,
      p_price: price || 0,
      p_buyer_social: buyerSocial || null,
      p_channel: channel || null
    })
    if(error) return alert(error.message)
    alert('Recorded!')
    window.location.reload()
  }

  const filtered = myRows.filter(r => qChan==='all' || (r.channel||'')===qChan )
  const lastPage = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = filtered.slice((page-1)*pageSize, page*pageSize)

  return (
    <main>
      <header className="nav">
        <a className="btn" href="/admin">Back to Admin</a>
        <a className="btn" href="/">Home</a>
      </header>

      <div className="card">
        <h1>Record Buyer</h1>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
          <input className="input" placeholder="Stock ID (uuid)" value={stockId} onChange={e=>setStockId(e.target.value)} />
          <input className="input" placeholder="Buyer (optional)" value={buyer} onChange={e=>setBuyer(e.target.value)} />
          <input className="input" placeholder="Buyer social link (optional)" value={buyerSocial} onChange={e=>setBuyerSocial(e.target.value)} />
          <select className="input" value={channel} onChange={e=>setChannel(e.target.value)}>
            <option value="tg">Telegram</option>
            <option value="fb">Facebook</option>
            <option value="ig">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="other">Other</option>
          </select>
          <input className="input" placeholder="Months" type="number" min={1} value={months} onChange={e=>setMonths(Number(e.target.value))}/>
          <input className="input" placeholder="Price sold (₱)" type="number" min={0} value={price} onChange={e=>setPrice(Number(e.target.value))}/>
        </div>
        <div className="pills"><button className="btn primary" onClick={record}>Record sale</button></div>
        <p className="small">Privacy: This page only shows records you created. Owners see all records in their panel.</p>
      </div>

      <div className="card" style={{marginTop:12}}>
        <div className="flex" style={{justifyContent:'space-between'}}>
          <h3 style={{margin:0}}>My Recent Records</h3>
          <select className="input" value={qChan} onChange={e=>{setPage(1);setQChan(e.target.value)}} style={{maxWidth:200}}>
            <option value="all">All channels</option>
            <option value="tg">Telegram</option>
            <option value="fb">Facebook</option>
            <option value="ig">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="other">Other</option>
          </select>
        </div>
        <table className="table">
          <thead><tr><th>Date</th><th>Buyer</th><th>Social</th><th>Months</th><th>₱</th><th>Channel</th><th>Stock</th><th>New Expiry</th></tr></thead>
          <tbody>
            {pageRows.map(r=>(
              <tr key={r.id}>
                <td>{new Date(r.created_at).toLocaleString()}</td>
                <td>{r.buyer||'-'}</td>
                <td>{r.buyer_social||'-'}</td>
                <td>{r.months||'-'}</td>
                <td>{r.price_sold!=null? `₱${r.price_sold}`:'-'}</td>
                <td>{r.channel||'-'}</td>
                <td>{r.stock_id? shortId(r.stock_id): '-'}</td>
                <td>{r.new_expiry||'-'}</td>
              </tr>
            ))}
            {pageRows.length===0 && <tr><td colSpan={8}>No rows</td></tr>}
          </tbody>
        </table>
        <div className="pills">
          <button className="btn" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page<=1}>Prev</button>
          <span className="small">Page {page} / {lastPage}</span>
          <button className="btn" onClick={()=>setPage(p=>Math.min(lastPage,p+1))} disabled={page>=lastPage}>Next</button>
        </div>
      </div>
    </main>
  )
}
