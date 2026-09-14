import { useEffect, useState, type FormEvent } from 'react'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { extrairMensagemErro } from '@/lib/error'
import { configuracaoService } from '@/services/configuracaoService'
import type { ConfiguracaoRequestDTO } from '@/types/api'

const FORM_VAZIO: ConfiguracaoRequestDTO = {
  nomeComercio: '',
  endereco: '',
  telefone: '',
  cnpj: '',
  ie: '',
  usarLeitorPadrao: true,
}

export function Configuracoes() {
  const [form, setForm] = useState<ConfiguracaoRequestDTO>(FORM_VAZIO)
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    configuracaoService
      .buscar()
      .then((dados) =>
        setForm({
          nomeComercio: dados.nomeComercio ?? '',
          endereco: dados.endereco ?? '',
          telefone: dados.telefone ?? '',
          cnpj: dados.cnpj ?? '',
          ie: dados.ie ?? '',
          usarLeitorPadrao: dados.usarLeitorPadrao,
        }),
      )
      .finally(() => setCarregando(false))
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSalvando(true)
    try {
      await configuracaoService.atualizar(form)
      toast.success('Configurações salvas com sucesso.')
    } catch (e) {
      toast.error('Não foi possível salvar as configurações', { description: extrairMensagemErro(e) })
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Dados do comércio usados no cupom e preferências gerais.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4 rounded-lg border bg-card p-6">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nome-comercio">Nome do comércio</Label>
          <Input
            id="nome-comercio"
            value={form.nomeComercio ?? ''}
            onChange={(e) => setForm({ ...form, nomeComercio: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="endereco-comercio">Endereço</Label>
          <Input id="endereco-comercio" value={form.endereco ?? ''} onChange={(e) => setForm({ ...form, endereco: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="telefone-comercio">Telefone</Label>
            <Input id="telefone-comercio" value={form.telefone ?? ''} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cnpj-comercio">CNPJ</Label>
            <Input id="cnpj-comercio" value={form.cnpj ?? ''} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ie-comercio">Inscrição Estadual</Label>
          <Input id="ie-comercio" value={form.ie ?? ''} onChange={(e) => setForm({ ...form, ie: e.target.value })} />
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={form.usarLeitorPadrao}
            onChange={(e) => setForm({ ...form, usarLeitorPadrao: e.target.checked })}
            className="size-4 accent-primary"
          />
          Usar leitor de código de barras por padrão na tela de venda
        </label>

        <Button type="submit" disabled={salvando} className="mt-2 self-start">
          {salvando ? <Loader2 className="animate-spin" /> : <Save />}
          Salvar configurações
        </Button>
      </form>
    </div>
  )
}
