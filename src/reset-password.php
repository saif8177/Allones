<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

$method = $_SERVER['REQUEST_METHOD'];
if ($method == 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'];

    if (filter_var($email, FILTER_VALIDATE_EMAIL) && strpos($email, '@gmail.com') !== false) {
        // Simulate password reset
        echo json_encode([
            "status" => "success",
            "message" => "Password reset email sent to $email."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Invalid email address."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Invalid request method."
    ]);
}
?>
