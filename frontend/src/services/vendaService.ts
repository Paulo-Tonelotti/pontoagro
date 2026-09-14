import { api } from '@/lib/api'
import type { VendaRequestDTO, VendaResponseDTO } from '@/types/api'

export interface FiltrosVenda {
  dataInicio?: string
  dataFim?: string
  clienteId?: number
  atendenteId?: number
}

export const vendaService = {
  async criar(dto: VendaRequestDTO): Promise<VendaResponseDTO> {
    const { data } = await api.post<VendaResponseDTO>('/vendas', dto)
    return data
  },

  async buscar(id: number): Promise<VendaResponseDTO> {
    const { data } = await api.get<VendaResponseDTO>(`/vendas/${id}`)
    return data
  },

  async listar(filtros: FiltrosVenda = {}): Promise<VendaResponseDTO[]> {
    const { data } = await api.get<VendaResponseDTO[]>('/vendas', { params: filtros })
    return data
  },

  async cancelar(id: number): Promise<VendaResponseDTO> {
    const { data } = await api.patch<VendaResponseDTO>(`/vendas/${id}/cancelar`)
    return data
  },
}
