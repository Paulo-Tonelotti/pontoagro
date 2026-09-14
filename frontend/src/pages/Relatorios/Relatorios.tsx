import { useCallback, useEffect, useState } from 'react'
import { BarChart3, Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/DataTable'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { extrairMensagemErro } from '@/lib/error'
import { formatarFormaPagamento, formatarMoeda } from '@/lib/format'
import { relatorioService } from '@/services/relatorioService'
import type { ProdutoMaisVendidoDTO, TotalPeriodoDTO, TotalPorFormaPagamentoDTO } from '@/types/api'

function hoje(): string {
  return new Date().toISOString().slice(0, 10)
}

function primeiroDiaDoMes(): string {
  const data = new Date()
  return new Date(data.getFullYear(), data.getMonth(), 1).toISOString().slice(0, 10)
}

export function Relatorios() {
  const [dataInicio, setDataInicio] = useState(primeiroDiaDoMes())
  const [dataFim, setDataFim] = useState(hoje())

  const [totalPeriodo, setTotalPeriodo] = useState<TotalPeriodoDTO | null>(null)
  const [produtosMaisVendidos, setProdutosMaisVendidos] = useState<ProdutoMaisVendidoDTO[]>([])
  const [totalFormaPagamento, setTotalFormaPagamento] = useState<TotalPorFormaPagamentoDTO[]>([])
  const [carregando, setCarregando] = useState(true)

  const gerar = useCallback(async () => {
    setCarregando(true)
    try {
      const periodo = { dataInicio, dataFim }
      const [total, produtos, formas] = await Promise.all([
        relatorioService.totalPorPeriodo(periodo),
        relatorioService.produtosMaisVendidos(periodo),
        relatorioService.totalPorFormaPagamento(periodo),
      ])
      setTotalPeriodo(total)
      setProdutosMaisVendidos(produtos)
      setTotalFormaPagamento(formas)
    } catch (e) {
      toast.error('Não foi possível gerar os relatórios', { description: extrairMensagemErro(e) })
    } finally {
      setCarregando(false)
    }
  }, [dataInicio, dataFim])

  useEffect(() => {
    gerar()
  }, [gerar])

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Relatórios</h1>
        <p className="text-sm text-muted-foreground">Acompanhe o desempenho das vendas por período.</p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rel-data-inicio">De</Label>
          <Input id="rel-data-inicio" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-40" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="rel-data-fim">Até</Label>
          <Input id="rel-data-fim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="w-40" />
        </div>
        <Button onClick={gerar} disabled={carregando}>
          {carregando ? <Loader2 className="animate-spin" /> : <Search />}
          Gerar
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col justify-center rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Total vendido no período</p>
          <p className="text-3xl font-extrabold text-primary">{formatarMoeda(totalPeriodo?.totalVendido ?? 0)}</p>
        </div>
        <div className="flex flex-col justify-center rounded-lg border bg-card p-6">
          <p className="text-sm text-muted-foreground">Quantidade de vendas</p>
          <p className="text-3xl font-extrabold text-foreground">{totalPeriodo?.quantidadeVendas ?? 0}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
          <BarChart3 className="size-5" /> Produtos mais vendidos
        </h2>
        <DataTable
          colunas={[
            { cabecalho: 'Produto', render: (p: ProdutoMaisVendidoDTO) => p.produtoNome },
            { cabecalho: 'Quantidade vendida', render: (p: ProdutoMaisVendidoDTO) => p.quantidadeVendida },
            { cabecalho: 'Valor total', render: (p: ProdutoMaisVendidoDTO) => formatarMoeda(p.valorTotal) },
          ]}
          dados={produtosMaisVendidos}
          chave={(p) => p.produtoId}
          carregando={carregando}
          mensagemVazio="Nenhuma venda no período selecionado."
        />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-foreground">Total por forma de pagamento</h2>
        <DataTable
          colunas={[
            { cabecalho: 'Forma de pagamento', render: (f: TotalPorFormaPagamentoDTO) => formatarFormaPagamento(f.formaPagamento) },
            { cabecalho: 'Total', render: (f: TotalPorFormaPagamentoDTO) => formatarMoeda(f.total) },
          ]}
          dados={totalFormaPagamento}
          chave={(f) => f.formaPagamento}
          carregando={carregando}
          mensagemVazio="Nenhuma venda no período selecionado."
        />
      </div>
    </div>
  )
}
