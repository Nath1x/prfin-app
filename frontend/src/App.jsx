import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [amount, setAmount] = useState(10000);
  const interestRate = 0.32;
  const days = 22;

  const totalToPay = amount + amount * interestRate;
  const dailyPayment = totalToPay / days;

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-[#0a0a23] to-[#0f0f33] text-white p-8 relative overflow-hidden">
      {/* fondo radial */}
      <div className="absolute w-[600px] h-[600px] bg-[#3b82f6] opacity-20 rounded-full blur-3xl left-[-150px] top-[-150px] animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-[#e11d48] opacity-20 rounded-full blur-2xl right-[-100px] bottom-[-100px] animate-pulse"></div>

      {/* Columna izquierda */}
      <div className="w-full md:w-1/2 z-10 text-left space-y-8">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          PRÉSTAMOS <br /> INMEDIATOS,<br /> CONFIABLES<br /> Y SEGUROS
        </h1>
        <Link
          to="/login"
          className="inline-block bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg transition hover:scale-105"
        >
          Acceso
        </Link>
      </div>

      {/* Columna derecha */}
      <div className="w-full md:w-1/2 mt-12 md:mt-0 z-10">
        <div className="bg-[#141427]/60 backdrop-blur-md rounded-2xl shadow-xl p-6 max-w-md mx-auto border border-[#333] animate-fade-slide">
          <h2 className="text-xl font-semibold mb-4 text-center">Calcula tu préstamo a 22 días</h2>

          <input
            type="range"
            min="1000"
            max="15000"
            step="100"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-[#6366f1] mb-2"
          />

          <div className="flex justify-between text-sm text-gray-400 mb-4">
            <span>$1,000</span>
            <span>$15,000</span>
          </div>

          <div className="text-center space-y-2">
            <p className="text-lg text-purple-400 font-bold">
              Total a pagar: ${totalToPay.toLocaleString()}
            </p>
            <p className="text-lg text-pink-500 font-bold">
              Pago diario: ${dailyPayment.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;