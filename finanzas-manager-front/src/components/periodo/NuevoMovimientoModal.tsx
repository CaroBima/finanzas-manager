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
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { useTiposMovimiento } from '../../hooks/useCatalogo'
import { createNuevoMovimiento } from '../../api/movimientos'

interface Props {
  open: boolean
  onClose: () => void
  mes: number
  anio: number
}

const EMPTY_FORM = {
  idTipoMovimiento: '',
  nombreMovimiento: '',
  descripcionMovimiento: '',
  montoPrevisto: '',
}

export function NuevoMovimientoModal({ open, onClose, mes, anio }: Props) {
  const queryClient = useQueryClient()
  const { data: tipos, isLoading: loadingTipos } = useTiposMovimiento()
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setError(null)
    onClose()
  }

  const handleChange = (field: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = async () => {
    if (!form.idTipoMovimiento || !form.nombreMovimiento.trim()) {
      setError('El tipo y el nombre son obligatorios.')
      return
    }
    const montoPrevisto = Number(form.montoPrevisto)
    if (isNaN(montoPrevisto) || montoPrevisto < 0) {
      setError('El monto previsto debe ser un número mayor o igual a 0.')
      return
    }

    const tipoSeleccionado = tipos?.find((t) => t.idTipoMovimiento === Number(form.idTipoMovimiento))
    if (!tipoSeleccionado) {
      setError('Tipo de movimiento inválido.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      await createNuevoMovimiento({
        nombreMovimiento: form.nombreMovimiento.trim(),
        ...(form.descripcionMovimiento.trim() ? { descripcionMovimiento: form.descripcionMovimiento.trim() } : {}),
        montoPrevisto,
        tipoMovimiento: tipoSeleccionado.nombre,
        naturaleza: tipoSeleccionado.naturaleza,
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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Nuevo movimiento</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
          <TextField
            select
            label="Tipo de movimiento"
            value={form.idTipoMovimiento}
            onChange={handleChange('idTipoMovimiento')}
            disabled={loadingTipos}
            slotProps={{ input: { endAdornment: loadingTipos ? <CircularProgress size={16} /> : null } }}
            fullWidth
            required
          >
            {(tipos ?? []).map((t) => (
              <MenuItem key={t.idTipoMovimiento} value={t.idTipoMovimiento}>
                {t.nombre} — {t.naturaleza === 'I' ? 'Ingreso' : 'Egreso'}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Nombre"
            value={form.nombreMovimiento}
            onChange={handleChange('nombreMovimiento')}
            fullWidth
            required
          />
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
            label="Descripción"
            value={form.descripcionMovimiento}
            onChange={handleChange('descripcionMovimiento')}
            fullWidth
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={submitting}>
          Cancelar
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting ? <CircularProgress size={20} /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
