import { useState, useEffect } from 'react'
import { fetchApiJson } from '@/lib/api'
import { useAuth } from '@clerk/clerk-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User, Wrench, Clock, CreditCard, Star, MapPin, Phone, Save, X, RefreshCw } from 'lucide-react'
import { getProviderProfile, saveProviderProfile } from '@/lib/profileStorage'
import { useToast } from '@/context/ToastContext'
import PageLoader from '@/components/PageLoader'

const DUMMY_PROFILE = {
  name: 'Ravi Kumar',
  phone: '+91 98765 43210',
  professionalType: 'AC & Appliances',
  dateOfBirth: '1990-05-15',
  gender: 'Male',
  servicesOffered: 'AC Repair, AC Service, AC Installation',
  experienceYears: 5,
  serviceArea: 'Hyderabad - Jubilee Hills, Banjara Hills, Madhapur',
  bankAccountNumber: '****4521',
  upiId: 'ravi.k@upi',
  travelRadiusKm: 15,
  workingHoursJson: '[{"day":"monday","start":"09:00","end":"18:00"}]',
  daysAvailableJson: '["monday","tuesday","wednesday","thursday","friday","saturday"]',
  photoUrl: null,
  status: 'submitted',
}

function parseJsonSafe(str, fallback) {
  if (!str) return fallback
  try {
    const v = JSON.parse(str)
    return Array.isArray(v) ? v : fallback
  } catch {
    return fallback
  }
}

