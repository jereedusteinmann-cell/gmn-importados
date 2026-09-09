/* MOTION KIT v2 · Cazador de Webs — split-text, reveals, unveils,
   parallax, tilt 3D, contadores, marquee y barra de progreso.
   Vanilla, sin dependencias. Se activa solo al cargar la página. */
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
    var showMsg = function (i) { ai = (i + MSGS.length) % MSGS.length; msgEl.innerHTML = MSGS[ai]; };
    var cycle = function () { atimer = setInterval(function () { showMsg(ai + 1); }, 5000); };
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

  // Barra de progreso de scroll (se crea sola)
  if (!reduced) {
    var bar = document.createElement("div");
    bar.className = "mk-progress";
    document.body.appendChild(bar);
    var onScroll = function () {
      var h = document.documentElement;
      var p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      bar.style.transform = "scaleX(" + p + ")";
    };
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  }

  // Si no hay intro, los split-text no esperan al telón
  if (!document.querySelector(".mk-intro")) {
    document.documentElement.style.setProperty("--mk-split-base", "0.1s");
  }

  // Split-text: trocea .mk-split en palabras animables
  document.querySelectorAll(".mk-split").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    words.forEach(function (w, i) {
      var wrap = document.createElement("span");
      wrap.className = "mk-w";
      var inner = document.createElement("span");
      inner.textContent = w;
      inner.style.setProperty("--mk-i", i);
      wrap.appendChild(inner);
      el.appendChild(wrap);
      el.appendChild(document.createTextNode(" "));
    });
  });

  // Reveals y unveils al scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("mk-in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll(".mk-reveal, .mk-unveil").forEach(function (el) { io.observe(el); });

  // Contadores: <span class="mk-counter" data-value="1973" data-suffix=""></span>
  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };
  var ioCount = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      ioCount.unobserve(e.target);
      var el = e.target;
      var target = parseFloat(el.dataset.value || "0");
      var suffix = el.dataset.suffix || "";
      var decimals = (el.dataset.value || "").includes(".") ? 1 : 0;
      var t0 = null;
      var step = function (ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1400, 1);
        el.textContent = (target * easeOut(p)).toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll(".mk-counter").forEach(function (el) { ioCount.observe(el); });

  // (El tilt 3D de las cards se quitó: choca con la estética plana.
  //  El hover ahora es una elevación sutil, definida sólo en CSS.)

  // Marquee: duplica el contenido para el bucle infinito
  document.querySelectorAll(".mk-marquee-track").forEach(function (track) {
    track.innerHTML += track.innerHTML;
  });

  // Motor de scrollytelling: cada [data-mk-scrolly] recibe --mk-p (progreso 0→1)
  // según su posición en el viewport. Los patrones 3D del CSS beben de esa variable.
  var scrollies = document.querySelectorAll("[data-mk-scrolly]");
  if (scrollies.length) {
    if (reduced) {
      scrollies.forEach(function (s) { s.style.setProperty("--mk-p", 1); });
    } else {
      var ticking = false;
      var updateScrollies = function () {
        ticking = false;
        scrollies.forEach(function (s) {
          var r = s.getBoundingClientRect();
          // 0 cuando la sección asoma por abajo; 1 cuando su final llega arriba.
          var total = r.height - innerHeight;
          var p = total > 0
            ? -r.top / total                             // sección alta (mk-pin/mk-film): la "película" dura todo el tramo sticky
            : (innerHeight - r.top) / (innerHeight + r.height); // sección normal: progreso al atravesar el viewport
          p = Math.max(0, Math.min(1, p));
          if (s._mkP !== p) {
            s._mkP = p;
            s.style.setProperty("--mk-p", p.toFixed(4));
            // Película: marca el shot en escena (interactividad solo del vivo)
            if (s.classList.contains("mk-film")) {
              s.querySelectorAll(".mk-shot").forEach(function (shot) {
                var inV = parseFloat(shot.style.getPropertyValue("--in")) || 0;
                var outV = parseFloat(shot.style.getPropertyValue("--out")) || 1;
                if (p >= inV && p <= outV) shot.setAttribute("data-live", "");
                else shot.removeAttribute("data-live");
              });
              // Túnel 3D: vivo cuando la cámara está cerca de su profundidad
              var n = parseFloat(s.style.getPropertyValue("--mk-nshots")) || parseFloat(s.dataset.mkShots) || 10;
              s.querySelectorAll(".mk-zshot").forEach(function (shot) {
                var zi = parseFloat(shot.style.getPropertyValue("--zi")) || 0;
                var f = p * (n - 1) - zi;
                if (f > -0.7 && f < 0.42) shot.setAttribute("data-live", "");
                else shot.removeAttribute("data-live");
              });
            }
          }
        });
      };
      // data-mk-shots="10" → --mk-shots (duración de la película)
      scrollies.forEach(function (s) {
        if (s.dataset.mkShots) s.style.setProperty("--mk-shots", s.dataset.mkShots);
      });
      // Raíl de progreso a la derecha (solo si hay película)
      var film = document.querySelector(".mk-film");
      var rail = null;
      if (film) {
        rail = document.createElement("div");
        rail.className = "mk-rail";
        rail.innerHTML = '<div class="mk-rail-thumb"></div>';
        document.body.appendChild(rail);
        var syncRail = function () { rail.style.setProperty("--mk-p", film.style.getPropertyValue("--mk-p") || 0); };
        addEventListener("scroll", function () { requestAnimationFrame(syncRail); }, { passive: true });
        syncRail();
        // Scrubber: pinchar/arrastrar en el raíl mueve la película
        var dragging = false;
        var scrub = function (clientY) {
          var rr = rail.getBoundingClientRect();
          var ratio = Math.max(0, Math.min(1, (clientY - rr.top) / rr.height));
          var total = film.offsetHeight - innerHeight;
          scrollTo(0, film.offsetTop + ratio * total);
        };
        rail.addEventListener("pointerdown", function (e) {
          dragging = true; rail.classList.add("mk-dragging");
          rail.setPointerCapture(e.pointerId); scrub(e.clientY); e.preventDefault();
        });
        rail.addEventListener("pointermove", function (e) { if (dragging) scrub(e.clientY); });
        addEventListener("pointerup", function () { dragging = false; rail.classList.remove("mk-dragging"); });
      }
      addEventListener("scroll", function () {
        if (!ticking) { ticking = true; requestAnimationFrame(updateScrollies); }
      }, { passive: true });
      addEventListener("resize", updateScrollies, { passive: true });
      addEventListener("load", updateScrollies);
      updateScrollies();
    }
  }

  // Parallax suave en secciones .mk-parallax (fallback iOS ya en CSS)
  if (!reduced) {
    var pxs = document.querySelectorAll(".mk-parallax");
    if (pxs.length) {
      var onPx = function () {
        pxs.forEach(function (s) {
          var r = s.getBoundingClientRect();
          if (r.bottom > 0 && r.top < innerHeight) {
            s.style.backgroundPosition = "center " + (r.top * -0.15) + "px";
          }
        });
      };
      addEventListener("scroll", onPx, { passive: true }); onPx();
    }
  }
})();
