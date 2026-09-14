import { api } from '@/lib/api'
import type { LoginRequestDTO, LoginResponseDTO } from '@/types/api'

export const authService = {
  async login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const { data } = await api.post<LoginResponseDTO>('/auth/login', dto)
    return data
  },
}
