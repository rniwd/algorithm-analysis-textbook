/* Визуализации модуля 2: дерево Фибоначчи (с мемоизацией и без), стек факториала, BinRec, пошаговые выводы */
(function () {
  "use strict";
  var V = window.Viz, svg = V.svg, html = V.html;

  // ---------- дерево вызовов Фибоначчи ----------
  function fib(root) {
    var n = 5, memo = false, events = [], tree = null, highlight = null;
    var stage = html("div", { class: "viz-stage" }, root);
    var box = html("div", null, stage);
    var status = html("div", { class: "viz-status", "aria-live": "polite" }, stage);
    var controls = html("div", { class: "viz-controls" }, root);
    var lab = html("label", null, controls);
    lab.appendChild(document.createTextNode("n ="));
    var sel = html("select", { "aria-label": "Номер числа Фибоначчи" }, lab);
    for (var i = 2; i <= 7; i++) { var o = html("option", { value: i }, sel, String(i)); if (i === n) o.selected = true; }
    var bMemo = html("button", { type: "button", "aria-pressed": "false" }, controls, "с мемоизацией");
    var ctl = html("span", { style: "display:contents" }, controls);
    var note = html("div", { class: "viz-status" }, root);

    // строим дерево реально выполненных вызовов
    function build() {
      var table = {}, id = 0;
      function call(k, depth) {
        var node = { id: id++, k: k, depth: depth, kids: [], hit: false, order: 0 };
        if (memo && table[k] !== undefined) { node.hit = true; return node; }
        if (k > 1) {
          node.kids.push(call(k - 1, depth + 1));
          node.kids.push(call(k - 2, depth + 1));
        }
        if (memo) table[k] = true;
        return node;
      }
      tree = call(n, 0);
      // раскладка: листья слева направо
      var leafX = 0, list = [], maxDepth = 0;
      (function lay(nd) {
        nd.order = list.length; list.push(nd);
        maxDepth = Math.max(maxDepth, nd.depth);
        if (!nd.kids.length) { nd.x = leafX++; return; }
        nd.kids.forEach(lay);
        nd.x = (nd.kids[0].x + nd.kids[nd.kids.length - 1].x) / 2;
      })(tree);
      events = list;
      var gap = 34, levelH = 46, w = Math.max(leafX, 2) * gap + 20, h = (maxDepth + 1) * levelH;
      box.innerHTML = "";
      var s = svg("svg", { viewBox: "0 0 " + w + " " + h, role: "img", "aria-label": "Дерево вызовов F(" + n + ")" }, box);
      s.style.maxHeight = "380px";
      var X = function (nd) { return 10 + gap / 2 + nd.x * gap; };
      var Y = function (nd) { return 18 + nd.depth * levelH; };
      var eg = svg("g", null, s);
      (function draw(nd, parent) {
        if (parent) nd.edge = svg("line", { x1: X(parent), y1: Y(parent), x2: X(nd), y2: Y(nd), stroke: "var(--line)", "stroke-width": 1.4 }, eg);
        var g = svg("g", { style: "cursor:pointer" }, s);
        nd.c = svg("circle", { cx: X(nd), cy: Y(nd), r: 13, "stroke-width": 1.5 }, g);
        nd.t = svg("text", { x: X(nd), y: Y(nd) + 4, "text-anchor": "middle", "font-size": 11 }, g);
        nd.t.textContent = nd.k;
        var title = svg("title", null, g);
        title.textContent = "F(" + nd.k + ")" + (nd.hit ? " — готовое значение из таблицы" : "");
        g.addEventListener("click", function () { highlight = highlight === nd.k ? null : nd.k; render(player.k); });
        nd.kids.forEach(function (c) { draw(c, nd); });
      })(tree, null);
    }

    function counts() {
      var calls = events.length, adds = 0, repeats = 0, seen = {};
      events.forEach(function (nd) {
        if (nd.kids.length) adds++;
        if (seen[nd.k] && !nd.hit) repeats++;
        seen[nd.k] = true;
      });
      return { calls: calls, adds: adds, repeats: repeats };
    }

    function render(k) {
      var seen = {};
      events.forEach(function (nd, idx) {
        var on = idx < k, cur = idx === k - 1;
        var repeat = seen[nd.k] && !nd.hit;
        if (idx < k) seen[nd.k] = true;
        var hl = highlight !== null && nd.k === highlight;
        var fill = "var(--surface)", stroke = "var(--line)", txt = "var(--muted)";
        if (on) { fill = repeat ? "var(--bad-soft)" : nd.hit ? "var(--ok-soft)" : "var(--accent-soft)"; stroke = repeat ? "var(--bad)" : nd.hit ? "var(--ok)" : "var(--accent)"; txt = "var(--fg)"; }
        if (cur) { fill = "var(--accent)"; stroke = "var(--accent)"; txt = "var(--accent-ink)"; }
        if (hl) { stroke = "var(--fg)"; }
        nd.c.setAttribute("fill", fill);
        nd.c.setAttribute("stroke", stroke);
        nd.c.setAttribute("stroke-width", hl ? 3 : 1.5);
        nd.c.setAttribute("stroke-dasharray", nd.hit ? "3 2" : "");
        nd.t.setAttribute("fill", txt);
        if (nd.edge) nd.edge.setAttribute("stroke", on ? "var(--accent-mid)" : "var(--line)");
      });
      var c = counts(), doneCalls = Math.min(k, events.length);
      var txt = "Вызовов: <b>" + doneCalls + "</b> из " + c.calls + " &nbsp;·&nbsp; сложений всего: <b>" + c.adds + "</b>";
      if (!memo) txt += " = F(" + (n + 1) + ") − 1 &nbsp;·&nbsp; повторных вычислений: <b>" + c.repeats + "</b>";
      else txt += " = n − 1 &nbsp;·&nbsp; вызовов 2n − 1 = " + (2 * n - 1);
      if (k > 0) txt += "<br>Сейчас: F(" + events[k - 1].k + ")" + (events[k - 1].hit ? " — значение уже есть в таблице, сразу возврат" : "");
      status.innerHTML = txt;
      note.textContent = memo
        ? "Пунктирные узлы — обращения к таблице: значение уже вычислено, рекурсии нет."
        : "Красным отмечены повторные вычисления уже встречавшихся F(k). Нажмите на узел, чтобы выделить все вызовы с тем же аргументом.";
    }

    var player = new V.Player({ controls: ctl, total: function () { return events.length; }, render: render, speed: 450 });
    function reset() { build(); player.reset(); }
    sel.addEventListener("change", function () { n = +sel.value; highlight = null; reset(); });
    bMemo.addEventListener("click", function () { memo = !memo; bMemo.setAttribute("aria-pressed", memo); highlight = null; reset(); });
    reset();
    root.fib = { player: player, counts: counts, setMemo: function (m) { memo = m; bMemo.setAttribute("aria-pressed", m); reset(); } };
  }

  // ---------- стек вызовов факториала ----------
  function factorial(root) {
    var n = 5, steps = [];
    var stage = html("div", { class: "viz-stage" }, root);
    var wrap = html("div", { style: "display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:1rem;align-items:end" }, stage);
    var stackBox = html("div", { class: "stack-panel", style: "min-height:12rem" }, wrap);
    var side = html("div", null, wrap);
    var status = html("div", { class: "viz-status", "aria-live": "polite" }, stage);
    var controls = html("div", { class: "viz-controls" }, root);
    var lab = html("label", null, controls);
    lab.appendChild(document.createTextNode("n ="));
    var sel = html("select", { "aria-label": "Аргумент факториала" }, lab);
    for (var i = 0; i <= 7; i++) { var o = html("option", { value: i }, sel, String(i)); if (i === n) o.selected = true; }
    var ctl = html("span", { style: "display:contents" }, controls);

    function build() {
      steps = [];
      // фаза спуска: вызовы F(n), F(n−1), …, F(0); фаза подъёма: возвраты с умножениями
      for (var k = n; k >= 0; k--) steps.push({ type: "call", k: k });
      var val = 1;
      steps.push({ type: "ret", k: 0, val: 1, mult: false });
      for (var j = 1; j <= n; j++) { val *= j; steps.push({ type: "ret", k: j, val: val, mult: true }); }
    }
    function render(t) {
      var depth = 0, mults = 0, maxDepth = 0, lastRet = null, frames = [];
      for (var i = 0; i < t; i++) {
        var st = steps[i];
        if (st.type === "call") { frames.push(st.k); depth++; maxDepth = Math.max(maxDepth, depth); }
        else { if (st.mult) mults++; frames.pop(); depth--; lastRet = st; }
      }
      stackBox.innerHTML = "";
      frames.forEach(function (k, idx) {
        var label = "F(" + k + ")" + (k === 0 ? "" : " ждёт F(" + (k - 1) + ") · " + k);
        html("div", { class: "stack-frame" + (idx === frames.length - 1 ? " top" : "") }, stackBox, label);
      });
      side.innerHTML = '<p class="panel-title">Счётчики</p><div class="small">Глубина стека: <b>' + depth + "</b><br>Наибольшая глубина: <b>" + maxDepth + "</b> (будет n + 1 = " + (n + 1) + ")<br>Умножений: <b>" + mults + "</b> (будет M(n) = n = " + n + ")</div>";
      var txt;
      if (t === 0) txt = "Нажмите «шаг»: каждый вызов кладёт запись в стек.";
      else {
        var st2 = steps[t - 1];
        if (st2.type === "call") txt = "Вызов F(" + st2.k + ")" + (st2.k === 0 ? ": n = 0, умножений нет, возвращаем 1." : ": нужно сначала вычислить F(" + (st2.k - 1) + ").");
        else txt = st2.mult ? "Возврат из F(" + st2.k + "): F(" + (st2.k - 1) + ") · " + st2.k + " = " + st2.val + " — одно умножение." : "Возврат из F(0) = 1.";
      }
      if (t === steps.length) txt += " Итог: " + n + "! = " + (lastRet ? lastRet.val : 1) + ", умножений " + mults + ".";
      status.textContent = txt;
    }
    var player = new V.Player({ controls: ctl, total: function () { return steps.length; }, render: render, speed: 600 });
    sel.addEventListener("change", function () { n = +sel.value; build(); player.reset(); });
    build(); player.reset();
  }

  // ---------- BinRec: деление пополам ----------
  function binrec(root) {
    var n = 37, chain = [];
    var stage = html("div", { class: "viz-stage" }, root);
    var box = html("div", { style: "font-family:var(--mono);font-size:0.9rem;line-height:1.9" }, stage);
    var status = html("div", { class: "viz-status", "aria-live": "polite" }, stage);
    var controls = html("div", { class: "viz-controls" }, root);
    var lab = html("label", null, controls);
    lab.appendChild(document.createTextNode("n ="));
    var inp = html("input", { type: "number", min: 1, max: 1000000, value: n, "aria-label": "Значение n" }, lab);
    var ctl = html("span", { style: "display:contents" }, controls);

    function build() {
      chain = [];
      for (var v = n; ; v = Math.floor(v / 2)) { chain.push(v); if (v === 1) break; }
    }
    function render(k) {
      box.innerHTML = "";
      var bits = n.toString(2).length;
      chain.forEach(function (v, idx) {
        if (idx > k) return;
        var row = html("div", { style: "display:flex;gap:1rem;flex-wrap:wrap;white-space:nowrap" + (idx === k ? ";color:var(--accent)" : "") }, box);
        var b = v.toString(2);
        html("span", { style: "min-width:11ch" }, row, "BinRec(" + v + ")");
        var bin = html("span", { style: "min-width:" + (bits + 2) + "ch" }, row);
        bin.innerHTML = b + '<span style="opacity:.25">' + n.toString(2).slice(b.length) + "</span>";
        html("span", { class: "muted" }, row, v === 1 ? "n = 1: return 1, сложений нет" : "→ BinRec(⌊" + v + "/2⌋) + 1");
      });
      var adds = Math.min(k, chain.length - 1);
      var txt = "Глубина рекурсии: <b>" + (k + 1) + "</b> &nbsp;·&nbsp; сложений будет выполнено: <b>" + adds + "</b>";
      if (k === chain.length - 1) txt = "Дошли до n = 1. При возврате выполняется <b>" + (chain.length - 1) + "</b> сложений = ⌊log₂ " + n + "⌋. Результат — " + chain.length + " бит(а). Каждое деление пополам отбрасывает последний бит.";
      status.innerHTML = txt;
    }
    var player = new V.Player({ controls: ctl, total: function () { return chain.length - 1; }, render: render, speed: 700 });
    function reset() { n = Math.max(1, Math.min(1000000, Math.floor(+inp.value) || 37)); inp.value = n; build(); player.reset(); }
    inp.addEventListener("change", reset);
    reset();
  }

  // ---------- пошаговые выводы: строки раскрываются по клику ----------
  function reveal(root) {
    var items = Array.prototype.slice.call(root.querySelectorAll("li"));
    var shown = 1;
    var ctl = html("div", { class: "viz-controls" }, null);
    root.parentNode.insertBefore(ctl, root.nextSibling);
    var bNext = html("button", { type: "button", class: "primary" }, ctl, "следующий шаг");
    var bAll = html("button", { type: "button" }, ctl, "показать всё");
    var bHide = html("button", { type: "button" }, ctl, "свернуть");
    function sync() {
      items.forEach(function (li, i) { li.classList.toggle("hidden", i >= shown); });
      bNext.disabled = bAll.disabled = shown >= items.length;
      bHide.disabled = shown <= 1;
    }
    bNext.addEventListener("click", function () { shown++; sync(); });
    bAll.addEventListener("click", function () { shown = items.length; sync(); });
    bHide.addEventListener("click", function () { shown = 1; sync(); });
    items.forEach(function (li, i) {
      li.style.cursor = "pointer";
      li.addEventListener("click", function () { if (i === shown - 1 && shown < items.length) { shown++; sync(); } });
    });
    sync();
  }

  V.onReady(function () {
    document.querySelectorAll("[data-viz='fib']").forEach(fib);
    document.querySelectorAll("[data-viz='factorial']").forEach(factorial);
    document.querySelectorAll("[data-viz='binrec']").forEach(binrec);
    document.querySelectorAll(".reveal-lines").forEach(reveal);
  });
})();
