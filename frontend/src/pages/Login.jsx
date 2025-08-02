// src/pages/Login.jsx
 import React, { useState } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 // No necesitamos importar un CSS externo, lo pondremos aquí mismo.

 // --- COMPONENTE DEL LOGO ---
 const Logo = () => (
     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
 );

 const Login = () => {
     const [telefono, setTelefono] = useState(''); // Almacenará solo los 10 dígitos
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const navigate = useNavigate();

     const handleSubmit = async (e) => {
         e.preventDefault();
         setError('');
         setIsLoading(true);
         
         const telefono_whatsapp = `+52${telefono}`; // Unimos el prefijo antes de enviar

         try {
             // --- CORRECCIÓN: Apuntamos a la nueva URL del backend en Render ---
             const response = await fetch('https://prfin-backend.onrender.com/api/login', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({ telefono_whatsapp, password }),
             });

             const data = await response.json();

             if (response.ok) {
                 localStorage.setItem('token', data.token);
                 const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
                 const userRole = decodedToken.rol;

                 if (userRole === 'admin') {
                     navigate('/admin');
                 } else if (userRole === 'cobrador') {
                     navigate('/cobrador');
                 } else {
                     navigate('/dashboard');
                 }
             } else {
                 setError(data.error || 'Credenciales inválidas.');
             }
         } catch (err) {
             console.error('Error de red o del servidor:', err);
             setError('No se pudo conectar al servidor. Intenta de nuevo más tarde.');
         } finally {
             setIsLoading(false);
         }
     };

     const handleTelefonoChange = (e) => {
         const value = e.target.value;
         // Permitimos solo números y limitamos a 10 dígitos
         const numericValue = value.replace(/[^0-9]/g, '');
         if (numericValue.length <= 10) {
             setTelefono(numericValue);
         }
     };
     
     // --- Estilos de animación integrados, sincronizados con el Home ---
     const animationStyles = `
        .login-container-animated {
            background: linear-gradient(135deg, #e0e7ff, #c7d2fe, #e0e7ff);
            background-size: 200% 200%;
            animation: gradientAnimation 15s ease-in-out infinite;
        }

        @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
     `;

     return (
         <div className="login-container-animated flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
             <style>{animationStyles}</style>
             <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                 <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#c4b5fd] to-[#818cf8] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
             </div>

             <div className="sm:mx-auto sm:w-full sm:max-w-md">
                 <Link to="/" className="flex justify-center">
                     <Logo />
                 </Link>
                 <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                     Accede a tu cuenta
                 </h2>
                 <p className="mt-2 text-center text-sm text-gray-600">
                     O{' '}
                     <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                         regresa a la página de inicio
                     </Link>
                 </p>
             </div>

             <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                 <div className="bg-white/60 backdrop-blur-xl border border-gray-200 py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10">
                     <form className="space-y-6" onSubmit={handleSubmit}>
                         <div>
                             <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                                 Número de Teléfono
                             </label>
                             {/* --- NUEVO: Campo de teléfono rediseñado --- */}
                             <div className="mt-1 flex rounded-md shadow-sm">
                                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                    +52
                                </span>
                                <input
                                    id="telefono"
                                    name="telefono"
                                    type="tel"
                                    autoComplete="tel"
                                    required
                                    value={telefono}
                                    onChange={handleTelefonoChange}
                                    placeholder="55 1234 5678"
                                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                             </div>
                         </div>

                         <div>
                             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                 Contraseña
                             </label>
                             <div className="mt-1">
                                 <input
                                     id="password"
                                     name="password"
                                     type="password"
                                     autoComplete="current-password"
                                     required
                                     value={password}
                                     onChange={(e) => setPassword(e.target.value)}
                                     className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                 />
                             </div>
                         </div>

                         {error && (
                             <div className="rounded-md bg-red-50 p-4">
                                 <p className="text-sm text-red-700">{error}</p>
                             </div>
                         )}

                         <div>
                             <button
                                 type="submit"
                                 disabled={isLoading}
                                 className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                             >
                                 {isLoading ? 'Ingresando...' : 'Ingresar'}
                             </button>
                         </div>
                     </form>
                 </div>
             </div>
         </div>
     );
 };

 export default Login;