/* Общие инструменты визуализаций: SVG-элементы и проигрыватель по шагам */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var EN = document.documentElement.lang === "en";
  // перевод строки интерфейса: T("рус", "eng")
  function T(ru, en) { return EN ? en : ru; }

  function svg(tag, attrs, parent) {
    var el = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] !== undefined && attrs[k] !== null) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  }

  function html(tag, attrs, parent, text) {
    var el = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "class") el.className = attrs[k];
      else el.setAttribute(k, attrs[k]);
    }
    if (text !== undefined) el.textContent = text;
    if (parent) parent.appendChild(el);
    return el;
  }

  function css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  /*
   * Player: состояние задаётся номером шага k ∈ [0, total].
   * opts: { controls: элемент, total: fn() → число шагов, render: fn(k), speed: мс, back: bool, speedControl: bool }
   */
  function Player(opts) {
    var self = this;
    this.k = 0;
    this.timer = null;
    this.opts = opts;
    this.delay = opts.speed || 600;
    var c = opts.controls;
    if (opts.back !== false) this.bBack = html("button", { type: "button", "aria-label": T("Шаг назад", "Step back") }, c, T("← шаг", "← step"));
    this.bStep = html("button", { type: "button" }, c, T("шаг →", "step →"));
    this.bPlay = html("button", { type: "button", class: "primary" }, c, T("пуск", "play"));
    this.bReset = html("button", { type: "button" }, c, T("сброс", "reset"));
    if (opts.speedControl) {
      var lab = html("label", null, c);
      lab.appendChild(document.createTextNode(T("скорость", "speed")));
      this.range = html("input", { type: "range", min: "0", max: "100", value: "50", "aria-label": T("Скорость анимации", "Animation speed") }, lab);
      var update = function () {
        // 0 → 1500 мс, 100 → 40 мс (логарифмическая шкала)
        var v = +self.range.value / 100;
        self.delay = Math.round(1500 * Math.pow(40 / 1500, v));
        if (self.timer) { self.pause(); self.play(); }
      };
      this.range.addEventListener("input", update);
      update();
    }
    if (this.bBack) this.bBack.addEventListener("click", function () { self.pause(); self.go(self.k - 1); });
    this.bStep.addEventListener("click", function () { self.pause(); self.go(self.k + 1); });
    this.bPlay.addEventListener("click", function () { self.timer ? self.pause() : self.play(); });
    this.bReset.addEventListener("click", function () { self.pause(); self.go(0); });
  }
  Player.prototype.total = function () { return this.opts.total(); };
  Player.prototype.go = function (k) {
    var t = this.total();
    this.k = Math.max(0, Math.min(t, k));
    this.opts.render(this.k);
    this.sync();
  };
  Player.prototype.sync = function () {
    var t = this.total();
    if (this.bBack) this.bBack.disabled = this.k <= 0;
    this.bStep.disabled = this.k >= t;
    this.bPlay.textContent = this.timer ? T("пауза", "pause") : (this.k >= t ? T("заново", "replay") : T("пуск", "play"));
  };
  Player.prototype.play = function () {
    var self = this;
    if (this.k >= this.total()) this.go(0);
    this.timer = setInterval(function () {
      if (self.k >= self.total()) { self.pause(); return; }
      self.go(self.k + 1);
      if (self.k >= self.total()) self.pause();
    }, this.delay);
    this.sync();
  };
  Player.prototype.pause = function () {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.sync();
  };
  Player.prototype.reset = function () { this.pause(); this.go(0); };

  function floorLog2(n) { var k = 0; while (n > 1) { n = Math.floor(n / 2); k++; } return k; }

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  window.Viz = { T: T, EN: EN, num: function (x, d) { var s = x.toFixed(d); return EN ? s : s.replace(".", ","); }, svg: svg, html: html, css: css, Player: Player, floorLog2: floorLog2, onReady: onReady };
})();
