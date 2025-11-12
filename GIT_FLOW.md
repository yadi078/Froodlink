# 🌿 Estrategia de Versionamiento - Git Flow

## 📋 Estrategia Implementada: Git Flow

Este proyecto utiliza **Git Flow** como estrategia de versionamiento, una metodología profesional para gestionar el desarrollo de software con múltiples colaboradores.

---

## 🌳 Estructura de Ramas

### Ramas Principales (Permanentes)

#### 1. **`main`** (Producción)
- Contiene código estable y listo para producción
- Solo se fusiona código probado y aprobado
- Cada commit representa una versión liberada
- Protegida contra commits directos

#### 2. **`develop`** (Desarrollo)
- Rama de integración principal
- Contiene las últimas características completadas
- Base para crear nuevas features
- Se fusiona a `main` para crear releases

---

### Ramas Temporales (Se eliminan después de fusionar)

#### 3. **`feature/*`** (Nuevas Características)
- Se crean desde: `develop`
- Se fusionan a: `develop`
- Nomenclatura: `feature/nombre-de-la-caracteristica`
- Ejemplos:
  - `feature/autenticacion-firebase`
  - `feature/crud-platillos`
  - `feature/sistema-pedidos`

#### 4. **`fix/*`** o **`bugfix/*`** (Corrección de Errores)
- Se crean desde: `develop` (para bugs en desarrollo)
- Se fusionan a: `develop`
- Nomenclatura: `fix/descripcion-del-bug`
- Ejemplos:
  - `fix/validacion-precio`
  - `fix/error-login`

#### 5. **`hotfix/*`** (Correcciones Urgentes en Producción)
- Se crean desde: `main`
- Se fusionan a: `main` Y `develop`
- Nomenclatura: `hotfix/descripcion-urgente`
- Para bugs críticos en producción

#### 6. **`release/*`** (Preparación de Versión)
- Se crean desde: `develop`
- Se fusionan a: `main` Y `develop`
- Nomenclatura: `release/v1.1.0`
- Para preparar una nueva versión

---

## 🚀 Comandos Git Flow

### Inicializar el Repositorio

```bash
# Clonar el repositorio
git clone https://github.com/yadi078/Froodlink.git
cd Froodlink

# Ver todas las ramas
git branch -a
```

---

### Trabajar con Features

#### Crear una nueva feature
```bash
# Cambiar a develop
git checkout develop

# Crear y cambiar a la nueva feature
git checkout -b feature/nombre-caracteristica

# Ejemplo real:
git checkout -b feature/sistema-comentarios
```

#### Trabajar en la feature
```bash
# Hacer cambios en el código
# ...

# Agregar archivos modificados
git add .

# Commit con mensaje descriptivo
git commit -m "feat: agregar sistema de comentarios para platillos"

# Subir la feature al repositorio remoto
git push origin feature/sistema-comentarios
```

#### Finalizar la feature (fusionar a develop)
```bash
# Cambiar a develop
git checkout develop

# Fusionar la feature
git merge feature/sistema-comentarios

# Subir develop actualizado
git push origin develop

# Eliminar la rama local (opcional)
git branch -d feature/sistema-comentarios

# Eliminar la rama remota (opcional)
git push origin --delete feature/sistema-comentarios
```

---

### Trabajar con Fixes

#### Crear un fix
```bash
# Desde develop
git checkout develop

# Crear rama de fix
git checkout -b fix/error-validacion-precio

# Hacer correcciones
# ...

# Commit
git commit -m "fix: corregir validación de precio negativo"

# Subir
git push origin fix/error-validacion-precio
```

#### Finalizar el fix
```bash
# Cambiar a develop
git checkout develop

# Fusionar el fix
git merge fix/error-validacion-precio

# Subir
git push origin develop

# Eliminar la rama
git branch -d fix/error-validacion-precio
```

---

### Crear una Release

```bash
# Desde develop (cuando esté listo para nueva versión)
git checkout develop

# Crear rama de release
git checkout -b release/v1.1.0

# Hacer ajustes finales (actualizar versión en package.json, etc.)
# ...

# Commit
git commit -m "chore: preparar release v1.1.0"

# Fusionar a main
git checkout main
git merge release/v1.1.0

# Crear tag de versión
git tag -a v1.1.0 -m "Versión 1.1.0 - Sistema de comentarios"
git push origin v1.1.0

# Fusionar también a develop
git checkout develop
git merge release/v1.1.0

# Subir ambas ramas
git push origin main
git push origin develop

# Eliminar rama de release
git branch -d release/v1.1.0
```

---

### Hotfix (Corrección Urgente en Producción)

```bash
# Desde main
git checkout main

# Crear hotfix
git checkout -b hotfix/error-critico-login

# Hacer corrección urgente
# ...

# Commit
git commit -m "hotfix: corregir error crítico en login"

# Fusionar a main
git checkout main
git merge hotfix/error-critico-login

# Crear tag
git tag -a v1.0.1 -m "Hotfix: Error crítico en login"
git push origin v1.0.1

# Fusionar también a develop
git checkout develop
git merge hotfix/error-critico-login

# Subir todo
git push origin main
git push origin develop

# Eliminar hotfix
git branch -d hotfix/error-critico-login
```

