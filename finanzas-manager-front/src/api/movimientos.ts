import client from './client'
import type { MovimientoMensualResponse, Movimiento, TipoMovimiento } from '../types'


const URL_CONTROL_MENSUAL = '/v1/controlmensual';

export async function fetchMovimientosMensuales(mes: number, anio: number): Promise<MovimientoMensualResponse[]> {
  const { data } = await client.get(URL_CONTROL_MENSUAL + '/movimientosporperiodo', { params: { mes, anio } })
  return data
}

export async function fetchCatalogoMovimientos(): Promise<MovimientoMensualResponse[]> {
  const { data } = await client.get(URL_CONTROL_MENSUAL + '/movimientos')
  return data
}

export async function fetchTiposMovimiento(): Promise<TipoMovimiento[]> {
  const { data } = await client.get(URL_CONTROL_MENSUAL + '/tiposmovimiento')
  return data
}

export async function createMovimientoMensual(payload: {
  idPeriodo: number
  idMovimiento: number
  montoPrevisto?: number
  montoReal?: number
  nroCuota?: number
  totalCuotas?: number
  notas?: string
}): Promise<MovimientoMensualResponse> {
  const { data } = await client.post('/v1/gastosmensuales', payload)
  return data
}

export async function updateMovimientoMensual(
  id: number,
  payload: { montoPrevisto?: number; montoReal?: number; nroCuota?: number; totalCuotas?: number; notas?: string }
): Promise<MovimientoMensualResponse> {
  const { data } = await client.put(`/v1/gastosmensuales/${id}`, payload)
  return data
}

export async function deleteMovimientoMensual(id: number): Promise<void> {
  await client.delete(`/v1/gastosmensuales/${id}`)
}

export async function createMovimiento(payload: {
  idTipoMovimiento: number
  nombre: string
  descripcion?: string
}): Promise<Movimiento> {
  const { data } = await client.post('/v1/movimientos', payload)
  return data
}

export async function updateMovimiento(
  id: number,
  payload: { nombre?: string; idTipoMovimiento?: number; activo?: boolean }
): Promise<Movimiento> {
  const { data } = await client.put(`/v1/movimientos/${id}`, payload)
  return data
}
