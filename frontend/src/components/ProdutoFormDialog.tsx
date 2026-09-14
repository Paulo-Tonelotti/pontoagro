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
import { useUnidadesMedida } from '@/hooks/useUnidadesMedida'
import { extrairErrosCampo, extrairMensagemErro } from '@/lib/error'
import { produtoService } from '@/services/produtoService'
import type { CategoriaResponseDTO, ErrosValidacao, ProdutoRequestDTO, ProdutoResponseDTO } from '@/types/api'

interface ProdutoFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  produto: ProdutoResponseDTO | null
  categorias: CategoriaResponseDTO[]
  onSalvo: () => void
}

const FORM_VAZIO = {
  nome: '',
  preco: '',
  quantidade: '',
  dataValidade: '',
  unidadeMedida: '',
  codigoBarra: '',
  categoriaId: '',
}

export function ProdutoFormDialog({ open, onOpenChange, produto, categorias, onSalvo }: ProdutoFormDialogProps) {
  const unidades = useUnidadesMedida()
  const [form, setForm] = useState(FORM_VAZIO)
  const [erros, setErros] = useState<ErrosValidacao>({})
  const [salvando, setSalvando] = useState(false)

  const editando = produto !== null

  useEffect(() => {
    if (!open) return

    setErros({})
    setForm(
      produto
        ? {
            nome: produto.nome,
            preco: String(produto.preco),
            quantidade: String(produto.quantidade),
            dataValidade: produto.dataValidade,
            unidadeMedida: produto.unidadeMedida.sigla,
            codigoBarra: produto.codigoBarra,
            categoriaId: produto.categoriaId ? String(produto.categoriaId) : '',
          }
        : FORM_VAZIO,
    )
  }, [open, produto])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErros({})
    setSalvando(true)

    const dto: ProdutoRequestDTO = {
      nome: form.nome,
      preco: Number(form.preco),
      quantidade: Number(form.quantidade),
      dataValidade: form.dataValidade,
      unidadeMedida: form.unidadeMedida,
      codigoBarra: form.codigoBarra,
      categoriaId: Number(form.categoriaId),
    }

    try {
      if (editando) {
        await produtoService.atualizar(produto.id, dto)
        toast.success('Produto atualizado com sucesso.')
      } else {
        await produtoService.criar(dto)
        toast.success('Produto cadastrado com sucesso.')
      }
      onSalvo()
      onOpenChange(false)
    } catch (e) {
      const errosCampo = extrairErrosCampo(e)
      if (errosCampo) {
        setErros(errosCampo)
      } else {
        toast.error('Não foi possível salvar o produto', { description: extrairMensagemErro(e) })
      }
    } finally {
      setSalvando(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editando ? 'Editar produto' : 'Novo produto'}</DialogTitle>
          <DialogDescription>
            {editando ? 'Atualize os dados do produto selecionado.' : 'Preencha os dados para cadastrar um novo produto.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            {erros.nome && <p className="text-xs text-destructive">{erros.nome}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="preco">Preço</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0"
                value={form.preco}
                onChange={(e) => setForm({ ...form, preco: e.target.value })}
              />
              {erros.preco && <p className="text-xs text-destructive">{erros.preco}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="quantidade">Quantidade {editando && '(inicial)'}</Label>
              <Input
                id="quantidade"
                type="number"
                min="0"
                disabled={editando}
                value={form.quantidade}
                onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
              />
              {editando ? (
                <p className="text-xs text-muted-foreground">Use "Entrada de estoque" para adicionar unidades.</p>
              ) : (
                erros.quantidade && <p className="text-xs text-destructive">{erros.quantidade}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="unidadeMedida">Unidade de medida</Label>
              <Select
                value={form.unidadeMedida}
                onValueChange={(v) => setForm({ ...form, unidadeMedida: v })}
              >
                <SelectTrigger id="unidadeMedida">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {unidades.map((u) => (
                    <SelectItem key={u.sigla} value={u.sigla}>
                      {u.descricao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {erros.unidadeMedida && <p className="text-xs text-destructive">{erros.unidadeMedida}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dataValidade">Validade</Label>
              <Input
                id="dataValidade"
                type="date"
                value={form.dataValidade}
                onChange={(e) => setForm({ ...form, dataValidade: e.target.value })}
              />
              {erros.dataValidade && <p className="text-xs text-destructive">{erros.dataValidade}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="categoriaId">Categoria</Label>
            <Select
              value={form.categoriaId}
              onValueChange={(v) => setForm({ ...form, categoriaId: v })}
            >
              <SelectTrigger id="categoriaId">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {categorias.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {erros.categoriaId && <p className="text-xs text-destructive">{erros.categoriaId}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="codigoBarra">Código de barras</Label>
            <Input
              id="codigoBarra"
              disabled={editando}
              value={form.codigoBarra}
              onChange={(e) => setForm({ ...form, codigoBarra: e.target.value })}
            />
            {erros.codigoBarra && <p className="text-xs text-destructive">{erros.codigoBarra}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando && <Loader2 className="animate-spin" />}
              {editando ? 'Salvar alterações' : 'Cadastrar produto'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
