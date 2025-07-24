import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { error } from '../responses/response.js';

export const auth = (req, res, next) => {
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return error(req, res, 'Acceso denegado. No se proporcionó token.', 401);
    }

    const token = authHeader.split(' ')[1]; // El formato es "Bearer TOKEN"

    if (!token) {
        return error(req, res, 'Acceso denegado. Formato de token inválido.', 401);
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, config.jwt.secret);
        // Adjuntar el usuario decodificado al objeto de solicitud
        req.user = decoded; // Contendrá { id_usuario, username }
        next(); // Continuar con la siguiente función en la cadena de middleware
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return error(req, res, 'Token expirado', 401, err);
        }
        error(req, res, 'Token inválido', 401, err); // Unauthorized
    }
};