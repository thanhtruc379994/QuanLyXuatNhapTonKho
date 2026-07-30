import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/style/App.jsx'
import { WarehouseProvider } from './context/WarehouseContext.jsx'
import { AuthGate } from './pages/AuthGate.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WarehouseProvider>
      <AuthGate>
        {(auth) => <App {...auth} />}
      </AuthGate>
    </WarehouseProvider>
  </StrictMode>,
)
