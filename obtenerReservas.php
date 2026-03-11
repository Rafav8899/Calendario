<?php

/* =========================================
   CONEXIÓN A LA BASE DE DATOS
========================================= */

$conn = new mysqli("localhost","root","","calendario");

if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

/* =========================================
   CONFIGURACIÓN
========================================= */

// Cantidad máxima de reservas por día
$limitePorDia = 2;

/* =========================================
   OBTENER RESERVAS
========================================= */

$sql = "SELECT fecha FROM reservas";
$result = $conn->query($sql);

if(!$result){
    die("Error en la consulta");
}

/* =========================================
   CONTAR RESERVAS POR FECHA
========================================= */

$conteoFechas = [];

while($row = $result->fetch_assoc()){

    $fecha = $row["fecha"];

    if(!isset($conteoFechas[$fecha])){
        $conteoFechas[$fecha] = 0;
    }

    $conteoFechas[$fecha]++;
}

/* =========================================
   GENERAR ESTADO DE FECHAS
========================================= */

$fechasEstado = [];

foreach($conteoFechas as $fecha => $cantidad){

    if($cantidad >= $limitePorDia){

        $fechasEstado[$fecha] = "ocupado"; // rojo

    }elseif($cantidad >= 1){

        $fechasEstado[$fecha] = "casi-lleno"; // amarillo

    }else{

        $fechasEstado[$fecha] = "available"; // verde

    }
}

/* =========================================
   RESPUESTA JSON
========================================= */

header('Content-Type: application/json');

echo json_encode($fechasEstado);

?>