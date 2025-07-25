import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import { DollarSign, CalendarDays, TrendingUp } from 'lucide-react';

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
        <h2 className="text-2xl font-semibold mb-6 text-[#38bdf8] flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#38bdf8]" /> Calculadora de préstamo
        </h2>

        <label className="block text-sm text-gray-400 mb-1 flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Monto ($1,000 a $15,000):
        </label>
        <input
          type="range"
          min="1000"
          max="15000"
          step="100"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full mb-2 accent-[#38bdf8]"
        />
        <div className="text-right text-sm text-[#38bdf8] mb-4 font-semibold">
          ${amount.toLocaleString()}
        </div>

        <div className="text-sm text-gray-300 space-y-2">
          <p className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Total a pagar (32% de interés): <span className="text-white font-bold">${totalToPay.toFixed(2)}</span>
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-yellow-400" />
            Pago diario por 22 días: <span className="text-white font-bold">${dailyPayment.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
