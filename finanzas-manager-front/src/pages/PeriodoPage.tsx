import { Stack, Typography } from '@mui/material'
import { ErrorState } from '../components/common/ErrorState'
import { LoadingState } from '../components/common/LoadingState'
import { SelectorPeriodo } from '../components/periodo/SelectorPeriodo'
import { TablaMensual } from '../components/periodo/TablaMensual'
import { useMovimientosMensuales } from '../hooks/useMovimientosMensuales'
import { usePeriodo } from '../hooks/usePeriodo'

export function PeriodoPage() {
  const { mes, anio } = usePeriodo()
  const { data, isLoading, isError } = useMovimientosMensuales(mes, anio)

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
        <Typography variant="h5" fontWeight={700}>
          Registro mensual
        </Typography>
        <SelectorPeriodo />
      </Stack>

      {isLoading && <LoadingState />}
      {isError && <ErrorState />}
      {data && <TablaMensual movimientos={data} />}
    </Stack>
  )
}
