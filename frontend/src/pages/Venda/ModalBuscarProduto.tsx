import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'

import { EstoqueBadge } from '@/components/EstoqueBadge'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/Modal'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatarMoeda } from '@/lib/format'
import type { ProdutoResponseDTO } from '@/types/api'

interface ModalBuscarProdutoProps {
  aberto: boolean
  onFechar: () => void
  produtos: ProdutoResponseDTO[]
  onAdicionar: (produto: ProdutoResponseDTO, quantidade: number) => void
}

export function ModalBuscarProduto({ aberto, onFechar, produtos, onAdicionar }: ModalBuscarProdutoProps) {
  const [busca, setBusca] = useState('')
  const [quantidades, setQuantidades] = useState<Record<number, string>>({})

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return produtos
    return produtos.filter((p) => p.nome.toLowerCase().includes(termo) || p.codigoBarra.includes(termo))
  }, [produtos, busca])

  const quantidadeDe = (produtoId: number) => Number(quantidades[produtoId] ?? '1') || 1

  const handleAdicionar = (produto: ProdutoResponseDTO) => {
    onAdicionar(produto, quantidadeDe(produto.id))
    setQuantidades((atual) => ({ ...atual, [produto.id]: '1' }))
  }

  return (
    <Modal
      aberto={aberto}
      onFechar={onFechar}
      titulo="Buscar produto"
      descricao="Pesquise por nome ou código e adicione direto no cupom, sem precisar do leitor."
      className="max-w-3xl"
    >
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Digite o nome ou código do produto..."
          className="pl-9"
        />
      </div>

      <div className="max-h-96 overflow-y-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produto</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="w-24">Qtd</TableHead>
              <TableHead className="text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtrados.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  Nenhum produto encontrado.
                </TableCell>
              </TableRow>
            )}
            {filtrados.map((produto) => {
              const esgotado = produto.quantidade <= 0
              return (
                <TableRow key={produto.id}>
                  <TableCell className="max-w-56 truncate whitespace-normal font-medium">{produto.nome}</TableCell>
                  <TableCell>{formatarMoeda(produto.preco)}</TableCell>
                  <TableCell>
                    <EstoqueBadge quantidade={produto.quantidade} />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="1"
                      max={produto.quantidade || undefined}
                      disabled={esgotado}
                      value={quantidades[produto.id] ?? '1'}
                      onChange={(e) => setQuantidades((atual) => ({ ...atual, [produto.id]: e.target.value }))}
                      className="h-8 w-20"
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" disabled={esgotado} onClick={() => handleAdicionar(produto)}>
                      <Plus /> Adicionar
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Modal>
  )
}
