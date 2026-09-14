import { useCallback, useEffect, useState } from 'react'

import { extrairMensagemErro } from '@/lib/error'
import { categoriaService } from '@/services/categoriaService'
import type { CategoriaResponseDTO } from '@/types/api'

export function useCategorias() {
  const [categorias, setCategorias] = useState<CategoriaResponseDTO[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const buscar = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const dados = await categoriaService.listar()
      setCategorias(dados)
    } catch (e) {
      setErro(extrairMensagemErro(e, 'Não foi possível carregar as categorias.'))
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    buscar()
  }, [buscar])

  return { categorias, carregando, erro, recarregar: buscar }
}
