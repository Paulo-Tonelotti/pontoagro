import { Navigate, Outlet } from 'react-router-dom'

import { Layout } from '@/components/Layout'
import { useAuth } from '@/context/AuthContext'

export function ProtectedRoute() {
  const { autenticado, carregando } = useAuth()

  if (carregando) return null

  if (!autenticado) {
    return <Navigate to="/login" replace />
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}
