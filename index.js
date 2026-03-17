require('dotenv').config();

const express = require('express');
const app = express();

app.use(express.json());

// Middleware de autenticación
app.use((req, res, next) => {
    const apiKey = req.headers['password'];

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key requerida'
        });
    }

    const isAdminRoute = req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE';
    const expectedPassword = isAdminRoute ? process.env.API_PASSWORD_ADMIN : process.env.API_PASSWORD;

    if (apiKey !== expectedPassword) {
        return res.status(403).json({
            success: false,
            message: 'Password incorrecta'
        });
    }

    next();
});

// Rutas
app.use('/api', require('./routes/productos'));
app.use('/api', require('./routes/usuarios'));
app.use('/api', require('./routes/categorias'));
app.use('/api', require('./routes/pedidos'));

// Render asigna el puerto automáticamente
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${server.address().port}`);
});