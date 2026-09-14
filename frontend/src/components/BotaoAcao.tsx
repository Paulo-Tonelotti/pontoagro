import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

interface BotaoAcaoProps extends ComponentProps<'button'> {
  atalho?: string
  destaque?: 'normal' | 'perigo' | 'primario'
}

export function BotaoAcao({ atalho, destaque = 'normal', className, children, ...props }: BotaoAcaoProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-14 flex-1 flex-col items-center justify-center gap-0.5 border-r border-black/10 px-1 text-sm font-semibold transition-colors last:border-r-0 disabled:cursor-not-allowed disabled:opacity-40',
        destaque === 'normal' && 'bg-primary text-primary-foreground hover:bg-primary/90',
        destaque === 'perigo' && 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        destaque === 'primario' && 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {atalho && <span className="text-[10px] font-normal opacity-75">{atalho}</span>}
    </button>
  )
}
