import dotenv from 'dotenv';

dotenv.config();

export const config = {
    app: {
        port: process.env.PORT || 3002,
    },
    mysql: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'db_tienda_online'
    }
};