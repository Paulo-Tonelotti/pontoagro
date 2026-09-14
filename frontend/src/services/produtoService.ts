import { api } from '@/lib/api'
import type { ProdutoRequestDTO, ProdutoResponseDTO, UnidadeMedida } from '@/types/api'

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
}
