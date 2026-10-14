import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchMovimientosMensuales,
  fetchUltimosTresMeses,
  createMovimientoMensual,
  updateMovimientoMensual,
  deleteMovimientoMensual,
} from '../api/movimientos'

export function useMovimientosMensuales(mes: number, anio: number, periodoSeleccionado: boolean) {
  return useQuery({
    queryKey: periodoSeleccionado ? ['movimientosMensuales', mes, anio] : ['ultimosTresMeses'],
    queryFn: () => periodoSeleccionado ? fetchMovimientosMensuales(mes, anio) : fetchUltimosTresMeses(),
  })
}

export function useCreateMovimientoMensual(mes: number, anio: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMovimientoMensual,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['movimientosMensuales', mes, anio] }),
  })
}

export function useUpdateMovimientoMensual(mes: number, anio: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof updateMovimientoMensual>[1] }) =>
      updateMovimientoMensual(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['movimientosMensuales', mes, anio] }),
  })
}

export function useDeleteMovimientoMensual(mes: number, anio: number) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMovimientoMensual,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['movimientosMensuales', mes, anio] }),
  })
}
