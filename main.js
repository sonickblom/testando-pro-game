/* =======================
   CONFIGURAÇÃO INICIAL
======================= */

let modoJogo = "historia"; // "historia" | "arcade"

let dia = 4;              // usado apenas no modo história
let diasSobrevividos = 0; // usado apenas no modo arcade
let diaExecucao = 20;

let vivo = true;

let energia = 100;
let vida = 100;
let comida = 50;
let dinheiro = 100;
let distancia = 350;

let eventosDiaAtual = [];
let eventosPassados = [];

let climaAtual = "";
let proximoClima = "";

let avisosPescaIgnorados = 0;

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

    if (climaAtual === "Sol forte") {
        eventosDiaAtual.push("Sol forte: correr está proibido hoje.");
    }

    if (climaAtual === "Frio intenso") {
        eventosDiaAtual.push("Frio intenso: você consome mais comida.");
    }

    if (climaAtual === "Tempestade") {
        eventosDiaAtual.push("Tempestade: a pesca é impossível.");
    }
}

/* =======================
   EVENTOS
======================= */

function eventoMercador() {
    eventosDiaAtual.push("Você encontrou um mercador viajante.");

    let escolha = prompt(
        "(1) Perguntar sobre o clima de amanhã\n(2) Ignorar"
    );

    if (escolha === "1") {
        eventosDiaAtual.push(
            `Mercador: amanhã o clima será "${proximoClima}".`
        );
    }
}

function eventoBandidos() {
    let qtd = Math.floor(Math.random() * 3) + 2;
    let inimigos = [];

    for (let i = 0; i < qtd; i++) {
        inimigos.push({ vida: 20, vidaMax: 20 });
    }

    eventosDiaAtual.push(`Você foi atacado por ${qtd} bandidos!`);

    let escolha = prompt("(L) Lutar\n(F) Fugir").toLowerCase();

    if (escolha === "f") {
        tentarFugir();
        return;
    }

    combate(inimigos);
}

/* =======================
   COMBATE
======================= */

function tentarFugir() {
    if (energia >= 20) {
        energia -= 20;
        eventosDiaAtual.push("Você conseguiu fugir do combate.");
    } else {
        eventosDiaAtual.push("Você tentou fugir, mas está exausto!");
    }
}

function combate(inimigos) {
    while (inimigos.length > 0 && energia > 0 && vida > 0) {

        let lista = inimigos.map((i, idx) =>
            `[${idx + 1}] Bandido [${i.vida}/${i.vidaMax}]`
        ).join("\n");

        let escolha = prompt(
            `${lista}\n\n(A) Atacar\n(F) Fugir`
        ).toLowerCase();

        if (escolha === "f") {
            tentarFugir();
            return;
        }

        let alvo = parseInt(prompt("Escolha o inimigo:")) - 1;
        if (!inimigos[alvo]) continue;

        if (energia < 10) {
            eventosDiaAtual.push("Sem energia para atacar!");
            break;
        }

        energia -= 10;
        let dano = Math.floor(Math.random() * 6) + 4;
        inimigos[alvo].vida -= dano;
        eventosDiaAtual.push(`Você causou ${dano} de dano.`);

        inimigos = inimigos.filter(i => i.vida > 0);

        inimigos.forEach(() => {
            let d = Math.floor(Math.random() * 4) + 3;
            vida -= d;
            eventosDiaAtual.push(`Você sofreu ${d} de dano.`);
        });
    }

    if (vida <= 0) vivo = false;
    else if (inimigos.length === 0) {
        dinheiro += 20;
        eventosDiaAtual.push("Você venceu o combate!");
    }
}

/* =======================
   AÇÕES
======================= */

function seguir() {
    distancia -= 40;
    energia -= 10;
    eventosDiaAtual.push("Você seguiu pela estrada.");

    if (Math.random() < 0.3) eventoBandidos();
    if (Math.random() < 0.15) eventoMercador();
}

function correr() {
    if (climaAtual === "Sol forte") {
        eventosDiaAtual.push("O sol forte impede a corrida.");
        return;
    }

    distancia -= 80;
    energia -= 20;
    eventosDiaAtual.push("Você correu.");

    if (Math.random() < 0.4) eventoBandidos();
}

function comer() {
    let custo = climaAtual === "Frio intenso" ? 10 : 5;

    if (comida >= custo) {
        comida -= custo;
        energia = Math.min(energia + 20, 100);
        eventosDiaAtual.push("Você comeu.");
    } else {
        eventosDiaAtual.push("Comida insuficiente.");

        if (avisosPescaIgnorados < 3) {
            eventosDiaAtual.push("Talvez pescar ajude.");
            avisosPescaIgnorados++;
        }
    }
}

function pescar() {
    if (climaAtual === "Tempestade") {
        eventosDiaAtual.push("A tempestade impede a pesca.");
        return;
    }

    let peixes = Math.floor(Math.random() * 5) + 1;
    comida += peixes * 5;
    eventosDiaAtual.push(`Você pescou ${peixes} peixe(s).`);
}

/* =======================
   LOOP PRINCIPAL
======================= */

function avancarTempo() {
    if (modoJogo === "historia") dia++;
    else diasSobrevividos++;
}

function loopJogo() {
    while (
        vivo &&
        (modoJogo === "arcade" || distancia > 0) &&
        (modoJogo === "arcade" || dia < diaExecucao)
    ) {

        gerarClima();

        let textoTopo =
            modoJogo === "historia"
                ? `Dia ${dia} | Clima: ${climaAtual}`
                : `Clima: ${climaAtual}`;

        let escolha = prompt(
            `${textoTopo}\n\n(1) Seguir\n(2) Correr\n(3) Comer\n(4) Pescar`
        );

        if (escolha === "1") seguir();
        if (escolha === "2") correr();
        if (escolha === "3") comer();
        if (escolha === "4") pescar();

        eventosPassados.push(...eventosDiaAtual);
        eventosDiaAtual = [];

        avancarTempo();

        if (energia <= 0 || vida <= 0) vivo = false;
    }

    if (!vivo && modoJogo === "arcade") {
        alert(`Fim de jogo! Você sobreviveu por ${diasSobrevividos} dias.`);
    } else {
        alert(vivo ? "Você chegou à capital!" : "Você morreu na jornada.");
    }
}

/* =======================
   INICIAR
======================= */

function iniciar() {
    let escolha = prompt(
        "Escolha o modo:\n1 - História\n2 - Arcade"
    );

    if (escolha === "2") {
        modoJogo = "arcade";
        diasSobrevividos = 0;
    } else {
        modoJogo = "historia";
        dia = 4;
    }

    loopJogo();
}

iniciar();