export default function ProfileSettings() {
  const { getToken } = useAuth()
  const toast = useToast()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [editingSection, setEditingSection] = useState(null)
  const [editForm, setEditForm] = useState({})

  const loadProfile = () => {
    setLoading(true)
    setError(null)
    const stored = getProviderProfile()
    fetchApiJson('/api/service-providers/me/profile', {}, getToken)
      .then((data) => {
        setProfile({ ...stored, ...data })
      })
      .catch(() => {
        setProfile(stored ? { ...DUMMY_PROFILE, ...stored } : DUMMY_PROFILE)
        setError(true)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProfile()
  }, [getToken])

  const data = profile || DUMMY_PROFILE
  const isDummy = !profile
  const workingHours = parseJsonSafe(data.workingHoursJson, [])
  const daysAvailable = parseJsonSafe(data.daysAvailableJson, [])

  const startEdit = (section, initial) => {
    setEditingSection(section)
    setEditForm(initial)
    setError(null)
  }

  const cancelEdit = () => {
    setEditingSection(null)
    setEditForm({})
    setError(null)
  }

  const saveProfile = async (payload) => {
    setSaving(true)
    setError(null)
    try {
      const updated = await fetchApiJson('/api/service-providers/me/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }, getToken)
      if (updated) {
        setProfile(updated)
        saveProviderProfile({ name: updated.name, phone: updated.phone, dateOfBirth: updated.dateOfBirth, gender: updated.gender })
      }
      setEditingSection(null)
      setEditForm({})
      toast.success('Profile updated.')
    } catch (e) {
      setError(e?.message || 'Failed to save')
      toast.error('Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveProfile = () => saveProfile(editForm)
  const handleSaveServices = () => saveProfile({ servicesOffered: editForm.servicesOffered, experienceYears: editForm.experienceYears != null ? parseInt(editForm.experienceYears, 10) : null })
  const handleSaveAvailability = () => saveProfile({ serviceArea: editForm.serviceArea, travelRadiusKm: editForm.travelRadiusKm !== '' ? parseInt(editForm.travelRadiusKm, 10) : null })
  const handleSaveBank = () => saveProfile({ bankAccountNumber: editForm.bankAccountNumber, upiId: editForm.upiId })

  if (loading && !profile) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <PageLoader message="Loading profile…" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h1 className="text-2xl font-bold text-slate-900 mb-1">Profile & Work Settings</h1>
      <p className="text-slate-500 mb-8">Manage your profile, services, and preferences</p>
      {isDummy && (
        <p className="text-sm text-slate-500 mb-6 bg-slate-100 p-3 rounded-lg">
          Showing sample profile. Complete onboarding to see your saved data here.
        </p>
      )}
      {error === true && (
        <p className="text-sm text-red-600 mb-4 bg-red-50 p-3 rounded-lg flex items-center justify-between gap-2">
          <span>Could not load profile from server.</span>
          <Button variant="outline" size="sm" onClick={loadProfile} className="gap-1.5 shrink-0">
            <RefreshCw className="h-4 w-4" /> Retry
          </Button>
        </p>
      )}
      {typeof error === 'string' && error && (
        <p className="text-sm text-red-600 mb-4 bg-red-50 p-3 rounded-lg">{error}</p>
      )}
      <div className="space-y-6">
        {/* Profile */}
        <Card className="overflow-hidden">
          <CardHeader>
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <User className="h-5 w-5 text-teal-500" />
              Profile
            </h2>
            <p className="text-sm text-slate-500">Your name, photo, and personal details</p>
          </CardHeader>
          <CardContent>
            <div className="pt-2">
              {editingSection === 'profile' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <Input value={editForm.name ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                    <Input value={editForm.phone ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of birth (YYYY-MM-DD)</label>
                    <Input type="date" value={editForm.dateOfBirth ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, dateOfBirth: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                    <Input value={editForm.gender ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, gender: e.target.value }))} placeholder="e.g. Male" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} disabled={saving} className="rounded-lg gap-1">
                      <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={cancelEdit} className="rounded-lg gap-1">
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div className="block">
                      <dt className="text-slate-500 font-medium block mb-0.5">Name</dt>
                      <dd className="text-slate-900 font-semibold">{data.name || '—'}</dd>
                    </div>
                    <div className="block">
                      <dt className="text-slate-500 font-medium block mb-0.5 flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> Phone
                      </dt>
                      <dd className="text-slate-900">{data.phone || '—'}</dd>
                    </div>
                    <div className="block">
                      <dt className="text-slate-500 font-medium block mb-0.5">Date of birth</dt>
                      <dd className="text-slate-900">{data.dateOfBirth || '—'}</dd>
                    </div>
                    <div className="block">
                      <dt className="text-slate-500 font-medium block mb-0.5">Gender</dt>
                      <dd className="text-slate-900">{data.gender || '—'}</dd>
                    </div>
                  </dl>
                  {data.photoUrl && (
                    <div className="mt-4">
                      <img src={data.photoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border border-slate-200" />
                    </div>
                  )}
                  <Button variant="outline" className="rounded-lg mt-4" onClick={() => startEdit('profile', { name: data.name, phone: data.phone, dateOfBirth: data.dateOfBirth, gender: data.gender })}>
                    Edit profile
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Services offered */}
        <Card className="overflow-hidden">
          <CardHeader>
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Wrench className="h-5 w-5 text-teal-500" />
              Services offered
            </h2>
            <p className="text-sm text-slate-500">Services you provide</p>
          </CardHeader>
          <CardContent>
            <div className="pt-2">
              {editingSection === 'services' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Services offered (comma-separated)</label>
                    <Input value={editForm.servicesOffered ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, servicesOffered: e.target.value }))} placeholder="e.g. AC Repair, Plumbing" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Experience (years)</label>
                    <Input type="number" min={0} value={editForm.experienceYears ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, experienceYears: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveServices} disabled={saving} className="rounded-lg gap-1">
                      <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={cancelEdit} className="rounded-lg gap-1">
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-slate-900 font-medium">{data.servicesOffered || '—'}</p>
                  <p className="text-slate-500 text-sm mt-1">Experience: {data.experienceYears != null ? `${data.experienceYears} years` : '—'}</p>
                  <Button variant="outline" className="rounded-lg mt-4" onClick={() => startEdit('services', { servicesOffered: data.servicesOffered, experienceYears: data.experienceYears })}>
                    Edit services
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Service area & availability */}
        <Card className="overflow-hidden">
          <CardHeader>
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-500" />
              Service area & availability
            </h2>
            <p className="text-sm text-slate-500">Working hours, days, and travel radius</p>
          </CardHeader>
          <CardContent>
            <div className="pt-2">
              {editingSection === 'availability' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Service area</label>
                    <Input value={editForm.serviceArea ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, serviceArea: e.target.value }))} placeholder="e.g. Hyderabad - Madhapur" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Travel radius (km)</label>
                    <Input type="number" min={0} value={editForm.travelRadiusKm ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, travelRadiusKm: e.target.value }))} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveAvailability} disabled={saving} className="rounded-lg gap-1">
                      <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={cancelEdit} className="rounded-lg gap-1">
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <dl className="space-y-4 text-sm">
                    <div className="block">
                      <dt className="text-slate-500 font-medium block mb-0.5 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" /> Service area
                      </dt>
                      <dd className="text-slate-900 mt-0.5">{data.serviceArea || '—'}</dd>
                    </div>
                    <div className="block">
                      <dt className="text-slate-500 font-medium block mb-0.5">Travel radius</dt>
                      <dd className="text-slate-900 mt-0.5">{data.travelRadiusKm != null ? `${data.travelRadiusKm} km` : '—'}</dd>
                    </div>
                    <div className="block">
                      <dt className="text-slate-500 font-medium block mb-0.5">Days available</dt>
                      <dd className="text-slate-900 mt-0.5 capitalize">
                        {daysAvailable.length > 0 ? daysAvailable.join(', ') : (data.daysAvailableJson || '—')}
                      </dd>
                    </div>
                    {workingHours.length > 0 && (
                      <div className="block">
                        <dt className="text-slate-500 font-medium block mb-0.5">Working hours</dt>
                        <dd className="text-slate-900 mt-0.5">
                          <ul className="list-disc list-inside space-y-0.5">
                            {workingHours.slice(0, 5).map((wh, i) => (
                              <li key={i} className="capitalize">{wh.day}: {wh.start} – {wh.end}</li>
                            ))}
                          </ul>
                        </dd>
                      </div>
                    )}
                  </dl>
                  <Button variant="outline" className="rounded-lg mt-4" onClick={() => startEdit('availability', { serviceArea: data.serviceArea, travelRadiusKm: data.travelRadiusKm })}>
                    Edit availability
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bank details */}
        <Card className="overflow-hidden">
          <CardHeader>
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-teal-500" />
              Bank details
            </h2>
            <p className="text-sm text-slate-500">Account or UPI for payouts</p>
          </CardHeader>
          <CardContent>
            <div className="pt-2">
              {editingSection === 'bank' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Account number</label>
                    <Input value={editForm.bankAccountNumber ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, bankAccountNumber: e.target.value }))} placeholder="Last 4 digits or full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID</label>
                    <Input value={editForm.upiId ?? ''} onChange={(e) => setEditForm((f) => ({ ...f, upiId: e.target.value }))} placeholder="e.g. name@upi" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveBank} disabled={saving} className="rounded-lg gap-1">
                      <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
                    </Button>
                    <Button variant="outline" onClick={cancelEdit} className="rounded-lg gap-1">
                      <X className="h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                    <div className="block">
                      <dt className="text-slate-500 font-medium block mb-0.5">Account</dt>
                      <dd className="text-slate-900 mt-0.5">{data.bankAccountNumber || '—'}</dd>
                    </div>
                    <div className="block">
                      <dt className="text-slate-500 font-medium block mb-0.5">UPI ID</dt>
                      <dd className="text-slate-900 mt-0.5">{data.upiId || '—'}</dd>
                    </div>
                  </dl>
                  <Button variant="outline" className="rounded-lg mt-4" onClick={() => startEdit('bank', { bankAccountNumber: data.bankAccountNumber, upiId: data.upiId })}>
                    Edit bank details
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Ratings */}
        <Card className="overflow-hidden">
          <CardHeader>
            <h2 className="font-semibold text-slate-900 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Ratings & reviews
            </h2>
            <p className="text-sm text-slate-500">Feedback from customers</p>
          </CardHeader>
          <CardContent>
            <div className="pt-2">
              <p className="text-slate-500 text-sm">No reviews yet. Complete jobs to earn ratings.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
