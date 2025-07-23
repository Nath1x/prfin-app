// C:\Users\1vkwi\prfin-app\frontend\src\pages\Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [telefono_whatsapp, setTelefonoWhatsapp] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento predeterminado del formulario de recargar la página
    setError(''); // Limpia errores anteriores
    setMessage(''); // Limpia mensajes anteriores

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telefono_whatsapp, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        localStorage.setItem('token', data.token);

        // ¡CORRECCIÓN CLAVE AQUÍ! Redirección condicional basada en el rol
        // Decodificar el token para obtener el rol del usuario
        // El payload del JWT está en la segunda parte del token (split('.')[1]) y está codificado en Base64.
        const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
        const userRole = decodedToken.rol; // Asumiendo que 'rol' está en el payload del token

        // Redireccionar según el rol
        if (userRole === 'admin') {
            navigate('/admin');
        } else if (userRole === 'cobrador') {
            navigate('/cobrador');
        } else { // Por defecto, si es 'cliente' o cualquier otro rol no especificado
            navigate('/dashboard');
        }
      } else {
        setError(data.error || 'Error al iniciar sesión.');
      }
    } catch (err) {
      console.error('Error de red o del servidor:', err);
      setError('No se pudo conectar al servidor. Intenta de nuevo más tarde.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Iniciar Sesión en PrFin</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Número de WhatsApp (ej. +521234567890)"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={telefono_whatsapp}
              onChange={(e) => setTelefonoWhatsapp(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
          >
            Ingresar
          </button>
        </form>

        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}

        <p className="mt-6 text-gray-500 text-sm">
          Si tienes problemas para iniciar sesión, contacta a tu administrador.
        </p>
      </div>
    </div>
  );
}

export default Login;