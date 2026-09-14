import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Lock, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Logomarca } from '@/components/Logomarca'
import { useAuth } from '@/context/AuthContext'
import { extrairMensagemErro } from '@/lib/error'

export function Login() {
  const { entrar } = useAuth()
  const navegar = useNavigate()

  const [login, setLogin] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErro(null)
    setEnviando(true)
    try {
      await entrar({ login, senha })
      navegar('/', { replace: true })
    } catch (e) {
      setErro(extrairMensagemErro(e, 'Não foi possível entrar. Verifique o login e a senha.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border bg-card p-8 shadow-lg">
        <div className="mb-8 flex justify-center">
          <Logomarca />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="login">Usuário</Label>
            <div className="relative">
              <User className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login"
                autoFocus
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="pl-9"
                placeholder="Seu usuário"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="senha">Senha</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="pl-9"
                placeholder="Sua senha"
              />
            </div>
          </div>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <Button type="submit" size="lg" disabled={enviando} className="mt-2">
            {enviando && <Loader2 className="animate-spin" />}
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}
