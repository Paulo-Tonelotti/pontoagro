import { Boxes, ShoppingBasket } from 'lucide-react'

import { Logomarca } from '@/components/Logomarca'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CatalogoVendas } from '@/pages/CatalogoVendas'
import { Estoque } from '@/pages/Estoque'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logomarca />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Tabs defaultValue="pdv">
          <TabsList>
            <TabsTrigger value="pdv">
              <ShoppingBasket /> PDV
            </TabsTrigger>
            <TabsTrigger value="estoque">
              <Boxes /> Estoque
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pdv">
            <CatalogoVendas />
          </TabsContent>

          <TabsContent value="estoque">
            <Estoque />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App
