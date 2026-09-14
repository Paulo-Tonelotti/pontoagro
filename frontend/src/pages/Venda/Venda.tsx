import { useRef, useState } from 'react'
import { MessageSquare, ScanBarcode, ScanLine } from 'lucide-react'
import { toast } from 'sonner'

import { Modal } from '@/components/Modal'
import { useVenda } from '@/context/VendaContext'
import { useConfiguracao } from '@/hooks/useConfiguracao'
import { useAtalhoTeclado } from '@/hooks/useAtalhoTeclado'
import { useProdutos } from '@/hooks/useProdutos'
import { extrairMensagemErro } from '@/lib/error'
import { formatarHoraAtual, formatarMoeda } from '@/lib/format'
import { vendaService } from '@/services/vendaService'
import type { ProdutoResponseDTO, VendaResponseDTO } from '@/types/api'

import { BarraInferior } from './BarraInferior'
import { ColunaCupom } from './ColunaCupom'
import { ColunaLancamento } from './ColunaLancamento'
import { ColunaTotais, type TipoModalTotais } from './ColunaTotais'
import { ModalAlterarItem } from './ModalAlterarItem'
import { ModalBuscarProduto } from './ModalBuscarProduto'
import { ModalCliente } from './ModalCliente'
import { ModalConsultaProduto } from './ModalConsultaProduto'
import { ModalCupom } from './ModalCupom'
import { ModalValorNumerico } from './ModalValorNumerico'

type ModalAberto = TipoModalTotais | 'consulta' | 'cliente' | 'cupom' | 'mensagem' | 'alterar' | 'buscarProduto' | null

