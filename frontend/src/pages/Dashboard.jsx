// C:\Users\1vkwi\prfin-app\frontend\src\pages\Dashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Si no hay token, redirige al login
        return;
      }

      try {
        // Obtener datos del usuario
        // ¡NUEVO! Usa la variable de entorno para la URL del backend
        const userResponse = await fetch(import.meta.env.VITE_API_URL + '/api/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const userData = await userResponse.json();

        if (userResponse.ok) {
          setUser(userData.user);
        } else {
          // Si el token es inválido o expiró, la API podría devolver 401/403
          if (userResponse.status === 401 || userResponse.status === 403) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error(userData.error || 'Error al cargar datos del usuario.');
        }

        // Obtener pagos del usuario
        // ¡NUEVO! Usa la variable de entorno para la URL del backend
        const paymentsResponse = await fetch(import.meta.env.VITE_API_URL + '/api/me/pagos', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const paymentsData = await paymentsResponse.json();

        if (paymentsResponse.ok) {
          setPayments(paymentsData);
        } else {
          // Si el token es inválido o expiró, la API podría devolver 401/403
          if (paymentsResponse.status === 401 || paymentsResponse.status === 403) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error(paymentsData.error || 'Error al cargar pagos.');
        }

      } catch (err) {
        console.error('Error al cargar dashboard:', err);
        setError(err.message || 'Error desconocido al cargar datos.');
        // Manejo más robusto para errores de token en cualquier fetch
        if (err.message.includes('Unauthorized') || err.message.includes('Forbidden')) {
          localStorage.removeItem('token'); // Limpiar token inválido
          navigate('/login');
        }
      } finally {
        setLoading(false); // Siempre termina el estado de carga
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // --- Renderizado Condicional ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        <p className="text-gray-700 text-xl">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error al Cargar</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={handleLogout}
            className="bg-blue-600 text-white p-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
          >
            Volver a Login
          </button>
        </div>
      </div>
    );
  }

  // Si no está cargando y no hay error, renderiza el dashboard
  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-blue-700">PrFin - Mi Cuenta</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded-md font-semibold hover:bg-red-600 transition duration-300 text-sm"
        >
          Cerrar Sesión
        </button>
      </header>

      <main className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Tarjeta de Resumen del Usuario */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">¡Hola, {user?.nombre_completo}!</h2>
            <p className="text-gray-700 mb-2">Tu número: {user?.telefono_whatsapp}</p>
            <p className="text-gray-700 mb-2">Estado de cuenta: <span className={`${user?.activo ? 'text-green-600' : 'text-red-600'} font-bold`}>{user?.activo ? 'Activo' : 'Inactivo'}</span></p>
            <p className="text-gray-700 text-lg font-bold mt-4">Saldo Pendiente: <span className="text-red-500">${Number(user?.saldo_pendiente_total || 0).toFixed(2)}</span></p>
          </div>

          {/* Tarjeta de Próxima Cuota (Ejemplo, requeriría lógica más compleja) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Próxima Cuota</h2>
            {payments.length > 0 && payments.find(p => p.estado === 'PENDIENTE') ? (
              <>
                <p className="text-gray-700 mb-2">Fecha: {new Date(payments.find(p => p.estado === 'PENDIENTE')?.fecha_cuota).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-2">Monto: ${Number(payments.find(p => p.estado === 'PENDIENTE')?.monto_cuota || 0).toFixed(2)}</p>
                <p className="text-yellow-600 font-semibold">Estado: Pendiente</p>
              </>
            ) : (
              <p className="text-gray-500">No hay cuotas pendientes.</p>
            )}
          </div>

          {/* Tarjeta de Resumen de Pagos (Ejemplo) */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen Rápido</h2>
            <p className="text-gray-700">Cuotas Pagadas: {payments.filter(p => p.estado === 'PAGADO').length}</p>
            <p className="text-gray-700">Cuotas Pendientes: {payments.filter(p => p.estado === 'PENDIENTE').length}</p>
            <p className="text-gray-700">Cuotas Atrasadas: {payments.filter(p => p.estado === 'ATRASADO').length}</p>
          </div>
        </div>

        {/* Historial de Pagos Detallado */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Historial de Pagos</h2>
          {payments.length === 0 ? (
            <p className="text-gray-500 text-center">No hay historial de pagos disponible.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Fecha Cuota</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Monto Cuota</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Monto Pagado</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Fecha Pago</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{new Date(payment.fecha_cuota).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b">${Number(payment.monto_cuota || 0).toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">${Number(payment.monto_pagado || 0).toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">
                        {payment.fecha_pago ? new Date(payment.fecha_pago).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className={`py-2 px-4 border-b font-semibold ${
                        payment.estado === 'PAGADO' ? 'text-green-600' :
                        payment.estado === 'PENDIENTE' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {payment.estado}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;