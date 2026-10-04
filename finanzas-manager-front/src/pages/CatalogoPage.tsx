import { Box, Paper, Stack, Typography } from '@mui/material'

export function CatalogoPage() {
  return (
    <Stack spacing={3}>
      <Typography variant="h5" fontWeight={700}>
        Catálogo de movimientos
      </Typography>
      <Paper elevation={1}>
        <Box p={6} textAlign="center">
          <Typography color="text.secondary">Gestión del catálogo — próximamente.</Typography>
        </Box>
      </Paper>
    </Stack>
  )
}
