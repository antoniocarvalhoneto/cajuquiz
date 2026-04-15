// =============================================
//  QuizCaju — app.js
//  Construído ao vivo / tasks semana 1.
//  Siga os comentários + TASKS_SEMANA1.md
// =============================================


// ------------------------------------------------------------
// 1. ESTADO
// Crie aqui o objeto "estado" com todas as propriedades
// que representam a memória do jogo.
// Deve ficar no escopo global — fora de qualquer função.
// ------------------------------------------------------------

const estado = {
    nickname: "",
    pontos: 0,
    indiceAtual: 0,
    acertos: 0,
    erros: 0,
    timerSegundos: 20,
    timerIntervalo: null,
    perguntasJogo: [],
    respondeu: false
};
// ------------------------------------------------------------
// 2. REFERÊNCIAS AO DOM
// Crie o objeto "telas" com as 4 seções do jogo.
// Crie o objeto "els" com todos os elementos HTML.
// Use document.getElementById() para cada um.
// Atenção: alguns ids no HTML podem estar errados.
// ------------------------------------------------------------

const telas = {
    telaHome: document.getElementById("tela-home"),
    telaQuestao: document.getElementById("tela-questao"),
    telaFeedback: document.getElementById("tela-feedback"),
    telaResultado: document.getElementById("tela-resultado")
}

const els = {
    // home
    inputNickname: document.getElementById("input-nickname"),
    erroNickname: document.getElementById("erro-nickname"),
    btnIniciar: document.getElementById("btn-iniciar"),
    totalPerguntas: document.getElementById("total-perguntas"),
    totalCategorias: document.getElementById("total-categorias"),
    loadingMsg: document.getElementById("loading-msg"), // ADICIONADO

    // questão
    questaoAtual: document.getElementById("questao-atual"),
    questaoTotal: document.getElementById("questao-total"),
    barraFill: document.getElementById("barra-fill"),
    timerArco: document.getElementById("timer-arco"),
    timerNum: document.getElementById("timer-num"),
    categoriaTag: document.getElementById("categoria-tag"),
    questaoTexto: document.getElementById("questao-texto"),
    opcoesGrid: document.getElementById("opcoes-grid"),

    // feedback
    feedbackIcone: document.getElementById("feedback-icone"),
    feedbackTitulo: document.getElementById("feedback-titulo"),
    feedbackExplic: document.getElementById("feedback-explicacao"),
    feedbackPontos: document.getElementById("feedback-pontos"),
    placarParcial: document.getElementById("placar-parcial"),
    btnProxima: document.getElementById("btn-proxima"),

    // resultado
    resultadoMedalha: document.getElementById("resultado-medalha"),
    resultadoNome: document.getElementById("resultado-nome"),
    scoreFinal: document.getElementById("score-final"),
    statAcertos: document.getElementById("stat-acertos"),
    statErros: document.getElementById("stat-erros"),
    statPorcento: document.getElementById("stat-porcento"),
    resultadoMsg: document.getElementById("resultado-mensagem"),
    btnJogarNovamente: document.getElementById("btn-jogar-novamente"),
}


// ------------------------------------------------------------
// 3. FUNÇÕES UTILITÁRIAS
// ------------------------------------------------------------

// mostrarTela(nomeTela)
// Remove "ativa" de todas as telas e adiciona só na escolhida.
// Use Object.values(telas).forEach(...) para percorrer.
function mostrarTela(nomeTela) {
    Object.values(telas).forEach(tela => {
        tela.classList.remove("ativa");
    });
    telas[nomeTela].classList.add("ativa");
}



// embaralhar(array)
// Retorna uma cópia embaralhada do array recebido.
// Algoritmo Fisher-Yates:
//   copia = array.slice()
//   para i do último até 1:
//     j = Math.floor(Math.random() * (i + 1))
//     troca copia[i] com copia[j]
//   retorna copia
function embaralhar(array) {
    const copia = array.slice();
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia;
}


// calcularPontos(segundosRestantes)
// Retorna: 500 + (segundosRestantes * 25)
function calcularPontos(segundosRestantes) {
    return 500 + (segundosRestantes * 25);
}


// ------------------------------------------------------------
// 4. LÓGICA DO JOGO
// ------------------------------------------------------------

