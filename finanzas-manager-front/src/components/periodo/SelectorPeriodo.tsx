import { FormControl, IconButton, MenuItem, Select, Stack } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { usePeriodo } from '../../hooks/usePeriodo'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const ANIO_ACTUAL = new Date().getFullYear()
const ANIOS = Array.from({ length: 10 }, (_, i) => ANIO_ACTUAL - 4 + i)

export function SelectorPeriodo() {
  const { mes, anio, setPeriodo, anterior, siguiente } = usePeriodo()

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      <IconButton size="small" onClick={() => setPeriodo(anterior.mes, anterior.anio)}>
        <ChevronLeftIcon />
      </IconButton>

      <FormControl size="small">
        <Select value={mes} onChange={(e) => setPeriodo(Number(e.target.value), anio)}>
          {MESES.map((nombre, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small">
        <Select value={anio} onChange={(e) => setPeriodo(mes, Number(e.target.value))}>
          {ANIOS.map((a) => (
            <MenuItem key={a} value={a}>
              {a}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <IconButton size="small" onClick={() => setPeriodo(siguiente.mes, siguiente.anio)}>
        <ChevronRightIcon />
      </IconButton>
    </Stack>
  )
}
