// Gestión de pedidos del usuario
document.addEventListener("DOMContentLoaded", () => {
  // Verificar autenticación
  const user = JSON.parse(localStorage.getItem("foodlink_user") || "null")

  if (!user) {
    alert("Debes iniciar sesión para ver tus pedidos")
    window.location.href = "index.html"
    return
  }

  cargarPedidos()
})

// Cargar pedidos del usuario
async function cargarPedidos() {
  const user = JSON.parse(localStorage.getItem("foodlink_user"))

  try {
    const response = await fetch(`api/get_pedidos.php?usuario_id=${user.id_usuario}`)
    const data = await response.json()

    if (data.success) {
      mostrarPedidos(data.pedidos)
    } else {
      document.getElementById("pedidosContainer").innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info text-center">
                        <i class="fas fa-inbox"></i> No tienes pedidos todavía
                    </div>
                </div>
            `
    }
  } catch (error) {
    console.error("Error al cargar pedidos:", error)
    document.getElementById("pedidosContainer").innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">Error al cargar los pedidos</div>
            </div>
        `
  }
}

// Mostrar pedidos
function mostrarPedidos(pedidos) {
  const container = document.getElementById("pedidosContainer")

  if (pedidos.length === 0) {
    container.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="fas fa-inbox"></i> No tienes pedidos todavía
                </div>
            </div>
        `
    return
  }

  let html = ""
  pedidos.forEach((pedido) => {
    const statusClass = `status-${pedido.estado.toLowerCase()}`
    const statusText =
      {
        pendiente: "Pendiente",
        preparando: "Preparando",
        listo: "Listo",
        entregado: "Entregado",
      }[pedido.estado.toLowerCase()] || pedido.estado

    html += `
            <div class="col-12">
                <div class="pedido-card">
                    <div class="pedido-header">
                        <div>
                            <h5>Pedido #${pedido.id_pedido}</h5>
                            <small class="text-muted">${new Date(pedido.fecha_pedido).toLocaleString("es")}</small>
                        </div>
                        <span class="pedido-status ${statusClass}">${statusText}</span>
                    </div>
                    
                    <div class="pedido-comida">
                        <img src="${pedido.foto_comida || "/placeholder.svg?height=80&width=80"}" alt="${pedido.nombre_comida}">
                        <div>
                            <h6>${pedido.nombre_comida}</h6>
                            <p class="mb-1">Cantidad: ${pedido.cantidad}</p>
                            <p class="mb-0"><strong>Total: $${pedido.precio_total}</strong></p>
                        </div>
                    </div>

                    ${
                      pedido.estado.toLowerCase() === "entregado"
                        ? `
                        <div class="rating-section" id="rating-${pedido.id_pedido}">
                            ${
                              pedido.calificacion
                                ? `
                                <div class="alert alert-success">
                                    <strong>Tu calificación:</strong>
                                    <div class="stars" style="color: #FEA116;">
                                        ${"★".repeat(pedido.calificacion)}${"☆".repeat(5 - pedido.calificacion)}
                                    </div>
                                    ${pedido.comentario ? `<p class="mb-0 mt-2">"${pedido.comentario}"</p>` : ""}
                                </div>
                            `
                                : `
                                <h6>Calificar comida</h6>
                                <div class="stars" id="stars-${pedido.id_pedido}">
                                    ${[1, 2, 3, 4, 5].map((i) => `<span class="star" data-value="${i}">★</span>`).join("")}
                                </div>
                                <div class="comment-box">
                                    <textarea class="form-control" id="comment-${pedido.id_pedido}" placeholder="Escribe tu comentario (opcional)" rows="3"></textarea>
                                    <button class="btn custom-btn mt-2" onclick="enviarCalificacion(${pedido.id_pedido}, ${pedido.id_comida})">
                                        Enviar Calificación
                                    </button>
                                </div>
                            `
                            }
                        </div>
                    `
                        : ""
                    }
                </div>
            </div>
        `
  })

  container.innerHTML = html

  // Agregar eventos a las estrellas
  pedidos.forEach((pedido) => {
    if (pedido.estado.toLowerCase() === "entregado" && !pedido.calificacion) {
      initStarRating(pedido.id_pedido)
    }
  })
}

// Inicializar sistema de estrellas
function initStarRating(pedidoId) {
  const starsContainer = document.getElementById(`stars-${pedidoId}`)
  if (!starsContainer) return

  const stars = starsContainer.querySelectorAll(".star")
  let selectedRating = 0

  stars.forEach((star) => {
    star.addEventListener("mouseover", function () {
      const value = Number.parseInt(this.dataset.value)
      stars.forEach((s, i) => {
        s.classList.toggle("active", i < value)
      })
    })

    star.addEventListener("mouseout", () => {
      stars.forEach((s, i) => {
        s.classList.toggle("active", i < selectedRating)
      })
    })

    star.addEventListener("click", function () {
      selectedRating = Number.parseInt(this.dataset.value)
      stars.forEach((s, i) => {
        s.classList.toggle("active", i < selectedRating)
      })
    })
  })

  // Guardar rating seleccionado en el contenedor
  starsContainer.dataset.rating = 0
  stars.forEach((star) => {
    star.addEventListener("click", function () {
      starsContainer.dataset.rating = this.dataset.value
    })
  })
}

// Enviar calificación
async function enviarCalificacion(pedidoId, comidaId) {
  const starsContainer = document.getElementById(`stars-${pedidoId}`)
  const rating = Number.parseInt(starsContainer.dataset.rating)
  const comentario = document.getElementById(`comment-${pedidoId}`).value

  if (rating === 0) {
    alert("Por favor selecciona una calificación")
    return
  }

  try {
    const response = await fetch("api/calificar_comida.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pedido_id: pedidoId,
        comida_id: comidaId,
        calificacion: rating,
        comentario: comentario,
      }),
    })

    const data = await response.json()

    if (data.success) {
      alert("¡Gracias por tu calificación!")
      cargarPedidos() // Recargar pedidos
    } else {
      alert(data.message || "Error al enviar calificación")
    }
  } catch (error) {
    console.error("Error:", error)
    alert("Error al enviar la calificación")
  }
}
