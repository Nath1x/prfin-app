import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css'; // Asegúrate de importar los estilos

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Aquí podrías verificar si el usuario ya está autenticado
  }, []);

  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Routes>
          {!user ? (
            <Route
              path="/"
              element={<Login setUser={setUser} className="login-effect" />}
            />
          ) : (
            <Route
              path="/dashboard"
              element={<Dashboard user={user} />}
            />
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
