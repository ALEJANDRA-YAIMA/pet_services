// Esperar a que el DOM cargue completamente antes de ejecutar código
document.addEventListener("DOMContentLoaded", function () {
    obtenerClientes(); // Cargar clientes al iniciar
});

// Función para obtener la lista de clientes
function obtenerClientes() {
    fetch("http://localhost:3000/clientes")
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ Clientes obtenidos:", data);
            mostrarClientes(data);
        })
        .catch(error => console.error("❌ Error al obtener clientes:", error));
}

// Función para mostrar los clientes en la tabla
function mostrarClientes(clientes) {
    let tabla = document.getElementById("tabla-clientes").getElementsByTagName('tbody')[0];
    tabla.innerHTML = ""; // Limpiar la tabla antes de agregar los datos

    clientes.forEach(cliente => {
        let fila = tabla.insertRow();
        
        let celdaNombre = fila.insertCell(0);
        let celdaTelefono = fila.insertCell(1);
        let celdaMascota = fila.insertCell(2);
        let celdaAccion = fila.insertCell(3);

        celdaNombre.textContent = cliente.nombre;
        celdaTelefono.textContent = cliente.telefono;
        celdaMascota.textContent = cliente.tipo_mascota;

        // Crear el botón de eliminar
        let botonEliminar = document.createElement("button");
        botonEliminar.textContent = "❌ Eliminar";
        botonEliminar.className = "btn-eliminar";
        botonEliminar.onclick = function () {
            eliminarCliente(cliente.id);
        };

        celdaAccion.appendChild(botonEliminar);
    });
}

// Función para eliminar un cliente
function eliminarCliente(id) { 
    fetch(`http://localhost:3000/clientes/${id}`, { method: "DELETE" })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al eliminar el cliente");
        }
        return response.json();
    })
    .then(data => {
        console.log("✅ Cliente eliminado:", data);
        obtenerClientes(); // Actualizar la lista después de eliminar
    })
    .catch(error => console.error("❌ Error al eliminar cliente:", error));
}

// Capturar el evento de envío del formulario
document.getElementById("form-cliente").addEventListener("submit", function (e) {
    e.preventDefault(); // Evita que el formulario recargue la página

    // Obtener los valores de los campos
    let nombre = document.getElementById("nombre").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let tipoMascota = document.getElementById("tipo-mascota").value.trim();

    // Verificar si los campos están vacíos
    if (nombre === "" || telefono === "" || tipoMascota === "") {
        alert("⚠️ Por favor, completa todos los campos.");
        return;
    }

    let nuevoCliente = { nombre, telefono, tipo_mascota: tipoMascota };

    // Enviar los datos al servidor
    fetch("http://localhost:3000/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoCliente)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }
        return response.json();
    })
    .then(data => {
        console.log("✅ Cliente registrado:", data);
        obtenerClientes(); // Actualizar la lista después de registrar

        // Limpiar el formulario después de registrar
        document.getElementById("form-cliente").reset();
    })
    .catch(error => {
        console.error("❌ Error al registrar cliente:", error);
        alert("❌ Hubo un problema al registrar el cliente. Verifica la consola para más detalles.");
    });
});



