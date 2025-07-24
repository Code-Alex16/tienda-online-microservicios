// src/responses/response.js

/**
 * Envía una respuesta de éxito con un formato estandarizado.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {any} data - Los datos a enviar en la respuesta.
 * @param {string} message - Mensaje de éxito opcional.
 * @param {number} statusCode - Código de estado HTTP (por defecto 200).
 */
export const success = (req, res, data, message = 'Operación exitosa', statusCode = 200) => {
    res.status(statusCode).send({
        error: false,
        status: statusCode,
        message: message,
        body: data // Usamos 'body' para los datos principales, como en tus ejemplos anteriores
    });
};

/**
 * Envía una respuesta de error con un formato estandarizado.
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {string} message - Mensaje de error.
 * @param {number} statusCode - Código de estado HTTP (por defecto 500).
 * @param {Error} error - Objeto de error interno (opcional, para logging).
 */
export const error = (req, res, message = 'Error interno del servidor', statusCode = 500, err = null) => {
    if (err) {
        console.error('[Error]:', err); // Log el error real en el servidor para depuración
    }
    res.status(statusCode).send({
        error: true,
        status: statusCode,
        message: message,
        body: null // Opcional: podrías incluir un objeto de error más detallado si es necesario
    });
};