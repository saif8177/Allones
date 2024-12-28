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

    // Fetch the profile picture path
    $query = "SELECT profile_picture FROM users WHERE email = '$email'";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $profilePicture = $user['profile_picture'];

        if ($profilePicture) {
            // Delete the file from the server
            $filePath = __DIR__ . "/uploads/" . basename($profilePicture);
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        // Update the database to remove the profile picture reference
        $updateQuery = "UPDATE users SET profile_picture = NULL WHERE email = '$email'";
        if ($conn->query($updateQuery) === TRUE) {
            echo json_encode(["status" => "success", "message" => "Profile picture deleted successfully."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to update the database."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "User not found."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
}

$conn->close();
?>
