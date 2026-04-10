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
function iniciarJogo() {
    try {
        console.log("Iniciando jogo...");
        
        // Verifica se elemento existe
        if (!els.inputNickname) {
            console.error("❌ ERRO: els.inputNickname não existe!");
            return;
        }
        
        // Lê o nickname
        const nickname = els.inputNickname.value.trim();
        
        console.log(`Nickname lido: "${nickname}" (length: ${nickname.length})`);

        // Valida
        if (nickname.length < 3) {
            if (els.erroNickname) {
                els.erroNickname.textContent = "Digite pelo menos 3 caracteres.";
            }
            console.warn("❌ Nickname inválido (menos de 3 caracteres)");
            return;
        }

        // Limpa erro
        if (els.erroNickname) {
            els.erroNickname.textContent = "";
        }

        // Salva nickname no estado
        estado.nickname = nickname;
        console.log(`Nickname aceito: "${nickname}"`);

        // Reseta pontos, índice, acertos e erros
        estado.pontos = 0;
        estado.indiceAtual = 0;
        estado.acertos = 0;
        estado.erros = 0;

        // Verifica se há perguntas
        if (!perguntas || perguntas.length === 0) {
            console.error("❌ ERRO: Nenhuma pergunta carregada! Verifique questions.js");
            if (els.erroNickname) {
                els.erroNickname.textContent = "Erro: Perguntas não carregadas.";
            }
            return;
        }

        // Embaralha as perguntas
        estado.perguntasJogo = embaralhar(perguntas);
        console.log(`🔀 Perguntas embaralhadas (${estado.perguntasJogo.length} total)`);
        console.log("🔀 Ordem dos primeiros IDs após embaralhar:", estado.perguntasJogo.slice(0, 5).map(p => p.id));
    
        // Muda para tela de questão
        console.log("📄 Mudando para tela de questão...");
        mostrarTela("telaQuestao");
        console.log("✅ Tela de questão ativada");

        // Mostra a primeira pergunta
        console.log("Carregando primeira pergunta...");
        mostrarPergunta();
    } catch (erro) {
        console.error("❌ ERRO ao iniciar jogo:", erro);
        console.error("Stack:", erro.stack);
        if (els.erroNickname) {
            els.erroNickname.textContent = "Erro ao iniciar o jogo. Veja o console.";
        }
    }
}


// mostrarPergunta()
// Pega estado.perguntasJogo[estado.indiceAtual].
// Atualiza progresso, categoria e texto no DOM.
// Limpa opcoes-grid e cria os botões com createElement.
// Conecta addEventListener em cada botão → responder(i).
// Atenção: use "let i" no for, não "var i".
// Chama iniciarTimer().
function mostrarPergunta() {

}


// iniciarTimer()
// Reseta timerSegundos para 20.
// clearInterval antes de criar um novo setInterval.
// A cada 1000ms: decrementa, atualiza DOM, move arco SVG.
// Se timerSegundos <= 0: clearInterval e responder(-1).
function iniciarTimer() {

}


// responder(indiceEscolhido)
// Guarda de segurança: if (estado.respondeu) return.
// clearInterval do timer.
// Compara indiceEscolhido com pergunta.correta.
// Marca botões com classList: "correta" e "errada".
// setTimeout de 1s → mostrarFeedback().
function responder(indiceEscolhido) {

}


// mostrarFeedback(acertou, pontosGanhos, explicacao)
// Atualiza ícone, título, pontos e explicação.
// Chama mostrarTela("feedback").
function mostrarFeedback(acertou, pontosGanhos, explicacao) {

}


// proximaPergunta()
// indiceAtual++
// Se ainda há perguntas → mostrarPergunta().
// Senão → mostrarResultado().
function proximaPergunta() {

}


// mostrarResultado()
// Calcula aproveitamento. Define medalha e mensagem.
// Atualiza DOM da tela de resultado.
// Chama mostrarTela("resultado").
function mostrarResultado() {

}


// reiniciarJogo()
// Limpa o campo de nickname.
// Chama mostrarTela("home").
function reiniciarJogo() {

}


// ------------------------------------------------------------
// 5. EVENTOS
// Conecte os botões às funções com addEventListener.
//
//   btnIniciar       → iniciarJogo
//   inputNickname    → iniciarJogo quando Enter pressionado
//   btnProxima       → proximaPergunta
//   btnJogarNovamente → reiniciarJogo
// ------------------------------------------------------------




// ------------------------------------------------------------
// 6. INICIALIZAÇÃO
// Crie a função init() e chame ela aqui.
// Ela deve preencher totalPerguntas e totalCategorias na home.
// ------------------------------------------------------------
