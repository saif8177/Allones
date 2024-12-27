<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "signup_db");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email'])) {
    $email = $conn->real_escape_string($data['email']);

    // Fetch the user's data, including the profile picture
    $query = "SELECT full_name, profile_picture FROM users WHERE email = '$email'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $profilePicture = $user['profile_picture'];

        // Only prepend the URL if it's not already a full URL
        if ($profilePicture && !str_starts_with($profilePicture, 'http')) {
            $profilePicture = "http://localhost/uploads/" . $profilePicture;
        }

        echo json_encode([
            "status" => "success",
            "user" => [
                "fullName" => $user['full_name'],
                "profilePicture" => $profilePicture,
            ],
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "User not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
}

$conn->close();
?>
