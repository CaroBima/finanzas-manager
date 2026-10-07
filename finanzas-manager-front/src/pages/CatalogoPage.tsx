import { useEffect, useState } from 'react'
import {
  Box,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { fetchCatalogoMovimientos } from '../api/movimientos'
import type { MovimientoMensualResponse } from '../types'

export function CatalogoPage() {
  const [rows, setRows] = useState<MovimientoMensualResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCatalogoMovimientos()
      .then(setRows)
      .catch(() => setError('No se pudieron cargar los movimientos.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Stack spacing={3}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Catálogo de movimientos
      </Typography>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Paper elevation={1}>
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography color="error">{error}</Typography>
          </Box>
        </Paper>
      )}

      {!loading && !error && (
        <TableContainer component={Paper} elevation={1}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Período</TableCell>
                <TableCell>Concepto</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Naturaleza</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Activo</TableCell>
                <TableCell align="right">Previsto</TableCell>
                <TableCell align="right">Real</TableCell>
                <TableCell align="center">Cuotas</TableCell>
                <TableCell>Notas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} align="center" sx={{ color: 'text.secondary' }}>
                    Sin datos
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell>
                      {row.periodoResponse.mes}/{row.periodoResponse.anio}
                    </TableCell>
                    <TableCell>{row.movimientoResponse.nombre}</TableCell>
                    <TableCell>{row.movimientoResponse.tipoMov.nombre}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.movimientoResponse.tipoMov.naturaleza === 'I' ? 'Ingreso' : 'Gasto'}
                        color={row.movimientoResponse.tipoMov.naturaleza === 'I' ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{row.movimientoResponse.descripcion ?? '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.movimientoResponse.activo ? 'Sí' : 'No'}
                        color={row.movimientoResponse.activo ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {row.montoPrevisto.toLocaleString('es-AR')}
                    </TableCell>
                    <TableCell align="right">
                      {row.montoReal.toLocaleString('es-AR')}
                    </TableCell>
                    <TableCell align="center">
                      {row.nroCuota > 0 && row.TotalCuotas > 0
                        ? `${row.nroCuota}/${row.TotalCuotas}`
                        : '—'}
                    </TableCell>
                    <TableCell>{row.notas ?? '—'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  )
}
