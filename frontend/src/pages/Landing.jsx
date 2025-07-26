import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import { FaBolt, FaCoins, FaShieldAlt } from 'react-icons/fa';

function Landing() {
  const [amount, setAmount] = useState(1000);
  const interestRate = 0.32;
  const days = 22;

  const totalToPay = amount + amount * interestRate;
  const dailyPayment = totalToPay / days;

  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0a23] to-[#0f0f33] text-white overflow-hidden">
      {/* Fondo de partículas */}
      <Particles
        className="absolute inset-0 z-0"
        init={particlesInit}
        options={{
          background: { color: '#0a0a23' },
          fullScreen: { enable: false },
          particles: {
            number: { value: 40 },
            size: { value: 2 },
            move: { enable: true, speed: 1 },
            opacity: { value: 0.3 },
            color: { value: '#ffffff' },
            links: { enable: true, color: '#ffffff', distance: 150, opacity: 0.2 }
          }
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center md:flex-row min-h-screen px-6 py-12">
        {/* Columna izquierda */}
        <div className="md:w-1/2 text-center md:text-left space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
            Préstamos rápidos <br /> y transparentes
          </h1>
          <p className="text-lg text-gray-300">
            Todo digital, sin papeles y con tasas claras.
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg transition hover:scale-105"
          >
            Ir a Login
          </Link>

          {/* Íconos */}
          <div className="mt-10 flex justify-center md:justify-start space-x-10 text-center text-sm">
            <div className="flex flex-col items-center">
              <FaBolt className="text-blue-400 text-3xl animate-bounce" />
              <span className="mt-1">Rapidez</span>
            </div>
            <div className="flex flex-col items-center">
              <FaCoins className="text-yellow-400 text-3xl animate-spin-slow" />
              <span className="mt-1">Tasas claras</span>
            </div>
            <div className="flex flex-col items-center">
              <FaShieldAlt className="text-cyan-400 text-3xl animate-pulse" />
              <span className="mt-1">Seguridad</span>
            </div>
          </div>
        </div>

        {/* Columna derecha (calculadora) */}
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <div className="bg-[#141427]/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 w-full max-w-md border border-[#333]">
            <h2 className="text-xl font-semibold text-center mb-6">
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
            <p className="text-sm text-center text-gray-300 mb-4">
              Monto seleccionado: ${amount.toLocaleString()}
            </p>
            <div className="text-center space-y-2">
              <p className="text-lg text-purple-400 font-bold">
                Total a pagar: ${totalToPay.toLocaleString()}
              </p>
              <p className="text-lg text-pink-400 font-bold">
                Pago diario: ${dailyPayment.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-sm text-gray-400 py-4 relative z-10">
        © 2025 prfin.mx · <span className="underline cursor-pointer">Políticas</span> ·{' '}
        <span className="underline cursor-pointer">Contacto</span>
      </footer>
    </div>
  );
}

export default Landing;
