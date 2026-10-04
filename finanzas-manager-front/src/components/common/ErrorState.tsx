import { Alert } from '@mui/material'

interface ErrorStateProps {
  message?: string
}

export function ErrorState({ message = 'Ocurrió un error. Intentá de nuevo.' }: ErrorStateProps) {
  return <Alert severity="error">{message}</Alert>
}
