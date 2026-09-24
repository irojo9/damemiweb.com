/**
 * FASE 3 — Rejilla de portfolio de la home (id="portfolio").
 *
 * Las webs salen de proyectos-data.mjs (lo mismo que /proyectos): son clientes reales, con su nombre y su URL
 * tal y como figuran allí. No se inventa ninguna.
 *
 * Capturas: el repositorio no tiene ninguna todavía. Mientras el fichero
 * /proyectos-capturas/<dominio>.jpg no exista, cada tarjeta enseña un marcador
 * con el dominio y deja un TODO. En cuanto la captura se suba a esa carpeta y
 * se ejecute `node tools/build.mjs`, la tarjeta pasa a mostrar la imagen con
 * loading="lazy", width, height y alt descriptivo.
 */
import fs from 'node:fs';
import path from 'node:path';
import { PORTFOLIO } from './proyectos-data.mjs';

export const DIR_CAPTURAS = 'proyectos-capturas';
export const ANCHO = 640;
export const ALTO = 400;

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Bloques de /proyectos: [{ sector, proyectos:[{nombre,url}] }], desde proyectos-data.mjs */
export function leerProyectos() {
  return PORTFOLIO.map(c => ({
    sector: c.key,
    proyectos: c.subs.flatMap(s => s.webs.map(([url, nombre]) => ({ url, nombre })))
  }));
}

/** Selección estable: las primeras de cada bloque, repartidas hasta llegar a n. */
export function seleccion(bloques, n = 9) {
  const fuera = /autoridadgeo/i;             // marca propia, no es cliente
  const colas = bloques.map(b => ({ sector: b.sector, resto: b.proyectos.filter(p => !fuera.test(p.url)) }));
  const out = [];
  for (let ronda = 0; out.length < n; ronda++) {
    let algo = false;
    for (const c of colas) {
      if (out.length >= n) break;
      const p = c.resto[ronda];
      if (!p) continue;
      out.push({ ...p, sector: c.sector });
      algo = true;
    }
    if (!algo) break;
  }
  return out;
}

const dominio = url => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

export function tarjetas(root, items) {
  return items.map(p => {
    const dom = dominio(p.url);
    const captura = path.join(root, DIR_CAPTURAS, dom + '.jpg');
    const alt = `Captura de la página web de ${p.nombre}, ${p.sector.toLowerCase()}`;
    const medio = fs.existsSync(captura)
      ? `<img src="/${DIR_CAPTURAS}/${dom}.jpg" alt="${esc(alt)}" width="${ANCHO}" height="${ALTO}" loading="lazy" decoding="async"/>`
      : `<!-- TODO: falta la captura de ${dom}. Subir /${DIR_CAPTURAS}/${dom}.jpg (${ANCHO}x${ALTO}) y ejecutar \`node tools/build.mjs\`: la tarjeta pasara a mostrar <img loading="lazy" width="${ANCHO}" height="${ALTO}" alt="${esc(alt)}"> automaticamente. -->
          <div class="pf-todo" role="img" aria-label="${esc(`Pendiente de captura de la web de ${p.nombre}`)}"><span>${esc(dom)}</span><small>Captura pendiente</small></div>`;
    return `      <a href="${p.url}" target="_blank" rel="noopener" class="pf-card">
        <span class="pf-shot">${medio}</span>
        <span class="pf-body">
          <span class="pf-name">${esc(p.nombre)}</span>
          <span class="pf-sector">${esc(p.sector)}</span>
        </span>
        <span class="pf-go">Ver web <span aria-hidden="true">↗</span></span>
      </a>`;
  }).join('\n');
}

export function seccion(cfg, root) {
  const items = seleccion(leerProyectos(), 9);
  const total = leerProyectos().reduce((n, b) => n + b.proyectos.length, 0);
  return `<!-- PORTFOLIO — WEBS DE CLIENTES -->
<style>
#portfolio{padding:84px 0}
#portfolio .pf-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-bottom:36px}
#portfolio .pf-all{font-size:13px;font-weight:500;color:var(--bright);letter-spacing:.04em;white-space:nowrap}
.pf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:18px}
.pf-card{display:flex;flex-direction:column;background:var(--navy2);border:1px solid var(--line);border-radius:16px;overflow:hidden;transition:border-color .18s,transform .18s}
.pf-card:hover{border-color:var(--bright);transform:translateY(-3px)}
.pf-shot{display:block;aspect-ratio:${ANCHO}/${ALTO};background:#111;overflow:hidden;max-width:100%}
.pf-shot img{width:100%;height:100%;object-fit:cover;object-position:top center}
.pf-todo{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;width:100%;height:100%;border-bottom:1px dashed #3a3a3a;background:repeating-linear-gradient(135deg,#141414,#141414 10px,#171717 10px,#171717 20px)}
.pf-todo span{font-size:14px;font-weight:500;color:rgba(255,255,255,.72);word-break:break-all;padding:0 14px;text-align:center}
.pf-todo small{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#EAB308}
.pf-body{display:block;padding:16px 18px 4px}
.pf-name{display:block;font-family:var(--serif);font-size:17px;font-weight:400;color:var(--white);letter-spacing:-.01em}
.pf-sector{display:block;margin-top:4px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--mist)}
.pf-go{display:block;padding:10px 18px 18px;font-size:13px;font-weight:500;color:var(--bright)}
@media(prefers-reduced-motion:reduce){.pf-card:hover{transform:none}}
</style>
<section id="portfolio">
  <div class="w">
    <div class="pf-head">
      <div>
        <div class="s-label rv">Trabajos reales</div>
        <h2 class="s-title rv">Webs que ya están <span class="it">online.</span></h2>
      </div>
      <a href="/proyectos" class="pf-all rv">Ver los ${total} proyectos →</a>
    </div>
    <div class="pf-grid rv">
${tarjetas(root, items)}
    </div>
  </div>
</section>`;
}

