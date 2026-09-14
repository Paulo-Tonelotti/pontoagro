import { Percent, Wallet } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useVenda } from '@/context/VendaContext'
import { formatarMoeda } from '@/lib/format'

export type TipoModalTotais = 'desconto' | 'subtotal' | 'valorRecebido' | 'lancar'

interface ColunaTotaisProps {
  onAbrirModal: (tipo: TipoModalTotais) => void
}

export function ColunaTotais({ onAbrirModal }: ColunaTotaisProps) {
  const { total, desconto, acrescimo, valorRecebido, troco } = useVenda()

  return (
    <div className="flex w-[26%] min-w-64 flex-col gap-3 bg-card p-4">
      <div className="flex flex-col items-center rounded-lg border-2 border-primary bg-primary/5 py-4">
        <span className="text-sm font-bold tracking-widest text-primary uppercase">Total</span>
        <span className="text-4xl font-extrabold text-primary">{formatarMoeda(total)}</span>
        {desconto > 0 && <span className="text-xs text-muted-foreground">Desconto de {formatarMoeda(desconto)} aplicado</span>}
        {acrescimo > 0 && <span className="text-xs text-muted-foreground">Acréscimo de {formatarMoeda(acrescimo)} lançado</span>}
      </div>

      <Button variant="outline" size="lg" className="h-12 justify-between" onClick={() => onAbrirModal('desconto')}>
        <span className="flex items-center gap-2">
          <Percent className="size-4" /> Desconto
        </span>
        <span className="font-semibold">{formatarMoeda(desconto)}</span>
      </Button>

      <Button variant="outline" size="lg" className="h-12" onClick={() => onAbrirModal('subtotal')}>
        Subtotal
      </Button>

      <Button variant="outline" size="lg" className="h-12 justify-between" onClick={() => onAbrirModal('valorRecebido')}>
        <span className="flex items-center gap-2">
          <Wallet className="size-4" /> Valor Recebido
        </span>
        <span className="font-semibold">{valorRecebido !== null ? formatarMoeda(valorRecebido) : '—'}</span>
      </Button>

      <div className="flex h-12 items-center justify-between rounded-md border bg-muted px-4">
        <span className="text-sm font-medium text-muted-foreground">Troco</span>
        <span className="text-lg font-bold text-foreground">{troco !== null ? formatarMoeda(troco) : '—'}</span>
      </div>

      <Button
        variant="destructive"
        size="lg"
        className="mt-auto h-12 font-bold"
        onClick={() => onAbrirModal('lancar')}
      >
        LANÇAR VALOR
      </Button>
    </div>
  )
}
