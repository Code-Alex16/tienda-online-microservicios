
import { Router } from 'express';
import {
    getCarrito,
    addOrUpdateProductoInCarrito,
    updateCarritoItemCantidad,
    removeProductoFromCarrito,
    clearCarrito,
    checkoutCarrito
} from '../controllers/carrito.controller.js';

const router = Router();

// el id_usuario se leerá de la cabecera 'x-user-id'
router.get('/', getCarrito); // GET /api/carrito (el id_usuario viene en el header x-user-id)
router.post('/add', addOrUpdateProductoInCarrito); // POST /api/carrito/add
router.put('/update/:id_producto', updateCarritoItemCantidad); // PUT /api/carrito/update/:id_producto
router.delete('/remove/:id_producto', removeProductoFromCarrito); // DELETE /api/carrito/remove/:id_producto
router.delete('/clear', clearCarrito); // DELETE /api/carrito/clear
router.post('/checkout', checkoutCarrito); // POST /api/carrito/checkout

export default router;