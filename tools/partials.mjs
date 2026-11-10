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
 * Marca real de "Dame mi web" (la "DW" con la flecha), recortada del logo
 * original sobre fondo transparente. logo-dw.png va a 2x (120x68) para que
 * se vea nítida en pantallas retina; el alt hace de nombre accesible.
 */
function logo(size) {
  const w = Math.round(size * 120 / 68);
  return `<img class="dmw-logo" src="/logo-dw.png" width="${w}" height="${size}" alt="Dame mi web" decoding="async"/>`;
}

/**
 * Intro de entrada con el logo, una vez por sesión de navegador.
 *
 * La "DW" se dibuja en diagonal siguiendo la flecha, la recorre un destello,
 * la punta de la flecha suelta una onda y chispas, aparece "Dame mi web" letra
 * a letra y el logo vuela a su sitio en la cabecera, donde se funde con el
 * logo real mientras el fondo se abre (~2,9 s).
 *
 * Va inline al principio del <body> para tapar la página antes del primer
 * pintado. Sin JS no hay intro (el bloque está en display:none). No se
 * muestra con movimiento reducido, a bots ni a navegadores automatizados.
 * Un clic, una tecla, la rueda o un toque la saltan. logo-intro.webp solo se
 * descarga cuando la intro se va a ver.
 *
 * Rendimiento: todo lo que se mueve anima solo transform/opacity (y el
 * clip-path del dibujado), que van por el compositor. El brillo es una capa
 * enmascarada con blur ESTÁTICO a la que solo se le anima la opacidad, el
 * destello es un degradado que se desplaza con transform dentro de la máscara,
 * el telón de fondo es un hijo (.veil) que se funde con opacity en vez de
 * animar el background del overlay entero, y el tagline entra con scaleX en
 * lugar de animar letter-spacing (que recalcula el layout en cada frame).
 */
