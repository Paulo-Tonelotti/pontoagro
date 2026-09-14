import { api } from '@/lib/api'
import type { VendaRequestDTO, VendaResponseDTO } from '@/types/api'

export const vendaService = {
  async criar(dto: VendaRequestDTO): Promise<VendaResponseDTO> {
    const { data } = await api.post<VendaResponseDTO>('/vendas', dto)
    return data
  },
}
