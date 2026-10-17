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
import { useMovimientos } from '../../hooks/useCatalogo'
import { createMovimiento, createTipoMovimiento } from '../../api/movimientos'
import type { TipoMovimientoResponse } from '../../types'

const NEW_TIPO_VALUE = '__nuevo__'

interface Props {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

const EMPTY_FORM = {
  nombre: '',
  descripcion: '',
  idTipo: '',
  nuevoTipoNombre: '',
  nuevoTipoNaturaleza: '' as '' | 'I' | 'E',
}

export function CrearMovimientoModal({ open, onClose, onCreated }: Props) {
  const { data: movimientos, isLoading: loadingMovimientos } = useMovimientos()
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tiposUnicos: TipoMovimientoResponse[] = [...new Map(
    (movimientos ?? []).filter((m) => m.activo).map((m) => [m.tipoMov.idTipoMovimiento, m.tipoMov])
  ).values()]

  const crearNuevoTipo = form.idTipo === NEW_TIPO_VALUE

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setError(null)
    onClose()
  }

  const handleChange = (field: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (field === 'idTipo') {
      setForm((prev) => ({ ...prev, idTipo: e.target.value, nuevoTipoNombre: '', nuevoTipoNaturaleza: '' }))
    } else {
      setForm((prev) => ({ ...prev, [field]: e.target.value }))
    }
  }

  const handleSubmit = async () => {
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio.')
      return
    }
    if (!form.idTipo) {
      setError('El tipo de movimiento es obligatorio.')
      return
    }
    if (crearNuevoTipo) {
      if (!form.nuevoTipoNombre.trim()) {
        setError('El nombre del tipo es obligatorio.')
        return
      }
      if (!form.nuevoTipoNaturaleza) {
        setError('La naturaleza del tipo es obligatoria.')
        return
      }
    }

    setSubmitting(true)
    setError(null)
    try {
      let tipoMov: TipoMovimientoResponse
      if (crearNuevoTipo) {
        tipoMov = await createTipoMovimiento({
          nombre: form.nuevoTipoNombre.trim(),
          naturaleza: form.nuevoTipoNaturaleza as 'I' | 'E',
        })
      } else {
        tipoMov = tiposUnicos.find((t) => String(t.idTipoMovimiento) === form.idTipo)!
      }
      await createMovimiento({
        nombre: form.nombre.trim(),
        ...(form.descripcion.trim() ? { descripcion: form.descripcion.trim() } : {}),
        activo: true,
        tipoMov,
      })
      onCreated()
      handleClose()
    } catch {
      setError('No se pudo crear el movimiento. Intente nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" scroll="paper">
      <DialogTitle>Crear movimiento</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={3}>
          {error && (
            <Typography variant="body2" color="error">
              {error}
            </Typography>
          )}
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
          <TextField
            select
            label="Tipo de movimiento"
            value={form.idTipo}
            onChange={handleChange('idTipo')}
            disabled={loadingMovimientos}
            slotProps={{ input: { endAdornment: loadingMovimientos ? <CircularProgress size={16} /> : null } }}
            fullWidth
            required
          >
            {tiposUnicos.map((t) => (
              <MenuItem key={t.idTipoMovimiento} value={String(t.idTipoMovimiento)}>
                {t.nombre} — {t.naturaleza === 'I' ? 'Ingreso' : 'Egreso'}
              </MenuItem>
            ))}
            <MenuItem value={NEW_TIPO_VALUE}>+ Nuevo tipo</MenuItem>
          </TextField>
          {crearNuevoTipo && (
            <>
              <TextField
                label="Nombre del tipo"
                value={form.nuevoTipoNombre}
                onChange={handleChange('nuevoTipoNombre')}
                fullWidth
                required
              />
              <TextField
                select
                label="Naturaleza"
                value={form.nuevoTipoNaturaleza}
                onChange={handleChange('nuevoTipoNaturaleza')}
                fullWidth
                required
              >
                <MenuItem value="I">Ingreso</MenuItem>
                <MenuItem value="E">Egreso</MenuItem>
              </TextField>
            </>
          )}
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
