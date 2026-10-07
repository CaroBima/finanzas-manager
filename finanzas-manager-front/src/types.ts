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

export interface PeriodoResponse {
  mes: number
  anio: number
}

export interface TipoMovimientoResponse {
  nombre: string
  naturaleza: Naturaleza
}

export interface MovimientoResponse {
  nombre: string
  descripcion?: string
  activo: boolean
  tipoMov: TipoMovimientoResponse
}

export interface MovimientoMensualResponse {
  montoPrevisto: number
  montoReal: number
  nroCuota: number
  TotalCuotas: number
  notas?: string
  periodoResponse: PeriodoResponse
  movimientoResponse: MovimientoResponse
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
