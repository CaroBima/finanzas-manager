import { useState } from 'react'
import { Button, Stack, Typography } from '@mui/material'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { SelectorPeriodo } from '../components/periodo/SelectorPeriodo'
import { TablaMensual } from '../components/periodo/TablaMensual'
import { NuevoMovimientoModal } from '../components/periodo/NuevoMovimientoModal'
import { useMovimientosMensuales } from '../hooks/useMovimientosMensuales'
import { usePeriodo } from '../hooks/usePeriodo'

export function PeriodoPage() {
  const { mes, anio } = usePeriodo()
  const { data, isLoading, isError } = useMovimientosMensuales(mes, anio)
  const [modalMovimientoOpen, setModalMovimientoOpen] = useState(false)

  return (
    <Stack spacing={3}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Registro mensual
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined">Añadir nuevo periodo</Button>
          <Button variant="contained" onClick={() => setModalMovimientoOpen(true)}>
            Añadir nuevo movimiento
          </Button>
        </Stack>
        <SelectorPeriodo />
      </Stack>

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {data && <TablaMensual movimientos={data} />}

      <NuevoMovimientoModal
        open={modalMovimientoOpen}
        onClose={() => setModalMovimientoOpen(false)}
        mes={mes}
        anio={anio}
      />
    </Stack>
  )
}
