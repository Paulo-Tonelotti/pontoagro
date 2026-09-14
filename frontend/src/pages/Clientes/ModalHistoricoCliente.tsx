import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

import { DataTable } from '@/components/DataTable'
import { Modal } from '@/components/Modal'
import { formatarDataHora, formatarMoeda } from '@/lib/format'
import { vendaService } from '@/services/vendaService'
import type { ClienteResponseDTO, VendaResponseDTO } from '@/types/api'

interface ModalHistoricoClienteProps {
  cliente: ClienteResponseDTO | null
  onFechar: () => void
}

export function ModalHistoricoCliente({ cliente, onFechar }: ModalHistoricoClienteProps) {
  const [vendas, setVendas] = useState<VendaResponseDTO[]>([])
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (!cliente) return
    setCarregando(true)
    vendaService
      .listar({ clienteId: cliente.id })
      .then(setVendas)
      .finally(() => setCarregando(false))
  }, [cliente])

  return (
    <Modal aberto={cliente !== null} onFechar={onFechar} titulo={`Histórico de compras · ${cliente?.nome ?? ''}`} className="max-w-2xl">
      {carregando ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <DataTable
          colunas={[
            { cabecalho: 'Venda', render: (v: VendaResponseDTO) => `#${v.id}` },
            { cabecalho: 'Data', render: (v: VendaResponseDTO) => formatarDataHora(v.dataVenda) },
            { cabecalho: 'Itens', render: (v: VendaResponseDTO) => v.itens.length },
            { cabecalho: 'Total', render: (v: VendaResponseDTO) => formatarMoeda(v.valorTotal) },
          ]}
          dados={vendas}
          chave={(v) => v.id}
          mensagemVazio="Este cliente ainda não fez nenhuma compra."
        />
      )}
    </Modal>
  )
}
