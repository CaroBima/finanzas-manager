import client from './client'
import type { MovimientoMensualResponse, MovimientoPorPeriodoResponse, Movimiento, TipoMovimiento, MovimientoResponse, TipoMovimientoResponse } from '../types'


const URL_CONTROL_MENSUAL = '/v1/controlmensual';

export async function fetchMovimientosMensuales(mes: number, anio: number): Promise<MovimientoPorPeriodoResponse[]> {
  const { data } = await client.get(URL_CONTROL_MENSUAL + '/movimientosporperiodo', { params: { mes, anio } })
  return data
}

export async function fetchUltimosTresMeses(): Promise<MovimientoPorPeriodoResponse[]> {
  const { data } = await client.get(URL_CONTROL_MENSUAL + '/ultimostresmeses')
  return data
}

export async function fetchCatalogoMovimientos(): Promise<MovimientoMensualResponse[]> {
  const { data } = await client.get(URL_CONTROL_MENSUAL + '/movimientos')
  return data
}

export async function fetchTiposMovimiento(): Promise<TipoMovimiento[]> {
  const { data } = await client.get('/v1/tipomovimiento/tiposmovimientos')
  return data
}

export async function fetchMovimientos(): Promise<MovimientoResponse[]> {
  const { data } = await client.get('/v1/movimiento/movimientos')
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
  nombre: string
  descripcion?: string
  activo?: boolean
  tipoMov: { idTipoMovimiento: number; nombre: string; naturaleza: string }
}): Promise<MovimientoResponse> {
  const { data } = await client.post('/v1/movimiento/alta', payload)
  return data
}

export async function updateMovimiento(
  id: number,
  payload: { nombre?: string; idTipoMovimiento?: number; activo?: boolean }
): Promise<Movimiento> {
  const { data } = await client.put(`/v1/movimientos/${id}`, payload)
  return data
}


export async function createNuevoMovimiento(payload: {
  nombreMovimiento: string
  descripcionMovimiento?: string
  montoPrevisto: number
  montoReal?: number
  montoSimulado?: number
  nroCuota?: number
  totalCuotas?: number
  notas?: string
  tipoMovimiento: string
  naturaleza: string
  mes: number
  anio: number
}): Promise<MovimientoMensualResponse> {
  const { data } = await client.post(`${URL_CONTROL_MENSUAL}/movimientos/nuevo`, payload)
  return data
}

export async function createTipoMovimiento(payload: {
  nombre: string
  naturaleza: 'I' | 'E'
}): Promise<TipoMovimientoResponse> {
  const { data } = await client.post('/v1/tipomovimiento/alta', payload)
  return data
}
