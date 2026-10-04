import client from './client'
import type { Escenario, EscenarioDetalle } from '../types'

export async function fetchEscenariosByPeriodo(idPeriodo: number): Promise<Escenario[]> {
  const { data } = await client.get('/v1/escenarios', { params: { idPeriodo } })
  return data
}

export async function fetchEscenarioDetalle(idEscenario: number): Promise<EscenarioDetalle[]> {
  const { data } = await client.get(`/v1/escenarios/${idEscenario}/detalle`)
  return data
}

export async function createEscenario(payload: {
  idPeriodo: number
  nombre: string
  descripcion?: string
}): Promise<Escenario> {
  const { data } = await client.post('/v1/escenarios', payload)
  return data
}

export async function deleteEscenario(id: number): Promise<void> {
  await client.delete(`/v1/escenarios/${id}`)
}

export async function addMovimientoToEscenario(
  idEscenario: number,
  payload: { idMovimiento: number; monto: number }
): Promise<EscenarioDetalle> {
  const { data } = await client.post(`/v1/escenarios/${idEscenario}/detalle`, payload)
  return data
}

export async function removeMovimientoFromEscenario(
  idEscenario: number,
  idDetalle: number
): Promise<void> {
  await client.delete(`/v1/escenarios/${idEscenario}/detalle/${idDetalle}`)
}
