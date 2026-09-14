import { useState } from 'react'
import { Pencil, Plus, ShieldAlert, UserX } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog'
import { DataTable } from '@/components/DataTable'
import { OperadorFormDialog } from '@/components/OperadorFormDialog'
import { useAuth } from '@/context/AuthContext'
import { useOperadores } from '@/hooks/useOperadores'
import { extrairMensagemErro } from '@/lib/error'
import { operadorService } from '@/services/operadorService'
import type { OperadorResponseDTO } from '@/types/api'

export function Usuarios() {
  const { operador: operadorLogado } = useAuth()
  const { operadores, carregando, erro, recarregar } = useOperadores()

  const [formAberto, setFormAberto] = useState(false)
  const [operadorEmEdicao, setOperadorEmEdicao] = useState<OperadorResponseDTO | null>(null)
  const [operadorParaInativar, setOperadorParaInativar] = useState<OperadorResponseDTO | null>(null)
  const [inativando, setInativando] = useState(false)

  const ehGerente = operadorLogado?.perfil === 'GERENTE'

  if (!ehGerente) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <ShieldAlert className="size-10 text-muted-foreground" />
        <p className="text-lg font-semibold text-foreground">Acesso restrito</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Somente usuários com permissão de gerente podem cadastrar e gerenciar outros usuários.
        </p>
      </div>
    )
  }

  const handleNovo = () => {
    setOperadorEmEdicao(null)
    setFormAberto(true)
  }

  const handleEditar = (operador: OperadorResponseDTO) => {
    setOperadorEmEdicao(operador)
    setFormAberto(true)
  }

  const handleConfirmarInativacao = async () => {
    if (!operadorParaInativar) return
    setInativando(true)
    try {
      await operadorService.inativar(operadorParaInativar.id)
      toast.success('Usuário desativado com sucesso.')
      setOperadorParaInativar(null)
      recarregar()
    } catch (e) {
      toast.error('Não foi possível desativar o usuário', { description: extrairMensagemErro(e) })
    } finally {
      setInativando(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Usuários</h1>
        <p className="text-sm text-muted-foreground">Cadastre operadores de caixa e gerentes e controle suas permissões.</p>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleNovo}>
          <Plus /> Novo usuário
        </Button>
      </div>

      <DataTable
        colunas={[
          { cabecalho: 'Nome', render: (o: OperadorResponseDTO) => o.nome },
          { cabecalho: 'Login', render: (o: OperadorResponseDTO) => o.login },
          {
            cabecalho: 'Permissão',
            render: (o: OperadorResponseDTO) => (
              <Badge variant={o.perfil === 'GERENTE' ? 'default' : 'outline'}>
                {o.perfil === 'GERENTE' ? 'Gerente' : 'Operador de caixa'}
              </Badge>
            ),
          },
          {
            cabecalho: 'Status',
            render: (o: OperadorResponseDTO) => (
              <Badge variant={o.ativo ? 'success' : 'destructive'}>{o.ativo ? 'Ativo' : 'Inativo'}</Badge>
            ),
          },
          {
            cabecalho: 'Ações',
            className: 'text-right',
            render: (o: OperadorResponseDTO) => (
              <div className="flex justify-end gap-1">
                <Button variant="outline" size="icon" onClick={() => handleEditar(o)}>
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  disabled={!o.ativo || o.id === operadorLogado?.id}
                  onClick={() => setOperadorParaInativar(o)}
                  title={o.id === operadorLogado?.id ? 'Você não pode desativar seu próprio usuário' : 'Desativar'}
                >
                  <UserX className="size-4" />
                </Button>
              </div>
            ),
          },
        ]}
        dados={operadores}
        chave={(o) => o.id}
        carregando={carregando}
        mensagemVazio={erro ?? 'Nenhum usuário cadastrado.'}
      />

      <OperadorFormDialog open={formAberto} onOpenChange={setFormAberto} operador={operadorEmEdicao} onSalvo={recarregar} />

      <ConfirmDeleteDialog
        open={operadorParaInativar !== null}
        onOpenChange={(open) => !open && setOperadorParaInativar(null)}
        titulo="Desativar usuário"
        descricao={`Tem certeza que deseja desativar "${operadorParaInativar?.nome}"? Ele não poderá mais fazer login.`}
        excluindo={inativando}
        onConfirmar={handleConfirmarInativacao}
      />
    </div>
  )
}
