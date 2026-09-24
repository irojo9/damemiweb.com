/**
 * Cabecera y pie comunes a TODAS las plantillas del sitio.
 *
 * Se inyectan en cada página entre los marcadores <!--dmw:header--> …
 * <!--/dmw:header--> y <!--dmw:footer--> … <!--/dmw:footer--> desde
 * tools/build.mjs. Todos los textos y precios salen de site.config.json.
 *
 * Los estilos van con nombres propios (.dmw-*) y colores literales para que el
 * componente se vea igual sobre cualquiera de las hojas de estilo del sitio.
 * Se usan <div role="navigation"> y <div role="contentinfo"> en vez de <nav>
 * y <footer> a propósito: varias páginas tienen reglas CSS globales sobre esas
 * etiquetas que romperían la maquetación del componente.
 */
import { icon } from './icons.mjs';
import { SECTORES, CIUDADES } from './data.mjs';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');


/**
 * Marca de "Dame mi web" en SVG inline.
 * El PNG del repositorio es una silueta negra sobre fondo transparente y
 * desaparece sobre la cabecera oscura, así que la marca va vectorial.
 * Lleva nombre accesible propio: equivale al alt="Dame mi web" de una imagen.
 */
function logo(size) {
  return `<svg class="dmw-logo" width="${size}" height="${size}" viewBox="0 0 100 100" role="img" aria-label="Dame mi web">`
    + '<rect width="100" height="100" rx="16" fill="#1C1C1C"/>'
    + '<path d="M 18 26 L 18 74 L 40 74 C 56 74 64 64 64 50 C 64 36 56 26 40 26 Z M 30 36 L 40 36 C 48 36 52 42 52 50 C 52 58 48 64 40 64 L 30 64 Z" fill="#FFFFFF"/>'
    + '<path d="M 58 70 L 68 50 L 74 60 L 84 32 L 90 36 L 86 26 L 78 32 L 82 22 L 70 32 L 66 24 L 62 32 Z" fill="#7FA3F5"/>'
    + '<polygon points="84,26 92,22 88,32" fill="#7FA3F5"/></svg>';
}

/**
 * Arranque de Google Analytics con el Modo de consentimiento v2 de Google.
 * Todo empieza en "denied" salvo que el visitante ya aceptara las cookies
 * (dmw.js guarda su decisión en localStorage 'cookie-consent'). Con "denied"
 * no se escriben cookies de Google; se envían pings sin cookies que Google Ads
 * usa para modelar conversiones. Al aceptar, dmw.js hace el 'update'.
 */
export function gtagSnippet(cfg) {
  return `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}`
    + `(function(){var v='denied';try{if(localStorage.getItem('cookie-consent')==='accepted')v='granted'}catch(e){}`
    + `gtag('consent','default',{ad_storage:v,ad_user_data:v,ad_personalization:v,analytics_storage:v,wait_for_update:500});})();`
    + `gtag('set','ads_data_redaction',true);gtag('js',new Date());gtag('config','${cfg.site.ga4}');</script>`;
}

export function waLink(cfg, texto, ubicacion, cls = '', extra = '') {
  const tel = cfg.site.phone.replace('+', '');
  const href = `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`;
  const c = cls ? ` class="${cls}"` : '';
  return `<a href="${href}" target="_blank" rel="noopener" data-wa-loc="${ubicacion}" data-wa-fixed${c}${extra}>`;
}

