#!/usr/bin/env node
/**
 * Generador del sitio damemiweb.com.
 *
 * El repositorio ES el artefacto que despliega Cloudflare Pages: no hay paso de
 * compilación en el hosting. Por eso este script reescribe los .html EN EL SITIO
 * y el resultado se commitea. Es idempotente: ejecutarlo dos veces da el mismo
 * árbol.
 *
 *   node tools/build.mjs          reescribe todo el sitio desde site.config.json
 *   node tools/build.mjs --check  no escribe; falla si algo está desactualizado
 *
 * Fuente única de valores: site.config.json. Ninguna plantilla debe repetir a
 * mano un precio, un contador de proyectos, una valoración ni un plazo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { header, footer, waLink } from './partials.mjs';
import { icon } from './icons.mjs';
import { SECTORES, CIUDADES, CATEGORIAS_PROYECTOS } from './data.mjs';
import * as nuevas from './paginas-nuevas.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHECK = process.argv.includes('--check');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));

/* Páginas que no llevan la cabecera/pie públicos: son zonas privadas de cliente
   (bloqueadas en robots.txt) con su propia interfaz de aplicación. */
const SIN_CHROME = new Set(['area-cliente.html', 'areacliente.html', 'onboarding.html']);
/* Fuera del sitemap: privadas, de error o sin valor de búsqueda propio. */
const NO_INDEXABLES = new Set(['404.html', 'area-cliente.html', 'areacliente.html', 'onboarding.html']);

const cambios = [];
const avisos = [];

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function listarHtml() {
  const out = [];
  for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) out.push(f);
  for (const f of fs.readdirSync(path.join(ROOT, 'blog'))) if (f.endsWith('.html')) out.push('blog/' + f);
  return out.sort();
}

/** Ruta pública canónica de un fichero: index.html -> /, blog/x.html -> /blog/x */
export function rutaDe(file) {
  if (file === 'index.html') return '/';
  if (file === 'blog/index.html') return '/blog';
  return '/' + file.replace(/\.html$/, '');
}

export function urlDe(file) {
  const r = rutaDe(file);
  return cfg.site.domain + (r === '/' ? '/' : r);
}

/** Encuentra el cierre de la etiqueta `tag` que corresponde a la apertura en `from`. */
function bloque(html, tag, from) {
  const abre = new RegExp(`<${tag}\\b`, 'gi');
  const cierra = new RegExp(`</${tag}\\s*>`, 'gi');
  let depth = 0, i = from;
  while (i < html.length) {
    abre.lastIndex = i; cierra.lastIndex = i;
    const a = abre.exec(html), c = cierra.exec(html);
    if (!c) return null;
    if (a && a.index < c.index) { depth++; i = a.index + 1; }
    else { depth--; i = c.index + 1; if (depth === 0) return c.index + c[0].length; }
  }
  return null;
}

// ---------------------------------------------------------------------------
// FASE 3 — Cabecera y pie comunes
// ---------------------------------------------------------------------------

function inyectarChrome(html, file) {
  if (SIN_CHROME.has(file)) return html;
  const HD = header(cfg), FT = footer(cfg);

  // Cabecera
  if (html.includes('<!--dmw:header-->')) {
    html = html.replace(/<!--dmw:header-->[\s\S]*?<!--\/dmw:header-->/, `<!--dmw:header-->${HD}<!--/dmw:header-->`);
  } else {
    const i = html.search(/<nav\b/i);
    if (i === -1) { avisos.push(`${file}: sin <nav>, cabecera añadida tras <body>`); }
    if (i !== -1) {
      let fin = bloque(html, 'nav', i);
      // index.html arrastra su menú móvil en un div hermano
      const mob = html.slice(fin).match(/^\s*<div class="mob" id="mob">/);
      if (mob) fin = bloque(html, 'div', fin + mob[0].indexOf('<div'));
      html = html.slice(0, i) + `<!--dmw:header-->${HD}<!--/dmw:header-->` + html.slice(fin);
    } else {
      html = html.replace(/<body[^>]*>/i, m => `${m}\n<!--dmw:header-->${HD}<!--/dmw:header-->`);
    }
  }

  // Pie
  if (html.includes('<!--dmw:footer-->')) {
    html = html.replace(/<!--dmw:footer-->[\s\S]*?<!--\/dmw:footer-->/, `<!--dmw:footer-->${FT}<!--/dmw:footer-->`);
  } else {
    const i = html.search(/<footer\b/i);
    if (i !== -1) {
      const fin = bloque(html, 'footer', i);
      html = html.slice(0, i) + `<!--dmw:footer-->${FT}<!--/dmw:footer-->` + html.slice(fin);
    } else {
      // Los artículos del blog no tenían pie: se añade antes del primer <script> final
      html = html.replace(/(\n<script\b[^>]*>(?:(?!<\/script>)[\s\S])*<\/script>\s*)*<\/body>/i,
        m => `<!--dmw:footer-->${FT}<!--/dmw:footer-->\n` + m);
    }
  }
  return html;
}

