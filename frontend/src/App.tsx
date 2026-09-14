import { BrowserRouter } from 'react-router-dom'

import { AuthProvider } from '@/context/AuthContext'
import { VendaProvider } from '@/context/VendaContext'
import { AppRoutes } from '@/routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VendaProvider>
          <AppRoutes />
        </VendaProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