export function headerCSS() {
  return `<style>
.dmw-skip{position:absolute;left:-9999px;top:0;z-index:1000;background:#1347CC;color:#fff;padding:10px 18px;border-radius:0 0 8px 0;font:500 14px/1 system-ui,sans-serif;text-decoration:none}
.dmw-skip:focus{left:0}
.dmw-hd{position:fixed;top:0;left:0;right:0;z-index:300;height:68px;background:rgba(14,14,14,.94);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid #242424;font-family:'DM Sans',system-ui,-apple-system,sans-serif;color:#fff}
.dmw-hd-spacer{height:68px}
.dmw-hd *,.dmw-ft *{box-sizing:border-box}
.dmw-hd-in{max-width:1400px;margin:0 auto;height:100%;padding:0 24px;display:flex;align-items:center;gap:16px}
.dmw-brand{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0}
.dmw-brand .dmw-logo{width:34px;height:34px;display:block;flex-shrink:0}
.dmw-brand-t{font-family:'Fraunces',Georgia,serif;font-size:16px;font-weight:600;letter-spacing:-.015em;color:#fff;white-space:nowrap}
.dmw-brand-t span{color:#7FA3F5}
.dmw-nav{display:flex;align-items:center;gap:2px;margin-left:auto}
.dmw-nav>a,.dmw-dd-btn{display:inline-flex;align-items:center;gap:5px;padding:9px 11px;border-radius:8px;font-size:14px;font-weight:400;line-height:1;color:rgba(255,255,255,.72);text-decoration:none;background:none;border:none;font-family:inherit;cursor:pointer;white-space:nowrap;transition:color .15s,background .15s}
.dmw-nav>a:hover,.dmw-dd-btn:hover,.dmw-dd-btn[aria-expanded=true]{color:#fff;background:rgba(255,255,255,.07)}
.dmw-nav>a:focus-visible,.dmw-dd-btn:focus-visible,.dmw-cta:focus-visible,.dmw-burger:focus-visible{outline:2px solid #7FA3F5;outline-offset:2px}
.dmw-dd{position:relative}
.dmw-dd-btn svg{transition:transform .2s}
.dmw-dd-btn[aria-expanded=true] svg{transform:rotate(180deg)}
.dmw-dd-panel{position:absolute;top:calc(100% + 8px);left:0;min-width:230px;max-height:min(70vh,560px);overflow-y:auto;background:#141414;border:1px solid #2A2A2A;border-radius:12px;padding:8px;box-shadow:0 18px 44px rgba(0,0,0,.5)}
.dmw-dd-panel.wide{column-count:2;column-gap:4px;min-width:400px}
.dmw-dd-panel a{display:block;padding:9px 12px;border-radius:8px;font-size:14px;color:rgba(255,255,255,.75);text-decoration:none;break-inside:avoid;white-space:nowrap}
.dmw-dd-panel a:hover{background:rgba(255,255,255,.08);color:#fff}
.dmw-dd-panel a.lead{color:#7FA3F5;font-weight:500}
.dmw-cta{display:inline-flex;align-items:center;gap:7px;flex-shrink:0;background:#25D366;color:#fff!important;padding:10px 17px;border-radius:9px;font-size:14px;font-weight:600;text-decoration:none;white-space:nowrap;transition:opacity .15s}
.dmw-cta:hover{opacity:.88}
.dmw-burger{display:none;align-items:center;justify-content:center;width:42px;height:42px;border-radius:9px;border:1px solid #2A2A2A;background:none;color:#fff;cursor:pointer;flex-shrink:0}
.dmw-mob{position:fixed;top:68px;left:0;right:0;bottom:0;z-index:299;background:#0E0E0E;overflow-y:auto;padding:16px 20px 48px;-webkit-overflow-scrolling:touch}
.dmw-mob-sec{border-bottom:1px solid #1F1F1F;padding:4px 0}
.dmw-mob-sec>a,.dmw-mob-btn{display:flex;align-items:center;justify-content:space-between;width:100%;padding:15px 4px;font-size:17px;font-weight:400;color:rgba(255,255,255,.85);text-decoration:none;background:none;border:none;font-family:inherit;cursor:pointer;text-align:left}
.dmw-mob-btn svg{transition:transform .2s;flex-shrink:0}
.dmw-mob-btn[aria-expanded=true] svg{transform:rotate(180deg)}
.dmw-mob-panel{padding:0 0 12px 4px;display:flex;flex-wrap:wrap;gap:7px}
/* display:flex/grid gana al [hidden] del navegador: hay que reponerlo. */
.dmw-mob-panel[hidden],.dmw-dd-panel[hidden],.dmw-mob[hidden]{display:none}
.dmw-mob-panel a{font-size:14px;color:rgba(255,255,255,.65);text-decoration:none;border:1px solid #262626;border-radius:100px;padding:8px 14px}
.dmw-mob-panel a.lead{color:#7FA3F5;border-color:#2b3a5c}
.dmw-mob .dmw-cta{margin-top:22px;width:100%;justify-content:center;padding:15px}
@media(max-width:1180px){.dmw-nav{display:none}.dmw-burger{display:inline-flex}.dmw-hd-in{gap:10px}.dmw-cta{margin-left:auto}}
/* En pantallas muy estrechas el CTA de la barra se queda en icono, pero el
   del menu movil conserva su texto. */
@media(max-width:560px){.dmw-hd .dmw-cta span{display:none}.dmw-hd .dmw-cta{padding:10px 13px}}
/* Movimiento reducido, para todo el sitio. Va en la cabecera porque es el
   unico bloque que esta en todas las paginas. Las clases .rv y .reveal son
   revelados al hacer scroll: sin animacion tienen que quedarse visibles. */
@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}
  html{scroll-behavior:auto!important}
  .rv,.reveal,.rv.on{opacity:1!important;transform:none!important}
}
</style>`;
}

