import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ListAltIcon from '@mui/icons-material/ListAlt'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../../hooks/useAuth'

const DRAWER_WIDTH = 240

const NAV_ITEMS = [
  { label: 'Período', path: '/periodo', icon: <CalendarMonthIcon /> },
  { label: 'Catálogo', path: '/catalogo', icon: <ListAltIcon /> },
  { label: 'Escenarios', path: '/escenarios', icon: <AccountTreeIcon /> },
]

function DrawerContent({ onNavigate }: { onNavigate: (path: string) => void }) {
  const location = useLocation()

  return (
    <Box sx={{ width: DRAWER_WIDTH }}>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Finanzas Manager
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              selected={location.pathname.startsWith(item.path)}
              onClick={() => onNavigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleNavigate = (path: string) => {
    navigate(path)
    setDrawerOpen(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Finanzas Manager
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} ModalProps={{ keepMounted: true }}>
        <DrawerContent onNavigate={handleNavigate} />
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
