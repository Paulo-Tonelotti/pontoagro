import { useEffect, useState, type FormEvent } from 'react'
import { Loader2, PackagePlus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { extrairMensagemErro } from '@/lib/error'
import { produtoService } from '@/services/produtoService'
import type { ProdutoResponseDTO } from '@/types/api'

interface EntradaEstoqueDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  produto: ProdutoResponseDTO | null
  onSalvo: () => void
}

export function EntradaEstoqueDialog({ open, onOpenChange, produto, onSalvo }: EntradaEstoqueDialogProps) {
  const [quantidade, setQuantidade] = useState('')
  const [observacao, setObservacao] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (open) {
      setQuantidade('')
      setObservacao('')
    }
  }, [open, produto])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!produto) return

    const qtd = Number(quantidade)
    if (!qtd || qtd <= 0) {
      toast.error('Informe uma quantidade maior que zero.')
      return
    }

    setSalvando(true)
    try {
      await produtoService.darEntradaEstoque(produto.id, { quantidade: qtd, observacao: observacao || null })
      toast.success(`Entrada de ${qtd} unidade(s) registrada para ${produto.nome}.`)
      onSalvo()
      onOpenChange(false)
    } catch (e) {
      toast.error('Não foi possível registrar a entrada', { description: extrairMensagemErro(e) })
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Entrada de estoque</DialogTitle>
          <DialogDescription>
            {produto ? `${produto.nome} · estoque atual: ${produto.quantidade}` : ''}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quantidade-entrada">Quantidade recebida</Label>
            <Input
              id="quantidade-entrada"
              type="number"
              min="1"
              autoFocus
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="Ex: 50"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="observacao-entrada">Observação (opcional)</Label>
            <Textarea
              id="observacao-entrada"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: nota fiscal 1234, fornecedor X"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando ? <Loader2 className="animate-spin" /> : <PackagePlus />}
              Registrar entrada
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
