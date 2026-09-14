import { useEffect, useState } from 'react'
import { ArrowDownCircle, ArrowUpCircle, Loader2 } from 'lucide-react'

import { DataTable } from '@/components/DataTable'
import { Modal } from '@/components/Modal'
import { formatarDataHora } from '@/lib/format'
import { produtoService } from '@/services/produtoService'
import type { MovimentacaoEstoqueResponseDTO, ProdutoResponseDTO } from '@/types/api'

interface HistoricoEstoqueModalProps {
  produto: ProdutoResponseDTO | null
  onFechar: () => void
}

export function HistoricoEstoqueModal({ produto, onFechar }: HistoricoEstoqueModalProps) {
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoqueResponseDTO[]>([])
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (!produto) return
    setCarregando(true)
    produtoService
      .listarMovimentacoes(produto.id)
      .then(setMovimentacoes)
      .finally(() => setCarregando(false))
  }, [produto])

  return (
    <Modal
      aberto={produto !== null}
      onFechar={onFechar}
      titulo={`Histórico de estoque · ${produto?.nome ?? ''}`}
      descricao={`Estoque atual: ${produto?.quantidade ?? 0}`}
      className="max-w-2xl"
    >
      {carregando ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          <DataTable
            colunas={[
              {
                cabecalho: 'Tipo',
                render: (m: MovimentacaoEstoqueResponseDTO) =>
                  m.tipo === 'ENTRADA' ? (
                    <span className="flex items-center gap-1.5 text-secondary">
                      <ArrowUpCircle className="size-4" /> Entrada
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-destructive">
                      <ArrowDownCircle className="size-4" /> Saída
                    </span>
                  ),
              },
              { cabecalho: 'Quantidade', render: (m: MovimentacaoEstoqueResponseDTO) => m.quantidade },
              { cabecalho: 'Data', render: (m: MovimentacaoEstoqueResponseDTO) => formatarDataHora(m.dataMovimentacao) },
              { cabecalho: 'Responsável', render: (m: MovimentacaoEstoqueResponseDTO) => m.operadorNome ?? '—' },
              {
                cabecalho: 'Observação',
                render: (m: MovimentacaoEstoqueResponseDTO) =>
                  m.observacao ?? (m.vendaId ? `Venda #${m.vendaId}` : '—'),
              },
            ]}
            dados={movimentacoes}
            chave={(m) => m.id}
            mensagemVazio="Nenhuma movimentação registrada para este produto."
          />
        </div>
      )}
    </Modal>
  )
}
