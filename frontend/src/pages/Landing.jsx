import { useState } from "react";
import { motion } from "framer-motion";
import { FaBolt, FaCoins, FaShieldAlt, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Landing() {
  const [amount, setAmount] = useState(1000);
  const interestRate = 0.32;
  const days = 22;

  const totalToPay = amount + amount * interestRate;
  const dailyPayment = totalToPay / days;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1c] via-[#190f22] to-[#0f0f1c] animate-gradient bg-[length:200%_200%] text-white relative overflow-hidden px-4">
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
      <div className="flex flex-col items-center text-center mt-16">
        <h1 className="text-5xl md:text-6xl font-bold leading-tight">
          Préstamos rápidos <br /> y transparentes
        </h1>
        <p className="text-gray-300 mt-6 text-xl">
          Todo digital, sin papeles y con tasas claras.
        </p>
        <Link
          to="/login"
          className="mt-8 bg-gradient-to-r from-blue-500 to-pink-500 text-white py-3 px-8 rounded-full text-lg font-medium hover:scale-105 transition"
        >
          Ir a Login
        </Link>

        {/* Íconos animados */}
        <div className="flex justify-center gap-16 mt-12">
          <div className="flex flex-col items-center text-white text-xl">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
            >
              <FaBolt className="text-blue-400 text-4xl" />
            </motion.div>
            <span className="mt-3">Rapidez</span>
          </div>

          <div className="flex flex-col items-center text-white text-xl">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            >
              <FaCoins className="text-yellow-400 text-4xl" />
            </motion.div>
            <span className="mt-3">Tasas claras</span>
          </div>

          <div className="flex flex-col items-center text-white text-xl">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <FaShieldAlt className="text-blue-300 text-4xl" />
            </motion.div>
            <span className="mt-3">Seguridad</span>
          </div>
        </div>

        {/* Calculadora */}
        <div className="mt-16 bg-[#1a1a2e] p-8 rounded-2xl shadow-lg w-full max-w-xl">
          <h2 className="text-2xl font-semibold mb-4">Calcula tu pago a 22 días</h2>
          <p className="text-left text-base mb-2">
            Monto seleccionado: ${amount.toLocaleString()}
          </p>
          <input
            type="range"
            min="1000"
            max="15000"
            step="1000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-pink-500 transition-all duration-300"
          />
          <div className="flex justify-between text-base mt-1">
            <span>$1,000</span>
            <span>$15,000</span>
          </div>
          <div className="mt-6 text-xl">
            <p>
              <span className="text-pink-400 font-semibold">
                Total a pagar: ${totalToPay.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
            <p>
              <span className="text-pink-500 font-semibold">
                Pago diario: ${dailyPayment.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </p>
          </div>
        </div>

        {/* Beneficios extra */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-md text-left">
            <h3 className="text-lg font-bold text-white">Sin papeleo</h3>
            <p className="text-gray-400 mt-2">Todo 100% digital desde tu celular.</p>
          </div>
          <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-md text-left">
            <h3 className="text-lg font-bold text-white">Aprobación en minutos</h3>
            <p className="text-gray-400 mt-2">Recibe el dinero el mismo día.</p>
          </div>
          <div className="bg-[#1a1a2e] p-6 rounded-xl shadow-md text-left">
            <h3 className="text-lg font-bold text-white">Tasas claras</h3>
            <p className="text-gray-400 mt-2">Sin comisiones escondidas.</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-base text-gray-400">
          © 2025 prfin.mx ・ Políticas ・ Contacto
        </footer>
      </div>

      {/* Botón flotante WhatsApp */}
      <a
        href="https://wa.me/527822173753?text=Hola%20PRFIN,%20me%20gustaría%20más%20información%20sobre%20los%20préstamos."
        target="_blank"
        className="fixed bottom-4 right-4 z-50 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition"
      >
        <FaWhatsapp className="text-xl" />
      </a>
    </div>
  );
}
