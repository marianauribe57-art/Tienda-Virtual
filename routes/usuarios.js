const express = require('express');
const router = express.Router();

const usuarios = [
    { id: 1, nombre: 'Mateo', email: 'mateo@gmail.com', rol: 'Cloud', activo: true },
    { id: 2, nombre: 'Ana', email: 'ana@gmail.com', rol: 'Developer', activo: true },
    { id: 3, nombre: 'Luis', email: 'luis@gmail.com', rol: 'QA', activo: false }
];

// GET: todos los usuarios
router.get('/usuarios', (req, res) => {

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

    const { nombre, email, rol, activo } = req.query;

    let filtradosUsuarios = usuarios.filter(u => {
        return (
            (!nombre || u.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
            (!email || u.email.toLowerCase().includes(email.toLowerCase())) &&
            (!rol || u.rol.toLowerCase().includes(rol.toLowerCase())) &&
            (!activo || u.activo.toString() === activo.toString())
        );
    });

    res.json({ success: true, Headers: { apiKey }, data: filtradosUsuarios });
});


// GET - Obtener un usuario por ID
router.get('/usuarios/:id', (req, res) => {

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

    const usuario = usuarios.find(u => u.id === parseInt(req.params.id));

    if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    res.json({ success: true, Headers: { apiKey }, data: usuario });
});


// POST - Registrar un nuevo usuario
router.post('/usuarios', (req, res) => {

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

    const { nombre, email, rol, activo } = req.body;

    if (!nombre || !email || !rol || activo === undefined) {
        return res.status(400).json({ success: false, message: 'Faltan datos requeridos' });
    }

    const newUser = {
        id: usuarios.length + 1,
        nombre,
        email,
        rol,
        activo
    };

    usuarios.push(newUser);

    res.status(201).json({ success: true, Headers: { apiKey, roleHeader }, data: newUser });
});


// PUT: Actualizar usuario por ID
router.put('/usuarios/:id', (req, res) => {

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
    const { nombre, email, rol, activo } = req.body;

    const usuario = usuarios.find(u => u.id === id);

    if (!usuario) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    usuario.nombre = nombre;
    usuario.email = email;
    usuario.rol = rol;
    usuario.activo = activo;

    res.json({ success: true, Headers: { apiKey, roleHeader }, data: usuario });
});


// DELETE - Elimina un usuario por ID
router.delete('/usuarios/:id', (req, res) => {

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

    const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    usuarios.splice(index, 1);

    res.status(201).json({ success: true, Headers: { apiKey, roleHeader }, data: "El usuario se ha eliminado" });
});

module.exports = router;