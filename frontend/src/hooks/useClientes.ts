import { useCallback, useEffect, useState } from 'react'

import { extrairMensagemErro } from '@/lib/error'
import { clienteService } from '@/services/clienteService'
import type { ClienteResponseDTO } from '@/types/api'

export function useClientes() {
  const [clientes, setClientes] = useState<ClienteResponseDTO[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const buscar = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      setClientes(await clienteService.listar())
    } catch (e) {
      setErro(extrairMensagemErro(e, 'Não foi possível carregar os clientes.'))
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    buscar()
  }, [buscar])

  return { clientes, carregando, erro, recarregar: buscar }
}
