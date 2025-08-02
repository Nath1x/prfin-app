// C:\Users\1vkwi\prfin-app\frontend\src\pages\CobradorDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CobradorDashboard() {
  const [assignedClients, setAssignedClients] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [selectedClientId, setSelectedClientId] = useState(''); 
  const [selectedClientName, setSelectedClientName] = useState('');

  // ¡NUEVOS ESTADOS! Para el formulario de registro de pago del cobrador
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentError, setPaymentError] = useState('');


  // Función para cargar los datos iniciales (solo clientes asignados)
  const fetchInitialData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
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

    } catch (err) {
      console.error('Error al cargar datos iniciales del cobrador:', err);
      setError(err.message || 'Error desconocido al cargar datos iniciales.');
      if (err.message.includes('Unauthorized') || err.message.includes('Forbidden')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false); 
    }
  };

  // Función para cargar pagos de un cliente específico
  const fetchClientPayments = async (clientId) => {
    if (!clientId) {
      setPendingPayments([]);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setError(''); 

    try {
      // ¡AJUSTE CLAVE AQUÍ! Ahora busca pagos por el clientId
      const paymentsResponse = await fetch(import.meta.env.VITE_API_URL + `/api/cobrador/mis-pagos-pendientes?clientId=${clientId}`, {
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
        throw new Error(paymentsData.error || 'Error al cargar pagos pendientes del cliente.');
      }
    } catch (err) {
      console.error('Error al cargar pagos del cliente:', err);
      setError(err.message || 'Error desconocido al cargar pagos del cliente.');
      if (err.message.includes('Unauthorized') || err.message.includes('Forbidden')) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } 
  };

  // ¡NUEVA FUNCIÓN! Para registrar un pago desde el cobrador
  const handleRegisterPayment = async (paymentId, currentMontoCuota, currentMontoPagado) => {
    // Limpia mensajes anteriores
    setPaymentMessage(''); 
    setPaymentError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setPaymentError('No autenticado. Por favor, inicia sesión de nuevo.');
      navigate('/login');
      return;
    }

    // Validación básica, el cobrador solo paga la cuota pendiente.
    // Podríamos pedir un input de monto, pero para simplicidad, asumimos que paga lo que falta.
    const montoAPagar = Number(currentMontoCuota) - Number(currentMontoPagado);
    if (montoAPagar <= 0) {
      setPaymentError('Esta cuota ya está pagada.');
      return;
    }

    if (!window.confirm(`¿Confirmas el pago de $${montoAPagar.toFixed(2)} para esta cuota?`)) {
      return; // Si el cobrador cancela, no hacemos nada
    }

    try {
      // Reutilizamos la ruta de pago del admin, pero la protegeremos con rol 'cobrador' en el backend
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/admin/pagar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pago_id: paymentId,
          monto_pagado: montoAPagar, // Asumimos que paga el monto restante
          referencia_pago: 'Pago Cobrador' // Puedes añadir un input para esto si quieres
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentMessage('Pago registrado exitosamente.');
        // Recargar solo los pagos del cliente seleccionado para que la lista se actualice
        fetchClientPayments(selectedClientId); 
        // También actualiza el saldo del cliente en la lista de clientes
        fetchInitialData(); // Para recargar la lista de clientes y sus saldos
      } else {
        setPaymentError(data.error || 'Error al registrar pago.');
      }
    } catch (err) {
      console.error('Error de red al registrar pago:', err);
      setPaymentError('No se pudo conectar al servidor para registrar pago.');
    }
  };


  // useEffect inicial para cargar SOLO los clientes asignados al inicio
  useEffect(() => {
    fetchInitialData();
  }, [navigate]);

  // NUEVO useEffect! Para cargar pagos cuando se selecciona un cliente
  useEffect(() => {
    if (selectedClientId) {
      const client = assignedClients.find(c => String(c.id) === String(selectedClientId));
      setSelectedClientName(client ? client.nombre_completo : '');
      fetchClientPayments(selectedClientId);
    } else {
      setPendingPayments([]); // Si no hay cliente seleccionado, limpia los pagos
      setSelectedClientName('');
    }
  }, [selectedClientId, assignedClients]); // Depende de selectedClientId y assignedClients para buscar el nombre

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
        {/* Sección de Clientes Asignados - Ahora con un Selector */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Seleccionar Cliente</h2>
          {assignedClients.length === 0 ? (
            <p className="text-gray-500 text-center">No tienes clientes asignados aún.</p>
          ) : (
            <div className="space-y-4">
              <select
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
              >
                <option value="">-- Selecciona un cliente --</option>
                {assignedClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nombre_completo} ({client.telefono_whatsapp}) - Saldo: ${Number(client.saldo_pendiente_total || 0).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Mensajes de resultado del pago */}
        {paymentMessage && <p className="mt-4 text-green-600 font-semibold text-center">{paymentMessage}</p>}
        {paymentError && <p className="mt-4 text-red-600 font-semibold text-center">{paymentError}</p>}


        {/* Sección de Pagos Pendientes - Se muestra solo si hay cliente seleccionado */}
        {selectedClientId && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pagos Pendientes de {selectedClientName}</h2>
            {pendingPayments.length === 0 ? (
              <p className="text-gray-500 text-center">No hay pagos pendientes para este cliente.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b text-left text-gray-600">ID Pago</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600">Fecha Cuota</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600">Monto Cuota</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600">Monto Pagado</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600">Estado</th>
                      <th className="py-2 px-4 border-b text-left text-gray-600">Acciones</th> {/* ¡AJUSTE CLAVE! */}
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b text-sm">{payment.id}</td>
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
                        <td className="py-2 px-4 border-b"> {/* ¡AJUSTE CLAVE! Botón de pago */}
                          {payment.estado !== 'PAGADO' && ( // Solo muestra el botón si no está PAGADO
                            <button
                              onClick={() => handleRegisterPayment(payment.id, payment.monto_cuota, payment.monto_pagado)}
                              className="bg-blue-600 text-white p-1 rounded-md text-xs hover:bg-blue-700 transition duration-300"
                            >
                              Registrar Pago
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default CobradorDashboard;