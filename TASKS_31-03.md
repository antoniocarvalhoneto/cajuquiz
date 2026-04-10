# 🥭 QuizCaju — Missões do app.js

> Você vai construir o cérebro do jogo do zero.
> A cada missão concluída, você consegue testar algo novo no browser.
> Não avance sem testar o que acabou de fazer.

---

## Antes de começar

O projeto tem 3 arquivos prontos:

```
quizcaju/
├── index.html   ← a estrutura (pode ter uns erros, fique esperto)
├── style.css    ← o visual base
├── questions.js ← o banco de perguntas (array chamado `perguntas`)
└── app.js       ← VOCÊ vai criar este arquivo do zero
```

**Crie o arquivo `app.js` vazio e abra ele no VS Code.**
Você vai preencher missão por missão.

---

## Missão 0 — Estado global

Antes de qualquer lógica, o jogo precisa de memória.

**O que fazer:**

Crie um objeto chamado `estado` com as seguintes propriedades e valores iniciais:

| Propriedade      | Valor inicial |
| ---------------- | ------------- |
| `nickname`       | `""`          |
| `pontos`         | `0`           |
| `indiceAtual`    | `0`           |
| `acertos`        | `0`           |
| `erros`          | `0`           |
| `timerSegundos`  | `20`          |
| `timerIntervalo` | `null`        |
| `perguntasJogo`  | `[]`          |
| `respondeu`      | `false`       |

> 💡 O estado do jogo precisa viver no **escopo global** — fora de qualquer função.
> Se ficar dentro de uma função, ele é destruído quando a função termina
> e nenhuma outra função consegue acessá-lo.

---

## Missão 1 — Capture os elementos do HTML

O JS precisa encontrar os elementos HTML antes de poder modificá-los.

**O que fazer:**

Crie um objeto chamado `telas` com as 4 seções do jogo.
Depois crie um objeto chamado `els` e, dentro dele, use `document.getElementById()`
para capturar os elementos da **tela home** por agora:

**Tela Home:**
- `inputNickname` → id `input-nickname`
- `erroNickname` → id `erro-nickname`
- `btnIniciar` → id `btn-iniciar`
- `totalPerguntas` → id `total-perguntas`
- `totalCategorias` → id `total-categorias`

> ⚠️ Abra o console após salvar. Se algum elemento retornar `null`,
> o id no HTML está diferente do que o JS está procurando.
> Compare com o `index.html` — os ids podem ter erros intencionais.
> Você precisará corrigi-los para continuar.

---

## Missão 2 — Troca de telas

O jogo tem 4 telas. Só uma aparece por vez.
O CSS já faz isso: a tela com a classe `ativa` é exibida, as outras ficam ocultas.

**O que fazer:**

Crie uma função chamada `mostrarTela` que recebe um parâmetro `nomeTela`.

Ela deve:
1. Percorrer **todas** as telas e remover a classe `"ativa"` de cada uma
2. Adicionar a classe `"ativa"` apenas na tela escolhida

> 💡 Use o objeto `telas` que você criou na missão anterior para
> guardar as referências. Assim não precisa chamar `getElementById` toda vez.

**✅ Teste agora no console:**
```
mostrarTela("resultado")   → a tela de resultado aparece?
mostrarTela("feedback")    → muda para o feedback?
mostrarTela("home")        → volta para a home?
```

Se funcionar, você acabou de provar que o DOM e o CSS estão conectados ao JS.

---

## Missão 3 — Conecte os primeiros eventos

Agora que `mostrarTela` funciona, conecte o botão de iniciar.

**O que fazer:**

Use `addEventListener` para:
1. Clique em `btnIniciar` → chamar `iniciarJogo` (você vai criar na próxima missão)
2. Tecla `Enter` no `inputNickname` → chamar `iniciarJogo`
   (verifique `e.key === "Enter"` dentro do callback)

