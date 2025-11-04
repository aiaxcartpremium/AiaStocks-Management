export default function Home(){
  return (
    <main>
      <header className="nav">
        <a className="btn" href="/">Home</a>
        <a className="btn primary" href="/login">Login</a>
      </header>
      <div className="card">
        <h1>Aiaxcart Premium Shop</h1>
        <p>Welcome! Choose a portal to continue.</p>
        <div className="pills">
          <a className="btn primary" href="/admin">Admin</a>
          <a className="btn" href="/owner">Owner</a>
        </div>
        <p className="small">© 2025 Aiaxcart</p>
      </div>
    </main>
  )
}
