// Funciones de validación para los formularios
// Estas validaciones ayudan a mantener los datos limpios y seguros

// Validar que el email tenga un formato correcto
export const validarEmail = (email) => {
  // Expresión regular para verificar el formato del email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email || email.trim() === '') {
    return {
      valido: false,
      mensaje: 'El correo electrónico es obligatorio.'
    };
  }

  if (!emailRegex.test(email)) {
    return {
      valido: false,
      mensaje: 'El formato del correo electrónico no es válido.'
    };
  }

  // Los emails no deberían ser tan largos
  if (email.length > 254) {
    return {
      valido: false,
      mensaje: 'El correo electrónico es demasiado largo.'
    };
  }

  return {
    valido: true,
    mensaje: 'Email válido.'
  };
};

// Verificar que la contraseña cumpla con los requisitos mínimos
export const validarPassword = (password) => {
  if (!password) {
    return {
      valido: false,
      mensaje: 'La contraseña es obligatoria.'
    };
  }

  // Firebase requiere al menos 6 caracteres
  if (password.length < 6) {
    return {
      valido: false,
      mensaje: 'La contraseña debe tener al menos 6 caracteres.'
    };
  }

  // Recomendamos más de 8 caracteres para mayor seguridad
  if (password.length < 8) {
    return {
      valido: true,
      mensaje: 'Contraseña válida, pero se recomienda 8+ caracteres.',
      advertencia: true
    };
  }

  // Es bueno que tenga números y letras mezclados
  const tieneNumero = /\d/.test(password);
  const tieneLetra = /[a-zA-Z]/.test(password);

  if (!tieneNumero || !tieneLetra) {
    return {
      valido: true,
      mensaje: 'Se recomienda incluir letras y números.',
      advertencia: true
    };
  }

  return {
    valido: true,
    mensaje: 'Contraseña válida.'
  };
};

// Verificar que ambas contraseñas sean iguales
export const validarPasswordsCoinciden = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      valido: false,
      mensaje: 'Las contraseñas no coinciden.'
    };
  }

  return {
    valido: true,
    mensaje: 'Las contraseñas coinciden.'
  };
};

// Validar el nombre del vendedor
export const validarNombre = (nombre) => {
  if (!nombre || nombre.trim() === '') {
    return {
      valido: false,
      mensaje: 'El nombre es obligatorio.'
    };
  }

  // El nombre debe tener al menos 2 letras
  if (nombre.trim().length < 2) {
    return {
      valido: false,
      mensaje: 'El nombre debe tener al menos 2 caracteres.'
    };
  }

  // Ponemos un límite razonable
  if (nombre.length > 100) {
    return {
      valido: false,
      mensaje: 'El nombre es demasiado largo (máximo 100 caracteres).'
    };
  }

  // Solo letras y espacios, nada de números o símbolos
  const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
  if (!nombreRegex.test(nombre)) {
    return {
      valido: false,
      mensaje: 'El nombre solo puede contener letras y espacios.'
    };
  }

  return {
    valido: true,
    mensaje: 'Nombre válido.'
  };
};

// Validar el nombre del platillo
export const validarNombrePlatillo = (nombre) => {
  if (!nombre || nombre.trim() === '') {
    return {
      valido: false,
      mensaje: 'El nombre del platillo es obligatorio.'
    };
  }

  if (nombre.trim().length < 3) {
    return {
      valido: false,
      mensaje: 'El nombre debe tener al menos 3 caracteres.'
    };
  }

  if (nombre.length > 100) {
    return {
      valido: false,
      mensaje: 'El nombre es demasiado largo (máximo 100 caracteres).'
    };
  }

  return {
    valido: true,
    mensaje: 'Nombre del platillo válido.'
  };
};

// Validar la descripción del platillo
export const validarDescripcion = (descripcion) => {
  if (!descripcion || descripcion.trim() === '') {
    return {
      valido: false,
      mensaje: 'La descripción es obligatoria.'
    };
  }

  if (descripcion.trim().length < 10) {
    return {
      valido: false,
      mensaje: 'La descripción debe tener al menos 10 caracteres.'
    };
  }

  if (descripcion.length > 500) {
    return {
      valido: false,
      mensaje: 'La descripción es demasiado larga (máximo 500 caracteres).'
    };
  }

  return {
    valido: true,
    mensaje: 'Descripción válida.'
  };
};

