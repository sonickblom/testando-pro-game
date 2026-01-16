let dia = 4;
let energia = 100;
let distancia = 350;  // Distância total até a capital
let comida = 50;  // Começando com 50 pontos de comida
let dinheiro = 100;  // Começando com 100 de dinheiro
let diaExecucao = 20;
let vivo = true;
let vida = 100;  // Atributo de vida adicionado
let nomeViajante = ""; // Inicializar vazio
let historiaContada = false; // Flag para garantir que a história seja contada apenas uma vez
let eventosPassados = [];  // Histórico de eventos dos dias anteriores
let eventosDiaAtual = [];  // Lista temporária para eventos do dia atual (movida para global)

function introduzirHistoria() {
    if (!historiaContada) {
        console.log(`Hoje é o quarto dia do mês. Você acaba de receber a terrível notícia de que seu irmão foi condenado à forca na capital. A execução está marcada para o dia ${diaExecucao}, o que significa que você tem apenas ${diaExecucao - dia} dias para percorrer os ${distancia} quilômetros até lá e tentar salvá-lo. A estrada é longa e perigosa. O que você fará agora?`);
        historiaContada = true;
    }
}

function exibirStatus() {
    console.log(`========================================`);
    console.log(`Dia: ${dia}`);
    console.log(`Distância restante: ${distancia} km`);
    console.log(`Energia: ${energia}`);
    console.log(`Comida: ${comida}`);
    console.log(`Dinheiro: R$${dinheiro}`);
    console.log(`Vida: ${vida}`);  // Exibindo o status de vida
    console.log(`Dias até a execução: ${diaExecucao - dia}`);
    console.log(`========================================`);
}

function exibirPassado() {
    console.clear();
    console.log(eventosPassados.join('\n') + '\n\n--- Status Atual ---\n');
    exibirStatus();  // Mostra o status logo após o passado
}

function eventoBandidos() {
    let bandidos = Math.floor(Math.random() * 5) + 1; // Entre 1 e 5 bandidos
    eventosDiaAtual.push(`Você encontrou ${bandidos} bandidos no caminho!`);

    let acao = prompt("Você quer lutar ou ser roubado? (lutar/roubado)");

    if (acao.toLowerCase() === "lutar") {
        combateBandidos(bandidos);
    } else {
        let dinheiroRoubado = bandidos * 10;  // Cada bandido rouba 10 dinheiros
        dinheiro = Math.max(dinheiro - dinheiroRoubado, 0);
        eventosDiaAtual.push(`Você foi roubado e perdeu R$${dinheiroRoubado}.`);
    }
}

function combateBandidos(bandidos) {
    let vidaBandidos = 15;

    while (vidaBandidos > 0 && energia > 0 && vida > 0) {
        let tipoAtaque = prompt("Escolha seu ataque: normal (gasta 10 energia) ou forte (gasta 20 energia)?");
        let dano;

        if (tipoAtaque.toLowerCase() === "forte") {
            if (energia >= 20) {  // Verifica se há energia suficiente
                dano = Math.floor(Math.random() * 10) + 5;  // Dano entre 5 e 15
                energia -= 20;
            } else {
                eventosDiaAtual.push("Você não tem energia suficiente para um ataque forte!");
                continue;
            }
        } else {
            if (energia >= 10) {  // Verifica se há energia suficiente
                dano = Math.floor(Math.random() * 5) + 3;  // Dano entre 3 e 8
                energia -= 10;
            } else {
                eventosDiaAtual.push("Você não tem energia suficiente para um ataque normal!");
                continue;
            }
        }

        vidaBandidos -= dano;
        eventosDiaAtual.push(`Você causou ${dano} de dano. A vida dos bandidos é agora ${vidaBandidos}.`);

        if (vidaBandidos > 0) {
            let danoBandidos = Math.floor(Math.random() * 5) + 5;
            vida -= danoBandidos;
            eventosDiaAtual.push(`Os bandidos causaram ${danoBandidos} de dano. Sua vida é agora ${vida}.`);
        }
    }

    if (vida <= 0) {
        vivo = false;
        eventosDiaAtual.push("Você morreu em combate...");
    } else if (vidaBandidos <= 0) {
        dinheiro += bandidos * 10;  // Ganha 10 dinheiros por bandido derrotado
        eventosDiaAtual.push(`Você derrotou os bandidos e ganhou R$${bandidos * 10}!`);
    }
}

