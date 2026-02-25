import { Card } from '@/components/ui/card'
import { BarChart3, Users, Wrench, CreditCard, MessageSquare } from 'lucide-react'

const STATS = [
  { label: 'Total users', value: '12,847', sub: '+12% this month', icon: Users, color: 'bg-blue-500' },
  { label: 'Active bookings', value: '3,291', sub: 'Last 30 days', icon: Wrench, color: 'bg-emerald-500' },
  { label: 'Revenue', value: '₹8.2L', sub: '+8% vs last month', icon: CreditCard, color: 'bg-amber-500' },
  { label: 'Messages', value: '1,024', sub: 'Unread: 47', icon: MessageSquare, color: 'bg-violet-500' },
]

export default function AdminAnalytics() {
  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Analytics</h1>
      <p className="text-slate-500 mb-8">Overview of platform activity</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map(({ label, value, sub, icon: Icon, color }) => (
          <Card key={label} className="p-5 border border-slate-200/80">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
                <p className="text-xs text-slate-500 mt-1">{sub}</p>
              </div>
              <span className={`inline-flex p-2.5 rounded-xl ${color} text-white`}>
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border border-slate-200/80">
          <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-teal-600" />
            Bookings trend
          </h2>
          <div className="h-64 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 text-sm">
            Chart placeholder — connect your analytics
          </div>
        </Card>
        <Card className="p-6 border border-slate-200/80">
          <h2 className="font-semibold text-slate-900 mb-4">Top categories</h2>
          <ul className="space-y-3">
            {['Plumbing', 'AC & Appliances', 'Cleaning & Pest', 'Electronics', 'Electrical'].map((cat, i) => (
              <li key={cat} className="flex items-center justify-between text-sm">
                <span className="text-slate-700">{cat}</span>
                <span className="font-medium text-slate-900">{[1240, 980, 756, 612, 488][i]} bookings</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
