/* GMN Importados — comportamiento del chrome del sitio.
   Arma en runtime (una sola vez, en todas las páginas): telón de intro,
   barra de anuncios, buscador del header, menú hamburguesa + drawer,
   mega-menú "Categorías", flechas del carrusel de marcas, footer ampliado
   y la barra de progreso de scroll. Vanilla, sin dependencias. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Intro (telón con el logo): sólo la primera carga de la sesión
  var introEl = document.querySelector(".mk-intro");
  if (introEl) {
    var seen = false;
    try { seen = sessionStorage.getItem("mkIntroSeen") === "1"; } catch (e) {}
    if (seen || reduced) {
      introEl.parentNode && introEl.parentNode.removeChild(introEl);
    } else {
      try { sessionStorage.setItem("mkIntroSeen", "1"); } catch (e) {}
    }
  }

  // ---- Barra de anuncios (rota mensajes) ----
  var header = document.querySelector(".site-header");
  if (header) {
    var MSGS = [
      '<strong>50% OFF</strong> en todos los decants',
      '<strong>3 cuotas</strong> sin interés',
      'Envío en el día en <strong>AMBA y CABA</strong>'
    ];
    var anno = document.createElement("div");
    anno.className = "anno-bar";
    anno.innerHTML =
      '<button class="anno-prev" aria-label="Anterior">&#8249;</button>' +
      '<span class="anno-msg" aria-live="polite">' + MSGS[0] + '</span>' +
      '<button class="anno-next" aria-label="Siguiente">&#8250;</button>';
    header.parentNode.insertBefore(anno, header);
    var msgEl = anno.querySelector(".anno-msg");
    var ai = 0, atimer;
    var showMsg = function (i) {
      ai = (i + MSGS.length) % MSGS.length;
      if (reduced) { msgEl.innerHTML = MSGS[ai]; return; }
      msgEl.style.opacity = "0";
      setTimeout(function () { msgEl.innerHTML = MSGS[ai]; msgEl.style.opacity = "1"; }, 180);
    };
    var cycle = function () { atimer = setInterval(function () { showMsg(ai + 1); }, 6000); };
    var reset = function () { clearInterval(atimer); if (!reduced) cycle(); };
    anno.querySelector(".anno-prev").addEventListener("click", function () { showMsg(ai - 1); reset(); });
    anno.querySelector(".anno-next").addEventListener("click", function () { showMsg(ai + 1); reset(); });
    if (!reduced) cycle();
  }

  // ---- Buscador en el header ----
  var actions = document.querySelector(".site-header-actions");
  if (actions && !actions.querySelector(".site-search")) {
    var sform = document.createElement("form");
    sform.className = "site-search";
    sform.setAttribute("action", "buscar.html");
    sform.setAttribute("method", "get");
    sform.setAttribute("role", "search");
    sform.innerHTML =
      '<input type="search" name="q" placeholder="Buscar…" aria-label="Buscar productos" />' +
      '<button type="submit" aria-label="Buscar"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg></button>';
    actions.insertBefore(sform, actions.firstChild);
  }

  // ---- Prioridad visual: destacar las secciones de compra en el nav ----
  document.querySelectorAll(".site-tabs a").forEach(function (a) {
    if (/\b(decants|perfumes|mayorista)\.html/.test(a.getAttribute("href") || "")) {
      a.classList.add("is-shop");
    }
  });

  // ---- Menú lateral (hamburguesa) en mobile ----
  var headerTop = document.querySelector(".site-header-top");
  var tabs = document.querySelector(".site-tabs");
  if (headerTop && tabs) {
    var burger = document.createElement("button");
    burger.className = "nav-burger";
    burger.setAttribute("aria-label", "Abrir menú");
    burger.setAttribute("aria-expanded", "false");
    burger.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';
    headerTop.insertBefore(burger, headerTop.firstChild);

    var drawer = document.createElement("div");
    drawer.className = "nav-drawer";
    drawer.setAttribute("aria-hidden", "true");
    var panel = document.createElement("nav");
    panel.className = "nav-drawer-panel";
    panel.setAttribute("aria-label", "Navegación");
    panel.innerHTML = '<button class="nav-drawer-close" aria-label="Cerrar menú">&times;</button>';
    tabs.querySelectorAll("a").forEach(function (a) {
      var link = document.createElement("a");
      link.href = a.getAttribute("href");
      link.textContent = a.textContent;
      if (a.classList.contains("active")) link.classList.add("active");
      panel.appendChild(link);
    });
    var cta = document.createElement("a");
    cta.className = "nav-drawer-cta";
    cta.href = "https://wa.me/541128710667";
    cta.target = "_blank"; cta.rel = "noopener";
    cta.textContent = "Escribinos por WhatsApp";
    panel.appendChild(cta);
    var scrim = document.createElement("div");
    scrim.className = "nav-drawer-scrim";
    drawer.appendChild(scrim);
    drawer.appendChild(panel);
    document.body.appendChild(drawer);

    var openNav = function () {
      drawer.classList.add("open");
      drawer.setAttribute("aria-hidden", "false");
      burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      panel.querySelector(".nav-drawer-close").focus();
    };
    var closeNav = function () {
      drawer.classList.remove("open");
      drawer.setAttribute("aria-hidden", "true");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      burger.focus();
    };
    burger.addEventListener("click", openNav);
    scrim.addEventListener("click", closeNav);
    panel.querySelector(".nav-drawer-close").addEventListener("click", closeNav);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) closeNav();
    });
  }

  // ---- Mega-menú "Categorías" (escritorio) ----
  if (tabs) {
    var MEGA = [
      { title: "Decants", href: "decants.html", items: [
        { label: "Decants masculinos", href: "decants.html" },
        { label: "Decants femeninos", href: "decants.html" },
        { label: "Árabes", href: "decants.html" },
        { label: "Diseñador", href: "decants.html" },
        { label: "Nicho", href: "decants.html" },
        { label: "Combos de decants", href: "decants.html" }
      ] },
      { title: "Liquidación de perfumes", href: "perfumes.html", items: [
        { label: "Masculinos", href: "perfumes.html" },
        { label: "Femeninos", href: "perfumes.html" },
        { label: "Árabes", href: "perfumes.html" },
        { label: "Diseñador", href: "perfumes.html" }
      ] },
      { title: "Frascos Vacíos Mayorista", href: "mayorista.html", items: [
        { label: "Envases de vidrio", href: "mayorista.html" },
        { label: "Insumos para fraccionar", href: "mayorista.html" },
        { label: "Etiquetas y envíos", href: "mayorista.html" }
      ] },
      { title: "Más", items: [
        { label: "Últimos ingresos", href: "decants.html" },
        { label: "Los más vendidos", href: "index.html#mas-vendidos" },
        { label: "Preguntas frecuentes", href: "preguntas-frecuentes.html" }
      ] }
    ];
    var mtrigger = document.createElement("button");
    mtrigger.className = "mega-trigger";
    mtrigger.type = "button";
    mtrigger.setAttribute("aria-expanded", "false");
    mtrigger.innerHTML =
      '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 12h18M3 18h18"/></svg><span>Categorías</span>';
    tabs.insertBefore(mtrigger, tabs.firstChild);

    var mpanel = document.createElement("div");
    mpanel.className = "mega-panel";
    mpanel.setAttribute("role", "menu");
    mpanel.innerHTML = '<div class="mega-inner">' + MEGA.map(function (col) {
      var head = col.href
        ? '<a class="mega-col-title" href="' + col.href + '">' + col.title + '</a>'
        : '<span class="mega-col-title">' + col.title + '</span>';
      return '<div class="mega-col">' + head + '<ul>' + col.items.map(function (it) {
        return '<li><a href="' + it.href + '">' + it.label + '</a></li>';
      }).join("") + '</ul></div>';
    }).join("") +
      '<a class="mega-promo" href="decants.html"><span>50% OFF</span><strong>en todos los decants</strong><em>Ver decants</em></a>' +
      '</div>';
    (document.querySelector(".site-header") || tabs.parentNode).appendChild(mpanel);

    var mopen = false, mtimer;
    var setMega = function (v) {
      mopen = v;
      mpanel.classList.toggle("open", v);
      mtrigger.classList.toggle("open", v);
      mtrigger.setAttribute("aria-expanded", v ? "true" : "false");
    };
    var openMega = function () { clearTimeout(mtimer); setMega(true); };
    var closeMega = function () { mtimer = setTimeout(function () { setMega(false); }, 140); };
    mtrigger.addEventListener("mouseenter", openMega);
    mtrigger.addEventListener("focus", openMega);
    mtrigger.addEventListener("click", function () { setMega(!mopen); });
    mpanel.addEventListener("mouseenter", openMega);
    mtrigger.addEventListener("mouseleave", closeMega);
    mpanel.addEventListener("mouseleave", closeMega);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && mopen) { setMega(false); mtrigger.focus(); } });
    document.addEventListener("click", function (e) {
      if (mopen && !mpanel.contains(e.target) && e.target !== mtrigger && !mtrigger.contains(e.target)) setMega(false);
    });
  }

  // ---- Carrusel de marcas: flechas ----
  document.querySelectorAll(".brands-arrow").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var track = btn.parentNode.querySelector(".brands-track");
      if (!track) return;
      var dir = parseFloat(btn.getAttribute("data-dir")) || 1;
      track.scrollBy({ left: dir * Math.round(track.clientWidth * 0.7), behavior: reduced ? "auto" : "smooth" });
    });
  });

  // ---- Footer ampliado (se arma en todas las páginas) ----
  var foot = document.querySelector(".site-footer .footer-inner");
  if (foot && !foot.querySelector(".footer-cols")) {
    var chev = '<svg class="footer-acc-chev" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 9l6 6 6-6"/></svg>';
    foot.innerHTML =
      '<div class="footer-social">' +
        '<a href="https://instagram.com/gmn.importados" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>' +
        '<a href="https://www.facebook.com/gmnimportados" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v7h3v-7h2l1-3h-3V8a1 1 0 0 1 1-1z"/></svg></a>' +
        '<a href="https://www.tiktok.com/@gmn.importados" target="_blank" rel="noopener" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 12a4 4 0 1 0 4 4V4c.5 2.5 2 4 4.5 4.3"/></svg></a>' +
      '</div>' +
      '<div class="footer-cols">' +
        '<details class="footer-acc"><summary>Tienda' + chev + '</summary><div>' +
          '<a href="decants.html">Decants</a><a href="perfumes.html">Perfumes</a>' +
          '<a href="mayorista.html">Frascos Vacíos Mayorista</a><a href="buscar.html">Buscar</a>' +
        '</div></details>' +
        '<details class="footer-acc"><summary>Ayuda' + chev + '</summary><div>' +
          '<a href="como-comprar.html">Cómo comprar</a><a href="preguntas-frecuentes.html">Preguntas frecuentes</a>' +
          '<a href="cambios-y-devoluciones.html">Cambios y devoluciones</a>' +
        '</div></details>' +
        '<details class="footer-acc"><summary>Contacto' + chev + '</summary><div>' +
          '<a href="tel:1128710667">11 2871-0667</a>' +
          '<a href="https://wa.me/541128710667" target="_blank" rel="noopener">WhatsApp</a>' +
          '<a href="https://instagram.com/gmn.importados" target="_blank" rel="noopener">@gmn.importados</a>' +
          '<p>Del Campillo 2752, Villa Luzuriaga<br>Lunes a viernes de 12 a 17 hs</p>' +
        '</div></details>' +
        '<div class="footer-news">' +
          '<h3>Newsletter</h3>' +
          '<p>Ofertas y novedades, sin spam.</p>' +
          '<form class="footer-news-form"><input type="email" required placeholder="Tu email" aria-label="Tu email" /><button type="submit">Suscribirme</button></form>' +
          '<p class="footer-news-msg" hidden>¡Listo! Te vamos a escribir.</p>' +
        '</div>' +
      '</div>' +
      '<div class="footer-meta">' +
        '<div><span class="footer-meta-label">Medios de pago</span><span>Visa · Mastercard · American Express · Cabal · Naranja · Mercado Pago · Efectivo · Transferencia · Pago Fácil · Rapipago</span></div>' +
        '<div><span class="footer-meta-label">Medios de envío</span><span>Correo Argentino · Andreani · Envío Nube · Retiro en local</span></div>' +
      '</div>' +
      '<div class="footer-legal-row">' +
        '<p>© 2026 GMN Importados · Envíos a todo el país</p>' +
        '<p><a href="https://www.argentina.gob.ar/produccion/defensadelconsumidor" target="_blank" rel="noopener">Defensa de las y los consumidores</a> · <a href="https://wa.me/541128710667?text=Quiero%20ejercer%20el%20bot%C3%B3n%20de%20arrepentimiento" target="_blank" rel="noopener">Botón de arrepentimiento</a></p>' +
      '</div>';
    var nform = foot.querySelector(".footer-news-form");
    if (nform) nform.addEventListener("submit", function (e) {
      e.preventDefault();
      nform.hidden = true;
      var m = foot.querySelector(".footer-news-msg");
      if (m) m.hidden = false;
    });

    // <details> en Chrome esconde el contenido cerrado por mecanismo propio
    // (::details-content), que el CSS `display` NO override. Así que en
    // escritorio abrimos las columnas con el atributo `open` nativo; en mobile
    // quedan como accordion (cerradas, abren al tocar).
    var footAccs = foot.querySelectorAll(".footer-acc");
    var footMq = window.matchMedia("(min-width: 721px)");
    var applyFootAccs = function (force) {
      footAccs.forEach(function (d) {
        if (footMq.matches) d.setAttribute("open", "");
        else if (force) d.removeAttribute("open");
      });
    };
    applyFootAccs(false);
    var onFootMq = function () { applyFootAccs(true); };
    if (footMq.addEventListener) footMq.addEventListener("change", onFootMq);
    else if (footMq.addListener) footMq.addListener(onFootMq);
  }

  // Barra de progreso de scroll + sombra del header al scrollear
  var progressBar = null;
  if (!reduced) {
    progressBar = document.createElement("div");
    progressBar.className = "mk-progress";
    document.body.appendChild(progressBar);
  }
  var headerEl = document.querySelector(".site-header");
  var onScroll = function () {
    var h = document.documentElement;
    if (progressBar) {
      var p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      progressBar.style.transform = "scaleX(" + p + ")";
    }
    if (headerEl) headerEl.classList.toggle("is-scrolled", h.scrollTop > 8);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---- Entrada del hero al cargar ----
  var heroInner = document.querySelector(".hero-full-inner");
  var heroH1 = heroInner && heroInner.querySelector("h1");
  if (heroInner && heroH1 && !reduced) {
    // parte el titular en palabras animables
    var words = heroH1.textContent.trim().split(/\s+/);
    heroH1.textContent = "";
    words.forEach(function (w, i) {
      var wrap = document.createElement("span");
      wrap.className = "hw";
      var inner = document.createElement("span");
      inner.textContent = w;
      inner.style.setProperty("--hw-i", i);
      wrap.appendChild(inner);
      heroH1.appendChild(wrap);
      heroH1.appendChild(document.createTextNode(" "));
    });
    // el bloque de intro (arriba) ya sacó el telón si no toca mostrarlo;
    // si sigue en el DOM es porque está subiendo → la entrada lo espera
    var introPlaying = !!document.querySelector(".mk-intro");
    heroInner.style.setProperty("--hero-base", introPlaying ? "1.55s" : ".15s");
    heroInner.classList.add("hero-anim");
  }

  // ---- Reveal sutil de las grillas de producto al entrar en viewport ----
  var grids = document.querySelectorAll(".product-grid");
  if (grids.length && !reduced) {
    grids.forEach(function (g) { g.classList.add("reveal-grid"); });
    var revIO = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.style.setProperty("--ri", Math.min(batch++, 5));
        e.target.classList.add("in");
        revIO.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    var observeCards = function () {
      grids.forEach(function (g) {
        g.querySelectorAll(".product-card:not(.in)").forEach(function (c) { revIO.observe(c); });
      });
    };
    observeCards();
    // las grillas se llenan por JS después de motion.js → re-observar al aparecer
    var gridMO = new MutationObserver(observeCards);
    grids.forEach(function (g) { gridMO.observe(g, { childList: true }); });
  }
})();
