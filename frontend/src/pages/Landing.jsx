// src/pages/Landing.jsx
import React, { useState } from 'react';
import '../App.css'; // ✅ Ruta corregida
import { motion } from 'framer-motion';
import { FaBolt, FaCoins, FaShieldAlt } from 'react-icons/fa';

const Landing = () => {
  const [amount, setAmount] = useState(1000);
  const interestRate = 0.32;
  const days = 22;

  const totalToPay = amount + amount * interestRate;
  const dailyPayment = totalToPay / days;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f23] to-[#150820] text-white relative px-4">
      {/* Fondo animado */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-purple-900 via-transparent to-transparent opacity-20"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      {/* Header */}
      <header className="flex justify-between items-center py-4 px-6 z-10 relative">
        <h1 className="text-2xl font-bold text-white">prfin.mx</h1>
        <a
          href="/login"
          className="bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 rounded-xl text-white hover:scale-105 transition"
        >
          Acceso
        </a>
      </header>

      {/* Contenido central */}
      <div className="flex flex-col items-center text-center z-10 relative mt-6">
        <h2 className="text-4xl font-extrabold">Préstamos rápidos<br />y transparentes</h2>
        <p className="text-gray-300 mt-2">Todo digital, sin papeles y con tasas claras.</p>
        <a
          href="/login"
          className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-pink-500 text-white rounded-full hover:scale-105 transition"
        >
          Ir a Login
        </a>

        {/* Iconos animados */}
        <div className="flex justify-center gap-10 mt-10">
          {/* Rapidez */}
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="flex flex-col items-center"
          >
            <FaBolt size={28} className="text-blue-500" />
            <p>Rapidez</p>
          </motion.div>

          {/* Tasas claras (moneda girando) */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="flex flex-col items-center"
          >
            <FaCoins size={28} className="text-yellow-400" />
            <p>Tasas claras</p>
          </motion.div>

          {/* Seguridad (escudo golpeado) */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="flex flex-col items-center"
          >
            <FaShieldAlt size={28} className="text-cyan-400" />
            <p>Seguridad</p>
          </motion.div>
        </div>

        {/* Calculadora */}
        <div className="mt-10 w-full max-w-md bg-black/30 rounded-xl p-6 border border-white/10 backdrop-blur">
          <h3 className="text-lg font-semibold mb-4">Calcula tu pago a 22 días</h3>
          <label className="block text-left text-sm mb-2">Monto seleccionado: ${amount.toLocaleString()}</label>
          <input
            type="range"
            min={1000}
            max={15000}
            step={1000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-pink-500"
          />
          <div className="flex justify-between text-sm mt-1 text-gray-400">
            <span>$1,000</span>
            <span>$15,000</span>
          </div>

          <div className="mt-6 text-lg font-semibold text-pink-400">
            <p>Total a pagar: ${totalToPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className="mt-1 text-pink-500">Pago diario: ${dailyPayment.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-xs text-gray-400">
          © 2025 prfin.mx • Políticas • Contacto
        </footer>
      </div>
    </div>
  );
};

export default Landing;
