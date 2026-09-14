import { isAxiosError } from 'axios'

import type { ErroResposta, ErrosValidacao } from '@/types/api'

function isErrosValidacao(data: unknown): data is ErrosValidacao {
  return (
    typeof data === 'object' &&
    data !== null &&
    !('mensagem' in data) &&
    Object.values(data as Record<string, unknown>).every((v) => typeof v === 'string')
  )
}

function isErroResposta(data: unknown): data is ErroResposta {
  return typeof data === 'object' && data !== null && 'mensagem' in data
}

/** Quando o erro é de validação de campos (400), retorna o mapa campo -> mensagem; caso contrário, null. */
export function extrairErrosCampo(erro: unknown): ErrosValidacao | null {
  if (!isAxiosError(erro) || !erro.response) return null

  const data = erro.response.data
  return isErrosValidacao(data) ? data : null
}

/** Extrai uma mensagem legível dos formatos de erro emitidos pelo GlobalExceptionHandler do backend. */
export function extrairMensagemErro(erro: unknown, fallback = 'Ocorreu um erro inesperado. Tente novamente.'): string {
  if (!isAxiosError(erro)) {
    return erro instanceof Error ? erro.message : fallback
  }

  if (!erro.response) {
    return 'Não foi possível conectar ao servidor. Verifique sua conexão.'
  }

  const data = erro.response.data

  if (isErroResposta(data)) {
    return data.mensagem
  }

  if (isErrosValidacao(data)) {
    return Object.values(data).join(' ')
  }

  return fallback
}
