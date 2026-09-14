import { useEffect, useState } from 'react'

import { configuracaoService } from '@/services/configuracaoService'
import type { ConfiguracaoResponseDTO } from '@/types/api'

export function useConfiguracao() {
  const [configuracao, setConfiguracao] = useState<ConfiguracaoResponseDTO | null>(null)

  useEffect(() => {
    configuracaoService.buscar().then(setConfiguracao).catch(() => setConfiguracao(null))
  }, [])

  return configuracao
}
