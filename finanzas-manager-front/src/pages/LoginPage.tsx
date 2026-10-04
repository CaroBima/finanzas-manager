import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'

const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'}/oauth2/authorization/google`

export function LoginPage() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="grey.100">
      <Card sx={{ width: 380, boxShadow: 4 }}>
        <CardContent>
          <Stack spacing={3} alignItems="center" px={2} py={3}>
            <Typography variant="h5" fontWeight={700}>
              Finanzas Manager
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Iniciá sesión para acceder a tus registros financieros.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<GoogleIcon />}
              href={GOOGLE_AUTH_URL}
              fullWidth
            >
              Continuar con Google
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
