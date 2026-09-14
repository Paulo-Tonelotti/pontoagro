import type { ReactNode } from 'react'

import { Header } from '@/components/Header'
import { MenuLateral } from '@/components/MenuLateral'

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <MenuLateral />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="min-h-0 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
