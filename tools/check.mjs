#!/usr/bin/env node
/**
 * Comprobaciones finales de damemiweb.com.
 *
 *   node tools/check.mjs
 *
 * Falla (exit 1) si alguna comprobación no pasa:
 *  1. Greps que no deben devolver nada (restos de la oferta antigua, dominio
 *     sin www, marca mal escrita, etc.).
 *  2. Cada página: un único <h1> y un canonical con www.
 *  3. El sitemap no contiene URLs marcadas noindex y todas resuelven a un
 *     fichero real.
 *  4. Crawl local: ningún enlace interno roto.
 *  5. El sitio está al día respecto a site.config.json (build --check).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));

let fallos = 0;
const ok = m => console.log('  \x1b[32m✓\x1b[0m ' + m);
const mal = (m, detalle = []) => {
  fallos++;
  console.log('  \x1b[31m✗\x1b[0m ' + m);
  for (const d of detalle.slice(0, 12)) console.log('      ' + d);
  if (detalle.length > 12) console.log(`      … y ${detalle.length - 12} más`);
};

function ficheros(ext) {
  const out = [];
  const walk = dir => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      if (f.name === 'node_modules' || f.name === '.git' || f.name === 'fonts' || f.name === 'tools') continue;
      const p = path.join(dir, f.name);
      if (f.isDirectory()) walk(p);
      else if (!ext || ext.some(e => f.name.endsWith(e))) out.push(path.relative(ROOT, p));
    }
  };
  walk(ROOT);
  return out.sort();
}

const HTML = ficheros(['.html']);
const TEXTO = ficheros(['.html', '.xml', '.txt']);
const leer = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// --- 1. Greps que deben salir vacíos -----------------------------------------
console.log('\n1. Restos de la oferta antigua y del dominio sin www');

const PROHIBIDO = [
  { re: /https:\/\/damemiweb\.com/g, nombre: 'https://damemiweb.com', desc: 'dominio sin www' },
  { re: /(?<![\d.])32\+/g, nombre: '32+', desc: 'contador de proyectos antiguo "32+"' },
  { re: /\+32(?!\d)(?![\w])/g, nombre: '+32', desc: 'contador de proyectos antiguo "+32"' },
  { re: /30 días de soporte/g, nombre: '30 días de soporte', desc: 'soporte antiguo de 30 días' },
  // (?<!\d) evita que "30 – 120€/mes" de /precios cuente como "20€/mes"
  { re: /(?<!\d)20€\/mes/g, nombre: '20€/mes', desc: 'mantenimiento antiguo de 20€/mes' },
  { re: /250%E2%82%AC%20%2B%20IVA%2Fmes/g, nombre: '250%E2%82%AC%20%2B%20IVA%2Fmes', desc: 'WhatsApp de RRSS/campañas a 250€/mes' },
  { re: /DAME MI WEB/g, nombre: 'DAME MI WEB', desc: 'marca en mayúsculas' },
  { re: /dame miweb/gi, nombre: 'dame miweb', desc: 'marca mal escrita' },
  { re: /En tiempo real/g, nombre: 'En tiempo real', desc: 'etiqueta del ejemplo de ChatGPT' },
  { re: /entrenan a la IA/g, nombre: 'entrenan a la IA', desc: 'afirmación de que se entrena a la IA' }
];

/* Pendientes de decisión del cliente (Fase 4). No hacen fallar la comprobación:
   la instrucción era ejecutar solo las tareas marcadas con [x] y ninguna lo
   estaba. Se listan para que no se pierdan de vista. */
const DIFERIDO = [
  { re: /Ecosistema de\s*(?:<[^>]+>\s*)*Autoridad SEO/g, nombre: 'Ecosistema de Autoridad SEO',
    desc: 'red de sitios satélite enlazando al cliente: va contra las directrices de enlaces de Google' }
];

/** Una coincidencia dentro de una fuente en base64 no cuenta. */
const enBase64 = (txt, idx) => {
  const ini = Math.max(0, idx - 200);
  const trozo = txt.slice(ini, idx + 200);
  return /[A-Za-z0-9+/=]{120,}/.test(trozo);
};

for (const { re, nombre, desc } of PROHIBIDO) {
  const hits = [];
  for (const f of TEXTO) {
    const txt = leer(f);
    for (const m of txt.matchAll(re)) {
      if (enBase64(txt, m.index)) continue;
      const ctx = txt.slice(Math.max(0, m.index - 45), m.index + m[0].length + 45).replace(/\s+/g, ' ').trim();
      hits.push(`${f}: …${ctx}…`);
      break;
    }
  }
  hits.length ? mal(`"${nombre}" (${desc}): ${hits.length} ficheros`, hits) : ok(`"${nombre}" sin resultados`);
}

console.log('\n1b. Pendiente de decisión (Fase 4, no marcada con [x])');
for (const { re, nombre, desc } of DIFERIDO) {
  const hits = TEXTO.filter(f => re.test(leer(f)) && (re.lastIndex = 0, true));
  console.log(hits.length
    ? `  \x1b[33m·\x1b[0m "${nombre}" sigue en ${hits.length} fichero(s): ${desc}`
    : `  \x1b[32m✓\x1b[0m "${nombre}" ya no aparece`);
}

// --- 2. Un H1 por página y canonical con www ---------------------------------
console.log('\n2. Un único <h1> y canonical con www por página');

