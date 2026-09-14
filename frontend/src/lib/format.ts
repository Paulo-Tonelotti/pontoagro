export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarData(data: string): string {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

export function formatarDataHora(dataIso: string): string {
  return new Date(dataIso).toLocaleString('pt-BR')
}

export function formatarHoraAtual(): string {
  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

const LABEL_FORMA_PAGAMENTO: Record<string, string> = {
  DINHEIRO: 'Dinheiro',
  CARTAO_CREDITO: 'Cartão de Crédito',
  CARTAO_DEBITO: 'Cartão de Débito',
  PIX: 'Pix',
}

export function formatarFormaPagamento(forma: string | null): string {
  if (!forma) return '—'
  return LABEL_FORMA_PAGAMENTO[forma] ?? forma
}
