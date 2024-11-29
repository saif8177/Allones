<?php
// Enable error reporting for debugging purposes
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Allow cross-origin requests for your frontend
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight requests for CORS (if any)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "signup_db";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    echo json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]);
    exit();
}

// Fetch incoming data from the request body
$data = json_decode(file_get_contents('php://input'), true);

// Validate input data
$email = $data['email'] ?? null;
$newPassword = $data['newPassword'] ?? null;

if (!$email || !$newPassword) {
    echo json_encode(["status" => "error", "message" => "Email or password missing."]);
    exit();
}

// Hash the new password before storing it
$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

// Prepare the SQL statement to update the password
$stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");

if ($stmt === false) {
    echo json_encode(["status" => "error", "message" => "SQL prepare failed: " . $conn->error]);
    exit();
}

// Bind the parameters
$stmt->bind_param("ss", $hashedPassword, $email);

// Execute the statement
if ($stmt->execute()) {
    // Check if the password was updated (affected rows > 0)
    if ($stmt->affected_rows > 0) {
        echo json_encode(["status" => "success", "message" => "Password updated successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "No rows affected. Please check if the email exists."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Failed to update password. SQL execution error: " . $stmt->error]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
