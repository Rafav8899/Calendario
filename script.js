/* =====================================
   ELEMENTOS DEL DOM
===================================== */

const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("monthYear");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const toggleBtn = document.querySelector(".theme-toggle");
const body = document.body;

/* =====================================
   THEME TOGGLE
===================================== */

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    body.classList.add("dark");
    toggleBtn.textContent = "☀️";
} else {
    toggleBtn.textContent = "🌙";
}

toggleBtn.addEventListener("click", () => {

    const isDark = body.classList.toggle("dark");
    const theme = isDark ? "dark" : "light";

    localStorage.setItem("theme", theme);

    toggleBtn.textContent = isDark ? "☀️" : "🌙";

});

/* =====================================
   DATOS GENERALES
===================================== */

const meses = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

let fecha = new Date();
let fechaSeleccionada = null;

/* =====================================
   SELECCIONAR DÍA
===================================== */

function seleccionarDia(div){

    document.querySelectorAll(".seleccionada").forEach(d=>{
        d.classList.remove("seleccionada");
    });

    div.classList.add("seleccionada");

    const fecha = div.dataset.fecha;
    document.getElementById("fechaSeleccionada").value = fecha;

}

/* =====================================
   CARGAR CALENDARIO
===================================== */

function cargarCalendario(){

    const year = fecha.getFullYear();
    const month = fecha.getMonth();

    monthYear.textContent = `${meses[month]} ${year}`;

    daysContainer.innerHTML = "";

    const hoy = new Date();
    hoy.setHours(0,0,0,0);

    const primerDia = new Date(year, month, 1).getDay();
    const totalDias = new Date(year, month + 1, 0).getDate();

    /* Espacios antes del día 1 */

    for(let i=0;i<primerDia;i++){
        daysContainer.appendChild(document.createElement("div"));
    }

    /* Crear días */

    for(let dia=1; dia<=totalDias; dia++){

        const fechaObj = new Date(year, month, dia);
        const fechaStr = fechaObj.toISOString().split("T")[0];
        const diaSemana = fechaObj.getDay();

        const div = document.createElement("div");

        div.textContent = dia;
        div.classList.add("dia");
        div.dataset.fecha = fechaStr;

        /* Bloquear fines de semana */

        if(diaSemana === 0 || diaSemana === 6){
            div.classList.add("disabled");
            daysContainer.appendChild(div);
            continue;
        }

        /* Bloquear días pasados */

        if(fechaObj < hoy){
            div.classList.add("past");
            daysContainer.appendChild(div);
            continue;
        }

        /* Verificar estado desde PHP */

        const estado = window.fechasReservadas?.[fechaStr];

        if(estado === "ocupado"){
            div.classList.add("ocupado");
            daysContainer.appendChild(div);
            continue;
        }else if(estado === "casi-lleno"){
            div.classList.add("casi-lleno");
            div.onclick = () =>{
                seleccionarDia(div);
                fechaSeleccionada = fechaObj;
            };
            daysContainer.appendChild(div);
            // continue;
        }else{
        /* Día disponible */
        div.classList.add("available");
        div.onclick = () => {
            seleccionarDia(div);
            fechaSeleccionada = fechaObj;
        };
        daysContainer.appendChild(div);
    }
}

}

/* =====================================
   CAMBIAR MES (ANIMACIÓN)
===================================== */

function cambiarMes(direccion){

    daysContainer.classList.add("fade");

    setTimeout(()=>{

        fecha.setMonth(fecha.getMonth() + direccion);
        cargarCalendario();

        daysContainer.classList.remove("fade");

    },200);

}

/* =====================================
   EVENTOS
===================================== */

prevBtn.addEventListener("click", ()=>cambiarMes(-1));
nextBtn.addEventListener("click", ()=>cambiarMes(1));

document.addEventListener("DOMContentLoaded", cargarCalendario);