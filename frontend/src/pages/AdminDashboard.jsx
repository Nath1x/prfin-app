// src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// --- Iconos para la Interfaz ---
const Logo = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const HomeIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const UsersIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0112 13.5a5.995 5.995 0 013 1.182" /></svg>;
const LoansIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const LogoutIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const CloseIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const PaymentsIcon = () => <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.75A.75.75 0 013 4.5h.75m0 0H21m-9 6h9" /></svg>;


function AdminDashboard() {
  const navigate = useNavigate();

  // --- ESTADOS DE LA INTERFAZ ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isLoanModalOpen, setLoanModalOpen] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // --- ESTADOS DE DATOS ---
  const [users, setUsers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [cobradoresList, setCobradoresList] = useState([]);
  const [userPaymentsToRegister, setUserPaymentsToRegister] = useState([]);

  // --- ESTADOS DE FORMULARIOS ---
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('cliente');
  const [selectedCobradorForNewUser, setSelectedCobradorForNewUser] = useState('');
  
  const [selectedUserId, setSelectedUserId] = useState('');
  const [montoPrestamo, setMontoPrestamo] = useState('');
  const [plazoDias, setPlazoDias] = useState('29');
  
  const [selectedUserForPayment, setSelectedUserForPayment] = useState('');
  const [selectedPaymentId, setSelectedPaymentId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentRef, setPaymentRef] = useState('');

  // --- ESTADOS PARA CÁLCULOS AUTOMÁTICOS ---
  const [calculatedTotal, setCalculatedTotal] = useState(0);
  const [calculatedDaily, setCalculatedDaily] = useState(0);


  // --- LÓGICA DE NOTIFICACIONES ---
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // --- LÓGICA DE OBTENCIÓN DE DATOS (FETCHING) ---
  const fetchAllData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const [usersResponse, loansResponse] = await Promise.all([
        fetch('https://prfin-backend.onrender.com/api/admin/usuarios', { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch('https://prfin-backend.onrender.com/api/admin/prestamos', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const usersData = await usersResponse.json();
      const loansData = await loansResponse.json();

      if (usersResponse.ok) {
        setUsers(usersData);
        setCobradoresList(usersData.filter(user => user.rol === 'cobrador'));
      } else {
        throw new Error(usersData.error || 'Error al cargar usuarios.');
      }

      if (loansResponse.ok) {
        setLoans(loansData);
      } else {
        throw new Error(loansData.error || 'Error al cargar préstamos.');
      }

    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPaymentsForRegistration = async (userId) => {
    if (!userId) { setUserPaymentsToRegister([]); return; }
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`https://prfin-backend.onrender.com/api/admin/pagos/${userId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json(); 
        if (response.ok) {
            const pendingPayments = data.filter(p => p.estado !== 'PAGADO');
            setUserPaymentsToRegister(pendingPayments);
            // --- AUTOMATIZACIÓN: Seleccionar la primera cuota pendiente ---
            if (pendingPayments.length > 0) {
                setSelectedPaymentId(pendingPayments[0].id);
            }
        } else {
            throw new Error(data.error || 'Error al cargar pagos del usuario.');
        }
    } catch (err) {
        console.error('Error al cargar pagos del usuario:', err);
        showNotification(err.message, 'error');
    }
  };


  // --- LÓGICA DE MANEJO DE FORMULARIOS Y ACCIONES ---
  const handleRegisterUser = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const fullPhoneNumber = `+52${newUserPhone}`;
    try {
      const response = await fetch('https://prfin-backend.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          nombre_completo: newUserName,
          telefono_whatsapp: fullPhoneNumber,
          password: newUserPassword,
          rol: newUserRole,
          cobrador_asignado_id: selectedCobradorForNewUser || null 
        }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(data.message);
        setNewUserName(''); setNewUserPhone(''); setNewUserPassword(''); setNewUserRole('cliente'); setSelectedCobradorForNewUser('');
        setUserModalOpen(false);
        fetchAllData();
      } else { throw new Error(data.error); }
    } catch (err) {
      showNotification(err.message, 'error');
    } 
  };
  
  const handleRegisterLoan = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://prfin-backend.onrender.com/api/admin/prestamos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          usuario_id: selectedUserId,
          monto_prestamo: parseFloat(montoPrestamo),
          plazo_dias: parseInt(plazoDias),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(data.message);
        setSelectedUserId(''); setMontoPrestamo(''); setPlazoDias('29');
        setLoanModalOpen(false);
        fetchAllData();
      } else { throw new Error(data.error); }
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  const handleRegisterPayment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://prfin-backend.onrender.com/api/admin/pagar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          pago_id: selectedPaymentId,
          monto_pagado: parseFloat(paymentAmount),
          referencia_pago: paymentRef
        }),
      });
      const data = await response.json();
      if (response.ok) {
        showNotification(data.message);
        setSelectedUserForPayment(''); setSelectedPaymentId(''); setPaymentAmount(''); setPaymentRef('');
        fetchAllData();
      } else { throw new Error(data.error); }
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };
  
  const handleDeleteLoan = async (loanId) => {
    const token = localStorage.getItem('token');
    if (window.confirm('¿Estás seguro de que quieres eliminar este préstamo? Esta acción no se puede deshacer.')) {
        try {
            const response = await fetch(`https://prfin-backend.onrender.com/api/admin/prestamos/${loanId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (response.ok) {
                showNotification(data.message);
                fetchAllData();
            } else { throw new Error(data.error); }
        } catch (err) {
            showNotification(err.message, 'error');
        }
    }
  };

  // --- EFECTOS ---
  useEffect(() => {
    fetchAllData();
  }, [navigate]);

  useEffect(() => {
    if (selectedUserForPayment) {
        fetchUserPaymentsForRegistration(selectedUserForPayment);
    } else {
        setUserPaymentsToRegister([]);
        setSelectedPaymentId(''); 
    }
  }, [selectedUserForPayment]);

  useEffect(() => {
    const tasaInteres = 0.32;
    const monto = parseFloat(montoPrestamo) || 0;
    const plazo = parseInt(plazoDias, 10) || 1;

    if (monto > 0) {
      const montoTotal = monto * (1 + tasaInteres);
      const cuotaDiaria = montoTotal / plazo;
      setCalculatedTotal(montoTotal);
      setCalculatedDaily(cuotaDiaria);
    } else {
      setCalculatedTotal(0);
      setCalculatedDaily(0);
    }
  }, [montoPrestamo, plazoDias]);

  // --- AUTOMATIZACIÓN: Rellenar monto de pago al seleccionar cuota ---
  useEffect(() => {
    if (selectedPaymentId) {
        const payment = userPaymentsToRegister.find(p => p.id === parseInt(selectedPaymentId));
        if (payment) {
            const remaining = parseFloat(payment.monto_cuota) - parseFloat(payment.monto_pagado);
            setPaymentAmount(remaining.toFixed(2));
        }
    }
  }, [selectedPaymentId, userPaymentsToRegister]);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // --- CÁLCULO DE MÉTRICAS ---
  const totalUsers = users.length;
  const activeLoans = loans.filter(loan => loan.estado === 'ACTIVO').length;
  const totalPending = users.reduce((acc, user) => acc + parseFloat(user.saldo_pendiente_total || 0), 0);

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200">
          <Link to="/" className="flex items-center gap-x-2"><Logo /><span className="font-semibold text-gray-800 text-lg">PrFin-App</span></Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <button onClick={() => setActiveView('dashboard')} className={`w-full flex items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeView === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}><HomeIcon /> Dashboard</button>
          <button onClick={() => setActiveView('users')} className={`w-full flex items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeView === 'users' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}><UsersIcon /> Usuarios</button>
          <button onClick={() => setActiveView('loans')} className={`w-full flex items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeView === 'loans' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}><LoansIcon /> Préstamos</button>
          <button onClick={() => setActiveView('payments')} className={`w-full flex items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium ${activeView === 'payments' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}><PaymentsIcon /> Registrar Pago</button>
        </nav>
        <div className="px-4 py-4 border-t border-gray-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"><LogoutIcon /> Cerrar Sesión</button>
        </div>
      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 p-8 overflow-auto">
        {loading ? <div className="text-center text-gray-500">Cargando datos...</div> : error ? <div className="text-center text-red-600 p-4 bg-red-50 rounded-md">Error: {error}</div> :
        <div className="max-w-7xl mx-auto">
            {activeView === 'dashboard' && (
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard General</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100"><p className="text-sm font-medium text-gray-500">Total de Usuarios</p><p className="text-3xl font-bold text-gray-900">{totalUsers}</p></div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100"><p className="text-sm font-medium text-gray-500">Préstamos Activos</p><p className="text-3xl font-bold text-gray-900">{activeLoans}</p></div>
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100"><p className="text-sm font-medium text-gray-500">Saldo Pendiente Total</p><p className="text-3xl font-bold text-gray-900">${totalPending.toLocaleString('es-MX', {minimumFractionDigits: 2})}</p></div>
                    </div>
                </div>
            )}
            
            {activeView === 'users' && (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                        <button onClick={() => setUserModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 transition-transform hover:scale-105">+ Registrar Usuario</button>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo Pendiente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cobrador</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nombre_completo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.telefono_whatsapp}</td>
                                            <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.rol === 'admin' ? 'bg-red-100 text-red-800' : user.rol === 'cobrador' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{user.rol}</span></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(user.saldo_pendiente_total || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.cobrador_asignado_id ? (cobradoresList.find(c => String(c.id) === String(user.cobrador_asignado_id))?.nombre_completo || 'N/A') : 'N/A'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeView === 'loans' && (
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Gestión de Préstamos</h1>
                        <button onClick={() => setLoanModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 transition-transform hover:scale-105">+ Nuevo Préstamo</button>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cuota Diaria</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Inicio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loans.map(loan => (
                                        <tr key={loan.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{loan.nombre_completo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(loan.monto_total_a_pagar || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(loan.monto_cuota_diaria || 0).toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(loan.fecha_inicio).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${loan.estado === 'PAGADO' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{loan.estado}</span></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm"><button onClick={() => handleDeleteLoan(loan.id)} className="text-red-600 hover:text-red-900">Eliminar</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {activeView === 'payments' && (
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Registrar un Pago</h1>
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
                        <form onSubmit={handleRegisterPayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cliente</label>
                                <select value={selectedUserForPayment} onChange={(e) => setSelectedUserForPayment(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                    <option value="">Selecciona un cliente...</option>
                                    {users.filter(u => u.rol === 'cliente').map(user => (<option key={user.id} value={user.id}>{user.nombre_completo}</option>))}
                                </select>
                            </div>
                            {selectedUserForPayment && (
                                <div className="bg-indigo-50 p-4 rounded-lg">
                                    <p className="text-sm">Saldo Pendiente Total: <span className="font-semibold">${parseFloat(users.find(u => u.id === parseInt(selectedUserForPayment))?.saldo_pendiente_total || 0).toFixed(2)}</span></p>
                                </div>
                            )}
                            {selectedUserForPayment && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cuota a Pagar</label>
                                    <select value={selectedPaymentId} onChange={(e) => setSelectedPaymentId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                                        <option value="">Selecciona una cuota...</option>
                                        {userPaymentsToRegister.map(p => (<option key={p.id} value={p.id}>{new Date(p.fecha_cuota).toLocaleDateString()} - ${parseFloat(p.monto_cuota).toFixed(2)} ({p.estado})</option>))}
                                    </select>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Monto del Abono</label>
                                <input type="number" step="0.01" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="0.00" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Referencia (Opcional)</label>
                                <input type="text" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                            <div className="pt-4"><button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Registrar Abono</button></div>
                        </form>
                    </div>
                </div>
            )}
        </div>
        }
      </main>

       {/* --- MODALES --- */}
       {isUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Registrar Nuevo Usuario</h2><button onClick={() => setUserModalOpen(false)} className="text-gray-500 hover:text-gray-800"><CloseIcon /></button></div>
                <form onSubmit={handleRegisterUser} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700">Nombre Completo</label><input type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/></div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono (10 dígitos)</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">+52</span>
                            <input type="tel" value={newUserPhone} onChange={(e) => setNewUserPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} placeholder="55 1234 5678" required className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"/>
                        </div>
                    </div>
                    <div><label className="block text-sm font-medium text-gray-700">Contraseña</label><input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/></div>
                    <div><label className="block text-sm font-medium text-gray-700">Rol</label><select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"><option value="cliente">Cliente</option><option value="cobrador">Cobrador</option><option value="admin">Administrador</option></select></div>
                    {newUserRole === 'cliente' && (<div><label className="block text-sm font-medium text-gray-700">Asignar Cobrador (Opcional)</label><select value={selectedCobradorForNewUser} onChange={(e) => setSelectedCobradorForNewUser(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"><option value="">-- Sin asignar --</option>{cobradoresList.map(c => (<option key={c.id} value={c.id}>{c.nombre_completo}</option>))}</select></div>)}
                    <div className="pt-4 flex justify-end"><button type="button" onClick={() => setUserModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300">Cancelar</button><button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Registrar</button></div>
                </form>
            </div>
        </div>
      )}
      
       {isLoanModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold">Registrar Nuevo Préstamo</h2><button onClick={() => setLoanModalOpen(false)} className="text-gray-500 hover:text-gray-800"><CloseIcon /></button></div>
                <form onSubmit={handleRegisterLoan} className="space-y-4">
                    <div><label className="block text-sm font-medium text-gray-700">Cliente</label><select value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"><option value="">Selecciona un cliente...</option>{users.filter(u => u.rol === 'cliente').map(user => (<option key={user.id} value={user.id}>{user.nombre_completo}</option>))}</select></div>
                    <div><label className="block text-sm font-medium text-gray-700">Monto del Préstamo</label><input type="number" step="0.01" value={montoPrestamo} onChange={(e) => setMontoPrestamo(e.target.value)} placeholder="1000.00" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/></div>
                    <div><label className="block text-sm font-medium text-gray-700">Plazo en Días</label><input type="number" value={plazoDias} onChange={(e) => setPlazoDias(e.target.value)} placeholder="29" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/></div>
                    
                    {montoPrestamo > 0 && (
                        <div className="bg-indigo-50 p-4 rounded-lg mt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Resumen del Préstamo</h3>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Total a Pagar:</span>
                                <span className="font-semibold text-gray-900">${calculatedTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                                <span className="text-gray-600">Cuota Diaria Estimada:</span>
                                <span className="font-semibold text-gray-900">${calculatedDaily.toLocaleString('es-MX', {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end"><button type="button" onClick={() => setLoanModalOpen(false)} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-2 hover:bg-gray-300">Cancelar</button><button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Registrar Préstamo</button></div>
                </form>
            </div>
        </div>
      )}

      {/* --- NOTIFICACIÓN TOAST --- */}
      {notification.show && (
        <div className={`fixed bottom-5 right-5 px-4 py-2 rounded-lg shadow-lg text-white transition-transform transform ${notification.show ? 'translate-x-0' : 'translate-x-full'} ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {notification.message}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;