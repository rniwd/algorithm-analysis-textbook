/* Ханойская башня: анимация, дерево вызовов, стек, таблица M(n), режим «попробуй сам» */
(function () {
  "use strict";
  var V = window.Viz, svg = V.svg, html = V.html;
  var PEGS = ["A", "B", "C"];

  // Трасса алгоритма: узлы дерева (в порядке вызова) и ходы (в порядке выполнения)
  function trace(n) {
    var nodes = [], moves = [];
    function hanoi(m, from, to, aux, depth, parent) {
      var node = { id: nodes.length, m: m, from: from, to: to, aux: aux, depth: depth, parent: parent, first: 0, last: 0 };
      nodes.push(node);
      if (m === 1) {
        moves.push({ disk: 1, from: from, to: to, node: node.id });
        node.move = moves.length;
      } else {
        hanoi(m - 1, from, aux, to, depth + 1, node.id);
        moves.push({ disk: m, from: from, to: to, node: node.id });
        node.move = moves.length;
        hanoi(m - 1, aux, to, from, depth + 1, node.id);
      }
      node.last = moves.length;          // последний ход внутри поддерева
      return node;
    }
    hanoi(n, 0, 2, 1, 0, -1);
    nodes.forEach(function (nd) {
      // первый ход поддерева: самый левый лист
      var first = nd.move - (Math.pow(2, nd.m - 1) - 1);
      nd.first = first;
    });
    return { nodes: nodes, moves: moves };
  }

  function label(nd) {
    return "hanoi(" + nd.m + ", " + PEGS[nd.from] + ", " + PEGS[nd.to] + ", " + PEGS[nd.aux] + ")";
  }

  function init(root) {
    var n = 3, data = trace(n), mode = "algo";
    var userPegs, userMoves, selected = null, drag = null;

    var modes = html("div", { class: "hanoi-modes", role: "group", "aria-label": "Режим" }, root);
    var bAlgo = html("button", { type: "button", "aria-pressed": "true" }, modes, "Алгоритм");
    var bUser = html("button", { type: "button", "aria-pressed": "false" }, modes, "Попробуй сам");

    var grid = html("div", { class: "hanoi-grid" }, root);
    var left = html("div", { class: "viz-stage" }, grid);
    var right = html("div", { class: "viz-stage" }, grid);

    var counter = html("div", { class: "hanoi-big", "aria-live": "polite" }, left);
    var W = 420, H = 190, pegX = [75, 210, 345], baseY = 170, diskH = 15;
    var board = svg("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": "Три стержня с дисками" }, left);
    svg("rect", { x: 10, y: baseY, width: W - 20, height: 4, rx: 2, fill: "var(--line)" }, board);
    var pegEls = pegX.map(function (x, i) {
      var g = svg("g", { "data-peg": i }, board);
      svg("rect", { x: x - 62, y: 20, width: 124, height: baseY - 20, fill: "transparent" }, g);
      var rod = svg("rect", { x: x - 2.5, y: 30, width: 5, height: baseY - 30, rx: 2.5, fill: "var(--line)" }, g);
      var t = svg("text", { x: x, y: 18, "text-anchor": "middle", "font-size": 13, class: "muted-text" }, g);
      t.textContent = PEGS[i];
      return { g: g, rod: rod };
    });
    var diskLayer = svg("g", null, board);
    var diskEls = [];
    var status = html("div", { class: "viz-status" }, left);

    var treeTitle = html("p", { class: "panel-title" }, right, "Дерево рекурсивных вызовов");
    var treeBox = html("div", null, right);
    var stackTitle = html("p", { class: "panel-title", style: "margin-top:0.8rem" }, right, "Стек вызовов");
    var stackBox = html("div", { class: "stack-panel", "aria-live": "off" }, right);
    var stackNote = html("div", { class: "viz-status" }, right);

    var controls = html("div", { class: "viz-controls" }, root);
    var nLab = html("label", null, controls);
    nLab.appendChild(document.createTextNode("n ="));
    var nSel = html("select", { "aria-label": "Число дисков" }, nLab);
    for (var i = 1; i <= 8; i++) {
      var o = html("option", { value: i }, nSel, String(i));
      if (i === n) o.selected = true;
    }
    var algoCtl = html("span", { style: "display:contents" }, controls);
    var userCtl = html("span", { style: "display:none" }, controls);
    var player = new V.Player({
      controls: algoCtl,
      total: function () { return data.moves.length; },
      render: render,
      speed: 600,
      speedControl: true
    });
    var bUndo = html("button", { type: "button" }, userCtl, "отменить ход");
    var bUserReset = html("button", { type: "button" }, userCtl, "начать заново");

    // ---- таблица M(n) ----
    var tableWrap = html("div", { class: "table-wrap", style: "margin-top:1.2rem" }, root);
    var table = html("table", { class: "mtable" }, tableWrap);
    table.innerHTML = "<thead><tr><th>n</th><th>M(n) = 2·M(n−1) + 1</th><th>2ⁿ − 1</th><th>M(n) / M(n−1)</th></tr></thead>";
    var tbody = html("tbody", null, table);
    var rows = [];
    for (var r = 1; r <= 8; r++) {
      var tr = html("tr", { class: "pending" }, tbody);
      var m = Math.pow(2, r) - 1, mp = Math.pow(2, r - 1) - 1;
      html("td", null, tr, String(r));
      html("td", null, tr, r === 1 ? "1 (начальное условие)" : "2·" + mp + " + 1 = " + m);
      html("td", null, tr, String(m));
      html("td", null, tr, r === 1 ? "—" : (m / mp).toFixed(3));
      rows.push(tr);
    }
    var tableCtl = html("div", { class: "viz-controls" }, root);
    var bRow = html("button", { type: "button" }, tableCtl, "следующая строка");
    var bRows = html("button", { type: "button" }, tableCtl, "заполнить всё");
    var tableNote = html("span", { class: "muted small" }, tableCtl, "Строка заполняется и после полного прогона анимации для этого n.");
    var filled = 0;
    function fillTo(k) {
      filled = Math.max(filled, k);
      rows.forEach(function (tr, i) { tr.classList.toggle("pending", i >= filled); });
      bRow.disabled = bRows.disabled = filled >= 8;
    }
    function markRow() { rows.forEach(function (tr, i) { tr.classList.toggle("current", i === n - 1); }); }
    bRow.addEventListener("click", function () { fillTo(filled + 1); });
    bRows.addEventListener("click", function () { fillTo(8); });

    // ---- дерево ----
    var treeEls = null;
    function buildTree() {
      treeBox.innerHTML = "";
      treeEls = null;
      if (n > 5) {
        html("p", { class: "muted small", style: "margin:0.3rem 0" }, treeBox,
          "Дерево показывается при n ≤ 5: при n = " + n + " в нём " + (Math.pow(2, n) - 1) + " узлов. Глубина по-прежнему n = " + n + ".");
        return;
      }
      var cnt = data.nodes.length, gap = Math.max(22, Math.min(46, 300 / cnt * 1.6));
      var w = cnt * gap + 10, levelH = 44, h = n * levelH + 10, rad = n >= 5 ? 9 : 11;
      var s = svg("svg", { viewBox: "0 0 " + w + " " + h, role: "img", "aria-label": "Дерево вызовов: узел подписан числом дисков" }, treeBox);
      if (n <= 2) s.style.maxWidth = "220px";
      var x = function (nd) { return 5 + (nd.move - 0.5) * gap; };
      var y = function (nd) { return 16 + nd.depth * levelH; };
      var edges = svg("g", null, s);
      treeEls = data.nodes.map(function (nd) {
        var e = null;
        if (nd.parent >= 0) {
          var p = data.nodes[nd.parent];
          e = svg("line", { x1: x(p), y1: y(p), x2: x(nd), y2: y(nd), stroke: "var(--line)", "stroke-width": 1.5 }, edges);
        }
        var g = svg("g", null, s);
        var c = svg("circle", { cx: x(nd), cy: y(nd), r: rad, fill: "var(--surface)", stroke: "var(--line)", "stroke-width": 1.5 }, g);
        var t = svg("text", { x: x(nd), y: y(nd) + 4, "text-anchor": "middle", "font-size": rad > 10 ? 11 : 10 }, g);
        t.textContent = nd.m;
        var tt = svg("title", null, g);
        tt.textContent = label(nd) + ", ход №" + nd.move;
        return { c: c, t: t, e: e };
      });
    }

    function renderTree(k) {
      if (!treeEls) return;
      var cur = k > 0 ? data.moves[k - 1].node : 0;
      var path = {};
      var p = cur;
      while (p >= 0) { path[p] = true; p = data.nodes[p].parent; }
      data.nodes.forEach(function (nd, i) {
        var el = treeEls[i];
        var done = nd.last <= k;                  // вызов завершён
        var moved = nd.move <= k;
        var inStack = path[i] && !done;
        var isCur = i === cur && k > 0;
        el.c.setAttribute("fill", isCur ? "var(--accent)" : inStack ? "var(--accent-soft)" : moved ? "var(--mark)" : "var(--surface)");
        el.c.setAttribute("stroke", isCur || inStack ? "var(--accent)" : "var(--line)");
        el.t.setAttribute("fill", isCur ? "var(--accent-ink)" : done ? "var(--muted)" : "var(--fg)");
        if (el.e) el.e.setAttribute("stroke", inStack ? "var(--accent)" : "var(--line)");
      });
    }

    function stackAt(k) {
      if (k === 0) return [data.nodes[0]];
      var mv = data.moves[k - 1], out = [], p = mv.node;
      while (p >= 0) { out.unshift(data.nodes[p]); p = data.nodes[p].parent; }
      return out;
    }

    function renderStack(k) {
      var frames = stackAt(k);
      stackBox.innerHTML = "";
      frames.forEach(function (nd, i) {
        html("div", { class: "stack-frame" + (i === frames.length - 1 ? " top" : "") }, stackBox, label(nd));
      });
      if (k === data.moves.length && k > 0) stackNote.innerHTML = "Последний ход сделан, дальше вызовы только возвращаются. Наибольшая глубина стека — <b>n = " + n + "</b>.";
      else stackNote.innerHTML = "Глубина сейчас: <b>" + frames.length + "</b> &nbsp;·&nbsp; максимум за всё время: <b>n = " + n + "</b>";
    }

    // ---- диски ----
    function buildDisks() {
      diskLayer.innerHTML = "";
      diskEls = [];
      for (var d = 1; d <= n; d++) {
        var w = 30 + (d - 1) * (88 / Math.max(1, 7));
        var r = svg("rect", { x: -w / 2, y: 0, width: w, height: diskH - 2, rx: 4, fill: "var(--accent)", "fill-opacity": 0.25 + 0.75 * d / n, stroke: "var(--accent)", "stroke-width": 1 }, diskLayer);
        r.style.transition = "transform 0.25s ease";
        r.dataset.disk = d;
        diskEls[d] = r;
      }
    }

    function pegsAt(k) {
      var pegs = [[], [], []];
      for (var d = n; d >= 1; d--) pegs[0].push(d);
      for (var i = 0; i < k; i++) {
        var mv = data.moves[i];
        pegs[mv.to].push(pegs[mv.from].pop());
      }
      return pegs;
    }

    function placeDisks(pegs, fast) {
      pegs.forEach(function (stack, pi) {
        stack.forEach(function (d, h) {
          var el = diskEls[d];
          el.style.transition = fast ? "none" : "transform " + Math.min(0.25, player.delay / 1000 * 0.7) + "s ease";
          el.style.transform = "translate(" + pegX[pi] + "px," + (baseY - (h + 1) * diskH) + "px)";
          el.setAttribute("transform", "translate(" + pegX[pi] + "," + (baseY - (h + 1) * diskH) + ")");
        });
      });
    }

    function render(k) {
      var total = data.moves.length;
      placeDisks(pegsAt(k), false);
      counter.textContent = "ход " + k + " из 2" + sup(n) + " − 1 = " + total;
      if (k === 0) status.innerHTML = "Нажмите «шаг» или «пуск». Вызов: <b>" + label(data.nodes[0]) + "</b>";
      else {
        var mv = data.moves[k - 1];
        status.innerHTML = "Диск " + mv.disk + ": " + PEGS[mv.from] + " → " + PEGS[mv.to] + " &nbsp;·&nbsp; ход делает вызов <b>" + label(data.nodes[mv.node]) + "</b>";
      }
      if (k === total) {
        status.innerHTML += "<br>Готово: ровно " + total + " = 2" + sup(n) + " − 1 ходов.";
        fillTo(n);
      }
      renderTree(k);
      renderStack(k);
    }

    function sup(x) {
      var map = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
      return String(x).split("").map(function (c) { return map[c]; }).join("");
    }

    function setN(v) {
      n = v;
      data = trace(n);
      buildDisks();
      buildTree();
      markRow();
      if (mode === "algo") { player.pause(); player.k = 0; placeDisks(pegsAt(0), true); player.go(0); }
      else startUser();
    }

    // ---- режим «попробуй сам» ----
    function startUser() {
      userPegs = [[], [], []];
      for (var d = n; d >= 1; d--) userPegs[0].push(d);
      userMoves = [];
      selected = null;
      placeDisks(userPegs, true);
      highlightPeg(null);
      counter.textContent = "ваши ходы: 0 · минимум 2" + sup(n) + " − 1 = " + (Math.pow(2, n) - 1);
      status.innerHTML = "Перетащите верхний диск на другой стержень или нажмите на стержень-источник, затем на стержень-приёмник. Цель — собрать башню на C.";
      bUndo.disabled = true;
    }

    function highlightPeg(i) {
      pegEls.forEach(function (p, j) { p.rod.setAttribute("fill", j === i ? "var(--accent)" : "var(--line)"); });
    }

    function tryMove(from, to) {
      if (from === to) return false;
      var src = userPegs[from], dst = userPegs[to];
      if (!src.length) { status.innerHTML = '<span class="msg-bad">На стержне ' + PEGS[from] + " нет дисков.</span>"; return false; }
      var d = src[src.length - 1];
      if (dst.length && dst[dst.length - 1] < d) {
        status.innerHTML = '<span class="msg-bad">Нельзя: диск ' + d + " больше диска " + dst[dst.length - 1] + " на стержне " + PEGS[to] + ".</span>";
        return false;
      }
      dst.push(src.pop());
      userMoves.push([from, to]);
      afterUserMove(d, from, to);
      return true;
    }

    function afterUserMove(d, from, to) {
      var min = Math.pow(2, n) - 1, m = userMoves.length;
      counter.textContent = "ваши ходы: " + m + " · минимум 2" + sup(n) + " − 1 = " + min;
      bUndo.disabled = m === 0;
      if (userPegs[2].length === n) {
        status.innerHTML = m === min
          ? '<span class="msg-ok">Башня собрана за ' + m + " ходов — это минимум 2" + sup(n) + " − 1.</span>"
          : '<span class="msg-ok">Башня собрана за ' + m + " ходов.</span> Минимум — " + min + ", лишних ходов: " + (m - min) + ".";
      } else if (d) {
        status.innerHTML = "Диск " + d + ": " + PEGS[from] + " → " + PEGS[to] + ".";
      }
    }

    bUndo.addEventListener("click", function () {
      var last = userMoves.pop();
      if (!last) return;
      userPegs[last[0]].push(userPegs[last[1]].pop());
      placeDisks(userPegs, false);
      afterUserMove(0);
      status.textContent = "Ход отменён.";
    });
    bUserReset.addEventListener("click", startUser);

    function svgPoint(evt) {
      var pt = board.createSVGPoint();
      pt.x = evt.clientX; pt.y = evt.clientY;
      return pt.matrixTransform(board.getScreenCTM().inverse());
    }
    function nearestPeg(x) {
      var best = 0;
      pegX.forEach(function (px, i) { if (Math.abs(px - x) < Math.abs(pegX[best] - x)) best = i; });
      return best;
    }

    board.addEventListener("pointerdown", function (e) {
      if (mode !== "user") return;
      var p = svgPoint(e), peg = nearestPeg(p.x);
      var stack = userPegs[peg];
      if (!stack.length) { if (selected !== null) clickPeg(peg); return; }
      var d = stack[stack.length - 1];
      drag = { disk: d, from: peg, x0: p.x, y0: p.y, moved: false, id: e.pointerId };
      try { board.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      e.preventDefault();
    });
    board.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var p = svgPoint(e);
      if (Math.abs(p.x - drag.x0) + Math.abs(p.y - drag.y0) > 6) drag.moved = true;
      if (!drag.moved) return;
      var el = diskEls[drag.disk];
      el.style.transition = "none";
      var tx = "translate(" + p.x + "px," + (p.y - diskH / 2) + "px)";
      el.style.transform = tx;
      highlightPeg(nearestPeg(p.x));
    });
    board.addEventListener("pointerup", function (e) {
      if (!drag) return;
      var p = svgPoint(e), d = drag;
      drag = null;
      if (!d.moved) { clickPeg(d.from); return; }
      highlightPeg(null);
      selected = null;
      tryMove(d.from, nearestPeg(p.x));
      placeDisks(userPegs, false);
    });
    board.addEventListener("pointercancel", function () { drag = null; placeDisks(userPegs, false); highlightPeg(null); });

    function clickPeg(i) {
      if (selected === null) {
        if (!userPegs[i].length) return;
        selected = i;
        highlightPeg(i);
        status.textContent = "Выбран стержень " + PEGS[i] + ". Теперь выберите, куда переложить диск.";
      } else {
        var from = selected;
        selected = null;
        highlightPeg(null);
        if (from !== i) tryMove(from, i);
        placeDisks(userPegs, false);
      }
    }

    function setMode(m) {
      mode = m;
      bAlgo.setAttribute("aria-pressed", m === "algo");
      bUser.setAttribute("aria-pressed", m === "user");
      algoCtl.style.display = m === "algo" ? "contents" : "none";
      userCtl.style.display = m === "user" ? "contents" : "none";
      right.style.display = m === "algo" ? "" : "none";
      board.style.cursor = m === "user" ? "grab" : "";
      board.style.touchAction = m === "user" ? "none" : "";
      if (m === "algo") { player.pause(); placeDisks(pegsAt(0), true); player.go(0); }
      else { player.pause(); startUser(); }
    }
    bAlgo.addEventListener("click", function () { setMode("algo"); });
    bUser.addEventListener("click", function () { setMode("user"); });
    nSel.addEventListener("change", function () { setN(+nSel.value); });

    // доступ для автотестов
    root.hanoi = { player: player, setN: setN, setMode: setMode, state: function () { return { n: n, k: player.k, total: data.moves.length, pegs: mode === "user" ? userPegs : pegsAt(player.k), moves: mode === "user" ? userMoves.length : player.k }; }, tryMove: function (a, b) { var r = tryMove(a, b); placeDisks(userPegs, false); return r; } };

    setN(n);
  }

  V.onReady(function () {
    document.querySelectorAll("[data-viz='hanoi']").forEach(init);
  });
})();
