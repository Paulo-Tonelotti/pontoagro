import type { ReactNode } from 'react'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ModalProps {
  aberto: boolean
  onFechar: () => void
  titulo: string
  descricao?: string
  children: ReactNode
  className?: string
}

export function Modal({ aberto, onFechar, titulo, descricao, children, className }: ModalProps) {
  return (
    <Dialog open={aberto} onOpenChange={(open) => !open && onFechar()}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{titulo}</DialogTitle>
          {descricao && <DialogDescription>{descricao}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
