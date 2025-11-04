'use client'
import { useEffect, useState } from 'react'
import { sbBrowser } from '@/lib/supabaseBrowser'
import { CATEGORIES, PRODUCTS, ACCOUNT_TYPES, shortId } from '@/lib/catalog'
import { format } from 'date-fns'

type Stock = {
  id:string, product_key:string, account_type:string, quantity:number,
  email?:string|null, password?:string|null, profile?:string|null, pin?:string|null,
  notes?:string|null, expires_at?:string|null, created_at?:string
}
type Sale = {
  id:string, stock_id:string|null, buyer:string|null, buyer_social:string|null,
  channel:string|null, months:number|null, price_sold:number|null,
  new_expiry:string|null, created_by:string|null, created_at:string
}

export default function Owner(){
  const supabase = sbBrowser()
  const [rows,setRows]=useState<Stock[]>([])
  const [sales,setSales]=useState<Sale[]>([])
  const [loading,setLoading]=useState(true)

  // form
  const [cat,setCat]=useState<'entertainment'|'streaming'|'educational'|'editing'|'ai'>('entertainment')
  const [product,setProduct]=useState<string>(PRODUCTS['entertainment'][0])
  const [atype,setAtype]=useState<string>(ACCOUNT_TYPES[0])
  const [qty,setQty]=useState<number>(1)
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('')
  const [profile,setProfile]=useState(''); const [pin,setPin]=useState('')
  const [notes,setNotes]=useState('')

  // filters/pagination for Buyer Records
  const [qBuyer,setQBuyer]=useState('')
  const [qChan,setQChan]=useState('all')
  const [page,setPage]=useState(1)
  const pageSize=10

  useEffect(()=>{
    let cancelled=false
    supabase.auth.getSession().then(async ({data})=>{
      if(!data.session){ window.location.href='/login?next=/owner'; return }
      const { data: stocks } = await supabase.from('stocks').select('*').order('created_at',{ascending:false})
      const { data: sal } = await supabase.from('sales').select('*').order('created_at',{ascending:false})
      if(!cancelled){ setRows(stocks||[]); setSales(sal||[]); setLoading(false) }
    })
    return ()=>{cancelled=true}
  },[])

  useEffect(()=>{ setProduct(PRODUCTS[cat][0]) },[cat])

  async function addStock(e:React.FormEvent){
    e.preventDefault()
    const payload:any = {
      product_key: `${product}`,
      account_type: atype,
      email: email||null, password: password||null,
      profile: profile||null, pin: pin||null,
      quantity: Number(qty||1), notes: notes||null
    }
    const { error } = await supabase.rpc('add_stock_one', payload)
    if(error) return alert(error.message)
    alert('Added!')
    window.location.reload()
  }

  const filtered = sales.filter(s=>{
    const m1 = !qBuyer || (s.buyer||'').toLowerCase().includes(qBuyer.toLowerCase())
    const m2 = qChan==='all' || (s.channel||'')===qChan
    return m1 && m2
  })
  const lastPage = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = filtered.slice((page-1)*pageSize, page*pageSize)

  async function logout(){ await supabase.auth.signOut(); window.location.href='/' }

  return (
    <main>
      <header className="nav">
        <a className="btn" href="/">Home</a>
        <button className="btn" onClick={()=>history.back()}>Back</button>
        <button className="btn primary" onClick={logout}>Logout / Switch</button>
      </header>

      <div className="card">
        <h1>Owner Panel</h1>
        <h3>Add Stock</h3>
        <form className="grid" onSubmit={addStock}>
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
            <div>
              <label>Category</label>
              <select className="input" value={cat} onChange={e=>setCat(e.target.value as any)}>
                {CATEGORIES.map(c=><option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label>Product</label>
              <select className="input" value={product} onChange={e=>setProduct(e.target.value)}>
                {PRODUCTS[cat].map(p=><option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label>Account Type</label>
              <select className="input" value={atype} onChange={e=>setAtype(e.target.value)}>
                {ACCOUNT_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
            <div><label>Email (opt)</label><input className="input" value={email} onChange={e=>setEmail(e.target.value)} /></div>
            <div><label>Password (opt)</label><input className="input" value={password} onChange={e=>setPassword(e.target.value)} /></div>
            <div><label>Quantity</label><input className="input" type="number" min={1} value={qty} onChange={e=>setQty(Number(e.target.value))} /></div>
          </div>

          <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
            <div><label>Profile (opt)</label><input className="input" value={profile} onChange={e=>setProfile(e.target.value)} /></div>
            <div><label>PIN (opt)</label><input className="input" value={pin} onChange={e=>setPin(e.target.value)} /></div>
            <div><label>Notes (opt)</label><input className="input" value={notes} onChange={e=>setNotes(e.target.value)} /></div>
          </div>

          <div className="pills"><button className="btn primary" type="submit">Add Stock</button></div>
        </form>

        <h3>Onhand Stocks</h3>
        <table className="table">
          <thead><tr><th>ID</th><th>Product</th><th>Type</th><th>Qty</th><th>Expires</th><th>Notes</th></tr></thead>
          <tbody>
            {rows.map(r=>(
              <tr key={r.id}>
                <td>{shortId(r.id)}</td>
                <td>{r.product_key}</td>
                <td><span className="badge">{r.account_type}</span></td>
                <td>{r.quantity}</td>
                <td>{r.expires_at ? format(new Date(r.expires_at),'yyyy-MM-dd') : '-'}</td>
                <td>{r.notes||'-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card" style={{marginTop:16}}>
        <div className="flex" style={{justifyContent:'space-between'}}>
          <h3 style={{margin:0}}>Buyer Records</h3>
          <div className="flex">
            <input className="input" placeholder="Search buyer…" value={qBuyer} onChange={e=>{setPage(1);setQBuyer(e.target.value)}} />
            <select className="input" value={qChan} onChange={e=>{setPage(1);setQChan(e.target.value)}} style={{maxWidth:200}}>
              <option value="all">All channels</option>
              <option value="tg">Telegram</option>
              <option value="fb">Facebook</option>
              <option value="ig">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <table className="table">
          <thead><tr><th>Date</th><th>Buyer</th><th>Social</th><th>Months</th><th>Price</th><th>Channel</th><th>Stock</th><th>New Expiry</th></tr></thead>
        <tbody>
          {pageRows.map(s=>(
            <tr key={s.id}>
              <td>{new Date(s.created_at).toLocaleString()}</td>
              <td>{s.buyer||'-'}</td>
              <td>{s.buyer_social||'-'}</td>
              <td>{s.months||'-'}</td>
              <td>{s.price_sold!=null? `₱${s.price_sold}`:'-'}</td>
              <td>{s.channel||'-'}</td>
              <td>{s.stock_id? shortId(s.stock_id): '-'}</td>
              <td>{s.new_expiry||'-'}</td>
            </tr>
          ))}
          {pageRows.length===0 && <tr><td colSpan={8}>No records</td></tr>}
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
