document.addEventListener("DOMContentLoaded", function () {
    obtenerServicios();
});

// 🔹 Obtener la lista de servicios
function obtenerServicios() {
    fetch("http://localhost:3000/servicios")
        .then(response => response.json())
        .then(data => {
            console.log("✅ Servicios obtenidos:", data);
            mostrarServicios(data);
        })
        .catch(error => console.error("❌ Error al obtener servicios:", error));
}

// 🔹 Mostrar los servicios en sus respectivas tablas
function mostrarServicios(servicios) {
    let tablaEsteticos = document.getElementById("tabla-esteticos");
    let tablaVeterinarios = document.getElementById("tabla-veterinarios");

    // 🔹 Limpiar tablas antes de agregar datos
    tablaEsteticos.innerHTML = "";
    tablaVeterinarios.innerHTML = "";

    servicios.forEach(servicio => {
        let fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${servicio.tipo}</td>
            <td>${servicio.precio}</td>
            <td><button class="btn-borrar" onclick="eliminarServicio(${servicio.id})">Borrar</button></td>
        `;

        // 🔹 Clasificar según tipo de servicio
        if (servicio.servicio.toLowerCase() === "estético") {
            tablaEsteticos.appendChild(fila);
        } else if (servicio.servicio.toLowerCase() === "veterinario") {
            tablaVeterinarios.appendChild(fila);
        }
    });
}

// 🔹 Eliminar un servicio por ID
function eliminarServicio(id) {
    fetch(`http://localhost:3000/servicios/${id}`, { method: "DELETE" })
        .then(response => response.json())
        .then(data => {
            console.log("✅ Servicio eliminado:", data);
            obtenerServicios(); // ✅ ACTUALIZAR LA LISTA DESPUÉS DE ELIMINAR
        })
        .catch(error => console.error("❌ Error al eliminar servicio:", error));
}

// 🔹 Capturar el evento de envío del formulario
document.getElementById("form-servicio").addEventListener("submit", function (e) {
    e.preventDefault();

    let servicio = document.getElementById("servicio").value.trim().toLowerCase();
    let tipo = document.getElementById("tipo").value.trim();
    let precio = document.getElementById("precio").value.trim();

    // 🔹 Validar campos vacíos y servicio válido
    if (servicio === "" || tipo === "" || precio === "") {
        alert("⚠️ Todos los campos son obligatorios.");
        return;
    }
    if (servicio !== "estético" && servicio !== "veterinario") {
        alert("⚠️ El servicio debe ser 'estético' o 'veterinario'.");
        return;
    }

    let nuevoServicio = { servicio, tipo, precio };

    // 🔹 Enviar el nuevo servicio al servidor
    fetch("http://localhost:3000/servicios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoServicio)
    })
    .then(response => response.json())
    .then(data => {
        console.log("✅ Servicio registrado:", data);
        obtenerServicios(); // ✅ ACTUALIZAR LA LISTA DESPUÉS DE REGISTRAR
        document.getElementById("form-servicio").reset();
    })
    .catch(error => console.error("❌ Error al registrar servicio:", error));
});






