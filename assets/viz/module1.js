/* Визуализации модуля 1: сетка пар UniqueElements, цикл i ← 2i, график роста, средний случай поиска */
(function () {
  "use strict";
  var V = window.Viz, svg = V.svg, html = V.html, T = V.T;

  // ---------- сетка пар (i, j) для UniqueElements ----------
  function pairs(root) {
    var n = 8, best = false;
    var stage = html("div", { class: "viz-stage" }, root);
    var box = html("div", null, stage);
    var status = html("div", { class: "viz-status", "aria-live": "polite" }, stage);
    var controls = html("div", { class: "viz-controls" }, root);
    var lab = html("label", null, controls);
    lab.appendChild(document.createTextNode("n ="));
    var inp = html("input", { type: "number", min: 2, max: 14, value: n, "aria-label": T("Размер массива", "Array size") }, lab);
    var bCase = html("button", { type: "button", "aria-pressed": "false" }, controls, T("вход A[0] = A[1]", "input A[0] = A[1]"));
    var ctl = html("span", { style: "display:contents" }, controls);
    var cells = [], order = [];

    function build() {
      box.innerHTML = "";
      cells = []; order = [];
      var c = 26, pad = 30, size = pad + n * c + 4;
      var s = svg("svg", { viewBox: "0 0 " + size + " " + size, role: "img", "aria-label": T("Сетка пар индексов i и j", "Grid of index pairs i and j") }, box);
      s.style.maxWidth = Math.min(420, size * 1.4) + "px";
      s.style.margin = "0 auto";
      var ti = svg("text", { x: 4, y: pad - 10, "font-size": 11, class: "muted-text" }, s); ti.textContent = "i \\ j";
      for (var k = 0; k < n; k++) {
        var tj = svg("text", { x: pad + k * c + c / 2, y: pad - 8, "text-anchor": "middle", "font-size": 11, class: "muted-text" }, s); tj.textContent = k;
        var tr = svg("text", { x: pad - 8, y: pad + k * c + c / 2 + 4, "text-anchor": "end", "font-size": 11, class: "muted-text" }, s); tr.textContent = k;
      }
      for (var i = 0; i < n; i++) {
        cells[i] = [];
        for (var j = 0; j < n; j++) {
          var r = svg("rect", { x: pad + j * c + 1, y: pad + i * c + 1, width: c - 2, height: c - 2, rx: 3, fill: j > i ? "var(--surface)" : "var(--bg)", stroke: j > i ? "var(--line)" : "none" }, s);
          cells[i][j] = r;
          if (i <= n - 2 && j > i) order.push([i, j]);
        }
      }
    }
    function total() { return best ? 1 : order.length; }
    function render(k) {
      order.forEach(function (p, idx) {
        var on = idx < k, cur = idx === k - 1;
        cells[p[0]][p[1]].setAttribute("fill", cur ? "var(--accent)" : on ? "var(--accent-mid)" : "var(--surface)");
      });
      var w = n * (n - 1) / 2;
      var txt = T("Сравнений: <b>", "Comparisons: <b>") + k + "</b>";
      if (k > 0) txt += T(" &nbsp;·&nbsp; сейчас A[", " &nbsp;·&nbsp; now A[") + order[k - 1][0] + "] = A[" + order[k - 1][1] + "]?";
      if (best) txt += k === 1 ? T(" — да, равны: return false. C<sub>best</sub>(", " — equal: return false. C<sub>best</sub>(") + n + ") = 1." : T(" &nbsp;·&nbsp; в A[0] и A[1] одинаковые значения", " &nbsp;·&nbsp; A[0] and A[1] hold equal values");
      else txt += " &nbsp;·&nbsp; n(n − 1)/2 = " + n + "·" + (n - 1) + "/2 = <b>" + w + "</b>" + (k === w ? T(" — все пары выше диагонали проверены", " — all pairs above the diagonal checked") : "");
      status.innerHTML = txt;
    }
    var player = new V.Player({ controls: ctl, total: total, render: render, speed: 260 });
    function reset() { n = Math.max(2, Math.min(14, +inp.value || 8)); inp.value = n; build(); player.reset(); }
    inp.addEventListener("change", reset);
    bCase.addEventListener("click", function () { best = !best; bCase.setAttribute("aria-pressed", best); player.reset(); });
    reset();
  }

  // ---------- мультипликативный цикл на числовой оси ----------
  function doubling(root) {
    var n = 100, values = [];
    var stage = html("div", { class: "viz-stage" }, root);
    var box = html("div", null, stage);
    var status = html("div", { class: "viz-status", "aria-live": "polite" }, stage);
    var controls = html("div", { class: "viz-controls" }, root);
    var lab = html("label", null, controls);
    lab.appendChild(document.createTextNode("n ="));
    var inp = html("input", { type: "number", min: 1, max: 1000, value: n, "aria-label": T("Значение n", "Value of n") }, lab);
    var ctl = html("span", { style: "display:contents" }, controls);
    var W = 600, H = 120, x0 = 20, x1 = W - 20, axisY = 80, marks = [];
    var s = svg("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": T("Числовая ось от 1 до n со скачками i ← 2i", "Number line from 1 to n with jumps i ← 2i") }, box);

    function X(v) { return x0 + (x1 - x0) * (v - 1) / Math.max(1, n - 1 || 1); }
    function build() {
      s.innerHTML = "";
      marks = [];
      values = [];
      for (var i = 1; i <= n; i *= 2) values.push(i);
      svg("line", { x1: x0, y1: axisY, x2: x1, y2: axisY, stroke: "var(--line)", "stroke-width": 2 }, s);
      [1, n].forEach(function (v) {
        var t = svg("text", { x: X(v), y: axisY + 22, "text-anchor": v === 1 ? "start" : "end", "font-size": 12, class: "muted-text" }, s);
        t.textContent = v === 1 ? "1" : "n = " + n;
      });
      values.forEach(function (v, idx) {
        var g = svg("g", { opacity: 0.18 }, s);
        if (idx > 0) {
          var a = X(values[idx - 1]), b = X(v), mid = (a + b) / 2, hgt = Math.min(60, 12 + (b - a) * 0.35);
          svg("path", { d: "M" + a + "," + axisY + " Q" + mid + "," + (axisY - hgt * 2) + " " + b + "," + axisY, fill: "none", stroke: "var(--accent)", "stroke-width": 1.8 }, g);
        }
        svg("circle", { cx: X(v), cy: axisY, r: 4.5, fill: "var(--accent)" }, g);
        var t = svg("text", { x: X(v), y: axisY + 38 - (idx % 2) * 12, "text-anchor": "middle", "font-size": 11 }, g);
        t.textContent = v;
        marks.push(g);
      });
    }
    function render(k) {
      marks.forEach(function (g, idx) { g.setAttribute("opacity", idx < k ? 1 : 0.18); });
      var L = V.floorLog2(n);
      var txt = T("Выполнено итераций: <b>", "Iterations done: <b>") + k + "</b>";
      if (k > 0) txt += " &nbsp;·&nbsp; i = " + values[k - 1];
      if (k === values.length) txt += T(" &nbsp;·&nbsp; следующее i = ", " &nbsp;·&nbsp; next i = ") + values[k - 1] * 2 + T(" > n, выход. Итого ⌊log₂ ", " > n, exit. Total ⌊log₂ ") + n + "⌋ + 1 = " + L + " + 1 = <b>" + (L + 1) + "</b>";
      status.innerHTML = txt;
    }
    var player = new V.Player({ controls: ctl, total: function () { return values.length; }, render: render, speed: 650 });
    function reset() { n = Math.max(1, Math.min(1000, Math.floor(+inp.value) || 100)); inp.value = n; build(); player.reset(); }
    inp.addEventListener("change", reset);
    reset();
  }

  // ---------- график роста функций ----------
  function growth(root) {
    var FUNCS = [
      { id: "log", name: "log₂ n", f: function (n) { return Math.log2(n); }, on: true },
      { id: "n", name: "n", f: function (n) { return n; }, on: true },
      { id: "nlog", name: "n log₂ n", f: function (n) { return n * Math.log2(n); }, on: true },
      { id: "n2", name: "n²", f: function (n) { return n * n; }, on: true },
      { id: "n3", name: "n³", f: function (n) { return n * n * n; }, on: false },
      { id: "exp", name: "2ⁿ", f: function (n) { return Math.pow(2, n); }, on: false }
    ];
    var nMax = 20, logScale = false;
    var stage = html("div", { class: "viz-stage" }, root);
    var legend = html("div", { class: "legend", role: "group", "aria-label": T("Функции на графике", "Functions on the chart") }, stage);
    var box = html("div", null, stage);
    var status = html("div", { class: "viz-status" }, stage);
    var controls = html("div", { class: "viz-controls" }, root);
    var lab = html("label", null, controls);
    lab.appendChild(document.createTextNode(T("n до", "n up to")));
    var rng = html("input", { type: "range", min: 4, max: 64, value: nMax, "aria-label": T("Правая граница по n", "Right bound for n") }, lab);
    var nOut = html("b", null, lab, String(nMax));
    var bLog = html("button", { type: "button", "aria-pressed": "false" }, controls, T("логарифмическая шкала", "log scale"));

    var dashes = ["", "6 4", "2 3", "", "8 3 2 3", "1 0"];
    var widths = [1.6, 1.6, 1.6, 2.4, 1.6, 2.4];
    var opac = [0.45, 0.6, 0.75, 1, 0.9, 1];
    FUNCS.forEach(function (fn, i) {
      var l = html("label", null, legend);
      var cb = html("input", { type: "checkbox" }, l);
      cb.checked = fn.on;
      var sw = svg("svg", { width: 22, height: 8, "aria-hidden": "true" }, l);
      svg("line", { x1: 0, y1: 4, x2: 22, y2: 4, stroke: i >= 4 ? "var(--fg)" : "var(--accent)", "stroke-width": widths[i], "stroke-dasharray": dashes[i], opacity: opac[i] }, sw);
      l.appendChild(document.createTextNode(fn.name));
      cb.addEventListener("change", function () { fn.on = cb.checked; draw(); });
    });
    var W = 600, H = 330, L = 56, Rr = 16, Tp = 14, B = 34;
    var s = svg("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": T("График роста функций", "Growth of functions chart") }, box);

    function draw() {
      s.innerHTML = "";
      var on = FUNCS.filter(function (f) { return f.on; });
      var ymax = 1;
      on.forEach(function (f) { ymax = Math.max(ymax, f.f(nMax)); });
      var ymin = logScale ? 0.5 : 0;
      var Y = function (v) {
        if (logScale) {
          var lv = Math.log10(Math.max(v, ymin)), a = Math.log10(ymin), b = Math.log10(ymax);
          return H - B - (H - B - Tp) * (lv - a) / (b - a);
        }
        return H - B - (H - B - Tp) * v / ymax;
      };
      var X = function (n) { return L + (W - L - Rr) * (n - 1) / (nMax - 1); };
      // оси и сетка
      var ticks = [];
      if (logScale) { for (var e = 0; Math.pow(10, e) <= ymax * 1.0001; e++) ticks.push(Math.pow(10, e)); }
      else { var step = niceStep(ymax / 5); for (var v = 0; v <= ymax * 1.0001; v += step) ticks.push(v); }
      ticks.forEach(function (v) {
        svg("line", { x1: L, y1: Y(v), x2: W - Rr, y2: Y(v), stroke: "var(--line)", "stroke-width": 1 }, s);
        var t = svg("text", { x: L - 6, y: Y(v) + 4, "text-anchor": "end", "font-size": 11, class: "muted-text" }, s);
        t.textContent = fmt(v);
      });
      var xs = niceStep(nMax / 6);
      for (var n = xs; n <= nMax; n += xs) {
        var t2 = svg("text", { x: X(n), y: H - B + 18, "text-anchor": "middle", "font-size": 11, class: "muted-text" }, s);
        t2.textContent = n;
      }
      var xl = svg("text", { x: W - Rr, y: H - 4, "text-anchor": "end", "font-size": 11, class: "muted-text" }, s);
      xl.textContent = "n";
      svg("line", { x1: L, y1: H - B, x2: W - Rr, y2: H - B, stroke: "var(--muted)", "stroke-width": 1 }, s);
      // кривые
      var clip = svg("clipPath", { id: "gclip" + uid }, svg("defs", null, s));
      svg("rect", { x: L, y: Tp - 2, width: W - L - Rr, height: H - B - Tp + 2 }, clip);
      var labels = [];
      FUNCS.forEach(function (f, i) {
        if (!f.on) return;
        var d = "";
        for (var k = 0; k <= 200; k++) {
          var nn = 1 + (nMax - 1) * k / 200;
          d += (k ? "L" : "M") + X(nn).toFixed(1) + "," + Y(f.f(nn)).toFixed(1);
        }
        svg("path", { d: d, fill: "none", stroke: i >= 4 ? "var(--fg)" : "var(--accent)", "stroke-width": widths[i], "stroke-dasharray": dashes[i], opacity: opac[i], "clip-path": "url(#gclip" + uid + ")" }, s);
        var yEnd = Math.max(Tp + 8, Y(f.f(nMax)));
        labels.push({ y: yEnd, name: f.name });
      });
      // подписи справа без наложений
      labels.sort(function (a, b) { return a.y - b.y; });
      for (var j = 1; j < labels.length; j++) if (labels[j].y - labels[j - 1].y < 13) labels[j].y = labels[j - 1].y + 13;
      labels.forEach(function (lb) {
        var t = svg("text", { x: W - Rr - 4, y: Math.min(H - B - 4, lb.y - 4), "text-anchor": "end", "font-size": 11 }, s);
        t.textContent = lb.name;
      });
      var f = function (g) { return fmt(g(nMax)); };
      status.innerHTML = T("При n = ", "For n = ") + nMax + ": log₂ n ≈ " + f(FUNCS[0].f) + ", n log₂ n ≈ " + f(FUNCS[2].f) + ", n² = " + f(FUNCS[3].f) + ", n³ = " + f(FUNCS[4].f) + ", 2ⁿ ≈ " + f(FUNCS[5].f);
    }
    var uid = Math.random().toString(36).slice(2, 7);
    function niceStep(x) {
      var p = Math.pow(10, Math.floor(Math.log10(x))), m = x / p;
      return (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p;
    }
    function fmt(v) {
      if (v >= 1e6) { var e = Math.floor(Math.log10(v)); return V.num(v / Math.pow(10, e), 1) + "·10" + supNum(e); }
      if (v >= 100 || Number.isInteger(v)) return Math.round(v).toLocaleString(V.EN ? "en-US" : V.LANG === "kk" ? "kk-KZ" : "ru-RU");
      return V.num(v, 1);
    }
    function supNum(e) { return String(e).split("").map(function (c) { return "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]; }).join(""); }
    rng.addEventListener("input", function () { nMax = +rng.value; nOut.textContent = nMax; draw(); });
    bLog.addEventListener("click", function () { logScale = !logScale; bLog.setAttribute("aria-pressed", logScale); draw(); });
    draw();
  }

  // ---------- средний случай последовательного поиска: опыт против формулы ----------
  function seqsearch(root) {
    var stage = html("div", { class: "viz-stage" }, root);
    var box = html("div", null, stage);
    var status = html("div", { class: "viz-status", "aria-live": "polite" }, stage);
    var controls = html("div", { class: "viz-controls" }, root);
    var labN = html("label", null, controls);
    labN.appendChild(document.createTextNode("n ="));
    var inN = html("input", { type: "number", min: 1, max: 500, value: 20, "aria-label": T("Размер массива", "Array size") }, labN);
    var labP = html("label", null, controls);
    labP.appendChild(document.createTextNode("p ="));
    var inP = html("input", { type: "range", min: 0, max: 100, value: 50, "aria-label": T("Вероятность успешного поиска", "Probability of a successful search") }, labP);
    var pOut = html("b", null, labP, V.num(0.5, 2));
    var bRun = html("button", { type: "button", class: "primary" }, controls, T("1000 запусков", "1000 runs"));
    var bClear = html("button", { type: "button" }, controls, T("сброс", "reset"));
    var W = 600, H = 150, sum = 0, runs = 0, hist = [];
    var s = svg("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-label": T("Распределение числа сравнений", "Distribution of the number of comparisons") }, box);

    function params() { return { n: Math.max(1, Math.min(500, Math.floor(+inN.value) || 20)), p: +inP.value / 100 }; }
    function formula(q) { return q.p * (q.n + 1) / 2 + q.n * (1 - q.p); }
    function draw() {
      var q = params();
      s.innerHTML = "";
      var maxc = Math.max(1, Math.max.apply(null, hist.concat([1])));
      var bw = (W - 40) / q.n;
      for (var c = 1; c <= q.n; c++) {
        var h = (hist[c] || 0) / maxc * (H - 40);
        svg("rect", { x: 20 + (c - 1) * bw, y: H - 24 - h, width: Math.max(1, bw - 1), height: h, fill: "var(--accent-mid)" }, s);
      }
      svg("line", { x1: 20, y1: H - 24, x2: W - 20, y2: H - 24, stroke: "var(--line)" }, s);
      var fx = 20 + (formula(q) - 0.5) * bw;
      svg("line", { x1: fx, y1: 10, x2: fx, y2: H - 24, stroke: "var(--fg)", "stroke-dasharray": "4 3" }, s);
      var t = svg("text", { x: Math.min(W - 80, fx + 4), y: 20, "font-size": 11 }, s); t.textContent = T("формула", "formula");
      var t1 = svg("text", { x: 20, y: H - 8, "font-size": 11, class: "muted-text" }, s); t1.textContent = T("1 сравнение", "1 comparison");
      var t2 = svg("text", { x: W - 20, y: H - 8, "font-size": 11, "text-anchor": "end", class: "muted-text" }, s); t2.textContent = q.n + T(" сравнений", " comparisons");
      var avg = runs ? (sum / runs) : null;
      status.innerHTML = T("Формула", "Formula") + ": p(n+1)/2 + n(1−p) = <b>" + V.num(formula(q), 2) + "</b>" +
        (runs ? T(" &nbsp;·&nbsp; опыт (", " &nbsp;·&nbsp; experiment (") + runs + T(" запусков): <b>", " runs): <b>") + V.num(avg, 2) + "</b>" : T(" &nbsp;·&nbsp; запусков пока нет", " &nbsp;·&nbsp; no runs yet"));
    }
    function run() {
      var q = params();
      for (var r = 0; r < 1000; r++) {
        var c;
        if (Math.random() < q.p) c = 1 + Math.floor(Math.random() * q.n);   // ключ на позиции i с вероятностью p/n
        else c = q.n;                                                       // ключа нет: n сравнений
        hist[c] = (hist[c] || 0) + 1;
        sum += c; runs++;
      }
      draw();
    }
    function clear() { sum = 0; runs = 0; hist = []; pOut.textContent = V.num(+inP.value / 100, 2); draw(); }
    bRun.addEventListener("click", run);
    bClear.addEventListener("click", clear);
    inN.addEventListener("change", clear);
    inP.addEventListener("input", clear);
    clear();
  }

  V.onReady(function () {
    document.querySelectorAll("[data-viz='pairs']").forEach(pairs);
    document.querySelectorAll("[data-viz='doubling']").forEach(doubling);
    document.querySelectorAll("[data-viz='growth']").forEach(growth);
    document.querySelectorAll("[data-viz='seqsearch']").forEach(seqsearch);
  });
})();
