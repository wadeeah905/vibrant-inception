
<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get all orders with customer information, order items, and delivery addresses
    $query = "
        SELECT 
            o.id_order,
            o.numero_commande,
            o.sous_total_order,
            o.discount_amount_order,
            o.discount_percentage_order,
            o.delivery_cost_order,
            o.total_order,
            o.status_order,
            o.date_livraison_souhaitee,
            o.payment_status,
            o.payment_method,
            o.notes_order,
            o.vue_par_admin,
            o.date_vue_admin,
            o.date_creation_order,
            o.date_confirmation_order,
            o.date_livraison_order,
            
            -- Customer information
            c.nom_customer,
            c.prenom_customer,
            c.email_customer,
            c.telephone_customer,
            c.adresse_customer,
            c.ville_customer,
            c.code_postal_customer,
            c.pays_customer
            
        FROM orders o
        JOIN customers c ON o.id_customer = c.id_customer
        ORDER BY o.date_creation_order DESC
    ";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    $orders = $stmt->fetchAll();
    
    // For each order, get the order items and delivery address
    foreach ($orders as $key => $order) {
        // Get order items
        $itemsQuery = "
            SELECT 
                oi.id_order_item,
                oi.nom_product_snapshot,
                oi.reference_product_snapshot,
                oi.price_product_snapshot,
                oi.size_selected,
                oi.color_selected,
                oi.quantity_ordered,
                oi.subtotal_item,
                oi.discount_item,
                oi.total_item,
                p.img_product
            FROM order_items oi
            LEFT JOIN products p ON oi.id_product = p.id_product
            WHERE oi.id_order = :order_id
        ";
        
        $itemsStmt = $db->prepare($itemsQuery);
        $itemsStmt->bindParam(':order_id', $order['id_order']);
        $itemsStmt->execute();
        $orders[$key]['items'] = $itemsStmt->fetchAll();
        
        // Get delivery address if exists
        $deliveryQuery = "
            SELECT 
                nom_destinataire,
                prenom_destinataire,
                telephone_destinataire,
                adresse_livraison,
                ville_livraison,
                code_postal_livraison,
                pays_livraison,
                instructions_livraison
            FROM delivery_addresses
            WHERE id_order = :order_id
        ";
        
        $deliveryStmt = $db->prepare($deliveryQuery);
        $deliveryStmt->bindParam(':order_id', $order['id_order']);
        $deliveryStmt->execute();
        $deliveryAddress = $deliveryStmt->fetch();
        
        $orders[$key]['delivery_address'] = $deliveryAddress ?: null;
        
        // Format customer data for admin interface
        $orders[$key]['customer'] = [
            'nom' => $order['nom_customer'],
            'prenom' => $order['prenom_customer'],
            'email' => $order['email_customer'],
            'telephone' => $order['telephone_customer'],
            'adresse' => $order['adresse_customer'] . ', ' . $order['ville_customer'] . ' ' . $order['code_postal_customer']
        ];
    }
    
    echo json_encode([
        'success' => true,
        'data' => $orders,
        'total' => count($orders)
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error fetching orders: ' . $e->getMessage()
    ]);
}
?>
