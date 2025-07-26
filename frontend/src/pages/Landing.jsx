import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { FaBolt, FaShieldAlt } from 'react-icons/fa';
import { FaCoins } from 'react-icons/fa6';

export default function Landing() {
  const [amount, setAmount] = useState(1000);
  const totalToPay = amount + amount * 0.32;
  const dailyPayment = totalToPay / 22;

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const particlesOptions = {
    fullScreen: { enable: false },
    background: { color: '#0b0b24' },
    particles: {
      number: { value: 60 },
      color: { value: '#ffffff' },
      links: { enable: true, color: '#ffffff', distance: 100 },
      move: { enable: true, speed: 1 },
      size: { value: 2 },
    },
  };

  return (
    <div className="min-h-screen bg-[#0b0b24] text-white relative overflow-hidden">
      {/* Partículas animadas */}
      <Particles
        className="absolute inset-0 z-0"
        init={particlesInit}
        options={particlesOptions}
      />

      {/* Encabezado */}
      <div className="flex justify-between items-center px-6 py-4 relative z-10">
        <div className="text-white font-bold text-xl">prfin.mx</div>
        <Link
          to="/login"
          className="bg-gradient-to-r from-pink-500 to-indigo-500 px-4 py-2 rounded-full font-semibold text-sm hover:scale-105 transition"
        >
          Acceso
        </Link>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-12 md:py-20 relative z-10">
        {/* Columna izquierda */}
        <div className="md:w-1/2 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Préstamos rápidos <br /> y transparentes
          </h1>
          <p className="text-lg text-gray-300">
            Todo digital, sin papeles y con tasas claras.
          </p>
          <Link
            to="/login"
            className="inline-block mt-4 bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition"
          >
            Ir a Login
          </Link>

          {/* Íconos */}
          <div className="flex justify-center md:justify-start gap-10 mt-8 text-sm">
            <div className="flex flex-col items-center">
              <FaBolt className="text-2xl text-blue-400 animate-pulse" />
              <span>Rapidez</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative">
                <FaCoins
                  className="text-2xl text-yellow-400"
                  style={{
                    animation: 'shine 2s infinite',
                    filter: 'brightness(1)',
                  }}
                />
                <style>
                  {`
                    @keyframes shine {
                      0% { filter: brightness(1); }
                      50% { filter: brightness(2.5); }
                      100% { filter: brightness(1); }
                    }
                  `}
                </style>
              </div>
              <span>Tasas claras</span>
            </div>
            <div className="flex flex-col items-center">
              <FaShieldAlt className="text-2xl text-cyan-400 animate-bounce" />
              <span>Seguridad</span>
            </div>
          </div>
        </div>

        {/* Calculadora */}
        <div className="w-full md:w-[420px] mt-12 md:mt-0 bg-[#141427]/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-[#333]">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Calcula tu pago a 22 días
          </h2>

          <input
            type="range"
            min="1000"
            max="15000"
            step="1000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-pink-500 mb-2"
          />

          <div className="text-xs text-gray-400 mb-4 text-center">
            Monto seleccionado: ${amount.toLocaleString()}
          </div>

          <div className="text-center space-y-2">
            <p className="text-lg text-pink-400 font-bold">
              Total a pagar: ${totalToPay.toLocaleString()}
            </p>
            <p className="text-lg text-pink-600 font-bold">
              Pago diario: ${dailyPayment.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Testimonios */}
      <div className="mt-16 px-4 md:px-20 text-center z-10 relative">
        <h3 className="text-2xl font-bold mb-8 text-white">¿Qué opinan nuestros clientes?</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              nombre: 'María G.',
              texto: 'Me prestaron en minutos. Todo digital y sin letras chiquitas. Súper confiable.',
            },
            {
              nombre: 'Carlos R.',
              texto: 'Excelente atención. El proceso fue rápido y claro desde el inicio.',
            },
            {
              nombre: 'Lucía P.',
              texto: 'Me ayudaron justo cuando lo necesitaba. 100% recomendable.',
            },
          ].map((testimonio, idx) => (
            <div
              key={idx}
              className="bg-[#1c1c38] text-white rounded-xl p-6 border border-[#333] shadow-lg hover:scale-105 transition"
            >
              <p className="text-sm italic mb-4">“{testimonio.texto}”</p>
              <p className="text-sm font-bold text-pink-400">– {testimonio.nombre}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Botón flotante WhatsApp */}
      <a
        href="https://wa.me/527822173753?text=Hola,%20me%20interesa%20saber%20más%20sobre%20los%20préstamos."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 p-4 rounded-full shadow-lg transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="white"
          viewBox="0 0 24 24"
          className="w-6 h-6 animate-bounce"
        >
          <path d="M20.52 3.48A11.85 11.85 0 0 0 12 0C5.37 0 .01 5.37.01 12c0 2.12.55 4.21 1.6 6.05L0 24l6.24-1.64a11.94 11.94 0 0 0 5.76 1.47h.01c6.63 0 12-5.37 12-12 0-3.2-1.25-6.22-3.49-8.49ZM12 22.13c-1.81 0-3.58-.48-5.14-1.39l-.37-.22-3.7.98.99-3.6-.24-.38A9.95 9.95 0 0 1 2.01 12C2.01 6.49 6.49 2 12 2a9.93 9.93 0 0 1 7.07 2.93A9.93 9.93 0 0 1 22 12c0 5.51-4.49 10.13-10 10.13Zm5.32-7.4c-.29-.15-1.7-.84-1.97-.94-.27-.1-.46-.15-.65.15s-.75.94-.92 1.13c-.17.2-.34.22-.63.07-.29-.15-1.23-.46-2.34-1.47-.86-.76-1.44-1.7-1.61-1.99-.17-.29-.02-.44.13-.59.14-.14.29-.34.44-.51.15-.17.2-.29.3-.48.1-.2.05-.37-.02-.52-.07-.15-.65-1.56-.9-2.13-.24-.58-.49-.5-.65-.51h-.55c-.2 0-.52.07-.79.37-.27.29-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.1 4.5.71.3 1.27.48 1.7.62.72.23 1.37.2 1.88.12.57-.09 1.7-.7 1.94-1.37.24-.68.24-1.27.17-1.37-.07-.1-.27-.17-.55-.3Z" />
        </svg>
      </a>
    </div>
  );
}
