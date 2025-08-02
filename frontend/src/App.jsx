// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- COMPONENTES DE ICONOS (para mantener el código limpio) ---
const Logo = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const FeatureIcon = ({ children }) => (
    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
        {children}
    </div>
);

// --- COMPONENTE PRINCIPAL DE LA PÁGINA DE INICIO ---
const App = () => {
    // --- ESTADO Y LÓGICA PARA LA CALCULADORA INTERACTIVA ---
    const [monto, setMonto] = useState(1000);
    const [pagoDiario, setPagoDiario] = useState(0);
    const [totalPagar, setTotalPagar] = useState(0);
    const TASA_FIJA = 1.45; // Tasa del 45% (1000 se convierte en 1450)
    const PLAZO_DIAS = 29;

    useEffect(() => {
        const montoNumerico = parseFloat(monto) || 0;
        const totalFinal = montoNumerico * TASA_FIJA;
        const cuotaDiaria = totalFinal / PLAZO_DIAS;

        setTotalPagar(totalFinal.toFixed(2));
        setPagoDiario(cuotaDiaria.toFixed(2));
    }, [monto]); // Se ejecuta cada vez que el 'monto' cambia

    return (
        <div className="bg-white">
            {/* ========== BARRA DE NAVEGACIÓN ========== */}
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5 flex items-center gap-x-2">
                            <Logo />
                            <span className="font-bold text-gray-900">PrFin-App</span>
                        </a>
                    </div>
                    <div className="lg:flex lg:flex-1 lg:justify-end">
                        <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600">
                            Iniciar Sesión <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="isolate">
                {/* ========== SECCIÓN HERO Y CALCULADORA ========== */}
                <div className="relative pt-14">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#8080ff] to-[#5555ff] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                    </div>
                    <div className="py-24 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="grid grid-cols-1 items-center gap-x-8 gap-y-16 lg:grid-cols-2">
                                {/* Contenido de texto a la izquierda */}
                                <div className="text-center lg:text-left">
                                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Control total de tu operación de préstamos</h1>
                                    <p className="mt-6 text-lg leading-8 text-gray-600">Centraliza tu información, automatiza la cobranza y optimiza los resultados de tu equipo en tiempo real.</p>
                                    <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                                        <Link to="/login" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Acceder al Panel</Link>
                                        <a href="#features" className="text-sm font-semibold leading-6 text-gray-900">¿Cómo funciona? <span aria-hidden="true">→</span></a>
                                    </div>
                                </div>
                                {/* Calculadora a la derecha */}
                                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Simulador de Préstamos</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="monto" className="block text-sm font-medium text-gray-700">Monto solicitado (MXN)</label>
                                            <div className="relative mt-1 rounded-md shadow-sm">
                                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span className="text-gray-500 sm:text-sm">$</span></div>
                                                <input type="number" id="monto" value={monto} onChange={(e) => setMonto(e.target.value)} className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="1000" />
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg text-center space-y-2">
                                            <p className="text-sm text-gray-600">Pago diario estimado</p>
                                            <p className="text-3xl font-bold text-indigo-600">${pagoDiario}</p>
                                            <p className="text-xs text-gray-500">Total a pagar: ${totalPagar}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== SECCIÓN DE CARACTERÍSTICAS ========== */}
                <div id="features" className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <h2 className="text-base font-semibold leading-7 text-indigo-600">Hecho para tu equipo</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Herramientas diseñadas para maximizar la productividad</p>
                        </div>
                        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-gray-900">
                                        <FeatureIcon>
                                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v-.003" /></svg>
                                        </FeatureIcon>Panel de Control Unificado
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600">Visualiza y administra toda tu cartera de clientes, préstamos y pagos. Ten visibilidad completa del negocio desde un solo lugar.</dd>
                                </div>
                                <div className="relative pl-16">
                                    <dt className="text-base font-semibold leading-7 text-gray-900">
                                        <FeatureIcon>
                                            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>
                                        </FeatureIcon>Cobranza Automatizada
                                    </dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600">Reduce el esfuerzo manual. El sistema envía recordatorios de pago y confirmaciones por WhatsApp para mantener tu cartera al día.</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* ========== SECCIÓN DE TESTIMONIOS ========== */}
                <section className="bg-gray-50 py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-xl text-center">
                            <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Testimonios</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Lo que nuestros clientes dicen</p>
                        </div>
                        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                            <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
                                <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                                    <figure className="rounded-2xl bg-white p-8 text-sm leading-6 shadow-md border border-gray-100">
                                        <blockquote className="text-gray-900"><p>“Esta aplicación transformó nuestra cobranza. Las notificaciones automáticas son una maravilla y hemos reducido la cartera vencida en un 40%.”</p></blockquote>
                                        <figcaption className="mt-6 flex items-center gap-x-4">
                                            <div>
                                                <div className="font-semibold text-gray-900">Ana García</div>
                                                <div className="text-gray-600">Gerente de Finanzas</div>
                                            </div>
                                        </figcaption>
                                    </figure>
                                </div>
                                <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                                    <figure className="rounded-2xl bg-white p-8 text-sm leading-6 shadow-md border border-gray-100">
                                        <blockquote className="text-gray-900"><p>“La facilidad para registrar préstamos y ver el estado de cada cliente en tiempo real no tiene precio. Me ahorra horas de trabajo a la semana.”</p></blockquote>
                                        <figcaption className="mt-6 flex items-center gap-x-4">
                                            <div>
                                                <div className="font-semibold text-gray-900">Carlos Mendoza</div>
                                                <div className="text-gray-600">Cobrador Independiente</div>
                                            </div>
                                        </figcaption>
                                    </figure>
                                </div>
                                 <div className="pt-8 sm:inline-block sm:w-full sm:px-4">
                                    <figure className="rounded-2xl bg-white p-8 text-sm leading-6 shadow-md border border-gray-100">
                                        <blockquote className="text-gray-900"><p>“Finalmente una herramienta que entiende nuestras necesidades. El soporte es rápido y la plataforma es increíblemente estable.”</p></blockquote>
                                        <figcaption className="mt-6 flex items-center gap-x-4">
                                            <div>
                                                <div className="font-semibold text-gray-900">Sofía Torres</div>
                                                <div className="text-gray-600">Directora de Operaciones</div>
                                            </div>
                                        </figcaption>
                                    </figure>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default App;