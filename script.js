// script.js - Atualização de Upgrades e Expansão de Códigos
let pontos = 0;
let poder = 1;
let pps = 0;
let chanceRaro = 0.15; // 15% inicial

// Custos iniciais dos Upgrades
let upgradeCost = 10;
let chickenCost = 15;
let granjaCost = 150;
let milhoCost = 500;
let hormonioCost = 1200;
let sorteCost = 2000;

// Multiplicador global vindo de upgrades
let multiplicadorPPS = 1;

const pintosVisuais = [];

function obterPintoLocalAleatorio() {
    const numeroAleatorio = Math.floor(Math.random() * 7) + 1;
    return `assets/pinto${numeroAleatorio}.png`;
}

const dog = document.getElementById("dog");
const score = document.getElementById("score");
const chickensText = document.getElementById("chickens");
const ppsText = document.getElementById("pps");
const critChanceText = document.getElementById("critChance");
const galinheiro = document.getElementById("galinheiro");
const mensagem = document.getElementById("mensagem");

// --- FUNÇÃO DE CLIQUE E SPAWN ---
function executarClique() {
    pontos += poder;
    atualizarTela();
    
    if (Math.random() < chanceRaro) { 
        ganharRaro();
    }

    spawnPintosExplosao(6); 
}

dog.onclick = executarClique;

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault(); 
        executarClique();
    }
});

function spawnPintosExplosao(quantidade) {
    const dogRect = dog.getBoundingClientRect();
    const startX = dogRect.left + dogRect.width / 2 - 15;
    const startY = dogRect.top + dogRect.height / 2 - 15;

    for (let i = 0; i < quantidade; i++) {
        const pinto = document.createElement('img');
        pinto.src = obterPintoLocalAleatorio();
        pinto.className = 'jump-pinto';
        pinto.style.left = `${startX}px`;
        pinto.style.top = `${startY}px`;
        
        document.body.appendChild(pinto);

        const angulo = Math.random() * Math.PI * 2;
        const velocidade = 5 + Math.random() * 6;
        let velX = Math.cos(angulo) * velocidade;
        let velY = Math.sin(angulo) * velocidade - 9; 

        const gravidade = 0.6;
        let posX = startX;
        let posY = startY;

        const loopAnimacao = setInterval(() => {
            velY += gravidade;
            posX += velX;
            posY += velY;
            pinto.style.left = `${posX}px`;
            pinto.style.top = `${posY}px`;
        }, 25);

        setTimeout(() => {
            clearInterval(loopAnimacao);
            if(pinto.parentNode) pinto.parentNode.removeChild(pinto);
        }, 1200);
    }
}

// --- CORE DOS NOVOS UPGRADES ---

// 1. Poder de Clique Tradicional
function comprarUpgrade() {
    if (pontos >= upgradeCost) {
        pontos -= upgradeCost;
        poder++;
        upgradeCost = Math.floor(upgradeCost * 1.4);
        atualizarTela();
    }
}

// 2. Comprar Pinto Comum
function comprarPintinho() {
    if (pontos >= chickenCost) {
        pontos -= chickenCost;
        pps += 1 * multiplicadorPPS;
        spawnPintoAndanteLocal();
        chickenCost = Math.floor(chickenCost * 1.25);
        atualizarTela();
    }
}

// 3. Granja Automática (Gera muito PPS bruto)
function comprarGranjaAutomatica() {
    if (pontos >= granjaCost) {
        pontos -= granjaCost;
        pps += 8 * multiplicadorPPS;
        for (let i = 0; i < 3; i++) spawnPintoAndanteLocal(); // Spawna 3 de vez andando
        granjaCost = Math.floor(granjaCost * 1.5);
        atualizarTela();
        mostrarMensagem("🚜 Setor de automação da granja expandido!");
    }
}

// 4. Super Milho (Aumenta o multiplicador global de ganho passivo)
function comprarSuperMilho() {
    if (pontos >= milhoCost) {
        pontos -= milhoCost;
        multiplicadorPPS += 1; // Soma +1 ao multiplicador passivo de tudo
        pps += 10; 
        milhoCost = Math.floor(milhoCost * 2);
        atualizarTela();
        mostrarMensagem("🌽 Os frangos comeram ração modificada! PPS aumentado!");
    }
}

// 5. Hormônio de Crescimento (Dobra o poder do seu clique atual)
function comprarTreinamentoGalo() {
    if (pontos >= hormonioCost) {
        pontos -= hormonioCost;
        poder = Math.floor(poder * 2) + 2;
        hormonioCost = Math.floor(hormonioCost * 1.8);
        atualizarTela();
        mostrarMensagem("💉 Mutação Genética! Seu clique ficou monstruoso!");
    }
}

// 6. Sorte Suprema (Aumenta a chance de críticos/raros nascerem nos cliques)
function comprarSorteSuprema() {
    if (pontos >= sorteCost && chanceRaro < 0.70) { // Limite de 70% de chance para balanceamento
        pontos -= sorteCost;
        chanceRaro += 0.05; // +5% de chance por compra
        sorteCost = Math.floor(sorteCost * 1.6);
        atualizarTela();
        mostrarMensagem("🍀 Trevo de quatro folhas! Raros aparecem mais fácil!");
    }
}

