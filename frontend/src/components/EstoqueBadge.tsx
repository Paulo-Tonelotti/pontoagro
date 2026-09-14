import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { statusEstoque } from '@/lib/estoque'

export function EstoqueBadge({ quantidade }: { quantidade: number }) {
  const status = statusEstoque(quantidade)

  if (status === 'zerado') {
    return (
      <Badge variant="destructive">
        <XCircle /> Esgotado
      </Badge>
    )
  }

  if (status === 'baixo') {
    return (
      <Badge variant="warning">
        <AlertTriangle /> Estoque baixo · {quantidade}
      </Badge>
    )
  }

  return (
    <Badge variant="success">
      <CheckCircle2 /> Disponível · {quantidade}
    </Badge>
  )
}
