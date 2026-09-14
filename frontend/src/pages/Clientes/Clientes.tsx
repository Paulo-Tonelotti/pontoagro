import { useMemo, useState } from 'react'
import { History, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { ClienteFormDialog } from '@/components/ClienteFormDialog'
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog'
import { DataTable } from '@/components/DataTable'
import { Input } from '@/components/ui/input'
import { useClientes } from '@/hooks/useClientes'
import { extrairMensagemErro } from '@/lib/error'
import { clienteService } from '@/services/clienteService'
import type { ClienteResponseDTO } from '@/types/api'

import { ModalHistoricoCliente } from './ModalHistoricoCliente'

export function Clientes() {
  const { clientes, carregando, erro, recarregar } = useClientes()

  const [busca, setBusca] = useState('')
  const [formAberto, setFormAberto] = useState(false)
  const [clienteEmEdicao, setClienteEmEdicao] = useState<ClienteResponseDTO | null>(null)
  const [clienteParaExcluir, setClienteParaExcluir] = useState<ClienteResponseDTO | null>(null)
  const [excluindo, setExcluindo] = useState(false)
  const [clienteHistorico, setClienteHistorico] = useState<ClienteResponseDTO | null>(null)

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return clientes
    return clientes.filter((c) => c.nome.toLowerCase().includes(termo) || (c.documento ?? '').includes(termo))
  }, [clientes, busca])

  const handleNovo = () => {
    setClienteEmEdicao(null)
    setFormAberto(true)
  }

  const handleEditar = (cliente: ClienteResponseDTO) => {
    setClienteEmEdicao(cliente)
    setFormAberto(true)
  }

  const handleConfirmarExclusao = async () => {
    if (!clienteParaExcluir) return
    setExcluindo(true)
    try {
      await clienteService.remover(clienteParaExcluir.id)
      toast.success('Cliente removido com sucesso.')
      setClienteParaExcluir(null)
      recarregar()
    } catch (e) {
      toast.error('Não foi possível remover o cliente', { description: extrairMensagemErro(e) })
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Clientes</h1>
        <p className="text-sm text-muted-foreground">Cadastre clientes e consulte o histórico de compras.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome ou documento..." className="pl-9" />
        </div>
        <Button onClick={handleNovo}>
          <Plus /> Novo cliente
        </Button>
      </div>

      <DataTable
        colunas={[
          { cabecalho: 'Nome', render: (c: ClienteResponseDTO) => c.nome },
          { cabecalho: 'Documento', render: (c: ClienteResponseDTO) => c.documento ?? '—' },
          { cabecalho: 'Telefone', render: (c: ClienteResponseDTO) => c.telefone ?? '—' },
          { cabecalho: 'Endereço', render: (c: ClienteResponseDTO) => c.endereco ?? '—' },
          {
            cabecalho: 'Ações',
            className: 'text-right',
            render: (c: ClienteResponseDTO) => (
              <div className="flex justify-end gap-1">
                <Button variant="outline" size="icon" onClick={() => setClienteHistorico(c)} title="Histórico de compras">
                  <History className="size-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => handleEditar(c)}>
                  <Pencil className="size-4" />
                </Button>
                <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => setClienteParaExcluir(c)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ),
          },
        ]}
        dados={filtrados}
        chave={(c) => c.id}
        carregando={carregando}
        mensagemVazio={erro ?? 'Nenhum cliente cadastrado.'}
      />

      <ClienteFormDialog open={formAberto} onOpenChange={setFormAberto} cliente={clienteEmEdicao} onSalvo={recarregar} />

      <ConfirmDeleteDialog
        open={clienteParaExcluir !== null}
        onOpenChange={(open) => !open && setClienteParaExcluir(null)}
        titulo="Excluir cliente"
        descricao={`Tem certeza que deseja excluir "${clienteParaExcluir?.nome}"? Essa ação não pode ser desfeita.`}
        excluindo={excluindo}
        onConfirmar={handleConfirmarExclusao}
      />

      <ModalHistoricoCliente cliente={clienteHistorico} onFechar={() => setClienteHistorico(null)} />
    </div>
  )
}
