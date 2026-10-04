import client from './client'
import type { Periodo } from '../types'

export async function fetchPeriodo(mes: number, anio: number): Promise<Periodo> {
  const { data } = await client.get('/v1/periodos', { params: { mes, anio } })
  return data
}
