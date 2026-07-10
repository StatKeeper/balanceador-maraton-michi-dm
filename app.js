const playerList = document.getElementById("playerList");
const searchInput = document.getElementById("search");
const balanceBtn = document.getElementById("balanceBtn");
const rebalanceBtn = document.getElementById("rebalanceBtn");
const selectedPlayersDiv = document.getElementById("selectedPlayers");
const resultadoEquipos = document.getElementById("resultadoEquipos");
let jugadores = [];
let seleccionados = new Map();
let contadorBalanceos = 0;

fetch("players.json")
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

    const marcado = seleccionados.has(jugador.nombre)
      ? "checked"
      : "";

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

  const jugador = jugadores.find(
    j => j.nombre === nombre
  );

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

function actualizarPanel() {

  selectedPlayersDiv.innerHTML =
    `<strong>Seleccionados (${seleccionados.size})</strong><br>` +
  [...seleccionados.keys()].join("<br>");

  balanceBtn.disabled =
    !(seleccionados.size === 6 || seleccionados.size === 8);
    if (contadorBalanceos === 0) {
    rebalanceBtn.disabled = true;
  }
}

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

  lista.sort(() => Math.random() - 0.5);

  lista.sort((a, b) =>
    puntosRango(b.rango) - puntosRango(a.rango)
  );

  const teamA = [];
  const teamB = [];

  let puntosA = 0;
  let puntosB = 0;

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

  resultadoEquipos.innerHTML = `
    <h3>Balanceo #${contadorBalanceos}</h3>

    <div class="teamContainer">

      <div class="teamBox">
        <h2>Team A (${puntosA} pts)</h2>

        ${teamA.map(j =>
          `${j.nombre} (${j.rango})`
        ).join("<br>")}
      </div>

      <div class="teamBox">
        <h2>Team B (${puntosB} pts)</h2>

        ${teamB.map(j =>
          `${j.nombre} (${j.rango})`
        ).join("<br>")}
      </div>

    </div>
  `;

  rebalanceBtn.disabled = false;
}
balanceBtn.addEventListener("click", () => {
  generarEquipos();
});

rebalanceBtn.addEventListener("click", () => {
  generarEquipos();
});