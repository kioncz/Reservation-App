import { Navigate, Routes, Route } from 'react-router-dom'
import { useAuth } from '../context/auth.jsx'
import Login from '../pages/auth/login/login.jsx'
import Register from '../pages/auth/register/register.jsx'
import Menu_user from '../pages/menu_user/menu_use.jsx'
import Create_event from '../pages/create_event/create_event.jsx'
import EditEvent from '../pages/edit_event/edit_event.jsx'
import Reservation_user from '../pages/Reservation_user/reservation_user.jsx'

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) {
        return <p>Cargando sesión...</p>
    }

    return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
    const { isAdmin, loading } = useAuth()

    if (loading) {
        return <p>Cargando sesión...</p>
    }

    return isAdmin ? children : <Navigate to="/menu_user" replace />
}

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/menu_user" element={<ProtectedRoute><Menu_user /></ProtectedRoute>} />
            <Route path="/create_event" element={<AdminRoute><Create_event /></AdminRoute>} />
            <Route path="/edit_event/:eventId" element={<AdminRoute><EditEvent /></AdminRoute>} />
            <Route path="/consultar" element={<ProtectedRoute><Reservation_user /></ProtectedRoute>} /> 
        </Routes>
    )
}   

