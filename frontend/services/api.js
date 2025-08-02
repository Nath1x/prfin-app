const API_URL = 'https://prfin-backend.onrender.com/api';

export async function getPrestamos() {
  const res = await fetch(`${API_URL}/prestamos`);
  if (!res.ok) throw new Error('Error al obtener préstamos');
  return await res.json();
}