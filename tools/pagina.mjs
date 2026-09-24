/**
 * Plantilla base de las páginas generadas (/sectores, /auditorias, /marketing,
 * /aviso-legal). Comparte paleta, tipografía y estructura con el resto del
 * sitio y deja los huecos de cabecera y pie para tools/build.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { header, footer, gtagSnippet } from './partials.mjs';

const FONTS = fs.readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'partials', 'fonts.css'), 'utf8');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const BASE_CSS = `*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{--navy:#0E0E0E;--navy2:#1C1C1C;--blue:#1347CC;--bright:#7FA3F5;--white:#FFF;--off:#F6F3EE;--mist:#8A8A8A;--line:#242424;--serif:'Fraunces',Georgia,serif;--sans:'DM Sans',system-ui,-apple-system,sans-serif}
html{scroll-behavior:smooth}
body{font-family:var(--sans);background:var(--navy);color:var(--white);-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
.w{max-width:1180px;margin:0 auto;padding:0 24px}
.pg-hero{padding:72px 0 48px;border-bottom:1px solid var(--line)}
.pg-eyebrow{font-size:11px;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:var(--bright);margin-bottom:12px}
h1{font-family:var(--serif);font-size:clamp(30px,4.4vw,50px);font-weight:400;letter-spacing:-.02em;line-height:1.08;margin:0 0 18px}
h1 em{font-style:italic;color:var(--bright)}
.pg-lead{font-size:17px;font-weight:300;line-height:1.75;color:rgba(255,255,255,.62);max-width:660px}
.pg-sec{padding:56px 0}
.pg-sec+.pg-sec{border-top:1px solid var(--line)}
h2{font-family:var(--serif);font-size:clamp(23px,3vw,34px);font-weight:400;letter-spacing:-.015em;line-height:1.15;margin:0 0 8px}
h2 em{font-style:italic;color:var(--bright)}
h3{font-family:var(--sans);font-size:17px;font-weight:600;color:var(--white);margin:0 0 8px}
.pg-sub{font-size:15px;font-weight:300;color:var(--mist);line-height:1.7;margin:0 0 28px;max-width:640px}
p{line-height:1.75}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(258px,1fr));gap:14px}
.card{display:block;background:#141414;border:1px solid var(--line);border-radius:14px;padding:22px;transition:border-color .15s,transform .15s}
a.card:hover{border-color:var(--bright);transform:translateY(-2px)}
.card-ico{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:11px;background:rgba(127,163,245,.12);color:var(--bright);margin-bottom:14px}
.card p{font-size:14px;font-weight:300;color:var(--mist);margin:0}
.card:hover{border-color:#3a3a3a}
.card-title-link{display:block}
.card-title-link:hover{color:var(--bright)}
.card-ciudades{margin-top:10px;font-size:13px;color:rgba(255,255,255,.42);line-height:1.7}
.card-ciudades a{color:rgba(255,255,255,.62);text-decoration:underline;text-underline-offset:2px}
.card-ciudades a:hover{color:var(--bright)}
.card-link{display:inline-flex;align-items:center;gap:6px;margin-top:14px;font-size:13px;font-weight:500;color:var(--bright)}
.card-link:hover{gap:9px}
.card a:focus-visible,.chip:focus-visible,.btn:focus-visible{outline:2px solid var(--bright);outline-offset:3px}
.chips{display:flex;flex-wrap:wrap;gap:9px}
.chip{font-size:14px;color:rgba(255,255,255,.72);background:rgba(255,255,255,.04);border:1px solid var(--line);border-radius:100px;padding:9px 18px;transition:all .15s}
a.chip:hover{border-color:var(--bright);color:var(--bright)}
.price{display:flex;align-items:baseline;gap:9px;margin:4px 0 14px}
.price b{font-family:var(--serif);font-size:34px;font-weight:400;color:var(--white)}
.price span{font-size:13px;color:var(--mist)}
ul.feat{list-style:none;display:flex;flex-direction:column;gap:9px;margin:0 0 20px}
ul.feat li{display:flex;gap:9px;font-size:14px;font-weight:300;color:rgba(255,255,255,.66);line-height:1.6}
ul.feat li svg{flex-shrink:0;color:var(--bright);margin-top:2px}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#25D366;color:#fff;padding:13px 24px;border-radius:10px;font-size:15px;font-weight:600;transition:opacity .15s}
.btn:hover{opacity:.88}
.btn-alt{background:var(--blue)}
.prose{max-width:760px}
.prose h2{margin-top:36px}
.prose p,.prose li{font-size:15px;font-weight:300;color:rgba(255,255,255,.66);line-height:1.8}
.prose ul{margin:0 0 16px 20px}
.prose a{color:var(--bright);text-decoration:underline}
.todo{border:1px dashed #6b5a1f;background:rgba(234,179,8,.07);border-radius:12px;padding:18px 20px;margin:16px 0}
.todo b{display:block;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#EAB308;margin-bottom:6px}
.todo p{font-size:14px;color:rgba(255,255,255,.6);margin:0}
@media(max-width:620px){.pg-hero{padding:48px 0 36px}.pg-sec{padding:40px 0}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}a.card:hover{transform:none}}`;

export function pagina(cfg, { titulo, descripcion, ruta, robots, jsonld, cuerpo }) {
  const url = cfg.site.domain + ruta;
  const og = cfg.site.domain + '/og-image.jpg';
  const ld = jsonld ? `\n<script type="application/ld+json">${JSON.stringify(jsonld)}</script>` : '';
  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<link rel="icon" type="image/png" href="/logo_damemiweb_icon.png"/>
<link rel="apple-touch-icon" href="/logo_damemiweb_icon.png"/>
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descripcion)}"/>
<meta name="robots" content="${robots || 'index, follow, max-snippet:-1, max-image-preview:large'}"/>
<link rel="canonical" href="${url}"/>
<meta property="og:title" content="${esc(titulo)}"/>
<meta property="og:description" content="${esc(descripcion)}"/>
<meta property="og:type" content="website"/>
<meta property="og:url" content="${url}"/>
<meta property="og:locale" content="es_ES"/>
<meta property="og:image" content="${og}"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="${og}"/>
<script async src="https://www.googletagmanager.com/gtag/js?id=${cfg.site.ga4}"></script>
${gtagSnippet(cfg)}${ld}
<link rel="preload" as="font" type="font/woff2" href="/fonts/fraunces-normal-latin.woff2" crossorigin/>
<link rel="preload" as="font" type="font/woff2" href="/fonts/dmsans-normal-latin.woff2" crossorigin/>
<style>${FONTS}</style>
<style>${BASE_CSS}</style>
</head>
<body>
<!--dmw:header-->${header(cfg)}<!--/dmw:header-->
${cuerpo}
<!--dmw:footer-->${footer(cfg)}<!--/dmw:footer-->
<script src="/dmw.js" defer></script>
</body>
</html>
`;
}
