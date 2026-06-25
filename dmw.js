/* Dame mi web — script compartido: consentimiento de cookies + tracking de conversiones */
(function () {
  var GA_ID = 'G-B27EE57BLZ';

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

  function init() { initCookieBanner(); initTracking(); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
