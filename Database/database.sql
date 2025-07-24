CREATE DATABASE db_tienda_online;

USE db_tienda_online;
-- 1. Tabla de Usuarios
-- Almacena la información de los usuarios que se registrarán en la aplicación.
-- Incluye un campo para almacenar el hash de la contraseña (password_hash).
CREATE TABLE IF NOT EXISTS tbl_usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Productos
-- Almacena el catálogo de artículos disponibles para la venta.
CREATE TABLE IF NOT EXISTS tbl_productos (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    imagen_url VARCHAR(255), -- URL a la imagen del producto
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Tabla para ítems en el Carrito
-- Almacena los productos que un usuario ha añadido a su carrito de forma persistente.
-- El carrito está asociado a un usuario específico (id_usuario).
CREATE TABLE IF NOT EXISTS tbl_carrito_items (
    id_item_carrito INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT, -- Clave foránea a tbl_usuarios (se habilitará más tarde)
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL, -- Precio en el momento de añadir al carrito
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto)
    -- CONSTRAINT fk_carrito_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario) -- Descomentar al crear tbl_usuarios
);

-- 4. Tabla de Pedidos
-- Registra los pedidos finalizados por los usuarios.
-- Cada pedido está asociado a un usuario (id_usuario).
CREATE TABLE IF NOT EXISTS tbl_pedidos (
    id_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_usuario INT NOT NULL, -- Clave foránea a tbl_usuarios (se habilitará más tarde)
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    estado ENUM('pendiente', 'procesando', 'enviado', 'entregado', 'cancelado') DEFAULT 'pendiente'
    -- CONSTRAINT fk_pedidos_usuario FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario) -- Descomentar al crear tbl_usuarios
);

-- 5. Tabla de Detalles del Pedido
-- Almacena cada producto individual que forma parte de un pedido específico.
CREATE TABLE IF NOT EXISTS tbl_pedido_detalles (
    id_detalle_pedido INT PRIMARY KEY AUTO_INCREMENT,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    nombre_producto VARCHAR(255) NOT NULL, -- Guarda el nombre para que no dependa del catálogo si cambia
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL, -- Precio del producto en el momento de la compra
    FOREIGN KEY (id_pedido) REFERENCES tbl_pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES tbl_productos(id_producto)
);


-- Añadir clave foránea a tbl_carrito_items
ALTER TABLE tbl_carrito_items
ADD CONSTRAINT fk_carrito_usuario
FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario)
ON DELETE CASCADE; -- Opcional: CASCADE significa que si un usuario se elimina, sus ítems del carrito también.

-- Añadir clave foránea a tbl_pedidos
ALTER TABLE tbl_pedidos
ADD CONSTRAINT fk_pedidos_usuario
FOREIGN KEY (id_usuario) REFERENCES tbl_usuarios(id_usuario)
ON DELETE RESTRICT;


-- INSERTS
INSERT INTO tbl_productos (nombre, descripcion, precio, stock, imagen_url) VALUES
('IPhone 13 pro', 'Potente smartphone con cámara de 108MP y pantalla AMOLED.', 699.99, 50, 'https://placehold.co/400x400/007bff/ffffff?text=Smartphone+X'),
('Auriculares Inalámbricos Pro', 'Sonido de alta fidelidad con cancelación de ruido activa.', 129.99, 120, 'https://placehold.co/400x400/28a745/ffffff?text=Auriculares+Pro'),
('Smartwatch Elegante', 'Reloj inteligente con monitor de ritmo cardíaco y GPS.', 89.95, 80, 'https://placehold.co/400x400/ffc107/000000?text=Smartwatch'),
('Laptop Ultradelgada 14"', 'Portátil ligero y potente para trabajo y estudio.', 999.00, 30, 'https://placehold.co/400x400/dc3545/ffffff?text=Laptop+Ultra'),
('Teclado Mecánico RGB', 'Teclado gaming con retroiluminación RGB personalizable.', 79.00, 70, 'https://placehold.co/400x400/6f42c1/ffffff?text=Teclado+RGB'),
('Mouse Gaming Inalámbrico', 'Ratón ergonómico con alta precisión para juegos.', 35.99, 150, 'https://placehold.co/400x400/fd7e14/ffffff?text=Mouse+Gaming'),
('Monitor Curvo 27"', 'Experiencia inmersiva con monitor curvo Full HD.', 249.50, 40, 'https://placehold.co/400x400/20c997/ffffff?text=Monitor+Curvo'),
('Webcam Full HD', 'Cámara web de alta definición para videollamadas.', 29.99, 200, 'https://placehold.co/400x400/6610f2/ffffff?text=Webcam+HD'),
('Router Wi-Fi 6', 'Conexión a internet ultrarrápida y estable.', 85.00, 60, 'https://placehold.co/400x400/e83e8c/ffffff?text=Router+WiFi6'),
('Disco Duro Externo 1TB', 'Almacenamiento portátil de gran capacidad.', 59.90, 90, 'https://placehold.co/400x400/17a2b8/ffffff?text=HDD+1TB'),
('Cámara de Seguridad IP', 'Vigilancia inteligente para el hogar con visión nocturna.', 65.00, 45, 'https://placehold.co/400x400/6c757d/ffffff?text=Camara+IP'),
('Kit de Herramientas Básico', 'Juego de herramientas esenciales para el hogar.', 25.00, 180, 'https://placehold.co/400x400/343a40/ffffff?text=Kit+Herramientas'),
('Mochila Antirrobo', 'Mochila segura con compartimentos ocultos y puerto USB.', 45.75, 70, 'https://placehold.co/400x400/f8f9fa/000000?text=Mochila+Antirrobo'),
('Cafetera Programable', 'Cafetera automática con temporizador y filtro reutilizable.', 70.00, 35, 'https://placehold.co/400x400/e9ecef/000000?text=Cafetera'),
('Licuadora de Alta Potencia', 'Licuadora robusta para batidos y sopas.', 55.20, 40, 'https://placehold.co/400x400/ced4da/000000?text=Licuadora'),
('Set de Sartenes Antiadherentes', 'Juego de 3 sartenes de diferentes tamaños.', 60.00, 60, 'https://placehold.co/400x400/adb5bd/000000?text=Sartenes'),
('Robot Aspirador Inteligente', 'Aspiradora automática con mapeo y control por app.', 299.00, 25, 'https://placehold.co/400x400/6c757d/ffffff?text=Robot+Aspirador'),
('Lámpara de Escritorio LED', 'Lámpara moderna con intensidad de luz ajustable.', 22.50, 110, 'https://placehold.co/400x400/495057/ffffff?text=Lampara+LED'),
('Altavoz Bluetooth Portátil', 'Sonido potente y batería de larga duración para exteriores.', 40.00, 95, 'https://placehold.co/400x400/343a40/ffffff?text=Altavoz+BT'),
('Gafas de Sol Polarizadas', 'Diseño clásico con protección UV400.', 29.99, 85, 'https://placehold.co/400x400/f8f9fa/000000?text=Gafas+Sol');
