import { Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import Landing from './pages/Landing'
import RoleSelect from './onboarding/RoleSelect'
import HireOnboard from './onboarding/HireOnboard'
import ServiceOnboard from './onboarding/ServiceOnboard'
import OnboardGuard from './components/OnboardGuard'
import { CartProvider } from './context/CartContext'
import { LocationProvider } from './context/LocationContext'
import HireLayout from './layouts/HireLayout'
import HireHome from './pages/hire/HireHome'
import CategoryLanding from './pages/hire/CategoryLanding'
import ServiceSelectPage from './pages/hire/ServiceSelectPage'
import ServiceDetail from './pages/hire/ServiceDetail'
import CartPage from './pages/hire/CartPage'
import BookingDatePage from './pages/hire/BookingDatePage'
import BookingConfirmPage from './pages/hire/BookingConfirmPage'
import BookingSuccessPage from './pages/hire/BookingSuccessPage'
import BookingsPage from './pages/hire/BookingsPage'
import BookingDetailPage from './pages/hire/BookingDetailPage'
import BookingChangePage from './pages/hire/BookingChangePage'
import MessagesPage from './pages/hire/MessagesPage'
import PaymentsPage from './pages/hire/PaymentsPage'
import HireProfile from './pages/hire/HireProfile'
import TermsPage from './pages/hire/TermsPage'
import ProviderLayout from './layouts/ProviderLayout'
import JobFeed from './pages/provider/JobFeed'
import AvailableJobs from './pages/provider/AvailableJobs'
import MyJobs from './pages/provider/MyJobs'
import Earnings from './pages/provider/Earnings'
import ProviderMessages from './pages/provider/ProviderMessages'
import ProfileSettings from './pages/provider/ProfileSettings'
import './App.css'

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to="/" replace />
      </SignedOut>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/onboard" element={<ProtectedRoute><RoleSelect /></ProtectedRoute>} />
      <Route path="/hireonboard" element={<ProtectedRoute><HireOnboard /></ProtectedRoute>} />
      <Route path="/serviceonboard" element={<ProtectedRoute><ServiceOnboard /></ProtectedRoute>} />
      <Route
        path="/hiredashboard"
        element={
          <ProtectedRoute>
            <OnboardGuard desiredRole="hire">
              <CartProvider>
                <LocationProvider>
                  <HireLayout />
                </LocationProvider>
              </CartProvider>
            </OnboardGuard>
          </ProtectedRoute>
        }
      >
        <Route index element={<HireHome />} />
        <Route path="services/:category" element={<CategoryLanding />} />
        <Route path="services/:category/select/:slug" element={<ServiceSelectPage />} />
        <Route path="services/:category/:slug" element={<ServiceDetail />} />
        <Route path="booking" element={<BookingDatePage />} />
        <Route path="booking/confirm" element={<BookingConfirmPage />} />
        <Route path="booking/success" element={<BookingSuccessPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="bookings" element={<BookingsPage />} />
        <Route path="bookings/:id" element={<BookingDetailPage />} />
        <Route path="bookings/:id/change" element={<BookingChangePage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="profile" element={<HireProfile />} />
        <Route path="terms" element={<TermsPage />} />
      </Route>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <OnboardGuard desiredRole="service_provider">
              <ProviderLayout />
            </OnboardGuard>
          </ProtectedRoute>
        }
      >
        <Route index element={<JobFeed />} />
        <Route path="jobs" element={<MyJobs />} />
        <Route path="available-jobs" element={<AvailableJobs />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="messages" element={<ProviderMessages />} />
        <Route path="profile" element={<ProfileSettings />} />
      </Route>
    </Routes>
  )
}
