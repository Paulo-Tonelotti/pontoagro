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
import { Textarea } from '@/components/ui/textarea'
import { extrairErrosCampo, extrairMensagemErro } from '@/lib/error'
import { categoriaService } from '@/services/categoriaService'
import type { CategoriaRequestDTO, CategoriaResponseDTO, ErrosValidacao } from '@/types/api'

interface CategoriaFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categoria: CategoriaResponseDTO | null
  onSalvo: () => void
}

const FORM_VAZIO = { nome: '', descricao: '' }

export function CategoriaFormDialog({ open, onOpenChange, categoria, onSalvo }: CategoriaFormDialogProps) {
  const [form, setForm] = useState(FORM_VAZIO)
  const [erros, setErros] = useState<ErrosValidacao>({})
  const [salvando, setSalvando] = useState(false)

  const editando = categoria !== null

  useEffect(() => {
    if (!open) return
    setErros({})
    setForm(categoria ? { nome: categoria.nome, descricao: categoria.descricao } : FORM_VAZIO)
  }, [open, categoria])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErros({})
    setSalvando(true)

    const dto: CategoriaRequestDTO = { nome: form.nome, descricao: form.descricao }

    try {
      if (editando) {
        await categoriaService.atualizar(categoria.id, dto)
        toast.success('Categoria atualizada com sucesso.')
      } else {
        await categoriaService.criar(dto)
        toast.success('Categoria cadastrada com sucesso.')
      }
      onSalvo()
      onOpenChange(false)
    } catch (e) {
      const errosCampo = extrairErrosCampo(e)
      if (errosCampo) {
        setErros(errosCampo)
      } else {
        toast.error('Não foi possível salvar a categoria', { description: extrairMensagemErro(e) })
      }
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editando ? 'Editar categoria' : 'Nova categoria'}</DialogTitle>
          <DialogDescription>
            {editando ? 'Atualize os dados da categoria selecionada.' : 'Preencha os dados para cadastrar uma nova categoria.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nome-categoria">Nome</Label>
            <Input
              id="nome-categoria"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            {erros.nome && <p className="text-xs text-destructive">{erros.nome}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="descricao-categoria">Descrição</Label>
            <Textarea
              id="descricao-categoria"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            />
            {erros.descricao && <p className="text-xs text-destructive">{erros.descricao}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando && <Loader2 className="animate-spin" />}
              {editando ? 'Salvar alterações' : 'Cadastrar categoria'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
