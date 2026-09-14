import { useMemo, useState } from 'react'
import {
  CalendarX2,
  ChevronLeft,
  ChevronRight,
  History,
  PackagePlus,
  PackageSearch,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { EstoqueBadge } from '@/components/EstoqueBadge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { usePaginacao } from '@/hooks/usePaginacao'
import { estaVencido, statusEstoque, type FiltroEstoque } from '@/lib/estoque'
import { formatarData, formatarMoeda } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ProdutoResponseDTO } from '@/types/api'

const ITENS_POR_PAGINA = 8

interface EstoqueProdutoTableProps {
  produtos: ProdutoResponseDTO[]
  carregando: boolean
  erro: string | null
  onTentarNovamente: () => void
  onNovoProduto: () => void
  onEditar: (produto: ProdutoResponseDTO) => void
  onExcluir: (produto: ProdutoResponseDTO) => void
  onEntradaEstoque: (produto: ProdutoResponseDTO) => void
  onVerHistorico: (produto: ProdutoResponseDTO) => void
}

const FILTROS: { valor: FiltroEstoque; rotulo: string }[] = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'disponivel', rotulo: 'Disponíveis' },
  { valor: 'esgotado', rotulo: 'Esgotados' },
  { valor: 'vencido', rotulo: 'Fora da validade' },
]

export function EstoqueProdutoTable({
  produtos,
  carregando,
  erro,
  onTentarNovamente,
  onNovoProduto,
  onEditar,
  onExcluir,
  onEntradaEstoque,
  onVerHistorico,
}: EstoqueProdutoTableProps) {
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<FiltroEstoque>('todos')

  const contagens = useMemo(
    () => ({
      todos: produtos.length,
      disponivel: produtos.filter((p) => statusEstoque(p.quantidade) !== 'zerado').length,
      esgotado: produtos.filter((p) => statusEstoque(p.quantidade) === 'zerado').length,
      vencido: produtos.filter((p) => estaVencido(p.dataValidade)).length,
    }),
    [produtos],
  )

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return produtos.filter((p) => {
      const combinaBusca =
        !termo ||
        p.nome.toLowerCase().includes(termo) ||
        p.codigoBarra.toLowerCase().includes(termo) ||
        (p.categoriaNome ?? '').toLowerCase().includes(termo)

      if (!combinaBusca) return false

      if (filtro === 'disponivel') return statusEstoque(p.quantidade) !== 'zerado'
      if (filtro === 'esgotado') return statusEstoque(p.quantidade) === 'zerado'
      if (filtro === 'vencido') return estaVencido(p.dataValidade)
      return true
    })
  }, [produtos, busca, filtro])

  const { pagina, setPagina, totalPaginas, itensPagina } = usePaginacao(produtosFiltrados, ITENS_POR_PAGINA)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, código de barras ou categoria..."
            className="pl-9"
          />
        </div>
        <Button onClick={onNovoProduto}>
          <Plus /> Novo produto
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.valor}
            type="button"
            onClick={() => setFiltro(f.valor)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
              filtro === f.valor
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:bg-accent',
            )}
          >
            {f.rotulo} <span className="opacity-75">({contagens[f.valor]})</span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carregando && (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full max-w-32" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            )}

            {!carregando && erro && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-destructive">{erro}</p>
                    <Button variant="outline" size="sm" onClick={onTentarNovamente}>
                      <RefreshCw /> Tentar novamente
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!carregando && !erro && itensPagina.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <PackageSearch className="size-8" />
                    <p className="text-sm">Nenhum produto encontrado.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!carregando &&
              !erro &&
              itensPagina.map((produto) => {
                const vencido = estaVencido(produto.dataValidade)
                return (
                  <TableRow key={produto.id}>
                    <TableCell className="max-w-56 truncate font-medium whitespace-normal">{produto.nome}</TableCell>
                    <TableCell>
                      {produto.categoriaNome ? (
                        <Badge variant="outline">{produto.categoriaNome}</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>{formatarMoeda(produto.preco)}</TableCell>
                    <TableCell className="text-muted-foreground">{produto.unidadeMedida.descricao}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className={cn('text-muted-foreground', vencido && 'text-destructive')}>
                          {formatarData(produto.dataValidade)}
                        </span>
                        {vencido && (
                          <Badge variant="destructive" className="w-fit">
                            <CalendarX2 /> Vencido
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <EstoqueBadge quantidade={produto.quantidade} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="icon" onClick={() => onEntradaEstoque(produto)} title="Entrada de estoque">
                          <PackagePlus className="size-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => onVerHistorico(produto)} title="Histórico de estoque">
                          <History className="size-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => onEditar(produto)} title="Editar">
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => onExcluir(produto)}
                          title="Excluir"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </div>

      {!carregando && !erro && produtosFiltrados.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Página {pagina} de {totalPaginas} · {produtosFiltrados.length} produto(s)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={pagina <= 1}
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={pagina >= totalPaginas}
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
