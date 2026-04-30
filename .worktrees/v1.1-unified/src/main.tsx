import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { CheckoutSuccess } from './pages/CheckoutSuccess.tsx'
import { CheckoutCancel } from './pages/CheckoutCancel.tsx'
import { AccountPage } from './pages/AccountPage.tsx'
import { TermsOfService } from './pages/TermsOfService.tsx'
import { PrivacyPolicy } from './pages/PrivacyPolicy.tsx'
import { DataDeletion } from './pages/DataDeletion.tsx'
import { AuthProvider } from './lib/auth-provider.tsx'
import { initAnalytics } from './lib/analytics.ts'

// Initialize PostHog
initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/checkout/success" element={<CheckoutSuccess />} />
          <Route path="/checkout/cancel" element={<CheckoutCancel />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/data-deletion" element={<DataDeletion />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
