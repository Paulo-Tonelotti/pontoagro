import { Modal } from '@/components/Modal'
import { Separator } from '@/components/ui/separator'
import { formatarFormaPagamento, formatarMoeda } from '@/lib/format'
import type { VendaResponseDTO } from '@/types/api'
import type { ItemCupom } from '@/context/VendaContext'

interface ModalCupomProps {
  aberto: boolean
  onFechar: () => void
  itensAbertos: ItemCupom[]
  totalAberto: number
  ultimaVenda: VendaResponseDTO | null
}

export function ModalCupom({ aberto, onFechar, itensAbertos, totalAberto, ultimaVenda }: ModalCupomProps) {
  const mostrarAberto = itensAbertos.length > 0

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo={mostrarAberto ? 'Cupom em andamento' : 'Última venda finalizada'}
      className="max-w-md font-mono"
    >
      {!mostrarAberto && !ultimaVenda && (
        <p className="text-sm text-muted-foreground">Nenhuma venda foi finalizada ainda nesta sessão.</p>
      )}

      {mostrarAberto && (
        <div className="flex flex-col gap-2 text-sm">
          {itensAbertos.map((item, i) => (
            <div key={i} className="flex justify-between">
              <span>
                {item.quantidade}x {item.descricao}
              </span>
              <span>{formatarMoeda(item.quantidade * item.precoUnitario)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between text-base font-bold">
            <span>TOTAL</span>
            <span>{formatarMoeda(totalAberto)}</span>
          </div>
        </div>
      )}

      {!mostrarAberto && ultimaVenda && (
        <div className="flex flex-col gap-2 text-sm">
          <p className="text-muted-foreground">Venda #{ultimaVenda.id}</p>
          {ultimaVenda.itens.map((item) => (
            <div key={item.produtoId} className="flex justify-between">
              <span>
                {item.quantidade}x {item.produtoNome}
              </span>
              <span>{formatarMoeda(item.subtotal)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatarMoeda(ultimaVenda.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Desconto</span>
            <span>{formatarMoeda(ultimaVenda.desconto)}</span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>TOTAL</span>
            <span>{formatarMoeda(ultimaVenda.valorTotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Forma de pagamento</span>
            <span>{formatarFormaPagamento(ultimaVenda.formaPagamento)}</span>
          </div>
          {ultimaVenda.troco !== null && (
            <div className="flex justify-between text-muted-foreground">
              <span>Troco</span>
              <span>{formatarMoeda(ultimaVenda.troco)}</span>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
