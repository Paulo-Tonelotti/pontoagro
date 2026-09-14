import { FolderOpen, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import type { CategoriaResponseDTO } from '@/types/api'

interface CategoriaTableProps {
  categorias: CategoriaResponseDTO[]
  carregando: boolean
  erro: string | null
  onTentarNovamente: () => void
  onNovaCategoria: () => void
  onEditar: (categoria: CategoriaResponseDTO) => void
  onExcluir: (categoria: CategoriaResponseDTO) => void
}

export function CategoriaTable({
  categorias,
  carregando,
  erro,
  onTentarNovamente,
  onNovaCategoria,
  onEditar,
  onExcluir,
}: CategoriaTableProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Categorias</h2>
          <p className="text-sm text-muted-foreground">Organize os produtos por categoria.</p>
        </div>
        <Button onClick={onNovaCategoria}>
          <Plus /> Nova categoria
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carregando && (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 3 }).map((__, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full max-w-48" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            )}

            {!carregando && erro && (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm text-destructive">{erro}</p>
                    <Button variant="outline" size="sm" onClick={onTentarNovamente}>
                      <RefreshCw /> Tentar novamente
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!carregando && !erro && categorias.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="py-10 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <FolderOpen className="size-8" />
                    <p className="text-sm">Nenhuma categoria cadastrada.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {!carregando &&
              !erro &&
              categorias.map((categoria) => (
                <TableRow key={categoria.id}>
                  <TableCell className="font-medium">{categoria.nome}</TableCell>
                  <TableCell className="max-w-md text-muted-foreground whitespace-normal">
                    {categoria.descricao}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="outline" size="icon" onClick={() => onEditar(categoria)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => onExcluir(categoria)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
