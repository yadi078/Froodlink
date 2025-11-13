<?php
// create_pedido.php - Crear un nuevo pedido
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Método no permitido'], JSON_UNESCAPED_UNICODE);
    exit;
}

// 🔹 Soporte dual: JSON (para Postman/fetch) y Form-Data (para formularios HTML)
$input = json_decode(file_get_contents('php://input'), true);
$id_usuario = intval($input['id_usuario'] ?? $_POST['id_usuario'] ?? 0);
$id_comida = intval($input['id_comida'] ?? $_POST['id_comida'] ?? 0);
$cantidad = intval($input['cantidad'] ?? $_POST['cantidad'] ?? 0);

if ($id_usuario === 0 || $id_comida === 0 || $cantidad <= 0) {
    echo json_encode(['success' => false, 'message' => 'Datos incompletos'], JSON_UNESCAPED_UNICODE);
    exit;
}

$stmt = $conn->prepare("SELECT precio, cantidad FROM comidas WHERE id_comida = ?");
$stmt->bind_param("i", $id_comida);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Comida no encontrada'], JSON_UNESCAPED_UNICODE);
    exit;
}

$comida = $result->fetch_assoc();

if ($comida['cantidad'] < $cantidad) {
    echo json_encode(['success' => false, 'message' => 'No hay suficiente cantidad disponible'], JSON_UNESCAPED_UNICODE);
    exit;
}

$precio_unitario = $comida['precio'];
$total = $precio_unitario * $cantidad;

$stmt = $conn->prepare("INSERT INTO pedidos (usuario_id, comida_id, cantidad, precio_unitario, total) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("iiidd", $id_usuario, $id_comida, $cantidad, $precio_unitario, $total);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'id_pedido' => $conn->insert_id,
        'message' => 'Pedido creado exitosamente'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al crear pedido: ' . $conn->error
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

$stmt->close();
$conn->close();
?>
