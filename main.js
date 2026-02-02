let dia = 4;
let energia = 100;
let distancia = 350;
let comida = 50;
let dinheiro = 100;
let diaExecucao = 20;
let vivo = true;
let vida = 100;
let nomeViajante = "";
let historiaContada = false;

let modoJogo = "historia"; // "historia" ou "arcade"
let diasSobrevividos = 0;

let eventosPassados = [];
let eventosDiaAtual = [];
let climaAtual = "";
let forcarDescanso = false;

// Forçar escopo global para evitar erros
window.eventosDiaAtual = eventosDiaAtual;
window.eventosPassados = eventosPassados;

function introduzirHistoria() {
    if (!historiaContada) {
        console.log(
            `Hoje é o quarto dia do mês. Você acaba de receber a terrível notícia ` +
            `de que seu irmão foi condenado à forca na capital. A execução está marcada ` +
            `para o dia ${diaExecucao}. Você precisa correr contra o tempo.`
        );
        historiaContada = true;
    }
}

function exibirStatus() {
    try {
        let statusTexto = `========================================\n`;
        statusTexto += eventosPassados.join('\n') + '\n\n--- Status Atual ---\n';
        statusTexto += `========================================\n`;
        statusTexto += `Dia: ${dia}\n`;
        statusTexto += `Energia: ${energia}\n`;
        statusTexto += `Comida: ${comida}\n`;
        statusTexto += `Dinheiro: R$${dinheiro}\n`;
        statusTexto += `Vida: ${vida}\n`;
        statusTexto += `Clima: ${climaAtual}\n`;

        if (modoJogo === "historia") {
            statusTexto += `Distância restante: ${distancia} km\n`;
            statusTexto += `Dias até a execução: ${diaExecucao - dia}\n`;
        } else {
            statusTexto += `Modo: Arcade\n`;
            statusTexto += `Dias sobrevividos: ${diasSobrevividos}\n`;
        }

        statusTexto += `========================================`;

        const statusDiv = document.getElementById('statusDisplay');
        if (statusDiv) {
            statusDiv.innerText = statusTexto;
        }

        console.clear();
        console.log(statusTexto);
    } catch (e) {
        console.error('Erro em exibirStatus:', e);
    }
}

function gerarClima() {
    const rand = Math.random();
    let climaEscolhido;

    if (rand < 0.7) {
        climaEscolhido = { nome: "Tempo normal", efeito: "nenhum", popup: "Clima normal hoje." };
    } else if (rand < 0.85) {
        climaEscolhido = { nome: "Sol forte", efeito: "reduzEnergia", popup: "Sol forte! Você perde energia." };
    } else {
        climaEscolhido = { nome: "Frio intenso", efeito: "reduzEnergia", popup: "Frio intenso! Você perde energia." };
    }

    climaAtual = climaEscolhido.nome;
    mostrarModal(climaEscolhido.popup);

    if (climaEscolhido.efeito === "reduzEnergia") {
        energia = Math.max(energia - 5, 0);
    }
}

function mostrarModal(mensagem) {
    const modal = document.getElementById('modal');
    const modalTexto = document.getElementById('modalTexto');

    if (modal && modalTexto) {
        modalTexto.innerText = mensagem;
        modal.style.display = 'block';
        setTimeout(() => modal.style.display = 'none', 3000);
    } else {
        alert(mensagem);
    }
}

function eventoBandidos() {
    let bandidos = Math.floor(Math.random() * 5) + 1;
    eventosDiaAtual.push(`Você encontrou ${bandidos} bandidos!`);

    let acao = prompt("Você quer lutar ou ser roubado? (lutar/roubado)");

    if (acao.toLowerCase() === "lutar") {
        combateBandidos(bandidos);
    } else {
        let dinheiroRoubado = bandidos * 10;
        dinheiro = Math.max(dinheiro - dinheiroRoubado, 0);
        eventosDiaAtual.push(`Você perdeu R$${dinheiroRoubado}.`);
    }
}

