import dotenv from 'dotenv';

dotenv.config();

export const config = {
    app: {
        port: process.env.PORT || 3003,
    },
    mysql: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'db_tienda_online'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'mi_secreto_super_seguro_default',
        expiresIn: '1h' // Tiempo de expiración del token
    }
};