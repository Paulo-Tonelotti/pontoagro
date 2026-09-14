import { useCallback, useEffect, useState } from 'react'

import { extrairMensagemErro } from '@/lib/error'
import { produtoService } from '@/services/produtoService'
import type { ProdutoResponseDTO } from '@/types/api'

export function useProdutos() {
  const [produtos, setProdutos] = useState<ProdutoResponseDTO[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const buscar = useCallback(async () => {
    setCarregando(true)
    setErro(null)
    try {
      const dados = await produtoService.listar()
      setProdutos(dados)
    } catch (e) {
      setErro(extrairMensagemErro(e, 'Não foi possível carregar os produtos.'))
    } finally {
      setCarregando(false)
    }
  }, [])

  useEffect(() => {
    buscar()
  }, [buscar])

  return { produtos, carregando, erro, recarregar: buscar }
}
