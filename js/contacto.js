// Gestión de contacto y comentarios
document.addEventListener("DOMContentLoaded", () => {
  cargarComentarios()

  // Manejar envío de formulario de contacto
  document.getElementById("contactForm").addEventListener("submit", async (e) => {
    e.preventDefault()
    await enviarComentario()
  })
})

// Cargar comentarios de contacto
async function cargarComentarios() {
  try {
    const response = await fetch("api/get_comentarios_contacto.php")
    const data = await response.json()

    if (data.success) {
      mostrarComentarios(data.comentarios)
    } else {
      document.getElementById("comentariosContainer").innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="fas fa-comments"></i> Aún no hay comentarios
                </div>
            `
    }
  } catch (error) {
    console.error("Error al cargar comentarios:", error)
  }
}

// Mostrar comentarios
function mostrarComentarios(comentarios) {
  const container = document.getElementById("comentariosContainer")

  if (comentarios.length === 0) {
    container.innerHTML = `
            <div class="alert alert-info text-center">
                <i class="fas fa-comments"></i> Aún no hay comentarios
            </div>
        `
    return
  }

  let html = ""
  comentarios.forEach((comentario) => {
    html += `
            <div class="comentario-card">
                <div class="comentario-header">
                    <div>
                        <div class="comentario-usuario">${comentario.nombre}</div>
                        <div class="comentario-fecha">${new Date(comentario.fecha).toLocaleString("es")}</div>
                    </div>
                </div>
                <div><strong>Asunto:</strong> ${comentario.asunto}</div>
                <div class="comentario-texto">${comentario.mensaje}</div>
            </div>
        `
  })

  container.innerHTML = html
}

// Enviar comentario
async function enviarComentario() {
  const nombre = document.getElementById("contactName").value
  const email = document.getElementById("contactEmail").value
  const asunto = document.getElementById("contactAsunto").value
  const mensaje = document.getElementById("contactMensaje").value

  if (!nombre || !email || !asunto || !mensaje) {
    alert("Por favor completa todos los campos")
    return
  }

  try {
    const response = await fetch("api/add_comentario_contacto.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: nombre,
        email: email,
        asunto: asunto,
        mensaje: mensaje,
      }),
    })

    const data = await response.json()

    if (data.success) {
      alert("¡Mensaje enviado exitosamente!")
      document.getElementById("contactForm").reset()
      cargarComentarios() // Recargar comentarios
    } else {
      alert(data.message || "Error al enviar el mensaje")
    }
  } catch (error) {
    console.error("Error:", error)
    alert("Error al enviar el mensaje")
  }
}
