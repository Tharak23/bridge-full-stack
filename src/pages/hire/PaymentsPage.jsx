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
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Payments</h1>
      <p className="text-slate-500 mb-8">Payment history and methods</p>
      {highlightBookingId && (
        <p className="mb-4 text-sm text-teal-600 font-medium">Showing payment for your selected booking.</p>
      )}

      {payments.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-slate-500">No payments yet. Once a booking is paid, it will appear here.</p>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-3 font-semibold text-slate-700">Service</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Date</th>
                  <th className="px-5 py-3 font-semibold text-slate-700 text-right">Amount</th>
                  <th className="px-5 py-3 font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p.id}
                    className={`border-b border-slate-100 last:border-0 hover:bg-slate-50/50 ${
                      p.bookingId === highlightBookingId ? 'bg-teal-50/80' : ''
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <CreditCard className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-medium text-slate-900">{p.serviceName}</p>
                          <p className="text-xs text-slate-500">{p.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{p.date}</td>
                    <td className="px-5 py-4 text-right font-semibold text-slate-900">₹{p.amount}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          p.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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

      <Card className="mt-6 overflow-hidden">
        <div className="p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <p className="font-medium text-slate-900">Pay after service</p>
            <p className="text-sm text-slate-500">Add a payment method at checkout when you book. You are charged after the professional completes the job.</p>
          </div>
        </div>
      </Card>

      <Card className="mt-6 overflow-hidden">
        <div className="p-5">
          <h2 className="text-lg font-semibold text-slate-900">Cash on Delivery (COD) tracker</h2>
          <p className="text-sm text-slate-500 mt-1 mb-4">Add COD amount and track whether the service payment was received.</p>

          <form className="grid grid-cols-1 md:grid-cols-4 gap-3" onSubmit={handleAddCodPayment}>
            <input
              type="text"
              value={codForm.serviceName}
              onChange={(e) => setCodForm((prev) => ({ ...prev, serviceName: e.target.value }))}
              placeholder="Service name"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
              required
            />
            <input
              type="number"
              min="1"
              step="0.01"
              value={codForm.amount}
              onChange={(e) => setCodForm((prev) => ({ ...prev, amount: e.target.value }))}
              placeholder="Amount"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
              required
            />
            <select
              value={codForm.status}
              onChange={(e) => setCodForm((prev) => ({ ...prev, status: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-200"
            >
              <option>Not received</option>
              <option>Received</option>
            </select>
            <button type="submit" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
              Add COD
            </button>
          </form>

          {codPayments.length === 0 ? (
            <p className="text-sm text-slate-500 mt-4">No COD entries yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-2 py-2 font-semibold text-slate-700">Service</th>
                    <th className="px-2 py-2 font-semibold text-slate-700">Date</th>
                    <th className="px-2 py-2 font-semibold text-slate-700 text-right">COD Amount</th>
                    <th className="px-2 py-2 font-semibold text-slate-700">Status</th>
                    <th className="px-2 py-2 font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {codPayments.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-2 py-3 text-slate-800">{item.serviceName}</td>
                      <td className="px-2 py-3 text-slate-600">{item.date}</td>
                      <td className="px-2 py-3 text-right font-semibold text-slate-900">₹{item.amount}</td>
                      <td className="px-2 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            item.status === 'Received' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-2 py-3">
                        <button
                          type="button"
                          className="text-xs font-medium text-teal-700 hover:text-teal-800"
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
