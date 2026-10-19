import { useState } from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Box,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useMovimientos } from '../../hooks/useCatalogo'
import { createNuevoMovimiento } from '../../api/movimientos'
import { CrearMovimientoModal } from './CrearMovimientoModal'

interface Props {
  open: boolean
  onClose: () => void
  mes: number
  anio: number
}

const EMPTY_FORM = {
  tipoMovimiento: '',
  nombreMovimiento: '',
  montoPrevisto: '',
  montoReal: '',
  montoSimulado: '',
  nroCuota: '',
  totalCuotas: '',
  notas: '',
}

export function NuevoMovimientoModal({ open, onClose, mes, anio }: Props) {
  const queryClient = useQueryClient()
  const { data: movimientos, isLoading: loadingMovimientos } = useMovimientos()
  const [form, setForm] = useState(EMPTY_FORM)
  const [touched, setTouched] = useState({ montoReal: false, montoSimulado: false })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [crearOpen, setCrearOpen] = useState(false)

  const tiposUnicos = [...new Map(
    (movimientos ?? []).filter((m) => m.activo).map((m) => [m.tipoMov.idTipoMovimiento, m.tipoMov])
  ).values()]

  const movimientosFiltrados = (movimientos ?? []).filter(
    (m) => m.activo && (!form.tipoMovimiento || m.tipoMov.nombre === form.tipoMovimiento)
  )

  const movimientoSeleccionado = movimientos?.find((m) => m.nombre === form.nombreMovimiento) ?? null

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setTouched({ montoReal: false, montoSimulado: false })
    setError(null)
    onClose()
  }

  const handleChange = (field: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (field === 'tipoMovimiento') {
      setForm((prev) => ({ ...prev, tipoMovimiento: value, nombreMovimiento: '' }))
    } else if (field === 'montoPrevisto') {
      setForm((prev) => ({
        ...prev,
        montoPrevisto: value,
        montoReal: touched.montoReal ? prev.montoReal : value,
        montoSimulado: touched.montoSimulado ? prev.montoSimulado : value,
      }))
    } else if (field === 'montoReal') {
      setTouched((prev) => ({ ...prev, montoReal: true }))
      setForm((prev) => ({ ...prev, montoReal: value }))
    } else if (field === 'montoSimulado') {
      setTouched((prev) => ({ ...prev, montoSimulado: true }))
      setForm((prev) => ({ ...prev, montoSimulado: value }))
    } else {
      setForm((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleSubmit = async () => {
    if (!form.nombreMovimiento) {
      setError('El movimiento es obligatorio.')
      return
    }
    if (!movimientoSeleccionado) {
      setError('Movimiento inválido.')
      return
    }
    const montoPrevisto = Number(form.montoPrevisto)
    if (isNaN(montoPrevisto) || montoPrevisto < 0) {
      setError('El monto previsto debe ser un número mayor o igual a 0.')
      return
    }
    const montoReal = form.montoReal !== '' ? Number(form.montoReal) : undefined
    if (montoReal !== undefined && (isNaN(montoReal) || montoReal < 0)) {
      setError('El monto real debe ser un número mayor o igual a 0.')
      return
    }
    const montoSimulado = form.montoSimulado !== '' ? Number(form.montoSimulado) : undefined
    if (montoSimulado !== undefined && (isNaN(montoSimulado) || montoSimulado < 0)) {
      setError('El monto simulado debe ser un número mayor o igual a 0.')
      return
    }
    const nroCuota = form.nroCuota !== '' ? Number(form.nroCuota) : undefined
    const totalCuotas = form.totalCuotas !== '' ? Number(form.totalCuotas) : undefined
    if ((nroCuota !== undefined) !== (totalCuotas !== undefined)) {
      setError('Debe completar tanto el nro. de cuota como el total de cuotas.')
      return
    }
    if (nroCuota !== undefined && totalCuotas !== undefined && nroCuota > totalCuotas) {
      setError('El nro. de cuota no puede ser mayor al total de cuotas.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await createNuevoMovimiento({
        nombreMovimiento: movimientoSeleccionado.nombre,
        montoPrevisto,
        ...(montoReal !== undefined ? { montoReal } : {}),
        ...(montoSimulado !== undefined ? { montoSimulado } : {}),
        ...(nroCuota !== undefined ? { nroCuota } : {}),
        ...(totalCuotas !== undefined ? { totalCuotas } : {}),
        ...(form.notas.trim() ? { notas: form.notas.trim() } : {}),
        tipoMovimiento: movimientoSeleccionado.tipoMov.nombre,
        naturaleza: movimientoSeleccionado.tipoMov.naturaleza,
        mes,
        anio,
      })
      queryClient.invalidateQueries({ queryKey: ['movimientosMensuales', mes, anio] })
      handleClose()
    } catch {
      setError('No se pudo guardar el movimiento. Intente nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" scroll="paper">
        <DialogTitle>Nuevo movimiento</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            {error && (
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            )}
            <TextField
              select
              label="Tipo de movimiento"
              value={form.tipoMovimiento}
              onChange={handleChange('tipoMovimiento')}
              disabled={loadingMovimientos}
              slotProps={{ input: { endAdornment: loadingMovimientos ? <CircularProgress size={16} /> : null } }}
              fullWidth
            >
              <MenuItem value="">Todos</MenuItem>
              {tiposUnicos.map((t) => (
                <MenuItem key={t.idTipoMovimiento} value={t.nombre}>
                  {t.nombre} — {t.naturaleza === 'I' ? 'Ingreso' : 'Egreso'}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Movimiento"
              value={form.nombreMovimiento}
              onChange={handleChange('nombreMovimiento')}
              disabled={loadingMovimientos}
              fullWidth
              required
            >
              {movimientosFiltrados.map((m) => (
                <MenuItem key={m.nombre} value={m.nombre}>
                  {m.nombre}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Monto previsto"
              value={form.montoPrevisto}
              onChange={handleChange('montoPrevisto')}
              type="number"
              slotProps={{
                htmlInput: { min: 0, step: '0.01' },
                input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
              }}
              fullWidth
              required
            />
            <TextField
              label="Monto real"
              value={form.montoReal}
              onChange={handleChange('montoReal')}
              type="number"
              slotProps={{
                htmlInput: { min: 0, step: '0.01' },
                input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
              }}
              fullWidth
            />
            <TextField
              label="Monto simulado"
              value={form.montoSimulado}
              onChange={handleChange('montoSimulado')}
              type="number"
              slotProps={{
                htmlInput: { min: 0, step: '0.01' },
                input: { startAdornment: <InputAdornment position="start">$</InputAdornment> },
              }}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Nro. de cuota"
                value={form.nroCuota}
                onChange={handleChange('nroCuota')}
                type="number"
                slotProps={{ htmlInput: { min: 1, step: 1 } }}
                fullWidth
              />
              <TextField
                label="Total de cuotas"
                value={form.totalCuotas}
                onChange={handleChange('totalCuotas')}
                type="number"
                slotProps={{ htmlInput: { min: 1, step: 1 } }}
                fullWidth
              />
            </Box>
            <TextField
              label="Notas"
              value={form.notas}
              onChange={handleChange('notas')}
              fullWidth
              multiline
              minRows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setCrearOpen(true)} disabled={submitting}>
            Crear movimiento
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button onClick={handleClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>
      <CrearMovimientoModal
        open={crearOpen}
        onClose={() => setCrearOpen(false)}
        onCreated={() => {
          queryClient.invalidateQueries({ queryKey: ['movimientos'] })
          setCrearOpen(false)
        }}
      />
    </>
  )
}
