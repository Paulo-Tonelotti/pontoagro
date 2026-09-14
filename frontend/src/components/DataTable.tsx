import type { ReactNode } from 'react'
import { Inbox } from 'lucide-react'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export interface ColunaDataTable<T> {
  cabecalho: string
  render: (item: T) => ReactNode
  className?: string
}

interface DataTableProps<T> {
  colunas: ColunaDataTable<T>[]
  dados: T[]
  chave: (item: T) => string | number
  carregando?: boolean
  mensagemVazio?: string
  onRowClick?: (item: T) => void
}

export function DataTable<T>({
  colunas,
  dados,
  chave,
  carregando = false,
  mensagemVazio = 'Nenhum registro encontrado.',
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {colunas.map((coluna) => (
              <TableHead key={coluna.cabecalho} className={coluna.className}>
                {coluna.cabecalho}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {carregando &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {colunas.map((coluna) => (
                  <TableCell key={coluna.cabecalho}>
                    <Skeleton className="h-5 w-full max-w-32" />
                  </TableCell>
                ))}
              </TableRow>
            ))}

          {!carregando && dados.length === 0 && (
            <TableRow>
              <TableCell colSpan={colunas.length} className="py-10 text-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Inbox className="size-8" />
                  <p className="text-sm">{mensagemVazio}</p>
                </div>
              </TableCell>
            </TableRow>
          )}

          {!carregando &&
            dados.map((item) => (
              <TableRow
                key={chave(item)}
                onClick={() => onRowClick?.(item)}
                className={onRowClick ? 'cursor-pointer' : undefined}
              >
                {colunas.map((coluna) => (
                  <TableCell key={coluna.cabecalho} className={coluna.className}>
                    {coluna.render(item)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
