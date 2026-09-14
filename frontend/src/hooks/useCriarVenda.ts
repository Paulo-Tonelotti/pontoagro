import { useState } from 'react'

import { extrairMensagemErro } from '@/lib/error'
import { vendaService } from '@/services/vendaService'
import type { ItemCarrinho } from '@/hooks/useCarrinho'
import type { VendaResponseDTO } from '@/types/api'

export function useCriarVenda() {
  const [enviando, setEnviando] = useState(false)

  const criar = async (itens: ItemCarrinho[]): Promise<VendaResponseDTO | null> => {
    setEnviando(true)
    try {
      const venda = await vendaService.criar({
        itens: itens.map((i) => ({ produtoId: i.produto.id, quantidade: i.quantidade })),
      })
      return venda
    } catch (e) {
      throw new Error(extrairMensagemErro(e, 'Não foi possível concluir a venda.'))
    } finally {
      setEnviando(false)
    }
  }

  return { criar, enviando }
}
