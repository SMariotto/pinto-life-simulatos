let pontos = 0;
let poder = 1;

let pintinhos = 0;
let pps = 0;

let upgradeCost = 10;
let chickenCost = 5; // mais barato como você pediu

let raros = [];

const dog = document.getElementById("dog");
const score = document.getElementById("score");
const power = document.getElementById("power");
const chickens = document.getElementById("chickens");
const ppsText = document.getElementById("pps");
const galinheiro = document.getElementById("galinheiro");
const mensagem = document.getElementById("mensagem");

// clique
dog.onclick = () => {
    pontos += poder;
    atualizarTela();

    if (Math.random() < 0.08) { // aumentei chance 😈
        ganharRaro();
    }
};

// upgrade
function comprarUpgrade() {
    if (pontos >= upgradeCost) {
        pontos -= upgradeCost;
        poder++;
        upgradeCost = Math.floor(upgradeCost * 1.4);
        atualizarTela();
    }
}

// comprar pintinho
function comprarPintinho() {
    if (pontos >= chickenCost) {
        pontos -= chickenCost;
        pintinhos++;
        pps += 1;
        chickenCost = Math.floor(chickenCost * 1.2);
        atualizarTela();
    }
}

// CRIAR RARO VISUAL
function ganharRaro() {
    let tipos = ["dourado", "mutante", "rei"];
    let tipo = tipos[Math.floor(Math.random() * tipos.length)];

    let bonus = Math.floor(Math.random() * 3) + 2;
    pps += bonus;

    raros.push(tipo);
    mensagem.textContent = "🌟 Raro: " + tipo.toUpperCase() + " +" + bonus + " PPS";

    criarRaroVisual(tipo);
}

// MOSTRAR NA TELA
function criarRaroVisual(tipo) {
    let span = document.createElement("span");
    span.style.fontSize = "30px";
    span.style.margin = "5px";

    if (tipo === "dourado") {
        span.textContent = "🐥✨";
    }

    if (tipo === "mutante") {
        span.textContent = "🟢🐥";
    }

    if (tipo === "rei") {
        span.textContent = "👑🐥";
    }

    galinheiro.appendChild(span);
}

// código
function usarCodigo() {
    let codigo = document.getElementById("codigoInput").value.toUpperCase();

    if (codigo === "DOG100") {
        pontos += 100;
        mensagem.textContent = "💰 +100 pontos!";
    } else if (codigo === "RARO") {
        ganharRaro();
    } else if (codigo === "REI") {
        criarRaroVisual("rei");
        pps += 5;
        mensagem.textContent = "👑 Rei liberado!";
    } else if (codigo === "MUTANTE") {
        criarRaroVisual("mutante");
        pps += 4;
        mensagem.textContent = "🟢 Mutante liberado!";
    } else if (codigo === "OURO") {
        criarRaroVisual("dourado");
        pps += 6;
        mensagem.textContent = "✨ Dourado liberado!";
    } else {
        mensagem.textContent = "❌ Código inválido!";
    }

    atualizarTela();
}

// UI
function atualizarTela() {
    score.textContent = pontos;
    power.textContent = poder;
    chickens.textContent = pintinhos;
    ppsText.textContent = pps;

    document.getElementById("upgradeCost").textContent = upgradeCost;
    document.getElementById("chickenCost").textContent = chickenCost;

    atualizarGalinheiroBase();
}

// pintinhos normais
function atualizarGalinheiroBase() {
    let base = "";

    let max = Math.min(pintinhos, 30);

    for (let i = 0; i < max; i++) {
        base += "🐥";
    }

    if (pintinhos >= 50) {
        base = "🏡<br>" + base;
    }

    galinheiro.innerHTML = base;

    // re-render raros
    raros.forEach(tipo => {
        criarRaroVisual(tipo);
    });
}

// produção automática
setInterval(() => {
    pontos += pps;
    atualizarTela();
}, 1000);