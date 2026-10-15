import { useState } from 'react'
import {
  Box,
  Checkbox,
  FormControlLabel,
  Menu,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
} from '@mui/material'
import ViewColumnIcon from '@mui/icons-material/ViewColumn'
import type { EscenarioDetalle, MovimientoPorPeriodoResponse, Naturaleza } from '../../types'
import { MoneyCell } from '../common/MoneyCell'

interface TablaMensualProps {
  movimientos: MovimientoPorPeriodoResponse[]
  escenarioDetalle?: EscenarioDetalle[]
}

type ColumnId = 'concepto' | 'tipo' | 'descripcion' | 'notas' | 'previsto' | 'real' | 'escenario'

interface ColumnDef {
  id: ColumnId
  label: string
  defaultVisible: boolean
  align: 'left' | 'right'
}

const ALL_COLUMNS: ColumnDef[] = [
  { id: 'concepto', label: 'Concepto', defaultVisible: true, align: 'left' },
  { id: 'tipo', label: 'Tipo', defaultVisible: true, align: 'left' },
  { id: 'descripcion', label: 'Descripción', defaultVisible: false, align: 'left' },
  { id: 'notas', label: 'Notas', defaultVisible: false, align: 'left' },
  { id: 'previsto', label: 'Previsto', defaultVisible: true, align: 'right' },
  { id: 'real', label: 'Real', defaultVisible: true, align: 'right' },
  { id: 'escenario', label: 'Final', defaultVisible: false, align: 'right' },
]

const TEXT_COL_IDS: ColumnId[] = ['concepto', 'tipo', 'descripcion', 'notas']
const NUMERIC_COL_IDS: ColumnId[] = ['previsto', 'real', 'escenario']

function labelConCuotas(row: MovimientoPorPeriodoResponse): string {
  if ((row.nroCuota ?? 0) > 0 && (row.totalCuotas ?? 0) > 0) {
    return `${row.nombreMovimiento} (${row.nroCuota}/${row.totalCuotas})`
  }
  return row.nombreMovimiento
}

function cellValue(
  col: ColumnId,
  row: MovimientoPorPeriodoResponse,
  naturaleza: Naturaleza,
  escenarioMap: Map<string, number>,
) {
  switch (col) {
    case 'concepto':
      return <Typography variant="body2">{labelConCuotas(row)}</Typography>
    case 'tipo':
      return (
        <Typography variant="body2" color="text.secondary">
          {row.nombreTipoMovimiento ?? '—'}
        </Typography>
      )
    case 'descripcion':
      return (
        <Typography variant="body2" color="text.secondary">
          {row.descripcion ?? '—'}
        </Typography>
      )
    case 'notas':
      return (
        <Typography variant="body2" color="text.secondary">
          {row.notas ?? '—'}
        </Typography>
      )
    case 'previsto':
      return <MoneyCell amount={row.montoPrevisto} naturaleza={naturaleza} />
    case 'real':
      return <MoneyCell amount={row.montoReal} naturaleza={naturaleza} />
    case 'escenario':
      return <MoneyCell amount={escenarioMap.get(row.nombreMovimiento)} naturaleza={naturaleza} />
  }
}

function FilaTotales({
  label,
  totales,
  visibleCols,
  sx: sxProp,
}: {
  label: string
  totales: Record<'previsto' | 'real' | 'escenario', number>
  visibleCols: Set<ColumnId>
  sx?: object
}) {
  const textSpan = TEXT_COL_IDS.filter((id) => visibleCols.has(id)).length || 1
  return (
    <TableRow>
      <TableCell colSpan={textSpan} sx={sxProp}>
        {label}
      </TableCell>
      {NUMERIC_COL_IDS.filter((id) => visibleCols.has(id)).map((id) => (
        <TableCell key={id} align="right" sx={sxProp}>
          <MoneyCell amount={totales[id as 'previsto' | 'real' | 'escenario']} />
        </TableCell>
      ))}
    </TableRow>
  )
}

