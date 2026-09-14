import { api } from '@/lib/api'
import type { OperadorRequestDTO, OperadorResponseDTO, OperadorUpdateRequestDTO } from '@/types/api'

export const operadorService = {
  async listar(): Promise<OperadorResponseDTO[]> {
    const { data } = await api.get<OperadorResponseDTO[]>('/operadores')
    return data
  },

  async criar(dto: OperadorRequestDTO): Promise<OperadorResponseDTO> {
    const { data } = await api.post<OperadorResponseDTO>('/operadores', dto)
    return data
  },

  async atualizar(id: number, dto: OperadorUpdateRequestDTO): Promise<OperadorResponseDTO> {
    const { data } = await api.put<OperadorResponseDTO>(`/operadores/${id}`, dto)
    return data
  },

  async inativar(id: number): Promise<void> {
    await api.delete(`/operadores/${id}`)
  },
}
