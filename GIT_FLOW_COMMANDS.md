# Comandos de Git Flow - FoodLink

## Tabla de Contenidos
1. [Configuración Inicial](#configuración-inicial)
2. [Trabajar con Features](#trabajar-con-features)
3. [Trabajar con Fixes](#trabajar-con-fixes)
4. [Crear Releases](#crear-releases)
5. [Hotfixes de Emergencia](#hotfixes-de-emergencia)
6. [Comandos Útiles](#comandos-útiles)

---

## Configuración Inicial

### Clonar el repositorio
```bash
git clone https://github.com/yadi078/Froodlink.git
cd Froodlink
```

### Ver todas las ramas disponibles
```bash
git branch -a
```

### Verificar en qué rama estás
```bash
git branch
```

---

## Trabajar con Features

### Crear una nueva feature

Siempre crear features desde la rama develop:

```bash
# Cambiar a develop
git checkout develop

# Actualizar develop con los últimos cambios
git pull origin develop

# Crear nueva feature
git checkout -b feature/nombre-descriptivo
```

Ejemplos de nombres de features:
- `feature/sistema-notificaciones`
- `feature/perfil-usuario`
- `feature/busqueda-avanzada`

### Trabajar en la feature

```bash
# Hacer cambios en los archivos
# ...

# Ver qué archivos se modificaron
git status

# Agregar archivos al staging
git add archivo1.js archivo2.php
# O agregar todos los cambios
git add .

# Hacer commit con mensaje descriptivo
git commit -m "feat: agregar sistema de notificaciones push"

# Subir la feature al repositorio remoto
git push origin feature/nombre-descriptivo
```

### Finalizar la feature

```bash
# Cambiar a develop
git checkout develop

# Actualizar develop
git pull origin develop

# Fusionar la feature completada
git merge feature/nombre-descriptivo

# Subir develop actualizado
git push origin develop

# (Opcional) Eliminar la rama local
git branch -d feature/nombre-descriptivo

# (Opcional) Eliminar la rama remota
git push origin --delete feature/nombre-descriptivo
```

---

## Trabajar con Fixes

### Crear un fix

```bash
# Desde develop
git checkout develop
git pull origin develop

# Crear rama de fix
git checkout -b fix/descripcion-del-bug
```

Ejemplos de nombres de fixes:
- `fix/error-validacion-email`
- `fix/boton-login-no-responde`
- `fix/precio-negativo`

### Trabajar en el fix

```bash
# Hacer las correcciones necesarias
# ...

# Agregar y hacer commit
git add .
git commit -m "fix: corregir validación de email en formulario"

# Subir el fix
git push origin fix/descripcion-del-bug
```

### Finalizar el fix

```bash
# Cambiar a develop
git checkout develop

# Fusionar el fix
git merge fix/descripcion-del-bug

# Subir develop
git push origin develop

# Eliminar la rama
git branch -d fix/descripcion-del-bug
```

---

## Crear Releases

Una release se crea cuando develop está listo para una nueva versión en producción.

### Crear rama de release

```bash
# Desde develop
git checkout develop
git pull origin develop

# Crear rama de release con el número de versión
git checkout -b release/v1.1.0
```

### Preparar la release

```bash
# Actualizar número de versión en package.json
# Hacer ajustes finales, correcciones menores
# Actualizar CHANGELOG.md si existe

# Hacer commit
git commit -m "chore: preparar release v1.1.0"
```

### Finalizar la release

```bash
# Fusionar a main (producción)
git checkout main
git pull origin main
git merge release/v1.1.0

# Crear tag de versión
git tag -a v1.1.0 -m "Versión 1.1.0 - Descripción de cambios principales"

# Subir main con el tag
git push origin main
git push origin v1.1.0

# Fusionar también a develop
git checkout develop
git merge release/v1.1.0
git push origin develop

# Eliminar rama de release
git branch -d release/v1.1.0
```

---

## Hotfixes de Emergencia

Los hotfixes se usan para corregir bugs críticos en producción.

### Crear hotfix

```bash
# Desde main (producción)
git checkout main
git pull origin main

# Crear hotfix con nuevo número de versión PATCH
git checkout -b hotfix/v1.0.1-descripcion
```

### Aplicar el hotfix

```bash
# Hacer la corrección urgente
# ...

# Commit
git commit -m "hotfix: corregir error crítico en autenticación"
```

### Finalizar el hotfix

```bash
# Fusionar a main
git checkout main
git merge hotfix/v1.0.1-descripcion

# Crear tag
git tag -a v1.0.1 -m "Hotfix: Corrección error crítico en autenticación"
git push origin main
git push origin v1.0.1

# Fusionar también a develop
git checkout develop
git merge hotfix/v1.0.1-descripcion
git push origin develop

# Eliminar hotfix
git branch -d hotfix/v1.0.1-descripcion
```

---

## Comandos Útiles

### Ver el historial de commits

```bash
# Historial básico
git log

# Historial resumido
git log --oneline

# Historial con gráfico de ramas
git log --oneline --graph --all

# Últimos 10 commits
git log --oneline -10
```

### Ver tags de versión

```bash
# Listar todos los tags
git tag

# Buscar tags específicos
git tag -l "v1.*"

# Ver información de un tag
git show v1.0.0
```

### Sincronizar con el repositorio remoto

```bash
# Descargar cambios sin fusionar
git fetch origin

# Descargar y fusionar automáticamente
git pull origin nombre-rama

# Ver diferencias entre local y remoto
git diff origin/develop
```

### Deshacer cambios

```bash
# Descartar cambios en un archivo (antes de add)
git checkout -- archivo.js

# Quitar archivo del staging (después de add)
git reset HEAD archivo.js

# Deshacer último commit (mantiene cambios)
git reset --soft HEAD~1

# Deshacer último commit (descarta cambios) - CUIDADO
git reset --hard HEAD~1
```

### Limpiar ramas

```bash
# Ver ramas ya fusionadas
git branch --merged

# Eliminar rama local
git branch -d nombre-rama

# Eliminar rama remota
git push origin --delete nombre-rama

# Limpiar referencias a ramas remotas eliminadas
git fetch --prune
```

### Resolver conflictos

Si hay conflictos al fusionar:

```bash
# Ver archivos en conflicto
git status

# Después de resolver manualmente los conflictos:
git add archivo-resuelto.js
git commit -m "merge: resolver conflictos en archivo-resuelto.js"
```

### Stash (guardar cambios temporalmente)

```bash
# Guardar cambios sin hacer commit
git stash

# Ver lista de stashes
git stash list

# Recuperar último stash
git stash pop

# Recuperar stash específico
git stash apply stash@{0}
```

---

## Convenciones de Commits

Formato recomendado:
```
tipo(scope): descripción corta

[descripción detallada opcional]
```

Tipos de commits:
- **feat**: Nueva característica
- **fix**: Corrección de bug
- **docs**: Cambios en documentación
- **style**: Cambios de formato (no afectan funcionalidad)
- **refactor**: Refactorización de código
- **test**: Agregar o modificar tests
- **chore**: Tareas de mantenimiento
- **perf**: Mejoras de rendimiento
- **security**: Cambios relacionados con seguridad

Ejemplos:
```bash
git commit -m "feat: agregar sistema de calificaciones"
git commit -m "fix: resolver error en login de usuarios"
git commit -m "docs: actualizar instrucciones de instalación"
git commit -m "security: proteger credenciales con variables de entorno"
```

---

## Versionamiento Semántico

Formato: MAJOR.MINOR.PATCH (ejemplo: v1.2.3)

- **MAJOR**: Cambios incompatibles con versiones anteriores (v1.0.0 → v2.0.0)
- **MINOR**: Nueva funcionalidad compatible (v1.0.0 → v1.1.0)
- **PATCH**: Correcciones de bugs (v1.0.0 → v1.0.1)

---

## Referencias

- Repositorio: https://github.com/yadi078/Froodlink.git
- Documentación completa: Ver GIT_FLOW.md

Última actualización: Noviembre 2024

