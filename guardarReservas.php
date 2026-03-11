<?php

$conn = new mysqli("localhost", "root", "", "calendario");

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Recibir datos del formulario
$fecha = $_POST["fecha"];
$nombre = $_POST["nombre"];
$servicio = $_POST["servicio"];

// LIMITE DE RESERVA POR DÍA
$limitePorDia = 2;


// Contar cuántas reservas hay en esa fecha
$check = $conn->prepare("SELECT COUNT(*) as total FROM reservas WHERE fecha = ?");
$check->bind_param("s", $fecha);
$check->execute();
$result = $check->get_result();
$row = $result->fetch_assoc();
$total = $row['total'] ?? 0;

if($total >= $limitePorDia){
    echo '<script>alert("Esta fecha ya alcazó el limite de reservas.");history.go(-1);</script>';
}

// Verificar si la fecha ya está reservada
$stmt = $conn->prepare("INSERT INTO reservas ( fecha, nombre, servicio) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $fecha, $nombre, $servicio);
$stmt->execute();

    // header("Location: index.html");
    // exit();
    echo '<script>alert("Reserva bien hecha");window.location.href = "index.html";</script>'


?>