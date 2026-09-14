import { api } from '@/lib/api'
import type { ProdutoMaisVendidoDTO, TotalPeriodoDTO, TotalPorFormaPagamentoDTO } from '@/types/api'

interface Periodo {
  dataInicio: string
  dataFim: string
}

export const relatorioService = {
  async totalPorPeriodo(periodo: Periodo): Promise<TotalPeriodoDTO> {
    const { data } = await api.get<TotalPeriodoDTO>('/relatorios/vendas-periodo', { params: periodo })
    return data
  },

  async produtosMaisVendidos(periodo: Periodo, limite = 10): Promise<ProdutoMaisVendidoDTO[]> {
    const { data } = await api.get<ProdutoMaisVendidoDTO[]>('/relatorios/produtos-mais-vendidos', {
      params: { ...periodo, limite },
    })
    return data
  },

  async totalPorFormaPagamento(periodo: Periodo): Promise<TotalPorFormaPagamentoDTO[]> {
    const { data } = await api.get<TotalPorFormaPagamentoDTO[]>('/relatorios/formas-pagamento', { params: periodo })
    return data
  },
}