// iniciarJogo()
// Valida nickname (mínimo 2 chars).
// Reseta o estado. Embaralha as perguntas.
// Chama mostrarTela("questao") e mostrarPergunta().
async function iniciarJogo() {
    let nome = els.inputNickname.value.trim()
    if (nome.length < 3) {
        els.erroNickname.textContent = "Digite pelo menos 3 caracteres."
        return
    }
    els.erroNickname.textContent = "";
    estado.nickname = nome;
    estado.pontos = 0;
    estado.indiceAtual = 0;
    estado.acertos = 0;
    estado.erros = 0;
    let todasPerguntas   = await window.bancoDePerguntasAsync
    estado.perguntasJogo = embaralhar(todasPerguntas)
    mostrarTela("telaQuestao")
    mostrarPergunta()
}

els.inputNickname.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        iniciarJogo()
    }
})

els.btnIniciar.addEventListener("click", iniciarJogo)

// mostrarPergunta()
// Pega estado.perguntasJogo[estado.indiceAtual].
// Atualiza progresso, categoria e texto no DOM.
// Limpa opcoes-grid e cria os botões com createElement.
// Conecta addEventListener em cada botão → responder(i).
// Atenção: use "let i" no for, não "var i".
// Chama iniciarTimer().
function mostrarPergunta() {
    let pergunta = estado.perguntasJogo[estado.indiceAtual]
    estado.respondeu = false
    let num = estado.indiceAtual + 1;
    let total = estado.perguntasJogo.length
    els.questaoAtual.textContent = num
    els.questaoTotal.textContent = total
    els.barraFill.style.width = ((num / total) * 100) + "%"
    els.categoriaTag.textContent = pergunta.categoria
    els.questaoTexto.textContent = pergunta.pergunta
    els.opcoesGrid.innerHTML = ""
    let letras = ["A", "B", "C", "D"]
    let classes = ["opcao-a", "opcao-b", "opcao-c", "opcao-d"]
    for (let i = 0; i < pergunta.opcoes.length; i++) {
        let btn = document.createElement("button")
        btn.className = "opcao-btn"
        btn.type = "button"
        let spanLetra = document.createElement("span")
        spanLetra.className = "opcao-letra " + classes[i]
        spanLetra.textContent = letras[i]
        let spanTexto = document.createElement("span")
        spanTexto.className = "opcao-texto"
        spanTexto.textContent = pergunta.opcoes[i]
        btn.appendChild(spanLetra)
        btn.appendChild(spanTexto)
        btn.addEventListener("click", function () {
            responder(i)
        })
        els.opcoesGrid.appendChild(btn)
    }
    iniciarTimer()
}

// iniciarTimer()
// Reseta timerSegundos para 20.
// clearInterval antes de criar um novo setInterval.
// A cada 1000ms: decrementa, atualiza DOM, move arco SVG.
// Se timerSegundos <= 0: clearInterval e responder(-1).
function iniciarTimer() {

    let CIRCUNFERENCIA = 107

    estado.timerSegundos = 20;
    els.timerNum.textContent = 20;
    els.timerArco.style.strokeDashoffset = 0;
    els.timerArco.style.stroke = "var(--laranja)";

    clearInterval(estado.timerIntervalo);

    estado.timerIntervalo = setInterval(function () {
        estado.timerSegundos--
        els.timerNum.textContent = estado.timerSegundos;

        let progresso = estado.timerSegundos / 20

        els.timerArco.style.strokeDashoffset = CIRCUNFERENCIA * (1 - progresso);

        if (estado.timerSegundos <= 5) {
            els.timerArco.style.stroke = "var(--vermelho)";
        } else if (estado.timerSegundos <= 10) {
            els.timerArco.style.stroke = "var(--amarelo)";
        }

        if (estado.timerSegundos <= 0) {
            clearInterval(estado.timerIntervalo);
            responder(-1);
        }

    }, 1000)
}


