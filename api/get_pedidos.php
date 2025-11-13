<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

$usuario_id = isset($_GET['usuario_id']) ? intval($_GET['usuario_id']) : 0;

if ($usuario_id === 0) {
    echo json_encode(['success' => false, 'message' => 'ID de usuario inválido'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $sql = "SELECT 
                p.id_pedido,
                p.cantidad,
                p.precio_unitario,
                p.total,
                p.fecha_pedido,
                p.estado,
                c.id_comida,
                c.nombre_comida,
                c.foto,
                c.descripcion,
                cal.calificacion,
                cal.comentario as comentario_calificacion
            FROM pedidos p
            INNER JOIN comidas c ON p.comida_id = c.id_comida
            LEFT JOIN calificaciones cal ON p.id_pedido = cal.pedido_id
            WHERE p.usuario_id = ?
            ORDER BY p.fecha_pedido DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $pedidos = [];
    while ($row = $result->fetch_assoc()) {
        $pedidos[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'pedidos' => $pedidos
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener pedidos: ' . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

$conn->close();
?>
