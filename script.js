/* ==========================================================
   LOVELACE — Mulheres na Ciência
   Quizzes, progresso, conhecimentos desbloqueados e avatar.
   O cabeçalho NÃO é criado aqui: está escrito em cada HTML.
   ========================================================== */

(function () {
  "use strict";

  /* ---------------------------------------------------------
     Dados do site
     --------------------------------------------------------- */
  var MULHERES = {
    ada: {
      nome: "Ada Lovelace",
      pagina: "ada.html",
      quiz: "quiz-ada.html",
      area: "Matemática & Computação",
      areaPagina: "conhecimento-computacao.html"
    },
    marie: {
      nome: "Marie Curie",
      pagina: "marie.html",
      quiz: "quiz-marie.html",
      area: "Física & Química",
      areaPagina: "conhecimento-fisica-quimica.html"
    },
    katherine: {
      nome: "Katherine Johnson",
      pagina: "katherine.html",
      quiz: "quiz-katherine.html",
      area: "Matemática & Espaço",
      areaPagina: "conhecimento-matematica-espaco.html"
    },
    carolina: {
      nome: "Carolina Maria de Jesus",
      pagina: "carolina.html",
      quiz: "quiz-carolina.html",
      area: "Literatura & Sociedade",
      areaPagina: "conhecimento-literatura-sociedade.html"
    },
    jane: {
      nome: "Jane Addams",
      pagina: "jane.html",
      quiz: "quiz-jane.html",
      area: "Sociedade & Reforma Social",
      areaPagina: "conhecimento-reforma-social.html"
    }
  };

  var ORDEM = ["ada", "marie", "katherine", "carolina", "jane"];

  /* Respostas corretas e dicas (as perguntas ficam no HTML de cada quiz) */
  var QUIZZES = {
    ada: {
      respostas: { q1: "b", q2: "c", q3: "a" },
      dicas: {
        q1: "Releia a seção “Charles Babbage”.",
        q2: "Releia a seção “Máquina Analítica”.",
        q3: "Releia as seções “Máquina Analítica” e “Legado”."
      }
    },
    marie: {
      respostas: { q1: "c", q2: "a", q3: "d" },
      dicas: {
        q1: "Releia a seção “Radioatividade”.",
        q2: "Releia a seção “Polônio e Rádio”.",
        q3: "Releia a seção “Prêmios”."
      }
    },
    katherine: {
      respostas: { q1: "d", q2: "b", q3: "a" },
      dicas: {
        q1: "Releia a seção “NASA”.",
        q2: "Releia a seção “Exploração espacial”.",
        q3: "Releia as seções “NASA” e “Legado”."
      }
    },
    carolina: {
      respostas: { q1: "a", q2: "c", q3: "b" },
      dicas: {
        q1: "Releia a seção “Infância”.",
        q2: "Releia a seção “Quarto de Despejo”.",
        q3: "Releia a seção “Vida em São Paulo”."
      }
    },
    jane: {
      respostas: { q1: "c", q2: "b", q3: "d" },
      dicas: {
        q1: "Releia a seção “Hull House”.",
        q2: "Releia a seção “Prêmio Nobel”.",
        q3: "Releia as seções “Hull House” e “Direitos sociais”."
      }
    }
  };

  /* Partes do avatar, na ordem das camadas (de baixo para cima) */
  var PARTES = [
    { chave: "pele", rotulo: "Pele", prefixo: "pele", total: 6 },
    { chave: "olhos", rotulo: "Olhos", prefixo: "olhos", total: 6},
    { chave: "sobrancelha", rotulo: "Sobrancelhas", prefixo: "sobrancelha", total: 8 },
    { chave: "boca", rotulo: "Boca", prefixo: "boca", total: 5
     },
    { chave: "cabelo", rotulo: "Cabelo", prefixo: "cabelo", total: 15, grupo: 3 },
    { chave: "roupa", rotulo: "Roupa", prefixo: "roupa", total: 3 }
  ];

  var CHAVE_AVATAR = "lovelace_avatar";

  /* ---------------------------------------------------------
     Armazenamento (localStorage com reserva em memória)
     --------------------------------------------------------- */
  var memoria = {};

  function lerItem(chave) {
    try {
      var v = window.localStorage.getItem(chave);
      return v === null ? (memoria[chave] || null) : v;
    } catch (e) {
      return memoria[chave] || null;
    }
  }

  function gravarItem(chave, valor) {
    memoria[chave] = valor;
    try {
      window.localStorage.setItem(chave, valor);
    } catch (e) { /* segue usando a memória */ }
  }

  function quizConcluido(id) {
    return lerItem("quiz_" + id) === "concluido";
  }

  function marcarConcluido(id) {
    gravarItem("quiz_" + id, "concluido");
  }

  function totalConcluidos() {
    var n = 0;
    ORDEM.forEach(function (id) { if (quizConcluido(id)) n++; });
    return n;
  }

  /* ---------------------------------------------------------
     Utilidades
     --------------------------------------------------------- */
  function todos(seletor, raiz) {
    return Array.prototype.slice.call((raiz || document).querySelectorAll(seletor));
  }

  function doisDigitos(n) {
    return (n < 10 ? "0" : "") + n;
  }

  /* ---------------------------------------------------------
     Selos, contadores e barra de progresso
     (funcionam em qualquer página que tenha os atributos data-)
     --------------------------------------------------------- */
  function atualizarSelos() {
    todos("[data-selo-quiz]").forEach(function (el) {
      var feito = quizConcluido(el.getAttribute("data-selo-quiz"));
      el.textContent = feito ? "Quiz concluído" : "Quiz pendente";
      el.classList.toggle("feito", feito);
    });

    todos("[data-selo-area]").forEach(function (el) {
      var feito = quizConcluido(el.getAttribute("data-selo-area"));
      el.textContent = feito ? "Área desbloqueada" : "Área bloqueada";
      el.classList.toggle("aberta", feito);
    });

    todos("[data-selo-mulher]").forEach(function (el) {
      var feito = quizConcluido(el.getAttribute("data-selo-mulher"));
      el.textContent = feito ? "Já conhecida" : "Ainda não conhecida";
      el.classList.toggle("feito", feito);
    });
  }

  function atualizarProgresso() {
    var n = totalConcluidos();
    var pct = n * 20;

    todos("[data-count-total]").forEach(function (el) { el.textContent = n; });
    todos("[data-count-percent]").forEach(function (el) { el.textContent = pct + "%"; });

    todos("[data-barra]").forEach(function (barra) {
      barra.setAttribute("aria-valuenow", String(pct));
      var enchimento = barra.querySelector(".barra-preenchida");
      if (enchimento) enchimento.style.width = pct + "%";
    });

    var legenda = document.getElementById("barra-legenda");
    if (legenda) legenda.textContent = pct + "% da jornada concluída";

    var texto = document.getElementById("contagem-texto");
    if (texto) {
      texto.textContent = n + (n === 1 ? " de 5 mulheres conhecidas" : " de 5 mulheres conhecidas");
    }
  }

  /* ---------------------------------------------------------
     Áreas de conhecimento: aprofundamento liberado pelo quiz
     --------------------------------------------------------- */
  function iniciarAreaConhecimento() {
    var id = document.body.getAttribute("data-area");
    if (!id || !MULHERES[id]) return;

    var aberta = quizConcluido(id);
    todos("[data-bloqueio]").forEach(function (el) { el.hidden = aberta; });
    todos("[data-extra]").forEach(function (el) { el.hidden = !aberta; });
  }

  /* ---------------------------------------------------------
     Quiz
     --------------------------------------------------------- */
  function iniciarQuiz() {
    var id = document.body.getAttribute("data-quiz");
    var form = document.getElementById("quiz-form");
    if (!id || !form || !QUIZZES[id]) return;

    var dados = QUIZZES[id];
    var mulher = MULHERES[id];
    var resultado = document.getElementById("resultado");
    var msgErro = document.getElementById("msg-erro");
    var jaConcluido = document.getElementById("ja-concluido");

    if (jaConcluido) jaConcluido.hidden = !quizConcluido(id);

    function limparMarcas() {
      todos(".pergunta", form).forEach(function (p) {
        p.classList.remove("certa", "errada");
      });
      todos(".dica-quiz", form).forEach(function (d) {
        d.parentNode.removeChild(d);
      });
    }

    function tentarNovamente() {
      form.reset();
      limparMarcas();
      resultado.hidden = true;
      resultado.innerHTML = "";
      msgErro.textContent = "";
      form.hidden = false;
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    form.addEventListener("submit", function (evento) {
      evento.preventDefault();
      limparMarcas();
      msgErro.textContent = "";

      var chaves = Object.keys(dados.respostas);
      var marcadas = {};
      var faltando = [];

      chaves.forEach(function (q) {
        var escolhida = form.querySelector('input[name="' + q + '"]:checked');
        if (escolhida) {
          marcadas[q] = escolhida.value;
        } else {
          faltando.push(q.replace("q", ""));
        }
      });

      if (faltando.length > 0) {
        msgErro.textContent = faltando.length === 1
          ? "Falta responder a pergunta " + faltando[0] + "."
          : "Faltam responder as perguntas " + faltando.join(", ") + ".";
        return;
      }

      var acertos = 0;
      chaves.forEach(function (q) {
        var bloco = form.querySelector('.pergunta[data-q="' + q.replace("q", "") + '"]');
        var certa = marcadas[q] === dados.respostas[q];
        if (certa) acertos++;
        if (!bloco) return;
        bloco.classList.add(certa ? "certa" : "errada");
        if (!certa) {
          var dica = document.createElement("p");
          dica.className = "dica-quiz";
          dica.textContent = dados.dicas[q];
          bloco.appendChild(dica);
        }
      });

      var total = chaves.length;
      var html;

      if (acertos === total) {
        marcarConcluido(id);
        atualizarSelos();
        atualizarProgresso();
        if (jaConcluido) jaConcluido.hidden = false;

        html =
          "<h2>Parabéns! Você acertou " + acertos + " de " + total + ".</h2>" +
          "<p>Você conheceu a história de " + mulher.nome + ". " +
          "A área de conhecimento <strong>" + mulher.area + "</strong> foi desbloqueada.</p>" +
          '<div class="acoes">' +
          '<a class="btn" href="' + mulher.areaPagina + '">Abrir a área de conhecimento</a>' +
          '<a class="btn btn-sec" href="jornada.html">Ver minha jornada</a>' +
          '<a class="btn btn-sec" href="mulheres.html">Conhecer outra mulher</a>' +
          "</div>";
        resultado.className = "resultado sucesso";
        form.hidden = true;
      } else {
        html =
          "<h2>Você acertou " + acertos + " de " + total + ".</h2>" +
          "<p>Quase lá! Veja as dicas nas perguntas marcadas, releia a página de " +
          mulher.nome + " e tente de novo. Não há limite de tentativas.</p>" +
          '<div class="acoes">' +
          '<button type="button" class="btn" id="btn-novamente">Tentar novamente</button>' +
          '<a class="btn btn-sec" href="' + mulher.pagina + '">Reler a página de ' + mulher.nome + "</a>" +
          "</div>";
        resultado.className = "resultado";
      }

      resultado.innerHTML = html;
      resultado.hidden = false;

      var novamente = document.getElementById("btn-novamente");
      if (novamente) novamente.addEventListener("click", tentarNovamente);

      resultado.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ---------------------------------------------------------
     Avatar em camadas
     --------------------------------------------------------- */
  function avatarPadrao() {
    var estado = {};
    PARTES.forEach(function (p) { estado[p.chave] = 1; });
    return estado;
  }

  function lerAvatar() {
    var estado = avatarPadrao();
    var bruto = lerItem(CHAVE_AVATAR);
    if (!bruto) return estado;
    try {
      var salvo = JSON.parse(bruto);
      PARTES.forEach(function (p) {
        var v = parseInt(salvo[p.chave], 10);
        if (v >= 1 && v <= p.total) estado[p.chave] = v;
      });
    } catch (e) { /* usa o padrão */ }
    return estado;
  }

  function gravarAvatar(estado) {
    gravarItem(CHAVE_AVATAR, JSON.stringify(estado));
  }

  function caminhoImagem(parte, numero) {
    return "img/" + parte.prefixo + doisDigitos(numero) + ".png";
  }

  /* Cria as camadas dentro de um palco e devolve uma função de atualização */
  function montarPalco(palco) {
    var camadas = {};

    function verificarVazio() {
      var algumaVisivel = PARTES.some(function (p) {
        var img = camadas[p.chave];
        return img.complete && img.naturalWidth > 0 && !img.classList.contains("ausente");
      });
      palco.classList.toggle("sem-imagens", !algumaVisivel);
    }

    PARTES.forEach(function (parte) {
      var img = document.createElement("img");
      img.className = "camada";
      img.alt = "";
      img.setAttribute("data-parte", parte.chave);
      img.addEventListener("load", function () {
        img.classList.remove("ausente");
        verificarVazio();
      });
      img.addEventListener("error", function () {
        img.classList.add("ausente");
        verificarVazio();
      });
      palco.appendChild(img);
      camadas[parte.chave] = img;
    });

    palco.setAttribute("role", "img");
    palco.setAttribute("aria-label", "Seu avatar");

    return function atualizar(estado) {
      PARTES.forEach(function (parte) {
        var img = camadas[parte.chave];
        var destino = caminhoImagem(parte, estado[parte.chave]);
        if (img.getAttribute("data-src") !== destino) {
          img.setAttribute("data-src", destino);
          img.classList.remove("ausente");
          img.src = destino;
        }
      });
    };
  }

  function iniciarAvatarPreviews() {
    todos("[data-avatar-preview]").forEach(function (palco) {
      var atualizar = montarPalco(palco);
      atualizar(lerAvatar());
    });
  }

  function iniciarAvatar() {
    var palco = document.getElementById("avatar-palco");
    var painel = document.getElementById("partes");
    if (!palco || !painel) return;

    var atualizarPalco = montarPalco(palco);
    var estado = lerAvatar();
    var botoesPorParte = {};
    var avisoSalvo = document.getElementById("salvo");

    function marcarSalvo() {
      if (avisoSalvo) avisoSalvo.textContent = "Escolhas salvas neste navegador.";
    }

    function atualizarBotoes() {
      PARTES.forEach(function (parte) {
        botoesPorParte[parte.chave].forEach(function (botao, i) {
          botao.setAttribute("aria-pressed", String(i + 1 === estado[parte.chave]));
        });
      });
    }

    function escolher(parte, numero) {
      estado[parte.chave] = numero;
      gravarAvatar(estado);
      atualizarPalco(estado);
      atualizarBotoes();
      marcarSalvo();
    }

    function criarBotao(parte, numero) {
      var botao = document.createElement("button");
      botao.type = "button";
      botao.className = "opcao-avatar";
      botao.setAttribute("aria-label", parte.rotulo + " " + numero);
      botao.setAttribute("aria-pressed", "false");
      botao.title = parte.rotulo + " " + numero;

      var miniatura = document.createElement("img");
      miniatura.alt = "";
      var rotuloNumero = document.createElement("span");
      rotuloNumero.className = "num-central";
      rotuloNumero.textContent = doisDigitos(numero);

      miniatura.addEventListener("load", function () {
        miniatura.classList.remove("ausente");
        rotuloNumero.className = "num";
      });
      miniatura.addEventListener("error", function () {
        miniatura.classList.add("ausente");
        rotuloNumero.className = "num-central";
      });
      miniatura.src = caminhoImagem(parte, numero);

      botao.appendChild(miniatura);
      botao.appendChild(rotuloNumero);
      botao.addEventListener("click", function () { escolher(parte, numero); });
      return botao;
    }

    painel.innerHTML = "";

    PARTES.forEach(function (parte) {
      var conjunto = document.createElement("fieldset");
      conjunto.className = "parte";
      var legenda = document.createElement("legend");
      legenda.textContent = parte.rotulo;
      conjunto.appendChild(legenda);

      botoesPorParte[parte.chave] = [];
      var tamanhoGrupo = parte.grupo || parte.total;
      var grade = null;

      for (var n = 1; n <= parte.total; n++) {
        if (!grade || (n - 1) % tamanhoGrupo === 0) {
          grade = document.createElement("div");
          grade.className = "opcoes-grade";
          conjunto.appendChild(grade);
        }
        var botao = criarBotao(parte, n);
        botoesPorParte[parte.chave].push(botao);
        grade.appendChild(botao);
      }

      if (parte.grupo) {
        var dica = document.createElement("p");
        dica.className = "dica-parte";
        dica.textContent = "Cada linha é um tom de cabelo, com três texturas/estilos.";
        conjunto.appendChild(dica);
      }

      painel.appendChild(conjunto);
    });

    var sortear = document.getElementById("btn-sortear");
    if (sortear) {
      sortear.addEventListener("click", function () {
        PARTES.forEach(function (parte) {
          estado[parte.chave] = 1 + Math.floor(Math.random() * parte.total);
        });
        gravarAvatar(estado);
        atualizarPalco(estado);
        atualizarBotoes();
        marcarSalvo();
      });
    }

    var restaurar = document.getElementById("btn-restaurar");
    if (restaurar) {
      restaurar.addEventListener("click", function () {
        estado = avatarPadrao();
        gravarAvatar(estado);
        atualizarPalco(estado);
        atualizarBotoes();
        marcarSalvo();
      });
    }

    atualizarPalco(estado);
    atualizarBotoes();
  }

  /* ---------------------------------------------------------
     Início
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    atualizarSelos();
    atualizarProgresso();
    iniciarAreaConhecimento();
    iniciarQuiz();
    iniciarAvatarPreviews();
    iniciarAvatar();
  });
})();
