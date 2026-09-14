import { useEffect } from 'react'

export function useAtalhoTeclado(tecla: string, handler: () => void, ativo = true) {
  useEffect(() => {
    if (!ativo) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === tecla) {
        e.preventDefault()
        handler()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [tecla, handler, ativo])
}
