# 🍽️ FoodLink - Aplicación Móvil

## 📋 Descripción del Proyecto

**FoodLink** es una aplicación móvil desarrollada en React Native que conecta a estudiantes universitarios con vendedores de comida casera. Este módulo específico implementa la **Gestión de Menús/Platillos** para el rol de Vendedor, integrando servicios en la nube (Firebase) y aplicando principios de codificación segura.

## 🎯 Objetivos del Módulo

- ✅ Integración con servicios en la nube (Firebase Authentication y Firestore)
- ✅ Implementación de CRUD completo de platillos
- ✅ Aplicación de principios de codificación segura
- ✅ Validación robusta de entradas
- ✅ Gestión profesional de versiones con Git Flow

---

## 🏗️ Arquitectura del Sistema

### Diagrama de Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                      FOODLINK MOBILE APP                         │
│                      (React Native)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ├─────────────┐
                              │             │
                              ▼             ▼
                    ┌──────────────┐  ┌──────────────┐
                    │   AUTH       │  │    MENU      │
                    │   SCREEN     │  │   SCREEN     │
                    │              │  │              │
                    │ - Login      │  │ - List       │
                    │ - Registro   │  │ - Create     │
                    └──────────────┘  │ - Update     │
                              │       │ - Delete     │
                              │       └──────────────┘
                              │             │
                              ▼             ▼
                    ┌──────────────────────────────┐
                    │     VALIDATORS.JS            │
                    │  (Validación Client-Side)    │
                    │                              │
                    │ - Email validation           │
                    │ - Password strength          │
                    │ - Field sanitization         │
                    │ - Form validation            │
                    └──────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────────────┐
                    │      FIREBASE.JS             │
                    │   (Service Layer)            │
                    │                              │
                    │ - Firebase initialization    │
                    │ - Auth methods               │
                    │ - CRUD operations            │
                    │ - Error handling             │
                    └──────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────────────────┐
                    │   FIREBASE BACKEND           │
                    │   (Cloud Services)           │
                    └──────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
        ┌────────────────────┐  ┌────────────────────┐
        │  AUTHENTICATION    │  │    FIRESTORE       │
        │                    │  │                    │
        │ - JWT Tokens       │  │ - /usuarios        │
        │ - Session Mgmt     │  │ - /platillos       │
        │ - HTTPS Encrypt    │  │                    │
        └────────────────────┘  └────────────────────┘
```

### Flujo de Autenticación

```
Usuario → AuthScreen → validators.js → firebase.js → Firebase Auth
   │                                                        │
   │                                                        ▼
   │                                                   JWT Token
   │                                                        │
   └──────────────────── MenuScreen ◄─────────────────────┘
                              │
                              ▼
                       Firestore CRUD
                    (Solo datos del userId)
