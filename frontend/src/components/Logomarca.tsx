import { Tractor } from 'lucide-react'

import { cn } from '@/lib/utils'

export function Logomarca({ compacta = false }: { compacta?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary text-primary-foreground shadow-sm',
          compacta ? 'size-8' : 'size-11',
        )}
      >
        <Tractor className={compacta ? 'size-4' : 'size-6'} />
      </div>
      <div className="leading-none">
        <p className={cn('font-extrabold tracking-tight text-foreground', compacta ? 'text-sm' : 'text-lg')}>
          PONTO<span className="text-secondary"> DO AGRO</span>
        </p>
        {!compacta && (
          <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">Marília · SP</p>
        )}
      </div>
    </div>
  )
}