export function header(cfg) {
  const ch = icon('chevron-down', { size: 15 });
  const wa = waLink(cfg, `Hola, quiero mi web por ${cfg.web.priceFull}.`, 'header', 'dmw-cta');

  const servicios = [
    ['/#servicios', 'Servicios — qué incluye', true],
    ['/#proceso', 'Proceso — cómo funciona', false],
    ['/precios', 'Precios', false],
    ['/auditorias', 'Auditorías', false],
    ['/marketing', 'Marketing', false],
    ['/comparativa', 'Comparativa', false]
  ];
  const sectores = [['/sectores', 'Sectores — ver todos', true], ...SECTORES.map(s => ['/' + s.slug, s.label, false])];
  const ciudades = CIUDADES.map(c => ['/' + c.slug, c.label, false]);

  const ddLinks = list => list.map(([h, t, lead]) =>
    `<a href="${h}"${lead ? ' class="lead"' : ''}>${esc(t)}</a>`).join('');
  const chipLinks = list => list.map(([h, t, lead]) =>
    `<a href="${h}"${lead ? ' class="lead"' : ''}>${esc(t)}</a>`).join('');

  const dd = (id, label, list, wide) => `<div class="dmw-dd">
        <button type="button" class="dmw-dd-btn" aria-expanded="false" aria-controls="dmw-dd-${id}">${esc(label)}${ch}</button>
        <div class="dmw-dd-panel${wide ? ' wide' : ''}" id="dmw-dd-${id}" hidden>${ddLinks(list)}</div>
      </div>`;

  const mobDd = (id, label, list, wide) => `<div class="dmw-mob-sec">
        <button type="button" class="dmw-mob-btn" aria-expanded="false" aria-controls="dmw-mob-${id}">${esc(label)}${icon('chevron-down', { size: 18 })}</button>
        <div class="dmw-mob-panel" id="dmw-mob-${id}" hidden>${chipLinks(list)}</div>
      </div>`;

  return `${headerCSS()}
<a class="dmw-skip" href="#dmw-main">Saltar al contenido</a>
<header class="dmw-hd" id="dmw-hd">
  <div class="dmw-hd-in">
    <a href="/" class="dmw-brand">
      ${logo(34)}
      <span class="dmw-brand-t" aria-hidden="true">Dame mi <span>web</span></span>
    </a>
    <div class="dmw-nav" role="navigation" aria-label="Principal">
      ${dd('serv', 'Servicios', servicios, false)}
      ${dd('sect', 'Sectores', sectores, true)}
      ${dd('ciu', 'Ciudades', ciudades, true)}
      <a href="/proyectos">Proyectos</a>
      <a href="/resenas">Reseñas</a>
      <a href="/blog">Blog</a>
      <a href="/contacto">Contacto</a>
    </div>
    ${wa}${icon('whatsapp', { size: 17 })}<span>Pedir mi web</span></a>
    <button type="button" class="dmw-burger" id="dmw-burger" aria-expanded="false" aria-controls="dmw-mob" aria-label="Abrir menú">${icon('menu', { size: 22 })}</button>
  </div>
</header>
<!-- El panel movil va fuera de <header> a proposito: el backdrop-filter de la
     cabecera crea un bloque contenedor y recortaria su position:fixed. -->
<div class="dmw-mob" id="dmw-mob" hidden>
      ${mobDd('serv', 'Servicios', servicios, false)}
      ${mobDd('sect', 'Sectores', sectores, false)}
      ${mobDd('ciu', 'Ciudades', ciudades, false)}
      <div class="dmw-mob-sec"><a href="/proyectos">Proyectos</a></div>
      <div class="dmw-mob-sec"><a href="/resenas">Reseñas</a></div>
      <div class="dmw-mob-sec"><a href="/blog">Blog</a></div>
      <div class="dmw-mob-sec"><a href="/contacto">Contacto</a></div>
      ${waLink(cfg, `Hola, quiero mi web por ${cfg.web.priceFull}.`, 'menu_movil', 'dmw-cta')}${icon('whatsapp', { size: 18 })}<span>Pedir mi web — ${esc(cfg.web.priceFull)}</span></a>
</div>
<div class="dmw-hd-spacer" id="dmw-main" tabindex="-1"></div>`;
}