> ⚠️ Atenção: passe a função **sem parênteses**.
> `iniciarJogo` é a receita. `iniciarJogo()` é o prato já servido.
> Você quer passar a receita para o browser executar quando o clique acontecer.

> 💡 `iniciarJogo` ainda não existe — tudo bem. O evento fica registrado
> e vai funcionar assim que você criar a função na próxima missão.

---

## Missão 4 — iniciarJogo(): validação e troca de tela

Quando o jogador clicar em "jogar agora", o jogo deve começar.
Por enquanto, faça só a parte essencial: validar o nickname e mudar de tela.

**O que fazer:**

Crie uma função chamada `iniciarJogo`. Ela deve:

1. Ler o valor do campo de nickname (use `.value.trim()`)
2. **Se** o nickname tiver menos de 2 caracteres:
   - Exibir a mensagem `"Digite pelo menos 2 caracteres."` no elemento de erro
   - Parar a função (use `return`)
3. **Senão:**
   - Limpar o texto de erro
   - Salvar o nickname no `estado`
   - Chamar `mostrarTela("tela-questao")`

> 💡 Você vai completar esta função mais adiante com o embaralhamento
> e a chamada de `mostrarPergunta`. Por enquanto só valide e troque de tela.

**✅ Teste agora:**
```
→ Digite menos de 2 letras e clique — a mensagem de erro aparece?
→ Digite um nickname válido e clique — vai para a tela de questão?
→ Pressionar Enter no campo também funciona?
```

---

## Missão 5 — Embaralhador de perguntas

Cada partida deve ter uma ordem diferente de perguntas.

**O que fazer:**

Crie uma função chamada `embaralhar` que recebe um array como parâmetro
e retorna uma **cópia embaralhada** desse array (sem modificar o original).

Algoritmo para embaralhar (Fisher-Yates):
```
Para cada posição i, começando do final do array até o índice 1:
  Sorteia um índice j aleatório entre 0 e i
  Troca o elemento da posição i com o da posição j
```

> 💡 Para sortear um número inteiro aleatório entre 0 e i, use:
> `Math.floor(Math.random() * (i + 1))`

> 💡 Lembre de criar uma **cópia** do array antes de embaralhar.
> Se modificar o original, a ordem correta das perguntas se perde.
> Use `array.slice()` para criar a cópia.

**✅ Teste no console:**
```
embaralhar([1, 2, 3, 4, 5])   → resultado diferente a cada chamada?

var original = [1, 2, 3, 4, 5]
embaralhar(original)
console.log(original)          → deve continuar [1, 2, 3, 4, 5]
```

---

## Missão 6 — Cálculo de pontos

Responder rápido vale mais pontos.

**O que fazer:**

Crie uma função chamada `calcularPontos` que recebe `segundosRestantes`
e retorna a pontuação daquela resposta.

A fórmula é: `500 + (segundosRestantes * 25)`

**✅ Teste no console:**
```
calcularPontos(20)   → deve retornar 1000
calcularPontos(10)   → deve retornar 750
calcularPontos(0)    → deve retornar 500
```

---

## Missão 7 — Complete o iniciarJogo()

Agora que o embaralhador existe, **abra a função `iniciarJogo` que você já escreveu
na Missão 4 e adicione o código novo dentro dela** — não crie uma segunda função
com o mesmo nome, isso vai sobrescrever a primeira.

**O que adicionar, antes de chamar `mostrarTela`:**

- Resetar `pontos`, `indiceAtual`, `acertos` e `erros` para zero no `estado`
- Embaralhar o array `perguntas` e salvar em `estado.perguntasJogo`
- Chamar `mostrarPergunta()` depois de `mostrarTela` (você cria na próxima missão)

> 💡 `perguntas` é o array que vem do `questions.js`.
> Ele está disponível porque o `questions.js` é carregado antes do `app.js` no HTML.

> 💡 Por enquanto coloque um `console.log("mostrarPergunta chamada!")`
> no lugar da chamada — assim você confirma que o fluxo está chegando lá.

---

