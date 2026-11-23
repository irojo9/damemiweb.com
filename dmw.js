/* Dame mi web — script compartido: consentimiento de cookies + tracking de conversiones
   + favicon, barra CTA móvil y modal de salida (conversión) */
(function () {
  /* dmw:config — generado por tools/build.mjs desde site.config.json. No editar a mano. */
  var CFG = {"ga4":"G-B27EE57BLZ","phone":"+34662549694","price":"250€","priceFull":"250€ + IVA","entregaHoras":72,"proyectos":111,"resenas":83,"adsId":"","adsWhatsapp":"","adsTelefono":""};
  /* /dmw:config */

  var GA_ID = CFG.ga4;
  /* Google Ads: id de cuenta (AW-...) y etiquetas de conversion, desde site.config.json.
     Si estan vacios no se envia nada a Google Ads. */
  var ADS_ID = CFG.adsId || '';

  /* Visitas que llegan desde un anuncio de Google (gclid/gbraid/wbraid o utm_source=google
     con medio de pago). Se recuerda durante la sesion para que, aunque naveguen por otras
     paginas, el WhatsApp llegue con "vengo de Google" y se sepa que el chat viene de Ads. */
  var DESDE_GOOGLE = false;
  try {
    var qs = new URLSearchParams(location.search);
    var medio = (qs.get('utm_medium') || '').toLowerCase();
    var fuente = (qs.get('utm_source') || '').toLowerCase();
    if (qs.get('gclid') || qs.get('gbraid') || qs.get('wbraid') ||
        ((fuente === 'google' || fuente === 'googleads') && /cpc|ppc|paid|ads/.test(medio))) {
      sessionStorage.setItem('dmw-origen', 'google-ads');
    }
    DESDE_GOOGLE = sessionStorage.getItem('dmw-origen') === 'google-ads';
  } catch (e) {}
  var WA_TEXTO = (DESDE_GOOGLE ? 'Hola, vengo de Google, quiero mi web por ' : 'Hola, quiero mi web por ') + CFG.priceFull + '.';
  var WA_URL = 'https://wa.me/' + CFG.phone.replace('+', '') + '?text=' + encodeURIComponent(WA_TEXTO);
  var TEL_URL = 'tel:' + CFG.phone;

  /* dmw:icons — generado por tools/build.mjs desde tools/icons.mjs. No editar a mano. */
  var ICON = {"menu":"<svg width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M4 7h16\"/><path d=\"M4 12h16\"/><path d=\"M4 17h16\"/></svg>","close":"<svg width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6 6l12 12\"/><path d=\"M18 6L6 18\"/></svg>","phone":"<svg width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M6.5 3.8h3l1.4 3.6-2 1.4a10.5 10.5 0 0 0 5.3 5.3l1.4-2 3.6 1.4v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 6a2 2 0 0 1 2-2.2z\"/></svg>","whatsapp":"<svg width=\"17\" height=\"17\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.75\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\" focusable=\"false\"><path d=\"M3.5 20.5l1.3-4.3A8.2 8.2 0 1 1 8 19.4l-4.5 1.1z\"/><path d=\"M9 9.2c0 3 2.3 5.3 5.2 5.4.6 0 1.1-.4 1.2-1l.1-.6-2-.9-.8 1a4.6 4.6 0 0 1-2-2l1-.8-.9-2-.6.1c-.6.1-1.1.6-1.2 1.2z\"/></svg>"};
  /* /dmw:icons */

  /* 0. Cabecera comun: desplegables accesibles y menu movil.
     El marcado lo genera tools/partials.mjs; aqui solo va el comportamiento. */
  function initHeader() {
    var hd = document.getElementById('dmw-hd');
    if (!hd) return;

    function panelDe(btn) { return document.getElementById(btn.getAttribute('aria-controls')); }
    function cerrar(btn) {
      btn.setAttribute('aria-expanded', 'false');
      var p = panelDe(btn);
      if (p) p.hidden = true;
    }
    function abrir(btn) {
      btn.setAttribute('aria-expanded', 'true');
      var p = panelDe(btn);
      if (p) p.hidden = false;
    }
    function alternar(btn) {
      btn.getAttribute('aria-expanded') === 'true' ? cerrar(btn) : abrir(btn);
    }

    var desplegables = [].slice.call(hd.querySelectorAll('.dmw-dd-btn'));
    // El panel movil vive fuera de <header>: se busca en el documento.
    var movilBtns = [].slice.call(document.querySelectorAll('.dmw-mob-btn'));

    desplegables.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var abierto = btn.getAttribute('aria-expanded') === 'true';
        desplegables.forEach(cerrar);
        if (!abierto) abrir(btn);
      });
    });
    movilBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { alternar(btn); });
    });

    document.addEventListener('click', function (e) {
      if (!hd.contains(e.target)) desplegables.forEach(cerrar);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      desplegables.forEach(cerrar);
      if (burger && burger.getAttribute('aria-expanded') === 'true') cerrarMovil();
    });

    var burger = document.getElementById('dmw-burger');
    var mob = document.getElementById('dmw-mob');
    function cerrarMovil() {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menu');
      burger.innerHTML = ICON.menu;
      mob.hidden = true;
      document.body.style.overflow = '';
    }
    if (burger && mob) {
      mob.hidden = true;
      burger.addEventListener('click', function () {
        if (burger.getAttribute('aria-expanded') === 'true') return cerrarMovil();
        burger.setAttribute('aria-expanded', 'true');
        burger.setAttribute('aria-label', 'Cerrar menu');
        burger.innerHTML = ICON.close;
        mob.hidden = false;
        document.body.style.overflow = 'hidden';
      });
      mob.addEventListener('click', function (e) {
        if (e.target.closest('a')) cerrarMovil();
      });
    }

    /* Enlaces a un ancla de la home (/#servicios) desde la propia home:
       desplazamiento suave sin recargar. */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href^="/#"]');
      if (!a || location.pathname !== '/') return;
      var el = document.getElementById(a.getAttribute('href').slice(2));
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth' });
      history.replaceState(null, '', a.getAttribute('href').slice(1));
    });
  }

  /* 1. Respetar rechazo previo de cookies */
  try {
    if (localStorage.getItem('cookie-consent') === 'rejected') {
      window['ga-disable-' + GA_ID] = true;
      if (ADS_ID) window['ga-disable-' + ADS_ID] = true;
    }
  } catch (e) {}

  /* 1b. Etiqueta de Google Ads: usa el mismo gtag.js que Analytics */
  if (ADS_ID && typeof window.gtag === 'function') window.gtag('config', ADS_ID);

  /* 2. Inyectar banner de cookies si no existe en la página */
  function initCookieBanner() {
    if (document.getElementById('dmw-cookie-banner')) return;
    var consent;
    try { consent = localStorage.getItem('cookie-consent'); } catch (e) {}
    if (consent) return; // ya decidió

    var css = '#dmw-cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:1000;background:rgba(14,14,14,.96);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid #2A2A2A;padding:16px 40px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;transform:translateY(100%);transition:transform .5s cubic-bezier(.16,1,.3,1);font-family:\'DM Sans\',system-ui,sans-serif}'
      + '#dmw-cookie-banner.show{transform:translateY(0)}'
      + '#dmw-cookie-banner .cb-t{font-size:13px;font-weight:300;color:rgba(255,255,255,.6);line-height:1.55;flex:1;min-width:260px}'
      + '#dmw-cookie-banner .cb-t a{color:#7FA3F5}'
      + '#dmw-cookie-banner .cb-btns{display:flex;gap:8px}'
      + '#dmw-cookie-banner button{padding:9px 18px;border-radius:8px;font-size:13px;cursor:pointer;font-family:inherit;transition:all .15s}'
      + '#dmw-cookie-banner .cb-r{background:transparent;border:1px solid #2A2A2A;color:rgba(255,255,255,.55)}'
      + '#dmw-cookie-banner .cb-r:hover{border-color:#8C8C8C;color:#fff}'
      + '#dmw-cookie-banner .cb-a{background:#7FA3F5;color:#0E0E0E;border:none;font-weight:500}'
      + '#dmw-cookie-banner .cb-a:hover{opacity:.88}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.id = 'dmw-cookie-banner';
    bar.innerHTML = '<p class="cb-t">Usamos cookies propias y de terceros (Google Analytics y Google Ads) para analizar el tráfico y medir nuestros anuncios. <a href="/cookies">Política de cookies</a></p>'
      + '<div class="cb-btns"><button class="cb-r">Rechazar</button><button class="cb-a">Aceptar</button></div>';
    document.body.appendChild(bar);

    bar.querySelector('.cb-a').addEventListener('click', function () {
      try { localStorage.setItem('cookie-consent', 'accepted'); } catch (e) {}
      bar.classList.remove('show');
    });
    bar.querySelector('.cb-r').addEventListener('click', function () {
      try { localStorage.setItem('cookie-consent', 'rejected'); } catch (e) {}
      window['ga-disable-' + GA_ID] = true;
      if (ADS_ID) window['ga-disable-' + ADS_ID] = true;
      bar.classList.remove('show');
    });

    setTimeout(function () { bar.classList.add('show'); }, 1500);
  }

  /* 3. Tracking de conversiones: clics en WhatsApp, teléfono y email */
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  function initTracking() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a || !a.href) return;
      var href = a.href;
      if (href.indexOf('wa.me') !== -1 || href.indexOf('api.whatsapp') !== -1) {
        /* Evento principal de conversion. `ubicacion` lo pone tools/build.mjs
           en cada enlace (data-wa-loc): header, hero, sector, ciudad, footer... */
        track('contacto_whatsapp', {
          ubicacion: a.getAttribute('data-wa-loc') || 'sin_ubicacion',
          link_url: href,
          page: location.pathname
        });
        track('whatsapp_click', { link_url: href, page: location.pathname });
        if (ADS_ID && CFG.adsWhatsapp) track('conversion', { send_to: ADS_ID + '/' + CFG.adsWhatsapp });
      } else if (href.indexOf('tel:') === 0) {
        track('phone_click', { page: location.pathname });
        if (ADS_ID && CFG.adsTelefono) track('conversion', { send_to: ADS_ID + '/' + CFG.adsTelefono });
      } else if (href.indexOf('mailto:') === 0) {
        track('email_click', { page: location.pathname });
      }
    }, true);
  }

  /* 3b. Fix responsive global: los grids de dos columnas definidos con estilo
     inline no colapsan en móvil y desbordan la pantalla */
  function initResponsiveFix() {
    var style = document.createElement('style');
    style.textContent = '@media(max-width:900px){[style*="grid-template-columns:1fr 1fr"]{grid-template-columns:1fr!important;gap:28px!important}}';
    document.head.appendChild(style);
  }

  /* 4. Favicon: la mayoría de páginas no declaran ninguno */
  function initFavicon() {
    if (document.querySelector('link[rel~="icon"]')) return;
    var link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = '/favicon.svg';
    document.head.appendChild(link);
  }

  /* 5. Barra CTA fija en móvil: WhatsApp + Llamar */
  function initMobileBar() {
    if (document.getElementById('dmw-mobile-bar')) return;
    var css = '@media(min-width:769px){#dmw-mobile-bar{display:none!important}}'
      + '@media(max-width:768px){'
      + '#waf{display:none!important}'
      + 'body{padding-bottom:64px}'
      + '#dmw-mobile-bar{position:fixed;bottom:0;left:0;right:0;z-index:900;display:flex;gap:8px;padding:10px 12px calc(10px + env(safe-area-inset-bottom));background:rgba(14,14,14,.96);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-top:1px solid #2A2A2A;transform:translateY(110%);transition:transform .5s cubic-bezier(.16,1,.3,1);font-family:\'DM Sans\',system-ui,sans-serif}'
      + '#dmw-mobile-bar.show{transform:translateY(0)}'
      + '#dmw-mobile-bar a{display:flex;align-items:center;justify-content:center;gap:8px;border-radius:10px;font-size:14px;font-weight:600;padding:13px 10px;text-decoration:none;letter-spacing:.01em}'
      + '#dmw-mobile-bar .mb-wa{flex:1.6;background:#25D366;color:#fff}'
      + '#dmw-mobile-bar .mb-tel{flex:1;background:transparent;border:1px solid rgba(255,255,255,.25);color:#fff}'
      + '}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.id = 'dmw-mobile-bar';
    bar.innerHTML = '<a class="mb-wa" href="' + WA_URL + '" target="_blank" rel="noopener">'
      + '<svg width="17" height="17" fill="#fff" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
      + 'Pedir mi web · ' + CFG.price + '</a>'
      + '<a class="mb-tel" href="' + TEL_URL + '">' + ICON.phone + 'Llamar</a>';
    document.body.appendChild(bar);

    var shown = false;
    function onScroll() {
      if (shown) return;
      if (window.scrollY > 350) {
        shown = true;
        bar.classList.add('show');
        window.removeEventListener('scroll', onScroll);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* 6. Modal de salida (solo escritorio, una vez por sesión) */
  function initExitIntent() {
    if (window.innerWidth <= 768 || !window.matchMedia('(pointer:fine)').matches) return;
    try { if (sessionStorage.getItem('dmw-exit-shown')) return; } catch (e) {}

    var css = '#dmw-exit{position:fixed;inset:0;z-index:1100;background:rgba(8,8,8,.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s;font-family:\'DM Sans\',system-ui,sans-serif}'
      + '#dmw-exit.show{opacity:1;pointer-events:all}'
      + '#dmw-exit .ex-card{background:radial-gradient(120% 80% at 50% 0%,rgba(127,163,245,.16),transparent 60%),#141414;border:1px solid #2A2A2A;border-radius:20px;max-width:480px;width:calc(100% - 48px);padding:44px 40px;text-align:center;position:relative;transform:translateY(24px) scale(.96);transition:transform .5s cubic-bezier(.16,1,.3,1);box-shadow:0 30px 80px rgba(0,0,0,.55)}'
      + '#dmw-exit.show .ex-card{transform:none}'
      + '#dmw-exit .ex-x{position:absolute;top:14px;right:18px;background:none;border:none;color:rgba(255,255,255,.4);font-size:22px;cursor:pointer;line-height:1;padding:6px}'
      + '#dmw-exit .ex-x:hover{color:#fff}'
      + '#dmw-exit .ex-tag{display:inline-block;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#7FA3F5;margin-bottom:16px}'
      + '#dmw-exit h3{font-family:Fraunces,Georgia,serif;font-size:30px;font-weight:300;letter-spacing:-.02em;color:#fff;line-height:1.15;margin:0 0 14px}'
      + '#dmw-exit h3 b{color:#7FA3F5;font-weight:300;font-style:italic}'
      + '#dmw-exit p{font-size:14px;font-weight:300;color:rgba(255,255,255,.6);line-height:1.65;margin:0 0 26px}'
      + '#dmw-exit .ex-cta{display:inline-flex;align-items:center;gap:9px;background:#25D366;color:#fff;font-size:15px;font-weight:600;padding:14px 30px;border-radius:11px;text-decoration:none;transition:opacity .15s}'
      + '#dmw-exit .ex-cta:hover{opacity:.88}'
      + '#dmw-exit .ex-no{display:block;margin-top:16px;background:none;border:none;color:rgba(255,255,255,.4);font-size:12px;cursor:pointer;text-decoration:underline}'
      + '#dmw-exit .ex-no:hover{color:#fff}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var modal = document.createElement('div');
    modal.id = 'dmw-exit';
    modal.innerHTML = '<div class="ex-card">'
      + '<button class="ex-x" aria-label="Cerrar">×</button>'
      + '<span class="ex-tag">Antes de irte</span>'
      + '<h3>Tu web por <b>' + CFG.priceFull + '</b>,<br>online en ' + CFG.entregaHoras + ' horas</h3>'
      + '<p>Pago único, sin mensualidades. Dominio .com y SEO incluidos. Más de ' + CFG.proyectos + ' negocios en España ya captan clientes con su web.</p>'
      + '<a class="ex-cta" data-wa-loc="modal_salida" href="' + WA_URL + '" target="_blank" rel="noopener">' + ICON.whatsapp + 'Pedir mi web por WhatsApp</a>'
      + '<button class="ex-no">No, gracias — seguir navegando</button>'
      + '</div>';
    document.body.appendChild(modal);

    function close() { modal.classList.remove('show'); }
    modal.querySelector('.ex-x').addEventListener('click', close);
    modal.querySelector('.ex-no').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    modal.querySelector('.ex-cta').addEventListener('click', function () {
      track('generate_lead', { method: 'exit_intent' });
      close();
    });

    var armed = false;
    setTimeout(function () { armed = true; }, 8000); // no saltar en los primeros segundos
    document.addEventListener('mouseout', function (e) {
      if (!armed || e.relatedTarget || e.clientY > 10) return;
      try {
        if (sessionStorage.getItem('dmw-exit-shown')) return;
        sessionStorage.setItem('dmw-exit-shown', '1');
      } catch (err) {}
      modal.classList.add('show');
      track('exit_intent_shown', { page: location.pathname });
    });
  }

  /* 7. Revelado al hacer scroll en las páginas sin animación propia (la home
     tiene sus .rv). Solo se ocultan bloques que aún están fuera de pantalla:
     lo que se ve al cargar no parpadea y el LCP no espera a ninguna animación.
     Las rejillas revelan sus tarjetas en cascada. */
  var MOVIMIENTO = !window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initReveal() {
    if (!MOVIMIENTO || !('IntersectionObserver' in window)) return;
    if (document.querySelector('.rv')) return;
    var alto = window.innerHeight;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('dmw-on');
        io.unobserve(e.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    function marcar(el, retardo) {
      if (el.getBoundingClientRect().top < alto) return;
      el.classList.add('dmw-rv');
      if (retardo) el.style.setProperty('--dmw-d', retardo + 's');
      io.observe(el);
    }

    var secciones = document.querySelectorAll('section, .dmw-ft');
    for (var i = 0; i < secciones.length; i++) {
      var sec = secciones[i];
      if (sec.closest('.dmw-mob')) continue;
      var caja = sec.children.length === 1 ? sec.firstElementChild : sec;
      var hijos = caja.children;
      for (var j = 0; j < hijos.length; j++) {
        var h = hijos[j];
        if (/^(STYLE|SCRIPT|TEMPLATE)$/.test(h.tagName)) continue;
        var d = getComputedStyle(h).display;
        var n = h.children.length;
        if ((d === 'grid' || d === 'flex') && n >= 3 && n <= 16) {
          for (var k = 0; k < n; k++) marcar(h.children[k], Math.min(k * 0.07, 0.42));
        } else {
          marcar(h, 0);
        }
      }
    }
  }

  /* 8. Las cifras destacadas (+111, 5,0, 72h…) cuentan desde cero al entrar
     en pantalla. El HTML conserva el valor real para buscadores y lectores. */
  function initContadores() {
    if (!MOVIMIENTO || !('IntersectionObserver' in window)) return;
    var els = document.querySelectorAll('.hs-n, .m-n, .hst-n, [data-dmw-count]');
    if (!els.length) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        contar(e.target);
      });
    }, { threshold: 0.6 });

    function contar(el) {
      var m = el._dmw, t0 = null, dur = 1400;
      function paso(t) {
        if (t0 === null) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var v = m.valor * (1 - Math.pow(1 - p, 4));
        el.firstChild.nodeValue = m.pre + (m.dec ? v.toFixed(m.dec).replace('.', ',') : Math.round(v)) + m.post;
        if (p < 1) requestAnimationFrame(paso);
      }
      requestAnimationFrame(paso);
    }

    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      var nodo = el.firstChild;
      if (!nodo || nodo.nodeType !== 3) continue;
      var m = /^(\D*?)(\d{1,4}(?:,\d)?)(\D*)$/.exec(nodo.nodeValue);
      if (!m || el.getBoundingClientRect().top < window.innerHeight) continue;
      var dec = m[2].indexOf(',') !== -1 ? 1 : 0;
      el._dmw = { pre: m[1], valor: parseFloat(m[2].replace(',', '.')), dec: dec, post: m[3] };
      el.style.fontVariantNumeric = 'tabular-nums';
      nodo.nodeValue = m[1] + (dec ? '0,0' : '0') + m[3];
      io.observe(el);
    }
  }

  /* 3c. Si la visita viene de un anuncio de Google, los enlaces de WhatsApp fijos del HTML
     cambian su mensaje a "Hola, vengo de Google, ..." */
  function initOrigenGoogle() {
    if (!DESDE_GOOGLE) return;
    [].slice.call(document.querySelectorAll('a[href*="wa.me"]')).forEach(function (a) {
      try {
        var u = new URL(a.href);
        var t = u.searchParams.get('text') || '';
        if (/vengo de Google/i.test(t)) return;
        t = /^Hola,?\s*/i.test(t) ? t.replace(/^Hola,?\s*/i, 'Hola, vengo de Google, ') : 'Hola, vengo de Google. ' + t;
        a.href = u.origin + u.pathname + '?text=' + encodeURIComponent(t);
      } catch (e) {}
    });
  }

  function init() { initOrigenGoogle(); initHeader(); initResponsiveFix(); initFavicon(); initCookieBanner(); initTracking(); initMobileBar(); initExitIntent(); initReveal(); initContadores(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
