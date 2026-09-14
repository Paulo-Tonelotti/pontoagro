import { BotaoAcao } from '@/components/BotaoAcao'

interface BarraInferiorProps {
  temItemSelecionado: boolean
  temItens: boolean
  enviando: boolean
  onNovo: () => void
  onAlterar: () => void
  onExcluir: () => void
  onCancelar: () => void
  onConsulta: () => void
  onCliente: () => void
  onCupom: () => void
  onMensagem: () => void
  onLancar: () => void
  onFinalizar: () => void
}

export function BarraInferior({
  temItemSelecionado,
  temItens,
  enviando,
  onNovo,
  onAlterar,
  onExcluir,
  onCancelar,
  onConsulta,
  onCliente,
  onCupom,
  onMensagem,
  onLancar,
  onFinalizar,
}: BarraInferiorProps) {
  return (
    <div className="flex shrink-0 border-t bg-primary">
      <BotaoAcao atalho="F2" onClick={onNovo}>
        Novo
      </BotaoAcao>
      <BotaoAcao onClick={onAlterar} disabled={!temItemSelecionado}>
        Alterar
      </BotaoAcao>
      <BotaoAcao onClick={onExcluir} disabled={!temItemSelecionado}>
        Excluir
      </BotaoAcao>
      <BotaoAcao atalho="F8" destaque="perigo" onClick={onCancelar} disabled={!temItens}>
        Cancelar
      </BotaoAcao>
      <BotaoAcao onClick={onConsulta}>Consulta</BotaoAcao>
      <BotaoAcao atalho="F4" onClick={onCliente}>
        Cliente
      </BotaoAcao>
      <BotaoAcao onClick={onCupom}>Cupom</BotaoAcao>
      <BotaoAcao onClick={onMensagem}>Mensagem</BotaoAcao>
      <BotaoAcao onClick={onLancar}>Lançar</BotaoAcao>
      <BotaoAcao atalho="F9" destaque="primario" onClick={onFinalizar} disabled={!temItens || enviando}>
        {enviando ? 'Finalizando...' : 'Finalizar'}
      </BotaoAcao>
    </div>
  )
}
