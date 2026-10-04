import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { AuthCallbackPage } from '../pages/AuthCallbackPage'
import { CatalogoPage } from '../pages/CatalogoPage'
import { EscenariosPage } from '../pages/EscenariosPage'
import { LoginPage } from '../pages/LoginPage'
import { PeriodoPage } from '../pages/PeriodoPage'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/periodo" replace />} />
            <Route path="/periodo" element={<PeriodoPage />} />
            <Route path="/catalogo" element={<CatalogoPage />} />
            <Route path="/escenarios" element={<EscenariosPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
