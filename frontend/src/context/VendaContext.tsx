import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import type { ClienteResponseDTO, FormaPagamento } from '@/types/api'

export interface ItemCupom {
  produtoId: number
  codigoBarra: string
  descricao: string
  quantidade: number
  precoUnitario: number
  hora: string
}

interface VendaContextValue {
  itens: ItemCupom[]
  cliente: ClienteResponseDTO | null
  desconto: number
  acrescimo: number
  valorRecebido: number | null
  formaPagamento: FormaPagamento
  indiceSelecionado: number | null
  subtotal: number
  total: number
  troco: number | null
  inserirItem: (item: ItemCupom) => void
  atualizarItem: (indice: number, dados: Partial<ItemCupom>) => void
  removerItem: (indice: number) => void
  selecionarIndice: (indice: number | null) => void
  definirCliente: (cliente: ClienteResponseDTO | null) => void
  definirDesconto: (valor: number) => void
  definirAcrescimo: (valor: number) => void
  definirValorRecebido: (valor: number | null) => void
  definirFormaPagamento: (forma: FormaPagamento) => void
  novoCupom: () => void
}

const VendaContext = createContext<VendaContextValue | null>(null)

export function VendaProvider({ children }: { children: ReactNode }) {
  const [itens, setItens] = useState<ItemCupom[]>([])
  const [cliente, setCliente] = useState<ClienteResponseDTO | null>(null)
  const [desconto, setDesconto] = useState(0)
  const [acrescimo, setAcrescimo] = useState(0)
  const [valorRecebido, setValorRecebido] = useState<number | null>(null)
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>('DINHEIRO')
  const [indiceSelecionado, setIndiceSelecionado] = useState<number | null>(null)

  const inserirItem = useCallback((item: ItemCupom) => {
    setItens((atual) => [...atual, item])
  }, [])

  const atualizarItem = useCallback((indice: number, dados: Partial<ItemCupom>) => {
    setItens((atual) => atual.map((item, i) => (i === indice ? { ...item, ...dados } : item)))
  }, [])

  const removerItem = useCallback((indice: number) => {
    setItens((atual) => atual.filter((_, i) => i !== indice))
    setIndiceSelecionado(null)
  }, [])

  const novoCupom = useCallback(() => {
    setItens([])
    setCliente(null)
    setDesconto(0)
    setAcrescimo(0)
    setValorRecebido(null)
    setFormaPagamento('DINHEIRO')
    setIndiceSelecionado(null)
  }, [])

  const subtotal = useMemo(() => itens.reduce((soma, i) => soma + i.quantidade * i.precoUnitario, 0), [itens])
  const total = useMemo(() => Math.max(0, subtotal - desconto + acrescimo), [subtotal, desconto, acrescimo])
  const troco = useMemo(() => (valorRecebido !== null ? valorRecebido - total : null), [valorRecebido, total])

  return (
    <VendaContext.Provider
      value={{
        itens,
        cliente,
        desconto,
        acrescimo,
        valorRecebido,
        formaPagamento,
        indiceSelecionado,
        subtotal,
        total,
        troco,
        inserirItem,
        atualizarItem,
        removerItem,
        selecionarIndice: setIndiceSelecionado,
        definirCliente: setCliente,
        definirDesconto: setDesconto,
        definirAcrescimo: setAcrescimo,
        definirValorRecebido: setValorRecebido,
        definirFormaPagamento: setFormaPagamento,
        novoCupom,
      }}
    >
      {children}
    </VendaContext.Provider>
  )
}

export function useVenda() {
  const contexto = useContext(VendaContext)
  if (!contexto) throw new Error('useVenda precisa ser usado dentro de um VendaProvider')
  return contexto
}
