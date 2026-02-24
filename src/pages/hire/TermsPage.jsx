import { Link } from 'react-router-dom'

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Terms & Conditions</h1>
      <div className="prose prose-slate text-sm text-slate-600 space-y-4">
        <p><strong>1. Service.</strong> Bridge connects users with service professionals. We do not provide the services ourselves.</p>
        <p><strong>2. Booking.</strong> By booking, you agree to the quoted price and time slot. Payment is due after the service is completed to your satisfaction.</p>
        <p><strong>3. Cancellation.</strong> You may cancel or reschedule as per the policy shown at the time of booking.</p>
        <p><strong>4. Conduct.</strong> Users and professionals must behave respectfully. We may suspend accounts for violations.</p>
      </div>
      <p className="mt-8 text-slate-500 text-sm">For full terms, contact support.</p>
      <Link to="/hiredashboard" className="inline-block mt-4 text-teal-600 font-medium hover:underline">Back to Home</Link>
    </div>
  )
}
