<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

try {
    $sql = "SELECT * FROM comentarios_contacto ORDER BY fecha DESC LIMIT 20";
    $result = $conn->query($sql);
    
    $comentarios = [];
    while ($row = $result->fetch_assoc()) {
        $comentarios[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'comentarios' => $comentarios
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener comentarios: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

$conn->close();
?>
