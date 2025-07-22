// C:\Users\1vkwi\prfin-app\frontend\src\App.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importa Link

function App() {
  const [backendMessage, setBackendMessage] = useState('Conectando al backend...');
  const [dbStatus, setDbStatus] = useState('Conectando a la DB...');

  useEffect(() => {
    // Fetch para la ruta principal del backend
    // AHORA USA LA VARIABLE DE ENTORNO VITE_API_URL
    fetch(import.meta.env.VITE_API_URL + '/')
      .then(response => response.text())
      .then(data => setBackendMessage(data))
      .catch(error => {
        console.error('Error al conectar al backend:', error);
        setBackendMessage('Error al conectar al backend. Asegúrate de que esté corriendo.');
      });

    // Fetch para la ruta de prueba de la base de datos
    // AHORA USA LA VARIABLE DE ENTORNO VITE_API_URL
    fetch(import.meta.env.VITE_API_URL + '/test-db')
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          setDbStatus(`DB: ${data.message} - ${new Date(data.dbTime).toLocaleString()}`);
        } else if (data.error) {
          setDbStatus(`Error DB: ${data.error.message || data.details}`);
        }
      })
      .catch(error => {
        console.error('Error al conectar a la DB:', error);
        setDbStatus('Error al conectar a la DB. Verifica el backend y la DB.');
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <header className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-4 tracking-tight">PrFin</h1>
        <p className="text-gray-700 text-lg mb-2">{backendMessage}</p>
        <p className="text-gray-600 text-md mb-6">{dbStatus}</p>
        <p className="text-green-600 text-xl font-semibold mb-4">
          ¡Si ves esto, tu frontend y backend se están comunicando!
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Esta es la pantalla de estado del sistema. Para acceder al portal, haz clic abajo.
        </p>
        <div className="mt-8">
          <Link
            to="/login"
            className="bg-purple-600 text-white p-3 rounded-md font-semibold hover:bg-purple-700 transition duration-300 inline-block"
          >
            Ir a Login
          </Link>
        </div>
      </header>
    </div>
  );
}

export default App;