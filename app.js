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

function actualizarPanel() {
  selectedPlayersDiv.innerHTML =
    `<strong>Seleccionados (${seleccionados.size})</strong><br>` +
    [...seleccionados.keys()].join("<br>");
  
  // Habilita el botón solo si hay 6 u 8 jugadores seleccionados
  balanceBtn.disabled = !(seleccionados.size === 6 || seleccionados.size === 8);
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
  lista.sort((a, b) => puntosRango(b.rango) - puntosRango(a.rango));

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

  // Etiquetas más compactas con un ancho controlado para evitar que se rompan en el móvil
  const obtenerEtiquetaRango = (rango) => {
    let color = "#757575";
    let texto = rango;
    let emoji = "🪵";

    if (rango === "S+_Leitis") { color = "#2e7d32"; texto = "S+ Leitis"; emoji = "⚔️"; }
    else if (rango === "S_Boyardo") { color = "#1565c0"; texto = "S Boyardo"; emoji = "🛡️"; }
    else if (rango === "A+_Paladin") { color = "#ef6c00"; texto = "A+ Paladín"; emoji = "⭐"; }
    else if (rango === "A_Centurion") { color = "#f57c00"; texto = "A Centurión"; emoji = "🎖️"; }
    else if (rango === "B+_Campeon") { color = "#5d4037"; texto = "B+ Campeón"; emoji = "🏆"; }

    return `<span style="background-color: ${color}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: bold; display: inline-block; white-space: nowrap;">${emoji} ${texto}</span>`;
  };

  // Se añade flexbox para alinear perfectamente el nombre y el rango en una sola fila
  resultadoEquipos.innerHTML = `
    <h3>Balanceo #${contadorBalanceos}</h3>
    <div class="teamContainer">
      <div class="teamBox">
        <h2>Team A (${puntosA} pts)</h2>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
          ${teamA.map(j => `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 4px;">
              <span style="font-size: 15px; font-weight: bold; color: #333;">${j.nombre}</span>
              ${obtenerEtiquetaRango(j.rango)}
            </div>
          `).join("")}
        </div>
      </div>
      <div class="teamBox">
        <h2>Team B (${puntosB} pts)</h2>
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
          ${teamB.map(j => `
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 4px;">
              <span style="font-size: 15px; font-weight: bold; color: #333;">${j.nombre}</span>
              ${obtenerEtiquetaRango(j.rango)}
            </div>
          `).join("")}
        </div>
      </div>
    </div>
  `;
  rebalanceBtn.disabled = false;
}