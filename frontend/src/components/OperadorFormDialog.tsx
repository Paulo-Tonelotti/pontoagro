import { useEffect, useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { extrairErrosCampo, extrairMensagemErro } from '@/lib/error'
import { operadorService } from '@/services/operadorService'
import type { ErrosValidacao, OperadorResponseDTO, PerfilOperador } from '@/types/api'

interface OperadorFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  operador: OperadorResponseDTO | null
  onSalvo: () => void
}

const FORM_VAZIO = { nome: '', login: '', senha: '', perfil: 'OPERADOR' as PerfilOperador, ativo: true }

export function OperadorFormDialog({ open, onOpenChange, operador, onSalvo }: OperadorFormDialogProps) {
  const [form, setForm] = useState(FORM_VAZIO)
  const [erros, setErros] = useState<ErrosValidacao>({})
  const [salvando, setSalvando] = useState(false)

  const editando = operador !== null

  useEffect(() => {
    if (!open) return
    setErros({})
    setForm(
      operador
        ? { nome: operador.nome, login: operador.login, senha: '', perfil: operador.perfil, ativo: operador.ativo }
        : FORM_VAZIO,
    )
  }, [open, operador])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErros({})
    setSalvando(true)

    try {
      if (editando) {
        await operadorService.atualizar(operador.id, { nome: form.nome, perfil: form.perfil, ativo: form.ativo })
        toast.success('Usuário atualizado com sucesso.')
      } else {
        await operadorService.criar({ nome: form.nome, login: form.login, senha: form.senha, perfil: form.perfil })
        toast.success('Usuário cadastrado com sucesso.')
      }
      onSalvo()
      onOpenChange(false)
    } catch (e) {
      const errosCampo = extrairErrosCampo(e)
      if (errosCampo) {
        setErros(errosCampo)
      } else {
        toast.error('Não foi possível salvar o usuário', { description: extrairMensagemErro(e) })
      }
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editando ? 'Editar usuário' : 'Novo usuário'}</DialogTitle>
          <DialogDescription>
            {editando
              ? 'Atualize os dados e a permissão do usuário selecionado.'
              : 'Preencha os dados para cadastrar um novo operador ou gerente.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nome-operador">Nome</Label>
            <Input id="nome-operador" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            {erros.nome && <p className="text-xs text-destructive">{erros.nome}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="login-operador">Login</Label>
              <Input
                id="login-operador"
                disabled={editando}
                value={form.login}
                onChange={(e) => setForm({ ...form, login: e.target.value })}
              />
              {erros.login && <p className="text-xs text-destructive">{erros.login}</p>}
            </div>

            {!editando && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="senha-operador">Senha</Label>
                <Input
                  id="senha-operador"
                  type="password"
                  value={form.senha}
                  onChange={(e) => setForm({ ...form, senha: e.target.value })}
                />
                {erros.senha && <p className="text-xs text-destructive">{erros.senha}</p>}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="perfil-operador">Permissão</Label>
            <Select value={form.perfil} onValueChange={(v) => setForm({ ...form, perfil: v as PerfilOperador })}>
              <SelectTrigger id="perfil-operador">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPERADOR">Operador de caixa</SelectItem>
                <SelectItem value="GERENTE">Gerente</SelectItem>
              </SelectContent>
            </Select>
            {erros.perfil && <p className="text-xs text-destructive">{erros.perfil}</p>}
          </div>

          {editando && (
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
                className="size-4 accent-primary"
              />
              Usuário ativo
            </label>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando && <Loader2 className="animate-spin" />}
              {editando ? 'Salvar alterações' : 'Cadastrar usuário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
