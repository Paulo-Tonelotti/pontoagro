import { useEffect, useMemo, useState } from 'react'

export function usePaginacao<T>(itens: T[], tamanhoPagina: number) {
  const [pagina, setPagina] = useState(1)

  const totalPaginas = Math.max(1, Math.ceil(itens.length / tamanhoPagina))

  useEffect(() => {
    if (pagina > totalPaginas) setPagina(1)
  }, [totalPaginas, pagina])

  const itensPagina = useMemo(() => {
    const inicio = (pagina - 1) * tamanhoPagina
    return itens.slice(inicio, inicio + tamanhoPagina)
  }, [itens, pagina, tamanhoPagina])

  return { pagina, setPagina, totalPaginas, itensPagina }
}
