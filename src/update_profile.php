<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "signup_db");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email'], $data['fullName'])) {
    $email = $conn->real_escape_string($data['email']);
    $fullName = $conn->real_escape_string($data['fullName']);

    // Update the user's name in the database
    $updateQuery = "UPDATE users SET full_name = '$fullName' WHERE email = '$email'";

    if ($conn->query($updateQuery) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Profile updated successfully."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
}

$conn->close();
?>
