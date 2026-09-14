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
import { extrairErrosCampo, extrairMensagemErro } from '@/lib/error'
import { clienteService } from '@/services/clienteService'
import type { ClienteRequestDTO, ClienteResponseDTO, ErrosValidacao } from '@/types/api'

interface ClienteFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cliente: ClienteResponseDTO | null
  onSalvo: () => void
}

const FORM_VAZIO = { nome: '', documento: '', telefone: '', endereco: '' }

export function ClienteFormDialog({ open, onOpenChange, cliente, onSalvo }: ClienteFormDialogProps) {
  const [form, setForm] = useState(FORM_VAZIO)
  const [erros, setErros] = useState<ErrosValidacao>({})
  const [salvando, setSalvando] = useState(false)

  const editando = cliente !== null

  useEffect(() => {
    if (!open) return
    setErros({})
    setForm(
      cliente
        ? { nome: cliente.nome, documento: cliente.documento ?? '', telefone: cliente.telefone ?? '', endereco: cliente.endereco ?? '' }
        : FORM_VAZIO,
    )
  }, [open, cliente])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErros({})
    setSalvando(true)

    const dto: ClienteRequestDTO = {
      nome: form.nome,
      documento: form.documento || null,
      telefone: form.telefone || null,
      endereco: form.endereco || null,
    }

    try {
      if (editando) {
        await clienteService.atualizar(cliente.id, dto)
        toast.success('Cliente atualizado com sucesso.')
      } else {
        await clienteService.criar(dto)
        toast.success('Cliente cadastrado com sucesso.')
      }
      onSalvo()
      onOpenChange(false)
    } catch (e) {
      const errosCampo = extrairErrosCampo(e)
      if (errosCampo) {
        setErros(errosCampo)
      } else {
        toast.error('Não foi possível salvar o cliente', { description: extrairMensagemErro(e) })
      }
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editando ? 'Editar cliente' : 'Novo cliente'}</DialogTitle>
          <DialogDescription>
            {editando ? 'Atualize os dados do cliente selecionado.' : 'Preencha os dados para cadastrar um novo cliente.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nome-cliente">Nome</Label>
            <Input id="nome-cliente" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
            {erros.nome && <p className="text-xs text-destructive">{erros.nome}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="documento-cliente">Documento</Label>
              <Input id="documento-cliente" value={form.documento} onChange={(e) => setForm({ ...form, documento: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="telefone-cliente">Telefone</Label>
              <Input id="telefone-cliente" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="endereco-cliente">Endereço</Label>
            <Input id="endereco-cliente" value={form.endereco} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando && <Loader2 className="animate-spin" />}
              {editando ? 'Salvar alterações' : 'Cadastrar cliente'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