// Zonas privadas de cliente y página de error: no son contenido indexable, no
// llevan canonical y su interfaz no tiene por qué tener un <h1> de documento.
const PRIVADAS = new Set(['404.html', 'area-cliente.html', 'areacliente.html', 'onboarding.html']);
const malH1 = [], malCanon = [];
let revisadas = 0;
for (const f of HTML) {
  if (PRIVADAS.has(f)) continue;
  revisadas++;
  const txt = leer(f);
  const h1 = (txt.match(/<h1\b/gi) || []).length;
  if (h1 !== 1) malH1.push(`${f}: ${h1} <h1>`);
  const c = txt.match(/<link rel="canonical" href="([^"]+)"/i);
  if (!c) malCanon.push(`${f}: sin canonical`);
  else if (!c[1].startsWith(cfg.site.domain)) malCanon.push(`${f}: ${c[1]}`);
}
malH1.length ? mal(`${malH1.length} páginas sin exactamente un <h1>`, malH1) : ok(`${revisadas} páginas con un único <h1>`);
malCanon.length ? mal(`${malCanon.length} canonical incorrectos`, malCanon) : ok('todos los canonical apuntan a www');

// --- 3. Sitemap ---------------------------------------------------------------
console.log('\n3. Sitemap');

const sitemap = leer('sitemap.xml');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
const rutaAFichero = url => {
  const r = url.replace(cfg.site.domain, '') || '/';
  if (r === '/') return 'index.html';
  if (r === '/blog') return 'blog/index.html';
  return r.replace(/^\//, '') + '.html';
};
const sinFichero = [], conNoindex = [], sinWww = [];
for (const loc of locs) {
  if (!loc.startsWith(cfg.site.domain)) { sinWww.push(loc); continue; }
  const f = rutaAFichero(loc);
  if (!fs.existsSync(path.join(ROOT, f))) { sinFichero.push(`${loc} → ${f}`); continue; }
  const robots = leer(f).match(/<meta name="robots" content="([^"]*)"/i);
  if (robots && /noindex/i.test(robots[1])) conNoindex.push(`${loc} (${robots[1]})`);
}
sinWww.length ? mal(`${sinWww.length} URLs del sitemap sin www`, sinWww) : ok(`${locs.length} URLs, todas en ${cfg.site.domain}`);
sinFichero.length ? mal(`${sinFichero.length} URLs del sitemap sin fichero`, sinFichero) : ok('todas las URLs del sitemap existen');
conNoindex.length ? mal(`${conNoindex.length} URLs del sitemap con noindex`, conNoindex) : ok('ninguna URL del sitemap está en noindex');

const enSitemap = new Set(locs.map(rutaAFichero));
const robotsTxt = leer('robots.txt');
robotsTxt.includes(`Sitemap: ${cfg.site.domain}/sitemap.xml`)
  ? ok('robots.txt apunta al sitemap con www')
  : mal('robots.txt no apunta al sitemap con www');

// --- 4. Crawl local de enlaces internos ---------------------------------------
console.log('\n4. Enlaces internos');

const existe = ruta => {
  const limpio = ruta.split('#')[0].split('?')[0];
  if (limpio === '' || limpio === '/') return true;
  const base = limpio.replace(/^\//, '').replace(/\/$/, '');
  return ['', '.html', '/index.html'].some(suf => fs.existsSync(path.join(ROOT, base + suf)));
};

const rotos = [], anclasRotas = [];
for (const f of HTML) {
  const txt = leer(f);
  const ids = new Set([...txt.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const m of txt.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(href)) continue;
    if (href.startsWith('#')) {
      if (href.length > 1 && !ids.has(href.slice(1))) anclasRotas.push(`${f} → ${href}`);
      continue;
    }
    if (!href.startsWith('/')) continue;
    if (!existe(href)) rotos.push(`${f} → ${href}`);
    const anc = href.split('#')[1];
    if (anc) {
      const destino = href.split('#')[0].replace(/^\//, '') || 'index';
      const df = ['', '.html', '/index.html'].map(s => destino + s).find(p => fs.existsSync(path.join(ROOT, p)) && p.endsWith('.html'));
      if (df && !new RegExp(`id="${anc}"`).test(leer(df))) anclasRotas.push(`${f} → ${href}`);
    }
  }
}
rotos.length ? mal(`${rotos.length} enlaces internos rotos`, [...new Set(rotos)]) : ok('ningún enlace interno roto');
anclasRotas.length ? mal(`${anclasRotas.length} anclas rotas`, [...new Set(anclasRotas)]) : ok('ninguna ancla rota');

// --- 5. Sitio al día respecto a la config -------------------------------------
console.log('\n5. Sincronía con site.config.json');
const { execSync } = await import('node:child_process');
try {
  execSync('node tools/build.mjs --check', { cwd: ROOT, stdio: 'pipe' });
  ok('el sitio está regenerado con la config actual');
} catch (e) {
  mal('hay ficheros desactualizados: ejecuta `node tools/build.mjs`', String(e.stdout || '').trim().split('\n'));
}

console.log(fallos ? `\n\x1b[31m${fallos} comprobaciones fallidas\x1b[0m\n` : '\n\x1b[32mTodas las comprobaciones pasan\x1b[0m\n');
process.exit(fallos ? 1 : 0);
