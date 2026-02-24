import { Card } from '@/components/ui/card'
import { CreditCard, Calendar, IndianRupee } from 'lucide-react'

const DUMMY_PAYMENTS = [
  { id: 1, desc: 'AC Repair', location: 'Jubilee Hills', amount: 299, date: '22 Feb 2025', status: 'Paid' },
  { id: 2, desc: 'Home Cleaning', location: 'Banjara Hills', amount: 399, date: '20 Feb 2025', status: 'Paid' },
]

export default function PaymentsPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Payments</h1>
      <p className="text-slate-500 mb-8">Payment history and methods</p>

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
              {DUMMY_PAYMENTS.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <CreditCard className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-medium text-slate-900">{p.desc}</p>
                        <p className="text-xs text-slate-500">{p.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{p.date}</td>
                  <td className="px-5 py-4 text-right font-semibold text-slate-900">₹{p.amount}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
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
