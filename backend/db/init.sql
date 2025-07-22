-- C:\Users\1vkwi\prfin-app\backend\db\init.sql

-- Eliminar tablas si ya existen para un inicio limpio (CRÍTICO EN DESARROLLO - BORRARÁ TODOS LOS DATOS EXISTENTES)
DROP TABLE IF EXISTS pagos;
DROP TABLE IF EXISTS prestamos; -- Nueva tabla a borrar
DROP TABLE IF EXISTS usuarios;

-- Tabla de Usuarios (Prestatarios)
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_completo VARCHAR(255) NOT NULL,
    telefono_whatsapp VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    saldo_pendiente_total DECIMAL(10, 2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- NUEVA TABLA: Prestamos (para gestionar cada contrato de préstamo)
CREATE TABLE prestamos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id), -- A qué usuario pertenece este préstamo
    monto_capital DECIMAL(10, 2) NOT NULL, -- El monto inicial solicitado
    monto_interes DECIMAL(10, 2) NOT NULL, -- El interés total cobrado (ej. 32% del capital)
    monto_total_a_pagar DECIMAL(10, 2) NOT NULL, -- Capital + Interés
    plazo_dias INT NOT NULL, -- Días para pagar
    monto_cuota_diaria DECIMAL(10, 2) NOT NULL, -- Cuota diaria calculada
    fecha_inicio DATE DEFAULT CURRENT_DATE, -- Fecha en que se otorgó el préstamo
    estado_prestamo VARCHAR(50) DEFAULT 'ACTIVO', -- Ej: 'ACTIVO', 'PAGADO', 'CANCELADO', 'ATRASADO'
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pagos (MODIFICADA: Ahora referencia a un prestamo específico)
CREATE TABLE pagos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id), -- Clave foránea al usuario
    prestamo_id UUID NOT NULL REFERENCES prestamos(id) ON DELETE CASCADE, -- NUEVO: A qué préstamo pertenece esta cuota. ON DELETE CASCADE: Si se borra el préstamo, se borran sus cuotas.
    fecha_cuota DATE NOT NULL,
    monto_cuota DECIMAL(10, 2) NOT NULL,
    monto_pagado DECIMAL(10, 2) DEFAULT 0.00,
    fecha_pago TIMESTAMP WITH TIME ZONE,
    estado VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE', -- 'PENDIENTE', 'PAGADO', 'ATRASADO', 'PARCIAL'
    referencia_pago VARCHAR(255),
    observaciones TEXT,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento de las consultas
CREATE INDEX idx_pagos_usuario_id ON pagos(usuario_id);
CREATE INDEX idx_pagos_fecha_cuota ON pagos(fecha_cuota);
CREATE INDEX idx_usuarios_telefono ON usuarios(telefono_whatsapp);
CREATE INDEX idx_pagos_estado ON pagos(estado);
CREATE INDEX idx_prestamos_usuario_id ON prestamos(usuario_id); -- Nuevo índice

-- Trigger para actualizar fecha_actualizacion en usuarios
CREATE OR REPLACE FUNCTION update_fecha_actualizacion_usuarios()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_usuarios_fecha_actualizacion
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION update_fecha_actualizacion_usuarios();

-- Trigger para actualizar fecha_actualizacion en prestamos (NUEVO)
CREATE OR REPLACE FUNCTION update_fecha_actualizacion_prestamos()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_prestamos_fecha_actualizacion
BEFORE UPDATE ON prestamos
FOR EACH ROW
EXECUTE FUNCTION update_fecha_actualizacion_prestamos();

-- Trigger para actualizar fecha_actualizacion en pagos
CREATE OR REPLACE FUNCTION update_fecha_actualizacion_pagos()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_pagos_fecha_actualizacion
BEFORE UPDATE ON pagos
FOR EACH ROW
EXECUTE FUNCTION update_fecha_actualizacion_pagos();