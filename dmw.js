/* Dame mi web — script compartido: consentimiento de cookies + tracking de conversiones
   + favicon, barra CTA móvil y modal de salida (conversión) */
(function () {
  var GA_ID = 'G-B27EE57BLZ';
  var WA_URL = 'https://wa.me/34662549694?text=' + encodeURIComponent('Hola, quiero mi web por 250€ + IVA.');
  var TEL_URL = 'tel:+34662549694';

  /* 1. Respetar rechazo previo de cookies */
  try {
    if (localStorage.getItem('cookie-consent') === 'rejected') {
      window['ga-disable-' + GA_ID] = true;
    }
  } catch (e) {}

  /* 2. Inyectar banner de cookies si no existe en la página */
  function initCookieBanner() {
    if (document.getElementById('dmw-cookie-banner')) return;
    var consent;
    try { consent = localStorage.getItem('cookie-consent'); } catch (e) {}
    if (consent) return; // ya decidió

    var css = '#dmw-cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:1000;background:rgba(10,22,40,.97);backdrop-filter:blur(20px);border-top:1px solid #1B2A6B;padding:16px 40px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;transform:translateY(100%);transition:transform .4s ease;font-family:Inter,system-ui,sans-serif}'
      + '#dmw-cookie-banner.show{transform:translateY(0)}'
      + '#dmw-cookie-banner .cb-t{font-size:13px;font-weight:300;color:rgba(255,255,255,.6);line-height:1.55;flex:1;min-width:260px}'
      + '#dmw-cookie-banner .cb-t a{color:#00B4D8}'
      + '#dmw-cookie-banner .cb-btns{display:flex;gap:8px}'
      + '#dmw-cookie-banner button{padding:9px 18px;border-radius:8px;font-size:13px;cursor:pointer;font-family:inherit;transition:all .15s}'
      + '#dmw-cookie-banner .cb-r{background:transparent;border:1px solid #1B2A6B;color:rgba(255,255,255,.55)}'
      + '#dmw-cookie-banner .cb-r:hover{border-color:#8C8C8C;color:#fff}'
      + '#dmw-cookie-banner .cb-a{background:#00B4D8;color:#fff;border:none;font-weight:500}'
      + '#dmw-cookie-banner .cb-a:hover{opacity:.88}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.id = 'dmw-cookie-banner';
    bar.innerHTML = '<p class="cb-t">Usamos cookies propias y de terceros (Google Analytics) para analizar el tráfico. <a href="/cookies">Política de cookies</a></p>'
      + '<div class="cb-btns"><button class="cb-r">Rechazar</button><button class="cb-a">Aceptar</button></div>';
    document.body.appendChild(bar);

    bar.querySelector('.cb-a').addEventListener('click', function () {
      try { localStorage.setItem('cookie-consent', 'accepted'); } catch (e) {}
      bar.classList.remove('show');
    });
    bar.querySelector('.cb-r').addEventListener('click', function () {
      try { localStorage.setItem('cookie-consent', 'rejected'); } catch (e) {}
      window['ga-disable-' + GA_ID] = true;
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
        track('whatsapp_click', { link_url: href, page: location.pathname });
      } else if (href.indexOf('tel:') === 0) {
        track('phone_click', { page: location.pathname });
      } else if (href.indexOf('mailto:') === 0) {
        track('email_click', { page: location.pathname });
      }
    }, true);
  }

  /* 4. Favicon: la mayoría de páginas no declaran ninguno */
  function initFavicon() {
    if (document.querySelector('link[rel~="icon"]')) return;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
      + '<rect width="100" height="100" rx="18" fill="%231B2A6B"/>'
      + '<path d="M 18 26 L 18 74 L 40 74 C 56 74 64 64 64 50 C 64 36 56 26 40 26 Z M 30 36 L 40 36 C 48 36 52 42 52 50 C 52 58 48 64 40 64 L 30 64 Z" fill="%23FFFFFF"/>'
      + '<path d="M 58 70 L 68 50 L 74 60 L 84 32 L 90 36 L 86 26 L 78 32 L 82 22 L 70 32 L 66 24 L 62 32 Z" fill="%2300B4D8"/>'
      + '<polygon points="84,26 92,22 88,32" fill="%2300B4D8"/></svg>';
    var link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = 'data:image/svg+xml,' + svg;
    document.head.appendChild(link);
  }

  /* 5. Barra CTA fija en móvil: WhatsApp + Llamar */
  function initMobileBar() {
    if (document.getElementById('dmw-mobile-bar')) return;
    var css = '@media(min-width:769px){#dmw-mobile-bar{display:none!important}}'
      + '@media(max-width:768px){'
      + '#waf{display:none!important}'
      + 'body{padding-bottom:64px}'
      + '#dmw-mobile-bar{position:fixed;bottom:0;left:0;right:0;z-index:900;display:flex;gap:8px;padding:10px 12px calc(10px + env(safe-area-inset-bottom));background:rgba(10,22,40,.97);backdrop-filter:blur(20px);border-top:1px solid #1B2A6B;transform:translateY(110%);transition:transform .35s ease;font-family:Inter,system-ui,sans-serif}'
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
      + 'Pedir mi web · 250€</a>'
      + '<a class="mb-tel" href="' + TEL_URL + '">📞 Llamar</a>';
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

    var css = '#dmw-exit{position:fixed;inset:0;z-index:1100;background:rgba(6,12,26,.75);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;transition:opacity .3s;font-family:Inter,system-ui,sans-serif}'
      + '#dmw-exit.show{opacity:1;pointer-events:all}'
      + '#dmw-exit .ex-card{background:#0D1B3E;border:1px solid #1B2A6B;border-radius:20px;max-width:480px;width:calc(100% - 48px);padding:44px 40px;text-align:center;position:relative;transform:translateY(16px);transition:transform .3s}'
      + '#dmw-exit.show .ex-card{transform:translateY(0)}'
      + '#dmw-exit .ex-x{position:absolute;top:14px;right:18px;background:none;border:none;color:rgba(255,255,255,.4);font-size:22px;cursor:pointer;line-height:1;padding:6px}'
      + '#dmw-exit .ex-x:hover{color:#fff}'
      + '#dmw-exit .ex-tag{display:inline-block;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#00B4D8;margin-bottom:16px}'
      + '#dmw-exit h3{font-family:Poppins,system-ui,sans-serif;font-size:30px;font-weight:400;letter-spacing:-.02em;color:#fff;line-height:1.15;margin:0 0 14px}'
      + '#dmw-exit h3 b{color:#00B4D8;font-weight:600}'
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
      + '<h3>Tu web por <b>250€ + IVA</b>,<br>online en 72 horas</h3>'
      + '<p>Pago único, sin mensualidades. Dominio .com y SEO incluidos. Más de 83 negocios en España ya captan clientes con su web.</p>'
      + '<a class="ex-cta" href="' + WA_URL + '" target="_blank" rel="noopener">💬 Pedir mi web por WhatsApp</a>'
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

  function init() { initFavicon(); initCookieBanner(); initTracking(); initMobileBar(); initExitIntent(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
