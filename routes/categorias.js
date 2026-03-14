const express = require('express');
const router = express.Router();
const db = require('../db');


// GET - Obtener categorias
router.get('/categorias', (req, res) => {

    const apiKey = req.headers['password'];

    if (!apiKey) {
        return res.status(401).json({ success: false, message: 'API key es requerida' });
    }
    if (apiKey !== process.env.API_PASSWORD) {
        return res.status(403).json({ success: false, message: 'Error la password no es correcta' });
    }

    const { nombre, descripcion, activa } = req.query;

    let query = "SELECT * FROM Categorias WHERE 1=1";
    let params = [];

    if (nombre) {
        query += " AND nombre LIKE ?";
        params.push(`%${nombre}%`);
    }

    if (descripcion) {
        query += " AND descripcion LIKE ?";
        params.push(`%${descripcion}%`);
    }

    if (activa !== undefined) {
        query += " AND activa = ?";
        params.push(activa);
    }

    db.all(query, params, (err, rows) => {

        if (err) {
            return res.status(500).json({ success:false, error: err.message });
        }

        res.json({ success: true, Headers: { apiKey }, data: rows });

    });
});


// GET - Obtener una categoria por ID
router.get('/categorias/:id', (req, res) => {

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

    db.get("SELECT * FROM Categorias WHERE id = ?", [id], (err, row) => {

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!row) {
            return res.status(404).json({ success: false, message: 'Categoria no encontrada' });
        }

        res.json({ success: true, Headers: { apiKey }, data: row });

    });
});


// POST - Crear una nueva categoria
router.post('/categorias', (req, res) => {

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

    const { nombre, descripcion, activa } = req.body;

    if (!nombre || !descripcion || activa === undefined) {
        return res.status(400).json({ success: false, message: 'Faltan datos requeridos: nombre, descripcion, activa' });
    }

    if (typeof activa !== 'boolean') {
        return res.status(400).json({ success: false, message: 'El campo activa debe ser true o false' });
    }

    db.get("SELECT * FROM Categorias WHERE LOWER(nombre) = LOWER(?)", [nombre], (err, row) => {

        if (row) {
            return res.status(400).json({ success:false, message:'Ya existe una categoría con ese nombre' });
        }

        db.run(
            "INSERT INTO Categorias (nombre, descripcion, activa) VALUES (?, ?, ?)",
            [nombre, descripcion, activa],
            function(err){

                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.status(201).json({
                    success: true,
                    Headers: { apiKey, roleHeader },
                    data: {
                        id: this.lastID,
                        nombre,
                        descripcion,
                        activa
                    }
                });

            }
        );

    });

});


// PUT - Actualizar una categoria por ID
router.put('/categorias/:id', (req, res) => {

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
    const { nombre, descripcion, activa } = req.body;

    if (!nombre || !descripcion || activa === undefined) {
        return res.status(400).json({ success: false, message: 'Faltan datos requeridos: nombre, descripcion, activa' });
    }

    if (typeof activa !== 'boolean') {
        return res.status(400).json({ success: false, message: 'El campo activa debe ser true o false' });
    }

    db.run(
        "UPDATE Categorias SET nombre=?, descripcion=?, activa=? WHERE id=?",
        [nombre, descripcion, activa, id],
        function(err){

            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({ success:false, message:'Categoria no encontrada' });
            }

            res.json({
                success:true,
                Headers:{ apiKey, roleHeader },
                data:'Categoria actualizada'
            });

        }
    );
});


// DELETE - Eliminar una categoria por ID
router.delete('/categorias/:id', (req, res) => {

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

    db.run("DELETE FROM Categorias WHERE id = ?", [id], function(err){

        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ success:false, message:'Categoria no encontrada' });
        }

        res.status(200).json({
            success:true,
            Headers:{ apiKey, roleHeader },
            data:'La Categoria se ha eliminado'
        });

    });
});

module.exports = router;