export function footerCSS() {
  return `<style>
.dmw-ft{background:#0B0B0B;border-top:1px solid #1F1F1F;padding:64px 24px 28px;font-family:'DM Sans',system-ui,-apple-system,sans-serif;color:rgba(255,255,255,.6)}
.dmw-ft-in{max-width:1240px;margin:0 auto}
.dmw-ft-grid{display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr 1fr;gap:40px;margin-bottom:48px}
.dmw-ft-brand{display:flex;align-items:center;gap:10px;margin-bottom:16px;text-decoration:none}
.dmw-ft-brand .dmw-logo{width:34px;height:34px;display:block;flex-shrink:0}
.dmw-ft-brand-t{font-family:'Fraunces',Georgia,serif;font-size:16px;font-weight:600;color:#fff;letter-spacing:-.015em}
.dmw-ft-brand-t span{color:#7FA3F5}
.dmw-ft-desc{font-size:14px;font-weight:300;line-height:1.7;color:rgba(255,255,255,.5);max-width:320px;margin:0 0 20px}
.dmw-ft-meta{font-size:13px;line-height:1.7;color:rgba(255,255,255,.45);margin:0}
.dmw-ft-meta a{color:rgba(255,255,255,.7);text-decoration:none}
.dmw-ft-meta a:hover{color:#7FA3F5}
.dmw-ft h2{font-family:inherit;font-size:12px;font-weight:600;letter-spacing:.11em;text-transform:uppercase;color:#fff;margin:0 0 16px}
.dmw-ft ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px}
.dmw-ft ul a{font-size:14px;font-weight:300;color:rgba(255,255,255,.55);text-decoration:none;transition:color .15s}
.dmw-ft ul a:hover{color:#fff}
.dmw-ft-bot{border-top:1px solid #1F1F1F;padding-top:22px;display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap}
.dmw-ft-bot p{font-size:13px;font-weight:300;color:rgba(255,255,255,.4);margin:0}
.dmw-ft-soc{display:flex;gap:8px}
.dmw-ft-soc a{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;border:1px solid #262626;color:rgba(255,255,255,.6);text-decoration:none;transition:all .15s}
.dmw-ft-soc a:hover{color:#fff;border-color:#7FA3F5}
.dmw-ft a:focus-visible,.dmw-ft-soc a:focus-visible{outline:2px solid #7FA3F5;outline-offset:2px}
@media(max-width:1000px){.dmw-ft-grid{grid-template-columns:1fr 1fr 1fr;gap:32px}}
@media(max-width:620px){.dmw-ft{padding:48px 20px 24px}.dmw-ft-grid{grid-template-columns:1fr 1fr;gap:28px}}
</style>`;
}

