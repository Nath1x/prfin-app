// C:\Users\1vkwi\prfin-app\backend\server.js

// Carga las variables de entorno desde el archivo .env al inicio
require('dotenv').config();

const express = require('express');
const { Pool } = require('pg'); // Cliente PostgreSQL
const cors = require('cors');   // Manejo de CORS
const bcrypt = require('bcryptjs'); // Para cifrar contraseñas
const jwt = require('jsonwebtoken'); // Para JSON Web Tokens
const twilio = require('twilio'); // Importa la librería de Twilio

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// --- Configuración de la conexión para Render ---
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, 
    ssl: {
        rejectUnauthorized: false // Requerido para conexiones a Render DB
    }
});

// Inicializar cliente de Twilio
const twilioClient = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWilio_AUTH_TOKEN);
const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER; // Tu número de sandbox de Twilio

// --- FUNCIONES DE AYUDA PARA WHATSAPP ---
async function sendWhatsAppMessage(to, body) {
    try {
        const message = await twilioClient.messages.create({
            from: twilioWhatsappNumber,
            body: body,
            to: `whatsapp:${to}`,
        });
        console.log(`Mensaje WhatsApp enviado a ${to}:`, message.sid);
        return { success: true, sid: message.sid };
    } catch (error) {
        console.error(`Error al enviar mensaje WhatsApp a ${to}:`, error.message);
        throw new Error(`Fallo al enviar WhatsApp: ${error.message}`);
    }
}


// Middleware para proteger rutas y verificar roles
const authenticateToken = (requiredRole) => {
    return async (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
            if (err) {
                console.error("JWT verification error:", err.message);
                return res.sendStatus(403);
            }
            
            req.user = user;

            if (requiredRole) {
                try {
                    const result = await pool.query('SELECT rol FROM usuarios WHERE id = $1', [user.id]);
                    const userRole = result.rows[0] ? result.rows[0].rol : null;

                    if (!userRole || userRole !== requiredRole) {
                        console.warn(`Acceso denegado para usuario ${user.id}. Rol requerido: ${requiredRole}, Rol actual: ${userRole}`);
                        return res.status(403).json({ error: 'Acceso denegado. Rol insuficiente.' });
                    }
                } catch (dbError) {
                    console.error('Error al verificar rol del usuario en DB:', dbError.message);
                    return res.status(500).json({ error: 'Error interno del servidor al verificar rol.' });
                }
            }
            next();
        });
    };
};

// --- RUTAS DE PRUEBA ---

app.get('/', (req, res) => {
    res.send('¡Backend de PrFin funcionando!');
});

app.get('/test-db', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW() as db_time');
        client.release();
        res.json({
            message: 'Conexión a la base de datos de PrFin exitosa',
            dbTime: result.rows[0].db_time
        });
    } catch (error) {
        console.error('Error al conectar o consultar la base de datos:', error);
        res.status(500).json({ error: 'Error al conectar a la base de datos', details: error.message });
    }
});

app.post('/api/test-whatsapp', authenticateToken(), async (req, res) => {
    const { to, messageBody } = req.body;
    if (!to || !messageBody) {
        return res.status(400).json({ error: 'Número de destino y cuerpo del mensaje son obligatorios.' });
    }
    try {
        const result = await sendWhatsAppMessage(to, messageBody); 
        res.json({ message: 'Mensaje de prueba WhatsApp enviado con éxito.', sid: result.sid });
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar mensaje de prueba WhatsApp.', details: error.message });
    }
});


// --- RUTAS DE AUTENTICACIÓN Y USUARIOS ---

