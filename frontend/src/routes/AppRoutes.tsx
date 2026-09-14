import { Navigate, Route, Routes } from 'react-router-dom'

import { Clientes } from '@/pages/Clientes/Clientes'
import { Configuracoes } from '@/pages/Configuracoes/Configuracoes'
import { Login } from '@/pages/Login/Login'
import { Produtos } from '@/pages/Produtos/Produtos'
import { Relatorios } from '@/pages/Relatorios/Relatorios'
import { Usuarios } from '@/pages/Usuarios/Usuarios'
import { Venda } from '@/pages/Venda/Venda'
import { Vendas } from '@/pages/Vendas/Vendas'

import { ProtectedRoute } from './ProtectedRoute'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Venda />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/vendas" element={<Vendas />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
