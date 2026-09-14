import { useCallback, useMemo, useState } from 'react'

import type { ProdutoResponseDTO } from '@/types/api'

export interface ItemCarrinho {
  produto: ProdutoResponseDTO
  quantidade: number
}

export function useCarrinho() {
  const [itens, setItens] = useState<ItemCarrinho[]>([])

  const adicionar = useCallback((produto: ProdutoResponseDTO) => {
    setItens((atual) => {
      const existente = atual.find((i) => i.produto.id === produto.id)
      if (existente) {
        const novaQuantidade = Math.min(existente.quantidade + 1, produto.quantidade)
        return atual.map((i) => (i.produto.id === produto.id ? { ...i, quantidade: novaQuantidade } : i))
      }
      return [...atual, { produto, quantidade: Math.min(1, produto.quantidade) }]
    })
  }, [])

  const atualizarQuantidade = useCallback((produtoId: number, quantidade: number) => {
    setItens((atual) =>
      atual.map((i) =>
        i.produto.id === produtoId
          ? { ...i, quantidade: Math.max(1, Math.min(quantidade, i.produto.quantidade)) }
          : i,
      ),
    )
  }, [])

  const remover = useCallback((produtoId: number) => {
    setItens((atual) => atual.filter((i) => i.produto.id !== produtoId))
  }, [])

  const limpar = useCallback(() => setItens([]), [])

  const totalItens = useMemo(() => itens.reduce((soma, i) => soma + i.quantidade, 0), [itens])

  const valorTotal = useMemo(
    () => itens.reduce((soma, i) => soma + i.quantidade * i.produto.preco, 0),
    [itens],
  )

  return { itens, adicionar, atualizarQuantidade, remover, limpar, totalItens, valorTotal }
}