export function Venda() {
  const configuracao = useConfiguracao()
  const { produtos, recarregar: recarregarProdutos } = useProdutos()
  const {
    itens,
    cliente,
    desconto,
    acrescimo,
    valorRecebido,
    formaPagamento,
    indiceSelecionado,
    subtotal,
    total,
    inserirItem,
    atualizarItem,
    removerItem,
    definirCliente,
    definirDesconto,
    definirAcrescimo,
    definirValorRecebido,
    novoCupom,
  } = useVenda()

  const [usarLeitor, setUsarLeitor] = useState(true)
  const [modalAberto, setModalAberto] = useState<ModalAberto>(null)
  const [enviando, setEnviando] = useState(false)
  const [ultimaVenda, setUltimaVenda] = useState<VendaResponseDTO | null>(null)

  const inputCodigoRef = useRef<HTMLInputElement>(null)

  const fecharModal = () => setModalAberto(null)
  const itemSelecionado = indiceSelecionado !== null ? itens[indiceSelecionado] : null

  const handleNovo = () => {
    if (itens.length > 0 && !window.confirm('Descartar o cupom em andamento e iniciar um novo?')) return
    novoCupom()
    toast.success('Novo cupom iniciado.')
    inputCodigoRef.current?.focus()
  }

  const handleAlterar = () => {
    if (itemSelecionado === null) return
    setModalAberto('alterar')
  }

  const handleExcluir = () => {
    if (indiceSelecionado === null) return
    if (!window.confirm('Remover o item selecionado do cupom?')) return
    removerItem(indiceSelecionado)
  }

  const handleCancelar = () => {
    if (!window.confirm('Cancelar a venda em andamento? Todos os itens lançados serão perdidos.')) return
    novoCupom()
    toast('Venda cancelada.')
    inputCodigoRef.current?.focus()
  }

  const handleAdicionarPorBusca = (produto: ProdutoResponseDTO, quantidade: number) => {
    inserirItem({
      produtoId: produto.id,
      codigoBarra: produto.codigoBarra,
      descricao: produto.nome,
      quantidade,
      precoUnitario: produto.preco,
      hora: formatarHoraAtual(),
    })
    toast.success(`${produto.nome} lançado no cupom.`)
  }

  const handleFinalizar = async () => {
    if (itens.length === 0) return
    setEnviando(true)
    try {
      const venda = await vendaService.criar({
        itens: itens.map((i) => ({ produtoId: i.produtoId, quantidade: i.quantidade })),
        formaPagamento,
        desconto,
        acrescimo,
        valorRecebido,
        clienteId: cliente?.id ?? null,
      })
      setUltimaVenda(venda)
      toast.success('Venda finalizada com sucesso!', {
        description: `Venda #${venda.id} · Total ${formatarMoeda(venda.valorTotal)}`,
      })
      novoCupom()
      recarregarProdutos()
      inputCodigoRef.current?.focus()
    } catch (e) {
      toast.error('Não foi possível finalizar a venda', { description: extrairMensagemErro(e) })
    } finally {
      setEnviando(false)
    }
  }

  useAtalhoTeclado('F2', handleNovo)
  useAtalhoTeclado('F3', () => setModalAberto('buscarProduto'))
  useAtalhoTeclado('F4', () => setModalAberto('cliente'))
  useAtalhoTeclado('F6', () => setModalAberto('desconto'))
  useAtalhoTeclado('F8', handleCancelar)
  useAtalhoTeclado('F9', handleFinalizar)

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b bg-card px-4 py-2">
        <p className="text-sm font-bold tracking-wide text-foreground">SISTEMA DE VENDA · PDV</p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setUsarLeitor((v) => !v)}
            className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
          >
            {usarLeitor ? <ScanBarcode className="size-4 text-secondary" /> : <ScanLine className="size-4 text-muted-foreground" />}
            {usarLeitor ? 'Usar Leitor' : 'Não usar Leitor'}
          </button>
          <span className="rounded-md bg-muted px-3 py-1.5 text-xs font-bold text-foreground">ITENS: {itens.length}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-center bg-secondary py-1.5">
        <span className="text-sm font-bold tracking-widest text-secondary-foreground uppercase">Caixa - Aberto</span>
      </div>

      <div className="flex min-h-0 flex-1">
        <ColunaCupom />
        <ColunaLancamento
          usarLeitor={usarLeitor}
          inputCodigoRef={inputCodigoRef}
          onAbrirBusca={() => setModalAberto('buscarProduto')}
        />
        <ColunaTotais onAbrirModal={setModalAberto} />
      </div>

      <BarraInferior
        temItemSelecionado={itemSelecionado !== null}
        temItens={itens.length > 0}
        enviando={enviando}
        onNovo={handleNovo}
        onAlterar={handleAlterar}
        onExcluir={handleExcluir}
        onCancelar={handleCancelar}
        onConsulta={() => setModalAberto('consulta')}
        onCliente={() => setModalAberto('cliente')}
        onCupom={() => setModalAberto('cupom')}
        onMensagem={() => setModalAberto('mensagem')}
        onLancar={() => setModalAberto('lancar')}
        onFinalizar={handleFinalizar}
      />

      <ModalValorNumerico
        aberto={modalAberto === 'desconto'}
        onFechar={fecharModal}
        titulo="Aplicar desconto"
        rotulo="Valor do desconto (R$)"
        valorInicial={desconto}
        onConfirmar={definirDesconto}
      />

      <ModalValorNumerico
        aberto={modalAberto === 'valorRecebido'}
        onFechar={fecharModal}
        titulo="Valor recebido"
        rotulo="Quanto o cliente pagou (R$)"
        valorInicial={valorRecebido ?? 0}
        onConfirmar={definirValorRecebido}
      />

      <ModalValorNumerico
        aberto={modalAberto === 'lancar'}
        onFechar={fecharModal}
        titulo="Lançar valor"
        rotulo="Valor a acrescentar na venda (R$)"
        valorInicial={acrescimo}
        onConfirmar={definirAcrescimo}
      />

      <Modal aberto={modalAberto === 'subtotal'} onFechar={fecharModal} titulo="Subtotal" className="max-w-xs">
        <p className="text-center text-3xl font-bold text-foreground">{formatarMoeda(subtotal)}</p>
        <p className="text-center text-sm text-muted-foreground">Valor antes do desconto</p>
      </Modal>

      <ModalConsultaProduto aberto={modalAberto === 'consulta'} onFechar={fecharModal} produtos={produtos} />

      <ModalBuscarProduto
        aberto={modalAberto === 'buscarProduto'}
        onFechar={fecharModal}
        produtos={produtos}
        onAdicionar={handleAdicionarPorBusca}
      />

      <ModalCliente aberto={modalAberto === 'cliente'} onFechar={fecharModal} clienteAtual={cliente} onSelecionar={definirCliente} />

      <ModalCupom aberto={modalAberto === 'cupom'} onFechar={fecharModal} itensAbertos={itens} totalAberto={total} ultimaVenda={ultimaVenda} />

      <Modal aberto={modalAberto === 'mensagem'} onFechar={fecharModal} titulo="Mensagens do sistema" className="max-w-sm">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <MessageSquare className="size-8 shrink-0" />
          <p>Nenhum aviso do gerente no momento. {configuracao?.nomeComercio ? `Bom trabalho na ${configuracao.nomeComercio}!` : ''}</p>
        </div>
      </Modal>

      <ModalAlterarItem
        aberto={modalAberto === 'alterar'}
        onFechar={fecharModal}
        item={itemSelecionado}
        onConfirmar={(dados) => {
          if (indiceSelecionado !== null) atualizarItem(indiceSelecionado, dados)
        }}
      />
    </div>
  )
}
