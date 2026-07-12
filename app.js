const playerList = document.getElementById("playerList");
const searchInput = document.getElementById("search");
const balanceBtn = document.getElementById("balanceBtn");
const rebalanceBtn = document.getElementById("rebalanceBtn");
const selectedPlayersDiv = document.getElementById("selectedPlayers");
const resultadoEquipos = document.getElementById("resultadoEquipos");
let jugadores = [];
let seleccionados = new Map();
let contadorBalanceos = 0;

fetch("jugadores.json")
  .then(response => response.json())
  .then(data => {
    console.log(data);
    jugadores = data;
    mostrarJugadores(jugadores);
  });

function mostrarJugadores(lista) {
  playerList.innerHTML = "";
  lista.forEach(jugador => {
    const div = document.createElement("div");
    const marcado = seleccionados.has(jugador.nombre) ? "checked" : "";
    div.innerHTML = `
      <label>
        <input
          type="checkbox"
          class="playerCheck"
          data-name="${jugador.nombre}"
          ${marcado}
        >
        ${jugador.nombre} (${jugador.rango})
      </label>
    `;
    playerList.appendChild(div);
  });
  activarEventos();
  actualizarPanel();
}

function activarEventos() {
  const checks = document.querySelectorAll(".playerCheck");
  checks.forEach(check => {
    check.addEventListener("change", () => {
      const nombre = check.dataset.name;
      if (check.checked) {
        const jugador = jugadores.find(j => j.nombre === nombre);
        seleccionados.set(nombre, jugador);
      } else {
        seleccionados.delete(nombre);
      }
      contadorBalanceos = 0;
      resultadoEquipos.innerHTML = "";
      rebalanceBtn.disabled = true;
      actualizarPanel();
    });
  });
}

const playerList = document.getElementById("playerList");
const searchInput = document.getElementById("search");
const balanceBtn = document.getElementById("balanceBtn");
const rebalanceBtn = document.getElementById("rebalanceBtn");
const selectedPlayersDiv = document.getElementById("selectedPlayers");
const resultadoEquipos = document.getElementById("resultadoEquipos");
let jugadores = [];
let seleccionados = new Map();
let contadorBalanceos = 0;

fetch("jugadores.json")
  .then(response => response.json())
  .then(data => {
    console.log(data);
    jugadores = data;
    mostrarJugadores(jugadores);
  });

function mostrarJugadores(lista) {
  playerList.innerHTML = "";
  lista.forEach(jugador => {
    const div = document.createElement("div");
    const marcado = seleccionados.has(jugador.nombre) ? "checked" : "";
    div.innerHTML = `
      <label>
        <input
          type="checkbox"
          class="playerCheck"
          data-name="${jugador.nombre}"
          ${marcado}
        >
        ${jugador.nombre} (${jugador.rango})
      </label>
    `;
    playerList.appendChild(div);
  });
  activarEventos();
  actualizarPanel();
}

function activarEventos() {
  const checks = document.querySelectorAll(".playerCheck");
  checks.forEach(check => {
    check.addEventListener("change", () => {
      const nombre = check.dataset.name;
      if (check.checked) {
        const jugador = jugadores.find(j => j.nombre === nombre);
        seleccionados.set(nombre, jugador);
      } else {
        seleccionados.delete(nombre);
      }
      contadorBalanceos = 0;
      resultadoEquipos.innerHTML

searchInput.addEventListener("input", () => {
  const texto = searchInput.value.toLowerCase();
  const filtrados = jugadores.filter(jugador =>
    jugador.nombre.toLowerCase().includes(texto)
  );
  mostrarJugadores(filtrados);
});

function puntosRango(rango) {
  if (rango === "S+_Leitis") return 5;
  if (rango === "S_Boyardo") return 4;
  if (rango === "A+_Paladin") return 3;
  if (rango === "A_Centurion") return 2;
  if (rango === "B+_Campeon") return 1;
  return 0;
}

function generarEquipos() {
  contadorBalanceos++;
  const lista = [...seleccionados.values()];
  
  // Mezcla aleatoria inicial
  lista.sort(() => Math.random() - 0.5);
  
  // Ordena por jerarquía de rango (Mayor a menor)
  lista.sort((a, b) => puntosRango(b.rango) - puntosRango(a.rango));

  const teamA = [];
  const teamB = [];
  let puntosA = 0;
  let puntosB = 0;

  // Distribución equitativa por peso
  lista.forEach(jugador => {
    const puntos = puntosRango(jugador.rango);
    if (puntosA <= puntosB) {
      teamA.push(jugador);
      puntosA += puntos;
    } else {
      teamB.push(jugador);
      puntosB += puntos;
    }
  });

  // El resultado mostrará SOLAMENTE el Nombre en negrita dentro del Team para máxima limpieza
  resultadoEquipos.innerHTML = `
    <h3>Balanceo #${contadorBalanceos}</h3>
    <div class="teamContainer">
      <div class="teamBox">
        <h2>Team A (${puntosA} pts)</h2>
        <div style="font-size: 17px; line-height: 2.2; color: #222; text-align: left; padding-left: 10px;">
          ${teamA.map(j => `<strong>${j.nombre}</strong>`).join("<br>")}
        </div>
      </div>
      <div class="teamBox">
        <h2>Team B (${puntosB} pts)</h2>
        <div style="font-size: 17px; line-height: 2.2; color: #222; text-align: left; padding-left: 10px;">
          ${teamB.map(j => `<strong>${j.nombre}</strong>`).join("<br>")}
        </div>
      </div>
    </div>
  `;
  rebalanceBtn.disabled = false;
}

// Activadores directos estándar para asegurar compatibilidad en PC y móvil
balanceBtn.addEventListener("click", generarEquipos);
rebalanceBtn.addEventListener("click", generarEquipos);