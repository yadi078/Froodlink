# Guía de Evidencias - Proyecto FoodLink

## Propósito del Documento

Este documento describe qué evidencias deben capturarse para documentar el correcto funcionamiento del sistema FoodLink, cumpliendo con los requisitos académicos del proyecto.

---

## 1. Pruebas de Conexión con la API

### Herramientas Recomendadas
- Postman (recomendado)
- Insomnia
- Thunder Client (extensión de VS Code)
- cURL desde terminal

### Endpoints a Probar

#### Autenticación

**Registro de Usuario**
```
POST https://localhost/foodlink/api/register.php

Body (JSON):
{
  "nombre": "Juan Pérez",
  "tipo": "estudiante",
  "correo": "juan@email.com",
  "telefono": "3121234567",
  "edad": 20,
  "contrasena": "password123"
}

Captura esperada:
- Request completo con headers y body
- Response exitoso (status 200, success: true)
```

**Login**
```
POST https://localhost/foodlink/api/login.php

Body (JSON):
{
  "correo": "juan@email.com",
  "contrasena": "password123"
}

Captura esperada:
- Response con datos del usuario (sin contraseña)
- Token o sesión generada
```

#### CRUD de Comidas

**Listar Comidas**
```
GET https://localhost/foodlink/api/get_comidas.php

Captura esperada:
- Array de comidas con todos sus campos
- Status 200
```

**Crear Comida**
```
POST https://localhost/foodlink/api/add_comida.php

Body:
{
  "nombre_comida": "Tacos al Pastor",
  "foto": "tacos.jpg",
  "precio": 45.50,
  "cantidad": 20,
  "id_cocinero": 1,
  "descripcion": "Deliciosos tacos"
}

Captura esperada:
- Confirmación de creación exitosa
```

**Actualizar Comida**
```
PUT https://localhost/foodlink/api/update_comida.php

Captura esperada:
- Confirmación de actualización
```

**Eliminar Comida**
```
DELETE https://localhost/foodlink/api/delete_comida.php?id_comida=1

Captura esperada:
- Confirmación de eliminación
```

#### Pedidos

**Crear Pedido**
```
POST https://localhost/foodlink/api/create_pedido.php

Body:
{
  "usuario_id": 1,
  "comida_id": 1,
  "cantidad": 2
}

Captura esperada:
- Confirmación de pedido
- Actualización automática de inventario
```

**Consultar Pedidos**
```
GET https://localhost/foodlink/api/get_pedidos.php?usuario_id=1

Captura esperada:
- Lista de pedidos del usuario
```

### Casos de Error a Documentar

1. **Campos faltantes**: Intentar registrar sin email
2. **Email inválido**: Usar formato incorrecto
3. **Email duplicado**: Registrar mismo correo dos veces
4. **Credenciales incorrectas**: Login con password erróneo
5. **Precio negativo**: Intentar crear comida con precio -10
6. **Stock insuficiente**: Pedido con cantidad mayor al inventario

---

## 2. Git Log - Historial de Commits

### Comandos para Capturar

#### Historial con Gráfico
```bash
git log --oneline --graph --all --decorate
```

**Captura debe mostrar:**
- Ramas main, develop, y features
- Commits con mensajes descriptivos
- Tags de versiones (v1.0.0, etc.)
- Fusiones entre ramas

#### Listar Todas las Ramas
```bash
git branch -a
```

