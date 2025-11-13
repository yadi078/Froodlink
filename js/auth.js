// auth.js - Sistema de autenticación para FoodLink
;(($) => {
  // API Configuration - Cambiar esto por tu URL de API
   const API_URL = "http://localhost/Foodlink/api"

  // Verificar sesión al cargar la página
  $(document).ready(() => {
    checkSession()
    setupAuthListeners()
  })

  function setupAuthListeners() {
    // Login buttons
    $("#loginBtn, #authWarningLogin").click((e) => {
      e.preventDefault()
      $("#loginModal").modal("show")
    })

    // Register buttons
    $("#registerBtn, #heroRegisterBtn, #heroRegisterBtn2, #heroRegisterBtn3, #authWarningRegister").click((e) => {
      e.preventDefault()
      $("#registerModal").modal("show")
    })

    // Logout button
    $("#logoutBtn").click((e) => {
      e.preventDefault()
      logout()
    })

    // Login form
    $("#loginForm").submit((e) => {
      e.preventDefault()
      login()
    })

    // Register form
    $("#registerForm").submit((e) => {
      e.preventDefault()
      register()
    })
  }

  function checkSession() {
    const user = getUser()
    if (user) {
      updateUIForLoggedIn(user)
    } else {
      updateUIForLoggedOut()
    }
  }

  function updateUIForLoggedIn(user) {
    // Hide login/register buttons
    $("#loginBtn, #registerBtn").addClass("d-none")

    // Show logout and welcome
    $("#logoutBtn, #userWelcome").removeClass("d-none")
    $("#userWelcome").text("Hola, " + user.nombre)

    if (user.tipo === "cocinero") {
      $("#panelCocineroBtn, #ventasLink").removeClass("d-none")
      $("#misPedidosLink").addClass("d-none")
    } else {
      $("#misPedidosLink").removeClass("d-none")
      $("#panelCocineroBtn, #ventasLink").addClass("d-none")
    }
  }

  function updateUIForLoggedOut() {
    // Show only: Inicio, Menú, Contacto, Preguntas, Iniciar Sesión, Registrarse
    $("#loginBtn, #registerBtn").removeClass("d-none")
    $("#logoutBtn, #userWelcome, #panelCocineroBtn, #misPedidosLink, #ventasLink").addClass("d-none")
  }

  function login() {
    const email = $("#loginEmail").val()
    const password = $("#loginPassword").val()

    $.ajax({
      url: API_URL + "/login.php",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        correo: email,
        contrasena: password,
      }),
      dataType: "json",
      success: (response) => {
        if (response.success) {
          setUser(response.user)
          $("#loginModal").modal("hide")
          showAlert("success", "Inicio de sesión exitoso")
          checkSession()

          if (window.location.pathname.includes("menu.html")) {
            setTimeout(() => window.location.reload(), 1000)
          }
        } else {
          showAlert("danger", response.message || "Credenciales incorrectas")
        }
      },
      error: (xhr) => {
        const response = xhr.responseJSON || {}
        showAlert(
          "danger",
          response.message || "Error al conectar con el servidor. Verifica que el servidor PHP esté funcionando.",
        )
      },
    })
  }

  function register() {
    const nombre = $("#registerName").val()
    const tipo = $("#registerTipo").val()
    const correo = $("#registerEmail").val()
    const telefono = $("#registerTelefono").val()
    const edad = $("#registerEdad").val()
    const contrasena = $("#registerPassword").val()

    $.ajax({
      url: API_URL + "/register.php",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        nombre: nombre,
        tipo: tipo,
        correo: correo,
        telefono: telefono,
        edad: edad,
        contrasena: contrasena,
      }),
      dataType: "json",
      success: (response) => {
        console.log("[v0] Register response:", response)
        if (response.success) {
          $("#registerModal").modal("hide")
          showAlert("success", "Registro exitoso. Por favor inicia sesión.")
        } else {
          showAlert("danger", response.message || "Error en el registro")
        }
      },
      error: (xhr) => {
        console.log("[v0] Register error:", xhr)
        const response = xhr.responseJSON || {}
        showAlert(
          "danger",
          response.message || "Error al conectar con el servidor. Verifica que el servidor PHP esté funcionando.",
        )
      },
    })
  }

  function logout() {
    localStorage.removeItem("foodlink_user")
    showAlert("success", "Sesión cerrada exitosamente")
    updateUIForLoggedOut()

    if (
      window.location.pathname.includes("panel-cocinero.html") ||
      window.location.pathname.includes("mis-pedidos.html")
    ) {
      setTimeout(() => (window.location.href = "index.html"), 1000)
    } else if (window.location.pathname.includes("menu.html")) {
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  function getUser() {
    const userStr = localStorage.getItem("foodlink_user")
    return userStr ? JSON.parse(userStr) : null
  }

  function setUser(user) {
    localStorage.setItem("foodlink_user", JSON.stringify(user))
  }

  function showAlert(type, message) {
    const alertHtml = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert" style="position: fixed; top: 80px; right: 20px; z-index: 9999; min-width: 300px;">
                ${message}
                <button type="button" class="close" data-dismiss="alert">
                    <span>&times;</span>
                </button>
            </div>
        `
    $("body").append(alertHtml)
    setTimeout(() => {
      $(".alert").alert("close")
    }, 3000)
  }

  // Exportar funciones globales
  window.FoodLinkAuth = {
    getUser: getUser,
    checkSession: checkSession,
    showAlert: showAlert,
  }
})(window.jQuery)