function spawnPintoAndanteLocal() {
    const pinto = document.createElement('img');
    pinto.src = obterPintoLocalAleatorio();
    pinto.className = 'visual-pinto';
    
    pinto.style.left = `${Math.random() * 90}vw`;
    pinto.style.top = `${Math.random() * 82}vh`;
    
    galinheiro.appendChild(pinto);
    pintosVisuais.push(pinto);

    setInterval(() => {
        const dX = (Math.random() - 0.5) * 35; 
        const dY = (Math.random() - 0.5) * 35;
        
        let nX = parseFloat(pinto.style.left) + (dX / window.innerWidth) * 100;
        let nY = parseFloat(pinto.style.top) + (dY / window.innerHeight) * 100;
        
        pinto.style.left = `${Math.max(2, Math.min(92, nX))}vw`;
        pinto.style.top = `${Math.max(2, Math.min(85, nY))}vh`;
    }, 1700 + Math.random() * 500);
}

function ganarRaro() {
    let bonus = Math.floor(Math.random() * 5) + 5; // Bônus base de 5 a 9 pps
    pps += bonus * multiplicadorPPS;
    mostrarMensagem(`🌟 CRÍTICO: Um pinto raro dropou (+${bonus} PPS)!`);
    spawnPintoAndanteLocal();
}

function mostrarMensagem(txt) {
    mensagem.textContent = txt;
}

// --- CENTRAL DE CÓDIGOS REFORÇADA ---
function usarCodigo() {
    let codigo = document.getElementById("codigoInput").value.trim().toUpperCase();
    document.getElementById("codigoInput").value = "";

    if (codigo === "DOG100") {
        pontos += 100;
        mostrarMensagem("💰 +100 pontos na carteira!");
    } else if (codigo === "GRANJA") {
        pps += 50;
        for(let i = 0; i < 15; i++) spawnPintoAndanteLocal();
        mostrarMensagem("🚜 Invasão aviária! 15 pintos gigantes adicionados!");
    } else if (codigo === "PIXDOREI") {
        pontos += 50000;
        poder += 30;
        pps += 60;
        spawnPintoAndanteLocal();
        mostrarMensagem("💸 O Rei mandou um Pix de R$50.000 para a fazenda!");
    } else if (codigo === "PINTOSVOADORES") {
        poder += 15;
        setInterval(() => spawnPintosExplosao(3), 120); 
        mostrarMensagem("☁️ Tempestade contínua de aves!");
    } else if (codigo === "APOCALYPSE") {
        pontos = 0; poder = 1; pps = 0; chanceRaro = 0.15;
        upgradeCost = 10; chickenCost = 15; granjaCost = 150; milhoCost = 500; hormonioCost = 1200; sorteCost = 2000; multiplicadorPPS = 1;
        while (galinheiro.firstChild) galinheiro.removeChild(galinheiro.firstChild);
        pintosVisuais.length = 0;
        mostrarMensagem("💀 Fim dos tempos. Tudo devastado.");
    } 
    // --- NOVOS CÓDIGOS ADICIONADOS ---
    else if (codigo === "CAOS999") {
        pontos += 999999;
        mostrarMensagem("🔥 Capitalismo selvagem ativado! Quase 1 milhão de pontos!");
    } else if (codigo === "HACKERMON") {
        poder += 500;
        mostrarMensagem("💻 Sistema invadido: +500 de Poder de Clique!");
    } else if (codigo === "SORTUDO") {
        chanceRaro = 0.65;
        mostrarMensagem("🍀 Hack de Probabilidade! Chance de Raros travada em 65%!");
    } else if (codigo === "CHICKENOVERFLOW") {
        pps += 1500;
        for(let i = 0; i < 40; i++) spawnPintoAndanteLocal();
        mostrarMensagem("💥 OVERFLOW! 40 frangos gigantes inundaram o cenário!");
    } else {
        mostrarMensagem("❌ Código incorreto, fiote!");
    }

    setTimeout(() => { mensagem.textContent = ""; }, 4000);
    atualizarTela();
}

function atualizarTela() {
    score.textContent = pontos;
    document.getElementById("power").textContent = poder;
    chickensText.textContent = pintosVisuais.length;
    ppsText.textContent = pps;
    critChanceText.textContent = Math.round(chanceRaro * 100);
    
    // Atualização dos textos de custo nos botões
    document.getElementById("upgradeCost").textContent = upgradeCost;
    document.getElementById("chickenCost").textContent = chickenCost;
    document.getElementById("granjaCost").textContent = granjaCost;
    document.getElementById("milhoCost").textContent = milhoCost;
    document.getElementById("hormonioCost").textContent = hormonioCost;
    document.getElementById("sorteCost").textContent = sorteCost;
}

// Loop de produção por segundo do PPS
setInterval(() => {
    pontos += pps;
    atualizarTela();
}, 1000);