// responder(indiceEscolhido)
// Guarda de segurança: if (estado.respondeu) return.
// clearInterval do timer.
// Compara indiceEscolhido com pergunta.correta.
// Marca botões com classList: "correta" e "errada".
// setTimeout de 1s → mostrarFeedback().
function responder(indiceEscolhido) {
    if (estado.respondeu){
        return
    }
    estado.respondeu = true 

    let pergunta = estado.perguntasJogo[estado.indiceAtual]
    let indiceCorreto = pergunta.correta
    let acertou       = (indiceEscolhido === indiceCorreto)

    let botoes = els.opcoesGrid.querySelectorAll(".opcao-btn")

    botoes.forEach(function(btn,idx){
        btn.disabled = true 
        if (idx === indiceCorreto) {
            btn.classList.add("correta")
        } else if (idx === indiceEscolhido){
            btn.classList.add("errada")
        }
    })
    setTimeout(function(){
        if (acertou){
            let pts = calcularPontos(estado.timerSegundos)
            estado.pontos+= pts
            estado.acertos++
            mostrarFeedback(true, pts, pergunta.explicacao)
        }else {
            estado.erros++
            mostrarFeedback(false, 0, pergunta.explicacao)
        }
    }, 1000)
}
// mostrarFeedback(acertou, pontosGanhos, explicacao)
// Atualiza ícone, título, pontos e explicação.
// Chama mostrarTela("feedback").
function mostrarFeedback(acertou, pontosGanhos, explicacao) {
    if(acertou){
        els.feedbackIcone.textContent = "😉✅"
        els.feedbackTitulo.textContent = "Correto!"
        els.feedbackTitulo.className = "feedback-titulo acerto"
        els.feedbackPontos.textContent = pontosGanhos
    } else{
        els.feedbackIcone.textContent = "❌"
        els.feedbackTitulo.textContent = "Errado!"
        els.feedbackTitulo.className = "feedback-titulo erro"
        els.feedbackPontos.textContent = "0"
    }
    els.feedbackExplic.textContent = explicacao 
    els.placarParcial.textContent = estado.pontos 
    mostrarTela("telaFeedback")
}


// proximaPergunta()
// indiceAtual++
// Se ainda há perguntas → mostrarPergunta().
// Senão → mostrarResultado().
function proximaPergunta() {
    estado.indiceAtual++
    if (estado.indiceAtual < estado.perguntasJogo.length){
        mostrarTela("telaQuestao")
        mostrarPergunta()
    }else {
        mostrarResultado()
    }
}

els.btnProxima.addEventListener("click", proximaPergunta);

// mostrarResultado()
// Calcula aproveitamento. Define medalha e mensagem.
// Atualiza DOM da tela de resultado.
// Chama mostrarTela("resultado").
function mostrarResultado() {
    let total = estado.perguntasJogo.length
    let aproveitamento = Math.round((estado.acertos /total) * 100)
    let medalha = "⚰️"
    let mensagem = "Continue praticando, você vai melhorar!"
    if (aproveitamento >= 90){
        medalha = "🥇"
        mensagem = "Incrível! Você domina o conteúdo!"
    } else if (aproveitamento >= 70){
        medalha = "🥈"
        mensagem = "Muito de bom! Esta no caminho certo, estude um pouco mais..."
    } else if (aproveitamento >= 50){
        medalha = "🥉"
        mensagem = "Bom, revise e tente novamente!"
    }
    els.resultadoMedalha.textContent = medalha 
    els.resultadoNome.textContent = estado.nickname
    els.scoreFinal.textContent = estado.pontos
    els.statAcertos.textContent = estado.acertos
    els.statErros.textContent = estado.erros
    els.statPorcento.textContent = aproveitamento + "%"
    els.resultadoMsg.textContent = mensagem 
    mostrarTela("telaResultado")
}


// reiniciarJogo()
// Limpa o campo de nickname.
// Chama mostrarTela("home").
function reiniciarJogo() {
    els.inputNickname.value = "";
    mostrarTela("telaHome");
}
els.btnJogarNovamente.addEventListener('click', reiniciarJogo)

// ------------------------------------------------------------
// 5. EVENTOS
// Conecte os botões às funções com addEventListener.
//
//   btnIniciar       → iniciarJogo
//   inputNickname    → iniciarJogo quando Enter pressionado
//   btnProxima       → proximaPergunta
//   btnJogarNovamente → reiniciarJogo
// ------------------------------------------------------------
els.btnIniciar.addEventListener("click", iniciarJogo);
els.inputNickname.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        iniciarJogo();
    }
});


// ------------------------------------------------------------
// 6. INICIALIZAÇÃO
// Crie a função init() e chame ela aqui.
// Ela deve preencher totalPerguntas e totalCategorias na home.
// ------------------------------------------------------------
async function init() {
    els.btnIniciar.disabled = true
    if (els.loadingMsg) els.loadingMsg.textContent = "carregando perguntas..."

    try {
        let perguntas = await window.bancoDePerguntasAsync

        let categorias = []
        for (let i = 0; i < perguntas.length; i++) {
            if (categorias.indexOf(perguntas[i].categoria) === -1) {
                categorias.push(perguntas[i].categoria)
            }
        }

        els.totalPerguntas.textContent = perguntas.length
        els.totalCategorias.textContent = categorias.length
        if (els.loadingMsg) els.loadingMsg.textContent = ""
        els.btnIniciar.disabled = false

    } catch (erro) {
        if (els.loadingMsg) els.loadingMsg.textContent = "Erro ao carregar. recarregue a página."
        console.error("[QuizCaju] Falha na inicialização:", erro)
    }
}

init()