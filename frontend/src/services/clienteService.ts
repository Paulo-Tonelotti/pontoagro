import { api } from '@/lib/api'
import type { ClienteRequestDTO, ClienteResponseDTO } from '@/types/api'

export const clienteService = {
  async listar(): Promise<ClienteResponseDTO[]> {
    const { data } = await api.get<ClienteResponseDTO[]>('/clientes')
    return data
  },

  async buscar(id: number): Promise<ClienteResponseDTO> {
    const { data } = await api.get<ClienteResponseDTO>(`/clientes/${id}`)
    return data
  },

  async criar(dto: ClienteRequestDTO): Promise<ClienteResponseDTO> {
    const { data } = await api.post<ClienteResponseDTO>('/clientes', dto)
    return data
  },

  async atualizar(id: number, dto: ClienteRequestDTO): Promise<ClienteResponseDTO> {
    const { data } = await api.put<ClienteResponseDTO>(`/clientes/${id}`, dto)
    return data
  },

  async remover(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`)
  },
}
