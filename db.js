const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.message);
    } else {
        console.log('Base de datos SQLite conectada');
    }
});

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS Usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            rol TEXT NOT NULL,
            activo INTEGER NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS Categorias (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL UNIQUE,
            descripcion TEXT,
            activa INTEGER NOT NULL
        )
    `);

db.run(`
    CREATE TABLE IF NOT EXISTS Productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        precio REAL NOT NULL,
        descripcion TEXT NOT NULL,
        stock INTEGER NOT NULL,
        categoriaId INTEGER,
        FOREIGN KEY (categoriaId) REFERENCES Categorias(id)
    )
`);

    db.run(`
        CREATE TABLE IF NOT EXISTS Pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuarioId INTEGER,
            total REAL NOT NULL,
            estado TEXT NOT NULL,
            fecha TEXT NOT NULL,
            FOREIGN KEY (usuarioId) REFERENCES Usuarios(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS DetallePedido (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pedidoId INTEGER,
            productoId INTEGER,
            cantidad INTEGER NOT NULL,
            precio REAL NOT NULL,
            FOREIGN KEY (pedidoId) REFERENCES Pedidos(id),
            FOREIGN KEY (productoId) REFERENCES Productos(id)
        )
    `);

});

module.exports = db;