/* =======================
   VARIÁVEIS
======================= */

let dia = 4;
let diaExecucao = 20;

let vida = 100;
let energia = 100;
let comida = 50;
let dinheiro = 100;
let distancia = 350;
let vivo = true;

let climaAtual = "";

/* =======================
   ELEMENTOS
======================= */

const logDiv = document.getElementById("log");
const acoesDiv = document.getElementById("acoes");

/* =======================
   TELA
======================= */

function print(texto) {
    logDiv.innerHTML += texto + "<br>";
    logDiv.scrollTop = logDiv.scrollHeight;
}

function atualizarHUD() {
    document.getElementById("hud-dia").textContent = dia;
    document.getElementById("hud-clima").textContent = climaAtual;
    document.getElementById("hud-vida").textContent = vida;
    document.getElementById("hud-energia").textContent = energia;
    document.getElementById("hud-comida").textContent = comida;
    document.getElementById("hud-dinheiro").textContent = dinheiro;
    document.getElementById("hud-distancia").textContent = distancia;
    document.getElementById("hud-execucao").textContent = diaExecucao - dia;
}

function botoesPadrao() {
    acoesDiv.innerHTML = `
        <button onclick="acao('seguir')">Seguir</button>
        <button onclick="acao('correr')">Correr</button>
        <button onclick="acao('comer')">Comer</button>
        <button onclick="acao('pescar')">Pescar</button>
    `;
}

/* =======================
   CLIMA
======================= */

function sortearClima() {
    const r = Math.random();
    if (r < 0.6) return "Tempo normal";
    if (r < 0.75) return "Sol forte";
    if (r < 0.9) return "Frio intenso";
    return "Tempestade";
}

/* =======================
   AÇÕES
======================= */

function seguir() {
    distancia -= 40;
    energia -= 10;
    print("Você seguiu pela estrada.");
}

function correr() {
    energia -= 20;
    distancia -= 80;
    print("Você correu.");
}

function comer() {
    if (comida >= 5) {
        comida -= 5;
        energia = Math.min(energia + 20, 100);
        print("Você comeu.");
    } else {
        print("Sem comida suficiente.");
    }
}

function pescar() {
    let peixes = Math.floor(Math.random() * 5) + 1;
    comida += peixes * 5;
    print(`Você pescou ${peixes} peixe(s).`);
}

/* =======================
   TURNO
======================= */

function iniciarTurno() {
    climaAtual = sortearClima();
    print(`--- Dia ${dia} | Clima: ${climaAtual} ---`);
    atualizarHUD();
}

function acao(tipo) {
    if (!vivo) return;

    if (tipo === "seguir") seguir();
    if (tipo === "correr") correr();
    if (tipo === "comer") comer();
    if (tipo === "pescar") pescar();

    dia++;
    atualizarHUD();

    if (vida <= 0 || energia <= 0 || distancia <= 0 || dia >= diaExecucao) {
        fimDeJogo();
        return;
    }

    iniciarTurno();
}

function fimDeJogo() {
    acoesDiv.innerHTML = "";
    print("🏁 Fim da jornada.");
}

/* =======================
   INÍCIO
======================= */

botoesPadrao();
iniciarTurno();
