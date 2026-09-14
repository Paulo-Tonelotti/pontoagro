import { useCallback, useEffect, useState } from 'react'
import { Ban, Eye, Search } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/DataTable'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClientes } from '@/hooks/useClientes'
import { useOperadores } from '@/hooks/useOperadores'
import { extrairMensagemErro } from '@/lib/error'
import { formatarDataHora, formatarMoeda } from '@/lib/format'
import { vendaService } from '@/services/vendaService'
import type { VendaResponseDTO } from '@/types/api'

import { ModalDetalheVenda } from './ModalDetalheVenda'

function hoje(): string {
  return new Date().toISOString().slice(0, 10)
}

function primeiroDiaDoMes(): string {
  const data = new Date()
  return new Date(data.getFullYear(), data.getMonth(), 1).toISOString().slice(0, 10)
}

export function Vendas() {
  const { clientes } = useClientes()
  const { operadores } = useOperadores()

  const [dataInicio, setDataInicio] = useState(primeiroDiaDoMes())
  const [dataFim, setDataFim] = useState(hoje())
  const [clienteId, setClienteId] = useState<string>('todos')
  const [atendenteId, setAtendenteId] = useState<string>('todos')

  const [vendas, setVendas] = useState<VendaResponseDTO[]>([])
  const [carregando, setCarregando] = useState(true)
  const [vendaSelecionada, setVendaSelecionada] = useState<VendaResponseDTO | null>(null)

  const buscar = useCallback(async () => {
    setCarregando(true)
    try {
      const resultado = await vendaService.listar({
        dataInicio,
        dataFim,
        clienteId: clienteId !== 'todos' ? Number(clienteId) : undefined,
        atendenteId: atendenteId !== 'todos' ? Number(atendenteId) : undefined,
      })
      setVendas(resultado.sort((a, b) => b.id - a.id))
    } catch (e) {
      toast.error('Não foi possível carregar as vendas', { description: extrairMensagemErro(e) })
    } finally {
      setCarregando(false)
    }
  }, [dataInicio, dataFim, clienteId, atendenteId])

  useEffect(() => {
    buscar()
  }, [buscar])

  const handleCancelar = async (venda: VendaResponseDTO) => {
    if (!window.confirm(`Cancelar a venda #${venda.id}? O estoque dos produtos será estornado.`)) return
    try {
      await vendaService.cancelar(venda.id)
      toast.success('Venda cancelada e estoque estornado.')
      buscar()
    } catch (e) {
      toast.error('Não foi possível cancelar a venda', { description: extrairMensagemErro(e) })
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Vendas</h1>
        <p className="text-sm text-muted-foreground">Consulte o histórico de vendas finalizadas.</p>
      </div>

      <div className="flex flex-wrap items-end gap-3 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="data-inicio">De</Label>
          <Input id="data-inicio" type="date" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} className="w-40" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="data-fim">Até</Label>
          <Input id="data-fim" type="date" value={dataFim} onChange={(e) => setDataFim(e.target.value)} className="w-40" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Cliente</Label>
          <Select value={clienteId} onValueChange={setClienteId}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os clientes</SelectItem>
              {clientes.map((c) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Atendente</Label>
          <Select value={atendenteId} onValueChange={setAtendenteId}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os atendentes</SelectItem>
              {operadores.map((o) => (
                <SelectItem key={o.id} value={String(o.id)}>
                  {o.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={buscar}>
          <Search /> Buscar
        </Button>
      </div>

      <DataTable
        colunas={[
          { cabecalho: 'Venda', render: (v: VendaResponseDTO) => `#${v.id}` },
          { cabecalho: 'Data', render: (v: VendaResponseDTO) => formatarDataHora(v.dataVenda) },
          { cabecalho: 'Cliente', render: (v: VendaResponseDTO) => v.clienteNome ?? 'Consumidor Final' },
          { cabecalho: 'Atendente', render: (v: VendaResponseDTO) => v.atendenteNome ?? '—' },
          { cabecalho: 'Total', render: (v: VendaResponseDTO) => formatarMoeda(v.valorTotal) },
          {
            cabecalho: 'Status',
            render: (v: VendaResponseDTO) => (
              <Badge variant={v.status === 'CANCELADA' ? 'destructive' : 'success'}>{v.status}</Badge>
            ),
          },
          {
            cabecalho: 'Ações',
            className: 'text-right',
            render: (v: VendaResponseDTO) => (
              <div className="flex justify-end gap-1">
                <Button variant="outline" size="icon" onClick={() => setVendaSelecionada(v)} title="Ver cupom">
                  <Eye className="size-4" />
                </Button>
                {v.status === 'FINALIZADA' && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleCancelar(v)}
                    title="Cancelar venda"
                  >
                    <Ban className="size-4" />
                  </Button>
                )}
              </div>
            ),
          },
        ]}
        dados={vendas}
        chave={(v) => v.id}
        carregando={carregando}
        mensagemVazio="Nenhuma venda encontrada para o período selecionado."
      />

      <ModalDetalheVenda venda={vendaSelecionada} onFechar={() => setVendaSelecionada(null)} />
    </div>
  )
}
