#!/usr/bin/env node
/**
 * Hace las capturas del portfolio de la home con Playwright (Chromium).
 *
 *   node tools/capturas.mjs            solo las que faltan
 *   node tools/capturas.mjs --forzar   las rehace todas (para refrescarlas)
 *   node tools/capturas.mjs --todas    todas las webs de /proyectos, no solo la home
 *
 * Guarda /proyectos-capturas/<dominio>.jpg a 640x400 (viewport 1280x800 a
 * escala 0,5) y después ejecuta build.mjs para que la home las muestre.
 * Necesita `npm i --no-save playwright && npx playwright install chromium`.
 * En GitHub lo hace el workflow .github/workflows/capturas.yml.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { leerProyectos, seleccion, dominio, DIR_CAPTURAS, ANCHO, ALTO } from './portfolio.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FORZAR = process.argv.includes('--forzar');
const TODAS = process.argv.includes('--todas');

const bloques = leerProyectos();
const webs = TODAS
  ? bloques.flatMap(b => b.proyectos).filter(p => !/autoridadgeo/i.test(p.url))
  : seleccion(bloques, 9);

const dir = path.join(ROOT, DIR_CAPTURAS);
fs.mkdirSync(dir, { recursive: true });

// Oculta los avisos de cookies más habituales para que no tapen la web.
const SIN_COOKIES = `
  #cookie-law-info-bar,.cky-consent-container,.cky-overlay,#cmplz-cookiebanner-container,
  .cmplz-cookiebanner,#moove_gdpr_cookie_info_bar,.cookie-notice-container,#cookie-notice,
  #CybotCookiebotDialog,#onetrust-banner-sdk,.cc-window,.cc-banner,#cookiescript_injected,
  .borlabs-cookie,#BorlabsCookieBox,[id*="cookie-banner"],[class*="cookie-banner"],
  #wpcc-container,.wpcc-container,.gdpr-cookie-notice{display:none!important}
  html,body{overflow:hidden!important}`;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: ANCHO * 2, height: ALTO * 2 },
  deviceScaleFactor: 0.5,
  locale: 'es-ES',
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'
});

let hechas = 0, fallos = 0;
for (const p of webs) {
  const dom = dominio(p.url);
  const destino = path.join(dir, dom + '.jpg');
  if (!FORZAR && fs.existsSync(destino)) { console.log(`  = ${dom} (ya existe)`); continue; }
  const page = await ctx.newPage();
  try {
    await page.goto(p.url, { waitUntil: 'load', timeout: 45000 });
    await page.addStyleTag({ content: SIN_COOKIES }).catch(() => {});
    await page.waitForTimeout(2500);               // animaciones de entrada y lazy-load
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: destino, type: 'jpeg', quality: 78 });
    console.log(`  ✓ ${dom}`);
    hechas++;
  } catch (e) {
    console.log(`  ✗ ${dom}: ${e.message.split('\n')[0]}`);
    fallos++;
  } finally {
    await page.close();
  }
}
await browser.close();

console.log(`\n${hechas} capturas nuevas, ${fallos} fallos.`);
execFileSync(process.execPath, [path.join(ROOT, 'tools/build.mjs')], { stdio: 'inherit' });
