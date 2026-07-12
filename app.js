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

  const obtenerEtiquetaRango = (rango) => {
    switch(rango) {
      case "S+_Leitis":
        return `<span style="background-color: #2e7d32; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-left: 5px;">⚔️ S+ Leitis</span>`;
      case "S_Boyardo":
        return `<span style="background-color: #1565c0; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-left: 5px;">🛡️ S Boyardo</span>`;
      case "A+_Paladin":
        return `<span style="background-color: #ef6c00; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-left: 5px;">⭐ A+ Paladin</span>`;
      case "A_Centurion":
        return `<span style="background-color: #f57c00; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-left: 5px;">🎖️ A Centurion</span>`;
      case "B+_Campeon":
        return `<span style="background-color: #757575; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-left: 5px;">🪵 B+ Campeon</span>`;
      default:
        return "";
    }
  };

  resultadoEquipos.innerHTML = `
    <h3>Balanceo #${contadorBalanceos}</h3>
    <div class="teamContainer">
      <div class="teamBox">
        <h2>Team A (${puntosA} pts)</h2>
        <div style="line-height: 2.2; font-size: 16px;">
          ${teamA.map(j => `<strong>${j.nombre}</strong> ${obtenerEtiquetaRango(j.rango)}`).join("<br>")}
        </div>
      </div>
      <div class="teamBox">
        <h2>Team B (${puntosB} pts)</h2>
        <div style="line-height: 2.2; font-size: 16px;">
          ${teamB.map(j => `<strong>${j.nombre}</strong> ${obtenerEtiquetaRango(j.rango)}`).join("<br>")}
        </div>
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