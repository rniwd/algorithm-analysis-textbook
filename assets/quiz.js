/* Квизы и задачи. Данные: window.QUIZ[ключ], window.TASKS[ключ] (папка data/) */
(function () {
  "use strict";

  var LEVEL_NAMES = { A: "A", B: "B", C: "C", F: "Найди ошибку", E: "Эмпирическая" };

  function store(key, value) {
    try {
      if (value === undefined) return JSON.parse(localStorage.getItem(key) || "null");
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      return null;
    }
    return null;
  }

  function renderQuiz(box) {
    var key = box.getAttribute("data-quiz");
    var quiz = (window.QUIZ || {})[key];
    if (!quiz) { box.textContent = "Квиз не найден: " + key; return; }
    var skey = "quiz:" + key;
    var state = store(skey) || {};
    var total = quiz.length;

    box.innerHTML = "";
    quiz.forEach(function (q, qi) {
      var el = document.createElement("div");
      el.className = "q";
      el.id = key + "-q" + (qi + 1);
      var head = document.createElement("div");
      head.className = "q-head";
      head.innerHTML = '<span class="n">' + (qi + 1) + ".</span>" + q.q;
      el.appendChild(head);
      var ul = document.createElement("ul");
      ul.className = "opts";
      q.options.forEach(function (o, oi) {
        var li = document.createElement("li");
        var b = document.createElement("button");
        b.type = "button";
        b.className = "opt" + (o.ok ? " right-ans" : "");
        b.innerHTML = '<span class="t">' + o.t + '</span><span class="why">' + o.why + "</span>";
        b.addEventListener("click", function () {
          if (el.classList.contains("done")) return;
          state[q.id] = oi;
          store(skey, state);
          apply(el, q, oi);
          updateScore();
        });
        li.appendChild(b);
        ul.appendChild(li);
      });
      el.appendChild(ul);
      box.appendChild(el);
      if (typeof state[q.id] === "number") apply(el, q, state[q.id]);
    });

    var foot = document.createElement("div");
    foot.className = "quiz-foot";
    foot.innerHTML = '<span class="quiz-score" aria-live="polite"></span><button type="button" class="reset">Пройти заново</button>';
    box.appendChild(foot);
    var scoreEl = foot.querySelector(".quiz-score");
    foot.querySelector(".reset").addEventListener("click", function () {
      state = {};
      store(skey, null);
      box.querySelectorAll(".q").forEach(function (el) {
        el.classList.remove("done");
        el.querySelectorAll(".opt").forEach(function (b) {
          b.classList.remove("chosen", "right", "wrong");
          b.disabled = false;
        });
      });
      updateScore();
      box.querySelector(".q").scrollIntoView({ block: "start" });
    });

    function updateScore() {
      var answered = 0, correct = 0;
      quiz.forEach(function (q) {
        if (typeof state[q.id] === "number") {
          answered++;
          if (q.options[state[q.id]] && q.options[state[q.id]].ok) correct++;
        }
      });
      if (answered === total) scoreEl.textContent = "Результат: " + correct + " из " + total;
      else scoreEl.textContent = "Отвечено " + answered + " из " + total + ", верно " + correct;
      box.setAttribute("data-score", correct);
      box.setAttribute("data-answered", answered);
    }
    updateScore();
  }

  function apply(el, q, chosen) {
    el.classList.add("done");
    el.querySelectorAll(".opt").forEach(function (b, oi) {
      b.classList.toggle("chosen", oi === chosen);
      b.classList.toggle("right", !!q.options[oi].ok);
      b.classList.toggle("wrong", !q.options[oi].ok);
      b.setAttribute("aria-disabled", "true");
    });
  }

  function renderTasks(box) {
    var key = box.getAttribute("data-tasks");
    var level = box.getAttribute("data-level");
    var list = ((window.TASKS || {})[key] || []).filter(function (t) { return !level || t.level === level; });
    box.className += " task-group";
    list.forEach(function (t) {
      var art = document.createElement("article");
      art.className = "task";
      var h = document.createElement("h4");
      h.id = t.id;
      h.innerHTML = '<span class="tag">' + t.label + ".</span>" + t.title;
      art.appendChild(h);
      var st = document.createElement("div");
      st.className = "statement";
      st.innerHTML = t.text;
      art.appendChild(st);
      [["hint", "Подсказка"], ["answer", "Ответ"], ["solution", "Полное решение"]].forEach(function (p) {
        var d = document.createElement("details");
        d.id = t.id + "-" + p[0];
        d.innerHTML = "<summary>" + p[1] + '</summary><div class="body">' + t[p[0]] + "</div>";
        art.appendChild(d);
      });
      box.appendChild(art);
    });
  }

  window.App = window.App || {};
  var prev = window.App.renderContent;
  window.App.renderContent = function () {
    if (prev) prev();
    document.querySelectorAll("[data-quiz]").forEach(renderQuiz);
    document.querySelectorAll("[data-tasks]").forEach(renderTasks);
  };
  window.App.LEVEL_NAMES = LEVEL_NAMES;
})();
