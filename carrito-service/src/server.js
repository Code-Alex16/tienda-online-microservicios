
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { connectDb } from './db.js';
import carritoRouter from './routes/carrito.routes.js'; 

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/carrito', carritoRouter);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).send('Ruta no encontrada');
});

// Conectar a la base de datos e iniciar el servidor
const startServer = async () => {
    await connectDb();
    app.listen(config.app.port, () => {
        console.log(`🚀 Carrito-Service escuchando en http://localhost:${config.app.port}`);
    });
};

startServer();