app.post('/api/register', authenticateToken('admin'), async (req, res) => {
    const { nombre_completo, telefono_whatsapp, password, rol, cobrador_asignado_id } = req.body;
    if (!nombre_completo || !telefono_whatsapp || !password) {
        return res.status(400).json({ error: 'Nombre, teléfono y contraseña son obligatorios.' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        let finalRole = 'cliente';
        if (req.user.rol === 'admin' && (rol === 'admin' || rol === 'cobrador')) {
            finalRole = rol;
        }

        let finalCobradorAsignadoId = null;
        if (req.user.rol === 'admin' && cobrador_asignado_id) {
            finalCobradorAsignadoId = cobrador_asignado_id;
        }

        const result = await pool.query(
            'INSERT INTO usuarios (nombre_completo, telefono_whatsapp, password_hash, rol, cobrador_asignado_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, nombre_completo, telefono_whatsapp, rol',
            [nombre_completo, telefono_whatsapp, password_hash, finalRole, finalCobradorAsignadoId]
        );
        res.status(201).json({ message: 'Usuario registrado exitosamente', user: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'El número de WhatsApp ya está registrado.' });
        }
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar usuario', details: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { telefono_whatsapp, password } = req.body;
    if (!telefono_whatsapp || !password) {
        return res.status(400).json({ error: 'Número de WhatsApp y contraseña son obligatorios.' });
    }
    try {
        const result = await pool.query(
            'SELECT id, nombre_completo, telefono_whatsapp, password_hash, rol FROM usuarios WHERE telefono_whatsapp = $1',
            [telefono_whatsapp]
        );
        const user = result.rows[0];
        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }
        const token = jwt.sign(
            { id: user.id, telefono_whatsapp: user.telefono_whatsapp, nombre_completo: user.nombre_completo, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({ message: 'Login exitoso', token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor al iniciar sesión', details: error.message });
    }
});

app.get('/api/me', authenticateToken(), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, nombre_completo, telefono_whatsapp, saldo_pendiente_total, activo, rol FROM usuarios WHERE id = $1',
            [req.user.id]
        );
        const user = result.rows[0];
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener datos del usuario', details: error.message });
    }
});

app.get('/api/me/pagos', authenticateToken(), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, fecha_cuota, monto_cuota, monto_pagado, fecha_pago, estado, referencia_pago, observaciones FROM pagos WHERE usuario_id = $1 ORDER BY fecha_cuota DESC',
            [req.user.id]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener pagos del usuario autenticado:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener pagos', details: error.message });
    }
});

