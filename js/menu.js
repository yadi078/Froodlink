// menu.js - Gestión del menú de comidas
;(($) => {
  const API_URL = "http://localhost/Foodlik/api"

  $(document).ready(() => {
    loadMenu()
    setupMenuListeners()
  })

  function setupMenuListeners() {
    // Order form
    $("#orderForm").submit((e) => {
      e.preventDefault()
      createOrder()
    })

    // Calculate total when quantity changes
    $("#orderQuantity").on("input", () => {
      calculateTotal()
    })
  }

  function loadMenu() {
    const user = window.FoodLinkAuth.getUser()

    if (!user) {
      $("#authWarning").show()
    } else {
      $("#authWarning").hide()
    }

    $.ajax({
      url: API_URL + "/get_comidas.php",
      method: "GET",
      success: (response) => {
        if (response.success) {
          displayMenu(response.comidas, user)
        } else {
          window.FoodLinkAuth.showAlert("danger", "Error al cargar el menú")
        }
      },
      error: (xhr) => {
        const response = xhr.responseJSON || {}
        window.FoodLinkAuth.showAlert("danger", response.message || "Error al conectar con el servidor")
      },
    })
  }

  function displayMenu(comidas, user) {
    const container = $("#menuContainer")
    container.empty()

    if (comidas.length === 0) {
      container.html('<div class="col-12"><p class="text-center">No hay comidas disponibles en este momento.</p></div>')
      return
    }

    comidas.forEach((comida) => {
      const isAuthenticated = user !== null
      const canOrder = isAuthenticated && comida.cantidad > 0

      const foodCard = `
                <div class="col-lg-6 col-md-12 mb-4">
                    <div class="card h-100">
                        <div class="row no-gutters">
                            <div class="col-md-4">
                                <img src="img/${comida.foto}" class="card-img" alt="${comida.nombre_comida}" style="height: 100%; object-fit: cover;">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${comida.nombre_comida}</h5>
                                    <p class="card-text">${comida.descripcion || "Deliciosa comida casera"}</p>
                                    <p class="card-text"><small class="text-muted">Cocinero: ${comida.cocinero || "No especificado"}</small></p>
                                    <p class="card-text"><strong>Precio: $${Number.parseFloat(comida.precio).toFixed(2)}</strong></p>
                                    <p class="card-text"><small>Disponibles: ${comida.cantidad}</small></p>
                                    
                                    ${
                                      !isAuthenticated
                                        ? `
                                        <div class="alert alert-warning">
                                            <small><i class="fas fa-lock"></i> Debes iniciar sesión para ordenar</small>
                                        </div>
                                    `
                                        : canOrder
                                          ? `
                                        <button class="btn btn-sm custom-btn order-btn" data-id="${comida.id_comida}" data-name="${comida.nombre_comida}" data-price="${comida.precio}" data-max="${comida.cantidad}">
                                            <i class="fas fa-shopping-cart"></i> Ordenar
                                        </button>
                                    `
                                          : `
                                        <button class="btn btn-sm btn-secondary" disabled>
                                            <i class="fas fa-times"></i> No Disponible
                                        </button>
                                    `
                                    }
                                    
                                    <div class="mt-3 comments-section">
                                        <h6>Comentarios:</h6>
                                        <div class="comments-list" id="comments-${comida.id_comida}" style="max-height: 200px; overflow-y: auto;">
                                            <p class="text-muted"><small>Cargando comentarios...</small></p>
                                        </div>
                                        ${
                                          isAuthenticated
                                            ? `
                                            <form class="comment-form mt-2" data-food-id="${comida.id_comida}">
                                                <div class="input-group input-group-sm">
                                                    <input type="text" class="form-control comment-input" placeholder="Escribe tu comentario..." required>
                                                    <div class="input-group-append">
                                                        <button class="btn btn-primary" type="submit">
                                                            <i class="fas fa-paper-plane"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        `
                                            : `
                                            <div class="alert alert-info mt-2">
                                                <small><i class="fas fa-lock"></i> Debes iniciar sesión para comentar</small>
                                            </div>
                                        `
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `
      container.append(foodCard)

      loadComments(comida.id_comida)
    })

    $(".order-btn").click(function () {
      const id = $(this).data("id")
      const name = $(this).data("name")
      const price = $(this).data("price")
      const max = $(this).data("max")

      $("#orderFoodId").val(id)
      $("#orderFoodName").val(name)
      $("#orderQuantity").attr("max", max).val(1)
      $("#orderQuantity").data("price", price)
      calculateTotal()
      $("#orderModal").modal("show")
    })

    $(".comment-form").submit(function (e) {
      e.preventDefault()
      const form = $(this)
      const foodId = form.data("food-id")
      const commentInput = form.find(".comment-input")
      const comment = commentInput.val().trim()

      if (comment) {
        submitComment(foodId, comment, form)
      }
    })
  }

  function loadComments(foodId) {
    $.ajax({
      url: API_URL + "/get_comentarios.php",
      method: "GET",
      data: { id_comida: foodId },
      success: (response) => {
        if (response.success) {
          displayComments(foodId, response.comentarios)
        }
      },
      error: () => {
        $(`#comments-${foodId}`).html('<p class="text-muted"><small>Error al cargar comentarios</small></p>')
      },
    })
  }

  function displayComments(foodId, comentarios) {
    const commentsContainer = $(`#comments-${foodId}`)

    if (comentarios.length === 0) {
      commentsContainer.html(
        '<p class="text-muted"><small>No hay comentarios aún. Sé el primero en comentar.</small></p>',
      )
      return
    }

    let commentsHtml = ""
    comentarios.forEach((comentario) => {
      const fecha = new Date(comentario.fecha).toLocaleDateString("es-ES")
      commentsHtml += `
        <div class="mb-2 pb-2 border-bottom">
          <p class="mb-0"><strong>${comentario.nombre}:</strong> ${comentario.comentario}</p>
          <p class="text-muted mb-0"><small>${fecha}</small></p>
        </div>
      `
    })

    commentsContainer.html(commentsHtml)
  }

  function calculateTotal() {
    const quantity = Number.parseInt($("#orderQuantity").val()) || 1
    const price = Number.parseFloat($("#orderQuantity").data("price")) || 0
    const total = quantity * price
    $("#orderTotal").val("$" + total.toFixed(2))
  }

  function createOrder() {
    const user = window.FoodLinkAuth.getUser()
    if (!user) {
      window.FoodLinkAuth.showAlert("danger", "Debes iniciar sesión para ordenar")
      return
    }

    const foodId = $("#orderFoodId").val()
    const quantity = $("#orderQuantity").val()

    $.ajax({
      url: API_URL + "/create_pedido.php",
      method: "POST",
      data: {
        id_usuario: user.id_usuario,
        id_comida: foodId,
        cantidad: quantity,
      },
      success: (response) => {
        if (response.success) {
          $("#orderModal").modal("hide")
          window.FoodLinkAuth.showAlert("success", "Pedido realizado exitosamente")
          setTimeout(() => loadMenu(), 1000)
        } else {
          window.FoodLinkAuth.showAlert("danger", response.message || "Error al crear el pedido")
        }
      },
      error: (xhr) => {
        const response = xhr.responseJSON || {}
        window.FoodLinkAuth.showAlert("danger", response.message || "Error al conectar con el servidor")
      },
    })
  }

  function submitComment(foodId, comment, form) {
    const user = window.FoodLinkAuth.getUser()
    if (!user) {
      window.FoodLinkAuth.showAlert("danger", "Debes iniciar sesión para comentar")
      return
    }

    $.ajax({
      url: API_URL + "/add_comentario.php",
      method: "POST",
      data: {
        id_usuario: user.id_usuario,
        id_comida: foodId,
        comentario: comment,
      },
      success: (response) => {
        if (response.success) {
          form.find(".comment-input").val("")
          window.FoodLinkAuth.showAlert("success", "Comentario agregado exitosamente")
          setTimeout(() => loadComments(foodId), 500)
        } else {
          window.FoodLinkAuth.showAlert("danger", response.message || "Error al agregar comentario")
        }
      },
      error: (xhr) => {
        const response = xhr.responseJSON || {}
        window.FoodLinkAuth.showAlert("danger", response.message || "Error al conectar con el servidor")
      },
    })
  }
})(window.jQuery)
