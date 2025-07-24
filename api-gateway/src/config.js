import dotenv from 'dotenv';

dotenv.config();

export const config = {
    app: {
        port: process.env.PORT || 3000,
        corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200'
    },
    services: {
        products: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3001',
        carts: process.env.CARTS_SERVICE_URL || 'http://localhost:3002',
        users: process.env.USERS_SERVICE_URL || 'http://localhost:3003'
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'mi_secreto_super_seguro_default'
    }
};