**Captura debe mostrar:**
- Rama main
- Rama develop
- Ramas feature/*
- Ramas fix/*
- Ramas remotas (origin/*)

#### Listar Tags
```bash
git tag -l -n
```

**Captura debe mostrar:**
- v1.0.0 con descripción
- Otras versiones si existen

#### Estadísticas del Repositorio
```bash
git log --stat --oneline -10
```

**Captura debe mostrar:**
- Últimos 10 commits
- Archivos modificados por commit
- Líneas agregadas/eliminadas

#### Ver Commits por Autor
```bash
git log --author="Tu Nombre" --oneline
```

---

## 3. Pantallas de Funcionamiento

### Aplicación Móvil (React Native)

#### Flujo de Autenticación

**1. Pantalla de Login**
- Formulario con campos de email y contraseña
- Botones de "Iniciar Sesión" y "Registrarse"
- Validaciones visibles

**2. Pantalla de Registro**
- Formulario completo (nombre, email, contraseña, confirmar contraseña)
- Indicadores de validación en tiempo real
- Botón de registro

**3. Validaciones**
- Mensaje de error cuando email es inválido
- Mensaje cuando contraseñas no coinciden
- Mensaje de éxito al registrarse

#### Flujo de Gestión de Menú

**4. Lista de Platillos**
- Pantalla principal con lista de platillos del vendedor
- Cada platillo mostrando: nombre, precio, disponibilidad
- Botones de editar y eliminar
- Botón flotante para agregar nuevo platillo

**5. Crear Platillo**
- Modal o pantalla con formulario
- Campos: nombre, descripción, precio, categoría
- Validaciones activas
- Botón de guardar

**6. Editar Platillo**
- Formulario prellenado con datos actuales
- Posibilidad de cambiar disponibilidad
- Botón de actualizar

**7. Confirmación de Eliminación**
- Diálogo de confirmación
- Mensaje de éxito al eliminar

### Aplicación Web

#### Pantallas Públicas

**1. Página de Inicio**
- Hero section con llamados a la acción
- Secciones informativas
- Navegación funcional

**2. Catálogo de Menú**
- Grid de platillos disponibles
- Información de cada platillo
- Precios y disponibilidad
- Botón para ordenar (requiere login)

**3. Página de Contacto**
- Formulario de contacto
- Validaciones
- Confirmación de envío

#### Pantallas de Usuario Autenticado

**4. Panel de Estudiante**
- Mis pedidos
- Historial
- Estados de pedidos (pendiente, preparando, listo, entregado)

**5. Panel de Cocinero**
- Mis comidas publicadas
- Formulario para agregar comida
- Gestión de inventario
- Pedidos recibidos
- Panel de ventas

**6. Proceso de Pedido**
- Selección de platillo
- Cantidad
- Confirmación
- Mensaje de éxito

#### Elementos de Seguridad

**7. Navegación Dinámica**
- Menú cambia según estado de autenticación
- Botones específicos por tipo de usuario (estudiante/cocinero)

---

## 4. Organización de Archivos de Evidencias

### Estructura Recomendada

```
docs/
├── evidencias/
│   ├── api/
│   │   ├── 01_registro_exitoso.png
│   │   ├── 02_login_exitoso.png
│   │   ├── 03_crear_comida.png
│   │   ├── 04_consultar_comidas.png
│   │   ├── 05_crear_pedido.png
│   │   ├── 06_error_email_duplicado.png
│   │   ├── 07_error_precio_negativo.png
│   │   └── postman_collection.json
│   │
│   ├── git/
│   │   ├── 01_git_log_graph.png
│   │   ├── 02_git_branches.png
│   │   ├── 03_git_tags.png
│   │   ├── 04_github_repository.png
│   │   └── historial_commits.txt
│   │
│   ├── screenshots/
│   │   ├── movil/
│   │   │   ├── 01_login.png
│   │   │   ├── 02_registro.png
│   │   │   ├── 03_validacion_error.png
│   │   │   ├── 04_lista_platillos.png
│   │   │   ├── 05_crear_platillo.png
│   │   │   ├── 06_editar_platillo.png
│   │   │   └── 07_confirmacion_eliminar.png
│   │   │
│   │   └── web/
│   │       ├── 01_inicio.png
│   │       ├── 02_catalogo_menu.png
│   │       ├── 03_detalle_platillo.png
│   │       ├── 04_panel_estudiante.png
│   │       ├── 05_panel_cocinero.png
│   │       ├── 06_crear_pedido.png
│   │       ├── 07_historial_pedidos.png
│   │       └── 08_ventas_cocinero.png
│   │
│   └── videos/
│       ├── 01_flujo_registro_login.mp4
│       ├── 02_crud_platillos.mp4
│       └── 03_proceso_compra.mp4
```

---

## 5. Checklist de Evidencias

### Integración con la Nube

- [ ] Captura de configuración de Firebase en console
- [ ] Prueba de autenticación en Postman
- [ ] Consulta exitosa a Firestore
- [ ] Prueba de CRUD en API REST
- [ ] Diagrama de arquitectura (ver DOCUMENTACION_PROYECTO.md)

### Principios de Codificación Segura

- [ ] Archivo .gitignore mostrando protección de .env
- [ ] Código de validators.js con validaciones
- [ ] Firestore rules implementadas
- [ ] Ejemplo de password hashing en PHP
- [ ] HTTPS configurado en API (auth.js)
- [ ] Prueba de validación rechazando entrada inválida

### Estrategias de Versionamiento

- [ ] git log --graph mostrando ramas
- [ ] git branch -a mostrando todas las ramas
- [ ] git tag mostrando versiones semánticas
- [ ] Captura del repositorio en GitHub
- [ ] Commits siguiendo Conventional Commits
- [ ] GIT_FLOW.md y GIT_FLOW_COMMANDS.md creados

### Funcionamiento del Sistema

- [ ] Todas las pantallas de app móvil capturadas
- [ ] Todas las pantallas de app web capturadas
- [ ] Video demostrativo de flujo completo
- [ ] Pruebas de casos de error

### Documentación

- [ ] README.md completo
- [ ] DOCUMENTACION_PROYECTO.md con portada e introducción
- [ ] GIT_FLOW.md
- [ ] GIT_FLOW_COMMANDS.md
- [ ] EVIDENCIAS.md (este archivo)
- [ ] env.example.txt
- [ ] api/database.config.example.php

---

## 6. Herramientas para Captura

### Screenshots

**Windows:**
- Win + Shift + S (Snipping Tool)
- ShareX (gratuito, con funciones avanzadas)

**Mac:**
- Cmd + Shift + 4
- Cmd + Shift + 5 (con opciones)

**Linux:**
- Flameshot (recomendado)
- GNOME Screenshot

### Videos

**Grabación de Pantalla:**
- OBS Studio (multiplataforma, gratuito)
- ShareX (Windows)
- QuickTime (Mac)
- SimpleScreenRecorder (Linux)

**Edición:**
- DaVinci Resolve (gratuito)
- Shotcut (gratuito)

### API Testing

- Postman (recomendado)
- Insomnia
- Thunder Client (VS Code)

---

## 7. Consejos para Buenas Evidencias

### Screenshots

1. **Resolución adecuada**: Mínimo 1280x720
2. **Legibilidad**: Texto claro y legible
3. **Contexto**: Incluir barras de navegación o títulos
4. **Sin información sensible**: No mostrar contraseñas reales

### Videos

1. **Duración**: Entre 2-5 minutos por funcionalidad
2. **Audio** (opcional): Narración explicando qué se hace
3. **Velocidad**: Normal, no acelerado
4. **Calidad**: Mínimo 720p

### Postman

1. **Organización**: Usar colecciones por módulo
2. **Variables**: Usar variables de entorno
3. **Documentación**: Agregar descripción a cada request
4. **Exportar**: Guardar collection como JSON

---

## 8. Presentación Final

### Documento de Entrega

Crear un documento (PDF) que incluya:

1. **Portada**
   - Título del proyecto
   - Nombre del estudiante
   - Materia y periodo
   - Fecha

2. **Introducción**
   - Contexto del proyecto
   - Objetivos
   - Alcance

3. **Arquitectura**
   - Diagrama
   - Descripción de componentes
   - Flujo de datos

4. **Evidencias de Integración Cloud**
   - Screenshots de Firebase Console
   - Pruebas en Postman
   - Código relevante

5. **Evidencias de Seguridad**
   - Validaciones implementadas
   - Protección de credenciales
   - Firestore rules

6. **Evidencias de Versionamiento**
   - Git log con gráfico
   - Branches y tags
   - Captura de GitHub

7. **Evidencias de Funcionamiento**
   - Screenshots de todas las pantallas
   - Flujos completos
   - Enlaces a videos

8. **Conclusiones**
   - Logros
   - Aprendizajes
   - Trabajo futuro

---

**Nota:** Este documento es una guía. Ajusta según los requisitos específicos de tu institución o profesor.

Última actualización: Noviembre 2024

