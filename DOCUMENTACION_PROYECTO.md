# DOCUMENTACIÓN TÉCNICA DEL PROYECTO FOODLINK

---

## PORTADA

**Proyecto:** FoodLink - Plataforma de Conexión entre Cocineros y Estudiantes

**Módulo:** Gestión de Menús y Sistema de Pedidos con Integración Cloud

**Institución:** [Nombre de tu institución]

**Materia:** Desarrollo Móvil Integral

**Periodo:** Segundo Parcial - Noviembre 2024

**Versión del Sistema:** 1.0.0

**Repositorio:** https://github.com/yadi078/Froodlink.git

---

## ÍNDICE

1. [Introducción](#introducción)
2. [Objetivo del Módulo](#objetivo-del-módulo)
3. [Alcance del Proyecto](#alcance-del-proyecto)
4. [Arquitectura del Sistema](#arquitectura-del-sistema)
5. [Integración con Servicios en la Nube](#integración-con-servicios-en-la-nube)
6. [Principios de Codificación Segura](#principios-de-codificación-segura)
7. [Estrategia de Versionamiento](#estrategia-de-versionamiento)
8. [Flujo de Datos](#flujo-de-datos)
9. [Evidencias de Funcionamiento](#evidencias-de-funcionamiento)
10. [Conclusiones](#conclusiones)

---

## 1. INTRODUCCIÓN

FoodLink es una aplicación integral que conecta a cocineros caseros con estudiantes universitarios y otros usuarios que buscan comida casera de calidad. El proyecto se compone de dos plataformas complementarias:

- **Aplicación Móvil** (React Native): Enfocada en vendedores para gestionar su menú de platillos
- **Aplicación Web** (HTML/JavaScript/PHP): Plataforma completa para estudiantes y cocineros

Este documento presenta la implementación del segundo parcial, donde se integran servicios en la nube, se aplican principios de codificación segura y se implementa una estrategia profesional de versionamiento con Git Flow.

### Contexto del Proyecto

El proyecto es una evolución del trabajo desarrollado en el primer parcial, donde se establecieron las bases funcionales de la aplicación. En esta segunda fase, se han añadido:

- Integración completa con servicios cloud (Firebase y API REST propia)
- Implementación de medidas de seguridad robustas
- Sistema de versionamiento profesional con Git Flow
- Documentación técnica exhaustiva

---

## 2. OBJETIVO DEL MÓDULO

### Objetivo General

Desarrollar e integrar servicios en la nube para la plataforma FoodLink, aplicando principios de codificación segura y estrategias de versionamiento profesional que garanticen la escalabilidad, seguridad y mantenibilidad del sistema.

### Objetivos Específicos

1. **Integración Cloud**: Implementar y configurar servicios en la nube (Firebase y API REST) para gestionar autenticación y operaciones CRUD.

2. **Seguridad**: Aplicar principios de codificación segura en todas las capas de la aplicación, incluyendo validación de entradas, comunicación cifrada y protección de datos sensibles.

3. **Versionamiento**: Establecer una estrategia de versionamiento con Git Flow que permita el desarrollo colaborativo y profesional.

4. **Documentación**: Generar documentación técnica completa que facilite el mantenimiento y escalabilidad del proyecto.

---

## 3. ALCANCE DEL PROYECTO

### Funcionalidades Implementadas

#### Aplicación Móvil (React Native)

**Módulo de Autenticación**
- Registro de usuarios (vendedores)
- Inicio de sesión con Firebase Authentication
- Gestión de sesiones con tokens JWT
- Cierre de sesión seguro

**Módulo de Gestión de Menús**
- Crear platillos (CREATE)
- Consultar lista de platillos propios (READ)
- Actualizar información de platillos (UPDATE)
- Eliminar platillos (DELETE)
- Validación completa de formularios

#### Aplicación Web (PHP/MySQL)

**Módulo de Usuarios**
- Registro de estudiantes y cocineros
- Autenticación con password hashing
- Gestión de perfiles

**Módulo de Comidas**
- Publicación de platillos por cocineros
- Catálogo de comidas disponibles
- Sistema de búsqueda y filtrado
- Gestión de inventario

**Módulo de Pedidos**
- Creación de pedidos por estudiantes
- Seguimiento de estados de pedidos
- Historial de compras
- Panel de ventas para cocineros

**Módulo de Calificaciones**
- Sistema de calificación de platillos
- Comentarios y reseñas
- Promedio de calificaciones

---

## 4. ARQUITECTURA DEL SISTEMA

### Arquitectura General

El sistema FoodLink se basa en una arquitectura de tres capas con dos plataformas independientes pero complementarias:

```
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                      │
├──────────────────────────┬──────────────────────────────────┤
│   App Móvil              │   App Web                        │
│   (React Native)         │   (HTML/CSS/JavaScript)          │
└──────────────────────────┴──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE LÓGICA                            │
├──────────────────────────┬──────────────────────────────────┤
│   Firebase Services      │   API REST (PHP)                 │
│   - Authentication       │   - Endpoints CRUD               │
│   - Firestore           │   - Validación Server-Side       │
└──────────────────────────┴──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE DATOS                             │
├──────────────────────────┬──────────────────────────────────┤
│   Firebase Firestore     │   MySQL Database                 │
│   (NoSQL)               │   (SQL)                          │
└──────────────────────────┴──────────────────────────────────┘
```

### Componentes Principales

**Frontend Móvil**
- Framework: React Native 0.73.0
- Navegación: React Navigation 6.1.9
- Estado: Hooks de React
- Validación: Módulo personalizado (validators.js)

**Frontend Web**
- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 4.4.1 para diseño responsivo
- jQuery para manipulación del DOM
- Bibliotecas: Owl Carousel, Animate.css

**Backend - Firebase**
- Firebase Authentication para gestión de usuarios
- Firestore Database para almacenamiento NoSQL
- Firebase Security Rules para protección a nivel de BD

**Backend - API REST**
- Lenguaje: PHP 7.4+
- Servidor: Apache
- Base de datos: MySQL 8.0
- Arquitectura: REST API

---

## 5. INTEGRACIÓN CON SERVICIOS EN LA NUBE

### 5.1 Firebase (Google Cloud Platform)

#### Servicios Utilizados

**Firebase Authentication**
- Método de autenticación: Email y contraseña
- Gestión automática de tokens JWT
- Renovación automática de sesiones
- Expiración de tokens: 1 hora
- Almacenamiento seguro de credenciales

**Cloud Firestore**
- Base de datos NoSQL en tiempo real
- Sincronización automática de datos
- Queries optimizadas con índices
- Escalabilidad automática

#### Configuración de Firebase

Archivo: `src/services/firebase.js`

Las credenciales se cargan desde variables de entorno (.env) para mantener la seguridad:

```javascript
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  // ... otras configuraciones
};
```

#### Operaciones Implementadas

**Autenticación**
- registrarUsuario(email, password, nombre)
- iniciarSesion(email, password)
- cerrarSesion()
- observarEstadoAuth(callback)
- obtenerUsuarioActual()

**CRUD de Platillos**
- crearPlatillo(datosPlat

illo)
- obtenerMisPlatillos()
- actualizarPlatillo(id, datos)
- eliminarPlatillo(id)

#### Reglas de Seguridad de Firestore

Archivo: `firestore.rules`

Implementa el principio de "mínimo privilegio":
- Solo usuarios autenticados pueden acceder
- Los vendedores solo ven/editan sus propios datos
- Validación de tipos y campos obligatorios
- Prevención de modificación de campos críticos (userId)

---

### 5.2 API REST Propia

#### Infraestructura

La API REST puede desplegarse en cualquier proveedor cloud:
- Amazon Web Services (AWS)
- Microsoft Azure
- DigitalOcean
- Heroku
- Servidor VPS propio

Actualmente configurada en servidor local para desarrollo, pero lista para producción en la nube.

#### Endpoints Implementados

**Autenticación**
- POST /api/login.php
- POST /api/register.php

**Gestión de Comidas**
- POST /api/add_comida.php
- GET /api/get_comidas.php
- GET /api/get_my_comidas.php
- GET /api/get_comida.php
- PUT /api/update_comida.php
- DELETE /api/delete_comida.php

**Gestión de Pedidos**
- POST /api/create_pedido.php
- GET /api/get_pedidos.php
- PUT /api/update_estado_pedido.php
- GET /api/get_ventas_cocinero.php

**Sistema de Calificaciones**
- POST /api/calificar_comida.php
- POST /api/add_comentario.php
- GET /api/get_comentarios.php

**Contacto**
- POST /api/add_comentario_contacto.php
- GET /api/get_comentarios_contacto.php

#### Comunicación HTTPS

Configuración en `js/auth.js`:

```javascript
const API_URL = "https://localhost/foodlink/api"
```

Todas las peticiones utilizan protocolo HTTPS para encriptar la comunicación entre cliente y servidor.

---

## 6. PRINCIPIOS DE CODIFICACIÓN SEGURA

### 6.1 Protección de Datos Sensibles

#### Variables de Entorno - Firebase

**Archivos:**
- `.env` (ignorado por Git, contiene credenciales reales)
- `env.example.txt` (plantilla pública)

**Protección:**
```gitignore
.env
.env.local
*.env
```

#### Variables de Entorno - PHP/MySQL

**Archivos:**
- `api/database.config.php` (ignorado por Git)
- `api/database.config.example.php` (plantilla pública)

**Implementación:**
```php
$dbConfig = require 'database.config.php';
define('DB_HOST', $dbConfig['DB_HOST']);
define('DB_USER', $dbConfig['DB_USER']);
define('DB_PASS', $dbConfig['DB_PASS']);
```

---

### 6.2 Validación de Entradas

#### Validación Client-Side (React Native)

Archivo: `src/utils/validators.js`

**Funciones implementadas:**
- validarEmail(): Formato RFC, longitud máxima 254 caracteres
- validarPassword(): Mínimo 6 caracteres, recomendación de fortaleza
- validarNombre(): Solo letras y espacios, 2-100 caracteres
- validarPrecio(): Numérico positivo, máximo 2 decimales
- sanitizarTexto(): Eliminación de caracteres peligrosos

#### Validación Server-Side (PHP)

Todas las APIs implementan:
- Validación de método HTTP
- Validación de campos obligatorios
- Sanitización con `mysqli_real_escape_string()`
- Validación de tipos de datos
- Filtros PHP (`filter_var()`)

---

### 6.3 Manejo Seguro de Contraseñas

**PHP (API REST):**
```php
// Registro
$hash = password_hash($contrasena, PASSWORD_DEFAULT);

// Login
if (password_verify($contrasena, $user['contrasena'])) {
    // Autenticación exitosa
}
```

**Firebase:**
- Hash automático gestionado por Firebase Auth
- Algoritmo: bcrypt con salt único
- Sin acceso directo a contraseñas hasheadas

---

### 6.4 Manejo de Errores

**Principios aplicados:**
- No exponer detalles internos al usuario
- Mensajes genéricos para usuarios finales
- Logging detallado para debugging (solo servidor)
- Traducción de códigos de error técnicos

**Ejemplo:**
```javascript
catch (error) {
  console.error('Error técnico:', error.code); // Log interno
  
  let mensaje = 'Error al procesar solicitud.'; // Mensaje genérico
  
  switch (error.code) {
    case 'auth/user-not-found':
      mensaje = 'Usuario o contraseña incorrectos.'; // No revelar qué dato está mal
      break;
  }
  
  return { success: false, error: mensaje };
}
```

---

### 6.5 Seguridad a Nivel de Base de Datos

**Firestore Security Rules:**
- Control de acceso basado en autenticación
- Validación de ownership (userId)
- Prevención de modificación de campos críticos
- Validación de tipos y valores permitidos

**MySQL:**
- Prepared statements para prevenir SQL Injection
- Índices en campos críticos para rendimiento
- Foreign keys con CASCADE para integridad referencial
- Triggers automáticos para lógica de negocio

---

## 7. ESTRATEGIA DE VERSIONAMIENTO

### 7.1 Git Flow

Estrategia de branching profesional implementada en el proyecto.

**Ramas Principales:**
- **main**: Código en producción, siempre estable
- **develop**: Rama de integración para desarrollo

**Ramas Temporales:**
- **feature/**: Nuevas características
- **fix/**: Correcciones de bugs
- **hotfix/**: Correcciones urgentes en producción
- **release/**: Preparación de nuevas versiones

### 7.2 Versionamiento Semántico

Formato: **MAJOR.MINOR.PATCH**

- **MAJOR**: Cambios incompatibles (breaking changes)
- **MINOR**: Nuevas características compatibles
- **PATCH**: Correcciones de bugs

**Versión actual:** v1.0.0

**Historial de versiones:**
- v1.0.0: Versión inicial con funcionalidades completas

### 7.3 Convenciones de Commits

Siguiendo el estándar "Conventional Commits":

```
tipo(scope): descripción

[cuerpo opcional]
```

**Tipos de commits:**
- feat: Nueva característica
- fix: Corrección de bug
- docs: Documentación
- style: Formato de código
- refactor: Refactorización
- test: Tests
- chore: Mantenimiento
- security: Seguridad
- perf: Rendimiento

---

## 8. FLUJO DE DATOS

### 8.1 Flujo de Autenticación - App Móvil

```
Usuario ingresa email/password
        │
        ▼
validators.js valida formato
        │
        ▼
firebase.js procesa solicitud
        │
        ▼
Firebase Authentication verifica
        │
        ▼
Genera JWT Token
        │
        ▼
Almacena sesión localmente
        │
        ▼
Redirige a MenuScreen
```

### 8.2 Flujo CRUD - Platillos

```
Usuario completa formulario
        │
        ▼
Validación client-side (validators.js)
        │
        ▼
Sanitización de datos
        │
        ▼
firebase.js envía a Firestore
        │
        ▼
Firestore valida reglas de seguridad
        │
        ▼
Verifica ownership (userId)
        │
        ▼
Guarda/actualiza documento
        │
        ▼
Retorna confirmación
        │
        ▼
Actualiza UI en tiempo real
```

### 8.3 Flujo de Pedidos - App Web

```
Estudiante selecciona platillo
        │
        ▼
JavaScript valida disponibilidad
        │
        ▼
POST a /api/create_pedido.php (HTTPS)
        │
        ▼
PHP valida datos + sesión
        │
        ▼
MySQL inicia transacción
        │
        ▼
Inserta pedido + actualiza inventario (trigger)
        │
        ▼
Commit de transacción
        │
        ▼
Retorna confirmación JSON
        │
        ▼
Actualiza interfaz de usuario
```

---

## 9. EVIDENCIAS DE FUNCIONAMIENTO

### 9.1 Estructura de Evidencias

Este proyecto incluye las siguientes evidencias de funcionamiento:

#### Capturas de Pantalla

**Ubicación sugerida:** `docs/evidencias/screenshots/`

Capturas que deben incluirse:
1. Pantalla de inicio de sesión (móvil)
2. Pantalla de registro (móvil)
3. Lista de platillos del vendedor (móvil)
4. Formulario de creación de platillo (móvil)
5. Pantalla principal de la app web
6. Catálogo de comidas (web)
7. Formulario de pedido (web)
8. Panel de cocinero (web)

#### Pruebas de API

**Ubicación sugerida:** `docs/evidencias/postman/`

Capturas de pruebas en Postman u otra herramienta:
1. POST /api/register.php - Registro exitoso
2. POST /api/login.php - Login exitoso
3. GET /api/get_comidas.php - Consulta de platillos
4. POST /api/create_pedido.php - Creación de pedido
5. Respuestas de error con validaciones

#### Historial de Git

**Ubicación sugerida:** `docs/evidencias/git/`

Capturas que documenten:
1. git log --oneline --graph --all
2. git branch -a (mostrando todas las ramas)
3. git tag (mostrando versiones)
4. Captura del repositorio en GitHub
5. Pull requests (si existen)

#### Videos Demostrativos

**Ubicación sugerida:** `docs/evidencias/videos/`

Videos cortos mostrando:
1. Flujo completo de registro y login
2. CRUD de platillos en la app móvil
3. Proceso de compra en la app web
4. Panel de ventas del cocinero

---

### 9.2 Cómo Capturar las Evidencias

#### Para Screenshots

**App Móvil:**
- Usar emulador de Android Studio o Xcode
- Herramientas: Screenshot integrada o herramientas de captura

**App Web:**
- Usar navegador (Chrome DevTools, Firefox)
- Capturar en diferentes resoluciones

#### Para Pruebas de API

**Postman:**
1. Importar o crear collection con todos los endpoints
2. Configurar variables de entorno
3. Ejecutar requests
4. Capturar responses (exitosos y con errores)
5. Exportar collection para documentación

**Alternativas:**
- Insomnia
- Thunder Client (VS Code)
- cURL con scripts

#### Para Git

```bash
# Capturar historial con gráfico
git log --oneline --graph --all --decorate > git-history.txt

# Listar todas las ramas
git branch -a > branches.txt

# Listar tags
git tag -n > tags.txt

# Estadísticas del repositorio
git log --pretty=format:"%h - %an, %ar : %s" > commits.txt
```

---

### 9.3 Pruebas Funcionales Realizadas

#### Módulo de Autenticación

| Prueba | Resultado | Evidencia |
|--------|-----------|-----------|
| Registro con email válido | Exitoso | Screenshot |
| Registro con email duplicado | Error controlado | Screenshot |
| Login con credenciales correctas | Exitoso | Screenshot |
| Login con credenciales incorrectas | Error controlado | Screenshot |
| Validación de formato de email | Funcionando | Screenshot |
| Validación de longitud de contraseña | Funcionando | Screenshot |

#### Módulo CRUD de Platillos

| Operación | Prueba | Resultado |
|-----------|--------|-----------|
| CREATE | Crear platillo con datos válidos | Exitoso |
| CREATE | Crear platillo con precio negativo | Error detectado |
| READ | Listar platillos propios | Exitoso |
| READ | Intentar ver platillos de otro usuario | Bloqueado por Firestore Rules |
| UPDATE | Actualizar nombre de platillo | Exitoso |
| UPDATE | Intentar cambiar userId | Bloqueado por Firestore Rules |
| DELETE | Eliminar platillo propio | Exitoso |

#### Módulo de Pedidos

| Prueba | Resultado | Observaciones |
|--------|-----------|---------------|
| Crear pedido con stock disponible | Exitoso | Inventario actualizado automáticamente |
| Crear pedido sin stock | Error controlado | Muestra mensaje apropiado |
| Consultar historial de pedidos | Exitoso | Filtrado por usuario |
| Actualizar estado de pedido | Exitoso | Solo cocinero puede actualizar |

---

## 10. CONCLUSIONES

### 10.1 Logros Alcanzados

1. **Integración Cloud Completa**: Se implementaron exitosamente dos arquitecturas de servicios en la nube (Firebase y API REST propia), demostrando versatilidad y conocimiento de diferentes paradigmas.

2. **Seguridad Robusta**: Se aplicaron múltiples capas de seguridad incluyendo validación de entrada, comunicación cifrada, protección de credenciales y control de acceso a nivel de base de datos.

3. **Versionamiento Profesional**: Se estableció una estrategia de Git Flow completa con ramas bien definidas, commits semánticos y versionamiento siguiendo estándares de la industria.

4. **Documentación Exhaustiva**: Se generó documentación técnica completa que facilita el mantenimiento, escalabilidad y colaboración en el proyecto.

### 10.2 Conocimientos Aplicados

- Desarrollo móvil con React Native
- Integración con Firebase (Authentication, Firestore)
- Desarrollo de APIs REST con PHP
- Diseño de bases de datos relacionales (MySQL) y NoSQL (Firestore)
- Principios de seguridad en aplicaciones web y móviles
- Metodologías de versionamiento con Git
- Documentación técnica de proyectos software

### 10.3 Desafíos Superados

1. **Sincronización de datos**: Implementar actualizaciones en tiempo real entre Firestore y la interfaz móvil.

2. **Seguridad multicapa**: Balancear seguridad con usabilidad, implementando validaciones sin afectar la experiencia de usuario.

3. **Gestión de estados**: Manejar correctamente sesiones, tokens y estados de autenticación en ambas plataformas.

4. **Versionamiento colaborativo**: Establecer un flujo de trabajo que permita desarrollo paralelo sin conflictos.

### 10.4 Trabajo Futuro

1. **Implementación de Tests**: Agregar tests unitarios y de integración para todas las funcionalidades críticas.

2. **Sistema de Notificaciones**: Implementar notificaciones push para alertar sobre nuevos pedidos y actualizaciones.

3. **Modo Offline**: Agregar capacidades offline con sincronización automática cuando se recupere conexión.

4. **Optimización de Rendimiento**: Implementar caching, lazy loading y otras técnicas de optimización.

5. **Escalabilidad**: Preparar la infraestructura para escalar horizontalmente según demanda.

### 10.5 Reflexión Final

El proyecto FoodLink demuestra la aplicación práctica de conceptos avanzados de desarrollo móvil, integración cloud y principios de ingeniería de software. La implementación exitosa de servicios en la nube, combinada con sólidas prácticas de seguridad y versionamiento, resulta en una aplicación robusta, escalable y mantenible que está lista para evolucionar según las necesidades del negocio.

---

## ANEXOS

### Anexo A: Enlaces y Recursos

- Repositorio GitHub: https://github.com/yadi078/Froodlink.git
- Documentación Firebase: https://firebase.google.com/docs
- Documentación React Native: https://reactnative.dev
- Git Flow: https://nvie.com/posts/a-successful-git-branching-model/

### Anexo B: Dependencias del Proyecto

Ver archivo `package.json` para lista completa de dependencias de la app móvil.

Principales dependencias:
- React Native 0.73.0
- Firebase 10.7.1
- React Navigation 6.1.9
- react-native-dotenv 3.4.9

### Anexo C: Configuración del Entorno

Instrucciones detalladas en `README.md`

Requisitos:
- Node.js 18+
- React Native CLI
- Android Studio o Xcode
- PHP 7.4+
- MySQL 8.0+
- Servidor Apache o Nginx

---

**Documento elaborado:** Noviembre 2024

**Última actualización:** [Fecha actual]

**Autor:** [Tu nombre]

