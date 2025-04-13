<?php
// Conexión a la base de datos (ajusta los datos a los tuyos)
$host = 'crossover.proxy.rlwy.net';
$port = '50703';
$dbname = 'railway';
$user = 'postgres';
$password = 'dpiSTjJzJRevInYPhWvbuteSXmVjwwMh';

$conexion = new PDO(\"pgsql:host=$host;port=$port;dbname=$dbname\", $user, $password);

// Recoger datos del formulario
$nombre = $_POST['nombre'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

// Insertar en la base de datos
$sql = \"INSERT INTO usuarios (nombre, email, password) VALUES (:nombre, :email, :password)\";
$stmt = $conexion->prepare($sql);
$stmt->bindParam(':nombre', $nombre);
$stmt->bindParam(':email', $email);
$stmt->bindParam(':password', $password);

if ($stmt->execute()) {
    header(\"Location: registro.html?exito=1\");
    exit;
} else {
    echo \"Error al registrar el usuario.\";
}
?>
