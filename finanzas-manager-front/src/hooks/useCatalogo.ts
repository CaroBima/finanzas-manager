import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchCatalogoMovimientos,
  fetchTiposMovimiento,
  createMovimiento,
  updateMovimiento,
} from '../api/movimientos'

export function useCatalogoMovimientos() {
  return useQuery({
    queryKey: ['catalogo'],
    queryFn: fetchCatalogoMovimientos,
  })
}

export function useTiposMovimiento() {
  return useQuery({
    queryKey: ['tiposMovimiento'],
    queryFn: fetchTiposMovimiento,
  })
}

export function useCreateMovimiento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createMovimiento,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalogo'] }),
  })
}

export function useUpdateMovimiento() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Parameters<typeof updateMovimiento>[1] }) =>
      updateMovimiento(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['catalogo'] }),
  })
}
