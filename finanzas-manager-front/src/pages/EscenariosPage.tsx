import { Box, Paper, Stack, Typography } from '@mui/material'

export function EscenariosPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Escenarios de simulación
      </Typography>
      <Paper elevation={1}>
        <Box p={6} textAlign="center">
          <Typography color="text.secondary">Gestión de escenarios — próximamente.</Typography>
        </Box>
      </Paper>
    </Stack>
  )
}
