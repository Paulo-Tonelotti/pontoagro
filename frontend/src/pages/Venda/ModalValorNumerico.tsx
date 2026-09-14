import { useEffect, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/Modal'

interface ModalValorNumericoProps {
  aberto: boolean
  onFechar: () => void
  titulo: string
  rotulo: string
  valorInicial?: number
  onConfirmar: (valor: number) => void
}

export function ModalValorNumerico({ aberto, onFechar, titulo, rotulo, valorInicial = 0, onConfirmar }: ModalValorNumericoProps) {
  const [valor, setValor] = useState(String(valorInicial || ''))

  useEffect(() => {
    if (aberto) setValor(valorInicial ? String(valorInicial) : '')
  }, [aberto, valorInicial])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onConfirmar(Number(valor) || 0)
    onFechar()
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo={titulo} className="max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="valor-numerico">{rotulo}</Label>
          <Input
            id="valor-numerico"
            type="number"
            step="0.01"
            min="0"
            autoFocus
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="h-12 text-lg font-semibold"
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onFechar}>
            Cancelar
          </Button>
          <Button type="submit">Confirmar</Button>
        </DialogFooter>
      </form>
    </Modal>
  )
}