```

---

## 🔐 Medidas de Seguridad Implementadas

### 1. **Protección de Credenciales**

#### Variables de Entorno (.env)
- ✅ **Implementación**: Uso de `react-native-dotenv` para cargar credenciales desde archivo `.env`
- ✅ **Archivo**: `.env.example` proporcionado como plantilla
- ✅ **Git**: `.env` incluido en `.gitignore` para prevenir exposición
- ✅ **Código**: Las credenciales de Firebase se cargan desde `process.env.*`

**Ubicación en código**: `src/services/firebase.js` (líneas 37-44)

```javascript
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  // ... otras configuraciones desde variables de entorno
};
```

### 2. **Validación de Entradas**

#### Validación Robusta Client-Side
- ✅ **Email**: Formato RFC válido, longitud máxima
- ✅ **Password**: Mínimo 6 caracteres, recomendaciones de fortaleza
- ✅ **Nombre**: Solo caracteres válidos, longitud controlada
- ✅ **Precio**: Número positivo, máximo 2 decimales
- ✅ **Sanitización**: Eliminación de caracteres peligrosos (XSS)

**Ubicación en código**: `src/utils/validators.js`

#### Validaciones Específicas Implementadas:

| Campo | Validaciones Aplicadas |
|-------|------------------------|
| Email | Formato, longitud (max 254) |
| Password | Longitud mínima 6, fortaleza, coincidencia |
| Nombre | 2-100 caracteres, solo letras y espacios |
| Platillo | 3-100 caracteres |
| Descripción | 10-500 caracteres |
| Precio | Numérico, positivo, max 2 decimales |

### 3. **Manejo Seguro de Errores**

#### Mensajes Amigables al Usuario
- ✅ **No exponer detalles internos** de Firebase o backend
- ✅ **Mensajes genéricos** para errores inesperados
- ✅ **Switch cases** para traducir códigos de error de Firebase
- ✅ **Logging interno** para debugging sin exponer al usuario

**Ejemplo de implementación** (`src/services/firebase.js`):

```javascript
// Error técnico de Firebase
catch (error) {
  console.error('Error en login:', error.code); // Solo para logs
  
  // Mensaje amigable al usuario (no técnico)
  let mensajeUsuario = 'Error al iniciar sesión. Intenta nuevamente.';
  
  switch (error.code) {
    case 'auth/user-not-found':
      mensajeUsuario = 'Usuario o contraseña incorrectos.';
      break;
    // ... más casos
  }
  
  return { success: false, error: mensajeUsuario };
}
```

### 4. **Comunicación Cifrada (HTTPS)**

- ✅ **Implementación**: El SDK de Firebase utiliza automáticamente HTTPS para todas las comunicaciones
- ✅ **Documentación**: Comentado en el código fuente como recordatorio de seguridad
- ✅ **Alcance**: Aplica a Authentication, Firestore y todas las APIs de Firebase

**Ubicación**: `src/services/firebase.js` (línea 48)

### 5. **Tokens y Gestión de Sesiones**

#### JWT y Sesiones Seguras
- ✅ **Tokens JWT**: Gestionados automáticamente por Firebase Authentication
- ✅ **Renovación automática**: Firebase maneja el refresh de tokens
- ✅ **Expiración**: Tokens expiran automáticamente después de 1 hora
- ✅ **Persistencia segura**: Almacenamiento encriptado en el dispositivo

**Funcionalidad implementada**:
```javascript
// Observer de estado de autenticación
export const observarEstadoAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Obtener usuario actual (con token válido)
export const obtenerUsuarioActual = () => {
  return auth.currentUser; // Incluye token JWT
};
```

### 6. **Seguridad a Nivel de Base de Datos**

#### Firestore Security Rules
- ✅ **Archivo**: `firestore.rules` incluido en el proyecto
- ✅ **Principio**: Solo lectura/escritura de datos propios del usuario
- ✅ **Validación**: Campos obligatorios validados en reglas de Firestore
- ✅ **Prevención**: Imposibilidad de modificar campo `userId`

**Regla clave implementada**:
```javascript
// Solo permitir leer platillos propios
allow read: if isAuthenticated() && isOwner(resource.data.userId);

// Solo permitir crear con userId válido
allow create: if isAuthenticated() && 
                 isOwner(request.resource.data.userId);
```

---

## 📦 Estructura del Proyecto

```
foodlink-mobile/
│
├── src/
│   ├── services/
│   │   └── firebase.js          # Configuración y servicios de Firebase
│   │
│   ├── screens/
│   │   ├── AuthScreen.js        # Pantalla de Login/Registro
│   │   └── MenuScreen.js        # Pantalla de gestión de platillos
│   │
│   ├── utils/
│   │   └── validators.js        # Funciones de validación
│   │
│   └── App.js                   # Componente principal y navegación
│
├── .env.example                 # Plantilla de variables de entorno
├── .gitignore                   # Archivos ignorados por Git
├── babel.config.js              # Configuración de Babel
├── package.json                 # Dependencias del proyecto
├── firestore.rules              # Reglas de seguridad de Firestore
└── README.md                    # Este archivo

```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- React Native CLI
- Android Studio (para Android) o Xcode (para iOS)
- Cuenta de Firebase

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/foodlink-mobile.git
cd foodlink-mobile
```

### Paso 2: Instalar Dependencias

```bash
npm install
# o
yarn install
```

### Paso 3: Configurar Firebase

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilita **Authentication** (Email/Password)
3. Crea una base de datos **Firestore**
4. Copia las credenciales de configuración

### Paso 4: Configurar Variables de Entorno

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env
```

2. Edita `.env` con tus credenciales de Firebase:
```env
FIREBASE_API_KEY=tu_api_key_aqui
FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

### Paso 5: Configurar Reglas de Firestore

1. Ve a Firebase Console > Firestore Database > Rules
2. Copia el contenido de `firestore.rules`
3. Publica las reglas

### Paso 6: Ejecutar la Aplicación

#### Android
```bash
npx react-native run-android
```

#### iOS
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

---

## 📱 Funcionalidades Implementadas

### Módulo de Autenticación

#### 🔐 Registro de Usuario
- Formulario con validación en tiempo real
- Campos: Nombre, Email, Password, Confirmar Password
- Validaciones de formato y fortaleza
- Creación de usuario en Firebase Authentication
- Creación de perfil en Firestore con rol "vendedor"

#### 🔑 Inicio de Sesión
- Login con email y contraseña
- Validación de credenciales
- Gestión automática de sesiones con JWT
- Manejo de errores amigable

### Módulo de Gestión de Menús

