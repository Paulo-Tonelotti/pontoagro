export type UnidadeMedida = {
  sigla: string
  descricao: string
}

export type StatusVenda = 'FINALIZADA' | 'CANCELADA' | 'PENDENTE'

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
  valorTotal: number
  dataVenda: string
  status: StatusVenda
  itens: ItemVendaResponseDTO[]
}

export interface ErroResposta {
  timestamp: string
  status: number
  erro: string
  mensagem: string
}

export type ErrosValidacao = Record<string, string>
