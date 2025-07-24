// src/routes/usuarios.routes.js
import { Router } from 'express';
import {
    registerUser,
    loginUser,
    getPedidosByUserId,
    getPedidoDetails
} from '../controllers/usuario.controller.js';

const router = Router();

// Rutas de autenticación (no requieren autenticación JWT en el gateway, ya que son para obtenerlo)
router.post('/register', registerUser); // POST /api/usuarios/register
router.post('/login', loginUser);       // POST /api/usuarios/login

// Rutas de pedidos (REQUIEREN AUTENTICACIÓN JWT en el API Gateway)
// El id_usuario ahora se pasa a través del header 'x-user-id' por el API Gateway
router.get('/pedidos', getPedidosByUserId);      // GET /api/usuarios-secure/pedidos
router.get('/pedidos/:id_pedido', getPedidoDetails); // GET /api/usuarios-secure/pedidos/:id_pedido

export default router;