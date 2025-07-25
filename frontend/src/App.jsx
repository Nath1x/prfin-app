import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

function App() {
  const [amount, setAmount] = useState(1000);
  const interestRate = 0.32;
  const days = 22;

  const totalToPay = amount + amount * interestRate;
  const dailyPayment = totalToPay / days;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e0e0e] to-[#1f1f1f] text-white flex flex-col items-center justify-center px-4 py-10">
      <div className="text-center max-w-xl animate-fade-slide">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight animate-fade-delay">
          Bienvenido a <span className="text-[#38bdf8]">PRFIN</span>
        </h1>
        <p className="text-lg text-gray-400 mb-6 animate-fade-delay-2">
          Administra préstamos con precisión, control y confianza.
        </p>
        <Link
          to="/login"
          className="bg-[#38bdf8] hover:bg-[#0ea5e9] text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 animate-fade-delay-3"
        >
          Iniciar sesión
        </Link>
      </div>

      {/* Calculadora futurista */}
      <div className="w-full max-w-md bg-[#121212] mt-12 p-6 rounded-2xl shadow-xl border border-gray-800 animate-fade-slide">
        <h2 className="text-2xl font-semibold mb-4 text-[#38bdf8]">Calculadora de préstamo</h2>
        <label className="block text-sm text-gray-400 mb-2">Ingresa el monto ($1,000 a $15,000):</label>
        <input
          type="number"
          min="1000"
          max="15000"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-3 rounded-lg bg-[#1e1e1e] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#38bdf8] mb-4"
        />

        <div className="text-sm text-gray-300">
          <p>Total a pagar (con 32% de interés): <span className="text-white font-bold">${totalToPay.toFixed(2)}</span></p>
          <p>Pago diario durante 22 días: <span className="text-white font-bold">${dailyPayment.toFixed(2)}</span></p>
        </div>
      </div>
    </div>
  );
}

export default App;
