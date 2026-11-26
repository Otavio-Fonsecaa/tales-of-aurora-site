// ─── menu lateral ───────────────────────────────────
const btnMenu     = document.getElementById('btnMenu');
const btnFechar   = document.getElementById('btnFechar');
const menuLateral = document.getElementById('menuLateral');

function abrirMenu() {
    menuLateral.classList.add('aberto');
    btnMenu.setAttribute('aria-expanded', 'true');
}

function fecharMenu() {
    menuLateral.classList.remove('aberto');
    btnMenu.setAttribute('aria-expanded', 'false');
}

if (btnMenu && btnFechar && menuLateral) {
    btnMenu.addEventListener('click', abrirMenu);
    btnFechar.addEventListener('click', fecharMenu);

    // fecha ao clicar em qualquer link do menu
    menuLateral.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', fecharMenu);
    });

    // fecha com a tecla Esc
    document.addEventListener('keydown', evento => {
        if (evento.key === 'Escape') fecharMenu();
    });
}

// ─── carrossel do mundo ─────────────────────────────
const faixa    = document.getElementById('faixa');
const anterior = document.getElementById('anterior');
const proximo  = document.getElementById('proximo');

let indice = 0;

function mostrarCenario() {
    faixa.style.transform = `translateX(-${indice * 100}%)`;
}

function irParaProximo() {
    indice = (indice + 1) % faixa.children.length;
    mostrarCenario();
}

function irParaAnterior() {
    indice = (indice - 1 + faixa.children.length) % faixa.children.length;
    mostrarCenario();
}

if (faixa && anterior && proximo) {
    proximo.addEventListener('click', irParaProximo);
    anterior.addEventListener('click', irParaAnterior);
}

// ─── copiar chave PIX ───────────────────────────────
const btnCopiarPix = document.getElementById('btnCopiarPix');
const chavePix     = document.getElementById('chavePix');

async function copiarPix() {
    const textoOriginal = btnCopiarPix.textContent;

    try {
        await navigator.clipboard.writeText(chavePix.textContent.trim());
        btnCopiarPix.textContent = 'Copiado!';
    } catch (erro) {
        btnCopiarPix.textContent = 'Não foi possível copiar';
    }

    setTimeout(() => {
        btnCopiarPix.textContent = textoOriginal;
    }, 2000);
}

if (btnCopiarPix && chavePix) {
    btnCopiarPix.addEventListener('click', copiarPix);
}

// ─── logo acompanhando o scroll ─────────────────────
const cabecalho = document.querySelector('header');

// quantos pixels de rolagem levam a logo do centro até a barra
const DISTANCIA_SCROLL = 300;

// 0 a 1: quanto menor, mais "macio" (e mais atrasado) o movimento
const SUAVIDADE = 0.12;

const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let alvo  = 0;      // progresso real, calculado pela rolagem
let atual = 0;      // progresso mostrado na tela (persegue o alvo)
let animando = false;

function calcularAlvo() {
    alvo = Math.min(Math.max(window.scrollY / DISTANCIA_SCROLL, 0), 1);
}

function aplicarProgresso() {
    cabecalho.style.setProperty('--progresso', atual.toFixed(4));
}

function animar() {
    atual += (alvo - atual) * SUAVIDADE;

    if (Math.abs(alvo - atual) < 0.001) atual = alvo;

    aplicarProgresso();

    if (atual !== alvo) {
        requestAnimationFrame(animar);
    } else {
        animando = false;
    }
}

function aoRolar() {
    calcularAlvo();

    if (semMovimento) {
        atual = alvo;
        aplicarProgresso();
        return;
    }

    if (!animando) {
        animando = true;
        requestAnimationFrame(animar);
    }
}

if (cabecalho) {
    window.addEventListener('scroll', aoRolar, { passive: true });

    // acerta o estado ao carregar (ex.: F5 no meio da página)
    calcularAlvo();
    atual = alvo;
    aplicarProgresso();
}

// ─── janela da demo (Godot) ─────────────────────────
// caminho do index.html exportado pelo Godot (relativo a HTML/Inicio.html)
const URL_DEMO = '../demo/index.html';

const btnJogar      = document.getElementById('btnJogar');
const janelaDemo    = document.getElementById('janelaDemo');
const quadroDemo    = document.getElementById('quadroDemo');
const btnFecharDemo = document.getElementById('btnFecharDemo');
const btnTelaCheia  = document.getElementById('btnTelaCheia');

function abrirDemo() {
    // só carrega o jogo agora (evita baixar dezenas de MB sem o jogador pedir)
    quadroDemo.src = URL_DEMO;
    janelaDemo.showModal();
}

function fecharDemo() {
    janelaDemo.close();
}

if (btnJogar && janelaDemo && quadroDemo) {
    btnJogar.addEventListener('click', abrirDemo);
    btnFecharDemo.addEventListener('click', fecharDemo);

    // ao fechar (botão ou Esc): descarrega o jogo, parando som e processamento
    janelaDemo.addEventListener('close', () => {
        quadroDemo.src = 'about:blank';
    });

    // dá o foco ao jogo assim que carregar, para o teclado funcionar de cara
    quadroDemo.addEventListener('load', () => {
        quadroDemo.focus();
    });

    btnTelaCheia.addEventListener('click', () => {
        if (quadroDemo.requestFullscreen) quadroDemo.requestFullscreen();
    });
}
