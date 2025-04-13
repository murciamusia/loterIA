<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Usuario - loterIA</title>
</head>
<body>
    <h1>Bienvenido, <?php echo $_SESSION['user_email']; ?>!</h1>
    <p>Este es tu panel de usuario.</p>
    <a href="logout.php">Cerrar sesión</a>
</body>
</html>
