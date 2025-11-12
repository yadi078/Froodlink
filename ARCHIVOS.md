# Archivos del Proyecto

## Código Fuente

### src/services/firebase.js
Configuración e integración con Firebase. Incluye funciones de autenticación y CRUD de platillos.

### src/utils/validators.js
Funciones de validación para formularios. Valida emails, contraseñas, precios y otros campos.

### src/screens/AuthScreen.js
Pantalla de inicio de sesión y registro de vendedores.

### src/screens/MenuScreen.js
Pantalla principal para gestionar el menú de platillos. Incluye crear, editar, eliminar y listar platillos.

### src/App.js
Configuración de navegación entre pantallas.

### index.js
Punto de entrada de la aplicación.

---

## Configuración

### package.json
Dependencias y scripts del proyecto.

### babel.config.js
Configuración de Babel para transpilar el código.

### .gitignore
Archivos y carpetas que Git debe ignorar.

### firestore.rules
Reglas de seguridad para la base de datos Firestore.

### .env.example
Plantilla con las variables de entorno necesarias para Firebase.

---

## Documentación

### README.md
Documentación principal del proyecto con arquitectura, instalación y guía de uso.

### ARCHIVOS.md
Este archivo con la lista de todos los archivos del proyecto.

---

## Estructura del Proyecto

```
foodlink-mobile/
├── src/
│   ├── services/
│   │   └── firebase.js
│   ├── utils/
│   │   └── validators.js
│   ├── screens/
│   │   ├── AuthScreen.js
│   │   └── MenuScreen.js
│   └── App.js
├── package.json
├── babel.config.js
├── .gitignore
├── firestore.rules
├── .env.example
├── index.js
├── README.md
└── ARCHIVOS.md
```
