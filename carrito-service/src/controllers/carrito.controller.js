import { getDatabase } from '../db.js';
import { success, error } from '../responses/response.js';

/**
 * Obtiene el contenido del carrito para un usuario específico.
 * El id_usuario se obtiene de la cabecera 'x-user-id' proporcionada por el API Gateway.
 */
export const getCarrito = async (req, res) => {
    try {
        const id_usuario = req.headers['x-user-id']; // Obtener id_usuario del header
        // Para pruebas temporales sin el ID del token, puedes descomentar la siguiente línea
        // const id_usuario = 1; // TEMPORAL: Usar un ID de usuario fijo para pruebas

        if (!id_usuario) {
            console.error('Carrito Controller - getCarrito: ID de usuario no proporcionado en la cabecera x-user-id.');
            return error(req, res, 'ID de usuario no proporcionado en el token', 401);
        }
        
        const connection = getDatabase();

        const [rows] = await connection.query(
            `SELECT
                ci.id_item_carrito,
                ci.id_producto,
                p.nombre AS nombre_producto,
                p.imagen_url,
                ci.cantidad,
                ci.precio_unitario,
                (ci.cantidad * ci.precio_unitario) AS subtotal
            FROM tbl_carrito_items ci
            JOIN tbl_productos p ON ci.id_producto = p.id_producto
            WHERE ci.id_usuario = ?`,
            [id_usuario]
        );

        success(req, res, rows, 'Contenido del carrito obtenido exitosamente');
    } catch (err) {
        console.error('Error al obtener el carrito:', err);
        error(req, res, 'Error al obtener el carrito', 500, err);
    }
};

/**
 * Añade un producto al carrito o actualiza su cantidad si ya existe.
 * El id_usuario se obtiene de la cabecera 'x-user-id'.
 */
export const addOrUpdateProductoInCarrito = async (req, res) => {
    try {
        const id_usuario = req.headers['x-user-id']; // Obtener id_usuario del header
        // Para pruebas temporales sin el ID del token, puedes descomentar la siguiente línea
        // const id_usuario = 1; // TEMPORAL: Usar un ID de usuario fijo para pruebas
        
        if (!id_usuario) {
            console.error('Carrito Controller - addOrUpdateProductoInCarrito: ID de usuario no proporcionado en la cabecera x-user-id.');
            return error(req, res, 'ID de usuario no proporcionado en el token', 401);
        }

        const { id_producto, cantidad } = req.body; // 'cantidad' es la cantidad a añadir/establecer

        if (!id_producto || !cantidad || cantidad <= 0) {
            return error(req, res, 'ID de producto y cantidad válidos son obligatorios', 400);
        }

        const connection = getDatabase();

        // 1. Verificar si el producto existe y obtener su precio actual y stock
        const [productRows] = await connection.query('SELECT precio, stock, nombre FROM tbl_productos WHERE id_producto = ?', [id_producto]);
        if (productRows.length === 0) {
            return error(req, res, 'Producto no encontrado', 404);
        }
        const { precio: precio_unitario, stock, nombre: nombre_producto } = productRows[0];

        // Validar que la cantidad inicial no exceda el stock
        if (cantidad > stock) {
            return error(req, res, `Stock insuficiente para el producto ${nombre_producto}. Disponible: ${stock}`, 400);
        }

        // 2. Verificar si el producto ya está en el carrito del usuario
        const [cartItemRows] = await connection.query(
            'SELECT id_item_carrito, cantidad FROM tbl_carrito_items WHERE id_usuario = ? AND id_producto = ?',
            [id_usuario, id_producto]
        );

        let result;
        let message = '';

        if (cartItemRows.length > 0) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            const existingCantidad = cartItemRows[0].cantidad;
            const newCantidad = existingCantidad + cantidad; // Suma la cantidad enviada a la existente

            // Validar que la nueva cantidad total no exceda el stock
            if (newCantidad > stock) {
                return error(req, res, `Stock insuficiente. No se puede añadir ${cantidad} unidades. Disponible: ${stock - existingCantidad} para ${nombre_producto}`, 400);
            }

            [result] = await connection.query(
                'UPDATE tbl_carrito_items SET cantidad = ?, precio_unitario = ? WHERE id_item_carrito = ?',
                [newCantidad, precio_unitario, cartItemRows[0].id_item_carrito]
            );
            message = 'Cantidad de producto en carrito actualizada exitosamente';
        } else {
            // Si el producto no está en el carrito, añadirlo
            [result] = await connection.query(
                'INSERT INTO tbl_carrito_items (id_usuario, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [id_usuario, id_producto, cantidad, precio_unitario]
            );
            message = 'Producto añadido al carrito exitosamente';
        }

        success(req, res, { id_usuario, id_producto, cantidad }, message, 200);

    } catch (err) {
        console.error('Error al añadir/actualizar producto en el carrito:', err);
        error(req, res, 'Error al añadir/actualizar producto en el carrito', 500, err);
    }
};


