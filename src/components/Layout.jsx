import Box from '@mui/material/Box'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import SettingsIcon from '@mui/icons-material/Settings'

export default function Layout({ tab, onTabChange, children }) {
  return (
    <Box sx={{ pb: '56px', minHeight: '100dvh' }}>
      {children}
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200 }}
        elevation={3}
      >
        <BottomNavigation value={tab} onChange={(_, v) => onTabChange(v)} showLabels>
          <BottomNavigationAction label="Dashboard" icon={<DashboardIcon />} />
          <BottomNavigationAction label="Umsätze" icon={<ReceiptLongIcon />} />
          <BottomNavigationAction label="Einstellungen" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}
