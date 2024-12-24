<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "signup_db");

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

if ($_FILES['profilePicture'] && isset($_POST['email'])) {
    $email = $conn->real_escape_string($_POST['email']);
    $targetDir = "uploads/";
    $fileName = basename($_FILES['profilePicture']['name']);
    $targetFilePath = $targetDir . $fileName;

    // Move the uploaded file to the target directory
    if (move_uploaded_file($_FILES['profilePicture']['tmp_name'], $targetFilePath)) {
        // Update the user's profile picture in the database
        $updateQuery = "UPDATE users SET profile_picture = '$targetFilePath' WHERE email = '$email'";
        if ($conn->query($updateQuery) === TRUE) {
            echo json_encode(["status" => "success", "message" => "Profile picture updated successfully.", "filePath" => $targetFilePath]);
        } else {
            echo json_encode(["status" => "error", "message" => "Database error: " . $conn->error]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to upload file."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input."]);
}

$conn->close();
?>
