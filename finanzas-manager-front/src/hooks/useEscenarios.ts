import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchEscenariosByPeriodo,
  fetchEscenarioDetalle,
  createEscenario,
  deleteEscenario,
  addMovimientoToEscenario,
  removeMovimientoFromEscenario,
} from '../api/escenarios'

export function useEscenarios(idPeriodo: number | undefined) {
  return useQuery({
    queryKey: ['escenarios', idPeriodo],
    queryFn: () => fetchEscenariosByPeriodo(idPeriodo!),
    enabled: !!idPeriodo,
  })
}

export function useEscenarioDetalle(idEscenario: number | undefined) {
  return useQuery({
    queryKey: ['escenarioDetalle', idEscenario],
    queryFn: () => fetchEscenarioDetalle(idEscenario!),
    enabled: !!idEscenario,
  })
}

export function useCreateEscenario(idPeriodo: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createEscenario,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['escenarios', idPeriodo] }),
  })
}

export function useDeleteEscenario(idPeriodo: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteEscenario,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['escenarios', idPeriodo] }),
  })
}

export function useAddMovimientoToEscenario(idEscenario: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ idMovimiento, monto }: { idMovimiento: number; monto: number }) =>
      addMovimientoToEscenario(idEscenario!, { idMovimiento, monto }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['escenarioDetalle', idEscenario] }),
  })
}

export function useRemoveMovimientoFromEscenario(idEscenario: number | undefined) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (idDetalle: number) => removeMovimientoFromEscenario(idEscenario!, idDetalle),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['escenarioDetalle', idEscenario] }),
  })
}
