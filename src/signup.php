<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'vendor/autoload.php'; // Include JWT library (Firebase PHP-JWT)

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = "your_secret_key"; // Replace with a strong secret key
$conn = new mysqli("localhost", "root", "", "signup_db");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['fullName'], $data['email'], $data['password'])) {
    $fullName = $conn->real_escape_string($data['fullName']);
    $email = $conn->real_escape_string($data['email']);
    $password = password_hash($data['password'], PASSWORD_BCRYPT);

    // Check if email already exists
    $checkQuery = "SELECT id FROM users WHERE email = '$email'";
    $result = $conn->query($checkQuery);

    if ($result->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "Email is already registered."]);
        exit;
    }

    // Insert user into database
    $insertQuery = "INSERT INTO users (full_name, email, password) VALUES ('$fullName', '$email', '$password')";

    if ($conn->query($insertQuery) === TRUE) {
        // Generate JWT token
        $tokenPayload = [
            'email' => $email,
            'exp' => time() + 3600 // Token expires in 1 hour
        ];
        $token = JWT::encode($tokenPayload, $secret_key, 'HS256');

        echo json_encode([
            "status" => "success",
            "message" => "User registered successfully!",
            "token" => $token
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
}

$conn->close();
?>
