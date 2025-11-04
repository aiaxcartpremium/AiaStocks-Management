export default function Home() {
  return (
    <main className="card">
      <div className="kicker">Welcome</div>
      <h1 className="h1">Choose a portal</h1>
      <p className="p">Please select a portal below to continue. You must be logged in to access either panel.</p>
      <div className="pills">
        <a className="btn primary" href="/admin">Admin</a>
        <a className="btn" href="/owner">Owner</a>
      </div>
    </main>
  )
}
