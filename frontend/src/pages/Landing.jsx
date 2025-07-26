import { useState } from "react";
import { motion } from "framer-motion";
import { FaBolt, FaDollarSign, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Landing() {
  const [amount, setAmount] = useState(1000);
  const interestRate = 0.32;
  const days = 22;

  const totalToPay = amount + amount * interestRate;
  const dailyPayment = totalToPay / days;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f1c] to-[#190f22] text-white relative overflow-hidden px-4">
      {/* Header */}
      <div className="w-full flex justify-between items-center py-6 px-4 md:px-8">
        <h1 className="text-white text-lg font-semibold">prfin.mx</h1>
        <Link
          to="/login"
          className="bg-gradient-to-r from-purple-400 to-pink-500 text-white py-1 px-4 rounded-full shadow-md hover:scale-105 transition"
        >
          Acceso
        </Link>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-col items-center text-center mt-10">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Préstamos rápidos <br /> y transparentes
        </h1>
        <p className="text-gray-300 mt-4 text-lg">
          Todo digital, sin papeles y con tasas claras.
        </p>
        <Link
          to="/login"
          className="mt-6 bg-gradient-to-r from-blue-500 to-pink-500 text-white py-2 px-6 rounded-full text-lg font-medium hover:scale-105 transition"
        >
          Ir a Login
        </Link>

        {/* Íconos animados */}
        <div className="flex justify-center gap-10 mt-8">
          {/* Icono de rapidez */}
          <div className="flex flex-col items-center text-white">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <FaBolt className="text-blue-400 text-2xl" />
            </motion.div>
            <span className="mt-2">Rapidez</span>
          </div>

          {/* Icono de tasas claras */}
          <div className="flex flex-col items-center text-white">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              <FaDollarSign className="text-yellow-400 text-2xl" />
            </motion.div>
            <span className="mt-2">Tasas claras</span>
          </div>

          {/* Icono de seguridad */}
          <div className="flex flex-col items-center text-white">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaShieldAlt className="text-blue-300 text-2xl" />
            </motion.div>
            <span className="mt-2">Seguridad</span>
          </div>
        </div>

        {/* Calculadora */}
        <div className="mt-10 bg-[#1a1a2e] p-6 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Calcula tu pago a 22 días</h2>
          <p className="text-left text-sm mb-2">Monto seleccionado: ${amount.toLocaleString()}</p>
          <input
            type="range"
            min="1000"
            max="15000"
            step="1000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-pink-500"
          />
          <div className="flex justify-between text-sm mt-1">
            <span>$1,000</span>
            <span>$15,000</span>
          </div>
          <div className="mt-4 text-lg">
            <p>
              <span className="text-pink-400 font-semibold">
                Total a pagar: ${totalToPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </p>
            <p>
              <span className="text-pink-500 font-semibold">
                Pago diario: ${dailyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-sm text-gray-400">
          © 2025 prfin.mx ・ Políticas ・ Contacto
        </footer>
      </div>
    </div>
  );
}