function eventoComerciante() {
    let acao = prompt("Você encontrou um comerciante. Deseja comprar 5 pontos de comida por 20 dinheiros? (sim/nao)");

    if (acao.toLowerCase() === "sim") {
        if (dinheiro >= 20) {
            comida += 5;
            dinheiro -= 20;
            eventosDiaAtual.push("Você comprou 5 pontos de comida.");
        } else {
            eventosDiaAtual.push("Você não tem dinheiro suficiente.");
        }
    } else {
        eventosDiaAtual.push("Você decidiu não comprar nada.");
    }
}

function seguirCaminho() {
    let distanciaPercorrida = 40;  // Aumentar a distância percorrida por dia
    distancia -= distanciaPercorrida;
    energia = Math.max(energia - 10, 0);  // Perde energia ao seguir caminho, evitando valores negativos
    eventosDiaAtual.push("Você seguiu seu caminho normalmente.");
    if (Math.random() < 0.3) {
        eventoBandidos();
    }
    if (Math.random() < 0.2) {
        eventoComerciante();
    }
}

function correr() {
    let distanciaPercorrida = 80;  // Aumentar a distância percorrida ao correr
    distancia -= distanciaPercorrida;
    energia = Math.max(energia - 20, 0);  // Perde energia ao correr, evitando valores negativos
    eventosDiaAtual.push("Você correu pelo caminho!");

    if (Math.random() < 0.5) {
        comida = Math.max(comida - 1, 0);  // Perde comida com 50% de chance
        eventosDiaAtual.push("Você perdeu uma comida enquanto corria!");
    }

    if (Math.random() < 0.4) {
        eventoBandidos();
    }
}

function descansar() {
    energia = Math.min(energia + 20, 100);
    eventosDiaAtual.push("Você descansou e recuperou energia.");
}

function comer() {
    if (comida >= 5) {
        energia = Math.min(energia + 20, 100);
        comida -= 5;
        eventosDiaAtual.push("Você comeu e recuperou energia.");
    } else {
        eventosDiaAtual.push("Você não tem comida suficiente para comer!");
    }
}

function pescar() {
    let peixes = Math.floor(Math.random() * 5) + 1; // Pesca de 1 a 5 peixes
    let dificuldade = 0.2 * peixes; // Aumenta a dificuldade
    if (Math.random() < dificuldade) {
        eventosDiaAtual.push(`Você conseguiu pescar ${peixes} peixe(s)!`);
        comida += peixes * 5; // Cada peixe equivale a 5 pontos de comida
    } else {
        eventosDiaAtual.push("Você não conseguiu pescar nada.");
    }
}

function avancarDia() {
    while (vivo && distancia > 0 && dia < diaExecucao) {
        exibirStatus();

        let acao = prompt("O que você deseja fazer? \n(1) Seguir\n(2) Correr\n(3) Descansar\n(4) Comer\n(5) Pescar");

        if (acao === "1" || acao.toLowerCase() === "seguir") {
            seguirCaminho();
        } else if (acao === "2" || acao.toLowerCase() === "correr") {
            correr();
        } else if (acao === "3" || acao.toLowerCase() === "descansar") {
            descansar();
        } else if (acao === "4" || acao.toLowerCase() === "comer") {
            comer();
        } else if (acao === "5" || acao.toLowerCase() === "pescar") {
            pescar();
        } else {
            eventosDiaAtual.push("Ação inválida, tente novamente.");
            continue;
        }

        dia++;

        // Mover eventos do dia atual para o passado
        eventosPassados.push(...eventosDiaAtual);
        eventosDiaAtual = [];

        if (distancia <= 0) {
            eventosPassados.push("Parabéns! Você chegou à capital e salvou seu irmão!");
            break;
        }

        if (dia >= diaExecucao) {
            eventosPassados.push("Infelizmente, você não conseguiu chegar a tempo. Seu irmão foi executado...");
            vivo = false;
        }

        if (comida <= 0) {
            energia = Math.max(energia - 5, 0);  // Reduz energia se a comida acabar, evitando valores negativos
            eventosPassados.push("Você ficou sem comida e perdeu 5 de energia!");
        }

        if (energia <= 0) {
            eventosPassados.push("Você não tem mais energia para continuar sua jornada.");
            vivo = false;
        }

        if (vida <= 0) {
            eventosPassados.push("Você morreu de ferimentos...");
            vivo = false;
        }
    }

    if (!vivo) {
        eventosPassados.push("Fim de jogo. Você não conseguiu completar a jornada.");
    }
}

function start() {
    nomeViajante = prompt("Qual o nome do(a) viajante?");
    introduzirHistoria();  // Exibir a história apenas uma vez no início
    avancarDia();  // Começar o loop do jogo
}