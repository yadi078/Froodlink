<?php
// get_comidas.php - Obtener todas las comidas disponibles
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

$query = "SELECT c.*, u.nombre as cocinero 
          FROM comidas c 
          INNER JOIN usuarios u ON c.id_cocinero = u.id_usuario 
          WHERE c.cantidad > 0
          ORDER BY c.id_comida DESC";

$result = $conn->query($query);

$comidas = [];
while ($row = $result->fetch_assoc()) {
    $comidas[] = $row;
}

echo json_encode([
    'success' => true,
    'comidas' => $comidas
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

$conn->close();
?>
