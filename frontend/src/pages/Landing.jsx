import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function Landing() {
  const [amount, setAmount] = useState(1000);
  const interestRate = 0.32;
  const days = 22;
  const totalToPay = amount + amount * interestRate;
  const dailyPayment = totalToPay / days;

  return (
    <div className="min-h-screen bg-[#0b0b1f] text-white flex flex-col items-center justify-center px-6 py-10 space-y-10 relative overflow-hidden">

      {/* Encabezado */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center leading-snug animate-fade-in">
        Préstamos rápidos<br />y transparentes
      </h1>
      <p className="text-center text-gray-400 max-w-md animate-fade-in">
        Todo digital, sin papeles y con tasas claras.
      </p>

      {/* Botón de acceso */}
      <Link
        to="/login"
        className="bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-all animate-fade-in"
      >
        Ir a Login
      </Link>

      {/* Iconos con texto y animaciones */}
      <div className="flex justify-center gap-12 mt-6 animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 mb-2 animate-lightning text-blue-400">⚡</div>
          <span className="text-sm text-gray-300">Rapidez</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 mb-2 animate-spin text-cyan-300">💰</div>
          <span className="text-sm text-gray-300">Tasas claras</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 mb-2 animate-shield text-blue-300">🛡</div>
          <span className="text-sm text-gray-300">Seguridad</span>
        </div>
      </div>

      {/* Calculadora */}
      <div className="bg-[#141427]/60 backdrop-blur-md rounded-2xl shadow-xl p-6 w-full max-w-sm mt-8 border border-[#333] animate-fade-in">
        <h2 className="text-lg font-semibold mb-4 text-center">Calcula tu pago a 22 días</h2>
        <label className="text-sm text-gray-400">Monto:</label>
        <input
          type="range"
          min="1000"
          max="15000"
          step="1000"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full accent-pink-500 my-2"
        />
        <div className="flex justify-between text-xs text-gray-500 mb-4">
          <span>$1,000</span>
          <span>$15,000</span>
        </div>
        <div className="text-center">
          <p className="text-xl text-pink-400 font-bold">
            Total a pagar: ${totalToPay.toLocaleString()}
          </p>
          <p className="text-xl text-pink-500 font-bold">
            Pago diario: ${dailyPayment.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-xs text-gray-500 mt-10 text-center animate-fade-in">
        © 2025 prfin.mx &nbsp; • &nbsp; Políticas &nbsp; • &nbsp; Contacto
      </footer>

      {/* Animaciones personalizadas */}
      <style>{`
        @keyframes lightning {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        .animate-lightning {
          animation: lightning 0.6s infinite;
        }

        @keyframes shield {
          0% { transform: scale(1); }
          40% { transform: scale(1.1) rotate(1deg); }
          60% { transform: scale(0.98) rotate(-1deg); }
          100% { transform: scale(1); }
        }
        .animate-shield {
          animation: shield 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Landing;