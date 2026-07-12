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

// === ASIGNACIÓN DE COLORES EXCLUSIVOS POR RANGO ===
function obtenerColorRango(rango) {
  if (rango === "S+_Leitis") return "#0d47a1";   // Azul oscuro
  if (rango === "S_Boyardo") return "#1b5e20";   // Verde oscuro
  if (rango === "A+_Paladin") return "#4a148c";  // Morado
  if (rango === "A_Centurion") return "#e65100"; // Naranja oscuro
  if (rango === "B+_Campeon") return "#b71c1c";  // Rojo oscuro
  return "#222222";                              // Gris por defecto
}

// === LISTA ABAJO DETALLADA (SÍMBOLO + NOMBRE EN COLOR + RANGO) ===
function actualizarPanel() {
  const obtenerEmojiLista = (rango) => {
    if (rango === "S+_Leitis") return "⚔️";
    if (rango === "S_Boyardo") return "🛡️";
    if (rango === "A+_Paladin") return "⭐";
    if (rango === "A_Centurion") return "🎖️";
    if (rango === "B+_Campeon") return "🏆";
    return "🪵";
  };

  const formatearRango = (rango) => {
    if (rango === "S+_Leitis") return "S+ Leitis";
    if (rango === "S_Boyardo") return "S Boyardo";
    if (rango === "A+_Paladin") return "A+ Paladin";
    if (rango === "A_Centurion") return "A Centurion";
    if (rango === "B+_Campeon") return "B+ Campeon";
    return rango;
  };

  let htmlJugadores = "";
  seleccionados.forEach(jugador => {
    const color = obtenerColorRango(jugador.rango);
    htmlJugadores += `
      <div style="margin-bottom: 6px; font-size: 15px; display: flex; align-items: center; gap: 8px;">
        <span>${obtenerEmojiLista(jugador.rango)}</span>
        <strong style="color: ${color};">${jugador.nombre}</strong> 
        <span style="color: #666; font-size: 13px;">(${formatearRango(jugador.rango)})</span>
      </div>
    `;
  });

  const leyendaHTML = `
    <div style="margin-top: 20px; padding: 12px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; font-size: 14px; max-width: 400px; text-align: left;">
      <strong style="color: #333; display: block; margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px;">📊 Tabla de Valores:</strong>
      <div style="display: flex; flex-direction: column; gap: 5px;">
        <div style="color: #0d47a1;"><strong>⚔️ S+ Leitis:</strong> 5 Pts</div>
        <div style="color: #1b5e20;"><strong>🛡️ S Boyardo:</strong> 4 Pts</div>
        <div style="color: #4a148c;"><strong>⭐ A+ Paladin:</strong> 3 Pts</div>
        <div style="color: #e65100;"><strong>🎖️ A Centurion:</strong> 2 Pts</div>
        <div style="color: #b71c1c;"><strong>🏆 B+ Campeon:</strong> 1 Pts</div>
      </div>
    </div>
  `;

  selectedPlayersDiv.innerHTML = `
    <strong>Seleccionados (${seleccionados.size})</strong><br>
    <div style="margin-top: 10px;">${htmlJugadores}</div>
    ${leyendaHTML}
  `;
  
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

// === SECCIÓN DE ENCUENTROS CON COLORES E IDENTIFICADOR DE FILA ===
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

  resultadoEquipos.innerHTML = `
    <h3>Balanceo #${contadorBalanceos}</h3>
    <div class="teamContainer">
      <div class="teamBox">
        <h2>Team A (${puntosA} pts)</h2>
        <div style="font-size: 17px; line-height: 2.2; text-align: left; padding-left: 10px;">
          ${teamA.map((j, index) => {
            const color = obtenerColorRango(j.rango);
            return `${index + 1}. <strong style="color: ${color};">${j.nombre}</strong>`;
          }).join("<br>")}
        </div>
      </div>
      <div class="teamBox">
        <h2>Team B (${puntosB} pts)</h2>
        <div style="font-size: 17px; line-height: 2.2; text-align: left; padding-left: 10px;">
          ${teamB.map((j, index) => {
            const color = obtenerColorRango(j.rango);
            return `${index + 1}. <strong style="color: ${color};">${j.nombre}</strong>`;
          }).join("<br>")}
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