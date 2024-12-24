<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'vendor/autoload.php'; // Include JWT library (Firebase PHP-JWT)

use Firebase\JWT\JWT;

$secret_key = "your_secret_key"; // Replace with a strong secret key
$conn = new mysqli("localhost", "root", "", "signup_db");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email'], $data['password'])) {
    $email = $conn->real_escape_string($data['email']);
    $password = $data['password'];

    // Check if the email exists
    $checkQuery = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($checkQuery);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();

        // Verify the password
        if (password_verify($password, $user['password'])) {
            // Generate JWT token
            $tokenPayload = [
                'email' => $email,
                'exp' => time() + 3600 // Token expires in 1 hour
            ];
            $token = JWT::encode($tokenPayload, $secret_key, 'HS256');

            echo json_encode([
                "status" => "success",
                "message" => "Login successful.",
                "token" => $token,
                "user" => [
                    "id" => $user['id'],
                    "fullName" => $user['full_name'],
                    "email" => $user['email']
                ]
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Invalid email or password."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
}

$conn->close();
?>
