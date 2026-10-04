import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export function usePeriodo() {
  const [searchParams, setSearchParams] = useSearchParams()
  const now = new Date()

  const mes = Number(searchParams.get('mes')) || now.getMonth() + 1
  const anio = Number(searchParams.get('anio')) || now.getFullYear()

  const setPeriodo = (newMes: number, newAnio: number) => {
    setSearchParams({ mes: String(newMes), anio: String(newAnio) }, { replace: true })
  }

  const anterior = useMemo(
    () => (mes === 1 ? { mes: 12, anio: anio - 1 } : { mes: mes - 1, anio }),
    [mes, anio]
  )

  const siguiente = useMemo(
    () => (mes === 12 ? { mes: 1, anio: anio + 1 } : { mes: mes + 1, anio }),
    [mes, anio]
  )

  return { mes, anio, setPeriodo, anterior, siguiente }
}
