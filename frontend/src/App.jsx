import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [amount, setAmount] = useState(1000);
  const interestRate = 0.32;
  const days = 22;

  const totalToPay = amount + amount * interestRate;
  const dailyPayment = totalToPay / days;

  const amountOptions = Array.from({ length: 15 }, (_, i) => (i + 1) * 1000);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-between bg-gradient-to-br from-[#0a0a23] to-[#0f0f33] text-white px-8 py-16 relative overflow-hidden">
      {/* fondo radial */}
      <div className="absolute w-[600px] h-[600px] bg-[#3b82f6] opacity-20 rounded-full blur-3xl left-[-150px] top-[-150px] animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-[#e11d48] opacity-20 rounded-full blur-2xl right-[-100px] bottom-[-100px] animate-pulse"></div>

      {/* Columna izquierda */}
      <div className="w-full md:w-1/2 z-10 space-y-10">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          PRÉSTAMOS <br /> INMEDIATOS,<br /> CONFIABLES<br /> Y SEGUROS
        </h1>
        <Link
          to="/login"
          className="inline-block bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-8 py-3 rounded-full font-semibold text-lg shadow-lg transition hover:scale-105"
        >
          Acceso
        </Link>
      </div>

      {/* Columna derecha */}
      <div className="w-full md:w-[480px] mt-16 md:mt-0 z-10">
        <div className="bg-[#141427]/60 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-[#333] animate-fade-slide">
          <h2 className="text-2xl font-semibold mb-6 text-center">Calcula tu préstamo a 22 días</h2>

          <input
            type="range"
            min="1000"
            max="15000"
            step="1000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-[#6366f1] mb-3"
          />

          <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 text-center mb-6">
            {amountOptions.map((value) => (
              <span key={value}>${value.toLocaleString()}</span>
            ))}
          </div>

          <div className="text-center space-y-3">
            <p className="text-xl text-purple-400 font-bold">
              Total a pagar: ${totalToPay.toLocaleString()}
            </p>
            <p className="text-xl text-pink-500 font-bold">
              Pago diario: ${dailyPayment.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;