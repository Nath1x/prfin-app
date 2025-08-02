const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: ['https://prfin-app.vercel.app', 'http://localhost:3000'],
  methods: ['GET']
}));

// Ruta de prueba
app.get('/api/prestamos', (req, res) => {
  res.json([
    { id: 1, cliente: "Juan Pérez", monto: 5000, estado: "Al día" },
    { id: 2, cliente: "María García", monto: 3200, estado: "Atrasado" }
  ]);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));