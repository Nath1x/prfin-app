// frontend/src/App.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './App.css'; // Puedes personalizar estilos aquí

function App() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-4">
      <h1 className="text-4xl font-bold mb-6">Bienvenido a PRFIN</h1>
      <p className="text-lg mb-8">Gestiona tus préstamos de forma simple y segura.</p>
      <Link
        to="/login"
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
      >
        Iniciar sesión
      </Link>
    </div>
  );
}

export default App;
