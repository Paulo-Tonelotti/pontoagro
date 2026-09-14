import { useCallback, useEffect, useState } from 'react'

import { extrairMensagemErro } from '@/lib/error'
import { operadorService } from '@/services/operadorService'
import type { OperadorResponseDTO } from '@/types/api'

export function useOperadores() {
  const [operadores, setOperadores] = useState<OperadorResponseDTO[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const buscar = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      setOperadores(await operadorService.listar())
    } catch (e) {
      setErro(extrairMensagemErro(e, 'Não foi possível carregar os usuários.'))
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    buscar()
  }, [buscar])

  return { operadores, carregando, erro, recarregar: buscar }
}
