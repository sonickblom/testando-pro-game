/* =======================
   VARIÁVEIS
======================= */

let modoJogo = "historia";
let dia = 4;
let diasSobrevividos = 0;
let diaExecucao = 20;

let vivo = true;
let energia = 100;
let vida = 100;
let comida = 50;
let distancia = 350;

let climaAtual = "";
let proximoClima = "";

const logDiv = document.getElementById("log");
const acoesDiv = document.getElementById("acoes");

/* =======================
   FUNÇÕES DE TELA
======================= */

function print(texto) {
    logDiv.innerHTML += texto + "<br>";
    logDiv.scrollTop = logDiv.scrollHeight;
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

function gerarClima() {
    if (!proximoClima) proximoClima = sortearClima();
    climaAtual = proximoClima;
    proximoClima = sortearClima();
}

/* =======================
   AÇÕES
======================= */

function seguir() {
    distancia -= 40;
    energia -= 10;
    print("Você seguiu pela estrada.");

    if (Math.random() < 0.3) eventoBandidos();
}

function correr() {
    if (climaAtual === "Sol forte") {
        print("O sol forte impede a corrida.");
        return;
    }
    distancia -= 80;
    energia -= 20;
    print("Você correu.");

    if (Math.random() < 0.4) eventoBandidos();
}

function comer() {
    if (comida >= 5) {
        comida -= 5;
        energia = Math.min(energia + 20, 100);
        print("Você comeu.");
    } else {
        print("Sem comida.");
    }
}

function pescar() {
    if (climaAtual === "Tempestade") {
        print("A tempestade impede a pesca.");
        return;
    }
    let peixes = Math.floor(Math.random() * 5) + 1;
    comida += peixes * 5;
    print(`Você pescou ${peixes} peixe(s).`);
}

/* =======================
   COMBATE SIMPLES
======================= */

function eventoBandidos() {
    print("⚔️ Você foi atacado por bandidos!");
    acoesDiv.innerHTML = `
        <button onclick="lutar()">Lutar</button>
        <button onclick="fugir()">Fugir</button>
    `;
}

function lutar() {
    energia -= 20;
    vida -= Math.floor(Math.random() * 15);

    if (energia <= 0 || vida <= 0) {
        vivo = false;
        fimDeJogo();
        return;
    }

    print("Você venceu o combate!");
    botoesPadrao();
}

function fugir() {
    energia -= 15;
    print("Você conseguiu fugir.");
    botoesPadrao();
}

/* =======================
   CONTROLE DE TURNO
======================= */

function acao(tipo) {
    if (!vivo) return;

    if (tipo === "seguir") seguir();
    if (tipo === "correr") correr();
    if (tipo === "comer") comer();
    if (tipo === "pescar") pescar();

    avancarTempo();
    iniciarTurno();
}

function avancarTempo() {
    if (modoJogo === "historia") dia++;
    else diasSobrevividos++;
}

function iniciarTurno() {
    if (!vivo) return;

    gerarClima();
    print(`--- Dia ${dia} | Clima: ${climaAtual} ---`);

    if (energia <= 0 || vida <= 0 || distancia <= 0) {
        fimDeJogo();
    }
}

function fimDeJogo() {
    acoesDiv.innerHTML = "";
    if (!vivo) print("💀 Você morreu na jornada.");
    else print("🏆 Você chegou ao destino!");
}

/* =======================
   INÍCIO
======================= */

function iniciar() {
    print("Escolha o modo de jogo:");
    acoesDiv.innerHTML = `
        <button onclick="escolherModo('historia')">História</button>
        <button onclick="escolherModo('arcade')">Arcade</button>
    `;
}

function escolherModo(modo) {
    modoJogo = modo;
    dia = 4;
    energia = 100;
    vida = 100;
    comida = 50;
    distancia = 350;
    vivo = true;

    logDiv.innerHTML = "";
    botoesPadrao();
    iniciarTurno();
}

iniciar();