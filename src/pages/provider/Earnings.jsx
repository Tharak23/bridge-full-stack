import { Card } from '@/components/ui/card'
import { IndianRupee, TrendingUp, Wallet, History } from 'lucide-react'

export default function Earnings() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Earnings</h1>
      <p className="text-slate-500 mb-8">Track your income and payouts</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        <Card className="overflow-hidden">
          <div className="p-5">
            <p className="text-slate-500 text-sm mb-2 flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Today
            </p>
            <p className="text-2xl font-bold text-slate-900">₹1,240</p>
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="p-5">
            <p className="text-slate-500 text-sm mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              This week
            </p>
            <p className="text-2xl font-bold text-slate-900">₹8,500</p>
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="p-5">
            <p className="text-slate-500 text-sm mb-2 flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              This month
            </p>
            <p className="text-2xl font-bold text-slate-900">₹32,400</p>
          </div>
        </Card>
      </div>
      <Card className="mb-5 overflow-hidden">
        <div className="p-6">
          <h2 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-teal-500" />
            Payout status
          </h2>
          <p className="text-slate-500 text-sm">Next payout: ₹8,500 on 28 Feb 2025. Complete jobs to see earnings here.</p>
        </div>
      </Card>
      <Card className="overflow-hidden">
        <div className="p-6">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <History className="h-5 w-5 text-teal-500" />
            Transaction history
          </h2>
          <div className="space-y-3">
            {[
              { desc: 'Home Cleaning - Banjara Hills', amount: 399, date: '22 Feb 2025' },
              { desc: 'AC Repair - Jubilee Hills', amount: 299, date: '21 Feb 2025' },
              { desc: 'Plumbing - Madhapur', amount: 149, date: '20 Feb 2025' },
            ].map((t, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                <div>
                  <p className="font-medium text-slate-900 text-sm">{t.desc}</p>
                  <p className="text-slate-500 text-xs">{t.date}</p>
                </div>
                <p className="font-semibold text-teal-600">+₹{t.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}