// --- RUTAS PARA COBRADORES ---
app.get('/api/cobrador/mis-clientes', authenticateToken('cobrador'), async (req, res) => {
    try {
        const cobradorId = req.user.id;
        const result = await pool.query(
            'SELECT id, nombre_completo, telefono_whatsapp, saldo_pendiente_total, activo FROM usuarios WHERE cobrador_asignado_id = $1 ORDER BY nombre_completo',
            [cobradorId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener clientes asignados para cobrador:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener clientes asignados', details: error.message });
    }
});

app.get('/api/cobrador/mis-pagos-pendientes', authenticateToken('cobrador'), async (req, res) => {
    try {
        const cobradorId = req.user.id;
        const result = await pool.query(
            `SELECT 
                p.id, p.usuario_id, p.prestamo_id, p.fecha_cuota, p.monto_cuota, p.monto_pagado, p.estado,
                u.nombre_completo as cliente_nombre, u.telefono_whatsapp as cliente_telefono
            FROM pagos p
            JOIN usuarios u ON p.usuario_id = u.id
            WHERE u.cobrador_asignado_id = $1 AND p.estado IN ('PENDIENTE', 'PARCIAL')
            ORDER BY p.fecha_cuota ASC`,
            [cobradorId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener pagos pendientes para cobrador:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener pagos pendientes', details: error.message });
    }
});


// --- GESTIÓN DE PAGOS (API para el panel de administración) ---

app.post('/api/admin/prestamos', authenticateToken('admin'), async (req, res) => {
    const { usuario_id, monto_prestamo, plazo_dias } = req.body;
    if (!usuario_id || !monto_prestamo || !plazo_dias) {
        return res.status(400).json({ error: 'Usuario, monto del préstamo y plazo en días son obligatorios.' });
    }
    const parsedMontoPrestamo = parseFloat(monto_prestamo);
    const parsedPlazoDias = parseInt(plazo_dias, 10);
    if (isNaN(parsedMontoPrestamo) || parsedPlazoDias <= 0 || parsedMontoPrestamo <= 0) {
        return res.status(400).json({ error: 'Monto del préstamo y plazo deben ser números válidos y mayores a cero.' });
    }
    const tasaInteres = 0.32;
    const montoInteresCalculado = parsedMontoPrestamo * tasaInteres;
    const montoTotalAPagar = parsedMontoPrestamo + montoInteresCalculado;
    const montoCuotaDiariaCalculado = montoTotalAPagar / parsedPlazoDias;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const prestamoResult = await client.query(
            'INSERT INTO prestamos (usuario_id, monto_capital, monto_interes, monto_total_a_pagar, plazo_dias, monto_cuota_diaria) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, fecha_inicio, monto_total_a_pagar, monto_cuota_diaria',
            [usuario_id, parsedMontoPrestamo, montoInteresCalculado, montoTotalAPagar, parsedPlazoDias, montoCuotaDiariaCalculado]
        );
        const prestamoId = prestamoResult.rows[0].id;
        const fechaInicioPrestamo = prestamoResult.rows[0].fecha_inicio;
        await client.query(
            'UPDATE usuarios SET saldo_pendiente_total = saldo_pendiente_total + $1 WHERE id = $2',
            [montoTotalAPagar, usuario_id]
        );
        const cuotasGeneradas = [];
        let fechaActualCuota = new Date(fechaInicioPrestamo);
        fechaActualCuota.setHours(0, 0, 0, 0);
        for (let i = 0; i < parsedPlazoDias; i++) {
            const fechaCuota = new Date(fechaActualCuota);
            fechaCuota.setDate(fechaActualCuota.getDate() + i);
            const cuotaResult = await client.query(
                'INSERT INTO pagos (usuario_id, prestamo_id, fecha_cuota, monto_cuota, estado) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [usuario_id, prestamoId, fechaCuota.toISOString().split('T')[0], montoCuotaDiariaCalculado, 'PENDIENTE']
            );
            cuotasGeneradas.push(cuotaResult.rows[0]);
        }
        await client.query('COMMIT');
        res.status(201).json({
            message: 'Préstamo y cuotas registradas exitosamente.',
            prestamo: prestamoResult.rows[0],
            cuotas: cuotasGeneradas
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al registrar préstamo y cuotas:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar préstamo', details: error.message });
    } finally {
        client.release();
    }
});

app.delete('/api/admin/prestamos/:id', authenticateToken('admin'), async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const prestamoResult = await client.query(
            'SELECT usuario_id, monto_total_a_pagar FROM prestamos WHERE id = $1',
            [id]
        );
        const prestamo = prestamoResult.rows[0];
        if (!prestamo) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Préstamo no encontrado.' });
        }
        const pagosAsociadosResult = await client.query(
            'SELECT SUM(monto_pagado) as total_pagado_en_prestamo FROM pagos WHERE prestamo_id = $1',
            [id]
        );
        const totalPagadoEnPrestamo = parseFloat(pagosAsociadosResult.rows[0].total_pagado_en_prestamo) || 0;
        if (totalPagadoEnPrestamo > 0) {
             await client.query('ROLLBACK');
             return res.status(400).json({ error: `No se puede eliminar un préstamo con pagos registrados ($${totalPagadoEnPrestamo.toFixed(2)} ya pagado).` });
        }
        await client.query(
            'UPDATE usuarios SET saldo_pendiente_total = saldo_pendiente_total - $1 WHERE id = $2',
            [prestamo.monto_total_a_pagar, prestamo.usuario_id]
        );
        await client.query(
            'DELETE FROM prestamos WHERE id = $1',
            [id]
        );
        await client.query('COMMIT');
        res.status(200).json({ message: 'Préstamo eliminado exitosamente. Saldo de usuario ajustado.' });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al eliminar préstamo:', error);
        res.status(500).json({ error: 'Error interno del servidor al eliminar préstamo', details: error.message });
    } finally {
        client.release();
    }
});

// ##########################################################################
// ## RUTA MODIFICADA PARA ENVIAR WHATSAPP TRAS UN PAGO ##
// ##########################################################################
app.post('/api/admin/pagar', authenticateToken('admin'), async (req, res) => {
    const { pago_id, monto_pagado, referencia_pago } = req.body;

    if (!pago_id || !monto_pagado) {
        return res.status(400).json({ error: 'ID de pago y monto son obligatorios.' });
    }
    const parsedMontoPagado = parseFloat(monto_pagado);
    if (isNaN(parsedMontoPagado) || parsedMontoPagado <= 0) {
        return res.status(400).json({ error: 'Monto pagado debe ser un número válido y mayor a cero.' });
    }
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const pagoResult = await client.query(
            `SELECT 
                p.usuario_id, p.monto_cuota, p.monto_pagado, p.prestamo_id,
                u.nombre_completo, u.telefono_whatsapp
             FROM pagos p
             JOIN usuarios u ON p.usuario_id = u.id
             WHERE p.id = $1 FOR UPDATE`,
            [pago_id]
        );
        const pago = pagoResult.rows[0];

        if (!pago) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Cuota no encontrada.' });
        }
        if (pago.monto_pagado >= pago.monto_cuota) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: 'Esta cuota ya ha sido pagada en su totalidad.' });
        }

        let montoRealmentePagadoEnEstaTransaccion = parsedMontoPagado;
        let nuevoMontoPagadoCuota = pago.monto_pagado + parsedMontoPagado;
        if (nuevoMontoPagadoCuota > pago.monto_cuota) {
            montoRealmentePagadoEnEstaTransaccion = pago.monto_cuota - pago.monto_pagado;
            nuevoMontoPagadoCuota = pago.monto_cuota;
        }
        let nuevoEstadoCuota = (nuevoMontoPagadoCuota >= pago.monto_cuota) ? 'PAGADO' : 'PARCIAL';
        
        const updatedPagoResult = await client.query(
            'UPDATE pagos SET monto_pagado = $1, fecha_pago = NOW(), estado = $2, referencia_pago = $3 WHERE id = $4 RETURNING *',
            [nuevoMontoPagadoCuota, nuevoEstadoCuota, referencia_pago, pago_id]
        );

        await client.query(
            'UPDATE usuarios SET saldo_pendiente_total = saldo_pendiente_total - $1 WHERE id = $2',
            [montoRealmentePagadoEnEstaTransaccion, pago.usuario_id]
        );

        if (pago.telefono_whatsapp) {
            const mensajeWhatsApp = `Hola ${pago.nombre_completo}, confirmamos tu pago de $${montoRealmentePagadoEnEstaTransaccion.toFixed(2)} MXN. ¡Gracias!\n\nReferencia: ${referencia_pago || 'N/A'}`;
            try {
                await sendWhatsAppMessage(pago.telefono_whatsapp, mensajeWhatsApp);
                console.log(`Mensaje de confirmación de pago enviado a ${pago.telefono_whatsapp}`);
            } catch (whatsappError) {
                console.error('Error al enviar WhatsApp (el pago SÍ fue registrado):', whatsappError.message);
            }
        }

        await client.query('COMMIT');
        res.status(200).json({
            message: 'Pago registrado y notificación enviada exitosamente.',
            pagoActualizado: updatedPagoResult.rows[0],
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error al registrar pago:', error);
        res.status(500).json({ error: 'Error interno del servidor al registrar pago', details: error.message });
    } finally {
        client.release();
    }
});


// Obtener todos los usuarios (para el admin)
app.get('/api/admin/usuarios', authenticateToken('admin'), async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre_completo, telefono_whatsapp, saldo_pendiente_total, activo, rol, cobrador_asignado_id, fecha_creacion FROM usuarios ORDER BY fecha_creacion DESC'); // ¡CORREGIDO! Aquí se añadieron rol y cobrador_asignado_id
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios (admin):', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

// Obtener pagos de un usuario específico (para el admin)
app.get('/api/admin/pagos/:userId', authenticateToken('admin'), async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM pagos WHERE usuario_id = $1 ORDER BY fecha_cuota DESC',
            [userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener pagos de usuario (admin):', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

// Obtener todos los préstamos (para el admin)
app.get('/api/admin/prestamos', authenticateToken('admin'), async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT p.*, u.nombre_completo, u.telefono_whatsapp FROM prestamos p JOIN usuarios u ON p.usuario_id = u.id ORDER BY p.fecha_creacion DESC'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener préstamos (admin):', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
});

// Inicia el servidor Express en el puerto especificado
app.listen(port, () => {
    console.log(`Servidor backend de PrFin escuchando en http://localhost:${port}`);
});