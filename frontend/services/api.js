export async function getPrestamos() {
  const res = await fetch('http://localhost:3001/api/prestamos');
  return await res.json();
}