export function intro() {
  const letras = [...'Dame mi web'].map((c, i) =>
    `<b style="--i:${i}"${i >= 8 ? ' class="w"' : ''}>${c === ' ' ? '&nbsp;' : c}</b>`).join('');
  return `<style>
#dmw-intro{display:none}
html.dmw-intro-on{overflow:hidden}
/* .go mantiene el overlay visible aunque la clase del html caiga antes de
   tiempo; el nodo desaparece del todo cuando el script lo retira. */
html.dmw-intro-on #dmw-intro,#dmw-intro.go{display:flex}
html.dmw-intro-on .dmw-brand .dmw-logo{opacity:0}
.dmw-brand .dmw-logo{transition:opacity .25s ease}
#dmw-intro{position:fixed;inset:0;z-index:10000;flex-direction:column;align-items:center;justify-content:center;gap:clamp(16px,3vh,28px);cursor:pointer;overflow:hidden;font-family:'Fraunces',Georgia,serif;color:#fff;-webkit-tap-highlight-color:transparent;transition:opacity .3s}
#dmw-intro .veil{position:absolute;inset:0;background:#03050D}
#dmw-intro .bg{position:absolute;inset:-10%;background:radial-gradient(closest-side at 50% 44%,rgba(19,71,204,.52),rgba(19,71,204,.12) 55%,transparent 72%),radial-gradient(closest-side at 50% 118%,rgba(127,163,245,.14),transparent 62%);opacity:0;transform:scale(.6)}
/* El tope en vh evita que la marca desborde en pantallas apaisadas bajas. */
#dmw-intro .mkw{position:relative;width:min(74vw,460px,calc(44vh*640/363));aspect-ratio:640/363;transform-origin:0 0;transition:transform .75s cubic-bezier(.77,0,.175,1),opacity .25s ease}
#dmw-intro .gl,#dmw-intro .sh{position:absolute;inset:0;-webkit-mask:url(/logo-intro.webp) 0 0/100% 100% no-repeat;mask:url(/logo-intro.webp) 0 0/100% 100% no-repeat}
#dmw-intro .gl{background:#19C6FF;filter:blur(16px);opacity:0}
#dmw-intro .mk{position:absolute;inset:0;width:100%;height:100%;display:block;clip-path:polygon(0 100%,0 100%,0 100%)}
#dmw-intro .sh{overflow:hidden;opacity:0}
#dmw-intro .sh::before{content:'';position:absolute;inset:0;background:linear-gradient(115deg,transparent 40%,rgba(255,255,255,.9) 50%,transparent 60%);transform:translateX(-80%)}
#dmw-intro .ring,#dmw-intro .sp i{position:absolute;left:87.6%;top:8.3%;border-radius:50%;opacity:0;pointer-events:none}
#dmw-intro .ring{width:24px;height:24px;margin:-12px;border:2px solid #6FE3FF;box-shadow:0 0 18px #19C6FF,inset 0 0 12px #19C6FF}
#dmw-intro .sp i{width:6px;height:6px;margin:-3px;background:#D4F7FF;box-shadow:0 0 10px 2px #3FD4FF}
#dmw-intro .tt{display:flex;font-size:clamp(30px,5.4vw,48px);font-weight:600;letter-spacing:-.015em;line-height:1}
#dmw-intro .tt b{font-weight:inherit;display:inline-block;opacity:0}
#dmw-intro .tt .w{color:#7FA3F5}
#dmw-intro .tg{font:600 clamp(10px,1.6vw,13px)/1 'DM Sans',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.42em;margin-right:-.42em;color:rgba(255,255,255,.55);opacity:0}
#dmw-intro .sk{position:absolute;bottom:max(22px,env(safe-area-inset-bottom));font:400 12px/1 'DM Sans',system-ui,sans-serif;color:rgba(255,255,255,.3);opacity:0}
#dmw-intro.go .bg{animation:dmwi-bg 1.5s cubic-bezier(.16,1,.3,1) both}
#dmw-intro.go .mk{animation:dmwi-wipe .85s cubic-bezier(.77,0,.175,1) .1s both,dmwi-settle .85s cubic-bezier(.23,1,.32,1) .1s both}
#dmw-intro.go .gl{animation:dmwi-gl 1.6s ease-out .8s both}
#dmw-intro.go .sh{opacity:1}
#dmw-intro.go .sh::before{animation:dmwi-shx .7s cubic-bezier(.4,0,.2,1) .85s both}
#dmw-intro.go .ring{animation:dmwi-ring 1s cubic-bezier(.16,1,.3,1) .92s forwards}
#dmw-intro.go .sp i{animation:dmwi-sp var(--t,.9s) cubic-bezier(.1,.8,.3,1) var(--d,.92s) forwards}
#dmw-intro.go .tt b{animation:dmwi-ch .55s cubic-bezier(.23,1,.32,1) calc(1s + var(--i) * 38ms) both}
#dmw-intro.go .tg{animation:dmwi-tg .8s cubic-bezier(.23,1,.32,1) 1.3s both}
#dmw-intro.go .sk{animation:dmwi-fade .6s ease 1.15s both}
#dmw-intro.out{pointer-events:none}
#dmw-intro.out .veil{opacity:0;transition:opacity .6s cubic-bezier(.4,0,.2,1)}
#dmw-intro.out .bg,#dmw-intro.out .tt,#dmw-intro.out .tg,#dmw-intro.out .sk,#dmw-intro.out .sp,#dmw-intro.out .ring{opacity:0!important;transition:opacity .3s;animation-play-state:paused}
#dmw-intro.out .tt,#dmw-intro.out .tg{transform:translateY(-10px);transition:opacity .3s,transform .3s}
@keyframes dmwi-bg{to{opacity:1;transform:none}}
@keyframes dmwi-wipe{from{clip-path:polygon(0 100%,0 100%,0 100%)}to{clip-path:polygon(-30% -220%,-30% 140%,320% 140%)}}
@keyframes dmwi-settle{from{transform:scale(.94)}to{transform:none}}
@keyframes dmwi-gl{0%{opacity:0}30%{opacity:.5}100%{opacity:.16}}
@keyframes dmwi-shx{from{transform:translateX(-80%)}to{transform:translateX(80%)}}
@keyframes dmwi-ring{0%{opacity:1;transform:scale(.2)}100%{opacity:0;transform:scale(12)}}
@keyframes dmwi-sp{0%{opacity:1;transform:translate(0,0) scale(1.2)}100%{opacity:0;transform:translate(var(--x),var(--y)) scale(.2)}}
@keyframes dmwi-ch{from{opacity:0;transform:translateY(.5em) scale(.92) rotate(3deg)}to{opacity:1;transform:none}}
@keyframes dmwi-tg{from{opacity:0;transform:scaleX(1.3) translateY(8px)}to{opacity:1;transform:none}}
@keyframes dmwi-fade{to{opacity:1}}
</style>
<div id="dmw-intro" aria-hidden="true">
  <div class="veil"></div>
  <div class="bg"></div>
  <div class="mkw"><div class="gl"></div><img class="mk" alt="" width="640" height="363" decoding="async"/><div class="sh"></div><div class="ring"></div><div class="sp"></div></div>
  <div class="tt">${letras}</div>
  <div class="tg">Diseño web profesional</div>
  <div class="sk">Pulsa para saltar</div>
</div>
<script>(function(){var d=document.getElementById('dmw-intro'),h=document.documentElement,K='dmw-intro';
try{if(sessionStorage.getItem(K)||matchMedia('(prefers-reduced-motion: reduce)').matches||navigator.webdriver||/bot|crawl|spider|lighthouse|headless|preview/i.test(navigator.userAgent)){d.remove();return}sessionStorage.setItem(K,'1')}catch(e){d.remove();return}
h.classList.add('dmw-intro-on');
var sp=d.querySelector('.sp'),f='';for(var i=0;i<18;i++){var a=-Math.PI*(.05+Math.random()*1.25),r=60+Math.random()*130;f+='<i style="--x:'+(Math.cos(a)*r).toFixed(0)+'px;--y:'+(Math.sin(a)*r).toFixed(0)+'px;--d:'+(.92+Math.random()*.12).toFixed(2)+'s;--t:'+(.7+Math.random()*.5).toFixed(2)+'s"></i>'}sp.innerHTML=f;
var done=0,ts=[];function T(fn,ms){ts.push(setTimeout(fn,ms))}
function fin(){if(done)return;done=1;ts.forEach(clearTimeout);h.classList.remove('dmw-intro-on');d.remove();['click','keydown','wheel','touchstart'].forEach(function(e){removeEventListener(e,skip,true)})}
function skip(){if(done)return;ts.forEach(clearTimeout);d.style.opacity='0';T(fin,300)}
function fly(){var m=d.querySelector('.mkw'),t=document.querySelector('.dmw-brand .dmw-logo'),a=m.getBoundingClientRect(),b=t&&t.getBoundingClientRect();
if(b&&b.width){m.style.transform='translate('+(b.left-a.left).toFixed(1)+'px,'+(b.top-a.top).toFixed(1)+'px) scale('+(b.width/a.width).toFixed(4)+')';
T(function(){t.style.opacity='1';m.style.opacity='0'},550)}else{m.style.opacity='0'}
d.classList.add('out');T(fin,850)}
var img=d.querySelector('.mk');var ab=setTimeout(skip,1200);ts.push(ab);
img.onload=function(){if(done)return;clearTimeout(ab);d.classList.add('go');T(fly,2050)};img.onerror=skip;img.fetchPriority='high';img.src='/logo-intro.webp';
['click','keydown','wheel','touchstart'].forEach(function(e){addEventListener(e,skip,{capture:true,passive:true})})})()</script>`;
}

