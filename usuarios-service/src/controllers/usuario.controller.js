import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDatabase } from '../db.js'; 
import { success, error } from '../responses/response.js';
import { config } from '../config.js'; 

/**
 * Registra un nuevo usuario.
 */
export const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return error(req, res, 'Nombre de usuario, email y contraseña son obligatorios', 400);
        }

        const connection = getDatabase();

        // Verificar si el usuario o email ya existen
        const [existingUser] = await connection.query(
            'SELECT id_usuario FROM tbl_usuarios WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            return error(req, res, 'El nombre de usuario o el email ya están en uso', 409); // Conflict
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insertar el nuevo usuario en la base de datos
        const [result] = await connection.query(
            'INSERT INTO tbl_usuarios (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, password_hash]
        );

        success(req, res, { id_usuario: result.insertId, username, email }, 'Usuario registrado exitosamente', 201);
    } catch (err) {
        error(req, res, 'Error al registrar el usuario', 500, err);
    }
};

/**
 * Inicia sesión de un usuario y retorna un token JWT.
 */
export const loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body; // 'identifier' puede ser username o email

        if (!identifier || !password) {
            return error(req, res, 'Identificador (username/email) y contraseña son obligatorios', 400);
        }

        const connection = getDatabase(); 

        // Buscar usuario por username o email
        const [users] = await connection.query(
            'SELECT id_usuario, username, email, password_hash FROM tbl_usuarios WHERE username = ? OR email = ?',
            [identifier, identifier]
        );

        if (users.length === 0) {
            return error(req, res, 'Credenciales inválidas', 401); // Unauthorized
        }

        const user = users[0];

        // Comparar la contraseña ingresada con el hash almacenado
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return error(req, res, 'Credenciales inválidas', 401);
        }

        // Generar JWT
        const token = jwt.sign(
            { id_usuario: user.id_usuario, username: user.username },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );

        success(req, res, { token, id_usuario: user.id_usuario, username: user.username, email: user.email }, 'Inicio de sesión exitoso');
    } catch (err) {
        error(req, res, 'Error al iniciar sesión', 500, err);
    }
};

/**
 * Obtiene el historial de pedidos de un usuario específico (o uno fijo para pruebas).
 */
export const getPedidosByUserId = async (req, res) => {
    try {
        const id_usuario = req.headers['x-user-id']; // Comentamos la obtención del ID del header
        // const id_usuario = 1; // **** TEMPORAL: Usar un ID de usuario fijo para pruebas ****
        // console.log('Pedidos Controller (Modo Prueba): Usando id_usuario fijo:', id_usuario);

        if (!id_usuario) { 
            return error(req, res, 'ID de usuario no proporcionado en el token', 401);
        }

        const connection = getDatabase();

        const [pedidos] = await connection.query(
            'SELECT id_pedido, fecha_pedido, total, estado FROM tbl_pedidos WHERE id_usuario = ? ORDER BY fecha_pedido DESC',
            [id_usuario]
        );

        if (pedidos.length === 0) {
            return success(req, res, [], 'No hay pedidos para este usuario', 200);
        }

        success(req, res, pedidos, 'Historial de pedidos obtenido exitosamente');
    } catch (err) {
        console.error('Error al obtener el historial de pedidos:', err);
        error(req, res, 'Error al obtener el historial de pedidos', 500, err);
    }
};

/**
 * Obtiene los detalles de un pedido específico de un usuario (o uno fijo para pruebas).
 */
export const getPedidoDetails = async (req, res) => {
    try {
        const id_usuario = req.headers['x-user-id']; // Comentamos la obtención del ID del header
        // const id_usuario = 1; // **** TEMPORAL: Usar un ID de usuario fijo para pruebas ****
        // console.log('Detalles Pedido Controller (Modo Prueba): Usando id_usuario fijo:', id_usuario);

        if (!id_usuario) { // Comentamos la validación
            return error(req, res, 'ID de usuario no proporcionado en el token', 401);
        }
        const { id_pedido } = req.params;
        const connection = getDatabase();

        // Primero, verificar que el pedido pertenece al usuario
        const [pedido] = await connection.query(
            'SELECT id_pedido, fecha_pedido, total, estado FROM tbl_pedidos WHERE id_pedido = ? AND id_usuario = ?',
            [id_pedido, id_usuario]
        );

        if (pedido.length === 0) {
            return error(req, res, 'Pedido no encontrado o no pertenece a este usuario', 404);
        }

        const [detalles] = await connection.query(
            'SELECT id_detalle_pedido, id_producto, nombre_producto, cantidad, precio_unitario FROM tbl_pedido_detalles WHERE id_pedido = ?',
            [id_pedido]
        );

        const fullPedido = {
            ...pedido[0],
            detalles: detalles
        };

        success(req, res, fullPedido, 'Detalles del pedido obtenidos exitosamente');
    } catch (err) {
        console.error('Error al obtener los detalles del pedido:', err);
        error(req, res, 'Error al obtener los detalles del pedido', 500, err);
    }
};