## Missão 8 — Capture os elementos da tela de questão

Antes de montar a pergunta, você precisa das referências aos elementos.

**O que fazer:**

Adicione ao objeto `els` os elementos da tela de questão:

**Tela Questão:**
- `questaoAtual` → id `questao-atual`
- `questaoTotal` → id `questao-total`
- `barraFill` → id `barra-fill`
- `timerArco` → id `timer-arco`
- `timerNum` → id `timer-num`
- `categoriaTag` → id `categoria-tag`
- `questaoTexto` → id `questao-texto`
- `opcoesGrid` → id `opcoes-grid`

> ⚠️ Verifique esses ids no `index.html` — algum pode estar errado.
> O console vai mostrar `null` para os que não baterem.

---

## Missão 9 — Mostrar a pergunta atual

Esta é a função mais importante do jogo.

**O que fazer:**

Crie uma função chamada `mostrarPergunta`. Ela deve:

1. Pegar a pergunta atual: `estado.perguntasJogo[estado.indiceAtual]`
2. Resetar `estado.respondeu` para `false`
3. Calcular o número da questão atual (`indiceAtual + 1`) e o total
4. Atualizar no DOM:
   - `questaoAtual` com o número da questão
   - `questaoTotal` com o total
   - A largura de `barraFill` com a porcentagem de progresso (use `style.width`)
   - `categoriaTag` com `pergunta.categoria`
   - `questaoTexto` com `pergunta.pergunta`
5. Limpar o `opcoesGrid` (use `innerHTML = ""`)
6. Para cada opção da pergunta (`pergunta.opcoes`), criar um botão e adicioná-lo ao grid

Cada botão de opção deve ter:
- Classe `"opcao-btn"`
- Um `<span>` com a letra (A, B, C ou D) e a classe `"opcao-letra letra-a"` (ou b, c, d)
- Um `<span>` com o texto da opção e a classe `"opcao-texto"`
- Um evento de clique que chama `responder(indice)` com o índice correto

> ⚠️ Atenção ao bug clássico de closure em loops!
> Se usar `var i` no for, todos os botões vão chamar `responder` com o mesmo valor.
> Use `let i` no for para que cada botão capture seu próprio índice.

7. Substitua o `console.log` da missão anterior pela chamada `iniciarTimer()`
   — mas só depois de criar o timer na Missão 14.
   Por enquanto deixe sem a chamada.

**✅ Teste agora:**
```
→ Inicie o jogo com um nickname válido
→ O texto da pergunta aparece?
→ A categoria aparece?
→ 4 botões com as opções aparecem?
→ A barra de progresso mostra 1/10?
→ Inicie duas vezes — a ordem das perguntas muda?
```

> Os botões ainda não fazem nada ao clicar. Isso é normal — vem na próxima missão.

---

## Missão 10 — Capture os elementos da tela de feedback

**O que fazer:**

Adicione ao objeto `els`:

**Tela Feedback:**
- `feedbackIcone` → id `feedback-icone`
- `feedbackTitulo` → id `feedback-titulo`
- `feedbackExplic` → id `feedback-explicacao`
- `feedbackPontos` → id `feedback-pontos`
- `placarParcial` → id `placar-parcial`
- `btnProxima` → id `btn-proxima`

---

## Missão 11 — Processar a resposta

Esta função é chamada quando o jogador clica numa opção ou o tempo acaba.

**O que fazer:**

Crie uma função chamada `responder` que recebe `indiceEscolhido`. Ela deve:

1. **Se** `estado.respondeu` for `true`, parar imediatamente (evita duplo clique)
2. Setar `estado.respondeu = true`
3. Cancelar o timer com `clearInterval`
4. Verificar se acertou: o índice escolhido é igual a `pergunta.correta`?
5. Percorrer todos os botões `.opcao-btn` e:
   - Desabilitar cada um (`disabled = true`)
   - Adicionar classe `"correta"` no botão da resposta certa
   - Adicionar classe `"errada"` no botão clicado (se errado)