export function waLink(cfg, texto, ubicacion, cls = '', extra = '') {
  const tel = cfg.site.phone.replace('+', '');
  const href = `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`;
  const c = cls ? ` class="${cls}"` : '';
  return `<a href="${href}" target="_blank" rel="noopener" data-wa-loc="${ubicacion}" data-wa-fixed${c}${extra}>`;
}

/**
 * Ajustes de <head> comunes a todas las páginas (rendimiento y SEO). Es
 * idempotente: tools/build.mjs lo aplica a cada .html y tools/pagina.mjs a las
 * páginas que genera, de modo que ambos caminos producen lo mismo.
 *
 *  - Iconos reales (SVG + PNG). El antiguo logo_damemiweb_icon.png (ya borrado) era un JPEG
 *    negro de 1248 px: pesaba y se veía como un cuadrado negro.
 *  - theme-color, manifest y og:site_name.
 *  - Google Analytics se descarga cuando la página ya ha cargado, sin competir
 *    con el pintado inicial. La cola dataLayer conserva todo lo anterior.
 */
export function cabeza(html) {
  const ICONOS = '<link rel="icon" href="/favicon.svg" type="image/svg+xml"/><link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png"/>';
  html = html.replace(/<link rel="icon" type="image\/png" href="(?:\/logo_damemiweb_icon\.png|data:image\/png;base64,[^"]*)"\/>/, ICONOS);
  html = html.replace(/<link rel="apple-touch-icon" href="\/logo_damemiweb_icon\.png"\/>/, '<link rel="apple-touch-icon" href="/apple-touch-icon.png"/>');
  html = html.replace(/https:\/\/www\.damemiweb\.com\/logo_damemiweb_icon\.png/g, 'https://www.damemiweb.com/icon-512.png');

  const viewport = /<meta name="viewport"[^>]*>/;
  if (!html.includes('name="theme-color"') && viewport.test(html)) {
    html = html.replace(viewport, m => `${m}\n<meta name="theme-color" content="#0E0E0E"/>`);
  }
  if (!html.includes('rel="manifest"') && html.includes('name="theme-color"')) {
    html = html.replace(/<meta name="theme-color"[^>]*>/, m => `${m}\n<link rel="manifest" href="/site.webmanifest"/>`);
  }
  if (!html.includes('og:site_name')) {
    html = html.replace(/<meta property="og:type"[^>]*>/, m => `<meta property="og:site_name" content="Dame mi web"/>\n${m}`);
  }

  html = html.replace(/<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=([A-Z0-9-]+)"><\/script>/,
    (_, id) => `<script>addEventListener('load',function(){(window.requestIdleCallback||setTimeout)(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${id}';document.head.appendChild(s)})})</script>`);

  // Prefetch especulativo: al apuntar a un enlace interno el navegador trae el
  // HTML a la caché y la navegación es casi instantánea. Solo prefetch, nunca
  // prerender: un prerender ejecutaría el JS de la página (analítica incluida)
  // en visitas que quizá no ocurren. Los navegadores sin soporte lo ignoran.
  if (!html.includes('type="speculationrules"')) {
    html = html.replace(/<\/head>/i,
      '<script type="speculationrules">{"prefetch":[{"where":{"href_matches":"/*"},"eagerness":"moderate"}]}</script>\n</head>');
  }
  return html;
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
.dmw-brand .dmw-logo{width:60px;height:34px;display:block;flex-shrink:0}
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
.dmw-cta{position:relative;overflow:hidden;isolation:isolate;display:inline-flex;align-items:center;gap:7px;flex-shrink:0;background:#25D366;color:#fff!important;padding:10px 17px;border-radius:9px;font-size:14px;font-weight:600;text-decoration:none;white-space:nowrap;transition:background .2s,transform .2s,box-shadow .2s}
.dmw-cta:hover{background:#1EBE5A;transform:translateY(-1px);box-shadow:0 8px 24px rgba(37,211,102,.28)}
.dmw-cta::after{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.35) 50%,transparent 70%);transform:translateX(-120%);pointer-events:none}
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
/* Barra de progreso de lectura bajo la cabecera (CSS puro, scroll-driven). */
.dmw-progress{position:absolute;left:0;right:0;bottom:-1px;height:2px;overflow:hidden;pointer-events:none}
.dmw-progress::before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,#1347CC,#7FA3F5 55%,#25D366);transform-origin:0 50%;transform:scaleX(0)}
/* Movimiento del sitio. Todo lo vistoso vive aqui dentro, de modo que quien
   pide movimiento reducido no recibe nada de ello. */