#### ➕ CREATE - Registrar Platillo
- Formulario modal con validación completa
- Campos obligatorios: Nombre, Descripción, Precio
- Campos opcionales: Categoría, Disponibilidad
- Validación de precio (numérico positivo, 2 decimales)
- Sanitización de entradas antes de guardar
- Asociación automática con `userId` del vendedor autenticado

#### 📋 READ - Consultar Platillos
- Lista completa de platillos del vendedor autenticado
- Filtrado automático por `userId` en Firestore
- Pull-to-refresh para actualizar datos
- Diseño de tarjetas con información clave
- Estado visual (disponible/no disponible)

#### ✏️ UPDATE - Actualizar Platillo
- Modal de edición prellenado con datos actuales
- Validación completa de campos modificados
- Actualización en tiempo real
- Timestamp automático de última modificación

#### 🗑️ DELETE - Eliminar Platillo
- Confirmación antes de eliminar
- Eliminación permanente de Firestore
- Actualización automática de la lista

---

## 🔧 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React Native | 0.73.0 | Framework móvil |
| Firebase | 10.7.1 | Backend as a Service |
| React Navigation | 6.1.9 | Navegación entre pantallas |
| react-native-dotenv | 3.4.9 | Variables de entorno |
| Firebase Auth | - | Autenticación de usuarios |
| Firestore | - | Base de datos NoSQL |

---

## 🧪 Testing y Validación

### Pruebas de Seguridad Recomendadas

1. **Validación de Entradas**
   - ✅ Intentar registrar con email inválido
   - ✅ Intentar password de menos de 6 caracteres
   - ✅ Intentar precio negativo o no numérico
   - ✅ Intentar inyección de caracteres especiales

2. **Autenticación**
   - ✅ Login con credenciales incorrectas
   - ✅ Acceso sin estar autenticado
   - ✅ Expiración de sesión

3. **Autorización**
   - ✅ Intentar acceder a platillos de otro usuario (mediante reglas de Firestore)
   - ✅ Intentar modificar `userId` de un platillo

---

## 📊 Modelo de Datos

### Colección: `usuarios`

```javascript
{
  uid: "firebase_uid_string",
  email: "usuario@ejemplo.com",
  nombre: "Nombre del Vendedor",
  rol: "vendedor",
  fechaCreacion: Timestamp
}
```

### Colección: `platillos`

```javascript
{
  id: "auto_generated_id",
  nombre: "Tacos al Pastor",
  descripcion: "Deliciosos tacos con carne marinada",
  precio: 45.50,
  categoria: "Comidas",
  disponible: true,
  userId: "firebase_uid_del_vendedor",  // ⚠️ Campo crítico para seguridad
  fechaCreacion: Timestamp,
  fechaActualizacion: Timestamp
}
```

---

## 🐛 Solución de Problemas

### Error: "Firebase config is missing"
**Solución**: Verifica que el archivo `.env` existe y contiene todas las variables requeridas.

### Error: "Permission denied" en Firestore
**Solución**: Verifica que las reglas de Firestore estén correctamente configuradas según `firestore.rules`.

### Error: "Unable to resolve module @env"
**Solución**: 
```bash
# Limpiar cache y reinstalar
rm -rf node_modules
npm install
npx react-native start --reset-cache
```

### La app no se conecta a Firebase
**Solución**: 
1. Verifica que Internet esté disponible
2. Revisa que las credenciales en `.env` sean correctas
3. Verifica que Firebase Authentication y Firestore estén habilitados en Firebase Console

---

## 📈 Próximas Mejoras

- [ ] Implementar carga de imágenes para platillos (Firebase Storage)
- [ ] Agregar filtros y búsqueda en la lista de platillos
- [ ] Implementar sistema de categorías dinámico
- [ ] Agregar estadísticas de ventas
- [ ] Implementar notificaciones push
- [ ] Modo offline con sincronización
- [ ] Tests unitarios con Jest
- [ ] Tests E2E con Detox

---

## 👥 Contribución

Este proyecto es parte de un módulo educativo de Desarrollo Móvil Integral. Para contribuir:

1. Fork el repositorio
2. Crea una rama de feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 📞 Contacto y Soporte

Para preguntas o soporte relacionado con el proyecto:

- **Email**: soporte@foodlink.com
- **GitHub Issues**: [https://github.com/tu-usuario/foodlink-mobile/issues](https://github.com/tu-usuario/foodlink-mobile/issues)

---

## 🎓 Referencias y Recursos

### Documentación Oficial
- [React Native](https://reactnative.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)

### Seguridad
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules)

### Git Flow
- [Git Flow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Semantic Versioning](https://semver.org/)

---

**Desarrollado con ❤️ para FoodLink**

*Última actualización: Noviembre 2024*

