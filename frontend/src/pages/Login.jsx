 // src/pages/Login.jsx
 import React, { useState } from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import './Login.css'; // Importa el archivo CSS para la animación

 // --- COMPONENTE DEL LOGO ---
 const Logo = () => (
     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
 );

 const Login = () => {
     const [telefono_whatsapp, setTelefonoWhatsapp] = useState('+52');
     const [password, setPassword] = useState('');
     const [error, setError] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const navigate = useNavigate();

     const handleSubmit = async (e) => {
         e.preventDefault();
         setError('');
         setIsLoading(true);

         try {
             const response = await fetch(import.meta.env.VITE_API_URL + '/api/login', {
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
         // Permite borrar el +52 pero si no hay nada lo vuelve a poner
         if (e.target.value === '') {
             setTelefonoWhatsapp('+52');
         } else if (e.target.value.startsWith('+52')) {
             setTelefonoWhatsapp(e.target.value);
         } else if (!e.target.value.startsWith('+')) {
             setTelefonoWhatsapp('+52' + e.target.value);
         }
     };

     return (
         <div className="login-container flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
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
                             <div className="mt-1 relative">
                                 <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
                                     +52
                                 </div>
                                 <input
                                     id="telefono"
                                     name="telefono"
                                     type="tel"
                                     autoComplete="tel"
                                     required
                                     value={telefono_whatsapp}
                                     onChange={handleTelefonoChange}
                                     className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pl-12 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                                 className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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