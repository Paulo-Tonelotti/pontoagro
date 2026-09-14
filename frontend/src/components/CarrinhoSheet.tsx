import { useState } from 'react'
import { Loader2, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import type { ItemCarrinho } from '@/hooks/useCarrinho'
import { formatarMoeda } from '@/lib/format'

interface CarrinhoSheetProps {
  itens: ItemCarrinho[]
  totalItens: number
  valorTotal: number
  enviando: boolean
  onAtualizarQuantidade: (produtoId: number, quantidade: number) => void
  onRemover: (produtoId: number) => void
  onFinalizar: () => Promise<boolean>
}

export function CarrinhoSheet({
  itens,
  totalItens,
  valorTotal,
  enviando,
  onAtualizarQuantidade,
  onRemover,
  onFinalizar,
}: CarrinhoSheetProps) {
  const [aberto, setAberto] = useState(false)

  const handleFinalizar = async () => {
    const sucesso = await onFinalizar()
    if (sucesso) setAberto(false)
  }

  return (
    <Sheet open={aberto} onOpenChange={setAberto}>
      <SheetTrigger asChild>
        <Button size="lg" className="fixed right-6 bottom-6 z-40 h-14 rounded-full px-6 shadow-lg">
          <ShoppingCart className="size-5" />
          Carrinho
          {totalItens > 0 && (
            <Badge variant="secondary" className="ml-1 bg-primary-foreground text-primary">
              {totalItens}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent className="flex flex-col p-0">
        <SheetHeader>
          <SheetTitle>Carrinho de venda</SheetTitle>
          <SheetDescription>Ajuste as quantidades antes de finalizar a venda.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {itens.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <ShoppingCart className="size-8" />
              <p className="text-sm">Seu carrinho está vazio.</p>
              <p className="text-xs">Adicione produtos na tabela para iniciar uma venda.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {itens.map(({ produto, quantidade }) => (
                <li key={produto.id} className="flex flex-col gap-2 rounded-md border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium">{produto.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatarMoeda(produto.preco)} / {produto.unidadeMedida.sigla}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemover(produto.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        disabled={quantidade <= 1}
                        onClick={() => onAtualizarQuantidade(produto.id, quantidade - 1)}
                      >
                        <Minus className="size-3" />
                      </Button>
                      <span className="w-8 text-center text-sm font-medium">{quantidade}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-7"
                        disabled={quantidade >= produto.quantidade}
                        onClick={() => onAtualizarQuantidade(produto.id, quantidade + 1)}
                      >
                        <Plus className="size-3" />
                      </Button>
                    </div>
                    <p className="text-sm font-semibold">{formatarMoeda(produto.preco * quantidade)}</p>
                  </div>
                  {quantidade >= produto.quantidade && (
                    <p className="text-xs text-warning-foreground/80">Quantidade máxima em estoque atingida.</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {itens.length > 0 && (
          <SheetFooter>
            <div className="flex items-center justify-between">
              <Separator className="hidden" />
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold text-primary">{formatarMoeda(valorTotal)}</span>
            </div>
            <Button size="lg" disabled={enviando} onClick={handleFinalizar}>
              {enviando ? (
                <>
                  <Loader2 className="animate-spin" /> Finalizando...
                </>
              ) : (
                'Finalizar venda'
              )}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
