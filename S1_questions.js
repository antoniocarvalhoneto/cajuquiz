// =============================================
//  QuizCaju — questions.js  v2
//  Busca perguntas de uma API pública,
//  normaliza para o formato do jogo
//  e entrega uma Promise para o app.js consumir.
//
//  O app.js NÃO acessa a API diretamente.
//  Ele só awaita: window.bancoDePerguntasAsync
// =============================================


// ── FONTES ────────────────────────────────────
// Array com as URLs de onde vamos buscar perguntas.
// Cada objeto tem a URL da API e o nome da categoria.
//
// Categorias:
//   9  → Conhecimentos Gerais
//  18  → Tecnologia
//  31  → Anime & Manga
//
// encode=base64 → evita problemas com caracteres especiais
// type=multiple → sempre 4 opções

const FONTES = [
  {
    url: "https://opentdb.com/api.php?amount=5&category=18&type=multiple&encode=base64",
    categoria: "Tecnologia"
  },
  {
    url: "https://opentdb.com/api.php?amount=5&category=31&type=multiple&encode=base64",
    categoria: "Anime"
  },
  {
    url: "https://opentdb.com/api.php?amount=5&category=9&type=multiple&encode=base64",
    categoria: "Conhecimentos Gerais"
  }
]


// ── UTILITÁRIOS ───────────────────────────────

// A API envia todos os textos em Base64 para evitar
// problemas com acentos e caracteres especiais.
// atob() desfaz o Base64 e devolve o texto legível.
// Exemplo: atob("V2ViIERldg==") → "Web Dev"
function decodificarBase64(str) {
  return atob(str)
}

// Embaralha um array e retorna uma cópia
// (mesmo embaralhar que já existe no app.js)
function embaralhar(array) {
  var copia = array.slice()
  for (var i = copia.length - 1; i > 0; i--) {
    var j    = Math.floor(Math.random() * (i + 1))
    var temp = copia[i]
    copia[i] = copia[j]
    copia[j] = temp
  }
  return copia
}


// ── NORMALIZAÇÃO ──────────────────────────────
// A API fala uma língua. O app.js fala outra.
// Esta função traduz uma pergunta da API
// para o formato que o app.js conhece.
//
// Entrada (formato da API):
// {
//   question:          "base64...",
//   correct_answer:    "base64...",
//   incorrect_answers: ["base64...", "base64...", "base64..."],
//   category:          "base64..."
// }
//
// Saída (formato do QuizCaju):
// {
//   id:        número
//   categoria: string
//   pergunta:  string
//   opcoes:    [string, string, string, string]
//   correta:   número (índice no array opcoes)
//   explicacao: string
// }

function normalizarPergunta(item, fonte, indice) {
  let pergunta = decodificarBase64(item.question)
  let respostaCorreta = decodificarBase64(item.correct_answer)

  let erradas = item.incorrect_answers.map((errada) => {
    return decodificarBase64(errada)
  })

  let opcoes =  embaralhar([respostaCorreta].concat(erradas))
  
  let indiceCorreta = opcoes.indexOf(respostaCorreta)

  let respostaNormalizada ={
    id: indice + 1,
    categoria: fonte.categoria,
    pergunta: pergunta,
    opcoes: opcoes,
    correta: indiceCorreta,
    explicacao: "Fonte: Open Trivia DB" + decodificarBase64(item.category)
  }
  return respostaNormalizada
}


// ── BUSCA ─────────────────────────────────────
// Busca as perguntas de uma fonte e normaliza.
// async/await: a função pausa em cada await
// até a resposta chegar, depois continua.

async function buscarDeFonte(fonte, offsetId) {
  let resposta = await fetch(fonte.url)
  let dados = await resposta.json()

  if (dados.response_code !== 0) {
    throw new Error("Erro na API, codigo: " + dados.response_code)
}

  console.log("os dados no questions é: ", dados)

  return dados.results.map((item, i) => {
    return normalizarPergunta(item, fonte, offsetId + i)
  })
}

// ── ORQUESTRAÇÃO ──────────────────────────────
// Promise.all dispara os 3 fetches ao mesmo tempo.
// Só continua quando todos terminarem.
// Mais rápido do que fazer um por um.

async function carregarPerguntas() {

}


// ── EXPOSIÇÃO PÚBLICA ─────────────────────────
// O app.js awaita esta Promise para ter o array pronto.
// Por que Promise e não array direto?
// Porque fetch é assíncrono — quando o HTML carrega
// este arquivo, os dados ainda não chegaram.
// A Promise "segura" esse momento.
//
// No app.js:
//   var perguntas = await window.bancoDePerguntasAsync
//   → aí o array está pronto para usar

// window.bancoDePerguntasAsync = carregarPerguntas()
