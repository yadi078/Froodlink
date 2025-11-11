// cocinero.js - Panel del cocinero
;(($) => {
  const API_URL = "http://localhost/foodlink/api"

  $(document).ready(() => {
    const user = window.FoodLinkAuth.getUser()

    if (!user || user.tipo !== "cocinero") {
      alert("Acceso denegado. Solo los cocineros pueden acceder a esta página.")
      window.location.href = "index.html"
      return
    }

    loadMyFoods()
    setupCocineroListeners()
  })

  function setupCocineroListeners() {
    $("#addFoodForm").submit((e) => {
      e.preventDefault()
      addFood()
    })

    $("#editFoodForm").submit((e) => {
      e.preventDefault()
      updateFood()
    })
  }

  function loadMyFoods() {
    const user = window.FoodLinkAuth.getUser()

    $.ajax({
      url: API_URL + "/get_my_comidas.php",
      method: "GET",
      data: { id_cocinero: user.id_usuario },
      success: (response) => {
        if (response.success) {
          displayMyFoods(response.comidas)
        } else {
          window.FoodLinkAuth.showAlert("danger", "Error al cargar las comidas")
        }
      },
      error: (xhr) => {
        const response = xhr.responseJSON || {}
        window.FoodLinkAuth.showAlert("danger", response.message || "Error al conectar con el servidor")
      },
    })
  }

  function displayMyFoods(comidas) {
    const tbody = $("#myFoodsTable")
    tbody.empty()

    if (comidas.length === 0) {
      tbody.html('<tr><td colspan="6" class="text-center">No tienes comidas registradas</td></tr>')
      return
    }

    comidas.forEach((comida) => {
      const row = `
                <tr>
                    <td>${comida.id_comida}</td>
                    <td>${comida.nombre_comida}</td>
                    <td>$${Number.parseFloat(comida.precio).toFixed(2)}</td>
                    <td>${comida.cantidad}</td>
                    <td><img src="img/${comida.foto}" alt="${comida.nombre_comida}" style="width: 50px; height: 50px; object-fit: cover;"></td>
                    <td>
                        <button class="btn btn-sm btn-info edit-btn" data-id="${comida.id_comida}">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn" data-id="${comida.id_comida}" data-name="${comida.nombre_comida}">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </td>
                </tr>
            `
      tbody.append(row)
    })

    // Setup edit buttons
    $(".edit-btn").click(function () {
      const id = $(this).data("id")
      loadFoodForEdit(id)
    })

    // Setup delete buttons
    $(".delete-btn").click(function () {
      const id = $(this).data("id")
      const name = $(this).data("name")
      deleteFood(id, name)
    })
  }

  function addFood() {
    const user = window.FoodLinkAuth.getUser()

    const foodData = {
      id_cocinero: user.id_usuario,
      nombre_comida: $("#foodName").val(),
      precio: $("#foodPrice").val(),
      cantidad: $("#foodQuantity").val(),
      foto: $("#foodPhoto").val(),
      descripcion: $("#foodDescription").val(),
    }

    $.ajax({
      url: API_URL + "/add_comida.php",
      method: "POST",
      data: foodData,
      success: (response) => {
        if (response.success) {
          window.FoodLinkAuth.showAlert("success", "Comida agregada exitosamente")
          $("#addFoodForm")[0].reset()
          loadMyFoods()
        } else {
          window.FoodLinkAuth.showAlert("danger", response.message || "Error al agregar comida")
        }
      },
      error: (xhr) => {
        const response = xhr.responseJSON || {}
        window.FoodLinkAuth.showAlert("danger", response.message || "Error al conectar con el servidor")
      },
    })
  }

  function loadFoodForEdit(id) {
    $.ajax({
      url: API_URL + "/get_comida.php",
      method: "GET",
      data: { id_comida: id },
      success: (response) => {
        console.log("[v0] Loaded food data:", response) // Debug log
        if (response.success) {
          const comida = response.comida
          $("#editFoodId").val(comida.id_comida)
          $("#editFoodName").val(comida.nombre_comida)
          $("#editFoodPrice").val(comida.precio)
          $("#editFoodQuantity").val(comida.cantidad)
          $("#editFoodPhoto").val(comida.foto)
          $("#editFoodDescription").val(comida.descripcion)
          $("#editFoodModal").modal("show")
        } else {
          window.FoodLinkAuth.showAlert("danger", "Error al cargar la comida")
        }
      },
      error: (xhr) => {
        console.log("[v0] Error loading food:", xhr) // Debug log
        const response = xhr.responseJSON || {}
        window.FoodLinkAuth.showAlert("danger", response.message || "Error al conectar con el servidor")
      },
    })
  }

  function updateFood() {
    const foodData = {
      id_comida: $("#editFoodId").val(),
      nombre_comida: $("#editFoodName").val(),
      precio: $("#editFoodPrice").val(),
      cantidad: $("#editFoodQuantity").val(),
      foto: $("#editFoodPhoto").val(),
      descripcion: $("#editFoodDescription").val(),
    }

    console.log("[v0] Updating food with data:", foodData) // Debug log

    $.ajax({
      url: API_URL + "/update_comida.php",
      method: "POST",
      data: foodData,
      success: (response) => {
        console.log("[v0] Update response:", response) // Debug log
        if (response.success) {
          $("#editFoodModal").modal("hide")
          window.FoodLinkAuth.showAlert("success", "Comida actualizada exitosamente")
          $("#editFoodForm")[0].reset()
          setTimeout(() => loadMyFoods(), 500)
        } else {
          window.FoodLinkAuth.showAlert("danger", response.message || "Error al actualizar")
        }
      },
      error: (xhr) => {
        console.log("[v0] Update error:", xhr) // Debug log
        const response = xhr.responseJSON || {}
        window.FoodLinkAuth.showAlert("danger", response.message || "Error al conectar con el servidor")
      },
    })
  }

  function deleteFood(id, name) {
    if (!confirm(`¿Estás seguro de eliminar "${name}"?`)) {
      return
    }

    $.ajax({
      url: API_URL + "/delete_comida.php",
      method: "POST",
      data: { id_comida: id },
      success: (response) => {
        if (response.success) {
          window.FoodLinkAuth.showAlert("success", "Comida eliminada exitosamente")
          loadMyFoods()
        } else {
          window.FoodLinkAuth.showAlert("danger", response.message || "Error al eliminar")
        }
      },
      error: (xhr) => {
        const response = xhr.responseJSON || {}
        window.FoodLinkAuth.showAlert("danger", response.message || "Error al conectar con el servidor")
      },
    })
  }
})(window.jQuery)
