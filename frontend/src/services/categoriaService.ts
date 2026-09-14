import { api } from '@/lib/api'
import type { CategoriaRequestDTO, CategoriaResponseDTO } from '@/types/api'

export const categoriaService = {
  async listar(): Promise<CategoriaResponseDTO[]> {
    const { data } = await api.get<CategoriaResponseDTO[]>('/categorias')
    return data
  },

  async criar(dto: CategoriaRequestDTO): Promise<CategoriaResponseDTO> {
    const { data } = await api.post<CategoriaResponseDTO>('/categorias', dto)
    return data
  },

  async atualizar(id: number, dto: CategoriaRequestDTO): Promise<CategoriaResponseDTO> {
    const { data } = await api.put<CategoriaResponseDTO>(`/categorias/${id}`, dto)
    return data
  },

  async remover(id: number): Promise<void> {
    await api.delete(`/categorias/${id}`)
  },
}
