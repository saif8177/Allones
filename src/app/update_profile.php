<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['profilePicture'])) {
        $email = $_POST['email'] ?? ''; // Retrieve email for database reference
        $targetDir = "uploads/";
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true); // Create directory if it doesn't exist
        }
        $fileName = uniqid() . '-' . basename($_FILES['profilePicture']['name']);
        $targetFile = $targetDir . $fileName;

        // Validate file size (max: 2MB)
        if ($_FILES['profilePicture']['size'] > 2 * 1024 * 1024) {
            echo json_encode(["status" => "error", "message" => "File size exceeds 2MB."]);
            exit;
        }

        // Move the uploaded file
        if (move_uploaded_file($_FILES['profilePicture']['tmp_name'], $targetFile)) {
            // Update database with file path
            $conn = new mysqli("localhost", "root", "", "signup_db");
            if ($conn->connect_error) {
                echo json_encode(["status" => "error", "message" => "Database connection failed."]);
                exit;
            }

            $stmt = $conn->prepare("UPDATE user SET profile_picture = ? WHERE email = ?");
            $fileUrl = "http://localhost/" . $targetFile;
            $stmt->bind_param("ss", $fileUrl, $email);
            if ($stmt->execute()) {
                echo json_encode(["status" => "success", "filePath" => $fileUrl]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to update database."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Failed to upload file."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "No file uploaded."]);
    }
}
?>