// Validar que el precio sea correcto
export const validarPrecio = (precio) => {
  // El precio es obligatorio
  if (precio === '' || precio === null || precio === undefined) {
    return {
      valido: false,
      mensaje: 'El precio es obligatorio.'
    };
  }

  // Convertimos el precio a número
  const precioNumerico = parseFloat(precio);

  // Debe ser un número válido
  if (isNaN(precioNumerico)) {
    return {
      valido: false,
      mensaje: 'El precio debe ser un número válido.'
    };
  }

  // No puede ser negativo o cero
  if (precioNumerico <= 0) {
    return {
      valido: false,
      mensaje: 'El precio debe ser mayor a cero.'
    };
  }

  // Ponemos un límite máximo razonable
  if (precioNumerico > 99999.99) {
    return {
      valido: false,
      mensaje: 'El precio ingresado es demasiado alto.'
    };
  }

  // Los precios deben tener máximo 2 decimales (centavos)
  const decimales = (precioNumerico.toString().split('.')[1] || '').length;
  if (decimales > 2) {
    return {
      valido: false,
      mensaje: 'El precio debe tener máximo 2 decimales.'
    };
  }

  return {
    valido: true,
    mensaje: 'Precio válido.',
    valor: precioNumerico
  };
};

// Limpiar el texto de caracteres peligrosos
export const sanitizarTexto = (texto) => {
  if (!texto) return '';
  
  // Quitamos espacios extras y caracteres raros
  return texto
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 1000);
};

// Validar todo el formulario del platillo de una vez
export const validarFormularioPlatillo = (platilloData) => {
  const errores = {};
  let formularioValido = true;

  // Revisamos el nombre
  const validacionNombre = validarNombrePlatillo(platilloData.nombre);
  if (!validacionNombre.valido) {
    errores.nombre = validacionNombre.mensaje;
    formularioValido = false;
  }

  // Revisamos la descripción
  const validacionDescripcion = validarDescripcion(platilloData.descripcion);
  if (!validacionDescripcion.valido) {
    errores.descripcion = validacionDescripcion.mensaje;
    formularioValido = false;
  }

  // Revisamos el precio
  const validacionPrecio = validarPrecio(platilloData.precio);
  if (!validacionPrecio.valido) {
    errores.precio = validacionPrecio.mensaje;
    formularioValido = false;
  }

  return {
    valido: formularioValido,
    errores: errores,
    mensaje: formularioValido ? 'Formulario válido' : 'Por favor corrige los errores.'
  };
};

// Validar todo el formulario de registro
export const validarFormularioRegistro = (userData) => {
  const errores = {};
  let formularioValido = true;

  // Revisamos el nombre
  const validacionNombre = validarNombre(userData.nombre);
  if (!validacionNombre.valido) {
    errores.nombre = validacionNombre.mensaje;
    formularioValido = false;
  }

  // Revisamos el email
  const validacionEmail = validarEmail(userData.email);
  if (!validacionEmail.valido) {
    errores.email = validacionEmail.mensaje;
    formularioValido = false;
  }

  // Revisamos la contraseña
  const validacionPassword = validarPassword(userData.password);
  if (!validacionPassword.valido) {
    errores.password = validacionPassword.mensaje;
    formularioValido = false;
  }

  // Verificamos que ambas contraseñas sean iguales
  if (userData.confirmPassword) {
    const validacionCoincidencia = validarPasswordsCoinciden(
      userData.password,
      userData.confirmPassword
    );
    if (!validacionCoincidencia.valido) {
      errores.confirmPassword = validacionCoincidencia.mensaje;
      formularioValido = false;
    }
  }

  return {
    valido: formularioValido,
    errores: errores,
    mensaje: formularioValido ? 'Formulario válido' : 'Por favor corrige los errores.'
  };
};

// Validar el formulario de login
export const validarFormularioLogin = (loginData) => {
  const errores = {};
  let formularioValido = true;

  // Revisamos el email
  const validacionEmail = validarEmail(loginData.email);
  if (!validacionEmail.valido) {
    errores.email = validacionEmail.mensaje;
    formularioValido = false;
  }

  // La contraseña no puede estar vacía
  if (!loginData.password || loginData.password.trim() === '') {
    errores.password = 'La contraseña es obligatoria.';
    formularioValido = false;
  }

  return {
    valido: formularioValido,
    errores: errores,
    mensaje: formularioValido ? 'Formulario válido' : 'Por favor corrige los errores.'
  };
};

