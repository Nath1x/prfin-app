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

// --- Componente para los logos de principios ---
const TrustLogo = ({ name, children }) => (
    <div className="group col-span-1 flex flex-col items-center gap-y-3 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 group-hover:bg-indigo-100 transition-colors duration-300">
            <svg className="h-8 w-8 text-gray-500 group-hover:text-indigo-600 transition-colors duration-300" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                {children}
            </svg>
        </div>
        <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">{name}</span>
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

    // Lógica de animación del monto
    useEffect(() => {
        const targetMonto = parseFloat(monto);
        cancelAnimationFrame(animationFrameId.current);

        const animate = () => {
            setDisplayMonto(prevDisplay => {
                const diff = targetMonto - prevDisplay;
                if (Math.abs(diff) < 1) {
                    return targetMonto;
                }
                const step = diff * 0.1;
                animationFrameId.current = requestAnimationFrame(animate);
                return prevDisplay + step;
            });
        };
        
        animationFrameId.current = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId.current);
    }, [monto]);

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
                                        <Link to="/login" className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Acceder</Link>
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
                        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-start gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 lg:mx-0 lg:max-w-none">
                           <TrustLogo name="Rapidez">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                           </TrustLogo>
                           <TrustLogo name="Confianza">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
                           </TrustLogo>
                           <TrustLogo name="Seguridad">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                           </TrustLogo>
                        </div>
                    </div>
                </div>

                {/* ========== SECCIÓN DE CARACTERÍSTICAS ========== */}
                <div id="features" className="bg-gray-50 py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl lg:text-center">
                            <h2 className="text-base font-semibold leading-7 text-indigo-600">Beneficios para ti</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Un proceso diseñado para tu comodidad</p>
                        </div>
                        <div className="mx-auto mt-16 max-w-none sm:mt-20 lg:mt-24">
                            <dl className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-2 lg:gap-y-16">
                                <div className="relative pl-20">
                                    <dt className="text-base font-semibold leading-7 text-gray-900"><FeatureIcon><svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></FeatureIcon>Respuesta Rápida</dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600">Completa tu solicitud en minutos y recibe una respuesta el mismo día. Valoramos tu tiempo.</dd>
                                </div>
                                <div className="relative pl-20">
                                    <dt className="text-base font-semibold leading-7 text-gray-900"><FeatureIcon><svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg></FeatureIcon>Términos Claros</dt>
                                    <dd className="mt-2 text-base leading-7 text-gray-600">Sin letras pequeñas ni sorpresas. Sabrás exactamente cuánto pagarás desde el primer momento.</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* ========== SECCIÓN DE TESTIMONIOS (CARRUSEL) ========== */}
                <section className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-lg font-semibold leading-8 tracking-tight text-indigo-600">Confianza y Satisfacción</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">La experiencia de nuestros clientes</p>
                        </div>
                        <div className="relative mt-16">
                            <div className="overflow-hidden relative h-56">
                                {testimonials.map((testimonial, index) => (
                                    <div key={index} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentTestimonial ? 'opacity-100' : 'opacity-0'}`}>
                                        <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6 max-w-2xl mx-auto">
                                            <blockquote className="text-center text-lg text-gray-900"><p>“{testimonial.quote}”</p></blockquote>
                                            <figcaption className="mt-6 flex justify-center items-center gap-x-4">
                                                <div>
                                                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                                                    <div className="text-gray-600">{testimonial.title}</div>
                                                </div>
                                            </figcaption>
                                        </figure>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex justify-center gap-x-3">
                                {testimonials.map((_, index) => (
                                    <button key={index} onClick={() => setCurrentTestimonial(index)} className={`h-2.5 w-2.5 rounded-full transition-colors ${currentTestimonial === index ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-gray-400'}`} aria-label={`Go to slide ${index + 1}`}></button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
                
            </main>
        </div>
    );
};

export default App;