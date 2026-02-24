import { Link } from 'react-router-dom'
import { UserButton } from '@clerk/clerk-react'

export default function Dashboard() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem', fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: '1.25rem', color: '#0a0a0a' }}>Bridge</Link>
        <UserButton afterSignOutUrl="/" />
      </header>
      <main>
        <h1>Dashboard</h1>
        <p>Welcome. Your dashboard and booking flow will go here.</p>
      </main>
    </div>
  )
}
