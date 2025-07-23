// C:\Users\1vkwi\prfin-app\frontend\src\pages\CobradorDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CobradorDashboard() {
  const [assignedClients, setAssignedClients] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch para obtener clientes asignados
        const clientsResponse = await fetch(import.meta.env.VITE_API_URL + '/api/cobrador/mis-clientes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const clientsData = await clientsResponse.json();

        if (clientsResponse.ok) {
          setAssignedClients(clientsData);
        } else {
          if (clientsResponse.status === 401 || clientsResponse.status === 403) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error(clientsData.error || 'Error al cargar clientes asignados.');
        }

        // Fetch para obtener pagos pendientes de esos clientes
        const paymentsResponse = await fetch(import.meta.env.VITE_API_URL + '/api/cobrador/mis-pagos-pendientes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const paymentsData = await paymentsResponse.json();

        if (paymentsResponse.ok) {
          setPendingPayments(paymentsData);
        } else {
          if (paymentsResponse.status === 401 || paymentsResponse.status === 403) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error(paymentsData.error || 'Error al cargar pagos pendientes.');
        }

      } catch (err) {
        console.error('Error al cargar dashboard de cobrador:', err);
        setError(err.message || 'Error desconocido al cargar datos.');
        if (err.message.includes('Unauthorized') || err.message.includes('Forbidden')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        <p className="text-gray-700 text-xl">Cargando panel de cobrador...</p>
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md mb-6">
        <h1 className="text-2xl font-bold text-blue-700">PrFin - Panel de Cobrador</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded-md font-semibold hover:bg-red-600 transition duration-300 text-sm"
        >
          Cerrar Sesión
        </button>
      </header>

      <main className="container mx-auto">
        {/* Sección de Clientes Asignados */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Mis Clientes Asignados</h2>
          {assignedClients.length === 0 ? (
            <p className="text-gray-500 text-center">No tienes clientes asignados aún.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Nombre</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Teléfono</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Saldo Pendiente</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedClients.map((client) => (
                    <tr key={client.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{client.nombre_completo}</td>
                      <td className="py-2 px-4 border-b">{client.telefono_whatsapp}</td>
                      <td className="py-2 px-4 border-b">${Number(client.saldo_pendiente_total || 0).toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`font-semibold ${client.activo ? 'text-green-600' : 'text-red-600'}`}>
                          {client.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sección de Pagos Pendientes de Mis Clientes */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Pagos Pendientes de Mis Clientes</h2>
          {pendingPayments.length === 0 ? (
            <p className="text-gray-500 text-center">No hay pagos pendientes para tus clientes.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Cliente</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Teléfono Cliente</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Fecha Cuota</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Monto Cuota</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Monto Pagado</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Estado</th>
                    {/* Puedes añadir una columna para "Registrar Pago" aquí */}
                  </tr>
                </thead>
                <tbody>
                  {pendingPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{payment.cliente_nombre}</td>
                      <td className="py-2 px-4 border-b">{payment.cliente_telefono}</td>
                      <td className="py-2 px-4 border-b">{new Date(payment.fecha_cuota).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b">${Number(payment.monto_cuota || 0).toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">${Number(payment.monto_pagado || 0).toFixed(2)}</td>
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

export default CobradorDashboard;