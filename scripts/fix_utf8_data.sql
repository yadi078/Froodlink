-- ============================================
-- Script para corregir datos con codificación UTF-8 y fotos
-- ============================================

USE FoodLink;

-- Actualizar nombres de usuarios que tienen caracteres mal codificados
UPDATE usuarios 
SET nombre = 'María García' 
WHERE id_usuario = 2;

UPDATE usuarios 
SET nombre = 'Pedro López' 
WHERE id_usuario = 3;

-- Actualizar descripciones de comidas
UPDATE comidas 
SET descripcion = 'Enchiladas bañadas en salsa verde con crema' 
WHERE id_comida = 2;

-- Actualizar fotos de comidas con imágenes que realmente existen
UPDATE comidas SET foto = 'menu-snack-img.jpg' WHERE id_comida = 1;
UPDATE comidas SET foto = 'carousel-1.jpg' WHERE id_comida = 2;
UPDATE comidas SET foto = 'carousel-2.jpg' WHERE id_comida = 3;
UPDATE comidas SET foto = 'menu-beverage-img.jpg' WHERE id_comida = 4;

-- Verificar los cambios
SELECT id_usuario, nombre, correo FROM usuarios;
SELECT id_comida, nombre_comida, descripcion, foto FROM comidas;

