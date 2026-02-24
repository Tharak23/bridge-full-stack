import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@clerk/clerk-react'
import {
  Wrench,
  Phone,
  User,
  FileText,
  CreditCard,
  Clock,
  Shield,
  CheckCircle,
  Plus,
  Copy,
} from 'lucide-react'
import { fetchApiJson } from '../lib/api'
import { ServiceOnboardProvider, useServiceOnboard } from './ServiceOnboardContext'
import './onboarding.css'

const PROFESSIONAL_TYPES = [
  { id: 'plumber', label: 'Plumbing' },
  { id: 'electrician', label: 'Electrical' },
  { id: 'ac_repair', label: 'AC & Appliances' },
  { id: 'cleaning', label: 'Cleaning & Pest' },
  { id: 'salon', label: 'Salon & Spa' },
  { id: 'electronics', label: 'Electronics' },
  { id: 'other', label: 'Other' },
]

const SERVICE_OPTIONS = [
  'AC repair', 'Installation', 'Maintenance', 'Gas refill', 'Duct cleaning',
  'Electrical wiring', 'Plumbing', 'Painting', 'Deep cleaning', 'Pest control',
  'Salon', 'Spa', 'Appliance repair', 'Other',
]

const COUNTRY_CODES = [
  { id: '+91', label: '+91' },
  { id: '+1', label: '+1' },
  { id: '+44', label: '+44' },
  { id: '+971', label: '+971' },
]

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const STEPS = [
  { id: 'professional', title: 'Professional type', icon: Wrench },
  { id: 'mobile', title: 'Mobile number', icon: Phone },
  { id: 'personal', title: 'Personal details', icon: User },
  { id: 'service', title: 'Service details', icon: FileText },
  { id: 'bank', title: 'Bank details', icon: CreditCard },
  { id: 'availability', title: 'Availability', icon: Clock },
  { id: 'terms', title: 'Terms & conditions', icon: Shield },
  { id: 'review', title: 'Profile review', icon: CheckCircle },
]

