
# 🛒 API REST - Sistema de Gestión Comercial

## 📖 Descripción

Este proyecto implementa una API REST estructurada en módulos independientes siguiendo principios básicos de arquitectura backend.

Se aplican:

- Validación de headers personalizados  
- Control de acceso por rol  
- Uso correcto de métodos HTTP  
- Validaciones dentro de cada endpoint  
- Códigos de estado HTTP apropiados  

La API simula un sistema de gestión comercial para una tienda online.

---

## 🚀 Tecnologías utilizadas

- Node.js  
- Express  
- JavaScript  
- Postman (para pruebas)

---

## ⚙️ Instalación y ejecución

1. Clonar el repositorio
2. Ejecutar:

```bash
npm install
npm run dev
```

Servidor:

http://localhost:3000

---

## 📁 Estructura del proyecto

```
routes/
│── productos.js
│── usuarios.js
│── categorias.js
│── pedidos.js

index.js
package.json
```

---

# 📌 DOCUMENTACIÓN DE ENDPOINTS

# 👤 API USUARIOS

## GET /usuarios
- Headers: password  
- Respuesta exitosa: 200 OK  
- Errores: 401, 403  

## GET /usuarios/:id
- Headers: password  
- Respuesta exitosa: 200 OK  
- Errores: 401, 403, 404  

## POST /usuarios
- Headers: password  
- Body: id, nombre, email, rol, activo  
- Respuesta exitosa: 201 Created  
- Errores: 400, 401, 403  

## PUT /usuarios/:id
- Headers: password  
- Body: Campos a actualizar  
- Respuesta exitosa: 200 OK  
- Errores: 400, 401, 403, 404  

## DELETE /usuarios/:id
- Headers: password  
- Respuesta exitosa: 200 OK  
- Errores: 401, 403, 404  

---

# 📦 API PRODUCTOS

## GET /productos
- Headers: password  
- Respuesta exitosa: 200 OK  
- Errores: 401, 403  

## GET /productos/:id
- Headers: password  
- Respuesta exitosa: 200 OK  
- Errores: 401, 403, 404  

## POST /productos
- Headers: password, X-user-role (admin)  
- Body: id, nombre, precio, categoria, stock  
- Respuesta exitosa: 201 Created  
- Errores: 400, 401, 403  

## PUT /productos/:id
- Headers: password, X-user-role (admin)  
- Body: Campos a actualizar  
- Respuesta exitosa: 200 OK  
- Errores: 400, 401, 403, 404  

## DELETE /productos/:id
- Headers: password, X-user-role (admin)  
- Respuesta exitosa: 200 OK  
- Errores: 401, 403, 404  

---

# 🗂 API CATEGORÍAS

## GET /categorias
- Headers: password  
- Respuesta exitosa: 200 OK  
- Errores: 401, 403  

## POST /categorias
- Headers: password, X-user-role (admin)  
- Body: id, nombre  
- Respuesta exitosa: 201 Created  
- Errores: 400, 401, 403  

## DELETE /categorias/:id
- Headers: password, X-user-role (admin)  
- Respuesta exitosa: 200 OK  
- Errores: 401, 403, 404  

---

# 🧾 API PEDIDOS

## GET /pedidos
- Headers: password  
- Respuesta exitosa: 200 OK  
- Errores: 401, 403  

## GET /pedidos/:id
- Headers: password  
- Respuesta exitosa: 200 OK  
- Errores: 401, 403, 404  

## POST /pedidos
- Headers: password  
- Body: id, usuarioId, productos, total, estado, fecha  
- Respuesta exitosa: 201 Created  
- Errores: 400, 401, 403  

## PUT /pedidos/:id
- Headers: password  
- Body: estado u otros campos a actualizar  
- Respuesta exitosa: 200 OK  
- Errores: 400, 401, 403, 404  

## DELETE /pedidos/:id
- Headers: password  
- Respuesta exitosa: 200 OK  
- Errores: 401, 403, 404  

---

# 📌 Códigos de respuesta utilizados

- 200 OK  
- 201 Created  
- 400 Bad Request  
- 401 Unauthorized  
- 403 Forbidden  
- 404 Not Found  
