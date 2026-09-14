import { toast } from 'sonner'

import { CarrinhoSheet } from '@/components/CarrinhoSheet'
import { ProdutoTable } from '@/components/ProdutoTable'
import { useCarrinho } from '@/hooks/useCarrinho'
import { useCriarVenda } from '@/hooks/useCriarVenda'
import { useProdutos } from '@/hooks/useProdutos'
import { formatarMoeda } from '@/lib/format'
import type { ProdutoResponseDTO } from '@/types/api'

export function CatalogoVendas() {
  const { produtos, carregando, erro, recarregar } = useProdutos()
  const carrinho = useCarrinho()
  const { criar, enviando } = useCriarVenda()

  const handleAdicionarAoCarrinho = (produto: ProdutoResponseDTO) => {
    carrinho.adicionar(produto)
    toast.success(`${produto.nome} adicionado ao carrinho.`)
  }

  const handleFinalizarVenda = async (): Promise<boolean> => {
    try {
      const venda = await criar(carrinho.itens)
      if (!venda) return false

      toast.success('Venda concluída com sucesso!', {
        description: `Venda #${venda.id} · Total ${formatarMoeda(venda.valorTotal)}`,
      })
      carrinho.limpar()
      recarregar()
      return true
    } catch (e) {
      toast.error('Não foi possível finalizar a venda', {
        description: e instanceof Error ? e.message : undefined,
      })
      return false
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">PDV · Ponto de Venda</h1>
        <p className="text-sm text-muted-foreground">
          Busque produtos, monte o carrinho e finalize a venda com atualização automática do estoque.
        </p>
      </div>

      <ProdutoTable
        produtos={produtos}
        carregando={carregando}
        erro={erro}
        onTentarNovamente={recarregar}
        onAdicionarAoCarrinho={handleAdicionarAoCarrinho}
      />

      <CarrinhoSheet
        itens={carrinho.itens}
        totalItens={carrinho.totalItens}
        valorTotal={carrinho.valorTotal}
        enviando={enviando}
        onAtualizarQuantidade={carrinho.atualizarQuantidade}
        onRemover={carrinho.remover}
        onFinalizar={handleFinalizarVenda}
      />
    </div>
  )
}