function ServiceOnboardInner() {
  const navigate = useNavigate()
  const { getToken } = useAuth()
  const { state, setField, setWorkingHours, setDaysAvailable, clearDraft } = useServiceOnboard()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const stepId = STEPS[currentStepIndex].id
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100

  const goNext = () => {
    if (currentStepIndex < STEPS.length - 1) setCurrentStepIndex((i) => i + 1)
  }

  const goBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex((i) => i - 1)
  }

  const goToStep = (index) => setCurrentStepIndex(index)

  const toggleDay = (day) => {
    const list = state.daysAvailable.includes(day)
      ? state.daysAvailable.filter((d) => d !== day)
      : [...state.daysAvailable, day]
    setDaysAvailable(list)
  }

  const setDayHours = (day, start, end) => {
    const hours = [...(state.workingHours || [])]
    const i = hours.findIndex((h) => h.day === day)
    if (i >= 0) {
      hours[i] = { ...hours[i], start: start || hours[i].start, end: end || hours[i].end }
    } else {
      hours.push({ day, start: start || '09:00', end: end || '17:00' })
    }
    setWorkingHours(hours)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setField('photoUrl', url)
      setField('photoFile', file)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      await fetchApiJson(
        '/api/service-providers/me/submit',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            professionalType: state.professionalType || null,
            phone: (state.countryCode || '+91') + (state.phone?.replace(/\D/g, '') || '') || null,
            name: state.name || null,
            dateOfBirth: state.dateOfBirth || null,
            photoUrl: state.photoUrl || null,
            gender: state.gender || null,
            servicesOffered: state.servicesOffered || null,
            experienceYears: state.experienceYears ? parseInt(state.experienceYears, 10) : null,
            serviceArea: state.serviceArea || null,
            bankAccountNumber: state.bankAccountNumber || null,
            upiId: state.upiId || null,
            workingHours: state.workingHours || [],
            daysAvailable: state.daysAvailable || [],
            travelRadiusKm: state.travelRadiusKm ? parseInt(state.travelRadiusKm, 10) : null,
            termsAccepted: state.termsAccepted,
            termsAcceptedAt: state.termsAccepted ? new Date().toISOString() : null,
          }),
        },
        getToken
      )
      clearDraft()
      navigate('/dashboard', { replace: true })
    } catch (e) {
      setError(e.message || 'Submission failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selectedServicesList = state.selectedServices?.length ? state.selectedServices : (state.servicesOffered ? state.servicesOffered.split(',').map((s) => s.trim()).filter(Boolean) : [])
  const otherServiceSelected = selectedServicesList.some((s) => s.toLowerCase() === 'other' || s.startsWith('Other:'))

  const canContinue = () => {
    switch (stepId) {
      case 'professional':
        return !!state.professionalType
      case 'mobile':
        return (state.phone?.replace(/\D/g, '') || '').length === 10
      case 'personal':
        return !!state.name?.trim()
      case 'service':
        return selectedServicesList.length > 0 || !!state.servicesOfferedOther?.trim()
      case 'bank':
        return !!(state.bankAccountNumber?.trim() || state.upiId?.trim())
      case 'availability':
        return state.daysAvailable?.length > 0
      case 'terms':
        return state.termsAccepted === true
      default:
        return true
    }
  }

  const toggleService = (label) => {
    const isOther = label === 'Other'
    const hasOther = selectedServicesList.some((s) => s === 'Other' || s.startsWith('Other:'))
    let list
    if (isOther) {
      if (hasOther) list = selectedServicesList.filter((s) => s !== 'Other' && !s.startsWith('Other:'))
      else list = [...selectedServicesList, state.servicesOfferedOther ? `Other: ${state.servicesOfferedOther}` : 'Other']
    } else {
      list = selectedServicesList.includes(label) ? selectedServicesList.filter((s) => s !== label) : [...selectedServicesList, label]
    }
    setField('selectedServices', list)
    setField('servicesOffered', list.join(', '))
  }

  const setOtherService = (val) => {
    setField('servicesOfferedOther', val)
    const base = selectedServicesList.filter((s) => s !== 'Other' && !s.startsWith('Other:'))
    const newList = val.trim() ? [...base, `Other: ${val.trim()}`] : base
    setField('selectedServices', newList)
    setField('servicesOffered', newList.join(', '))
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="step-label">Step {currentStepIndex + 1} of {STEPS.length}</p>

        <div className="nav-row">
          <button type="button" className="btn-back" onClick={currentStepIndex === 0 ? () => navigate('/onboard') : goBack}>
            ← Back
          </button>
        </div>

        <AnimatePresence mode="wait">
          {stepId === 'professional' && (
            <motion.div key="professional" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
              <h1>What type of professional are you?</h1>
              <p className="subtitle">Select the category that best fits your services.</p>
              <div className="option-grid">
                {PROFESSIONAL_TYPES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`option-chip ${state.professionalType === p.id ? 'selected' : ''}`}
                    onClick={() => setField('professionalType', p.id)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {stepId === 'mobile' && (
            <motion.div key="mobile" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
              <h1>Your mobile number</h1>
              <p className="subtitle">We'll use this for bookings and updates.</p>
              <div className="form-group">
                <label>Mobile number</label>
                <div className="input-row">
                  <select className="country-select" value={state.countryCode || '+91'} onChange={(e) => setField('countryCode', e.target.value)} aria-label="Country code">
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={(state.phone || '').replace(/\D/g, '')}
                    onChange={(e) => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                  />
                </div>
                <p className="field-hint">Enter 10 digits.</p>
              </div>
            </motion.div>
          )}

          {stepId === 'personal' && (
            <motion.div key="personal" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
              <h1>Add profile details</h1>
              <p className="subtitle">Add your profile image, name, and basic info.</p>
              <div className="form-group">
                <label>Profile photo</label>
                <div className="avatar-wrap">
                  <div className={`avatar-upload ${state.photoUrl ? 'has-image' : ''}`} onClick={() => fileInputRef.current?.click()}>
                    {state.photoUrl ? (
                      <>
                        <img src={state.photoUrl} alt="" />
                        <span className="avatar-edit">Change</span>
                      </>
                    ) : (
                      <span className="avatar-placeholder">+</span>
                    )}
                  </div>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
              </div>
            <div className="form-group">
              <label>Full name</label>
              <input type="text" value={state.name} onChange={(e) => setField('name', e.target.value)} placeholder="e.g. Raj Kumar" />
            </div>
            <div className="form-group">
              <label>Date of birth</label>
              <input type="date" value={state.dateOfBirth} onChange={(e) => setField('dateOfBirth', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={state.gender} onChange={(e) => setField('gender', e.target.value)}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </motion.div>
        )}

        {stepId === 'service' && (
          <motion.div key="service" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
            <h1>Service details</h1>
            <p className="subtitle">Select services you offer. Choose "Other" to add your own.</p>
            <div className="form-group">
              <label>Services offered</label>
              <div className="services-chip-grid">
                {SERVICE_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`service-chip ${selectedServicesList.includes(opt) || (opt === 'Other' && (state.servicesOfferedOther || selectedServicesList.some((s) => s.toLowerCase() === 'other'))) ? 'selected' : ''}`}
                    onClick={() => (opt === 'Other' ? toggleService('Other') : toggleService(opt))}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {(otherServiceSelected || state.servicesOfferedOther) && (
                <div className="other-service-input">
                  <label>Other (please specify)</label>
                  <input type="text" value={state.servicesOfferedOther || (state.servicesOffered?.match(/Other:\s*(.+)/)?.[1]?.trim() || '')} onChange={(e) => setOtherService(e.target.value)} placeholder="e.g. Custom service" />
                </div>
              )}
            </div>
            <div className="form-group">
              <label>Experience (years)</label>
              <input type="number" min="0" value={state.experienceYears} onChange={(e) => setField('experienceYears', e.target.value)} placeholder="e.g. 5" />
            </div>
            <div className="form-group">
              <label>Service area</label>
              <input type="text" value={state.serviceArea} onChange={(e) => setField('serviceArea', e.target.value)} placeholder="e.g. Bangalore – Koramangala, HSR" />
            </div>
          </motion.div>
        )}

        {stepId === 'bank' && (
          <motion.div key="bank" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
            <h1>Bank details</h1>
            <p className="subtitle">Account number or UPI ID for payouts.</p>
            <div className="form-group">
              <label>Bank account number</label>
              <input type="text" value={state.bankAccountNumber} onChange={(e) => setField('bankAccountNumber', e.target.value)} placeholder="Optional" />
            </div>
            <div className="form-group">
              <label>UPI ID</label>
              <input type="text" value={state.upiId} onChange={(e) => setField('upiId', e.target.value)} placeholder="e.g. name@paytm" />
            </div>
          </motion.div>
        )}

        {stepId === 'availability' && (
          <motion.div key="availability" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
            <h1>Set your availability</h1>
            <p className="subtitle">Define when you're available. You can change this later.</p>
            <div className="availability-card">
              {DAYS.map((day) => {
                const dayHours = state.workingHours?.find((h) => h.day === day)
                const isOn = state.daysAvailable?.includes(day)
                return (
                  <div key={day} className="toggle-row">
                    <div>
                      <span className="day-label">{day}</span>
                      {isOn && (
                        <div className="time-inputs">
                          <input type="time" value={dayHours?.start || '09:00'} onChange={(e) => setDayHours(day, e.target.value, dayHours?.end)} />
                          <span>–</span>
                          <input type="time" value={dayHours?.end || '17:00'} onChange={(e) => setDayHours(day, dayHours?.start, e.target.value)} />
                        </div>
                      )}
                    </div>
                    <button type="button" className={`toggle-switch ${isOn ? 'active' : ''}`} onClick={() => toggleDay(day)} aria-label={`Toggle ${day}`} />
                  </div>
                )
              })}
            </div>
            <div className="form-group">
              <label>Travel radius (km)</label>
              <input type="number" min="1" value={state.travelRadiusKm} onChange={(e) => setField('travelRadiusKm', e.target.value)} placeholder="e.g. 10" />
            </div>
          </motion.div>
        )}

        {stepId === 'terms' && (
          <motion.div key="terms" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
            <h1>Terms & conditions</h1>
            <p className="subtitle">Please read and accept to continue.</p>
            <div className="review-block" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1rem' }}>
              <p>By continuing, you agree to provide accurate information and to abide by Bridge's service provider guidelines. We may verify your details and use your data to facilitate bookings and payouts.</p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={state.termsAccepted} onChange={(e) => setField('termsAccepted', e.target.checked)} />
              <span>I accept the terms and conditions</span>
            </label>
          </motion.div>
        )}

        {stepId === 'review' && (
          <motion.div key="review" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.25 }}>
            <h1>Profile review</h1>
            <p className="subtitle">Review your details. You can go back to edit any step.</p>
            {STEPS.slice(0, -1).map((s, i) => (
              <div key={s.id} className="review-block">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4>{s.title}</h4>
                  <button type="button" className="btn-back" onClick={() => goToStep(i)}>Edit</button>
                </div>
                {s.id === 'professional' && <p>{PROFESSIONAL_TYPES.find((p) => p.id === state.professionalType)?.label || state.professionalType || '—'}</p>}
                {s.id === 'mobile' && <p>{(state.countryCode || '+91')} {state.phone || '—'}</p>}
                {s.id === 'personal' && <p>{state.name || '—'}</p>}
                {s.id === 'service' && <p>{(state.servicesOffered || selectedServicesList.join(', ') || '—')} · Exp: {state.experienceYears || '—'} yrs · Area: {state.serviceArea || '—'}</p>}
                {s.id === 'bank' && <p>Account: {state.bankAccountNumber || '—'} · UPI: {state.upiId || '—'}</p>}
                {s.id === 'availability' && <p>Days: {state.daysAvailable?.join(', ') || '—'} · Radius: {state.travelRadiusKm || '—'} km</p>}
                {s.id === 'terms' && <p>{state.termsAccepted ? 'Accepted' : '—'}</p>}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

        {error && <p className="field-error" style={{ marginTop: '1rem' }}>{error}</p>}

        {stepId === 'review' ? (
          <button type="button" className="btn-continue" onClick={handleSubmit} disabled={loading} style={{ marginTop: '1.5rem' }}>
            {loading ? 'Submitting…' : 'Submit'}
          </button>
        ) : (
          <button type="button" className="btn-continue" onClick={goNext} disabled={!canContinue()} style={{ marginTop: '1.5rem' }}>
            Continue
          </button>
        )}
      </div>
    </div>
  )
}

export default function ServiceOnboard() {
  return (
    <ServiceOnboardProvider>
      <ServiceOnboardInner />
    </ServiceOnboardProvider>
  )
}
