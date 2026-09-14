import { NavLink } from 'react-router-dom'
import { BarChart3, Receipt, Settings, ShoppingCart, UserCog, Users, Warehouse } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const ITENS_MENU = [
  { to: '/', label: 'Venda', icon: ShoppingCart, fim: true },
  { to: '/produtos', label: 'Produtos', icon: Warehouse },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/vendas', label: 'Vendas', icon: Receipt },
  { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { to: '/usuarios', label: 'Usuários', icon: UserCog, somenteGerente: true },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function MenuLateral() {
  const { operador } = useAuth()

  return (
    <nav className="flex w-20 shrink-0 flex-col items-center gap-1 border-r bg-primary py-3 text-primary-foreground">
      {ITENS_MENU.filter((item) => !item.somenteGerente || operador?.perfil === 'GERENTE').map(
        ({ to, label, icon: Icon, fim }) => (
          <NavLink
            key={to}
            to={to}
            end={fim}
            className={({ isActive }) =>
              cn(
                'flex w-16 flex-col items-center gap-1 rounded-md px-1 py-2 text-[11px] font-medium transition-colors hover:bg-primary-foreground/10',
                isActive && 'bg-primary-foreground/15 text-primary-foreground',
                !isActive && 'text-primary-foreground/70',
              )
            }
          >
            <Icon className="size-5" />
            <span className="text-center leading-tight">{label}</span>
          </NavLink>
        ),
      )}
    </nav>
  )
}
