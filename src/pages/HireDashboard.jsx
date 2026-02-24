import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'

export default function HireDashboard() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: '1.25rem', color: '#0a0a0a' }}>Bridge</Link>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main>
        <h1>Hire dashboard</h1>
        <p>Book home services, view bookings, and manage your requests here.</p>
      </main>
    </div>
  )
}
