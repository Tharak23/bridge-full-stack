import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Briefcase } from 'lucide-react'
import './onboarding.css'

export default function RoleSelect() {
  const navigate = useNavigate()
  const [role, setRole] = useState(null)

  const handleContinue = () => {
    if (role === 'hire') navigate('/hireonboard')
    else if (role === 'service_provider') navigate('/serviceonboard')
  }

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: '10%' }} />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          What best describes your goal?
        </motion.h1>
        <p className="subtitle">This helps us tailor your experience.</p>

        <motion.button
        type="button"
        className={`card-option ${role === 'hire' ? 'selected' : ''}`}
        onClick={() => setRole('hire')}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="card-content">
          <h3>Hire</h3>
          <p>Find services for your home, appliances, and repairs. Book verified professionals.</p>
        </div>
        <div className="card-icon" style={{ background: '#ede9fe', color: '#7c3aed' }}>
          <User size={28} />
        </div>
      </motion.button>

      <motion.button
        type="button"
        className={`card-option ${role === 'service_provider' ? 'selected' : ''}`}
        onClick={() => setRole('service_provider')}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="card-content">
          <h3>Service provider</h3>
          <p>Offer your professional services to customers. Grow your business with Bridge.</p>
        </div>
        <div className="card-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
          <Briefcase size={28} />
        </div>
      </motion.button>

        <motion.button
          type="button"
          className="btn-continue"
          onClick={handleContinue}
          disabled={!role}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Continue
        </motion.button>
      </div>
    </div>
  )
}
