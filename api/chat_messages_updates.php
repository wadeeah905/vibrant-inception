
<?php
// This file contains the updates needed for the chat_messages.php API
// Add this functionality to the existing chat_messages.php file

// Add this new endpoint to handle client-only message fetching
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['client_only'])) {
    $session_id = $_GET['session_id'] ?? '';
    
    if (empty($session_id)) {
        echo json_encode(['success' => false, 'message' => 'Session ID required']);
        exit;
    }
    
    try {
        $stmt = $db->prepare("
            SELECT * FROM chat_messages 
            WHERE id_session = ? AND sender_type = 'agent'
            ORDER BY date_sent DESC LIMIT 10
        ");
        $stmt->execute([$session_id]);
        $messages = $stmt->fetchAll();
        
        // Mark agent messages as read by client
        $updateStmt = $db->prepare("
            UPDATE chat_messages 
            SET is_read = 1 
            WHERE id_session = ? AND sender_type = 'agent' AND is_read = 0
        ");
        $updateStmt->execute([$session_id]);
        
        echo json_encode([
            'success' => true,
            'messages' => array_reverse($messages)
        ]);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error fetching messages: ' . $e->getMessage()
        ]);
    }
    exit;
}

// Add this to handle agent connection status
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($request_body['action']) && $request_body['action'] === 'agent_connected') {
    $session_id = $request_body['session_id'] ?? '';
    
    if (empty($session_id)) {
        echo json_encode(['success' => false, 'message' => 'Session ID required']);
        exit;
    }
    
    try {
        // Update session status to indicate agent is connected
        $stmt = $db->prepare("
            UPDATE chat_sessions 
            SET status = 'active', agent_connected = 1, agent_connected_at = CURRENT_TIMESTAMP
            WHERE id_session = ?
        ");
        $stmt->execute([$session_id]);
        
        // Send system message to indicate agent connection
        $systemStmt = $db->prepare("
            INSERT INTO chat_messages (id_session, sender_type, sender_name, message_content, message_type, date_sent) 
            VALUES (?, 'system', 'System', 'Agent connecté - Vous chattez maintenant en temps réel', 'system', NOW())
        ");
        $systemStmt->execute([$session_id]);
        
        echo json_encode(['success' => true, 'message' => 'Agent connected successfully']);
    } catch (Exception $e) {
        echo json_encode([
            'success' => false,
            'message' => 'Error connecting agent: ' . $e->getMessage()
        ]);
    }
    exit;
}
?>
