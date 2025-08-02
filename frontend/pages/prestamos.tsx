import { useState, useEffect } from 'react';

interface Prestamo {
  id: number;
  cliente: string;
  monto: number;
  estado: string;
}

export default function PrestamosPage() {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);

  useEffect(() => {
    fetch('https://prfin-backend.onrender.com/api/prestamos')
      .then(res => res.json())
      .then(data => setPrestamos(data))
      .catch(error => console.error('Error:', error));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Préstamos</h1>
      <ul className="space-y-2">
        {prestamos.map(prestamo => (
          <li key={prestamo.id} className="border p-3 rounded">
            <div className="font-medium">{prestamo.cliente}</div>
            <div className="flex justify-between">
              <span>${prestamo.monto.toLocaleString()}</span>
              <span className={
                prestamo.estado === "Al día" ? "text-green-600" : "text-red-600"
              }>
                {prestamo.estado}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}