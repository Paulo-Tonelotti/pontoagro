import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

import { estaVencido, statusEstoque } from '@/lib/estoque'
import { formatarData, formatarMoeda } from '@/lib/format'
import type { ConfiguracaoResponseDTO, ProdutoResponseDTO } from '@/types/api'

const COR_PRIMARIA: [number, number, number] = [21, 61, 46]
const COR_FUNDO_CATEGORIA: [number, number, number] = [230, 229, 216]
const COR_FUNDO_CARD: [number, number, number] = [245, 242, 232]
const COR_LISTRA: [number, number, number] = [250, 248, 240]
const COR_TEXTO_MUTED: [number, number, number] = [110, 108, 98]

const COR_STATUS: Record<string, [number, number, number]> = {
  Disponível: [39, 98, 60],
  'Estoque baixo': [163, 110, 12],
  Esgotado: [176, 38, 38],
  Vencido: [176, 38, 38],
}

function rotuloStatus(produto: ProdutoResponseDTO): string {
  if (estaVencido(produto.dataValidade)) return 'Vencido'
  const status = statusEstoque(produto.quantidade)
  if (status === 'zerado') return 'Esgotado'
  if (status === 'baixo') return 'Estoque baixo'
  return 'Disponível'
}

interface GerarRelatorioInventarioParams {
  produtos: ProdutoResponseDTO[]
  configuracao: ConfiguracaoResponseDTO | null
  operadorNome: string
}

export function gerarRelatorioInventarioPdf({ produtos, configuracao, operadorNome }: GerarRelatorioInventarioParams) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const largura = doc.internal.pageSize.getWidth()
  const altura = doc.internal.pageSize.getHeight()
  const margem = 40

  doc.setFillColor(...COR_PRIMARIA)
  doc.rect(0, 0, largura, 72, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.text(configuracao?.nomeComercio || 'Ponto do Agro', margem, 30)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const infoComercio = [
    configuracao?.endereco,
    configuracao?.telefone ? `Tel: ${configuracao.telefone}` : null,
    configuracao?.cnpj ? `CNPJ: ${configuracao.cnpj}` : null,
    configuracao?.ie ? `IE: ${configuracao.ie}` : null,
  ]
    .filter(Boolean)
    .join('   ·   ')
  doc.text(infoComercio || ' ', margem, 46, { maxWidth: largura - margem * 2 - 200 })

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Relatório de Inventário de Estoque', largura - margem, 28, { align: 'right' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text(`Gerado em ${new Date().toLocaleString('pt-BR')}`, largura - margem, 44, { align: 'right' })
  doc.text(`Responsável: ${operadorNome}`, largura - margem, 58, { align: 'right' })

  let y = 96

  const totalProdutos = produtos.length
  const disponiveis = produtos.filter((p) => statusEstoque(p.quantidade) !== 'zerado').length
  const esgotados = produtos.filter((p) => statusEstoque(p.quantidade) === 'zerado').length
  const vencidos = produtos.filter((p) => estaVencido(p.dataValidade)).length
  const valorTotalEstoque = produtos.reduce((soma, p) => soma + p.preco * p.quantidade, 0)

  const cards = [
    { rotulo: 'Produtos cadastrados', valor: String(totalProdutos) },
    { rotulo: 'Disponíveis', valor: String(disponiveis) },
    { rotulo: 'Esgotados', valor: String(esgotados) },
    { rotulo: 'Fora da validade', valor: String(vencidos) },
    { rotulo: 'Valor total em estoque', valor: formatarMoeda(valorTotalEstoque) },
  ]

  const espacamentoCard = 8
  const larguraCard = (largura - margem * 2 - espacamentoCard * (cards.length - 1)) / cards.length
  const alturaCard = 48

  cards.forEach((card, i) => {
    const x = margem + i * (larguraCard + espacamentoCard)
    doc.setFillColor(...COR_FUNDO_CARD)
    doc.roundedRect(x, y, larguraCard, alturaCard, 4, 4, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(...COR_TEXTO_MUTED)
    doc.text(card.rotulo, x + 8, y + 16, { maxWidth: larguraCard - 16 })

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(...COR_PRIMARIA)
    doc.text(card.valor, x + 8, y + 36, { maxWidth: larguraCard - 16 })
  })

  y += alturaCard + 20

  const porCategoria = new Map<string, ProdutoResponseDTO[]>()
  for (const produto of produtos) {
    const chave = produto.categoriaNome ?? 'Sem categoria'
    if (!porCategoria.has(chave)) porCategoria.set(chave, [])
    porCategoria.get(chave)!.push(produto)
  }

  const categoriasOrdenadas = [...porCategoria.keys()].sort((a, b) => a.localeCompare(b))

  const corpo: unknown[][] = []
  for (const categoria of categoriasOrdenadas) {
    const itens = [...porCategoria.get(categoria)!].sort((a, b) => a.nome.localeCompare(b.nome))

    corpo.push([
      {
        content: `${categoria}  (${itens.length} produto${itens.length === 1 ? '' : 's'})`,
        colSpan: 8,
        styles: { fillColor: COR_FUNDO_CATEGORIA, textColor: COR_PRIMARIA, fontStyle: 'bold' },
      },
    ])

    let subtotalQuantidade = 0
    let subtotalValor = 0

    for (const produto of itens) {
      const valorEmEstoque = produto.preco * produto.quantidade
      subtotalQuantidade += produto.quantidade
      subtotalValor += valorEmEstoque

      corpo.push([
        produto.codigoBarra,
        produto.nome,
        produto.unidadeMedida.sigla,
        formatarData(produto.dataValidade),
        String(produto.quantidade),
        formatarMoeda(produto.preco),
        formatarMoeda(valorEmEstoque),
        rotuloStatus(produto),
      ])
    }

    corpo.push([
      { content: `Subtotal · ${categoria}`, colSpan: 4, styles: { fontStyle: 'bold', halign: 'right' } },
      { content: String(subtotalQuantidade), styles: { fontStyle: 'bold' } },
      '',
      { content: formatarMoeda(subtotalValor), styles: { fontStyle: 'bold' } },
      '',
    ])
  }

  autoTable(doc, {
    startY: y,
    head: [['Código de Barras', 'Produto', 'Un.', 'Validade', 'Qtd', 'Preço Unit.', 'Valor em Estoque', 'Status']],
    body: corpo as never,
    margin: { left: margem, right: margem, bottom: 50 },
    styles: { fontSize: 8, cellPadding: 5, textColor: [40, 40, 40] },
    headStyles: { fillColor: COR_PRIMARIA, textColor: 255, fontStyle: 'bold', fontSize: 8.5 },
    alternateRowStyles: { fillColor: COR_LISTRA },
    columnStyles: {
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 7 && typeof data.cell.raw === 'string') {
        const cor = COR_STATUS[data.cell.raw]
        if (cor) data.cell.styles.textColor = cor
        data.cell.styles.fontStyle = 'bold'
      }
    },
  })

  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(...COR_PRIMARIA)
  doc.text(`Valor total do inventário: ${formatarMoeda(valorTotalEstoque)}`, margem, finalY)

  const totalPaginas = doc.getNumberOfPages()
  for (let pagina = 1; pagina <= totalPaginas; pagina++) {
    doc.setPage(pagina)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(...COR_TEXTO_MUTED)
    doc.text('Ponto do Agro · Relatório gerado pelo sistema', margem, altura - 20)
    doc.text(`Página ${pagina} de ${totalPaginas}`, largura - margem, altura - 20, { align: 'right' })
  }

  doc.save(`relatorio-inventario-${new Date().toISOString().slice(0, 10)}.pdf`)
}