---

## 📝 Convenciones de Commits

Seguimos **Conventional Commits** para mensajes claros y descriptivos:

### Formato
```
tipo(scope): descripción corta

[cuerpo opcional]

[footer opcional]
```

### Tipos de Commits

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat` | Nueva característica | `feat: agregar autenticación con Firebase` |
| `fix` | Corrección de bug | `fix: corregir validación de email` |
| `docs` | Documentación | `docs: actualizar README con instrucciones` |
| `style` | Formato (no afecta lógica) | `style: formatear código con Prettier` |
| `refactor` | Refactorización | `refactor: simplificar función de validación` |
| `test` | Tests | `test: agregar tests unitarios para validators` |
| `chore` | Tareas de mantenimiento | `chore: actualizar dependencias` |
| `perf` | Mejora de rendimiento | `perf: optimizar consultas de Firestore` |
| `security` | Seguridad | `security: proteger credenciales en .env` |

### Ejemplos Reales

```bash
# Nueva característica
git commit -m "feat: implementar CRUD de platillos en Firebase"

# Corrección de bug
git commit -m "fix: resolver error de precio negativo en validación"

# Seguridad
git commit -m "security: mover credenciales de MySQL a archivo de configuración"

# Documentación
git commit -m "docs: agregar diagrama de arquitectura al README"

# Refactorización
git commit -m "refactor: separar lógica de validación en módulo independiente"
```

---

## 🏷️ Versionamiento Semántico (SemVer)

Usamos **Semantic Versioning**: `MAJOR.MINOR.PATCH`

### Formato: `vX.Y.Z`

- **MAJOR (X)**: Cambios incompatibles con versiones anteriores
  - Ejemplo: `v1.0.0` → `v2.0.0`
  
- **MINOR (Y)**: Nuevas características compatibles
  - Ejemplo: `v1.0.0` → `v1.1.0`
  
- **PATCH (Z)**: Correcciones de bugs
  - Ejemplo: `v1.0.0` → `v1.0.1`

### Ejemplos

```bash
# Primera versión estable
v1.0.0

# Agregar sistema de comentarios (feature)
v1.1.0

# Agregar sistema de calificaciones (feature)
v1.2.0

# Corregir bug en validación (patch)
v1.2.1

# Cambio mayor: Nueva arquitectura (breaking change)
v2.0.0
```

---

## 📊 Flujo de Trabajo Completo

```
main ─────●────────────────────●────────────→ (v1.0.0)     (v1.1.0)
           │                    │
           │                    │
develop ───●──┬───┬───┬────────●─────────────→
              │   │   │        │
              │   │   │        │
feature/A ────●───●   │        │
                      │        │
feature/B ────────────●────●   │
                            │  │
fix/bug ────────────────────●──●
```

### Paso a paso:

1. **Crear feature** desde `develop`
2. **Trabajar** en la feature (commits)
3. **Fusionar** feature a `develop`
4. **Crear release** desde `develop`
5. **Fusionar** release a `main` (producción)
6. **Crear tag** de versión
7. **Fusionar** release de vuelta a `develop`

---

## 🛠️ Comandos Útiles

### Ver el estado de las ramas
```bash
# Ramas locales
git branch

# Todas las ramas (locales y remotas)
git branch -a

# Ramas remotas
git branch -r
```

### Sincronizar con el repositorio remoto
```bash
# Descargar cambios sin fusionar
git fetch origin

# Descargar y fusionar
git pull origin develop

# Subir rama al remoto
git push origin nombre-rama
```

### Ver historial
```bash
# Historial completo
git log --oneline --graph --all

# Últimos 10 commits
git log --oneline -10

# Ver tags
git tag
```

### Limpiar ramas eliminadas
```bash
# Eliminar referencias a ramas remotas eliminadas
git fetch --prune

# Ver ramas ya fusionadas
git branch --merged
```

---

## 🎯 Reglas del Proyecto

### ✅ Permitido
- Commits directos a ramas `feature/*`, `fix/*`, `hotfix/*`
- Pull requests para fusionar features a `develop`
- Fusionar `develop` a `main` solo para releases

### ❌ NO Permitido
- Commits directos a `main` (solo mediante fusión)
- Commits directos a `develop` (preferir features)
- Subir credenciales o archivos sensibles
- Push force a ramas compartidas
- Eliminar ramas principales (`main`, `develop`)

---

## 📚 Referencias

- [Git Flow Original](https://nvie.com/posts/a-successful-git-branching-model/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

## 👥 Colaboración

### Para nuevos colaboradores:

1. Clonar el repositorio
2. Crear rama desde `develop`
3. Trabajar en la feature
4. Hacer commits descriptivos
5. Push de la rama
6. Crear Pull Request a `develop`
7. Esperar revisión y aprobación

---

**Última actualización:** Noviembre 2024  
**Versión actual del proyecto:** v1.0.0  
**Repositorio:** https://github.com/yadi078/Froodlink.git

