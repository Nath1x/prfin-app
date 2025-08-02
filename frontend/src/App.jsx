// src/App.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Importamos Link para la navegación

const App = () => {
    return (
        // Contenedor principal con un fondo degradado que ocupa toda la pantalla
        <div className="min-h-screen bg-gradient-to-r from-blue-700 to-indigo-900 text-white flex flex-col items-center justify-center p-8">
            
            <div className="text-center max-w-2xl">
                {/* Logo o Título Principal */}
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                    Bienvenido a PrFin-App
                </h1>

                {/* Subtítulo o Slogan */}
                <p className="text-lg md:text-xl text-indigo-200 mb-8">
                    La solución simple y eficaz para la gestión de préstamos y cobranza.
                </p>

                {/* Contenedor para los botones de acción */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* Botón principal para Iniciar Sesión */}
                    <Link
                        to="/login"
                        className="w-full sm:w-auto bg-white text-blue-700 font-bold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
                    >
                        Iniciar Sesión
                    </Link>

                    {/* Botón secundario (opcional) */}
                    <Link
                        to="#" // Puedes cambiar este enlace en el futuro
                        className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
                    >
                        Saber Más
                    </Link>
                </div>
            </div>

            {/* Pie de página simple */}
            <footer className="absolute bottom-8 text-indigo-300 text-sm">
                © {new Date().getFullYear()} PrFin-App. Todos los derechos reservados.
            </footer>
        </div>
    );
};

export default App;