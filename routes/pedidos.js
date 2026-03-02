const express = require('express');
const router = express.Router();

const pedidos = [
    { 
        id: 1, 
        usuarioId: 1, 
        productos: ['Laptop', 'Mouse'], 
        total: 2500, 
        estado: 'pendiente', 
        fecha: '2025-02-01' 
    },
    { 
        id: 2, 
        usuarioId: 2, 
        productos: ['Teclado'], 
        total: 300, 
        estado: 'enviado', 
        fecha: '2025-02-10' 
    }
];


// GET: todos los pedidos
router.get('/pedidos', (req, res) => {

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

    const { usuarioId, estado, fecha } = req.query;

    let filtradosPedidos = pedidos.filter(p => {
        return (
            (!usuarioId || p.usuarioId === parseInt(usuarioId)) &&
            (!estado || p.estado.toLowerCase().includes(estado.toLowerCase())) &&
            (!fecha || p.fecha === fecha)
        );
    });

    res.json({ success: true, Headers: { apiKey }, data: filtradosPedidos });
});


// GET - Obtener pedido por ID
router.get('/pedidos/:id', (req, res) => {

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

    const pedido = pedidos.find(p => p.id === parseInt(req.params.id));

    if (!pedido) {
        return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }

    res.json({ success: true, Headers: { apiKey }, data: pedido });
});


// POST - Crear nuevo pedido
router.post('/pedidos', (req, res) => {

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

    const { usuarioId, productos, total, estado, fecha } = req.body;

    if (!usuarioId || !productos || !total || !estado || !fecha) {
        return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }

    const newPedido = {
        id: pedidos.length + 1,
        usuarioId,
        productos,
        total,
        estado,
        fecha
    };

    pedidos.push(newPedido);

    res.status(201).json({ success: true, Headers: { apiKey, roleHeader }, data: newPedido });
});


// PUT - Actualizar pedido por ID
router.put('/pedidos/:id', (req, res) => {

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

    const id = parseInt(req.params.id);
    const { usuarioId, productos, total, estado, fecha } = req.body;

    const pedido = pedidos.find(p => p.id === id);

    if (!pedido) {
        return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }

    pedido.usuarioId = usuarioId;
    pedido.productos = productos;
    pedido.total = total;
    pedido.estado = estado;
    pedido.fecha = fecha;

    res.json({ success: true, Headers: { apiKey, roleHeader }, data: pedido });
});


// DELETE - Eliminar pedido por ID
router.delete('/pedidos/:id', (req, res) => {

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

    const index = pedidos.findIndex(p => p.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
    }

    pedidos.splice(index, 1);

    res.status(201).json({ success: true, Headers: { apiKey, roleHeader }, data: "El pedido se ha eliminado" });
});

module.exports = router;