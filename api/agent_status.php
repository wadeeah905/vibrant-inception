<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

require_once 'config.php';

try {
    $database = new Database();
    $db = $database->getConnection();
    
    // Create agent_status table if it doesn't exist
    $createTableSQL = "CREATE TABLE IF NOT EXISTS agent_status (
        id INT AUTO_INCREMENT PRIMARY KEY,
        agent_name VARCHAR(255) NOT NULL,
        agent_email VARCHAR(255) UNIQUE NOT NULL,
        is_online BOOLEAN DEFAULT FALSE,
        status_message VARCHAR(500) DEFAULT 'Disponible',
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_agent_email (agent_email),
        INDEX idx_online_status (is_online, last_activity)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $db->exec($createTableSQL);

    $method = $_SERVER['REQUEST_METHOD'];
    $request_body = json_decode(file_get_contents('php://input'), true);

    function setAgentOnline($db, $data) {
        try {
            $stmt = $db->prepare("
                INSERT INTO agent_status (agent_name, agent_email, is_online, status_message) 
                VALUES (?, ?, 1, ?)
                ON DUPLICATE KEY UPDATE 
                is_online = 1,
                last_activity = CURRENT_TIMESTAMP,
                status_message = VALUES(status_message)
            ");
            
            $stmt->execute([
                $data['agent_name'],
                $data['agent_email'],
                $data['status_message'] ?? 'En ligne'
            ]);
            
            return [
                'success' => true,
                'message' => 'Agent status updated to online'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error setting agent online: ' . $e->getMessage()
            ];
        }
    }

    function setAgentOffline($db, $data) {
        try {
            $stmt = $db->prepare("
                UPDATE agent_status 
                SET is_online = 0, status_message = ?
                WHERE agent_email = ?
            ");
            
            $stmt->execute([
                $data['status_message'] ?? 'Hors ligne',
                $data['agent_email']
            ]);
            
            return [
                'success' => true,
                'message' => 'Agent status updated to offline'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error setting agent offline: ' . $e->getMessage()
            ];
        }
    }

    function updateAgentActivity($db, $agent_email) {
        try {
            $stmt = $db->prepare("
                UPDATE agent_status 
                SET last_activity = CURRENT_TIMESTAMP
                WHERE agent_email = ? AND is_online = 1
            ");
            
            $stmt->execute([$agent_email]);
            
            return [
                'success' => true,
                'message' => 'Agent activity updated'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error updating agent activity: ' . $e->getMessage()
            ];
        }
    }

    function getAgentStatus($db, $agent_email = null) {
        try {
            if ($agent_email) {
                $stmt = $db->prepare("
                    SELECT * FROM agent_status 
                    WHERE agent_email = ?
                ");
                $stmt->execute([$agent_email]);
                $agent = $stmt->fetch();
                
                return [
                    'success' => true,
                    'agent' => $agent
                ];
            } else {
                $stmt = $db->prepare("
                    SELECT * FROM agent_status 
                    ORDER BY is_online DESC, last_activity DESC
                ");
                $stmt->execute();
                $agents = $stmt->fetchAll();
                
                return [
                    'success' => true,
                    'agents' => $agents
                ];
            }
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error getting agent status: ' . $e->getMessage()
            ];
        }
    }

    function getOnlineAgentsCount($db) {
        try {
            $stmt = $db->prepare("
                SELECT COUNT(*) as online_count 
                FROM agent_status 
                WHERE is_online = 1
            ");
            $stmt->execute();
            $result = $stmt->fetch();
            
            return [
                'success' => true,
                'online_count' => $result['online_count'],
                'status' => $result['online_count'] > 0 ? 'online' : 'offline'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => 'Error getting online agents count: ' . $e->getMessage()
            ];
        }
    }

    // Handle requests
    switch ($method) {
        case 'GET':
            if (isset($_GET['action'])) {
                switch ($_GET['action']) {
                    case 'count':
                        echo json_encode(getOnlineAgentsCount($db));
                        break;
                    default:
                        echo json_encode(['success' => false, 'message' => 'Invalid action']);
                }
            } else {
                echo json_encode(getAgentStatus($db, $_GET['agent_email'] ?? null));
            }
            break;
            
        case 'POST':
            if (isset($request_body['action'])) {
                switch ($request_body['action']) {
                    case 'online':
                        echo json_encode(setAgentOnline($db, $request_body));
                        break;
                    case 'offline':
                        echo json_encode(setAgentOffline($db, $request_body));
                        break;
                    case 'heartbeat':
                        echo json_encode(updateAgentActivity($db, $request_body['agent_email']));
                        break;
                    default:
                        echo json_encode(['success' => false, 'message' => 'Invalid action']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Action required']);
            }
            break;
            
        default:
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
            break;
    }
    
} catch(Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>