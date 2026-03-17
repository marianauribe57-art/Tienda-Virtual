const express = require('express');
const router = express.Router();
const db = require('../db');


// GET - Obtener productos
router.get('/productos', (req, res) => {

    const apiKey = req.headers['password'];

    if (!apiKey) {
        return res.status(401).json({ success: false, message: 'API key es requerida' });
    }
    if (apiKey !== process.env.API_PASSWORD) {
        return res.status(403).json({ success: false, message: 'Error la password no es correcta' });
    }

    const { nombre, precio, descripcion, stock, categoriaId } = req.query;

    let query = "SELECT * FROM Productos WHERE 1=1";
    let params = [];

    if (nombre) {
        query += " AND nombre LIKE ?";
        params.push(`%${nombre}%`);
    }

    if (precio !== undefined) {
        query += " AND precio = ?";
        params.push(parseFloat(precio));
    }

    if (descripcion) {
        query += " AND descripcion LIKE ?";
        params.push(`%${descripcion}%`);
    }

    if (stock !== undefined) {
        query += " AND stock = ?";
        params.push(parseInt(stock));
    }

    if (categoriaId) {
        query += " AND categoria LIKE ?";
        params.push(`%${categoriaId}%`);
    }

    db.all(query, params, (err, rows) => {

        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }

        res.json({ success: true, Headers: { apiKey }, data: rows });
    });
});


// GET - Obtener un producto por ID
router.get('/productos/:id', (req, res) => {

    const apiKey = req.headers['password'];

    if (!apiKey) {
        return res.status(401).json({ success: false, message: 'API key es requerida' });
    }
    if (apiKey !== process.env.API_PASSWORD) {
        return res.status(403).json({ success: false, message: 'Error la password no es correcta' });
    }

    if (isNaN(req.params.id)) {
        return res.status(400).json({ success: false, message: 'El ID debe ser un número válido' });
    }

    const id = parseInt(req.params.id);

    db.get("SELECT * FROM Productos WHERE id = ?", [id], (err, row) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        res.json({ success: true, Headers: { apiKey }, data: row });
    });
});


// POST - Crear nuevo producto
router.post('/productos', (req, res) => {

    const apiKey = req.headers['password'];
    const roleHeader = req.headers['x-user-role'];

    if (!apiKey) {
        return res.status(401).json({ success: false, message: 'API key es requerida' });
    }
    if (apiKey !== process.env.API_PASSWORD_ADMIN) {
        return res.status(403).json({ success: false, message: 'Error la password no es correcta' });
    }
    if (roleHeader !== 'admin') {
        return res.status(403).json({ success: false, message: 'No tienes permisos para realizar esta acción' });
    }

    const { nombre, precio, descripcion, stock, categoriaId } = req.body;

    if (!nombre || precio === undefined || !descripcion || stock === undefined || !categoriaId) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos requeridos: nombre, precio, descripcion, stock, categoriaId'
        });
    }

    if (isNaN(precio) || precio <= 0) {
        return res.status(400).json({ success: false, message: 'El precio debe ser un número mayor a 0' });
    }

    if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ success: false, message: 'El stock debe ser un número mayor o igual a 0' });
    }

    db.run(
        "INSERT INTO Productos (nombre, precio, descripcion, stock, categoriaId) VALUES (?, ?, ?, ?, ?)",
        [nombre, precio, descripcion, stock, categoriaId],
        function (err) {

            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                success: true,
                Headers: { apiKey, roleHeader },
                data: {
                    id: this.lastID,
                    nombre,
                    precio,
                    descripcion,
                    stock,
                    categoriaId
                }
            });
        }
    );
});


// PUT - Actualizar producto por ID
router.put('/productos/:id', (req, res) => {

    const apiKey = req.headers['password'];
    const roleHeader = req.headers['x-user-role'];

    if (!apiKey) {
        return res.status(401).json({ success: false, message: 'API key es requerida' });
    }
    if (apiKey !== process.env.API_PASSWORD_ADMIN) {
        return res.status(403).json({ success: false, message: 'Error la password no es correcta' });
    }
    if (roleHeader !== 'admin') {
        return res.status(403).json({ success: false, message: 'No tienes permisos para realizar esta acción' });
    }

    if (isNaN(req.params.id)) {
        return res.status(400).json({ success: false, message: 'El ID debe ser un número válido' });
    }

    const id = parseInt(req.params.id);
    const { nombre, precio, descripcion, stock, categoriaId } = req.body;

    if (!nombre || precio === undefined || !descripcion || stock === undefined || !categoriaId) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos requeridos: nombre, precio, descripcion, stock, categoria'
        });
    }

    if (isNaN(precio) || precio <= 0) {
        return res.status(400).json({ success: false, message: 'El precio debe ser un número mayor a 0' });
    }

    if (isNaN(stock) || stock < 0) {
        return res.status(400).json({ success: false, message: 'El stock debe ser un número mayor o igual a 0' });
    }

    db.run(
        "UPDATE Productos SET nombre=?, precio=?, descripcion=?, stock=?, categoriaId=? WHERE id=?",
        [nombre, precio, descripcion, stock, categoriaId, id],
        function (err) {

            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({ success: false, message: 'Producto no encontrado' });
            }

            res.json({
                success: true,
                Headers: { apiKey, roleHeader },
                data: 'Producto actualizado'
            });
        }
    );
});


// DELETE - Eliminar un producto por ID
router.delete('/productos/:id', (req, res) => {

    const apiKey = req.headers['password'];
    const roleHeader = req.headers['x-user-role'];

    if (!apiKey) {
        return res.status(401).json({ success: false, message: 'API key es requerida' });
    }
    if (apiKey !== process.env.API_PASSWORD_ADMIN) {
        return res.status(403).json({ success: false, message: 'Error la password no es correcta' });
    }
    if (roleHeader !== 'admin') {
        return res.status(403).json({ success: false, message: 'No tienes permisos para realizar esta acción' });
    }

    if (isNaN(req.params.id)) {
        return res.status(400).json({ success: false, message: 'El ID debe ser un número válido' });
    }

    const id = parseInt(req.params.id);

    db.run("DELETE FROM Productos WHERE id = ?", [id], function (err) {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }

        res.status(200).json({
            success: true,
            Headers: { apiKey, roleHeader },
            data: 'El Producto se ha eliminado'
        });
    });
});

module.exports = router;