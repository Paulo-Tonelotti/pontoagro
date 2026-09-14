import axios from 'axios'

const TOKEN_KEY = 'pontoagro:token'

export const tokenStorage = {
  obter(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  },
  salvar(token: string) {
    localStorage.setItem(TOKEN_KEY, token)
  },
  limpar() {
    localStorage.removeItem(TOKEN_KEY)
  },
}

type OuvinteNaoAutorizado = () => void
let ouvinteNaoAutorizado: OuvinteNaoAutorizado | null = null

export function aoFicarNaoAutorizado(ouvinte: OuvinteNaoAutorizado) {
  ouvinteNaoAutorizado = ouvinte
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = tokenStorage.obter()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.limpar()
      ouvinteNaoAutorizado?.()
    }
    return Promise.reject(error)
  },
)
