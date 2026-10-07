import { useEffect, useState } from 'react'
import {
  Box,
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

export function CatalogoPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCatalogoMovimientos()
      .then((data) => setRows(data as unknown as Record<string, unknown>[]))
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
                <TableCell>ID Período</TableCell>
                <TableCell>ID Movimiento</TableCell>
                <TableCell align="right">Previsto</TableCell>
                <TableCell align="right">Real</TableCell>
                <TableCell>Notas</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ color: 'text.secondary' }}>
                    Sin datos
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={i} hover>
                    <TableCell>{String(row.idPeriodo ?? '')}</TableCell>
                    <TableCell>{String(row.idMovimiento ?? '')}</TableCell>
                    <TableCell align="right">
                      {typeof row.montoPrevisto === 'number'
                        ? row.montoPrevisto.toLocaleString('es-AR')
                        : '—'}
                    </TableCell>
                    <TableCell align="right">
                      {typeof row.montoReal === 'number'
                        ? row.montoReal.toLocaleString('es-AR')
                        : '—'}
                    </TableCell>
                    <TableCell>{row.notas ? String(row.notas) : '—'}</TableCell>
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
