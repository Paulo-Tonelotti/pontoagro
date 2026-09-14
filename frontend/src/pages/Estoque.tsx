import { useState } from 'react'
import { toast } from 'sonner'

import { CategoriaFormDialog } from '@/components/CategoriaFormDialog'
import { CategoriaTable } from '@/components/CategoriaTable'
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog'
import { EstoqueProdutoTable } from '@/components/EstoqueProdutoTable'
import { ProdutoFormDialog } from '@/components/ProdutoFormDialog'
import { Separator } from '@/components/ui/separator'
import { useCategorias } from '@/hooks/useCategorias'
import { useProdutos } from '@/hooks/useProdutos'
import { extrairMensagemErro } from '@/lib/error'
import { categoriaService } from '@/services/categoriaService'
import { produtoService } from '@/services/produtoService'
import type { CategoriaResponseDTO, ProdutoResponseDTO } from '@/types/api'

export function Estoque() {
  const { produtos, carregando: carregandoProdutos, erro: erroProdutos, recarregar: recarregarProdutos } = useProdutos()
  const {
    categorias,
    carregando: carregandoCategorias,
    erro: erroCategorias,
    recarregar: recarregarCategorias,
  } = useCategorias()

  const [produtoFormAberto, setProdutoFormAberto] = useState(false)
  const [produtoEmEdicao, setProdutoEmEdicao] = useState<ProdutoResponseDTO | null>(null)
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<ProdutoResponseDTO | null>(null)
  const [excluindoProduto, setExcluindoProduto] = useState(false)

  const [categoriaFormAberto, setCategoriaFormAberto] = useState(false)
  const [categoriaEmEdicao, setCategoriaEmEdicao] = useState<CategoriaResponseDTO | null>(null)
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState<CategoriaResponseDTO | null>(null)
  const [excluindoCategoria, setExcluindoCategoria] = useState(false)

  const handleNovoProduto = () => {
    setProdutoEmEdicao(null)
    setProdutoFormAberto(true)
  }

  const handleEditarProduto = (produto: ProdutoResponseDTO) => {
    setProdutoEmEdicao(produto)
    setProdutoFormAberto(true)
  }

  const handleConfirmarExclusaoProduto = async () => {
    if (!produtoParaExcluir) return
    setExcluindoProduto(true)
    try {
      await produtoService.remover(produtoParaExcluir.id)
      toast.success('Produto removido com sucesso.')
      setProdutoParaExcluir(null)
      recarregarProdutos()
    } catch (e) {
      toast.error('Não foi possível remover o produto', { description: extrairMensagemErro(e) })
    } finally {
      setExcluindoProduto(false)
    }
  }

  const handleNovaCategoria = () => {
    setCategoriaEmEdicao(null)
    setCategoriaFormAberto(true)
  }

  const handleEditarCategoria = (categoria: CategoriaResponseDTO) => {
    setCategoriaEmEdicao(categoria)
    setCategoriaFormAberto(true)
  }

  const handleConfirmarExclusaoCategoria = async () => {
    if (!categoriaParaExcluir) return
    setExcluindoCategoria(true)
    try {
      await categoriaService.remover(categoriaParaExcluir.id)
      toast.success('Categoria removida com sucesso.')
      setCategoriaParaExcluir(null)
      recarregarCategorias()
    } catch (e) {
      toast.error('Não foi possível remover a categoria', { description: extrairMensagemErro(e) })
    } finally {
      setExcluindoCategoria(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Gestão de Estoque</h1>
        <p className="text-sm text-muted-foreground">Cadastre produtos e categorias e mantenha o estoque em dia.</p>
      </div>

      <EstoqueProdutoTable
        produtos={produtos}
        carregando={carregandoProdutos}
        erro={erroProdutos}
        onTentarNovamente={recarregarProdutos}
        onNovoProduto={handleNovoProduto}
        onEditar={handleEditarProduto}
        onExcluir={setProdutoParaExcluir}
      />

      <Separator />

      <CategoriaTable
        categorias={categorias}
        carregando={carregandoCategorias}
        erro={erroCategorias}
        onTentarNovamente={recarregarCategorias}
        onNovaCategoria={handleNovaCategoria}
        onEditar={handleEditarCategoria}
        onExcluir={setCategoriaParaExcluir}
      />

      <ProdutoFormDialog
        open={produtoFormAberto}
        onOpenChange={setProdutoFormAberto}
        produto={produtoEmEdicao}
        categorias={categorias}
        onSalvo={recarregarProdutos}
      />

      <ConfirmDeleteDialog
        open={produtoParaExcluir !== null}
        onOpenChange={(open) => !open && setProdutoParaExcluir(null)}
        titulo="Excluir produto"
        descricao={`Tem certeza que deseja excluir "${produtoParaExcluir?.nome}"? Essa ação não pode ser desfeita.`}
        excluindo={excluindoProduto}
        onConfirmar={handleConfirmarExclusaoProduto}
      />

      <CategoriaFormDialog
        open={categoriaFormAberto}
        onOpenChange={setCategoriaFormAberto}
        categoria={categoriaEmEdicao}
        onSalvo={recarregarCategorias}
      />

      <ConfirmDeleteDialog
        open={categoriaParaExcluir !== null}
        onOpenChange={(open) => !open && setCategoriaParaExcluir(null)}
        titulo="Excluir categoria"
        descricao={`Tem certeza que deseja excluir "${categoriaParaExcluir?.nome}"? Produtos vinculados a ela podem ser afetados.`}
        excluindo={excluindoCategoria}
        onConfirmar={handleConfirmarExclusaoCategoria}
      />
    </div>
  )
}