/**
 * Actualiza la cantidad de un producto específico en el carrito.
 * El id_usuario se obtiene de la cabecera 'x-user-id'.
 * El id_producto se obtiene de los parámetros de la URL.
 */
export const updateCarritoItemCantidad = async (req, res) => {
    try {
        const id_usuario = req.headers['x-user-id']; // Obtener id_usuario del header
        // Para pruebas temporales sin el ID del token, puedes descomentar la siguiente línea
        // const id_usuario = 1; // TEMPORAL: Usar un ID de usuario fijo para pruebas

        if (!id_usuario) {
            console.error('Carrito Controller - updateCarritoItemCantidad: ID de usuario no proporcionado en la cabecera x-user-id.');
            return error(req, res, 'ID de usuario no proporcionado en el token', 401);
        }
        const { id_producto } = req.params; // id_producto aún se espera en la URL para identificar el ítem
        const { cantidad } = req.body;

        if (!cantidad || cantidad <= 0) {
            return error(req, res, 'Cantidad válida es obligatoria', 400);
        }

        const connection = getDatabase();

        // Verificar stock antes de actualizar
        const [productRows] = await connection.query('SELECT stock, nombre FROM tbl_productos WHERE id_producto = ?', [id_producto]);
        if (productRows.length === 0) {
            return error(req, res, 'Producto no encontrado en el catálogo', 404);
        }
        const { stock, nombre: nombre_producto } = productRows[0];

        if (cantidad > stock) { // Si la cantidad solicitada excede el stock disponible
            return error(req, res, `Stock insuficiente para ${nombre_producto}. Disponible: ${stock}. Cantidad solicitada: ${cantidad}`, 400);
        }

        const [result] = await connection.query(
            'UPDATE tbl_carrito_items SET cantidad = ? WHERE id_usuario = ? AND id_producto = ?',
            [cantidad, id_usuario, id_producto]
        );

        if (result.affectedRows === 0) {
            return error(req, res, 'Producto no encontrado en el carrito del usuario', 404);
        }

        success(req, res, { id_usuario, id_producto: parseInt(id_producto), cantidad }, 'Cantidad del producto en carrito actualizada exitosamente');
    } catch (err) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', err);
        error(req, res, 'Error al actualizar la cantidad del producto en el carrito', 500, err);
    }
};

/**
 * Elimina un producto del carrito.
 * El id_usuario se obtiene de la cabecera 'x-user-id'.
 * El id_producto se obtiene de los parámetros de la URL.
 */
export const removeProductoFromCarrito = async (req, res) => {
    try {
        const id_usuario = req.headers['x-user-id']; // Obtener id_usuario del header
        // Para pruebas temporales sin el ID del token, puedes descomentar la siguiente línea
        // const id_usuario = 1; // TEMPORAL: Usar un ID de usuario fijo para pruebas

        if (!id_usuario) {
            console.error('Carrito Controller - removeProductoFromCarrito: ID de usuario no proporcionado en la cabecera x-user-id.');
            return error(req, res, 'ID de usuario no proporcionado en el token', 401);
        }
        const { id_producto } = req.params; // id_producto aún se espera en la URL para identificar el ítem
        const connection = getDatabase();

        const [result] = await connection.query(
            'DELETE FROM tbl_carrito_items WHERE id_usuario = ? AND id_producto = ?',
            [id_usuario, id_producto]
        );

        if (result.affectedRows === 0) {
            return error(req, res, 'Producto no encontrado en el carrito del usuario', 404);
        }

        success(req, res, { id_usuario, id_producto: parseInt(id_producto) }, 'Producto eliminado del carrito exitosamente', 200);
    } catch (err) {
        console.error('Error al eliminar producto del carrito:', err);
        error(req, res, 'Error al eliminar producto del carrito', 500, err);
    }
};

/**
 * Vacía completamente el carrito de un usuario.
 * El id_usuario se obtiene de la cabecera 'x-user-id'.
 */
