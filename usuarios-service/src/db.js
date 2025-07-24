// src/db.js
import mysql from 'mysql2/promise';
import { config } from './config.js';

let conexion;

export const connectDb = async () => {
    try {
        if (!conexion) {
            conexion = mysql.createPool({
                host: config.mysql.host,
                user: config.mysql.user,
                password: config.mysql.password,
                database: config.mysql.database,
                waitForConnections: true,
                connectionLimit: 10,
                queueLimit: 0
            });
            console.log('📦 Usuarios-Service conectado a la base de datos MySQL.');
        }
        return conexion;
    } catch (error) {
        console.error('Error al conectar a la base de datos para Usuarios-Service:', error.message);
        process.exit(1);
    }
};

export const getDatabase = () => {
    if (!conexion) {
        throw new Error('La base de datos no está conectada. Llama a connectDb() primero.');
    }
    return conexion;
};