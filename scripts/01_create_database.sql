-- ================================
-- BASE DE DATOS FOODLINK COMPLETA
-- VERSIÓN ACTUALIZADA Y CORREGIDA
-- ================================

-- Eliminar base de datos si existe para empezar limpio
DROP DATABASE IF EXISTS FoodLink;

-- Crear base de datos
CREATE DATABASE FoodLink CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE FoodLink;

-- ================================
-- TABLA: usuarios
-- ================================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('estudiante', 'cocinero', 'otro') NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    edad INT CHECK (edad >= 0),
    contrasena VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_correo (correo),
    INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- TABLA: comidas
-- ================================
CREATE TABLE comidas (
    id_comida INT AUTO_INCREMENT PRIMARY KEY,
    nombre_comida VARCHAR(100) NOT NULL,
    foto VARCHAR(255) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    cantidad INT DEFAULT 0 CHECK (cantidad >= 0),
    id_cocinero INT NOT NULL,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cocinero) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    INDEX idx_cocinero (id_cocinero),
    INDEX idx_cantidad (cantidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- TABLA: pedidos
-- ================================
CREATE TABLE pedidos (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    comida_id INT NOT NULL,
    cantidad INT NOT NULL CHECK (cantidad > 0),
    precio_unitario DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'preparando', 'listo', 'entregado', 'cancelado') DEFAULT 'pendiente',
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (comida_id) REFERENCES comidas(id_comida)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_comida (comida_id),
    INDEX idx_estado (estado),
    INDEX idx_fecha (fecha_pedido)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- TABLA: calificaciones
-- ================================
CREATE TABLE calificaciones (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL UNIQUE,
    usuario_id INT NOT NULL,
    comida_id INT NOT NULL,
    calificacion INT NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id_pedido)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (comida_id) REFERENCES comidas(id_comida)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    INDEX idx_pedido (pedido_id),
    INDEX idx_comida (comida_id),
    INDEX idx_calificacion (calificacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- TABLA: comentarios (para comidas)
-- ================================
CREATE TABLE comentarios (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_comida INT NOT NULL,
    comentario TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (id_comida) REFERENCES comidas(id_comida)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    INDEX idx_comida (id_comida),
    INDEX idx_usuario (id_usuario),
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- TABLA: comentarios_contacto
-- ================================
CREATE TABLE comentarios_contacto (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    asunto VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_fecha (fecha)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================
-- TRIGGERS
-- ================================

-- Trigger para restar cantidad de comida cuando se hace un pedido
DELIMITER $$
CREATE TRIGGER restar_cantidad_comida
AFTER INSERT ON pedidos
FOR EACH ROW
BEGIN
    UPDATE comidas
    SET cantidad = cantidad - NEW.cantidad
    WHERE id_comida = NEW.comida_id;
END$$
DELIMITER ;

-- Trigger para sumar cantidad de comida cuando se cancela un pedido
DELIMITER $$
CREATE TRIGGER devolver_cantidad_comida
AFTER UPDATE ON pedidos
FOR EACH ROW
BEGIN
    IF NEW.estado = 'cancelado' AND OLD.estado != 'cancelado' THEN
        UPDATE comidas
        SET cantidad = cantidad + OLD.cantidad
        WHERE id_comida = OLD.comida_id;
    END IF;
END$$
DELIMITER ;

-- ================================
-- DATOS DE PRUEBA
-- ================================

-- Insertar usuarios de prueba
INSERT INTO usuarios (nombre, tipo, correo, telefono, edad, contrasena) VALUES
('Juan Pérez', 'estudiante', 'juan@email.com', '3121234567', 20, '$2y$10$abcdefghijklmnopqrstuvwxyz123456789'),
('María García', 'cocinero', 'maria@email.com', '3129876543', 35, '$2y$10$abcdefghijklmnopqrstuvwxyz123456789'),
('Pedro López', 'cocinero', 'pedro@email.com', '3125551234', 40, '$2y$10$abcdefghijklmnopqrstuvwxyz123456789');

-- Insertar comidas de prueba
INSERT INTO comidas (nombre_comida, foto, precio, cantidad, id_cocinero, descripcion) VALUES
('Tacos al Pastor', 'foto1.jpg', 45.00, 20, 2, 'Deliciosos tacos con carne de cerdo marinada'),
('Enchiladas Verdes', 'foto2.jpg', 55.00, 15, 2, 'Enchiladas bañadas en salsa verde con crema'),
('Pozole Rojo', 'foto3.jpg', 70.00, 10, 3, 'Tradicional pozole con carne de cerdo'),
('Quesadillas', 'foto4.jpg', 35.00, 25, 3, 'Quesadillas de queso con tortilla hecha a mano');