function SeccionMovimientos({
  titulo,
  filas,
  escenarioMap,
  visibleCols,
  availableCols,
  naturaleza,
  labelTotal,
}: {
  titulo: string
  filas: MovimientoPorPeriodoResponse[]
  escenarioMap: Map<string, number>
  visibleCols: Set<ColumnId>
  availableCols: ColumnDef[]
  naturaleza: Naturaleza
  labelTotal: string
}) {
  const totalColSpan = availableCols.filter((c) => visibleCols.has(c.id)).length

  const totalPrevisto = filas.reduce((s, f) => s + (f.montoPrevisto ?? 0), 0)
  const totalReal = filas.reduce((s, f) => s + (f.montoReal ?? 0), 0)
  const totalEscenario = filas.reduce((s, f) => s + (escenarioMap.get(f.nombreMovimiento) ?? 0), 0)
  const sign = naturaleza === 'E' ? -1 : 1

  return (
    <>
      <TableRow>
        <TableCell
          colSpan={totalColSpan}
          sx={{ bgcolor: 'primary.light', color: 'primary.contrastText', fontWeight: 700 }}
        >
          {titulo}
        </TableCell>
      </TableRow>
      {filas.map((row) => (
        <TableRow key={row.nombreMovimiento} hover>
          {availableCols
            .filter((c) => visibleCols.has(c.id))
            .map((c) => (
              <TableCell key={c.id} align={c.align}>
                {cellValue(c.id, row, naturaleza, escenarioMap)}
              </TableCell>
            ))}
        </TableRow>
      ))}
      <FilaTotales
        label={labelTotal}
        totales={{
          previsto: sign * totalPrevisto,
          real: sign * totalReal,
          escenario: sign * totalEscenario,
        }}
        visibleCols={visibleCols}
        sx={{ fontWeight: 600, bgcolor: 'grey.100' }}
      />
    </>
  )
}

function ColumnMenu({
  columns,
  visible,
  onToggle,
}: {
  columns: ColumnDef[]
  visible: Set<ColumnId>
  onToggle: (id: ColumnId) => void
}) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null)

  return (
    <>
      <Button
        size="small"
        variant="outlined"
        startIcon={<ViewColumnIcon />}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        Columnas
      </Button>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        {columns.map((col) => (
          <FormControlLabel
            key={col.id}
            control={
              <Checkbox
                checked={visible.has(col.id)}
                onChange={() => onToggle(col.id)}
                size="small"
              />
            }
            label={col.label}
            sx={{ display: 'flex', mx: 1 }}
          />
        ))}
      </Menu>
    </>
  )
}

export function TablaMensual({ movimientos, escenarioDetalle }: TablaMensualProps) {
  const mostrarEscenario = !!escenarioDetalle && escenarioDetalle.length > 0
  const availableCols = mostrarEscenario ? ALL_COLUMNS : ALL_COLUMNS.filter((c) => c.id !== 'escenario')

  const [visible, setVisible] = useState<Set<ColumnId>>(
    () => new Set(availableCols.filter((c) => c.defaultVisible).map((c) => c.id)),
  )

  const toggle = (id: ColumnId) =>
    setVisible((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  if (movimientos.length === 0) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Typography sx={{ color: 'text.secondary' }}>
          No hay movimientos para este período.
        </Typography>
      </Box>
    )
  }

  const gastos = movimientos.filter((m) => m.naturalezaTipoMov === 'E')
  const ingresos = movimientos.filter((m) => m.naturalezaTipoMov === 'I')

  const escenarioMap = new Map((escenarioDetalle ?? []).map((d) => [d.movimiento.nombre, d.monto]))

  const totalGastosPrevisto = gastos.reduce((s, m) => s + (m.montoPrevisto ?? 0), 0)
  const totalGastosReal = gastos.reduce((s, m) => s + (m.montoReal ?? 0), 0)
  const totalGastosEscenario = gastos.reduce((s, m) => s + (escenarioMap.get(m.nombreMovimiento) ?? 0), 0)

  const totalIngresosPrevisto = ingresos.reduce((s, m) => s + (m.montoPrevisto ?? 0), 0)
  const totalIngresosReal = ingresos.reduce((s, m) => s + (m.montoReal ?? 0), 0)
  const totalIngresosEscenario = ingresos.reduce((s, m) => s + (escenarioMap.get(m.nombreMovimiento) ?? 0), 0)

  const visibleCols = availableCols.filter((c) => visible.has(c.id))

  return (
    <Stack spacing={1}>
      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        <ColumnMenu columns={availableCols} visible={visible} onToggle={toggle} />
      </Stack>
      <TableContainer component={Paper} elevation={1}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {visibleCols.map((c) => (
                <TableCell key={c.id} align={c.align}>
                  {c.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <SeccionMovimientos
              titulo="Gastos"
              filas={gastos}
              escenarioMap={escenarioMap}
              visibleCols={visible}
              availableCols={availableCols}
              naturaleza="E"
              labelTotal="Total gastos"
            />
            <SeccionMovimientos
              titulo="Ingresos"
              filas={ingresos}
              escenarioMap={escenarioMap}
              visibleCols={visible}
              availableCols={availableCols}
              naturaleza="I"
              labelTotal="T. ingresos"
            />
            <FilaTotales
              label="Saldo"
              totales={{
                previsto: totalIngresosPrevisto - totalGastosPrevisto,
                real: totalIngresosReal - totalGastosReal,
                escenario: totalIngresosEscenario - totalGastosEscenario,
              }}
              visibleCols={visible}
              sx={{ fontWeight: 700, bgcolor: 'action.hover' }}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}
