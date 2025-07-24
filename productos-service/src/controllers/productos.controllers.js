import { getDatabase } from '../db.js';
import { success, error } from '../responses/response.js';

/**
 * Obtiene todos los productos del catálogo.
 */
export const getProductos = async (req, res) => {
    try {
        const connection = getDatabase(); // Obtiene el pool de conexiones
        const [rows] = await connection.query('SELECT * FROM tbl_productos');
        success(req, res, rows, 'Productos obtenidos exitosamente');
    } catch (err) {
        error(req, res, 'Error al obtener los productos', 500, err);
    }
};

/**
 * Obtiene un producto por su ID.
 */
export const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = getDatabase();
        const [rows] = await connection.query('SELECT * FROM tbl_productos WHERE id_producto = ?', [id]);

        if (rows.length === 0) {
            return error(req, res, 'Producto no encontrado', 404);
        }

        success(req, res, rows[0], 'Producto obtenido exitosamente');
    } catch (err) {
        error(req, res, 'Error al obtener el producto', 500, err);
    }
};

/**
 * Crea un nuevo producto. (Requiere lógica de autenticación/autorización en el API Gateway para producción)
 */
export const createProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, imagen_url } = req.body;

        if (!nombre || !precio || stock === undefined) {
            return error(req, res, 'Nombre, precio y stock son campos obligatorios', 400);
        }

        const connection = getDatabase();
        const [result] = await connection.query(
            'INSERT INTO tbl_productos (nombre, descripcion, precio, stock, imagen_url) VALUES (?, ?, ?, ?, ?)',
            [nombre, descripcion, precio, stock, imagen_url]
        );

        success(req, res, { id_producto: result.insertId, ...req.body }, 'Producto creado exitosamente', 201);
    } catch (err) {
        error(req, res, 'Error al crear el producto', 500, err);
    }
};

/**
 * Actualiza un producto existente. (Requiere lógica de autenticación/autorización en el API Gateway para producción)
 */
export const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, imagen_url } = req.body;

        if (!nombre || !precio || stock === undefined) {
            return error(req, res, 'Nombre, precio y stock son campos obligatorios', 400);
        }

        const connection = getDatabase();
        const [result] = await connection.query(
            'UPDATE tbl_productos SET nombre = ?, descripcion = ?, precio = ?, stock = ?, imagen_url = ? WHERE id_producto = ?',
            [nombre, descripcion, precio, stock, imagen_url, id]
        );

        if (result.affectedRows === 0) {
            return error(req, res, 'Producto no encontrado o no se realizaron cambios', 404);
        }

        success(req, res, { id_producto: parseInt(id), ...req.body }, 'Producto actualizado exitosamente');
    } catch (err) {
        error(req, res, 'Error al actualizar el producto', 500, err);
    }
};

/**
 * Elimina un producto. (Requiere lógica de autenticación/autorización en el API Gateway para producción)
 */
export const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = getDatabase();
        const [result] = await connection.query('DELETE FROM tbl_productos WHERE id_producto = ?', [id]);

        if (result.affectedRows === 0) {
            return error(req, res, 'Producto no encontrado', 404);
        }

        success(req, res, { id_producto: parseInt(id) }, 'Producto eliminado exitosamente', 200);
    } catch (err) {
        error(req, res, 'Error al eliminar el producto', 500, err);
    }
};