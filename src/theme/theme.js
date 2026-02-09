import { createTheme } from '@mui/material/styles'

export function buildTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
      ...(mode === 'dark' && {
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
      }),
    },
    shape: { borderRadius: 16 },
    components: {
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { border: '1px solid', borderColor: 'divider' },
        },
      },
      MuiDialog: {
        defaultProps: { PaperProps: { sx: { borderRadius: 3 } } },
      },
      MuiFab: {
        styleOverrides: {
          root: { borderRadius: 16 },
        },
      },
    },
  })
}
