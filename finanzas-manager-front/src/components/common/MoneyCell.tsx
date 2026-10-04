import { Typography } from '@mui/material'
import type { Naturaleza } from '../../types'

const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2,
})

interface MoneyCellProps {
  amount?: number | null
  naturaleza?: Naturaleza
}

export function MoneyCell({ amount, naturaleza }: MoneyCellProps) {
  if (amount == null) {
    return (
      <Typography variant="body2" color="text.disabled">
        —
      </Typography>
    )
  }

  const display = naturaleza ? (naturaleza === 'E' ? -Math.abs(amount) : Math.abs(amount)) : amount
  const color =
    display < 0 ? 'error.main' : display > 0 ? 'success.main' : 'text.primary'

  return (
    <Typography variant="body2" color={color} fontFamily="monospace" noWrap>
      {formatter.format(display)}
    </Typography>
  )
}
