const LIMITE_ESTOQUE_BAIXO = 10

export type StatusEstoque = 'zerado' | 'baixo' | 'disponivel'

export function statusEstoque(quantidade: number): StatusEstoque {
  if (quantidade <= 0) return 'zerado'
  if (quantidade <= LIMITE_ESTOQUE_BAIXO) return 'baixo'
  return 'disponivel'
}

export function estaVencido(dataValidade: string): boolean {
  const hoje = new Date().toISOString().slice(0, 10)
  return dataValidade < hoje
}

export type FiltroEstoque = 'todos' | 'disponivel' | 'esgotado' | 'vencido'
