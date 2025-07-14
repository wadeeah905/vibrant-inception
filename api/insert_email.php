<?php
require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Get POST data
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (!$data) {
        throw new Exception("No data received");
    }
    
    // Validate required fields
    $required_fields = ['nom_client', 'email_client', 'telephone_client', 'message_client'];
    foreach ($required_fields as $field) {
        if (empty($data[$field])) {
            throw new Exception("Field $field is required");
        }
    }
    
    // Validate email format
    if (!filter_var($data['email_client'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception("Invalid email format");
    }
    
    // Prepare and execute insert statement
    $sql = "INSERT INTO emails (nom_client, email_client, telephone_client, sujet_message, message_client) 
            VALUES (:nom_client, :email_client, :telephone_client, :sujet_message, :message_client)";
    
    $stmt = $db->prepare($sql);
    $stmt->bindParam(':nom_client', $data['nom_client']);
    $stmt->bindParam(':email_client', $data['email_client']);
    $stmt->bindParam(':telephone_client', $data['telephone_client']);
    $stmt->bindParam(':sujet_message', $data['sujet_message'] ?? '');
    $stmt->bindParam(':message_client', $data['message_client']);
    
    if ($stmt->execute()) {
        $email_id = $db->lastInsertId();
        
        echo json_encode([
            'success' => true,
            'message' => 'Email sent successfully',
            'id_email' => $email_id
        ]);
    } else {
        throw new Exception("Failed to insert email");
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>