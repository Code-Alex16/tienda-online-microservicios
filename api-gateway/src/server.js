import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy'; // express-http-proxy es el que estás usando
import { config } from './config.js';
import { auth } from './middlewares/auth.js'; // Importa el middleware de autenticación
import { error } from './responses/response.js'; // Para manejo de errores

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración CORS
app.use(cors({
    origin: config.app.corsOrigin, // Solo permite el origen de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // ¡IMPORTANTE! Asegúrate de permitir 'x-user-id' en las cabeceras permitidas
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));


// Rutas de Usuarios (Login/Register no requieren autenticación previa del Gateway)
app.use('/api/usuarios', proxy(config.services.users, {
    proxyReqPathResolver: (req) => {
        return `/api/usuarios${req.url}`;
    }
}));

// Rutas de Productos (públicas para ver el catálogo)
app.use('/api/productos', proxy(config.services.products, {
    proxyReqPathResolver: (req) => {
        return `/api/productos${req.url}`;
    }
}));

// Todas las rutas siguientes requerirán autenticación JWT
app.use('/api/productos-secure', auth, proxy(config.services.products, {
    proxyReqPathResolver: (req) => {
        return `/api/productos${req.url}`;
    },
    // **** CAMBIO CLAVE AQUÍ: Usar onProxyReq para pasar el id_usuario ****
    onProxyReq: (proxyReq, req, res) => {
        if (req.user && req.user.id_usuario) {
            proxyReq.setHeader('x-user-id', req.user.id_usuario);
            console.log('API Gateway: Productos-Secure - Pasando x-user-id:', req.user.id_usuario);
        } else {
            console.warn('API Gateway: Productos-Secure - req.user.id_usuario no disponible para proxy.');
        }
    }
}));


// Rutas de Carrito (requieren autenticación)
app.use('/api/carrito', auth, proxy(config.services.carts, {
    proxyReqPathResolver: (req) => {
        return `/api/carrito${req.url}`;
    },
    // **** CAMBIO CLAVE AQUÍ: Usar onProxyReq para pasar el id_usuario ****
    onProxyReq: (proxyReq, req, res) => {
        if (req.user && req.user.id_usuario) {
            proxyReq.setHeader('x-user-id', req.user.id_usuario);
            console.log('API Gateway: Carrito - Pasando x-user-id:', req.user.id_usuario);
        } else {
            console.warn('API Gateway: Carrito - req.user.id_usuario no disponible para proxy.');
        }
    }
}));

// Rutas para historial de pedidos (usuarios-service, requieren autenticación)
app.use('/api/usuarios-secure', auth, proxy(config.services.users, {
    proxyReqPathResolver: (req) => {
        return `/api/usuarios${req.url}`; // Asumo que las rutas de usuarios-service empiezan con /api/usuarios
    },
    // **** CAMBIO CLAVE AQUÍ: Usar onProxyReq para pasar el id_usuario ****
    onProxyReq: (proxyReq, req, res) => {
        if (req.user && req.user.id_usuario) {
            proxyReq.setHeader('x-user-id', req.user.id_usuario);
            console.log('API Gateway: Usuarios-Secure - Pasando x-user-id:', req.user.id_usuario);
        } else {
            console.warn('API Gateway: Usuarios-Secure - req.user.id_usuario no disponible para proxy.');
        }
    }
}));


// Manejo de errores 404
app.use((req, res) => {
    error(req, res, 'Ruta no encontrada en el API Gateway', 404);
});

// Iniciar el servidor
app.listen(config.app.port, () => {
    console.log(`🚀 API Gateway escuchando en http://localhost:${config.app.port}`);
    console.log(`➡️  Productos Service en ${config.services.products}`);
    console.log(`➡️  Carrito Service en ${config.services.carts}`);
    console.log(`➡️  Usuarios Service en ${config.services.users}`);
});