export const clearCarrito = async (req, res) => {
    try {
        const id_usuario = req.headers['x-user-id']; // Obtener id_usuario del header
        // Para pruebas temporales sin el ID del token, puedes descomentar la siguiente línea
        // const id_usuario = 1; // TEMPORAL: Usar un ID de usuario fijo para pruebas

        if (!id_usuario) {
            console.error('Carrito Controller - clearCarrito: ID de usuario no proporcionado en la cabecera x-user-id.');
            return error(req, res, 'ID de usuario no proporcionado en el token', 401);
        }
        const connection = getDatabase();

        const [result] = await connection.query(
            'DELETE FROM tbl_carrito_items WHERE id_usuario = ?',
            [id_usuario]
        );

        success(req, res, { id_usuario }, `Carrito vaciado para el usuario ${id_usuario}`, 200);
    } catch (err) {
        console.error('Error al vaciar el carrito:', err);
        error(req, res, 'Error al vaciar el carrito', 500, err);
    }
};


/**
 * Finaliza la compra: crea un pedido a partir del carrito y lo vacía.
 * El id_usuario se obtiene de la cabecera 'x-user-id'.
 * Implementación básica. Requiere más lógica (transacciones, stock, etc.).
 */
export const checkoutCarrito = async (req, res) => {
    const connection = getDatabase();
    let conn; // Variable para almacenar la conexión de la transacción

    try {
        const id_usuario = req.headers['x-user-id']; // Obtener id_usuario del header
        // Para pruebas temporales sin el ID del token, puedes descomentar la siguiente línea
        // const id_usuario = 1; // TEMPORAL: Usar un ID de usuario fijo para pruebas

        if (!id_usuario) {
            console.error('Carrito Controller - checkoutCarrito: ID de usuario no proporcionado en la cabecera x-user-id.');
            return error(req, res, 'ID de usuario no proporcionado en el token', 401);
        }
        let totalPedido = 0;

        // Iniciar transacción para asegurar la atomicidad de la compra
        conn = await connection.getConnection(); // Obtener una conexión individual del pool
        await conn.beginTransaction();

        // 1. Obtener ítems del carrito del usuario
        const [cartItems] = await conn.query(
            `SELECT
                ci.id_producto,
                ci.cantidad,
                ci.precio_unitario,
                p.stock AS producto_stock,
                p.nombre AS nombre_producto
            FROM tbl_carrito_items ci
            JOIN tbl_productos p ON ci.id_producto = p.id_producto
            WHERE ci.id_usuario = ?`,
            [id_usuario]
        );

        if (cartItems.length === 0) {
            await conn.rollback();
            return error(req, res, 'El carrito está vacío, no se puede finalizar la compra', 400);
        }

        const pedidoDetalles = [];
        // 2. Validar stock y calcular total, preparar detalles del pedido
        for (const item of cartItems) {
            if (item.cantidad > item.producto_stock) {
                await conn.rollback(); // Rollback si hay stock insuficiente
                return error(req, res, `Stock insuficiente para ${item.nombre_producto}. Disponible: ${item.producto_stock}, solicitado: ${item.cantidad}`, 400);
            }
            totalPedido += item.cantidad * item.precio_unitario;
            pedidoDetalles.push([
                item.id_producto,
                item.nombre_producto,
                item.cantidad,
                item.precio_unitario
            ]);
        }

        // 3. Crear el nuevo pedido
        const [pedidoResult] = await conn.query(
            'INSERT INTO tbl_pedidos (id_usuario, total, estado) VALUES (?, ?, ?)',
            [id_usuario, totalPedido, 'pendiente']
        );
        const id_pedido = pedidoResult.insertId;

        // 4. Insertar detalles del pedido y actualizar stock
        for (const detalle of pedidoDetalles) {
            const [id_producto, nombre_producto, cantidad, precio_unitario] = detalle;
            await conn.query(
                'INSERT INTO tbl_pedido_detalles (id_pedido, id_producto, nombre_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?, ?)',
                [id_pedido, id_producto, nombre_producto, cantidad, precio_unitario]
            );
            // Actualizar stock del producto
            await conn.query(
                'UPDATE tbl_productos SET stock = stock - ? WHERE id_producto = ?',
                [cantidad, id_producto]
            );
        }

        // 5. Vaciar el carrito del usuario
        await conn.query('DELETE FROM tbl_carrito_items WHERE id_usuario = ?', [id_usuario]);

        // Confirmar la transacción
        await conn.commit();

        success(req, res, { id_pedido, total: totalPedido }, 'Compra finalizada exitosamente. Pedido creado.');

    } catch (err) {
        if (conn) {
            await conn.rollback(); // Deshacer la transacción en caso de error
        }
        console.error('Error al finalizar la compra:', err);
        error(req, res, 'Error al finalizar la compra', 500, err);
    } finally {
        if (conn) {
            conn.release(); // Liberar la conexión de vuelta al pool
        }
    }
};