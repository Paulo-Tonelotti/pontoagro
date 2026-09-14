import { api } from '@/lib/api'
import type {
  EntradaEstoqueRequestDTO,
  MovimentacaoEstoqueResponseDTO,
  ProdutoRequestDTO,
  ProdutoResponseDTO,
  UnidadeMedida,
} from '@/types/api'

export const produtoService = {
  async listar(): Promise<ProdutoResponseDTO[]> {
    const { data } = await api.get<ProdutoResponseDTO[]>('/produtos')
    return data
  },

  async buscar(id: number): Promise<ProdutoResponseDTO> {
    const { data } = await api.get<ProdutoResponseDTO>(`/produtos/${id}`)
    return data
  },

  async criar(dto: ProdutoRequestDTO): Promise<ProdutoResponseDTO> {
    const { data } = await api.post<ProdutoResponseDTO>('/produtos', dto)
    return data
  },

  async atualizar(id: number, dto: ProdutoRequestDTO): Promise<ProdutoResponseDTO> {
    const { data } = await api.put<ProdutoResponseDTO>(`/produtos/${id}`, dto)
    return data
  },

  async remover(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`)
  },

  async listarUnidadesMedida(): Promise<UnidadeMedida[]> {
    const { data } = await api.get<UnidadeMedida[]>('/produtos/unidades-medida')
    return data
  },

  async buscarPorCodigoBarra(codigoBarra: string): Promise<ProdutoResponseDTO> {
    const { data } = await api.get<ProdutoResponseDTO>(`/produtos/codigo-barras/${encodeURIComponent(codigoBarra)}`)
    return data
  },

  async darEntradaEstoque(id: number, dto: EntradaEstoqueRequestDTO): Promise<ProdutoResponseDTO> {
    const { data } = await api.post<ProdutoResponseDTO>(`/produtos/${id}/entradas`, dto)
    return data
  },

  async listarMovimentacoes(id: number): Promise<MovimentacaoEstoqueResponseDTO[]> {
    const { data } = await api.get<MovimentacaoEstoqueResponseDTO[]>(`/produtos/${id}/movimentacoes`)
    return data
  },
}
