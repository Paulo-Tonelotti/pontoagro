import { LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Logomarca } from '@/components/Logomarca'
import { useAuth } from '@/context/AuthContext'

export function Header() {
  const { operador, sair } = useAuth()

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b bg-card px-4">
      <Logomarca compacta />
      <div className="flex items-center gap-3">
        {operador && (
          <div className="text-right leading-tight">
            <p className="text-sm font-medium text-foreground">{operador.nome}</p>
            <p className="text-xs text-muted-foreground">{operador.perfil === 'GERENTE' ? 'Gerente' : 'Operador'}</p>
          </div>
        )}
        <Button variant="ghost" size="icon" onClick={sair} title="Sair">
          <LogOut className="size-4" />
        </Button>
      </div>
    </header>
  )
}
