import { useState, type KeyboardEvent, type RefObject } from 'react'
import { Loader2, Plus, ScanBarcode, Search } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useVenda } from '@/context/VendaContext'
import { extrairMensagemErro } from '@/lib/error'
import { formatarHoraAtual, formatarMoeda } from '@/lib/format'
import { produtoService } from '@/services/produtoService'
import type { ProdutoResponseDTO } from '@/types/api'

interface ColunaLancamentoProps {
  usarLeitor: boolean
  inputCodigoRef: RefObject<HTMLInputElement | null>
  onAbrirBusca: () => void
}

export function ColunaLancamento({ usarLeitor, inputCodigoRef, onAbrirBusca }: ColunaLancamentoProps) {
  const { inserirItem } = useVenda()

  const [codigo, setCodigo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [quantidade, setQuantidade] = useState('1')
  const [precoUnitario, setPrecoUnitario] = useState('')
  const [produtoAtual, setProdutoAtual] = useState<ProdutoResponseDTO | null>(null)
  const [buscando, setBuscando] = useState(false)

  const total = (Number(quantidade) || 0) * (Number(precoUnitario) || 0)

  const limparRascunho = () => {
    setCodigo('')
    setDescricao('')
    setQuantidade('1')
    setPrecoUnitario('')
    setProdutoAtual(null)
    inputCodigoRef.current?.focus()
  }

  const inserirNoCupom = (produto: ProdutoResponseDTO, qtd: number, preco: number) => {
    inserirItem({
      produtoId: produto.id,
      codigoBarra: produto.codigoBarra,
      descricao: produto.nome,
      quantidade: qtd,
      precoUnitario: preco,
      hora: formatarHoraAtual(),
    })
    toast.success(`${produto.nome} lançado no cupom.`)
    limparRascunho()
  }

  const buscarPorCodigo = async () => {
    const codigoDigitado = codigo.trim()
    if (!codigoDigitado) return

    setBuscando(true)
    try {
      const produto = await produtoService.buscarPorCodigoBarra(codigoDigitado)
      setProdutoAtual(produto)
      setDescricao(produto.nome)
      setPrecoUnitario(String(produto.preco))
      setQuantidade('1')

      if (usarLeitor) {
        inserirNoCupom(produto, 1, produto.preco)
      }
    } catch (e) {
      toast.error('Produto não encontrado', { description: extrairMensagemErro(e) })
      setCodigo('')
    } finally {
      setBuscando(false)
    }
  }

  const handleKeyDownCodigo = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      buscarPorCodigo()
    }
  }

  const handleInserir = () => {
    if (!produtoAtual) {
      toast.error('Informe um código de barras válido antes de inserir.')
      return
    }
    const qtd = Number(quantidade)
    const preco = Number(precoUnitario)
    if (qtd <= 0) {
      toast.error('A quantidade deve ser maior que zero.')
      return
    }
    inserirNoCupom(produtoAtual, qtd, preco)
  }

  return (
    <div className="flex w-[26%] min-w-72 flex-col gap-4 border-r bg-card p-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="codigo-barra" className="flex items-center gap-1.5 text-sm font-bold">
          <ScanBarcode className="size-4" /> CÓDIGO DE BARRA
        </Label>
        <Input
          id="codigo-barra"
          ref={inputCodigoRef}
          autoFocus
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
          onKeyDown={handleKeyDownCodigo}
          disabled={buscando}
          className="h-14 text-xl font-bold tracking-wide"
          placeholder="Bipe ou digite o código"
        />
        <Button type="button" variant="outline" className="justify-start" onClick={onAbrirBusca}>
          <Search className="size-4" /> Buscar produto por nome (F3)
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="descricao-produto" className="text-sm font-bold">
          Descrição/Produto
        </Label>
        <Input
          id="descricao-produto"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          disabled={usarLeitor}
          className="h-11"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="quantidade-item" className="text-sm font-bold">
            Quantidade
          </Label>
          <Input
            id="quantidade-item"
            type="number"
            min="1"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
            className="h-11"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="preco-unitario" className="text-sm font-bold">
            Preço Unitário
          </Label>
          <Input
            id="preco-unitario"
            type="number"
            step="0.01"
            min="0"
            value={precoUnitario}
            onChange={(e) => setPrecoUnitario(e.target.value)}
            className="h-11"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label className="text-sm font-bold">Total</Label>
        <Input readOnly value={formatarMoeda(total)} className="h-11 bg-muted font-bold" />
      </div>

      <Button size="lg" className="mt-2 h-14 text-lg" onClick={handleInserir} disabled={buscando || !produtoAtual}>
        {buscando ? <Loader2 className="animate-spin" /> : <Plus />}
        Inserir
      </Button>
    </div>
  )
}
