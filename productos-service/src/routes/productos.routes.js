import { Router } from 'express';
import {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto
} from '../controllers/productos.controllers.js';

const router = Router();

router.get('/', getProductos); // GET /api/productos
router.get('/:id', getProductoById); // GET /api/productos/:id
router.post('/', createProducto); // POST /api/productos
router.put('/:id', updateProducto); // PUT /api/productos/:id
router.delete('/:id', deleteProducto); // DELETE /api/productos/:id

export default router;