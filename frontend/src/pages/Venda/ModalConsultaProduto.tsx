import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'

import { DataTable } from '@/components/DataTable'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/Modal'
import { EstoqueBadge } from '@/components/EstoqueBadge'
import { formatarMoeda } from '@/lib/format'
import type { ProdutoResponseDTO } from '@/types/api'

interface ModalConsultaProdutoProps {
  aberto: boolean
  onFechar: () => void
  produtos: ProdutoResponseDTO[]
}

export function ModalConsultaProduto({ aberto, onFechar, produtos }: ModalConsultaProdutoProps) {
  const [busca, setBusca] = useState('')

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return produtos
    return produtos.filter((p) => p.nome.toLowerCase().includes(termo) || p.codigoBarra.includes(termo))
  }, [produtos, busca])

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Consulta de preço" descricao="Busque um produto por nome ou código de barras." className="max-w-2xl">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input autoFocus value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar produto..." className="pl-9" />
      </div>

      <div className="max-h-96 overflow-y-auto">
        <DataTable
          colunas={[
            { cabecalho: 'Código', render: (p: ProdutoResponseDTO) => p.codigoBarra },
            { cabecalho: 'Produto', render: (p: ProdutoResponseDTO) => p.nome },
            { cabecalho: 'Preço', render: (p: ProdutoResponseDTO) => formatarMoeda(p.preco) },
            { cabecalho: 'Estoque', render: (p: ProdutoResponseDTO) => <EstoqueBadge quantidade={p.quantidade} /> },
          ]}
          dados={filtrados}
          chave={(p) => p.id}
          mensagemVazio="Nenhum produto encontrado."
        />
      </div>
    </Modal>
  )
}
