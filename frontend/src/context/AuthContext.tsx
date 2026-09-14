import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

import { aoFicarNaoAutorizado, tokenStorage } from '@/lib/api'
import { authService } from '@/services/authService'
import type { LoginRequestDTO, PerfilOperador } from '@/types/api'

const OPERADOR_KEY = 'pontoagro:operador'

interface OperadorSessao {
  id: number
  nome: string
  perfil: PerfilOperador
}

interface AuthContextValue {
  operador: OperadorSessao | null
  autenticado: boolean
  carregando: boolean
  entrar: (dto: LoginRequestDTO) => Promise<void>
  sair: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function lerOperadorSalvo(): OperadorSessao | null {
  const bruto = localStorage.getItem(OPERADOR_KEY)
  if (!bruto) return null
  try {
    return JSON.parse(bruto) as OperadorSessao
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [operador, setOperador] = useState<OperadorSessao | null>(null)
  const [carregando, setCarregando] = useState(true)

  const sair = useCallback(() => {
    tokenStorage.limpar()
    localStorage.removeItem(OPERADOR_KEY)
    setOperador(null)
  }, [])

  useEffect(() => {
    const token = tokenStorage.obter()
    const operadorSalvo = lerOperadorSalvo()
    if (token && operadorSalvo) {
      setOperador(operadorSalvo)
    }
    setCarregando(false)

    aoFicarNaoAutorizado(() => {
      localStorage.removeItem(OPERADOR_KEY)
      setOperador(null)
    })
  }, [])

  const entrar = useCallback(async (dto: LoginRequestDTO) => {
    const resposta = await authService.login(dto)
    tokenStorage.salvar(resposta.token)
    const operadorSessao: OperadorSessao = { id: resposta.operadorId, nome: resposta.nome, perfil: resposta.perfil }
    localStorage.setItem(OPERADOR_KEY, JSON.stringify(operadorSessao))
    setOperador(operadorSessao)
  }, [])

  return (
    <AuthContext.Provider value={{ operador, autenticado: operador !== null, carregando, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth precisa ser usado dentro de um AuthProvider')
  return contexto
}
