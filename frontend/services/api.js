export async function getPrestamos() {
  const res = await fetch('https://prfin-backend.onrender.com/api/prestamos');
  if (!res.ok) throw new Error('Error al cargar préstamos');
  return await res.json();
}