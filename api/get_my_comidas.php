<?php
// get_my_comidas.php - Obtener las comidas de un cocinero específico
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

$id_cocinero = intval($_GET['id_cocinero'] ?? 0);

if ($id_cocinero === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'ID de cocinero requerido'
    ]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM comidas WHERE id_cocinero = ? ORDER BY id_comida DESC");
$stmt->bind_param("i", $id_cocinero);
$stmt->execute();
$result = $stmt->get_result();

$comidas = [];
while ($row = $result->fetch_assoc()) {
    $comidas[] = $row;
}

echo json_encode([
    'success' => true,
    'comidas' => $comidas
]);

$stmt->close();
$conn->close();
?>
