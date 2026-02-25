import { useLocation } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { CreditCard, IndianRupee } from 'lucide-react'
import { getAllPayments } from '@/lib/paymentsStorage'

const DUMMY_PAYMENTS = [
  { id: 'd1', bookingId: null, serviceName: 'AC Repair', location: 'Jubilee Hills', amount: 299, date: '22 Feb 2025', status: 'Paid' },
  { id: 'd2', bookingId: null, serviceName: 'Home Cleaning', location: 'Banjara Hills', amount: 399, date: '20 Feb 2025', status: 'Paid' },
]

export default function PaymentsPage() {
  const location = useLocation()
  const highlightBookingId = location.state?.bookingId
  const stored = getAllPayments()
  const payments = stored.length > 0 ? stored : DUMMY_PAYMENTS

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Payments</h1>
      <p className="text-slate-500 mb-8">Payment history and methods</p>
      {highlightBookingId && (
        <p className="mb-4 text-sm text-teal-600 font-medium">Showing payment for your selected booking.</p>
      )}

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
    </div>
  )
}
