import { Modal } from '@/components/Modal'
import { Separator } from '@/components/ui/separator'
import { formatarDataHora, formatarFormaPagamento, formatarMoeda } from '@/lib/format'
import type { VendaResponseDTO } from '@/types/api'

interface ModalDetalheVendaProps {
  venda: VendaResponseDTO | null
  onFechar: () => void
}

export function ModalDetalheVenda({ venda, onFechar }: ModalDetalheVendaProps) {
  return (
    <Modal aberto={venda !== null} onFechar={onFechar} titulo={`Cupom da venda #${venda?.id ?? ''}`} className="max-w-md font-mono">
      {venda && (
        <div className="flex flex-col gap-2 text-sm">
          <p className="text-muted-foreground">{formatarDataHora(venda.dataVenda)}</p>
          <p className="text-muted-foreground">Atendente: {venda.atendenteNome ?? '—'}</p>
          <p className="text-muted-foreground">Cliente: {venda.clienteNome ?? 'Consumidor Final'}</p>
          <Separator />
          {venda.itens.map((item) => (
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
            <span>{formatarMoeda(venda.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Desconto</span>
            <span>-{formatarMoeda(venda.desconto)}</span>
          </div>
          {venda.acrescimo > 0 && (
            <div className="flex justify-between">
              <span>Acréscimo</span>
              <span>+{formatarMoeda(venda.acrescimo)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold">
            <span>TOTAL</span>
            <span>{formatarMoeda(venda.valorTotal)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Forma de pagamento</span>
            <span>{formatarFormaPagamento(venda.formaPagamento)}</span>
          </div>
          {venda.troco !== null && (
            <div className="flex justify-between text-muted-foreground">
              <span>Troco</span>
              <span>{formatarMoeda(venda.troco)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Status</span>
            <span>{venda.status}</span>
          </div>
        </div>
      )}
    </Modal>
  )
}
