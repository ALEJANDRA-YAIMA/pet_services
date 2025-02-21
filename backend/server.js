require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pet_services_db'
});

db.connect(err => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err);
        return;
    }
    console.log('✅ Conectado a MySQL');
});

// Verificar conexión antes de ejecutar consultas
function checkDBConnection(res) {
    if (!db || db.state === 'disconnected') {
        return res.status(500).json({ error: "La base de datos no está conectada." });
    }
}

// 🔹 Obtener lista de clientes
app.get("/clientes", (req, res) => {
    checkDBConnection(res);
    db.query("SELECT * FROM clientes", (err, results) => {
        if (err) {
            console.error("❌ Error al obtener clientes:", err);
            res.status(500).json({ error: "Error en el servidor" });
        } else {
            console.log(`✅ ${results.length} clientes obtenidos.`);
            res.json(results);
        }
    });
});

// 🔹 Registrar un nuevo cliente
app.post("/clientes", (req, res) => {
    checkDBConnection(res);  // Verificar la conexión a la base de datos

    const { nombre, telefono, tipo_mascota } = req.body;

    if (!nombre || !telefono || !tipo_mascota) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = "INSERT INTO clientes (nombre, telefono, tipo_mascota) VALUES (?, ?, ?)";  // ✅ CORREGIDO

    db.query(sql, [nombre, telefono, tipo_mascota], (err, result) => {
        if (err) {
            console.error("❌ Error al registrar cliente:", err);
            res.status(500).json({ error: "Error al insertar cliente" });
        } else {
            console.log("✅ Cliente registrado con éxito:", { id: result.insertId, nombre, telefono, tipo_mascota });
            res.json({ id: result.insertId, nombre, telefono, tipo_mascota });
        }
    });
});



// 🔹 Eliminar un cliente por ID
app.delete("/clientes/:id", (req, res) => {
    checkDBConnection(res);
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "ID de cliente requerido." });

    const sql = "DELETE FROM clientes WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error al eliminar cliente:", err);
            return res.status(500).json({ error: "Error al eliminar el cliente" });
        } 
        
        console.log(`✅ Cliente con ID ${id} eliminado correctamente.`);
        res.json({ mensaje: "Cliente eliminado correctamente" });
    });
});

// 🔹 Obtener lista de servicios
app.get("/servicios", (req, res) => {
    checkDBConnection(res);
    db.query("SELECT * FROM servicios", (err, results) => {
        if (err) {
            console.error("❌ Error al obtener servicios:", err);
            res.status(500).json({ error: "Error en el servidor" });
        } else {
            console.log(`✅ ${results.length} servicios obtenidos.`);
            res.json(results);
        }
    });
});

// 🔹 Registrar un nuevo servicio
app.post("/servicios", (req, res) => {
    checkDBConnection(res);
    const { servicio, tipo, precio } = req.body;

    if (!servicio || !tipo || !precio) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = "INSERT INTO servicios (servicio, tipo, precio) VALUES (?, ?, ?)";

    db.query(sql, [servicio, tipo, precio], (err, result) => {
        if (err) {
            console.error("❌ Error al registrar servicio:", err);
            res.status(500).json({ error: "Error al insertar servicio" });
        } else {
            console.log("✅ Servicio registrado:", { id: result.insertId, servicio, tipo, precio });
            res.json({ id: result.insertId, servicio, tipo, precio });
        }
    });
});

// 🔹 Eliminar un servicio por ID
app.delete("/servicios/:id", (req, res) => {
    checkDBConnection(res);
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "ID de servicio requerido." });

    const sql = "DELETE FROM servicios WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error al eliminar servicio:", err);
            return res.status(500).json({ error: "Error al eliminar el servicio" });
        }

        console.log(`✅ Servicio con ID ${id} eliminado correctamente.`);
        res.json({ mensaje: "Servicio eliminado correctamente" });
    });
});

// 🔹 Obtener lista de citas
app.get("/citas", (req, res) => {
    checkDBConnection(res);
    db.query("SELECT * FROM citas", (err, results) => {
        if (err) {
            console.error("❌ Error al obtener citas:", err);
            res.status(500).json({ error: "Error en el servidor" });
        } else {
            console.log(`✅ ${results.length} citas obtenidas.`);
            res.json(results);
        }
    });
});



// 🔹 Registrar una nueva cita con depuración

app.post("/citas", (req, res) => {
    checkDBConnection(res);
    console.log("📩 Datos recibidos para registrar cita:", req.body);

    const { cliente, servicio, tipo, fecha, hora } = req.body;

    if (!cliente || !servicio || !tipo || !fecha || !hora) {
        console.error("⚠️ Falta un campo obligatorio:", req.body);
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = "INSERT INTO citas (cliente, servicio, tipo, fecha, hora) VALUES (?, ?, ?, ?, ?)";

    db.query(sql, [cliente, servicio, tipo, fecha, hora], (err, result) => {
        if (err) {
            console.error("❌ Error al registrar cita:", err);
            res.status(500).json({ error: "Error en la base de datos" });
        } else {
            console.log("✅ Cita registrada:", { id: result.insertId, cliente, servicio, tipo, fecha, hora });
            res.json({ id: result.insertId, cliente, servicio, tipo, fecha, hora });
        }
    });
});

// 🔹 Eliminar una cita por ID
app.delete("/citas/:id", (req, res) => {
    checkDBConnection(res);
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "ID de cita requerido." });

    const sql = "DELETE FROM citas WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("❌ Error al eliminar cita:", err);
            return res.status(500).json({ error: "Error al eliminar la cita" });
        }

        console.log(`✅ Cita con ID ${id} eliminada correctamente.`);
        res.json({ mensaje: "Cita eliminada correctamente" });
    });
});

// 🔹 Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});




