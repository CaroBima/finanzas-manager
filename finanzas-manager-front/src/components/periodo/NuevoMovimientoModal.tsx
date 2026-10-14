import { useState } from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useTiposMovimiento } from '../../hooks/useCatalogo'
import { createNuevoMovimiento } from '../../api/movimientos'

interface Props {
  open: boolean
  onClose: () => void
}

const EMPTY_FORM = { idTipoMovimiento: '', nombre: '', descripcion: '' }

export function NuevoMovimientoModal({ open, onClose }: Props) {
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
    if (!form.idTipoMovimiento || !form.nombre.trim()) {
      setError('El tipo y el nombre son obligatorios.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await createNuevoMovimiento({
        idTipoMovimiento: Number(form.idTipoMovimiento),
        nombre: form.nombre.trim(),
        ...(form.descripcion.trim() ? { descripcion: form.descripcion.trim() } : {}),
      })
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
            InputProps={{ endAdornment: loadingTipos ? <CircularProgress size={16} /> : null }}
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
            value={form.nombre}
            onChange={handleChange('nombre')}
            fullWidth
            required
          />
          <TextField
            label="Descripción"
            value={form.descripcion}
            onChange={handleChange('descripcion')}
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
