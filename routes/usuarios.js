const express = require('express');
const router = express.Router();
const db = require('../db');


// GET todos los usuarios
router.get('/usuarios', (req, res) => {

    const apiKey = req.headers['password'];

    if (!apiKey) {
        return res.status(401).json({ success:false, message:'API key es requerida' });
    }

    if (apiKey !== process.env.API_PASSWORD) {
        return res.status(403).json({ success:false, message:'Error la password no es correcta' });
    }

    const { nombre, email, rol, activo } = req.query;

    let query = "SELECT * FROM Usuarios WHERE 1=1";
    let params = [];

    if (nombre) {
        query += " AND nombre LIKE ?";
        params.push(`%${nombre}%`);
    }

    if (email) {
        query += " AND email LIKE ?";
        params.push(`%${email}%`);
    }

    if (rol) {
        query += " AND rol LIKE ?";
        params.push(`%${rol}%`);
    }

    if (activo !== undefined) {
        query += " AND activo = ?";
        params.push(activo);
    }

    db.all(query, params, (err, rows) => {

        if (err) {
            return res.status(500).json({ success:false, error:err.message });
        }

        res.json({ success:true, data:rows });

    });

});


// GET usuario por ID
router.get('/usuarios/:id', (req,res)=>{

    const apiKey = req.headers['password'];

    if(!apiKey){
        return res.status(401).json({success:false,message:'API key es requerida'})
    }

    if(apiKey !== process.env.API_PASSWORD){
        return res.status(403).json({success:false,message:'Error la password no es correcta'})
    }

    const id = parseInt(req.params.id)

    if(isNaN(id)){
        return res.status(400).json({success:false,message:'El ID debe ser número'})
    }

    db.get("SELECT * FROM Usuarios WHERE id = ?",[id],(err,row)=>{

        if(err){
            return res.status(500).json({error:err.message})
        }

        if(!row){
            return res.status(404).json({success:false,message:'Usuario no encontrado'})
        }

        res.json({success:true,data:row})

    })

})


// POST crear usuario
router.post('/usuarios',(req,res)=>{

    const apiKey = req.headers['password']
    const roleHeader = req.headers['x-user-role']

    if(!apiKey){
        return res.status(401).json({success:false,message:'API key es requerida'})
    }

    if(apiKey !== process.env.API_PASSWORD_ADMIN){
        return res.status(403).json({success:false,message:'Error la password no es correcta'})
    }

    if(roleHeader !== 'admin'){
        return res.status(403).json({success:false,message:'No tienes permisos'})
    }

    const {nombre,email,rol,activo} = req.body

    if(!nombre || !email || !rol || activo === undefined){
        return res.status(400).json({success:false,message:'Faltan campos'})
    }

    if(typeof activo !== 'boolean'){
        return res.status(400).json({success:false,message:'activo debe ser boolean'})
    }

    db.get("SELECT * FROM Usuarios WHERE email = ?",[email],(err,row)=>{

        if(row){
            return res.status(400).json({success:false,message:'Email ya existe'})
        }

        db.run(
            "INSERT INTO Usuarios (nombre,email,rol,activo) VALUES (?,?,?,?)",
            [nombre,email,rol,activo],
            function(err){

                if(err){
                    return res.status(500).json({error:err.message})
                }

                res.status(201).json({
                    success:true,
                    data:{
                        id:this.lastID,
                        nombre,
                        email,
                        rol,
                        activo
                    }
                })

            }
        )

    })

})


// PUT actualizar usuario
router.put('/usuarios/:id',(req,res)=>{

    const apiKey = req.headers['password']
    const roleHeader = req.headers['x-user-role']

    if(!apiKey){
        return res.status(401).json({success:false,message:'API key es requerida'})
    }

    if(apiKey !== process.env.API_PASSWORD_ADMIN){
        return res.status(403).json({success:false,message:'Error la password no es correcta'})
    }

    if(roleHeader !== 'admin'){
        return res.status(403).json({success:false,message:'No tienes permisos'})
    }

    const id = parseInt(req.params.id)

    if(isNaN(id)){
        return res.status(400).json({success:false,message:'ID inválido'})
    }

    const {nombre,email,rol,activo} = req.body

    if(!nombre || !email || !rol || activo === undefined){
        return res.status(400).json({success:false,message:'Faltan campos'})
    }

    db.run(
        "UPDATE Usuarios SET nombre=?, email=?, rol=?, activo=? WHERE id=?",
        [nombre,email,rol,activo,id],
        function(err){

            if(err){
                return res.status(500).json({error:err.message})
            }

            if(this.changes === 0){
                return res.status(404).json({success:false,message:'Usuario no encontrado'})
            }

            res.json({success:true,message:'Usuario actualizado'})

        }
    )

})


// DELETE usuario
router.delete('/usuarios/:id',(req,res)=>{

    const apiKey = req.headers['password']
    const roleHeader = req.headers['x-user-role']

    if(!apiKey){
        return res.status(401).json({success:false,message:'API key es requerida'})
    }

    if(apiKey !== process.env.API_PASSWORD_ADMIN){
        return res.status(403).json({success:false,message:'Error la password no es correcta'})
    }

    if(roleHeader !== 'admin'){
        return res.status(403).json({success:false,message:'No tienes permisos'})
    }

    const id = parseInt(req.params.id)

    if(isNaN(id)){
        return res.status(400).json({success:false,message:'ID inválido'})
    }

    db.run("DELETE FROM Usuarios WHERE id=?",[id],function(err){

        if(err){
            return res.status(500).json({error:err.message})
        }

        if(this.changes === 0){
            return res.status(404).json({success:false,message:'Usuario no encontrado'})
        }

        res.json({success:true,message:'Usuario eliminado'})

    })

})

module.exports = router;