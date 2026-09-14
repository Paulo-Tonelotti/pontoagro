import { Tractor } from 'lucide-react'

export function Logomarca() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary text-primary-foreground shadow-sm">
        <Tractor className="size-6" />
      </div>
      <div className="leading-none">
        <p className="text-lg font-extrabold tracking-tight text-foreground">
          PONTO<span className="text-secondary"> DO AGRO</span>
        </p>
        <p className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">Marília · SP</p>
      </div>
    </div>
  )
}
