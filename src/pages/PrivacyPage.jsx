import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-slate text-sm text-slate-600 space-y-4">
          <p><strong>1. Information we collect.</strong> We collect information you provide when signing up, booking services, or contacting support (name, email, phone, address).</p>
          <p><strong>2. How we use it.</strong> We use this to provide and improve our services, process bookings, and communicate with you.</p>
          <p><strong>3. Sharing.</strong> We may share necessary information with service professionals to fulfil your bookings. We do not sell your data.</p>
          <p><strong>4. Security.</strong> We use industry-standard measures to protect your data.</p>
          <p><strong>5. Your rights.</strong> You may request access, correction, or deletion of your data by contacting us.</p>
        </div>
        <p className="mt-8 text-slate-500 text-sm">For full policy, contact support.</p>
        <Link to="/" className="inline-block mt-4 text-teal-600 font-medium hover:underline">Back to home</Link>
      </div>
    </div>
  )
}
