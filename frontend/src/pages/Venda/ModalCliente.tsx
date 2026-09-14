import { useMemo, useState, type FormEvent } from 'react'
import { Loader2, Search, UserPlus, UserX } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/DataTable'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Modal } from '@/components/Modal'
import { Separator } from '@/components/ui/separator'
import { useClientes } from '@/hooks/useClientes'
import { extrairMensagemErro } from '@/lib/error'
import { clienteService } from '@/services/clienteService'
import type { ClienteResponseDTO } from '@/types/api'

interface ModalClienteProps {
  aberto: boolean
  onFechar: () => void
  clienteAtual: ClienteResponseDTO | null
  onSelecionar: (cliente: ClienteResponseDTO | null) => void
}

export function ModalCliente({ aberto, onFechar, clienteAtual, onSelecionar }: ModalClienteProps) {
  const { clientes, carregando, recarregar } = useClientes()
  const [busca, setBusca] = useState('')
  const [nomeNovo, setNomeNovo] = useState('')
  const [documentoNovo, setDocumentoNovo] = useState('')
  const [cadastrando, setCadastrando] = useState(false)

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return clientes
    return clientes.filter((c) => c.nome.toLowerCase().includes(termo) || (c.documento ?? '').includes(termo))
  }, [clientes, busca])

  const handleSelecionar = (cliente: ClienteResponseDTO) => {
    onSelecionar(cliente)
    onFechar()
  }

  const handleRemoverCliente = () => {
    onSelecionar(null)
    onFechar()
  }

  const handleCadastrarRapido = async (e: FormEvent) => {
    e.preventDefault()
    if (!nomeNovo.trim()) return
    setCadastrando(true)
    try {
      const cliente = await clienteService.criar({ nome: nomeNovo, documento: documentoNovo || null, telefone: null, endereco: null })
      toast.success('Cliente cadastrado com sucesso.')
      setNomeNovo('')
      setDocumentoNovo('')
      recarregar()
      onSelecionar(cliente)
      onFechar()
    } catch (e) {
      toast.error('Não foi possível cadastrar o cliente', { description: extrairMensagemErro(e) })
    } finally {
      setCadastrando(false)
    }
  }

  return (
    <Modal aberto={aberto} onFechar={onFechar} titulo="Cliente da venda" descricao="Selecione um cliente já cadastrado ou cadastre um novo rapidamente." className="max-w-2xl">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input autoFocus value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar cliente por nome ou documento..." className="pl-9" />
      </div>

      <div className="max-h-64 overflow-y-auto">
        <DataTable
          colunas={[
            { cabecalho: 'Nome', render: (c: ClienteResponseDTO) => c.nome },
            { cabecalho: 'Documento', render: (c: ClienteResponseDTO) => c.documento ?? '—' },
            { cabecalho: 'Telefone', render: (c: ClienteResponseDTO) => c.telefone ?? '—' },
          ]}
          dados={filtrados}
          chave={(c) => c.id}
          carregando={carregando}
          mensagemVazio="Nenhum cliente encontrado."
          onRowClick={handleSelecionar}
        />
      </div>

      {clienteAtual && (
        <Button type="button" variant="outline" onClick={handleRemoverCliente}>
          <UserX /> Remover cliente da venda (Consumidor Final)
        </Button>
      )}

      <Separator />

      <form onSubmit={handleCadastrarRapido} className="flex flex-col gap-3">
        <p className="text-sm font-medium text-foreground">Cadastro rápido</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nome-novo-cliente">Nome</Label>
            <Input id="nome-novo-cliente" value={nomeNovo} onChange={(e) => setNomeNovo(e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="documento-novo-cliente">Documento</Label>
            <Input id="documento-novo-cliente" value={documentoNovo} onChange={(e) => setDocumentoNovo(e.target.value)} />
          </div>
        </div>
        <Button type="submit" disabled={cadastrando || !nomeNovo.trim()}>
          {cadastrando ? <Loader2 className="animate-spin" /> : <UserPlus />}
          Cadastrar e selecionar
        </Button>
      </form>
    </Modal>
  )
}
