export type Naturaleza = 'I' | 'E'

export interface TipoMovimiento {
  idTipoMovimiento: number
  nombre: string
  naturaleza: Naturaleza
}

export interface Movimiento {
  idMovimiento: number
  idTipoMovimiento: number
  tipoMovimiento?: TipoMovimiento
  nombre: string
  descripcion?: string
  activo: boolean
}

export interface Periodo {
  idPeriodo: number
  anio: number
  mes: number
}

export interface MovimientoMensualResponse {
  idMovimientoMensual: number
  periodo: Periodo
  movimiento: Movimiento
  montoPrevisto: number
  montoReal: number
  nroCuota?: number
  totalCuotas?: number
  notas?: string
}

export interface Escenario {
  idEscenario: number
  idPeriodo: number
  nombre: string
  descripcion?: string
}

export interface EscenarioDetalle {
  idEscenarioDetalle: number
  idEscenario: number
  movimiento: Movimiento
  monto: number
}
