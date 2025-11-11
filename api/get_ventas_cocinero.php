<?php
// get_ventas_cocinero.php - Obtener ventas de un cocinero
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once 'config.php';

$id_cocinero = isset($_GET['id_cocinero']) ? intval($_GET['id_cocinero']) : 0;

if ($id_cocinero === 0) {
    echo json_encode(['success' => false, 'message' => 'ID de cocinero inválido']);
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
                u.nombre as cliente_nombre,
                u.correo as cliente_correo,
                (SELECT MAX(fecha_pedido) FROM pedidos WHERE id_pedido = p.id_pedido AND estado = 'entregado') as fecha_entrega
            FROM pedidos p
            INNER JOIN comidas c ON p.comida_id = c.id_comida
            INNER JOIN usuarios u ON p.usuario_id = u.id_usuario
            WHERE c.id_cocinero = ?
            ORDER BY 
                CASE 
                    WHEN p.estado = 'entregado' THEN 1
                    ELSE 0
                END,
                p.fecha_pedido DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_cocinero);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $pedidos = [];
    while ($row = $result->fetch_assoc()) {
        $pedidos[] = $row;
    }
    
    echo json_encode([
        'success' => true,
        'pedidos' => $pedidos
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al obtener ventas: ' . $e->getMessage()
    ]);
}

$conn->close();
?>
