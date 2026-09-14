export type UnidadeMedida = {
  sigla: string
  descricao: string
}

export type StatusVenda = 'FINALIZADA' | 'CANCELADA' | 'PENDENTE'

export type FormaPagamento = 'DINHEIRO' | 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'PIX'

export type PerfilOperador = 'OPERADOR' | 'GERENTE'

export type TipoMovimentacaoEstoque = 'ENTRADA' | 'SAIDA'

export interface EntradaEstoqueRequestDTO {
  quantidade: number
  observacao: string | null
}

export interface MovimentacaoEstoqueResponseDTO {
  id: number
  tipo: TipoMovimentacaoEstoque
  quantidade: number
  dataMovimentacao: string
  observacao: string | null
  vendaId: number | null
  operadorNome: string | null
}

export interface ProdutoResponseDTO {
  id: number
  nome: string
  preco: number
  unidadeMedida: UnidadeMedida
  dataValidade: string
  quantidade: number
  codigoBarra: string
  categoriaId: number | null
  categoriaNome: string | null
}

export interface ProdutoRequestDTO {
  nome: string
  preco: number
  quantidade: number
  dataValidade: string
  unidadeMedida: string
  codigoBarra: string
  categoriaId: number
}

export interface CategoriaResponseDTO {
  id: number
  nome: string
  descricao: string
}

export interface CategoriaRequestDTO {
  nome: string
  descricao: string
}

export interface ItemVendaRequestDTO {
  produtoId: number
  quantidade: number
}

export interface VendaRequestDTO {
  itens: ItemVendaRequestDTO[]
  formaPagamento: FormaPagamento
  desconto: number
  acrescimo: number
  valorRecebido: number | null
  clienteId: number | null
}

export interface ItemVendaResponseDTO {
  produtoId: number
  produtoNome: string
  quantidade: number
  precoUnitario: number
  subtotal: number
}

export interface VendaResponseDTO {
  id: number
  subtotal: number
  desconto: number
  acrescimo: number
  valorTotal: number
  formaPagamento: FormaPagamento | null
  valorRecebido: number | null
  troco: number | null
  clienteId: number | null
  clienteNome: string | null
  atendenteId: number | null
  atendenteNome: string | null
  dataVenda: string
  status: StatusVenda
  itens: ItemVendaResponseDTO[]
}

export interface ClienteRequestDTO {
  nome: string
  documento: string | null
  telefone: string | null
  endereco: string | null
}

export interface ClienteResponseDTO {
  id: number
  nome: string
  documento: string | null
  telefone: string | null
  endereco: string | null
}

export interface ConfiguracaoRequestDTO {
  nomeComercio: string | null
  endereco: string | null
  telefone: string | null
  cnpj: string | null
  ie: string | null
  usarLeitorPadrao: boolean
}

export interface ConfiguracaoResponseDTO {
  nomeComercio: string | null
  endereco: string | null
  telefone: string | null
  cnpj: string | null
  ie: string | null
  usarLeitorPadrao: boolean
}

export interface LoginRequestDTO {
  login: string
  senha: string
}

export interface LoginResponseDTO {
  token: string
  operadorId: number
  nome: string
  perfil: PerfilOperador
}

export interface OperadorRequestDTO {
  nome: string
  login: string
  senha: string
  perfil: PerfilOperador
}

export interface OperadorUpdateRequestDTO {
  nome: string
  perfil: PerfilOperador
  ativo: boolean
}

export interface OperadorResponseDTO {
  id: number
  nome: string
  login: string
  perfil: PerfilOperador
  ativo: boolean
}

export interface TotalPeriodoDTO {
  totalVendido: number
  quantidadeVendas: number
}

export interface ProdutoMaisVendidoDTO {
  produtoId: number
  produtoNome: string
  quantidadeVendida: number
  valorTotal: number
}

export interface TotalPorFormaPagamentoDTO {
  formaPagamento: FormaPagamento
  total: number
}

export interface ErroResposta {
  timestamp: string
  status: number
  erro: string
  mensagem: string
}

export type ErrosValidacao = Record<string, string>
