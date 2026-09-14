const LIMITE_ESTOQUE_BAIXO = 10

export type StatusEstoque = 'zerado' | 'baixo' | 'disponivel'

export function statusEstoque(quantidade: number): StatusEstoque {
  if (quantidade <= 0) return 'zerado'
  if (quantidade <= LIMITE_ESTOQUE_BAIXO) return 'baixo'
  return 'disponivel'
}
