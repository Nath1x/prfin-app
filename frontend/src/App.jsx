// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// --- COMPONENTES DE ICONOS (para mantener el código limpio) ---
const Logo = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 17L12 22L22 17" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 12L12 17L22 12" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

const FeatureIcon = ({ children }) => (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
        {children}
    </div>
);

// --- Componentes SVG para la sección de confianza ---
const TrustLogo = ({ name, path }) => (
    <div className="col-span-2 flex justify-center items-center max-h-12 w-full object-contain lg:col-span-1">
        <svg className="h-10 w-auto text-gray-400 hover:text-indigo-600 transition-colors" fill="currentColor" viewBox="0 0 120 30" xmlns="http://www.w3.org/2000/svg">
            <title>{name}</title>
            {path}
        </svg>
    </div>
);

// --- DATOS DE LOS TESTIMONIOS ---
const testimonials = [
    { quote: "El proceso fue increíblemente rápido y sencillo. Tuve el dinero que necesitaba el mismo día. ¡Totalmente recomendados!", author: "Marco Antonio R.", title: "Cliente Satisfecho" },
    { quote: "Me encantó la claridad en los pagos. Siempre supe cuánto debía pagar y pude revisar mi estado de cuenta en línea fácilmente.", author: "Verónica Soto", title: "Cliente Satisfecha" },
    { quote: "Tenía una emergencia y me ayudaron a resolverla sin complicaciones. El servicio por WhatsApp es un gran plus. Muy agradecida.", author: "Julieta Méndez", title: "Cliente Satisfecha" },
    { quote: "Como dueño de un pequeño negocio, necesitaba liquidez para comprar inventario. PrFin-App me dio una solución rápida y confiable.", author: "Ricardo Herrera", title: "Dueño de Tienda" },
    { quote: "Pude pagar la colegiatura de mi hijo a tiempo gracias a su eficiencia. El proceso es muy seguro y transparente.", author: "Laura Campos", title: "Madre de Familia" },
    { quote: "Comparado con otros servicios, aquí todo es más claro y el trato es más personal. Se siente la confianza desde el primer momento.", author: "David Morales", title: "Profesional Independiente" }
];

