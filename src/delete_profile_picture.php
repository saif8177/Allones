<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $full_name = $_POST['full_name'] ?? '';

    $conn = new mysqli("localhost", "root", "", "signup_db");

    if ($conn->connect_error) {
        echo json_encode(["status" => "error", "message" => "Database connection failed."]);
        exit;
    }

    // Get current profile picture path
    $stmt = $conn->prepare("SELECT profile_picture FROM users WHERE email = ? OR full_name = ?");
    $stmt->bind_param("ss", $email, $full_name);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();

    if ($row && $row['profile_picture']) {
        $filePath = str_replace("http://localhost/", "", $row['profile_picture']);
        $filePath = $_SERVER['DOCUMENT_ROOT'] . '/' . $filePath; // Adjust for server root

        // Debug resolved path
        error_log("Resolved file path: " . $filePath);

        if (file_exists($filePath)) {
            if (unlink($filePath)) {
                error_log("File deleted successfully.");
            } else {
                error_log("Failed to delete file.");
                echo json_encode(["status" => "error", "message" => "Failed to delete file on server."]);
                exit;
            }
        } else {
            error_log("File does not exist at: " . $filePath);
        }
    }

    // Update database
    $stmt = $conn->prepare("UPDATE users SET profile_picture = NULL WHERE email = ? OR full_name = ?");
    $stmt->bind_param("ss", $email, $full_name);
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Profile picture deleted."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update database."]);
    }
}
?>
