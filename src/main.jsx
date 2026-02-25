import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ToastProvider } from './context/ToastContext'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

const clerkAppearance = {
  variables: {
    fontFamily: "'DM Sans', system-ui, sans-serif",
    colorPrimary: '#0a0a0a',
    colorBackground: '#ffffff',
    colorText: '#0a0a0a',
    colorTextSecondary: '#525252',
    borderRadius: '0',
  },
  elements: {
    formButtonPrimary: { backgroundColor: '#0a0a0a' },
    card: { boxShadow: 'none', border: '1px solid #e5e5e5' },
  },
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      appearance={clerkAppearance}
    >
      <ErrorBoundary>
        <ToastProvider>
          <App />
        </ToastProvider>
      </ErrorBoundary>
    </ClerkProvider>
    </BrowserRouter>
  </StrictMode>,
)