6. Aguardar 1 segundo (`setTimeout`) e então:
   - **Se acertou:** calcular pontos, somar em `estado.pontos`, incrementar `estado.acertos`, chamar `mostrarFeedback(true, pts, pergunta.explicacao)`
   - **Se errou:** incrementar `estado.erros`, chamar `mostrarFeedback(false, 0, pergunta.explicacao)`

> 💡 Para pegar todos os botões de opção de uma vez, use:
> `els.opcoesGrid.querySelectorAll(".opcao-btn")`
> Isso retorna uma NodeList — use `.forEach()` para percorrer.

---

## Missão 12 — Tela de feedback

Mostra o resultado de cada resposta antes de ir para a próxima.

**O que fazer:**

Crie uma função chamada `mostrarFeedback` que recebe `acertou`, `pontosGanhos` e `explicacao`. Ela deve:

**Se acertou:**
- Ícone: `"✅"`
- Título: `"Correto!"`
- Classe do título: `"feedback-titulo acerto"`
- Pontos: `"+" + pontosGanhos`

**Se errou:**
- Ícone: `"❌"`
- Título: `"Errou!"`
- Classe do título: `"feedback-titulo erro"`
- Pontos: `"+0"`

Em ambos os casos:
- Atualizar `feedbackExplic` com a explicação
- Atualizar `placarParcial` com `estado.pontos`
- Chamar `mostrarTela("tela-feedback")`

**✅ Teste agora:**
```
→ Clique numa opção correta — o botão fica verde e vai para o feedback com ✅?
→ Clique numa opção errada — o botão errado fica vermelho, o correto fica verde?
→ O placar acumula a cada acerto?
→ Clicar duas vezes rápido não conta duas vezes?
```

> O botão "próxima →" ainda não funciona. Vem na próxima missão.

---

## Missão 13 — Próxima pergunta

**O que fazer:**

Crie uma função chamada `proximaPergunta`. Ela deve:

1. Incrementar `estado.indiceAtual` em 1
2. **Se** ainda houver perguntas (`indiceAtual < perguntasJogo.length`):
   - Chamar `mostrarTela("tela-questao")`
   - Chamar `mostrarPergunta()`
3. **Senão:** chamar `mostrarResultado()`

Conecte o evento:
- Clique em `btnProxima` → chamar `proximaPergunta`

**✅ Teste agora:**
```
→ O botão "próxima →" avança para a próxima pergunta?
→ O número da questão avança (1/10, 2/10...)?
→ A barra de progresso cresce?
→ Os botões aparecem limpos, sem marcações da rodada anterior?
```

---

## Missão 14 — O timer

O jogador tem 20 segundos por pergunta. O arco SVG mostra o tempo visualmente.

**O que fazer:**

Crie uma função chamada `iniciarTimer`. Ela deve:

1. Definir `CIRCUNFERENCIA = 107` (o comprimento do arco SVG)
2. Resetar `estado.timerSegundos` para `20`
3. Atualizar `timerNum.textContent` para `20`
4. Resetar o arco: `timerArco.style.strokeDashoffset = 0`
5. Cancelar qualquer timer anterior com `clearInterval(estado.timerIntervalo)`
6. Iniciar um `setInterval` que roda a cada 1000ms e:
   - Diminui `estado.timerSegundos` em 1
   - Atualiza `timerNum.textContent`
   - Calcula o deslocamento do arco: `CIRCUNFERENCIA * (1 - timerSegundos / 20)`
   - Atualiza `timerArco.style.strokeDashoffset` com esse valor
   - **Se** `timerSegundos` chegar a 0: cancela o intervalo e chama `responder(-1)`

> 💡 `-1` como argumento significa que o tempo esgotou (nenhuma opção foi escolhida).
> Guarde o retorno do `setInterval` em `estado.timerIntervalo`.
> Sem isso, você não consegue cancelar o timer depois.