export function footer(cfg) {
  const year = new Date(cfg.site.lastUpdated).getFullYear();
  const li = list => list.map(([h, t, ext]) =>
    `<li><a href="${h}"${ext ? ' target="_blank" rel="noopener"' : ''}>${esc(t)}</a></li>`).join('');

  return `${footerCSS()}
<div class="dmw-ft" role="contentinfo">
  <div class="dmw-ft-in">
    <div class="dmw-ft-grid">
      <div>
        <a href="/" class="dmw-ft-brand">
          ${logo(34)}
          <span class="dmw-ft-brand-t" aria-hidden="true">Dame mi <span>web</span></span>
        </a>
        <p class="dmw-ft-desc">Página web profesional para autónomos y pequeños negocios en toda España. ${esc(cfg.web.priceLong)}, sin cuotas mensuales y con ${esc(cfg.soporte.displayShort.toLowerCase())}.</p>
        <p class="dmw-ft-meta">${esc(cfg.resenas.display)}<br/><a href="/proyectos">${esc(cfg.proyectos.display)} proyectos entregados</a><br/><a href="/contacto">Contacto</a> · <a href="tel:${esc(cfg.site.phone)}">${esc(cfg.site.phoneDisplay)}</a></p>
      </div>
      <div>
        <h2>Servicios</h2>
        <ul>${li([
          ['/#servicios', 'Servicios'],
          ['/#proceso', 'Proceso'],
          ['/precios', 'Precios'],
          ['/proyectos', 'Proyectos'],
          ['/auditorias', 'Auditorías'],
          ['/marketing', 'Marketing'],
          ['/comparativa', 'Comparativa']
        ])}</ul>
      </div>
      <div>
        <h2>Sectores</h2>
        <ul>${li([
          ['/sectores', 'Todos los sectores'],
          ...SECTORES.slice(0, 7).map(s => ['/' + s.slug, s.label])
        ])}</ul>
      </div>
      <div>
        <h2>Ciudades</h2>
        <ul>${li(CIUDADES.filter(c => ['madrid', 'barcelona', 'valencia', 'sevilla', 'zaragoza', 'bilbao', 'malaga'].some(k => c.slug.endsWith(k))).map(c => ['/' + c.slug, c.label]))}</ul>
      </div>
      <div>
        <h2>Recursos y legal</h2>
        <ul>${li([
          ['/blog', 'Blog'],
          ['/juego_mudanzas', 'Juego: Mudanza Express'],
          ['/preguntas-frecuentes', 'Preguntas frecuentes'],
          ['/sobre-nosotros', 'Sobre nosotros'],
          ['/resenas', 'Reseñas'],
          ['/aviso-legal', 'Aviso legal'],
          ['/privacidad', 'Privacidad'],
          ['/terminos', 'Términos'],
          ['/cookies', 'Cookies'],
          ['https://www.autoridadgeo.com', 'AutoridadGEO', true]
        ])}</ul>
      </div>
    </div>
    <div class="dmw-ft-bot">
      <p>© ${year} ${esc(cfg.site.brand)}. Todos los derechos reservados.</p>
      <div class="dmw-ft-soc">
        <a href="${esc(cfg.site.instagram)}" target="_blank" rel="noopener" aria-label="Instagram de ${esc(cfg.site.brand)}">${icon('instagram', { size: 19 })}</a>
        <a href="${esc(cfg.site.tiktok)}" target="_blank" rel="noopener" aria-label="TikTok de ${esc(cfg.site.brand)}">${icon('tiktok', { size: 19 })}</a>
        ${waLink(cfg, `Hola, quiero mi web por ${cfg.web.priceFull}.`, 'footer', '', ' aria-label="WhatsApp"')}${icon('whatsapp', { size: 19 })}</a>
      </div>
    </div>
  </div>
</div>`;
}
