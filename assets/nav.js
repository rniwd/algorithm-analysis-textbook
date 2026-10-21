/* Навигация: шапка, оглавление, якоря, подсказки терминов, пагинация, формулы */
(function () {
  "use strict";

  var LANG = document.documentElement.lang, EN = LANG === "en", KK = LANG === "kk";
  // перевод строки интерфейса; казахские строки берутся из assets/i18n-kk.js по русскому ключу
  function T(ru, en) { return EN ? en : KK ? ((window.I18N_KK || {})[ru] || ru) : ru; }
  var PAGES = [
    { id: "intro", href: "intro.html", title: T("Введение", "Introduction") },
    { id: "module1", href: "module1.html", title: T("Модуль 1", "Module 1") },
    { id: "module2", href: "module2.html", title: T("Модуль 2", "Module 2") },
    { id: "glossary", href: "glossary.html", title: T("Глоссарий", "Glossary") },
    { id: "sources", href: "sources.html", title: T("Источники", "Sources") }
  ];
  var LONG = {
    intro: T("Введение: основы анализа", "Introduction: the basics"),
    module1: T("Модуль 1. Нерекурсивные алгоритмы", "Module 1. Nonrecursive algorithms"),
    module2: T("Модуль 2. Рекурсивные алгоритмы", "Module 2. Recursive algorithms"),
    glossary: T("Глоссарий", "Glossary"),
    sources: T("Источники", "Sources")
  };

  var page = document.body.getAttribute("data-page") || "";

  function buildHeader() {
    var header = document.createElement("header");
    header.className = "site-header";
    var html = '<div class="inner"><a class="brand" href="index.html">3AM</a><nav class="tabs" aria-label="' + T("Разделы учебника", "Textbook sections") + '">';
    PAGES.forEach(function (p) {
      html += '<a href="' + p.href + '"' + (p.id === page ? ' aria-current="page"' : "") + ">" + p.title + "</a>";
    });
    var file = location.pathname.split("/").pop() || "index.html";
    var root = LANG === "ru" ? "" : "../";
    var langs = [["ru", "RU", "", "Русская версия"], ["kk", "ҚАЗ", "kk/", "Қазақша нұсқа"], ["en", "EN", "en/", "English version"]];
    html += '</nav><div class="lang-switch" role="group" aria-label="Язык / Тіл / Language">';
    langs.forEach(function (l) {
      if (l[0] === LANG) html += '<span aria-current="true">' + l[1] + "</span>";
      else html += '<a href="' + root + l[2] + file + location.hash + '" hreflang="' + l[0] + '" lang="' + l[0] + '" title="' + l[3] + '">' + l[1] + "</a>";
    });
    html += "</div></div>";
    header.innerHTML = html;
    document.body.insertBefore(header, document.body.firstChild);
  }

  function buildPager() {
    var main = document.querySelector("main");
    if (!main) return;
    var i = -1;
    PAGES.forEach(function (p, k) { if (p.id === page) i = k; });
    var prev = i > 0 ? PAGES[i - 1] : (i === 0 ? { href: "index.html", id: "index" } : null);
    var next = i >= 0 && i < PAGES.length - 1 ? PAGES[i + 1] : (page === "index" ? PAGES[0] : null);
    var nav = document.createElement("nav");
    nav.className = "pager";
    nav.setAttribute("aria-label", T("Предыдущая и следующая страницы", "Previous and next pages"));
    var html = "";
    if (prev) html += '<a class="prev" href="' + prev.href + '"><small>' + T("← предыдущая", "← previous") + "</small>" + (LONG[prev.id] || T("Обложка и оглавление", "Cover and contents")) + "</a>";
    if (next) html += '<a class="next" href="' + next.href + '"><small>' + T("следующая →", "next →") + "</small>" + LONG[next.id] + "</a>";
    nav.innerHTML = html;
    main.appendChild(nav);
    var foot = document.createElement("div");
    foot.className = "site-foot";
    foot.textContent = T("3AM — электронный учебник по анализу эффективности алгоритмов. Основа — А. Левитин, «Introduction to the Design and Analysis of Algorithms», 3-е изд., §2.1–2.6.", "3AM — an e-textbook on the analysis of algorithm efficiency. Based on A. Levitin, “Introduction to the Design and Analysis of Algorithms”, 3rd ed., §2.1–2.6.");
    main.appendChild(foot);
  }

  function slug(s) {
    return s.toLowerCase().replace(/[^a-zа-яёәғқңөұүһі0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);
  }

  function addAnchors() {
    var used = {};
    document.querySelectorAll("main h2, main h3, main h4").forEach(function (h) {
      if (!h.id) {
        var base = slug(h.textContent) || "section", id = base, k = 2;
        while (used[id] || document.getElementById(id)) id = base + "-" + k++;
        h.id = id;
      }
      used[h.id] = true;
      if (h.querySelector(".anchor")) return;
      var a = document.createElement("a");
      a.className = "anchor";
      a.href = "#" + h.id;
      a.setAttribute("aria-label", T("Ссылка на этот раздел", "Link to this section"));
      a.textContent = "#";
      h.appendChild(a);
    });
  }

  function headingText(h) {
    var c = h.cloneNode(true);
    c.querySelectorAll(".anchor").forEach(function (a) { a.remove(); });
    var t = c.getAttribute("data-toc") || h.getAttribute("data-toc");
    if (t) return t;
    // формулы KaTeX в заголовке: берём только видимый текст
    c.querySelectorAll(".katex-mathml").forEach(function (m) { m.remove(); });
    return c.textContent.trim();
  }

  function buildToc() {
    var toc = document.querySelector("nav.toc");
    if (!toc) return;
    var heads = Array.prototype.slice.call(document.querySelectorAll("main h2"));
    if (!heads.length) return;
    var html = '<div class="toc-title">' + T("На этой странице", "On this page") + '</div><button class="toc-toggle" type="button" aria-expanded="false"><span>' + T("Разделы:", "Sections:") + ' <span class="current"></span></span><span class="chev">▾</span></button><ol>';
    heads.forEach(function (h) {
      html += '<li><a href="#' + h.id + '">' + escapeHtml(headingText(h)) + "</a></li>";
    });
    html += "</ol>";
    toc.innerHTML = html;

    var btn = toc.querySelector(".toc-toggle");
    var cur = toc.querySelector(".current");
    btn.addEventListener("click", function () {
      var open = toc.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    toc.querySelectorAll("ol a").forEach(function (a) {
      a.addEventListener("click", function () {
        toc.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });

    var links = {};
    toc.querySelectorAll("ol a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    function setActive(id) {
      Object.keys(links).forEach(function (k) { links[k].classList.toggle("active", k === id); });
      if (links[id]) cur.textContent = links[id].textContent;
    }
    setActive(heads[0].id);

    if (!("IntersectionObserver" in window)) return;
    var visible = {};
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      // активен последний заголовок, который уже прошёл верх экрана
      var active = heads[0].id;
      for (var i = 0; i < heads.length; i++) {
        var top = heads[i].getBoundingClientRect().top;
        if (top < window.innerHeight * 0.35) active = heads[i].id; else break;
      }
      setActive(active);
    }, { rootMargin: "0px 0px -60% 0px", threshold: [0, 1] });
    heads.forEach(function (h) { obs.observe(h); });
    window.addEventListener("scroll", throttle(function () {
      var active = heads[0].id;
      for (var i = 0; i < heads.length; i++) {
        if (heads[i].getBoundingClientRect().top < window.innerHeight * 0.35) active = heads[i].id; else break;
      }
      setActive(active);
    }, 150), { passive: true });
  }

  function throttle(fn, ms) {
    var t = 0;
    return function () {
      var now = Date.now();
      if (now - t > ms) { t = now; fn(); }
    };
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  // Термины: <a class="term" data-term="key">…</a> → ссылка на глоссарий с подсказкой
  function linkTerms() {
    var G = window.GLOSSARY || {};
    var tip = null;
    document.querySelectorAll("[data-term]").forEach(function (a) {
      var key = a.getAttribute("data-term");
      var g = G[key];
      if (!g) { console.warn("Glossary term missing:", key); return; }
      if (a.tagName === "A") a.href = "glossary.html#" + key;
      a.classList.add("term");
      a.addEventListener("mouseenter", show);
      a.addEventListener("focus", show);
      a.addEventListener("mouseleave", hide);
      a.addEventListener("blur", hide);
      function show() {
        hide();
        tip = document.createElement("div");
        tip.className = "tip";
        tip.setAttribute("role", "tooltip");
        tip.innerHTML = "<b>" + escapeHtml(g.term) + "</b>" + escapeHtml(g.short);
        document.body.appendChild(tip);
        var r = a.getBoundingClientRect();
        var w = tip.offsetWidth, h = tip.offsetHeight;
        var x = Math.min(Math.max(8, r.left), window.innerWidth - w - 8);
        var y = r.bottom + 6;
        if (y + h > window.innerHeight - 8) y = r.top - h - 6;
        tip.style.left = x + "px";
        tip.style.top = y + "px";
      }
    });
    function hide() { if (tip) { tip.remove(); tip = null; } }
    window.addEventListener("scroll", hide, { passive: true });
  }

  function typeset(root) {
    if (typeof window.renderMathInElement !== "function") return;
    window.renderMathInElement(root || document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\[", right: "\\]", display: true },
        { left: "$", right: "$", display: false },
        { left: "\\(", right: "\\)", display: false }
      ],
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code", "option"],
      ignoredClasses: ["no-math"],
      throwOnError: false
    });
  }

  function highlight() {
    if (!window.hljs) return;
    document.querySelectorAll("pre code.language-python").forEach(function (el) { window.hljs.highlightElement(el); });
  }

  // Подсветка ключевых слов псевдокода Левитина
  function pseudo() {
    var KW = /\b(ALGORITHM|for|to|downto|do|while|if|else|return|and|or|not|true|false)\b/g;
    document.querySelectorAll("pre.pseudo").forEach(function (pre) {
      var lines = pre.textContent.replace(/^\n+|\s+$/g, "").split("\n");
      pre.innerHTML = lines.map(function (line) {
        var i = line.indexOf("//");
        var code = i >= 0 ? line.slice(0, i) : line;
        var cm = i >= 0 ? line.slice(i) : "";
        return escapeHtml(code).replace(KW, '<span class="kw">$1</span>') + (cm ? '<span class="cm">' + escapeHtml(cm) + "</span>" : "");
      }).join("\n");
    });
  }

  window.App = window.App || {};
  window.App.typeset = typeset;
  window.App.T = T;

  document.addEventListener("DOMContentLoaded", function () {
    buildHeader();
    if (window.App.renderContent) window.App.renderContent();
    pseudo();
    typeset(document.body);
    highlight();
    addAnchors();
    buildToc();
    linkTerms();
    buildPager();
    document.dispatchEvent(new Event("app:ready"));
    // повторный переход к якорю после того, как контент построен скриптами
    if (location.hash) {
      var t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) {
        if (t.tagName === "DETAILS") t.open = true;
        setTimeout(function () { t.scrollIntoView(); }, 0);
      }
    }
  });
})();
