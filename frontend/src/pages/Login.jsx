// src/pages/Login.jsx
 import React, { useState } from 'react';
 import { useNavigate, Link } from 'react-router-dom';

 // --- COMPONENTES DE ICONOS ---
 const Logo = () => (
     <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
 );

 const EyeIcon = ({ ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
 );

 const EyeSlashIcon = ({ ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
 );


 const Login = () => {
     const [telefono, setTelefono] = useState('');
     const [password, setPassword] = useState('');
     const [showPassword, setShowPassword] = useState(false); // Estado para ver/ocultar contraseña
     const [error, setError] = useState('');
     const [isLoading, setIsLoading] = useState(false);
     const navigate = useNavigate();

     const handleSubmit = async (e) => {
         e.preventDefault();
         setError('');
         setIsLoading(true);
         
         const telefono_whatsapp = `+52${telefono}`;

         try {
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
         const numericValue = value.replace(/[^0-9]/g, '');
         if (numericValue.length <= 10) {
             setTelefono(numericValue);
         }
     };
     
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
                             <div className="mt-1 relative">
                                 <input
                                     id="password"
                                     name="password"
                                     type={showPassword ? 'text' : 'password'}
                                     autoComplete="current-password"
                                     required
                                     value={password}
                                     onChange={(e) => setPassword(e.target.value)}
                                     className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                 />
                                 <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-indigo-600"
                                 >
                                    {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                 </button>
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