@media(prefers-reduced-motion:no-preference){
  /* Transicion entre paginas (View Transitions entre documentos): la pagina
     saliente se desvanece hacia arriba y la entrante sube desenfocada. La
     cabecera lleva nombre propio para quedarse quieta durante el cambio. */
  @view-transition{navigation:auto}
  ::view-transition-old(root){animation:dmw-vt-out .26s cubic-bezier(.4,0,1,1) both}
  ::view-transition-new(root){animation:dmw-vt-in .55s cubic-bezier(.16,1,.3,1) both}
  .dmw-hd{view-transition-name:dmw-hd}
  ::view-transition-group(dmw-hd){animation-duration:0s}
  @keyframes dmw-vt-out{to{opacity:0;transform:translateY(-14px) scale(.985);filter:blur(4px)}}
  @keyframes dmw-vt-in{from{opacity:0;transform:translateY(26px) scale(1.01);filter:blur(6px)}}
  @supports(animation-timeline:scroll()){
    .dmw-progress::before{animation:dmw-prog linear both;animation-timeline:scroll(root block)}
  }
  @keyframes dmw-prog{to{transform:scaleX(1)}}
  .dmw-dd-panel:not([hidden]){animation:dmw-pop .24s cubic-bezier(.16,1,.3,1) both;transform-origin:top left}
  @keyframes dmw-pop{from{opacity:0;transform:translateY(-8px) scale(.97)}}
  .dmw-mob:not([hidden]){animation:dmw-fade .25s ease both}
  .dmw-mob:not([hidden])>*{animation:dmw-rise .5s cubic-bezier(.16,1,.3,1) both}
  .dmw-mob>:nth-child(2){animation-delay:.03s}.dmw-mob>:nth-child(3){animation-delay:.06s}.dmw-mob>:nth-child(4){animation-delay:.09s}
  .dmw-mob>:nth-child(5){animation-delay:.12s}.dmw-mob>:nth-child(6){animation-delay:.15s}.dmw-mob>:nth-child(7){animation-delay:.18s}.dmw-mob>:nth-child(8){animation-delay:.21s}
  .dmw-mob-panel:not([hidden]) a{animation:dmw-rise .4s cubic-bezier(.16,1,.3,1) both}
  @keyframes dmw-fade{from{opacity:0}}
  @keyframes dmw-rise{from{opacity:0;transform:translateY(14px)}}
  /* Destello periodico en el boton de WhatsApp */
  .dmw-cta::after{animation:dmw-shine 6s ease-in-out 2.5s infinite}
  @keyframes dmw-shine{0%,72%{transform:translateX(-120%)}88%,100%{transform:translateX(120%)}}
  /* Revelado al hacer scroll que dmw.js aplica a las paginas sin animacion
     propia. Sin JS la clase no existe y todo queda visible. */
  .dmw-rv{opacity:0;transform:translateY(28px);transition:opacity .8s cubic-bezier(.16,1,.3,1),transform .8s cubic-bezier(.16,1,.3,1);transition-delay:var(--dmw-d,0s)}
  .dmw-rv.dmw-on{opacity:1;transform:none}
}
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

  return `${intro()}
${headerCSS()}
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
  <span class="dmw-progress" aria-hidden="true"></span>
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
.dmw-ft-brand .dmw-logo{width:60px;height:34px;display:block;flex-shrink:0}
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