function combateBandidos(bandidos) {
    let vidaBandidos = 15;
    let turnos = 0;

    while (vidaBandidos > 0 && energia > 0 && vida > 0 && turnos < 10) {
        let ataque = prompt("Ataque normal ou forte?");
        let dano = 0;

        if (ataque === "forte" && energia >= 20) {
            dano = Math.floor(Math.random() * 10) + 5;
            energia -= 20;
        } else if (energia >= 10) {
            dano = Math.floor(Math.random() * 5) + 3;
            energia -= 10;
        } else {
            eventosDiaAtual.push("Sem energia para atacar!");
            break;
        }

        vidaBandidos -= dano;
        eventosDiaAtual.push(`Você causou ${dano} de dano.`);

        if (vidaBandidos > 0) {
            let danoBandidos = Math.floor(Math.random() * 5) + 5;
            vida -= danoBandidos;
            eventosDiaAtual.push(`Você recebeu ${danoBandidos} de dano.`);
        }

        turnos++;
    }

    if (vida <= 0) {
        vivo = false;
    } else if (vidaBandidos <= 0) {
        dinheiro += bandidos * 10;
        eventosDiaAtual.push("Você venceu os bandidos!");
    }
}

function seguirCaminho() {
    if (forcarDescanso) return;

    if (modoJogo === "historia") {
        distancia -= 40;
    }

    energia = Math.max(energia - 10, 0);
    eventosDiaAtual.push("Você seguiu pelo caminho.");

    if (Math.random() < 0.3) eventoBandidos();
}

function correr() {
    if (forcarDescanso) return;

    if (modoJogo === "historia") {
        distancia -= 80;
    }

    energia = Math.max(energia - 20, 0);
    eventosDiaAtual.push("Você correu.");

    if (Math.random() < 0.4) eventoBandidos();
}

function descansar() {
    energia = Math.min(energia + 20, 100);
    eventosDiaAtual.push("Você descansou.");
    forcarDescanso = false;
}

function comer() {
    if (comida >= 5) {
        comida -= 5;
        energia = Math.min(energia + 20, 100);
        eventosDiaAtual.push("Você comeu.");
    }
}

function pescar() {
    let peixes = Math.floor(Math.random() * 5) + 1;
    comida += peixes * 5;
    eventosDiaAtual.push(`Você pescou ${peixes} peixe(s).`);
}

function avancarDia() {
    while (
        vivo &&
        (modoJogo === "arcade" || distancia > 0) &&
        (modoJogo === "arcade" || dia < diaExecucao)
    ) {
        gerarClima();
        exibirStatus();

        let acao = prompt(
            "(1) Seguir\n(2) Correr\n(3) Descansar\n(4) Comer\n(5) Pescar"
        );

        if (acao === "1") seguirCaminho();
        else if (acao === "2") correr();
        else if (acao === "3") descansar();
        else if (acao === "4") comer();
        else if (acao === "5") pescar();
        else continue;

        dia++;

        if (modoJogo === "arcade") {
            diasSobrevividos++;
        }

        eventosPassados.push(...eventosDiaAtual);
        eventosDiaAtual = [];

        if (energia <= 0 || vida <= 0) {
            vivo = false;
        }

        if (modoJogo === "historia" && distancia <= 0) {
            eventosPassados.push("Você chegou à capital e salvou seu irmão!");
            break;
        }

        if (modoJogo === "historia" && dia >= diaExecucao) {
            eventosPassados.push("Você chegou tarde demais...");
            vivo = false;
        }
    }

    if (!vivo) {
        if (modoJogo === "arcade") {
            eventosPassados.push(
                `Fim de jogo! Você sobreviveu por ${diasSobrevividos} dias no modo Arcade.`
            );
        } else {
            eventosPassados.push("Fim de jogo.");
        }

        exibirStatus();
    }
}

function start() {
    nomeViajante = prompt("Qual o nome do(a) viajante?");

    let escolha = prompt(
        "Escolha o modo de jogo:\n" +
        "1 - História\n" +
        "2 - Arcade"
    );

    if (escolha === "2") {
        modoJogo = "arcade";
        console.log("Modo Arcade iniciado!");
    } else {
        modoJogo = "historia";
        introduzirHistoria();
    }

    avancarDia();
}