Agora volte em `mostrarPergunta` e substitua o comentário pela chamada `iniciarTimer()`.

**✅ Teste agora:**
```
→ O número no timer conta de 20 para baixo?
→ O arco SVG diminui visualmente?
→ Quando chega em 0, registra como erro e vai para o feedback?
→ Avançar para a próxima pergunta reseta o timer?
```

---

## Missão 15 — Capture os elementos da tela de resultado

**O que fazer:**

Adicione ao objeto `els`:

**Tela Resultado:**
- `resultadoMedalha` → id `resultado-medalha`
- `resultadoNome` → id `resultado-nome`
- `scoreFinal` → id `score-final`
- `statAcertos` → id `stat-acertos`
- `statErros` → id `stat-erros`
- `statPorcento` → id `stat-porcento`
- `resultadoMsg` → id `resultado-mensagem`
- `btnJogarNovamente` → id `btn-jogar-novamente`

> ⚠️ Verifique esses ids no `index.html` — pode ter erros intencionais aqui também.

---

## Missão 16 — Resultado final

**O que fazer:**

Crie uma função chamada `mostrarResultado`. Ela deve:

1. Calcular o aproveitamento: `Math.round((acertos / total) * 100)`
2. Definir a medalha com base no aproveitamento:
   - `>= 90%` → `"🏆"`
   - `>= 70%` → `"🥈"`
   - `>= 50%` → `"🥉"`
   - Abaixo de 50% → `"😅"`
3. Definir a mensagem motivacional (você escolhe os textos)
4. Atualizar todos os elementos da tela de resultado no DOM
5. Chamar `mostrarTela("tela-resultado")`

---

## Missão 17 — Reiniciar

**O que fazer:**

Crie uma função chamada `reiniciarJogo`. Ela deve:
- Limpar o campo de nickname
- Chamar `mostrarTela("tela-home")`

Conecte o evento:
- Clique em `btnJogarNovamente` → chamar `reiniciarJogo`

**✅ Teste agora — o jogo completo:**
```
→ Jogue até o fim — a tela de resultado aparece?
→ Score, acertos, erros e aproveitamento estão corretos?
→ A medalha muda de acordo com o aproveitamento?
→ "Jogar novamente" volta para a home com o campo limpo?
→ É possível jogar uma segunda partida sem recarregar a página?
```

---

## Missão 18 — Inicialização

Crie uma função chamada `init` e chame ela no final do arquivo.

Ela deve:
1. Percorrer o array `perguntas` e coletar as categorias únicas (sem repetição)
2. Exibir o total de perguntas em `totalPerguntas`
3. Exibir o total de categorias únicas em `totalCategorias`

> 💡 Para verificar se uma categoria já foi adicionada à lista, use o método
> `.indexOf()`. Se retornar `-1`, significa que ainda não está na lista.

**✅ Teste final:**
```
→ A home mostra o número correto de perguntas?
→ A home mostra o número correto de categorias?
```

---

## Checklist final

Antes de considerar o jogo pronto, teste cada item:

- [ ] A tela home mostra o número correto de perguntas e categorias
- [ ] O botão "jogar agora" valida o nickname (menos de 2 chars mostra erro)
- [ ] O Enter no campo de nickname também inicia o jogo
- [ ] As perguntas aparecem em ordem diferente a cada partida
- [ ] O timer conta de 20 até 0 e muda visualmente
- [ ] Quando o tempo acaba, o jogo registra como erro
- [ ] Clicar numa opção desabilita todas as outras
- [ ] A opção correta fica verde, a errada fica vermelha
- [ ] A tela de feedback mostra a explicação correta
- [ ] O placar parcial acumula corretamente
- [ ] Ao final das 10 perguntas, a tela de resultado aparece
- [ ] A medalha e a mensagem mudam de acordo com o aproveitamento
- [ ] O botão "jogar novamente" volta para a home e limpa o nickname

---

*Feito com 🧡 no CajuHub — Aracaju, SE*
