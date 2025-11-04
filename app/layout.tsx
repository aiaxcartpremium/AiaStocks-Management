import '@/styles/globals.css'

export const metadata = {
  title: 'Aiaxcart Premium Shop',
  description: 'Stocks • Records • Admin • Owner'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div className="brand">Aiaxcart Premium Shop</div>
            <nav className="pills">
              <a className="btn" href="/">Home</a>
              <a className="btn primary" href="/login">Login</a>
            </nav>
          </header>
          {children}
          <div className="footer">© 2025 Aiax</div>
        </div>
      </body>
    </html>
  )
}
