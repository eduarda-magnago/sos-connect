import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Layout from '../components/Layout'
import Login from '../pages/Login'
import Home from '../pages/Home'
import SupportUnits from '../pages/SupportUnits'
import CreateSupportUnit from '../pages/CreateSupportUnit'
import type { JSX } from 'react'
import Donations from '../pages/SupportUnits/Donations'
import Missions from '../pages/SupportUnits/Missions'

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/" />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/" element={<Login />} />

        {/* Rotas autenticadas — todas dentro do Layout */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/support-units" element={<SupportUnits />} />
          <Route path="/support-units/new" element={<CreateSupportUnit />} />  
          <Route path="/support-units/:id/donations" element={<Donations />} />
          <Route path="/support-units/:id/missions" element={<Missions />} />  
        </Route>
      </Routes>
    </BrowserRouter>
  )
}