// --- COMPONENTE PRINCIPAL DE LA PÁGINA DE INICIO ---
const App = () => {
    // --- ESTADO Y LÓGICA PARA LA CALCULADORA INTERACTIVA ---
    const [monto, setMonto] = useState(5000);
    const [pagoDiario, setPagoDiario] = useState(0);
    const [totalPagar, setTotalPagar] = useState(0);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const [displayMonto, setDisplayMonto] = useState(monto);
    const animationFrameId = useRef(null);
    const TASA_FIJA = 1.45;
    const PLAZO_DIAS = 29;

    // --- ESTADO Y LÓGICA PARA EL CARRUSEL DE TESTIMONIOS ---
    const [currentTestimonial, setCurrentTestimonial] = useState(0);

    // Efecto para calcular los pagos
    useEffect(() => {
        const montoNumerico = parseFloat(monto) || 0;
        const totalFinal = montoNumerico * TASA_FIJA;
        const cuotaDiaria = totalFinal / PLAZO_DIAS;
        setTotalPagar(totalFinal);
        setPagoDiario(cuotaDiaria);
    }, [monto]);

    // ==================================================================
    // === CORRECCIÓN: Lógica de animación del monto mucho más robusta ===
    // ==================================================================
    useEffect(() => {
        const targetMonto = parseFloat(monto);
        cancelAnimationFrame(animationFrameId.current);

        const animate = () => {
            setDisplayMonto(prevDisplay => {
                const diff = targetMonto - prevDisplay;
                // Si la diferencia es muy pequeña, detenemos la animación y fijamos el valor final.
                if (Math.abs(diff) < 1) {
                    return targetMonto;
                }
                // Movemos el 10% de la distancia restante en cada frame para un efecto suave.
                const step = diff * 0.1;
                animationFrameId.current = requestAnimationFrame(animate);
                return prevDisplay + step;
            });
        };
        
        animationFrameId.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId.current);
    }, [monto]); // Este efecto se ejecuta cada vez que el 'monto' objetivo cambia.

    // Efecto para la animación automática de la calculadora
    useEffect(() => {
        if (hasUserInteracted) return;

        const animationInterval = setInterval(() => {
            setMonto(prevMonto => {
                const nextMonto = prevMonto + 1000;
                return nextMonto > 15000 ? 1000 : nextMonto;
            });
        }, 2500);

        return () => clearInterval(animationInterval);
    }, [hasUserInteracted]);

    // Efecto para el carrusel de testimonios
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);
    
    const handleSliderInteraction = (e) => {
        if (!hasUserInteracted) {
            setHasUserInteracted(true);
        }
        setMonto(parseFloat(e.target.value));
    };

    return (
        <div className="bg-white text-gray-800">
            {/* ========== BARRA DE NAVEGACIÓN ========== */}
            <header className="absolute inset-x-0 top-0 z-50">
                <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                    <div className="flex lg:flex-1">
                        <a href="#" className="-m-1.5 p-1.5 flex items-center gap-x-2">
                            <Logo />
                            <span className="font-semibold text-gray-900">PrFin-App</span>
                        </a>
                    </div>
                    <div className="lg:flex lg:flex-1 lg:justify-end">
                        <Link to="/login" className="text-sm font-semibold leading-6 text-gray-900 transition-colors hover:text-indigo-600">
                            Revisar mi estado de cuenta <span aria-hidden="true">&rarr;</span>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="isolate">
                {/* ========== SECCIÓN HERO Y CALCULADORA ========== */}
                <div className="relative pt-14">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#c4b5fd] to-[#818cf8] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                    </div>
                    <div className="py-24 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="grid grid-cols-1 items-center gap-x-16 gap-y-16 lg:grid-cols-2">
                                <div className="text-center lg:text-left">
                                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Tu préstamo, rápido y sin complicaciones</h1>
                                    <p className="mt-6 text-lg leading-8 text-gray-600">Obtén el dinero que necesitas con un proceso 100% digital, transparente y con respuesta en minutos. Sin filas, sin papeleo.</p>
                                    <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                                        <Link to="/login" className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Solicita tu Préstamo</Link>
                                        <a href="#features" className="text-sm font-semibold leading-6 text-gray-900 transition-colors hover:text-indigo-600">Conoce los beneficios <span aria-hidden="true">→</span></a>
                                    </div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-200">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Simula tu préstamo</h2>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between items-baseline">
                                                <label htmlFor="monto" className="block text-sm font-medium text-gray-700">Monto solicitado</label>
                                                <span className="text-2xl font-bold text-indigo-600">${new Intl.NumberFormat('es-MX').format(Math.round(displayMonto))}</span>
                                            </div>
                                            <input 
                                                type="range" 
                                                id="monto" 
                                                min="1000" 
                                                max="15000" 
                                                step="1000" 
                                                value={monto} 
                                                onPointerDown={handleSliderInteraction}
                                                onTouchStart={handleSliderInteraction}
                                                onChange={handleSliderInteraction} 
                                                className="w-full h-2 mt-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg">
                                            <div>
                                                <p className="text-sm text-gray-600">Pago diario</p>
                                                <p className="text-xl font-semibold text-gray-900">${pagoDiario.toFixed(2)}</p>
                                            </div>
                                            <div className="border-l border-gray-300 h-10"></div>
                                            <div>
                                                <p className="text-sm text-gray-600">Total a pagar</p>
                                                <p className="text-xl font-semibold text-gray-900">${totalPagar.toLocaleString('es-MX', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========== SECCIÓN DE CONFIANZA ========== */}
                <div className="bg-white py-12 sm:py-16">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <h2 className="text-center text-lg font-semibold leading-8 text-gray-900">Nuestros principios se basan en</h2>
                        <div className="mx-auto mt-10 grid max-w-lg grid-cols-1 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 lg:mx-0 lg:max-w-none">
                           <TrustLogo name="Rapidez" path={<path d="M6.31 16.9l-3.12 3.48c-.4.45.13 1.12.64.88l15.9-7.6c.4-.2.4-.77 0-.96L3.83 5.02c-.5-.24-1.04.43-.64.88l3.12 3.48h6.48c.47 0 .85.38.85.85v2.54c0 .47-.38.85-.85.85H6.3Z M21.31 9.38v11.25c0 .47.38.85.85.85h1.7c.47 0 .85-.38.85-.85V9.38c0-.47-.38-.85-.85-.85h-1.7c-.47 0-.85.38-.85.85Z" />} />
                           <TrustLogo name="Confianza" path={<path d="M16.98 5.27L6.02 10.2c-.8.4-1.87.2-2.45-.6-.73-1-2.1-2.97-2.1-2.97-.4-.53.13-1.2.64-.96l15.9 7.6c.4.2.4.77 0 .96l-7.95 3.8-1.5-1.86 5.3-2.53c.4-.2.4-.77 0-.96L6.02 7.35l10.96-4.95c.4-.2.4-.77 0-.96L9.68.2c-.4-.2-.87.27-.7.7L10.53 5c.1.33.02.7-.23.95L8.75 7.3l8.23-3.7c.4-.2.87.27.7.7l-1.55 4.07c-.1.33.02.7.23.95l1.55 1.35c.25.2.62.1.7-.23l1.55-4.07c.17-.44-.3-.9-.7-.7Z" />} />
                           <TrustLogo name="Seguridad" path={<path d="M12.75 1.12L4.62 5.18c-.4.2-.67.6-.67 1.05v7.53c0 4.35 3.15 8.18 7.2 9.12.4.1.8.1 1.2 0 4.05-.94 7.2-4.77 7.2-9.12V6.23c0-.45-.27-.85-.67-1.05L13.25 1.12c-.15-.08-.35-.08-.5 0Zm.25 15.38c-2.25 0-4.5-1.8-4.5-4.5s2.25-4.5 4.5-4.5 4.5 1.8 4.5 4.5-2.25 4.5-4.5 4.5Zm0-7.5c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3Z" />} />
                        </div>
                    </div>
                </div>

                {/* ========== SECCIÓN DE CARACTERÍSTICAS ========== */}
                <div id="features" className="bg-gray-50 py-24 sm:py-32">
                    {/* ... (sin cambios en esta sección) ... */}
                </div>

                {/* ========== SECCIÓN DE TESTIMONIOS (CARRUSEL) ========== */}
                <section className="bg-white py-24 sm:py-32">
                    {/* ... (sin cambios en esta sección) ... */}
                </section>

                {/* ========== SECCIÓN DE LLAMADA A LA ACCIÓN (CTA) ========== */}
                <div className="bg-white">
                    {/* ... (sin cambios en esta sección) ... */}
                </div>

            </main>
        </div>
    );
};

export default App;