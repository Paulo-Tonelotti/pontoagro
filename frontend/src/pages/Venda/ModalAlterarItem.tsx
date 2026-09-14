import { useEffect, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/Modal'
import type { ItemCupom } from '@/context/VendaContext'

interface ModalAlterarItemProps {
  aberto: boolean
  onFechar: () => void
  item: ItemCupom | null
  onConfirmar: (dados: { quantidade: number; precoUnitario: number }) => void
}

export function ModalAlterarItem({ aberto, onFechar, item, onConfirmar }: ModalAlterarItemProps) {
  const [quantidade, setQuantidade] = useState('1')
  const [precoUnitario, setPrecoUnitario] = useState('0')

  useEffect(() => {
    if (item) {
      setQuantidade(String(item.quantidade))
      setPrecoUnitario(String(item.precoUnitario))
    }
  }, [item])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onConfirmar({ quantidade: Number(quantidade) || 1, precoUnitario: Number(precoUnitario) || 0 })
    onFechar()
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Alterar item" descricao={item?.descricao} className="max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alterar-quantidade">Quantidade</Label>
            <Input id="alterar-quantidade" type="number" min="1" autoFocus value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="alterar-preco">Preço Unitário</Label>
            <Input id="alterar-preco" type="number" step="0.01" min="0" value={precoUnitario} onChange={(e) => setPrecoUnitario(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onFechar}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </form>
    </Modal>
  )
}
