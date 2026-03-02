const express = require('express');
const router = express.Router();

const categorias = [
    { id: 1, nombre: 'Computacion', descripcion: 'Productos tecnológicos', activa: true },
    { id: 2, nombre: 'Electrónica', descripcion: 'Dispositivos electrónicos', activa: true },
    { id: 3, nombre: 'Maquinaria', descripcion: 'Equipos industriales', activa: false }
];


// GET - Obtener categorias
router.get('/categorias', (req, res) => {

    const apiKey = req.headers['password'];

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key es requerida'
        });
    }

    if (apiKey !== '12345') {
        return res.status(403).json({
            success: false,
            message: 'Error la password no es correcta'
        });
    }

    const { nombre, descripcion, activa } = req.query;

    let filteredCategorias = categorias.filter(c => {
        return (
            (!nombre || c.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
            (!descripcion || c.descripcion.toLowerCase().includes(descripcion.toLowerCase())) &&
            (!activa || c.activa.toString() === activa.toString())
        );
    });

    res.json({ success: true, Headers: { apiKey }, data: filteredCategorias });
});


// GET - Obtener una categoria por ID
router.get('/categorias/:id', (req, res) => {

    const apiKey = req.headers['password'];

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key es requerida'
        });
    }

    if (apiKey !== '12345') {
        return res.status(403).json({
            success: false,
            message: 'Error la password no es correcta'
        });
    }

    const categoria = categorias.find(c => c.id === parseInt(req.params.id));

    if (!categoria) {
        return res.status(404).json({ success: false, message: 'Categoria no encontrada' });
    }

    res.json({ success: true, Headers: { apiKey }, data: categoria });
});


// POST - Crear una nueva categoria
router.post('/categorias', (req, res) => {

    const apiKey = req.headers['password'];
    const roleHeader = req.headers['x-user-role'];

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key es requerida'
        });
    }

    if (apiKey !== '6789') {
        return res.status(403).json({
            success: false,
            message: 'Error la password no es correcta'
        });
    }

    if (roleHeader !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para realizar esta acción'
        });
    }

    const { nombre, descripcion, activa } = req.body;

    if (!nombre || !descripcion || activa === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos requeridos'
        });
    }

    const newCategoria = {
        id: categorias.length + 1,
        nombre,
        descripcion,
        activa
    };

    categorias.push(newCategoria);

    res.status(201).json({ success: true, Headers: { apiKey, roleHeader }, data: newCategoria });
});


// PUT - Actualizar una categoria por ID
router.put('/categorias/:id', (req, res) => {

    const apiKey = req.headers['password'];
    const roleHeader = req.headers['x-user-role'];

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key es requerida'
        });
    }

    if (apiKey !== '6789') {
        return res.status(403).json({
            success: false,
            message: 'Error la password no es correcta'
        });
    }

    if (roleHeader !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para realizar esta acción'
        });
    }

    const categoria = categorias.find(c => c.id === parseInt(req.params.id));

    if (!categoria) {
        return res.status(404).json({ success: false, message: 'Categoria no encontrada' });
    }

    const { nombre, descripcion, activa } = req.body;

    categoria.nombre = nombre;
    categoria.descripcion = descripcion;
    categoria.activa = activa;

    res.json({ success: true, Headers: { apiKey, roleHeader }, data: categoria });
});


// DELETE - Eliminar una categoria por ID
router.delete('/categorias/:id', (req, res) => {

    const apiKey = req.headers['password'];
    const roleHeader = req.headers['x-user-role'];

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key es requerida'
        });
    }

    if (apiKey !== '6789') {
        return res.status(403).json({
            success: false,
            message: 'Error la password no es correcta'
        });
    }

    if (roleHeader !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para realizar esta acción'
        });
    }

    const categoriaIndex = categorias.findIndex(c => c.id === parseInt(req.params.id));

    if (categoriaIndex === -1) {
        return res.status(404).json({ success: false, message: 'Categoria no encontrada' });
    }

    categorias.splice(categoriaIndex, 1);

    res.status(201).json({
        success: true,
        Headers: { apiKey, roleHeader },
        data: "La Categoria se ha eliminado"
    });
});

module.exports = router;