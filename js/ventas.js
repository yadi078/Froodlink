// ventas.js - Panel de ventas para cocineros
;(($) => {
  const API_URL = "http://localhost/foodlink/api"

  $(document).ready(() => {
    const user = window.FoodLinkAuth.getUser()

    if (!user || user.tipo !== "cocinero") {
      alert("Acceso denegado. Solo los cocineros pueden acceder a esta página.")
      window.location.href = "index.html"
      return
    }

    loadVentas()
  })

  function loadVentas() {
    const user = window.FoodLinkAuth.getUser()

    $.ajax({
      url: API_URL + "/get_ventas_cocinero.php",
      method: "GET",
      data: { id_cocinero: user.id_usuario },
      success: (response) => {
        if (response.success) {
          displayVentas(response.pedidos)
        } else {
          window.FoodLinkAuth.showAlert("danger", "Error al cargar las ventas")
        }
      },
      error: (xhr) => {
        const response = xhr.responseJSON || {}
        window.FoodLinkAuth.showAlert("danger", response.message || "Error al conectar con el servidor")
      },
    })
  }

  function displayVentas(pedidos) {
    const pendientesTable = $("#pendientesTable")
    const entregadosTable = $("#entregadosTable")

    pendientesTable.empty()
    entregadosTable.empty()

    const pendientes = pedidos.filter((p) => p.estado !== "entregado")
    const entregados = pedidos.filter((p) => p.estado === "entregado")

    // Display pendientes
    if (pendientes.length === 0) {
      pendientesTable.html('<tr><td colspan="8" class="text-center">No hay pedidos pendientes</td></tr>')
    } else {
      pendientes.forEach((pedido) => {
        const estadoBadge =
          pedido.estado === "pendiente"
            ? "badge-warning"
            : pedido.estado === "preparando"
              ? "badge-info"
              : "badge-success"

        const row = `
          <tr>
            <td>${pedido.id_pedido}</td>
            <td>${pedido.cliente_nombre}<br><small>${pedido.cliente_correo}</small></td>
            <td>${pedido.nombre_comida}</td>
            <td>${pedido.cantidad}</td>
            <td>$${Number.parseFloat(pedido.total).toFixed(2)}</td>
            <td>${new Date(pedido.fecha_pedido).toLocaleString("es-ES")}</td>
            <td><span class="badge ${estadoBadge}">${pedido.estado}</span></td>
            <td>
              <button class="btn btn-sm btn-success entregar-btn" data-id="${pedido.id_pedido}">
                <i class="fas fa-check"></i> Entregar
              </button>
            </td>
          </tr>
        `
        pendientesTable.append(row)
      })

      $(".entregar-btn").click(function () {
        const id = $(this).data("id")
        marcarEntregado(id)
      })
    }

    // Display entregados
    if (entregados.length === 0) {
      entregadosTable.html('<tr><td colspan="7" class="text-center">No hay pedidos entregados</td></tr>')
    } else {
      entregados.forEach((pedido) => {
        const row = `
          <tr>
            <td>${pedido.id_pedido}</td>
            <td>${pedido.cliente_nombre}<br><small>${pedido.cliente_correo}</small></td>
            <td>${pedido.nombre_comida}</td>
            <td>${pedido.cantidad}</td>
            <td>$${Number.parseFloat(pedido.total).toFixed(2)}</td>
            <td>${new Date(pedido.fecha_pedido).toLocaleString("es-ES")}</td>
            <td>${pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toLocaleString("es-ES") : "-"}</td>
          </tr>
        `
        entregadosTable.append(row)
      })
    }
  }

  function marcarEntregado(pedidoId) {
    if (!confirm("¿Marcar este pedido como entregado?")) {
      return
    }

    $.ajax({
      url: API_URL + "/update_estado_pedido.php",
      method: "POST",
      data: {
        id_pedido: pedidoId,
        estado: "entregado",
      },
      success: (response) => {
        if (response.success) {
          window.FoodLinkAuth.showAlert("success", "Pedido marcado como entregado")
          loadVentas()
        } else {
          window.FoodLinkAuth.showAlert("danger", response.message || "Error al actualizar pedido")
        }
      },
      error: (xhr) => {
        const response = xhr.responseJSON || {}
        window.FoodLinkAuth.showAlert("danger", response.message || "Error al conectar con el servidor")
      },
    })
  }
})(window.jQuery)