/** Franja "Otros servicios": las ofertas secundarias salen de la home. */
export function otrosServicios(cfg, icon) {
  const item = (href, ico, titulo, texto, externo) => `      <a href="${href}"${externo ? ' target="_blank" rel="noopener"' : ''} class="os-card">
        <span class="os-ico">${icon(ico, { size: 22 })}</span>
        <span class="os-t">${esc(titulo)}</span>
        <span class="os-d">${esc(texto)}</span>
      </a>`;
  return `<!-- OTROS SERVICIOS -->
<style>
#otros-servicios{padding:64px 0;border-top:1px solid var(--line)}
.os-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin-top:26px}
.os-card{display:block;background:var(--navy2);border:1px solid var(--line);border-radius:14px;padding:22px;transition:border-color .15s}
.os-card:hover{border-color:var(--bright)}
.os-ico{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:10px;background:rgba(127,163,245,.12);color:var(--bright);margin-bottom:14px}
.os-t{display:block;font-size:16px;font-weight:600;color:var(--white);margin-bottom:6px}
.os-d{display:block;font-size:14px;font-weight:300;color:var(--mist);line-height:1.65}
</style>
<section id="otros-servicios">
  <div class="w">
    <div class="s-label rv">Otros servicios</div>
    <h2 class="s-title rv" style="font-size:clamp(23px,3vw,34px)">Si necesitas <span class="it">algo más.</span></h2>
    <div class="os-grid rv">
${item('/auditorias', 'search', 'Auditorías', `Auditoría SEO por ${cfg.auditoriaSeo.priceFull} y auditoría de redes por ${cfg.auditoriaRrss.priceFull}. Informe PDF con plan de acción.`)}
${item('/marketing', 'chart', 'Marketing mensual', `Gestión de redes desde ${cfg.rrss.priceFull} y campañas de pago desde ${cfg.campanas.priceFull} de gestión. Sin permanencia.`)}
${item('https://www.autoridadgeo.com', 'sparkles', 'AutoridadGEO', 'Nuestro servicio hermano para que los asistentes de IA con búsqueda encuentren y citen tu marca.', true)}
    </div>
  </div>
</section>`;
}

/**
 * Listado completo de /proyectos, generado desde proyectos-data.mjs.
 * Conserva el marcado de siempre:
 * <div class="sect-block"> por categoría y <a class="pcard"> por web.
 */
export function listadoProyectos(PORTFOLIO) {
  const slug = t => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const subs = PORTFOLIO.flatMap(c => c.subs);
  const saltos = subs.map(s => `<a href="#${slug(s.nombre)}" class="filter-btn">${esc(s.nombre)} <span class="jump-n">${s.webs.length}</span></a>`).join('\n      ');
  const bloques = PORTFOLIO.map(c => {
    const total = c.subs.reduce((n, s) => n + s.webs.length, 0);
    const grupos = c.subs.map(s => `      <div class="sub-block" id="${slug(s.nombre)}">
        <div class="sub-head">
          <h2 class="sub-title">${esc(s.nombre)}</h2>
          <span class="sub-count">${s.webs.length} ${s.webs.length === 1 ? 'web' : 'webs'}</span>${s.landing ? `
          <a href="/${s.landing}" class="sub-link">Web para tu negocio →</a>` : ''}
        </div>
        <div class="proj-grid">
${s.webs.map(([url, nombre]) => `          <a href="${url}" target="_blank" rel="noopener" class="pcard"><span class="pcard-name">${esc(nombre)}</span><span class="pcard-arrow">↗</span></a>`).join('\n')}
        </div>
      </div>`).join('\n');
    return `    <!-- ${c.key.toUpperCase()} -->
    <div class="sect-block">
      <div class="sect-block-head">
        <div class="sect-dot" style="background:${c.color}"></div>
        <div class="sect-block-title">${esc(c.key)}</div>
        <div class="sect-block-count">${total} proyectos</div>
      </div>
${grupos}
    </div>`;
  }).join('\n\n');

  return `
<style>
.jump{padding:36px 0 0}
.jump .filters{padding:0;justify-content:flex-start}
.jump-n{font-size:11px;opacity:.6;margin-left:3px}
.sub-block{margin:0 0 28px;scroll-margin-top:90px}
.sub-head{display:flex;align-items:baseline;flex-wrap:wrap;gap:6px 14px;margin:0 0 12px}
.sub-title{font-family:var(--sans);font-size:14px;font-weight:600;color:var(--ink);letter-spacing:.01em}
.sub-count{font-size:12px;color:var(--mist)}
.sub-link{font-size:12px;font-weight:500;color:#1347CC;margin-left:auto}
.sub-link:hover{text-decoration:underline}
</style>
<div class="jump">
  <div class="w">
    <div class="filters" role="navigation" aria-label="Sectores del portfolio">
      ${saltos}
    </div>
  </div>
</div>
<section>
  <div class="w">

${bloques}

  </div>
</section>`;
}
