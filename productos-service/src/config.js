import dotenv from 'dotenv';

// Carga las variables de entorno del archivo .env
dotenv.config();

export const config = {
    app: {
        port: process.env.PORT || 3001,
    },
    mysql: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'db_tienda_online'
    }
};