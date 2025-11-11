<?php
// get_comida.php - Obtener una comida específica por ID
require_once 'config.php';

$conn = getDBConnection();

$id_comida = intval($_GET['id_comida'] ?? 0);

if ($id_comida === 0) {
    sendResponse(false, [], 'ID de comida requerido');
}

$stmt = $conn->prepare("SELECT * FROM comida WHERE id_comida = ?");
$stmt->bind_param("i", $id_comida);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    sendResponse(false, [], 'Comida no encontrada');
}

$comida = $result->fetch_assoc();

sendResponse(true, ['comida' => $comida]);

$stmt->close();
$conn->close();
?>
