// C:\Users\1vkwi\prfin-app\frontend\src\pages\AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Estado para el formulario de nuevo usuario
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  // ¡NUEVO AJUSTE! Estado para el rol del nuevo usuario
  const [newUserRole, setNewUserRole] = useState('cliente'); 
  // ¡NUEVO ESTADO! Para el cobrador seleccionado al registrar nuevo usuario
  const [selectedCobradorForNewUser, setSelectedCobradorForNewUser] = useState(''); 
  const [registerMessage, setRegisterMessage] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Estado para el formulario de nuevo préstamo
   const [selectedUserId, setSelectedUserId] = useState('');
   const [montoPrestamo, setMontoPrestamo] = useState('');
   const [plazoDias, setPlazoDias] = useState('');
  const [loanMessage, setLoanMessage] = useState('');
  const [loanError, setLoanError] = useState('');

  // ESTADOS para el formulario de registro de pago
   const [selectedUserForPayment, setSelectedUserForPayment] = useState('');
   const [userPaymentsToRegister, setUserPaymentsToRegister] = useState([]); 
   const [selectedPaymentId, setSelectedPaymentId] = useState('');
   const [paymentAmount, setPaymentAmount] = useState('');
   const [paymentRef, setPaymentRef] = useState('');
   const [paymentMessage, setPaymentMessage] = useState('');
   const [paymentError, setPaymentError] = useState('');


  // ESTADOS para listar y gestionar préstamos
  const [loans, setLoans] = useState([]);
  const [deleteLoanMessage, setDeleteLoanMessage] = useState('');
  const [deleteLoanError, setDeleteLoanError] = useState('');

  // ¡NUEVO ESTADO! Para guardar la lista de cobradores
  const [cobradoresList, setCobradoresList] = useState([]);


  // Función para cargar usuarios (se usará en useEffect y al registrar usuario/préstamo/pago)
  const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
          navigate('/login');
          return;
      }
      setLoading(true); 
      try {
          const response = await fetch(import.meta.env.VITE_API_URL + '/api/admin/usuarios', {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
          const data = await response.json();
          if (response.ok) {
              setUsers(data);
              // ¡AJUSTE CLAVE AQUÍ! Filtra los cobradores de la lista de usuarios
              setCobradoresList(data.filter(user => user.rol === 'cobrador'));
          } else {
              if (response.status === 401 || response.status === 403) {
                  localStorage.removeItem('token');
                  navigate('/login');
                  return;
              }
              throw new Error(data.error || 'Error al cargar usuarios.');
          }
      } catch (err) {
          console.error('Error al cargar usuarios:', err);
          setError(err.message || 'Error desconocido al cargar usuarios.');
          if (err.message.includes('Unauthorized') || err.message.includes('Forbidden')) {
              localStorage.removeItem('token');
              navigate('/login');
          }
      } finally { 
          setLoading(false); 
      }
  };

  // Función para obtener pagos pendientes/parciales de un usuario para el formulario de pago
  const fetchUserPaymentsForRegistration = async (userId) => {
    if (!userId) {
        setUserPaymentsToRegister([]);
        return;
    }
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(import.meta.env.VITE_API_URL + `/api/admin/pagos/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json(); 
        if (response.ok) {
            const pendingOrPartial = data.filter(p => 
                p.estado === 'PENDIENTE' || 
                p.estado === 'ATRASADO' || 
                (p.estado === 'PARCIAL' && Number(p.monto_pagado) < Number(p.monto_cuota)) 
            );
            setUserPaymentsToRegister(pendingOrPartial);
        } else {
            setPaymentError(data.error || 'Error al cargar pagos del usuario para registro.');
            setUserPaymentsToRegister([]);
        }
    } catch (err) {
        console.error('Error al cargar pagos del usuario para registro:', err);
        setPaymentError('Error de red al cargar pagos.');
        setUserPaymentsToRegister([]);
    }
  };

  // Función: Obtener todos los préstamos (para la tabla de préstamos)
  const fetchLoans = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/admin/prestamos', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setLoans(data);
      } else {
        setDeleteLoanError(data.error || 'Error al cargar préstamos.'); 
      }
    } catch (err) {
      console.error('Error al cargar préstamos:', err);
      setDeleteLoanError('Error de red al cargar préstamos.');
    } finally {
        setLoading(false); 
    }
  };

  const handleDeleteLoan = async (loanId) => {
    setDeleteLoanMessage('');
    setDeleteLoanError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setDeleteLoanError('No autenticado. Por favor, inicia sesión de nuevo.');
      navigate('/login');
      return;
    }

    if (window.confirm('¿Estás seguro de que quieres eliminar este préstamo? Esto borrará todas sus cuotas asociadas y ajustará el saldo del usuario.')) {
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + `/api/admin/prestamos/${loanId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setDeleteLoanMessage(data.message);
                fetchUsers(); // Recargar usuarios para actualizar saldos
                fetchLoans(); // Recargar la lista de préstamos
                if (selectedUserForPayment) {
                    fetchUserPaymentsForRegistration(selectedUserForPayment);
                }
            } else {
                setDeleteLoanError(data.error || 'Error al eliminar préstamo.');
            }
        } catch (err) {
            console.error('Error de red al eliminar préstamo:', err);
            setDeleteLoanError('No se pudo conectar al servidor para eliminar préstamo.');
        }
    }
  };


  // useEffect principal para cargar usuarios y préstamos al inicio
  useEffect(() => {
    const loadAllData = async () => {
        await fetchUsers(); 
        await fetchLoans();
    };
    loadAllData();
  }, [navigate]);


  // useEffect para recargar cuotas cuando cambia el usuario seleccionado para pagar
  useEffect(() => {
    if (selectedUserForPayment) {
        fetchUserPaymentsForRegistration(selectedUserForPayment);
    } else {
        setUserPaymentsToRegister([]);
        setSelectedPaymentId(''); 
    }
  }, [selectedUserForPayment]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setRegisterMessage('');
    setRegisterError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setRegisterError('No autenticado. Por favor, inicia sesión de nuevo.');
      navigate('/login');
      return;
    }

    try {
      // ¡AJUSTE CLAVE AQUÍ! Enviar el rol seleccionado y el cobrador_asignado_id
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          nombre_completo: newUserName,
          telefono_whatsapp: newUserPhone,
          password: newUserPassword,
          rol: newUserRole, // ¡NUEVO AJUSTE! Enviamos el rol seleccionado
          cobrador_asignado_id: selectedCobradorForNewUser || null 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setRegisterMessage(data.message);
        setNewUserName('');
        setNewUserPhone('');
        setNewUserPassword('');
        setNewUserRole('cliente'); // Resetea a 'cliente' por defecto después del registro
        setSelectedCobradorForNewUser(''); // ¡NUEVO! Limpia el selector de cobrador
        fetchUsers(); // Volver a cargar la lista de usuarios y cobradores

        if (selectedUserForPayment) { 
            fetchUserPaymentsForRegistration(selectedUserForPayment);
        }

      } else {
        setRegisterError(data.error || 'Error al registrar usuario.');
      }
    } catch (err) {
      console.error('Error de red al registrar usuario:', err);
      setRegisterError('No se pudo conectar al servidor para registrar usuario.');
    } 
  };

  const handleRegisterLoan = async (e) => {
    e.preventDefault();
    setLoanMessage('');
    setLoanError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setLoanError('No autenticado. Por favor, inicia sesión de nuevo.');
      navigate('/login');
      return;
    }

    if (isNaN(parseFloat(montoPrestamo)) || isNaN(parseInt(plazoDias))) { 
        setLoanError('El monto del préstamo y el plazo deben ser números válidos.');
        return;
    }


    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/admin/prestamos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          usuario_id: selectedUserId,
          monto_prestamo: parseFloat(montoPrestamo),
          plazo_dias: parseInt(plazoDias),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setLoanMessage(data.message + ` Monto total a pagar: $${Number(data.prestamo.monto_total_a_pagar).toFixed(2)}. Cuota diaria: $${Number(data.prestamo.monto_cuota_diaria).toFixed(2)}`);
        setSelectedUserId('');
        setMontoPrestamo('');
        setPlazoDias('');
        fetchUsers(); // Recargar usuarios
        fetchLoans(); // Recargar préstamos
        if (selectedUserId === selectedUserForPayment) {
            fetchUserPaymentsForRegistration(selectedUserForPayment);
        }

      } else {
        setLoanError(data.error || 'Error al registrar préstamo.');
      }
    } catch (err) {
      console.error('Error de red al registrar préstamo:', err);
      setLoanError('No se pudo conectar al servidor para registrar préstamo.');
    }
  };

  const handleRegisterPayment = async (e) => {
    e.preventDefault();
    setPaymentMessage('');
    setPaymentError('');

    const token = localStorage.getItem('token');
    if (!token) {
      setPaymentError('No autenticado. Por favor, inicia sesión de nuevo.');
      navigate('/login');
      return;
    }

    if (!selectedPaymentId || !paymentAmount) {
        setPaymentError('Por favor, selecciona una cuota y un monto a pagar.');
        return;
    }

    const parsedPaymentAmount = parseFloat(paymentAmount);
    if (isNaN(parsedPaymentAmount) || parsedPaymentAmount <= 0) {
        setPaymentError('Monto a pagar debe ser un número válido y mayor a cero.');
        return;
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/admin/pagar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          pago_id: selectedPaymentId,
          monto_pagado: parsedPaymentAmount,
          referencia_pago: paymentRef
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentMessage(data.message);
        setSelectedPaymentId('');
        setPaymentAmount('');
        setPaymentRef('');
        fetchUsers(); // Recargar usuarios
        fetchLoans(); // Recargar préstamos
        if (selectedUserForPayment) {
            fetchUserPaymentsForRegistration(selectedUserForPayment);
        }

      } else {
        setPaymentError(data.error || 'Error al registrar pago.');
      }
    } catch (err) {
      console.error('Error de red al registrar pago:', err);
      setPaymentError('No se pudo conectar al servidor para registrar pago.');
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center font-sans">
        <p className="text-gray-700 text-xl">Cargando panel de administración...</p>
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
        <h1 className="text-2xl font-bold text-blue-700">PrFin - Panel de Administración</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded-md font-semibold hover:bg-red-600 transition duration-300 text-sm"
        >
          Cerrar Sesión
        </button>
      </header>

      <main className="container mx-auto">
        {/* Formulario para agregar nuevo usuario */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Agregar Nuevo Usuario</h2>
            <form onSubmit={handleRegisterUser} className="space-y-4">
                <div>
                    <input
                        type="text"
                        placeholder="Nombre Completo"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Teléfono WhatsApp (ej. +521234567890)"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={newUserPhone}
                        onChange={(e) => setNewUserPhone(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Contraseña Inicial"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        required
                    />
                </div>
                {/* ¡NUEVO AJUSTE! Selector para el Rol del nuevo usuario */}
                <div>
                    <select
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value)}
                        required
                    >
                        <option value="cliente">Cliente</option>
                        <option value="cobrador">Cobrador</option>
                        {/* Opcional: <option value="admin">Administrador</option> si quieres crear admins desde aquí */}
                    </select>
                </div>
                {/* ¡AJUSTE CLAVE AQUÍ! Selector para asignar cobrador */}
                {cobradoresList.length > 0 && newUserRole === 'cliente' && ( // Solo muestra si hay cobradores y el rol es 'cliente'
                    <div>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={selectedCobradorForNewUser}
                            onChange={(e) => setSelectedCobradorForNewUser(e.target.value)}
                        >
                            <option value="">-- Asignar Cobrador (Opcional) --</option>
                            {cobradoresList.map(cobrador => (
                                <option key={cobrador.id} value={cobrador.id}>
                                    {cobrador.nombre_completo} ({cobrador.telefono_whatsapp})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <button
                    type="submit"
                    className="bg-green-600 text-white p-3 rounded-md font-semibold hover:bg-green-700 transition duration-300"
                >
                    Registrar Usuario
                </button>
            </form>
            {registerMessage && <p className="mt-4 text-green-600">{registerMessage}</p>}
            {registerError && <p className="mt-4 text-red-600">{registerError}</p>}
        </div>

        {/* Formulario para registrar un nuevo préstamo (MODIFICADO) */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Registrar Nuevo Préstamo</h2>
            <form onSubmit={handleRegisterLoan} className="space-y-4">
                <div>
                    <select
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un Usuario</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.nombre_completo} ({user.telefono_whatsapp})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Monto del Préstamo (ej. 1000.00)"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={montoPrestamo}
                        onChange={(e) => setMontoPrestamo(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="number"
                        step="1"
                        placeholder="Plazo en Días (ej. 30)"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={plazoDias}
                        onChange={(e) => setPlazoDias(e.target.value)}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
                >
                    Registrar Préstamo
                </button>
            </form>
            {loanMessage && <p className="mt-4 text-green-600">{loanMessage}</p>}
            {loanError && <p className="mt-4 text-red-600">{loanError}</p>}
        </div>


        {/* Formulario para registrar un pago */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Registrar Pago</h2>
            <form onSubmit={handleRegisterPayment} className="space-y-4">
                <div>
                    <select
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={selectedUserForPayment}
                        onChange={(e) => setSelectedUserForPayment(e.target.value)}
                        required
                    >
                        <option value="">Selecciona un Usuario para el Pago</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.nombre_completo} ({user.telefono_whatsapp})
                            </option>
                        ))}
                    </select>
                </div>
                {selectedUserForPayment && userPaymentsToRegister.length > 0 && (
                    <div>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-md"
                            value={selectedPaymentId}
                            onChange={(e) => setSelectedPaymentId(e.target.value)}
                            required
                        >
                            <option value="">Selecciona una Cuota</option>
                            {userPaymentsToRegister.map(payment => (
                                <option key={payment.id} value={payment.id}>
                                    {new Date(payment.fecha_cuota).toLocaleDateString()} - ${Number(payment.monto_cuota || 0).toFixed(2)} ({payment.estado}) - Pagado: ${Number(payment.monto_pagado || 0).toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {selectedUserForPayment && userPaymentsToRegister.length === 0 && (
                    <p className="text-gray-500 text-sm">Este usuario no tiene cuotas pendientes o parciales.</p>
                )}
                <div>
                    <input
                        type="number"
                        step="0.01"
                        placeholder="Monto a Pagar (ej. 50.00)"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Referencia de Pago (Opcional)"
                        className="w-full p-3 border border-gray-300 rounded-md"
                        value={paymentRef}
                        onChange={(e) => setPaymentRef(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="bg-purple-600 text-white p-3 rounded-md font-semibold hover:bg-purple-700 transition duration-300"
                >
                    Registrar Abono
                </button>
            </form>
            {paymentMessage && <p className="mt-4 text-green-600">{paymentMessage}</p>}
            {paymentError && <p className="mt-4 text-red-600">{paymentError}</p>}
        </div>

        {/* Lista de Préstamos */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Lista de Préstamos</h2>
            {deleteLoanMessage && <p className="mb-4 text-green-600">{deleteLoanMessage}</p>}
            {deleteLoanError && <p className="mb-4 text-red-600">{deleteLoanError}</p>}
            {loans.length === 0 ? (
                <p className="text-gray-500 text-center">No hay préstamos registrados aún.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left text-gray-600">ID Préstamo</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Usuario</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Monto Capital</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Monto Total</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Cuota Diaria</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Plazo (Días)</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Fecha Inicio</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Estado</th>
                                <th className="py-2 px-4 border-b text-left text-gray-600">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan) => (
                                <tr key={loan.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b text-sm">{loan.id}</td>
                                    <td className="py-2 px-4 border-b">{loan.nombre_completo}</td>
                                    <td className="py-2 px-4 border-b">${Number(loan.monto_capital || 0).toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b">${Number(loan.monto_total_a_pagar || 0).toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b">${Number(loan.monto_cuota_diaria || 0).toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b">{loan.plazo_dias}</td>
                                    <td className="py-2 px-4 border-b">{new Date(loan.fecha_inicio).toLocaleDateString()}</td>
                                    <td className="py-2 px-4 border-b">{loan.estado_prestamo}</td>
                                    <td className="py-2 px-4 border-b">
                                        <button
                                            onClick={() => handleDeleteLoan(loan.id)}
                                            className="bg-red-500 text-white p-1 rounded-md text-xs hover:bg-red-600 transition duration-300"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>


        {/* Lista de Usuarios */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lista de Usuarios</h2>
          {users.length === 0 ? (
            <p className="text-gray-500 text-center">No hay usuarios registrados aún.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-gray-600">ID Usuario</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Nombre</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Teléfono</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Saldo Pendiente</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Estado</th>
                    <th className="py-2 px-4 border-b text-left text-gray-600">Rol</th> 
                    <th className="py-2 px-4 border-b text-left text-gray-600">Cobrador Asignado</th> 
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{user.id}</td>
                      <td className="py-2 px-4 border-b">{user.nombre_completo}</td>
                      <td className="py-2 px-4 border-b">{user.telefono_whatsapp}</td>
                      <td className="py-2 px-4 border-b">${Number(user.saldo_pendiente_total || 0).toFixed(2)}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`font-semibold ${user.activo ? 'text-green-600' : 'text-red-600'}`}>
                          {user.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">{user.rol}</td> 
                      {/* ¡AJUSTE CLAVE AQUÍ! Mostrar nombre del cobrador en lugar de solo ID */}
                      <td className="py-2 px-4 border-b">
                        {user.cobrador_asignado_id 
                            ? (cobradoresList.find(c => String(c.id) === String(user.cobrador_asignado_id))?.nombre_completo || user.cobrador_asignado_id) 
                            : 'N/A'}
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

export default AdminDashboard;