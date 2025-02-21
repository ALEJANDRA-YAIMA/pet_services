document.addEventListener("DOMContentLoaded", function () {
    let form = document.getElementById("form-cita");

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            console.log("📌 Formulario enviado");
            registrarCita();
        });
    } else {
        console.error("❌ Error: No se encontró el formulario con ID 'form-cita'");
    }

    obtenerCitas(); // Cargar citas al inicio
});


function registrarCita() {
    let cliente = document.getElementById("nombre-cliente").value.trim();
    let servicio = document.getElementById("servicio").value.trim();
    let tipo = document.getElementById("tipo-servicio").value.trim();
    let fecha = document.getElementById("fecha").value;
    let hora = document.getElementById("hora").value;

    console.log("📌 Datos capturados:", { cliente, servicio, tipo, fecha, hora });

    if (!cliente || !servicio || !tipo || !fecha || !hora) {
        alert("⚠️ Todos los campos son obligatorios.");
        return;
    }

    let nuevaCita = {
        cliente: cliente,  // ✅ Ahora coincide con el backend
        servicio: servicio,
        tipo: tipo,
        fecha: fecha,
        hora: hora
    };

    console.log("📌 Enviando cita al servidor:", JSON.stringify(nuevaCita)); // ✅ Verificar qué se está enviando

    fetch("http://localhost:3000/citas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCita)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("⚠️ Error en la respuesta del servidor.");
        }
        return response.json();
    })
    .then(data => {
        console.log("✅ Cita registrada en el servidor:", data);
        obtenerCitas();
        document.getElementById("form-cita").reset();
    })
    .catch(error => console.error("❌ Error al registrar cita:", error));
}



function obtenerCitas() {
    fetch("http://localhost:3000/citas")
        .then(response => response.json())
        .then(data => {
            console.log("📌 Citas obtenidas:", data);
            mostrarCitas(data);
        })
        .catch(error => console.error("❌ Error al obtener citas:", error));
}

function mostrarCitas(citas) {
    let tabla = document.getElementById("tbody-citas");

    if (!tabla) {
        console.error("❌ Error: No se encontró el tbody de 'tabla-citas'");
        return;
    }

    tabla.innerHTML = ""; // Limpia la tabla antes de agregar los datos

    citas.forEach(cita => {
        let fechaFormateada = cita.fecha.split("T")[0]; // ✅ Se elimina la hora innecesaria

        let fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${cita.cliente}</td>
            <td>${cita.servicio}</td>
            <td>${cita.tipo}</td>
            <td>${fechaFormateada}</td>
            <td>${cita.hora}</td>
            <td>
                <button class="btn-eliminar" onclick="eliminarCita(${cita.id})">Borrar</button>
            </td>
        `;

        tabla.appendChild(fila);
    });
}

function eliminarCita(id) {
    fetch(`http://localhost:3000/citas/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Error al eliminar la cita.");
        }
        return response.json();
    })
    .then(data => {
        console.log("✅ Cita eliminada:", data);
        obtenerCitas();
    })
    .catch(error => console.error("❌ Error al eliminar cita:", error));
}