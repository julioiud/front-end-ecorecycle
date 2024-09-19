import { Route, Routes } from 'react-router-dom'
import PrivateRoute from './privates/PrivateRoute'
import EcoRecycleRoutes from './privates/EcoRecycleRoutes'
import PublicRoute from './publics/PublicRoute'
import Public from './publics/Publics'

export default function AppRouter() {
  return (
      <Routes>
        
        <Route 
          path="/pr/*" 
          element={
            <PrivateRoute>
              <EcoRecycleRoutes />
            </PrivateRoute>
          } 
        />

        <Route 
          path="/*"
          element={
            <PublicRoute>
              <Public />
            </PublicRoute>
          }
        />
      </Routes>
  )
}
