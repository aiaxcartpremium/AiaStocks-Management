'use client'
import { useEffect, useState } from 'react'
import { sbBrowser } from '@/lib/supabaseBrowser'
import { format } from 'date-fns'
import { shortId } from '@/lib/catalog'

type Stock = { id:string, product_key:string, account_type:string, quantity:number, expires_at?:string|null }

export default function AdminPage(){
  const supabase = sbBrowser()
  const [rows,setRows]=useState<Stock[]>([])
  const [loading,setLoading]=useState(true)

  useEffect(()=>{
    let cancelled=false
    supabase.auth.getSession().then(async ({data})=>{
      if(!data.session){ window.location.href='/login?next=/admin'; return }
      const { data: stocks, error } = await supabase
        .from('stocks')
        .select('id,product_key,account_type,quantity,expires_at')
        .order('created_at',{ascending:false})
      if(error) alert(error.message)
      if(!cancelled){ setRows(stocks||[]); setLoading(false) }
    })
    return ()=>{cancelled=true}
  },[])

  async function getAccount(id:string){
    const { error } = await supabase.rpc('admin_grant_and_decrement', { p_stock_id: id })
    if(error) return alert(error.message)
    alert('Granted one account. Quantity updated.')
    window.location.reload()
  }

  async function logout(){ await supabase.auth.signOut(); window.location.href='/' }

  return (
    <main>
      <header className="nav">
        <a className="btn" href="/">Home</a>
        <a className="btn" href="/admin/records">Record Sale</a>
        <button className="btn primary" onClick={logout}>Logout / Switch</button>
      </header>
      <div className="card">
        <h1>Admin Panel</h1>
        {loading? <p>Loading…</p> : (
          <table className="table">
            <thead><tr><th>ID</th><th>Product</th><th>Type</th><th>Qty</th><th>Expires</th><th></th></tr></thead>
            <tbody>
              {rows.map(r=>(
                <tr key={r.id}>
                  <td>{shortId(r.id)}</td>
                  <td>{r.product_key}</td>
                  <td><span className="badge">{r.account_type}</span></td>
                  <td>{r.quantity}</td>
                  <td>{r.expires_at? format(new Date(r.expires_at),'yyyy-MM-dd'):'-'}</td>
                  <td><button className="btn primary" onClick={()=>getAccount(r.id)}>Get Account</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  )
}
