import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/context/AuthContext'
import { useVenda } from '@/context/VendaContext'
import { useConfiguracao } from '@/hooks/useConfiguracao'
import { cn } from '@/lib/utils'
import { formatarMoeda } from '@/lib/format'
import type { FormaPagamento } from '@/types/api'

const OPCOES_PAGAMENTO: { valor: FormaPagamento; rotulo: string }[] = [
  { valor: 'DINHEIRO', rotulo: 'A Vista (Dinheiro)' },
  { valor: 'CARTAO_CREDITO', rotulo: 'Cartão de Crédito' },
  { valor: 'CARTAO_DEBITO', rotulo: 'Cartão de Débito' },
  { valor: 'PIX', rotulo: 'Pix' },
]

export function ColunaCupom() {
  const { operador } = useAuth()
  const configuracao = useConfiguracao()
  const { itens, indiceSelecionado, selecionarIndice, cliente, total, formaPagamento, definirFormaPagamento } = useVenda()

  return (
    <div className="flex w-[38%] min-w-80 flex-col border-r bg-card">
      <div className="border-b bg-[#fffbe6] px-4 py-3 text-center">
        <p className="text-sm font-bold text-foreground">{configuracao?.nomeComercio || 'Ponto do Agro'}</p>
        <p className="text-xs text-muted-foreground">{configuracao?.endereco || 'Endereço não configurado'}</p>
        <p className="text-xs text-muted-foreground">
          {configuracao?.telefone ? `Tel: ${configuracao.telefone}` : ''}
          {configuracao?.cnpj ? ` · CNPJ: ${configuracao.cnpj}` : ''}
          {configuracao?.ie ? ` · IE: ${configuracao.ie}` : ''}
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-muted text-muted-foreground">
            <tr>
              <th className="px-2 py-1.5 text-left font-semibold">Data</th>
              <th className="px-2 py-1.5 text-left font-semibold">Cód</th>
              <th className="px-2 py-1.5 text-left font-semibold">Item/Desc</th>
              <th className="px-2 py-1.5 text-right font-semibold">Qtd</th>
              <th className="px-2 py-1.5 text-right font-semibold">Unit</th>
              <th className="px-2 py-1.5 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {itens.length === 0 && (
              <tr>
                <td colSpan={6} className="px-2 py-8 text-center text-muted-foreground">
                  Nenhum item lançado
                </td>
              </tr>
            )}
            {itens.map((item, i) => (
              <tr
                key={i}
                onClick={() => selecionarIndice(i)}
                className={cn(
                  'cursor-pointer border-b bg-[#fffde7] hover:bg-[#fff9c4]',
                  indiceSelecionado === i && 'bg-[#fff59d]',
                )}
              >
                <td className="px-2 py-1.5">{item.hora}</td>
                <td className="px-2 py-1.5">{item.codigoBarra}</td>
                <td className="px-2 py-1.5">{item.descricao}</td>
                <td className="px-2 py-1.5 text-right">{item.quantidade}</td>
                <td className="px-2 py-1.5 text-right">{formatarMoeda(item.precoUnitario)}</td>
                <td className="px-2 py-1.5 text-right font-medium">{formatarMoeda(item.quantidade * item.precoUnitario)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 border-t bg-muted/40 px-4 py-3 text-xs">
        <p>
          <span className="text-muted-foreground">Atendente: </span>
          <span className="font-medium text-foreground">{operador?.nome ?? '—'}</span>
        </p>
        <p className="text-right">
          <span className="text-muted-foreground">Total: </span>
          <span className="font-bold text-primary">{formatarMoeda(total)}</span>
        </p>
        <p>
          <span className="text-muted-foreground">Cliente: </span>
          <span className="font-medium text-foreground">{cliente?.nome ?? 'Consumidor Final'}</span>
        </p>
        <div className="flex justify-end">
          <Select value={formaPagamento} onValueChange={(v) => definirFormaPagamento(v as FormaPagamento)}>
            <SelectTrigger className="h-7 w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OPCOES_PAGAMENTO.map((op) => (
                <SelectItem key={op.valor} value={op.valor}>
                  {op.rotulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
