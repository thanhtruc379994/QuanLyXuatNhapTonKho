import { createTheme } from '@mui/material/styles'

export const warehouseTheme = createTheme({
  palette: { mode: 'light', primary: { main: '#1A1E26', contrastText: '#fff' }, secondary: { main: '#D3AD5F' }, background: { default: '#FAF9F6', paper: '#fff' }, success: { main: '#247A57' }, error: { main: '#C0392B' } },
  typography: { fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', button: { textTransform: 'none', fontWeight: 600 } },
  shape: { borderRadius: 10 },
  components: { MuiButton: { defaultProps: { disableElevation: true } }, MuiTextField: { defaultProps: { size: 'small' } }, MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } } },
})
