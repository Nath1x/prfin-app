// C:\Users\1vkwi\prfin-app\frontend\src\main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.jsx'; // Pantalla de bienvenida / estado
import Login from './pages/Login.jsx'; // Página de login
import Dashboard from './pages/Dashboard.jsx'; // Dashboard del usuario
import AdminDashboard from './pages/AdminDashboard.jsx'; // Panel de administración
import CobradorDashboard from './pages/CobradorDashboard.jsx'; // ¡CORRECCIÓN CLAVE AQUÍ! NUEVO: Panel de cobradores
import './index.css';

// Componente auxiliar para proteger rutas (para usuarios autenticados)
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Verifica si existe un token
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Componente auxiliar para proteger rutas de administración
// NOTA: En una aplicación real, aquí verificarías el rol del usuario (ej. si es 'admin')
// Por ahora, solo verifica si hay un token, asumiendo que el único que tiene token es el admin (tú) o un usuario normal.
// Esto se puede refinar con roles de usuario más adelante.
const AdminRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('token'); // Simplificado: solo verifica token
    // En un futuro: const userRole = obtenerRolDelToken(); return isAuthenticated && userRole === 'admin' ? children : <Navigate to="/login" />;
    return isAuthenticated ? children : <Navigate to="/login" />;
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} /> {/* Pantalla de bienvenida */}
        <Route path="/login" element={<Login />} /> {/* Página de login */}
        
        {/* Ruta protegida para el dashboard de usuario */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        
        {/* Ruta protegida para el panel de administración */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* ¡CORRECCIÓN CLAVE AQUÍ! NUEVA RUTA PROTEGIDA PARA EL COBRADOR */}
        <Route
          path="/cobrador"
          element={
            <AdminRoute> {/* Usamos AdminRoute temporalmente para protegerla con token. Luego se refinará a una CobradorRoute si quieres */}
              <CobradorDashboard />
            </AdminRoute>
          }
        />

        {/* Aquí puedes añadir más rutas si lo necesitas */}
      </Routes>
    </Router>
  </React.StrictMode>,
);