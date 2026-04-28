import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { CreditCard, IndianRupee } from 'lucide-react'
import { getAllPayments } from '@/lib/paymentsStorage'

const COD_STORAGE_KEY = 'bridge_cod_payments'

export default function PaymentsPage() {
  const location = useLocation()
  const highlightBookingId = location.state?.bookingId
  const stored = getAllPayments()
  const payments = stored
  const [codPayments, setCodPayments] = useState([])
  const [codForm, setCodForm] = useState({
    serviceName: '',
    amount: '',
    status: 'Not received',
  })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(COD_STORAGE_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      setCodPayments(Array.isArray(parsed) ? parsed : [])
    } catch {
      setCodPayments([])
    }
  }, [])

  const saveCodPayments = (list) => {
    setCodPayments(list)
    try {
      localStorage.setItem(COD_STORAGE_KEY, JSON.stringify(list))
    } catch {
      // Keep UI responsive even if storage quota is full.
    }
  }

  const handleAddCodPayment = (e) => {
    e.preventDefault()
    const serviceName = codForm.serviceName.trim()
    const amountValue = Number(codForm.amount)
    if (!serviceName) return
    if (!Number.isFinite(amountValue) || amountValue <= 0) return

    const entry = {
      id: `cod-${Date.now()}`,
      serviceName,
      amount: amountValue,
      status: codForm.status,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    }
    saveCodPayments([entry, ...codPayments])
    setCodForm({ serviceName: '', amount: '', status: 'Not received' })
  }

  const toggleCodStatus = (id) => {
    const updated = codPayments.map((item) =>
      item.id === id
        ? { ...item, status: item.status === 'Received' ? 'Not received' : 'Received' }
        : item
    )
    saveCodPayments(updated)
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-1 text-3xl font-black text-[var(--color-text)]">Payments</h1>
      <p className="mb-8 text-[var(--color-text-muted)]">Payment history and methods</p>
      {highlightBookingId && (
        <p className="mb-4 text-sm font-medium text-[var(--color-primary)]">Showing payment for your selected booking.</p>
      )}

      {payments.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-[var(--color-text-muted)]">No payments yet. Once a booking is paid, it will appear here.</p>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-[var(--shadow-lg)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[#111111]">
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.12em] text-white/80">Service</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.12em] text-white/80">Date</th>
                  <th className="px-5 py-4 text-right font-semibold uppercase tracking-[0.12em] text-white/80">Amount</th>
                  <th className="px-5 py-4 font-semibold uppercase tracking-[0.12em] text-white/80">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p.id}
                    className={`border-b border-[#f3e4e6] last:border-0 hover:bg-[#fff7f8] ${
                      p.bookingId === highlightBookingId ? 'bg-[#fff1f2]' : ''
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
                          <CreditCard className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-medium text-[var(--color-text)]">{p.serviceName}</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{p.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[var(--color-text-muted)]">{p.date}</td>
                    <td className="px-5 py-4 text-right font-semibold text-[var(--color-text)]">₹{p.amount}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                          p.status === 'Paid' ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)]' : 'bg-black/[0.06] text-[var(--color-text)]'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Card className="mt-6 overflow-hidden rounded-[1.75rem] border border-[var(--color-border)]">
        <div className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary-muted)] text-[var(--color-primary)]">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-[var(--color-text)]">Pay after service</p>
            <p className="text-sm text-[var(--color-text-muted)]">Add a payment method at checkout when you book. You are charged after the professional completes the job.</p>
          </div>
        </div>
      </Card>

      <Card className="mt-6 overflow-hidden rounded-[1.75rem] border border-[var(--color-border)] shadow-[var(--shadow-lg)]">
        <div className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">Payment tracker</p>
              <h2 className="text-xl font-black text-[var(--color-text)]">Cash on Delivery (COD) tracker</h2>
            </div>
            <span className="rounded-full border border-[var(--color-border)] bg-[#111111] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/80">
              Form refreshed
            </span>
          </div>
          <p className="mb-5 mt-1 text-sm text-[var(--color-text-muted)]">Add COD amount and track whether the service payment was received.</p>

          <form className="grid grid-cols-1 gap-3 rounded-[1.5rem] border border-[var(--color-border)] bg-[#fff8f8] p-4 md:grid-cols-2 lg:grid-cols-4" onSubmit={handleAddCodPayment}>
            <input
              type="text"
              value={codForm.serviceName}
              onChange={(e) => setCodForm((prev) => ({ ...prev, serviceName: e.target.value }))}
              placeholder="Service name"
              className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(193,18,31,0.14)]"
              required
            />
            <input
              type="number"
              min="1"
              step="0.01"
              value={codForm.amount}
              onChange={(e) => setCodForm((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="Amount"
              className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(193,18,31,0.14)]"
              required
            />
            <select
              value={codForm.status}
              onChange={(e) => setCodForm((prev) => ({ ...prev, status: e.target.value }))}
              className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(193,18,31,0.14)]"
            >
              <option>Not received</option>
              <option>Received</option>
            </select>
            <button type="submit" className="rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]">
              Add COD
            </button>
          </form>

          {codPayments.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--color-text-muted)]">No COD entries yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)]">
                    <th className="px-2 py-2 font-semibold text-[var(--color-text-muted)]">Service</th>
                    <th className="px-2 py-2 font-semibold text-[var(--color-text-muted)]">Date</th>
                    <th className="px-2 py-2 text-right font-semibold text-[var(--color-text-muted)]">COD Amount</th>
                    <th className="px-2 py-2 font-semibold text-[var(--color-text-muted)]">Status</th>
                    <th className="px-2 py-2 font-semibold text-[var(--color-text-muted)]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {codPayments.map((item) => (
                    <tr key={item.id} className="border-b border-[#f3e4e6] last:border-0">
                      <td className="px-2 py-3 text-[var(--color-text)]">{item.serviceName}</td>
                      <td className="px-2 py-3 text-[var(--color-text-muted)]">{item.date}</td>
                      <td className="px-2 py-3 text-right font-semibold text-[var(--color-text)]">₹{item.amount}</td>
                      <td className="px-2 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            item.status === 'Received' ? 'bg-[var(--color-primary-muted)] text-[var(--color-primary)]' : 'bg-black/[0.06] text-[var(--color-text)]'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <button
                          type="button"
                          className="text-xs font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
                          onClick={() => toggleCodStatus(item.id)}
                        >
                          Mark as {item.status === 'Received' ? 'Not received' : 'Received'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
