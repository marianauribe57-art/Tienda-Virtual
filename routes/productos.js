const express = require('express');
const router = express.Router();

const productos = [
    { id: 1, nombre: 'Pc', precio: 2000, descripcion: 'Computadora de escritorio', stock: 10, categoria: 'Computacion' },
    { id: 2, nombre: 'Laptop', precio: 3000, descripcion: 'Computadora portátil', stock: 5, categoria: 'Electrónica' },
    { id: 3, nombre: 'Mouse', precio: 50, descripcion: 'Mouse inalámbrico', stock: 20, categoria: 'Electrónica' }
];


// GET - Obtener productos
router.get('/productos', (req, res) => {

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

    const { nombre, precio, descripcion, stock, categoria } = req.query;

    let filteredProducts = productos.filter(p => {
        return (
            (!nombre || p.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
            (!precio || p.precio === parseFloat(precio)) &&
            (!descripcion || p.descripcion.toLowerCase().includes(descripcion.toLowerCase())) &&
            (!stock || p.stock === parseInt(stock)) &&
            (!categoria || p.categoria.toLowerCase().includes(categoria.toLowerCase()))
        );
    });

    res.json({ success: true, Headers: { apiKey }, data: filteredProducts });
});


// GET - Obtener un producto por ID
router.get('/productos/:id', (req, res) => {

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

    const product = productos.find(u => u.id === parseInt(req.params.id));

    if (!product) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    res.json({ success: true, Headers: { apiKey }, data: product });
});


// POST - Crear nuevo producto
router.post('/productos', (req, res) => {

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

    const { nombre, precio, descripcion, stock, categoria } = req.body;

    if (!nombre || !precio || !descripcion || !stock || !categoria) {
        return res.status(400).json({
            success: false,
            message: 'Faltan datos requeridos'
        });
    }

    const newProduct = {
        id: productos.length + 1,
        nombre,
        precio,
        descripcion,
        stock,
        categoria
    };

    productos.push(newProduct);

    res.status(201).json({ success: true, Headers: { apiKey, roleHeader }, data: newProduct });
});

// PUT: Actualizar usuario por ID
router.put('/productos/:id', (req, res) => {

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
    const { nombre, precio, descripcion, stock, categoria } = req.body;

    const producto = productos.find(u => u.id === id);

    if (!producto) {
        return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    }

    producto.nombre = nombre;
    producto.precio = precio;
    producto.descripcion = descripcion;
    producto.stock = stock;
    producto.categoria = categoria;

    res.json({ success: true, Headers: { apiKey, roleHeader }, data: producto });
});


// DELETE - Eliminar un producto por ID
router.delete('/productos/:id', (req, res) => {

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

    const productIndex = productos.findIndex(u => u.id === parseInt(req.params.id));

    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Producto no encontrado'
        });
    }

    productos.splice(productIndex, 1);

    res.status(201).json({
        success: true,
        Headers: { apiKey, roleHeader },
        data: "El Producto se ha eliminado"
    });
});

module.exports = router;