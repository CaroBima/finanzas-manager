import { Button, FormControl, IconButton, MenuItem, Select, Stack } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useState, useEffect } from 'react'
import { usePeriodo } from '../../hooks/usePeriodo'

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre',
]

const ANIOS = [2024, 2025, 2026, 2027]

export function SelectorPeriodo() {
  const { mes, anio, setPeriodo, anterior, siguiente } = usePeriodo()
  const [localMes, setLocalMes] = useState(mes)
  const [localAnio, setLocalAnio] = useState(anio)

  useEffect(() => {
    setLocalMes(mes)
    setLocalAnio(anio)
  }, [mes, anio])

  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
      <IconButton size="small" onClick={() => setPeriodo(anterior.mes, anterior.anio)}>
        <ChevronLeftIcon />
      </IconButton>

      <FormControl size="small">
        <Select value={localMes} onChange={(e) => setLocalMes(Number(e.target.value))}>
          {MESES.map((nombre, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small">
        <Select value={localAnio} onChange={(e) => setLocalAnio(Number(e.target.value))}>
          {ANIOS.map((a) => (
            <MenuItem key={a} value={a}>
              {a}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        size="small"
        variant="contained"
        disableElevation
        onClick={() => setPeriodo(localMes, localAnio)}
      >
        Filtrar
      </Button>

      <IconButton size="small" onClick={() => setPeriodo(siguiente.mes, siguiente.anio)}>
        <ChevronRightIcon />
      </IconButton>
    </Stack>
  )
}
