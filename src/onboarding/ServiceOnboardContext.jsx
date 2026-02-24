import { createContext, useContext, useReducer, useCallback } from 'react'

const STORAGE_KEY = 'bridge_service_onboard_draft'

const defaultState = {
  professionalType: '',
  phone: '',
  countryCode: '+91',
  name: '',
  dateOfBirth: '',
  photoUrl: '',
  photoFile: null,
  gender: '',
  servicesOffered: '',
  selectedServices: [], // ['AC repair', 'Installation', ...]
  servicesOfferedOther: '',
  experienceYears: '',
  serviceArea: '',
  bankAccountNumber: '',
  upiId: '',
  workingHours: [], // [{ day, start, end }]
  daysAvailable: [], // ['monday', 'tuesday', ...]
  travelRadiusKm: '',
  termsAccepted: false,
}

function loadDraft() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) {
      const parsed = JSON.parse(s)
      return { ...defaultState, ...parsed }
    }
  } catch (_) {}
  return { ...defaultState }
}

function saveDraft(state) {
  try {
    const toSave = { ...state }
    delete toSave.photoFile
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  } catch (_) {}
}

const ServiceOnboardContext = createContext(null)

export function useServiceOnboard() {
  const ctx = useContext(ServiceOnboardContext)
  if (!ctx) throw new Error('useServiceOnboard must be used inside ServiceOnboardProvider')
  return ctx
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET':
      return { ...state, [action.field]: action.value }
    case 'SET_MANY':
      return { ...state, ...action.payload }
    case 'SET_HOURS':
      return { ...state, workingHours: action.payload }
    case 'SET_DAYS':
      return { ...state, daysAvailable: action.payload }
    case 'RESET':
      return loadDraft()
    default:
      return state
  }
}

export function ServiceOnboardProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadDraft)

  const setField = useCallback((field, value) => {
    dispatch({ type: 'SET', field, value })
  }, [])

  const setMany = useCallback((payload) => {
    dispatch({ type: 'SET_MANY', payload })
  }, [])

  const setWorkingHours = useCallback((payload) => {
    dispatch({ type: 'SET_HOURS', payload })
  }, [])

  const setDaysAvailable = useCallback((payload) => {
    dispatch({ type: 'SET_DAYS', payload })
  }, [])

  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    dispatch({ type: 'RESET' })
  }, [])

  // Persist on change
  if (typeof window !== 'undefined') saveDraft(state)

  return (
    <ServiceOnboardContext.Provider
      value={{
        state,
        setField,
        setMany,
        setWorkingHours,
        setDaysAvailable,
        clearDraft,
      }}
    >
      {children}
    </ServiceOnboardContext.Provider>
  )
}
