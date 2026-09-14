import { useEffect, useState } from 'react'

import { produtoService } from '@/services/produtoService'
import type { UnidadeMedida } from '@/types/api'

export function useUnidadesMedida() {
  const [unidades, setUnidades] = useState<UnidadeMedida[]>([])

  useEffect(() => {
    produtoService.listarUnidadesMedida().then(setUnidades).catch(() => setUnidades([]))
  }, [])

  return unidades
}