/** Comportamiento de la cabecera: desplegables y menú móvil. */
function inyectarScriptChrome(html, file) {
  if (SIN_CHROME.has(file)) return html;
  if (!/src="\/dmw\.js"/.test(html)) {
    html = html.replace(/<\/body>/i, '<script src="/dmw.js" defer></script>\n</body>');
  }
  return html;
}

// ---------------------------------------------------------------------------
// FASE 1 — URLs canónicas con www y criterio único de barra final
// ---------------------------------------------------------------------------

function canonicalizarDominio(txt) {
  // Todo el sitio se sirve en www: canonical, og:url, og:image, twitter:image,
  // JSON-LD (@id, url, item, logo, image) y sitemap.
  return txt
    .replace(/https:\/\/damemiweb\.com/g, cfg.site.domain)
    .replace(/https:\/\/www\.www\./g, 'https://www.');
}

function canonicalDePagina(html, file) {
  const url = urlDe(file);
  const og = cfg.site.domain + '/og-image.jpg';

  const set = (re, valor) => { html = html.replace(re, valor); };
  set(/(<link rel="canonical" href=")[^"]*(")/i, `$1${url}$2`);
  set(/(<meta property="og:url" content=")[^"]*(")/i, `$1${url}$2`);
  set(/(<meta property="og:image" content=")https?:\/\/[^"]*og-image\.jpg(")/i, `$1${og}$2`);
  set(/(<meta name="twitter:image" content=")https?:\/\/[^"]*og-image\.jpg(")/i, `$1${og}$2`);

  if (!/rel="canonical"/i.test(html) && !NO_INDEXABLES.has(file)) {
    html = html.replace(/<\/title>/i, `</title>\n<link rel="canonical" href="${url}"/>`);
  }
  return html;
}

// ---------------------------------------------------------------------------
// FASE 1 — Valores oficiales en textos y JSON-LD
// ---------------------------------------------------------------------------

function valoresOficiales(html) {
  const R = cfg.resenas, P = cfg.proyectos;

  // --- JSON-LD: valoración y número de reseñas ---
  html = html.replace(/"aggregateRating":\{[^{}]*\}/g, m => m
    .replace(/"ratingValue":"[^"]*"/, `"ratingValue":"${R.ratingValue}"`)
    .replace(/"bestRating":"[^"]*"/, `"bestRating":"${R.bestRating}"`)
    .replace(/"reviewCount":"[^"]*"/, `"reviewCount":"${R.count}"`));
  html = html.replace(/("aggregateRating":\s*\{[\s\S]{0,400}?"reviewCount":\s*")\d+(")/g, `$1${R.count}$2`);

  // --- Reseñas en texto: "5.0 · 91+ reseñas", "5,0 · 83 reseñas", "91+ reseñas" ---
  html = html.replace(/\b5[.,]0\s*·\s*\d+\+?\s*reseñas/g, R.displayShort);
  html = html.replace(/\b\d+\+\s*reseñas/g, `${R.count} reseñas`);
  html = html.replace(/5 sobre 5 con \d+ /g, `5 sobre 5 con ${R.count} `);

  // --- Proyectos: la cifra oficial es una sola ---
  // Barras de estadísticas: "32+" y "91+" sueltos pasan al formato oficial "+91".
  // El patrón exige que el número ocupe el elemento entero para no tocar
  // cadenas codificadas en base64 (fuentes incrustadas) que contienen "91+".
  html = html.replace(/>(?:32|91)\+</g, `>${P.display}<`);
  html = html.replace(/\b32\+\s*(?=<)/g, P.display);
  html = html.replace(/\+32 webs/g, `${P.display} webs`);
  html = html.replace(/\b91\+ (proyectos|clientes|negocios|webs)/g, `${P.display} $1`);
  html = html.replace(/más de 91\b/gi, m => m[0] === 'M' ? `Más de ${P.count}` : `más de ${P.count}`);

  // --- Soporte: 12 meses incluidos, sin mantenimiento obligatorio ---
  html = html.replace(/30 días de soporte/g, cfg.soporte.displayShort);
  html = html.replace(/Cambios de texto e imágenes sin coste el primer mes\. Mantenimiento desde 20€\/mes a partir del segundo\./g,
    `Cambios de contenido y mantenimiento incluidos durante ${cfg.soporte.meses} meses. Después no hay mantenimiento obligatorio.`);
  html = html.replace(/Mantenimiento desde 20€\/mes[^<.]*\./g, 'Después no hay mantenimiento obligatorio.');
  html = html.replace(/(?<!\d)(?:puedes contratarnos )?mantenimiento mensual desde 20€\/mes\./g,
    `el mantenimiento va incluido durante ${cfg.soporte.meses} meses y después no es obligatorio.`);

  // --- Dominio ---
  html = html.replace(/Tu dominio \.com o \.es el primer año sin coste extra\./g,
    'Tu dominio .com incluido el primer año sin coste extra.');
  html = html.replace(/dominio \.com o \.es el primer año/g, 'dominio .com el primer año');
  html = html.replace(/<h3>Dominio \.com o \.es incluido<\/h3>/g, '<h3>Dominio .com incluido</h3>');

  // --- Mensajes de WhatsApp de RRSS y campañas: eran 250€/mes ---
  html = html.replace(/gesti%C3%B3n%20de%20RRSS%20por%20250%E2%82%AC/g, `gesti%C3%B3n%20de%20RRSS%20por%20${cfg.rrss.priceAmount}%E2%82%AC`);
  html = html.replace(/campa%C3%B1as%20de%20pago%20desde%20250%E2%82%AC/g, `campa%C3%B1as%20de%20pago%20desde%20${cfg.campanas.priceAmount}%E2%82%AC`);

  // --- Fecha de "Datos actualizados el…" ---
  const f = new Date(cfg.site.lastUpdated + 'T00:00:00Z');
  const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const legible = `${f.getUTCDate()} de ${MESES[f.getUTCMonth()]} de ${f.getUTCFullYear()}`;
  html = html.replace(/Datos actualizados el <time datetime="[^"]*">[^<]*<\/time>/g,
    `Datos actualizados el <time datetime="${cfg.site.lastUpdated}">${legible}</time>`);

  return html;
}

// ---------------------------------------------------------------------------
// FASE 2 — Title, description y H1 de la home desde la config
// ---------------------------------------------------------------------------

function metasHome(html, file) {
  if (file !== 'index.html') return html;
  const { title, description, h1 } = cfg.home;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`);
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`);

  // JSON-LD de la WebPage de la home
  html = html.replace(/("@id":"[^"]*#webpage","url":"[^"]*","name":")[^"]*(","description":")[^"]*(")/,
    `$1${title}$2${description}$3`);

  // El H1 es estático y sale de la config. Se conserva el resaltado del precio.
  const precio = `${cfg.web.price}, pago único`;
  const h1html = h1.endsWith(precio)
    ? `${h1.slice(0, -precio.length)}<span class="hero-h-price">${precio}</span>`
    : h1;
  html = html.replace(/<h1 class="hero-h">[\s\S]*?<\/h1>/, `<h1 class="hero-h">${h1html}</h1>`);
  return html;
}

// ---------------------------------------------------------------------------
// FASE 2 — Coherencia con lo que promete /sobre-nosotros
// ---------------------------------------------------------------------------

/**
 * /sobre-nosotros dice, negro sobre blanco, que "no prometemos primeras
 * posiciones en Google". Las páginas de ciudad decían lo contrario:
 * posicionamiento local "desde el primer día" y la web apareciendo cuando
 * alguien del barrio busca. Aquí se alinean las dos.
 */
function promesasRealistas(html) {
  // "Tu web aparece cuando alguien en X, Y o Z busca tu servicio en Google.
  //  Posicionamiento local en C desde el primer día."
  html = html.replace(
    /Tu web aparece cuando alguien en ([^.]+?) busca tu servicio en Google\. Posicionamiento local en ([^.]+?) desde el primer día\./g,
    (m, zonas, ciudad) => `Preparamos tu web para las búsquedas de ${zonas} y del resto de ${ciudad}: contenido, etiquetas y datos estructurados mencionan tu zona de servicio. El posicionamiento orgánico depende de tu sector y tu competencia, y lleva tiempo.`);

  // "Sin mensualidades, sin renovaciones obligatorias, sin letra pequeña.
  //  Tu web, tu dominio, para siempre."
  html = html.replace(
    /Sin mensualidades, sin renovaciones obligatorias, sin letra pequeña\. Tu web, tu dominio, para siempre\./g,
    `Sin mensualidades y sin mantenimiento obligatorio. La web y el dominio quedan a tu nombre; a partir del segundo año solo se paga la renovación del dominio, ${cfg.dominio.renovacion}.`);

  // Encabezado de la misma tarjeta
  html = html.replace(/<h3>SEO local para ([^<]+)<\/h3>/g, '<h3>SEO local para $1</h3>');
  return html;
}

/**
 * Caja de ejemplo de respuesta de ChatGPT.
 * Era una maqueta estática presentada como si fuese una consulta en vivo, y
 * describía el servicio como "entrenar a la IA", que no es lo que ocurre.
 */
function cajaChatGPT(html) {
  html = html.replace(/ChatGPT · En tiempo real/g, 'ChatGPT · Ejemplo ilustrativo');
  html = html.replace(/(<div class="geo-mock-bar">)(<span class="geo-blink"><\/span>)?ChatGPT · Ejemplo ilustrativo(<\/div>)/g,
    '$1ChatGPT · <span style="display:inline-block;font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#EAB308;background:rgba(234,179,8,.12);border:1px solid rgba(234,179,8,.3);border-radius:100px;padding:2px 9px;vertical-align:middle">Ejemplo ilustrativo</span>$3');
  html = html.replace(
    /(\d+ (?:propiedades digitales|art[íi]culos)[^.]*?)entrenan a la IA para que cite tu marca/g,
    '$1publican contenido para que los asistentes de IA con búsqueda encuentren y citen tu marca');
  html = html.replace(/entrenan a la IA para que cite tu marca/g,
    'publican contenido para que los asistentes de IA con búsqueda encuentren y citen tu marca');
  return html;
}

// ---------------------------------------------------------------------------
// FASE 2 — Marca siempre "Dame mi web"
// ---------------------------------------------------------------------------

function marca(html) {
  return html
    .replace(/DAME MI WEB/g, cfg.site.brand)
    .replace(/\bdame miweb\b/gi, cfg.site.brand)
    .replace(/\bdame mi web\b(?![.\w])/g, m => m) // no tocar el uso en minúscula dentro de frases
    .replace(/>dame mi <span/g, '>Dame mi <span');
}

// ---------------------------------------------------------------------------
// Escritura
// ---------------------------------------------------------------------------

const pendientes = new Map();

export function escribir(rel, contenido) {
  const abs = path.join(ROOT, rel);
  const antes = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null;
  if (antes === contenido) return false;
  pendientes.set(rel, contenido);
  cambios.push(rel);
  return true;
}

export { cfg, ROOT, CHECK, listarHtml, canonicalizarDominio, canonicalDePagina, valoresOficiales, marca, inyectarChrome, inyectarScriptChrome, avisos, cambios, pendientes, NO_INDEXABLES, SIN_CHROME, bloque };

// ---------------------------------------------------------------------------
// FASE 3 — Analítica: evento contacto_whatsapp con la ubicación del enlace
// ---------------------------------------------------------------------------

/** Etiqueta de ubicación por defecto según la familia de la página. */
function familia(file) {
  if (file === 'index.html') return 'home';
  if (file.startsWith('blog/')) return 'blog';
  if (file.startsWith('diseno-web-')) return 'ciudad';
  if (/^web-[a-z-]+-[a-z-]+\.html$/.test(file) && SECTORES.some(s => file.startsWith(s.slug + '-'))) return 'sector_ciudad';
  if (file.startsWith('web-')) return 'sector';
  return file.replace(/\.html$/, '').replace(/-/g, '_');
}

/**
 * Marca cada enlace a wa.me con data-wa-loc. dmw.js lee ese atributo y envía a
 * GA4 el evento `contacto_whatsapp` con el parámetro `ubicacion`.
 */
function marcarWhatsApp(html, file) {
  const base = familia(file);
  return html.replace(/<a\b[^>]*href="[^"]*wa\.me[^"]*"[^>]*>/g, (tag, pos) => {
    if (/data-wa-loc=/.test(tag)) return tag;
    let loc = base;
    const antes = html.slice(0, pos);
    const sec = [...antes.matchAll(/<section[^>]*\bid="([^"]+)"/g)].pop();
    if (sec) loc = `${base}_${sec[1].replace(/-/g, '_')}`;
    else if (/class="[^"]*\b(waf|btn-hero|cta)\b/.test(tag)) loc = `${base}_cta`;
    return tag.replace(/<a\b/, `<a data-wa-loc="${loc}"`);
  });
}

// ---------------------------------------------------------------------------
// FASE 1 — Contadores de proyectos calculados desde /proyectos
// ---------------------------------------------------------------------------

/** Cuenta las tarjetas reales de cada bloque de proyectos.html. */
export function contarProyectos() {
  const html = fs.readFileSync(path.join(ROOT, 'proyectos.html'), 'utf8');
  const cuenta = new Map();
  const bloques = html.split('<div class="sect-block">').slice(1);
  for (const b of bloques) {
    const t = b.match(/<div class="sect-block-title">([^<]+)<\/div>/);
    if (!t) continue;
    cuenta.set(t[1].trim(), (b.match(/class="pcard"/g) || []).length);
  }
  return cuenta;
}

/** Reescribe los contadores visibles con la cifra real de cada bloque. */
function contadoresProyectos(html, file) {
  const cuenta = contarProyectos();

  if (file === 'proyectos.html') {
    return html.replace(/(<div class="sect-block-title">([^<]+)<\/div>\s*<div class="sect-block-count">)\d+( proyectos<\/div>)/g,
      (m, a, titulo, c) => a + (cuenta.get(titulo.trim()) ?? 0) + c);
  }

  if (file === 'index.html') {
    // Las tarjetas de sector de la home mostraban cifras inventadas
    // (13, 13, 8, 5, 11, 4). Salen del recuento real de /proyectos.
    return html.replace(
      /(<div class="sc-num"[^>]*>)(\d+)(<\/div>\s*<\/div>\s*<div class="sc-name">([^<]+)<\/div>)/g,
      (m, a, n, resto, nombre) => {
        const real = cuenta.get(nombre.trim());
        if (real === undefined) { avisos.push(`index.html: sin recuento para la tarjeta "${nombre.trim()}"`); return m; }
        return a + real + resto;
      });
  }
  return html;
}

// ---------------------------------------------------------------------------
// FASE 1 — Enlaces de sector en las páginas de ciudad
// ---------------------------------------------------------------------------

/**
 * En las páginas de ciudad, la lista "Web para tu sector" prometía
 * "Fontaneros en Madrid" pero enlazaba a la página genérica /web-fontaneros.
 *
 * Ahora: si existe /web-[sector]-[ciudad] se enlaza ahí y se mantiene el texto
 * con ciudad; si no existe, el texto pasa a "Web para [sector]" para no
 * prometer una página local que no hay.
 */
function enlacesSectorCiudad(html, file) {
  const m = file.match(/^diseno-web-(.+)\.html$/);
  if (!m) return html;
  const ciudadSlug = m[1];
  const ciudad = CIUDADES.find(c => c.slug === 'diseno-web-' + ciudadSlug);
  if (!ciudad) return html;

  // Se retira el bloque de estilos generado en pasadas anteriores para que el
  // script sea idempotente.
  html = html.replace(/<style>\n\.sec-ciudad-row\{[\s\S]*?<\/style>/g, '');

  const marca = '<div style="display:flex;flex-direction:column;gap:8px;margin-top:16px">';
  const i = html.indexOf(marca);
  if (i === -1) return html;
  const fin = bloque(html, 'div', i);
  if (fin === null) return html;

  // Qué sectores se listaban en esta ciudad (se respeta la selección editorial).
  // Se compara contra los slugs conocidos, no con un patrón: "web-talleres-
  // mecanicos-madrid" no debe leerse como el sector "web-talleres".
  const trozo = html.slice(i, fin);
  const listados = SECTORES.filter(s =>
    trozo.includes(`href="/${s.slug}"`) || trozo.includes(`href="/${s.slug}-${ciudadSlug}"`));
  const sectores = listados.length ? listados : SECTORES.slice(0, 6);

  const filas = sectores.map(s => {
    const local = fs.existsSync(path.join(ROOT, `${s.slug}-${ciudadSlug}.html`));
    const href = local ? `/${s.slug}-${ciudadSlug}` : `/${s.slug}`;
    const texto = local ? `${s.label} en ${ciudad.label}` : `Web para ${s.label.toLowerCase()}`;
    return `        <a href="${href}" class="sec-ciudad-row">`
      + `<span class="sec-ciudad-ico">${icon(s.icon, { size: 19 })}</span>`
      + `<span><span class="sec-ciudad-n">${texto}</span><span class="sec-ciudad-l">Ver página →</span></span></a>`;
  }).join('\n');

  const css = `<style>
.sec-ciudad-row{display:flex;align-items:center;gap:12px;padding:14px 18px;background:#0d0d0d;border:1px solid var(--border,#1E1E1E);border-radius:10px;text-decoration:none;transition:border-color .15s}
.sec-ciudad-row:hover{border-color:#2563EB}
.sec-ciudad-ico{display:inline-flex;color:#7FA3F5;flex-shrink:0}
.sec-ciudad-n{display:block;font-size:14px;font-weight:500;color:var(--white,#fff)}
.sec-ciudad-l{display:block;font-size:11px;color:var(--blue,#2563EB);margin-top:2px}
</style>`;

  return html.slice(0, i) + css + marca + '\n' + filas + '\n      </div>' + html.slice(fin);
}

// ---------------------------------------------------------------------------
// FASE 1 — sitemap.xml y robots.txt
// ---------------------------------------------------------------------------

function esIndexable(file, html) {
  if (NO_INDEXABLES.has(file)) return false;
  const robots = html.match(/<meta name="robots" content="([^"]*)"/i);
  if (robots && /noindex/i.test(robots[1])) return false;
  return true;
}

function generarSitemap(paginas) {
  const prioridad = f => {
    if (f === 'index.html') return ['1.0', 'weekly'];
    if (['precios.html', 'proyectos.html', 'sectores.html', 'sobre-nosotros.html', 'preguntas-frecuentes.html', 'comparativa.html'].includes(f)) return ['0.9', 'monthly'];
    if (f === 'blog/index.html') return ['0.8', 'weekly'];
    if (f.startsWith('blog/')) return ['0.7', 'monthly'];
    if (f.startsWith('web-') || f.startsWith('diseno-web-')) return ['0.8', 'monthly'];
    return ['0.6', 'monthly'];
  };
  const urls = paginas.map(f => {
    const [p, cf] = prioridad(f);
    return `  <url><loc>${urlDe(f)}</loc><lastmod>${cfg.site.lastUpdated}</lastmod><changefreq>${cf}</changefreq><priority>${p}</priority></url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Generado por tools/build.mjs desde site.config.json. No editar a mano. -->
<!-- Solo URLs indexables y siempre en ${cfg.site.domain} -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;
}

function actualizarRobots() {
  const p = path.join(ROOT, 'robots.txt');
  let txt = canonicalizarDominio(fs.readFileSync(p, 'utf8'));
  txt = txt.replace(/^Sitemap:.*$/m, `Sitemap: ${cfg.site.domain}/sitemap.xml`);
  escribir('robots.txt', txt);
}

// ---------------------------------------------------------------------------
// dmw.js — bloques generados desde la config y el set de iconos
// ---------------------------------------------------------------------------

function actualizarDmwJs() {
  const p = path.join(ROOT, 'dmw.js');
  let js = fs.readFileSync(p, 'utf8');

  const conf = {
    ga4: cfg.site.ga4,
    phone: cfg.site.phone,
    price: cfg.web.price,
    priceFull: cfg.web.priceFull,
    entregaHoras: cfg.entrega.hours,
    proyectos: cfg.proyectos.count,
    resenas: cfg.resenas.count
  };
  const iconos = {};
  for (const n of ['menu', 'close', 'phone', 'whatsapp']) iconos[n] = icon(n, { size: 17 });

  js = js.replace(/(\/\* dmw:config[^\n]*\n)[\s\S]*?(\n\s*\/\* \/dmw:config \*\/)/,
    `$1  var CFG = ${JSON.stringify(conf)};$2`);
  js = js.replace(/(\/\* dmw:icons[^\n]*\n)[\s\S]*?(\n\s*\/\* \/dmw:icons \*\/)/,
    `$1  var ICON = ${JSON.stringify(iconos)};$2`);

  escribir('dmw.js', js);
}

// ---------------------------------------------------------------------------
// Páginas generadas y mapa de sector x ciudad
// ---------------------------------------------------------------------------

/** Qué combinaciones /web-[sector]-[ciudad] existen realmente en el repo. */
export function mapaSectorCiudad() {
  const m = new Map();
  for (const s of SECTORES) {
    const hay = CIUDADES.filter(c => {
      const ciudad = c.slug.replace(/^diseno-web-/, '');
      return fs.existsSync(path.join(ROOT, `${s.slug}-${ciudad}.html`));
    }).map(c => ({ slug: c.slug.replace(/^diseno-web-/, ''), label: c.label }));
    m.set(s.slug, hay);
  }
  return m;
}

function generarPaginas() {
  const sc = mapaSectorCiudad();
  escribir('sectores.html', nuevas.sectores(cfg, sc));
  escribir('auditorias.html', nuevas.auditorias(cfg));
  escribir('marketing.html', nuevas.marketing(cfg));
  escribir('aviso-legal.html', nuevas.avisoLegal(cfg));
  // Se escriben ya para que el bucle principal las procese como una más.
  // En --check no se toca el disco: basta con que `cambios` las delate.
  if (!CHECK) for (const [rel, c] of pendientes) fs.writeFileSync(path.join(ROOT, rel), c);
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

function main() {
  generarPaginas();
  const ficheros = listarHtml();
  const indexables = [];

  for (const file of ficheros) {
    const abs = path.join(ROOT, file);
    let html = fs.readFileSync(abs, 'utf8');

    html = canonicalizarDominio(html);
    html = canonicalDePagina(html, file);
    html = marca(html);
    html = metasHome(html, file);
    html = promesasRealistas(html);
    html = cajaChatGPT(html);
    html = valoresOficiales(html);
    html = contadoresProyectos(html, file);
    html = enlacesSectorCiudad(html, file);
    html = inyectarChrome(html, file);
    html = inyectarScriptChrome(html, file);
    html = marcarWhatsApp(html, file);

    escribir(file, html);
    if (esIndexable(file, html)) indexables.push(file);
  }

  actualizarDmwJs();
  escribir('sitemap.xml', generarSitemap(indexables));
  actualizarRobots();

  for (const rel of ['llms.txt', 'llms-full.txt', '_headers', '_redirects']) {
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs)) escribir(rel, canonicalizarDominio(fs.readFileSync(abs, 'utf8')));
  }

  if (CHECK) {
    if (cambios.length) {
      console.error(`✗ ${cambios.length} ficheros desactualizados respecto a site.config.json:`);
      for (const c of cambios.slice(0, 25)) console.error('   ' + c);
      process.exit(1);
    }
    console.log('✓ El sitio está al día con site.config.json');
    return;
  }

  for (const [rel, contenido] of pendientes) fs.writeFileSync(path.join(ROOT, rel), contenido);
  console.log(`✓ ${cambios.length} ficheros actualizados · ${indexables.length} URLs en el sitemap`);
  for (const a of avisos) console.log('  ! ' + a);
}

main();
