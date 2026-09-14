import { api } from '@/lib/api'
import type { ConfiguracaoRequestDTO, ConfiguracaoResponseDTO } from '@/types/api'

export const configuracaoService = {
  async buscar(): Promise<ConfiguracaoResponseDTO> {
    const { data } = await api.get<ConfiguracaoResponseDTO>('/configuracoes')
    return data
  },

  async atualizar(dto: ConfiguracaoRequestDTO): Promise<ConfiguracaoResponseDTO> {
    const { data } = await api.put<ConfiguracaoResponseDTO>('/configuracoes', dto)
    return data
  },
}
