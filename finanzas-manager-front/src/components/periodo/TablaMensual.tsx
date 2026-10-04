import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import type { EscenarioDetalle, MovimientoMensualResponse, Naturaleza } from '../../types'
import { MoneyCell } from '../common/MoneyCell'

interface TablaMensualProps {
  movimientos: MovimientoMensualResponse[]
  escenarioDetalle?: EscenarioDetalle[]
}

function labelConCuotas(row: MovimientoMensualResponse): string {
  if (row.nroCuota && row.totalCuotas) {
    return `${row.movimiento.nombre} (${row.nroCuota}/${row.totalCuotas})`
  }
  return row.movimiento.nombre
}

function FilaTotales({
  label,
  previsto,
  real,
  escenario,
  mostrarEscenario,
  bold,
}: {
  label: string
  previsto: number
  real: number
  escenario: number
  mostrarEscenario: boolean
  bold?: boolean
}) {
  const sx = bold ? { fontWeight: 700, bgcolor: 'action.hover' } : { fontWeight: 600, bgcolor: 'grey.100' }
  return (
    <TableRow>
      <TableCell sx={sx}>{label}</TableCell>
      <TableCell align="right" sx={sx}>
        <MoneyCell amount={previsto} />
      </TableCell>
      <TableCell align="right" sx={sx}>
        <MoneyCell amount={real} />
      </TableCell>
      {mostrarEscenario && (
        <TableCell align="right" sx={sx}>
          <MoneyCell amount={escenario} />
        </TableCell>
      )}
    </TableRow>
  )
}

function SeccionMovimientos({
  titulo,
  filas,
  escenarioMap,
  mostrarEscenario,
  naturaleza,
  labelTotal,
}: {
  titulo: string
  filas: MovimientoMensualResponse[]
  escenarioMap: Map<number, number>
  mostrarEscenario: boolean
  naturaleza: Naturaleza
  labelTotal: string
}) {
  const colSpan = mostrarEscenario ? 4 : 3

  const totalPrevisto = filas.reduce((s, f) => s + (f.montoPrevisto ?? 0), 0)
  const totalReal = filas.reduce((s, f) => s + (f.montoReal ?? 0), 0)
  const totalEscenario = filas.reduce(
    (s, f) => s + (escenarioMap.get(f.movimiento.idMovimiento) ?? 0),
    0
  )

  return (
    <>
      <TableRow>
        <TableCell colSpan={colSpan} sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', fontWeight: 700 }}>
          {titulo}
        </TableCell>
      </TableRow>
      {filas.map((row) => (
        <TableRow key={row.idMovimientoMensual} hover>
          <TableCell>{labelConCuotas(row)}</TableCell>
          <TableCell align="right">
            <MoneyCell amount={row.montoPrevisto} naturaleza={naturaleza} />
          </TableCell>
          <TableCell align="right">
            <MoneyCell amount={row.montoReal} naturaleza={naturaleza} />
          </TableCell>
          {mostrarEscenario && (
            <TableCell align="right">
              <MoneyCell amount={escenarioMap.get(row.movimiento.idMovimiento)} naturaleza={naturaleza} />
            </TableCell>
          )}
        </TableRow>
      ))}
      <FilaTotales
        label={labelTotal}
        previsto={naturaleza === 'E' ? -totalPrevisto : totalPrevisto}
        real={naturaleza === 'E' ? -totalReal : totalReal}
        escenario={naturaleza === 'E' ? -totalEscenario : totalEscenario}
        mostrarEscenario={mostrarEscenario}
      />
    </>
  )
}

export function TablaMensual({ movimientos, escenarioDetalle }: TablaMensualProps) {
  if (movimientos.length === 0) {
    return (
      <Box p={6} textAlign="center">
        <Typography color="text.secondary">No hay movimientos para este período.</Typography>
      </Box>
    )
  }

  const gastos = movimientos.filter((m) => m.movimiento.tipoMovimiento?.naturaleza === 'E')
  const ingresos = movimientos.filter((m) => m.movimiento.tipoMovimiento?.naturaleza === 'I')

  const mostrarEscenario = !!escenarioDetalle && escenarioDetalle.length > 0
  const escenarioMap = new Map((escenarioDetalle ?? []).map((d) => [d.movimiento.idMovimiento, d.monto]))

  const totalGastosPrevisto = gastos.reduce((s, m) => s + (m.montoPrevisto ?? 0), 0)
  const totalGastosReal = gastos.reduce((s, m) => s + (m.montoReal ?? 0), 0)
  const totalGastosEscenario = gastos.reduce((s, m) => s + (escenarioMap.get(m.movimiento.idMovimiento) ?? 0), 0)

  const totalIngresosPrevisto = ingresos.reduce((s, m) => s + (m.montoPrevisto ?? 0), 0)
  const totalIngresosReal = ingresos.reduce((s, m) => s + (m.montoReal ?? 0), 0)
  const totalIngresosEscenario = ingresos.reduce((s, m) => s + (escenarioMap.get(m.movimiento.idMovimiento) ?? 0), 0)

  return (
    <TableContainer component={Paper} elevation={1}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Concepto</TableCell>
            <TableCell align="right">Previsto</TableCell>
            <TableCell align="right">Real</TableCell>
            {mostrarEscenario && <TableCell align="right">Final</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          <SeccionMovimientos
            titulo="Gastos"
            filas={gastos}
            escenarioMap={escenarioMap}
            mostrarEscenario={mostrarEscenario}
            naturaleza="E"
            labelTotal="Total gastos"
          />
          <SeccionMovimientos
            titulo="Ingresos"
            filas={ingresos}
            escenarioMap={escenarioMap}
            mostrarEscenario={mostrarEscenario}
            naturaleza="I"
            labelTotal="T. ingresos"
          />
          <FilaTotales
            label="Saldo"
            previsto={totalIngresosPrevisto - totalGastosPrevisto}
            real={totalIngresosReal - totalGastosReal}
            escenario={totalIngresosEscenario - totalGastosEscenario}
            mostrarEscenario={mostrarEscenario}
            bold
          />
        </TableBody>
      </Table>
    </TableContainer>
  )
}
