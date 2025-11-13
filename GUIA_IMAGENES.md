# 📸 Guía para Agregar Imágenes de Comidas - Foodlik

## 🖼️ Cómo Agregar Nuevas Imágenes

### Paso 1: Agregar la Imagen a la Carpeta `img/`

1. Busca o toma una foto de la comida
2. Guarda la imagen con un nombre descriptivo (ej: `tacos-pastor.jpg`)
3. Copia la imagen a la carpeta: `C:\xampp\htdocs\Foodlik\img\`

### Paso 2: Actualizar la Base de Datos

Hay dos formas de actualizar las fotos en la base de datos:

#### Opción A: Desde phpMyAdmin (Visual)

1. Abre phpMyAdmin: `http://localhost/phpmyadmin`
2. Selecciona la base de datos `FoodLink`
3. Haz clic en la tabla `comidas`
4. Edita el registro de la comida
5. En el campo `foto`, escribe el nombre de la imagen (ej: `tacos-pastor.jpg`)
6. Guarda los cambios

#### Opción B: Desde MySQL (Línea de Comandos)

```sql
-- Actualizar la foto de una comida específica
UPDATE comidas 
SET foto = 'nombre-de-tu-imagen.jpg' 
WHERE id_comida = 1;
```

### Paso 3: Al Agregar Nueva Comida desde el Panel Cocinero

Cuando agregues una nueva comida desde el panel de cocinero:

1. En el campo "Foto", escribe el nombre del archivo (ej: `pizza.jpg`)
2. Asegúrate de que el archivo exista en la carpeta `img/`
3. Guarda la comida

---

## 📋 Imágenes Actuales Disponibles

Las siguientes imágenes ya están en la carpeta `img/` y puedes usarlas:

### Imágenes de Comida Recomendadas:
- `menu-snack-img.jpg` - Snacks/Botanas
- `menu-beverage-img.jpg` - Bebidas
- `carousel-1.jpg` - Comida general
- `carousel-2.jpg` - Comida general
- `carousel-3.jpg` - Comida general
- `feature-2.jpg` - Platos especiales
- `feature-4.jpg` - Platos especiales

### Otras Imágenes Disponibles:
- `about.jpg`
- `blog-1.jpg`, `blog-4.jpg`
- `post-3.jpg`, `post-4.jpg`, `post-5.jpg`
- `team-1.jpg` hasta `team-4.jpg`
- `testimonial-1.jpg` hasta `testimonial-4.jpg`

---

## 🎨 Recomendaciones para las Imágenes

### Tamaño y Formato:
- **Formato:** JPG o PNG
- **Tamaño recomendado:** 800x600 píxeles
- **Peso máximo:** 500 KB para carga rápida
- **Aspecto:** 4:3 o 16:9

### Calidad:
- ✅ Buena iluminación
- ✅ Enfoque nítido
- ✅ Fondo limpio o neutro
- ✅ La comida debe verse apetitosa
- ❌ Evitar imágenes borrosas
- ❌ Evitar fondos desordenados

### Nombres de Archivo:
- Usa nombres descriptivos: `tacos-pastor.jpg` ✅
- Sin espacios: usa guiones `-` en lugar de espacios
- Minúsculas preferiblemente
- Sin caracteres especiales (ñ, á, é, etc.)

Ejemplos buenos:
```
tacos-pastor.jpg
enchiladas-verdes.jpg
pozole-rojo.jpg
quesadillas-queso.jpg
pizza-hawaiana.jpg
```

Ejemplos malos:
```
foto1.jpg ❌ (poco descriptivo)
Tacos Al Pastor.jpg ❌ (espacios)
comida_mamá.jpg ❌ (caracteres especiales)
IMG_20230515.jpg ❌ (nombre genérico)
```

---

## 🚀 Agregar Imágenes Masivamente

Si quieres agregar muchas comidas con sus fotos:

1. **Prepara las imágenes:**
   - Nombra todas las imágenes apropiadamente
   - Cópialas a la carpeta `img/`

2. **Inserta las comidas en la base de datos:**

```sql
INSERT INTO comidas (nombre_comida, foto, precio, cantidad, id_cocinero, descripcion) VALUES
('Tacos al Pastor', 'tacos-pastor.jpg', 45.00, 20, 2, 'Deliciosos tacos con carne marinada'),
('Pizza Hawaiana', 'pizza-hawaiana.jpg', 120.00, 10, 2, 'Pizza con piña y jamón'),
('Hamburguesa Doble', 'hamburguesa-doble.jpg', 85.00, 15, 3, 'Hamburguesa con doble carne');
```

---

## 🔧 Solución de Problemas

### Las imágenes no se muestran:

1. **Verifica que el archivo exista:**
   - Busca en `C:\xampp\htdocs\Foodlik\img\`
   - Confirma que el nombre coincida exactamente

2. **Verifica el nombre en la base de datos:**
   - Abre phpMyAdmin
   - Revisa la tabla `comidas`
   - El campo `foto` debe tener el nombre exacto del archivo

3. **Verifica los permisos:**
   - Asegúrate de que la carpeta `img/` tenga permisos de lectura

4. **Limpia la caché del navegador:**
   - Presiona `Ctrl + F5` en tu navegador
   - O abre en modo incógnito

### Formato incorrecto:

Si la imagen no se ve bien en la página:
- Verifica que sea JPG o PNG
- Redimensiona la imagen a 800x600 píxeles
- Comprime la imagen si es muy pesada

---

## 💡 Recursos para Obtener Imágenes de Comida

### Sitios de Fotos Gratuitas:
1. **Unsplash** - https://unsplash.com/s/photos/food
2. **Pexels** - https://www.pexels.com/search/food/
3. **Pixabay** - https://pixabay.com/images/search/food/

### Consejos:
- Busca "mexican food", "tacos", "pizza", etc.
- Descarga imágenes de alta calidad
- Respeta las licencias de uso
- Redimensiona antes de subir

---

## 📊 Estado Actual de las Comidas

Las comidas actuales en la base de datos tienen estas fotos:

| ID | Comida | Foto Actual |
|----|--------|-------------|
| 1 | Tacos al Pastor | `menu-snack-img.jpg` |
| 2 | Enchiladas Verdes | `carousel-1.jpg` |
| 3 | Pozole Rojo | `carousel-2.jpg` |
| 4 | Quesadillas | `menu-beverage-img.jpg` |

**💡 Tip:** Puedes reemplazar estas fotos por imágenes más específicas de cada platillo.

---

## 🎯 Próximos Pasos

1. Descarga imágenes apropiadas para cada comida
2. Guárdalas en la carpeta `img/` con nombres descriptivos
3. Actualiza la base de datos con los nuevos nombres
4. Recarga la página `menu.html` para ver los cambios
5. ¡Disfruta de tu menú con fotos hermosas! 🎉

