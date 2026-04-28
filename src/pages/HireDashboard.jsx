import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'

export default function HireDashboard() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', fontFamily: "'DM Sans', sans-serif", background: 'linear-gradient(180deg, #fffefe 0%, #f7f2f3 100%)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/" style={{ fontWeight: 900, fontSize: '1.25rem', color: '#111111', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Bridge</Link>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main style={{ maxWidth: '960px', margin: '0 auto', background: '#fff', border: '1px solid #ead7da', borderRadius: '28px', padding: '2rem', boxShadow: '0 18px 42px rgba(17,17,17,0.08)' }}>
        <h1 style={{ margin: 0, fontSize: '2.25rem', fontWeight: 900, color: '#111111' }}>Hire dashboard</h1>
        <p style={{ color: '#5f5f65' }}>Book home services, view bookings, and manage your requests here.</p>
      </main>
    </div>
  )
}
