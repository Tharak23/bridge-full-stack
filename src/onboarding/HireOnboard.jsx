import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@clerk/clerk-react'
import { fetchApiJson } from '../lib/api'
import './onboarding.css'

const STEPS = ['details', 'location', 'confirm']
const STEP_LABELS = { details: 1, location: 2, confirm: 3 }

const COUNTRY_CODES = [
  { id: '+91', label: '+91 India' },
  { id: '+1', label: '+1 US/CA' },
  { id: '+44', label: '+44 UK' },
  { id: '+971', label: '+971 UAE' },
  { id: '+61', label: '+61 AU' },
  { id: '+81', label: '+81 Japan' },
  { id: '+65', label: '+65 Singapore' },
]

export default function HireOnboard() {
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const [step, setStep] = useState('details')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [form, setForm] = useState({
    name: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    latitude: null,
    longitude: null,
  })

  const progress = (STEP_LABELS[step] / 3) * 100

  const update = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }))
    setError('')
  }

  const fullPhone = countryCode + (form.phone.replace(/\D/g, '') || '')

  const handleNext = () => {
    if (step === 'details') {
      if (!form.name.trim()) {
        setError('Please enter your name.')
        return
      }
      const digits = form.phone.replace(/\D/g, '')
      if (digits.length !== 10) {
        setError('Please enter a valid 10-digit mobile number.')
        return
      }
      setError('')
      setStep('location')
    } else if (step === 'location') {
      if (!form.addressLine?.trim() && !form.city?.trim()) {
        setError('Please enter or detect your location.')
        return
      }
      setStep('confirm')
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      await fetchApiJson('/api/users/me/hire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: fullPhone,
          addressLine: form.addressLine?.trim() || null,
          city: form.city?.trim() || null,
          state: form.state?.trim() || null,
          pincode: form.pincode?.trim() || null,
          latitude: form.latitude ?? null,
          longitude: form.longitude ?? null,
        }),
      }, getToken)
      navigate('/hiredashboard', { replace: true })
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        update('latitude', pos.coords.latitude)
        update('longitude', pos.coords.longitude)
        setError('')
      },
      () => setError('Could not detect location. Please enter manually.')
    )
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="nav-row">
          <button type="button" className="btn-back" onClick={() => (step === 'details' ? navigate('/onboard') : setStep(step === 'confirm' ? 'location' : 'details'))}>
            ← Back
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 'details' && (
            <motion.div key="details" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
              <h1>What should we call you?</h1>
              <p className="subtitle">Enter your name and mobile number.</p>
              <div className="form-group">
                <label>Full name</label>
                <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Priya Sharma" />
              </div>
              <div className="form-group">
                <label>Mobile number</label>
                <div className="input-row">
                  <select className="country-select" value={countryCode} onChange={(e) => setCountryCode(e.target.value)} aria-label="Country code">
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.phone.replace(/\D/g, '')}
                    onChange={(e) => update('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                  />
                </div>
                <p className="field-hint">Enter 10 digits without spaces.</p>
              </div>
            </motion.div>
          )}

        {step === 'location' && (
          <motion.div key="location" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
            <h1>Where are you located?</h1>
            <p className="subtitle">We use this to show services near you. You can detect or type your address.</p>
            <div className="form-group">
              <button type="button" className="btn-continue" style={{ marginBottom: '1rem' }} onClick={detectLocation}>
                Detect my location
              </button>
            </div>
            <div className="form-group">
              <label>Street, city, state</label>
              <input type="text" value={form.addressLine} onChange={(e) => update('addressLine', e.target.value)} placeholder="e.g. 123 Main Rd, Koramangala" />
            </div>
            <div className="form-group">
              <label>City</label>
              <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="e.g. Bangalore" />
            </div>
            <div className="form-group">
              <label>State</label>
              <input type="text" value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="e.g. Karnataka" />
            </div>
            <div className="form-group">
              <label>Pincode</label>
              <input type="text" value={form.pincode} onChange={(e) => update('pincode', e.target.value)} placeholder="e.g. 560034" />
            </div>
          </motion.div>
        )}

        {step === 'confirm' && (
          <motion.div key="confirm" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
            <h1>Confirm your details</h1>
            <p className="subtitle">Review and submit to continue.</p>
            <div className="review-block">
              <h4>Name & contact</h4>
              <p>{form.name}</p>
              <p>{fullPhone}</p>
            </div>
            <div className="review-block">
              <h4>Address</h4>
              <p>{[form.addressLine, form.city, form.state, form.pincode].filter(Boolean).join(', ') || '—'}</p>
            </div>
            <button type="button" className="btn-back" style={{ marginBottom: '1rem' }} onClick={() => setStep('location')}>
              Edit address
            </button>
          </motion.div>
        )}
      </AnimatePresence>

        {error && <p className="field-error" style={{ marginTop: '1rem' }}>{error}</p>}

        <button type="button" className="btn-continue" onClick={handleNext} disabled={loading} style={{ marginTop: '1.5rem' }}>
          {loading ? 'Saving…' : step === 'confirm' ? 'Confirm & continue' : 'Continue'}
        </button>
      </div>
    </div>
  )
}
