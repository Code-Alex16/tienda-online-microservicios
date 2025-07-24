
# 🛒 Proyecto Tienda Online

Este es un proyecto de una aplicación de tienda online construida con una arquitectura de **microservicios**, utilizando **Node.js** para el backend (microservicios y API Gateway) y **Angular** para el frontend.

---

## 📌 Descripción del Proyecto

Este proyecto simula una tienda online básica donde los usuarios pueden:

- Registrarse e iniciar sesión.
- Explorar una lista de productos.
- Añadir productos a un carrito de compras.
- Actualizar o eliminar ítems del carrito.
- Finalizar una compra para crear un pedido.
- Ver su historial de pedidos y los detalles de cada uno.

La aplicación está diseñada con una arquitectura **desacoplada** para demostrar el uso de microservicios.

---

## 🧰 Tecnologías Utilizadas

### Frontend

- **Angular 20+**: Framework para la interfaz de usuario.
- **TypeScript**: Lenguaje de programación.
- **HTML5 / CSS3**: Estructura y estilos.

### Backend (Microservicios y API Gateway)

- **Node.js**: Entorno de ejecución para el servidor.
- **Express.js**: Framework web para construir APIs REST.
- **MySQL**: Base de datos relacional.
- **express-http-proxy**: Para el API Gateway.
- **jsonwebtoken / bcryptjs**: Para autenticación JWT.
- **cors**: Para manejo de CORS.

---

## 🧱 Estructura del Proyecto

El proyecto se divide en las siguientes partes principales:

- `frontend-app/`: La aplicación Angular (frontend).
- `api-gateway/`: El API Gateway que enruta las peticiones a los microservicios y maneja la autenticación.
- `users-service/`: Microservicio para gestión de usuarios (registro, login, pedidos).
- `products-service/`: Microservicio para gestión de productos (catálogo).
- `carts-service/`: Microservicio para gestión del carrito de compras.

---

## ⚙️ Configuración del Entorno

### 📝 Prerrequisitos

Asegúrate de tener instalado lo siguiente:

- Node.js (versión 18 o superior recomendada)
- npm (viene con Node.js)
- MySQL Server (y herramienta como HeidiSQL o MySQL Workbench)
- Angular CLI:  
  ```bash
  npm install -g @angular/cli
  ```

---

### 1. 📦 Base de Datos (MySQL)

**Crear la base de datos:**

```sql
CREATE DATABASE db_tienda_online;
USE db_tienda_online;
```

**Crear las tablas**:  
Ejecuta las sentencias SQL para crear las tablas `tbl_usuarios`, `tbl_productos`, `tbl_carrito_items`, `tbl_pedidos`, `tbl_pedido_detalles` y sus claves foráneas. (Usa el script que ya tienes).

**Insertar productos de prueba**:  
Ejecuta los `INSERT INTO tbl_productos` para tener datos iniciales.

---

### 2. 🔧 Configuración de los Microservicios

Para cada microservicio (`users-service`, `products-service`, `carts-service`):

#### Navegar a la carpeta:

```bash
cd users-service
# o
cd products-service
# o
cd carts-service
```

#### Instalar dependencias:

```bash
npm install
```

#### Configurar variables de entorno (`.env`):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password_mysql
DB_DATABASE=db_tienda_online
DB_PORT=3306

JWT_SECRET=tu_secreto_super_seguro_y_largo_para_jwt
JWT_EXPIRES_IN=1h
```

> 🔐 **Importante**: `JWT_SECRET` debe ser idéntico en todos los servicios que lo usen (`users-service` y `api-gateway`).

---

### 3. 🌐 Configuración del API Gateway

#### Navegar a la carpeta:

```bash
cd api-gateway
```

#### Instalar dependencias:

```bash
npm install
```

#### Configurar archivo `.env`:

```env
PORT=3000
CORS_ORIGIN=http://localhost:4200

USERS_SERVICE_URL=http://localhost:3003
PRODUCTS_SERVICE_URL=http://localhost:3001
CARTS_SERVICE_URL=http://localhost:3002

JWT_SECRET=tu_secreto_super_seguro_y_largo_para_jwt
```

> 📌 Asegúrate de que `JWT_SECRET` coincida con el usado en `users-service`.

---

### 4. 🖥️ Configuración del Frontend (Angular)

#### Navegar a la carpeta:

```bash
cd frontend-app
```

#### Instalar dependencias:

```bash
npm install
```

#### Configurar el entorno de la API:  
Edita `frontend-app/src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api' // URL de tu API Gateway
};
```

---

## ▶️ Cómo Ejecutar la Aplicación

1. Inicia **MySQL Server**.

2. Inicia cada microservicio (en terminales separadas):

```bash
# En users-service/
npm start

# En products-service/
npm start

# En carts-service/
npm start
```

> ⚠️ Asegúrate que cada uno escuche en su puerto: 3003, 3001, 3002.

3. Inicia el API Gateway:

```bash
# En api-gateway/
npm start
# Escuchará en el puerto 3000
```

4. Inicia el frontend (Angular):

```bash
# En frontend-app/
ng serve --open
```

> Esto abrirá la app en tu navegador, generalmente en `http://localhost:4200`.

---

## 📝 Notas Adicionales

- **Depuración**: Usa `console.log` en los microservicios y API Gateway, y la consola del navegador (`F12`) en el frontend.
- **Errores 401/403**: Verifica `JWT_SECRET` y el flujo del token.
- **Errores CORS**: Asegúrate de incluir cabeceras necesarias como `Authorization` y `x-user-id`.
- **`id_usuario` en cabeceras**: Las rutas protegidas esperan la cabecera `x-user-id`.
- **Modo de Prueba**: Puedes usar un `id_usuario` fijo en los controladores durante desarrollo, pero **elimina esto para producción**.
