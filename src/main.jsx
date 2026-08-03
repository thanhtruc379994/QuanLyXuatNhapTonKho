import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/style/App.jsx'
import { WarehouseProvider } from './context/WarehouseContext.jsx'
import { AuthGate } from './pages/AuthGate.jsx'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { warehouseTheme } from './theme.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={warehouseTheme}><CssBaseline />
    <WarehouseProvider>
      <AuthGate>
        {(auth) => <App {...auth} />}
      </AuthGate>
    </WarehouseProvider></ThemeProvider>
  </StrictMode>,
)
