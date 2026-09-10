/**
 * Páginas generadas desde la config y los datos del sitio:
 *   /sectores      índice de las 14 páginas de sector
 *   /auditorias    auditorías SEO y de redes (salen de la home)
 *   /marketing     gestión de RRSS y campañas de pago (salen de la home)
 *   /aviso-legal   información legal exigida por la LSSI
 *
 * Se regeneran en cada `node tools/build.mjs`: no editar los .html a mano.
 */
import { pagina } from './pagina.mjs';
import { icon } from './icons.mjs';
import { waLink } from './partials.mjs';
import { SECTORES, CIUDADES } from './data.mjs';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const check = icon('check', { size: 16 });
const arrow = icon('arrow-right', { size: 14 });

// ---------------------------------------------------------------------------
// /sectores
// ---------------------------------------------------------------------------

export function sectores(cfg, sectorCiudades) {
  const tarjetas = SECTORES.map(s => {
    const ciudades = sectorCiudades.get(s.slug) || [];
    // La tarjeta es un <div>, no un <a>: dentro van los enlaces por ciudad y
    // un <a> no puede contener otro <a> (el navegador cerraría la tarjeta).
    const extra = ciudades.length
      ? `<p class="card-ciudades">También por ciudad: ${
          ciudades.slice(0, 4).map(c => `<a href="/${s.slug}-${c.slug}">${esc(c.label)}</a>`).join(' · ')
        }${ciudades.length > 4 ? ` y ${ciudades.length - 4} más` : ''}</p>`
      : '';
    return `      <div class="card">
        <span class="card-ico">${icon(s.icon, { size: 21 })}</span>
        <h3><a href="/${s.slug}" class="card-title-link">${esc(s.label)}</a></h3>
        <p>Página web para tu ${esc(s.singular)} por ${esc(cfg.web.priceFull)}, publicada en ${esc(cfg.entrega.short)}.</p>
        ${extra}
        <a href="/${s.slug}" class="card-link" aria-label="Ver la página de web para ${esc(s.label.toLowerCase())}">Ver página ${arrow}</a>
      </div>`;
  }).join('\n');

  const cuerpo = `<section class="pg-hero">
  <div class="w">
    <div class="pg-eyebrow">Web por sector</div>
    <h1>Páginas web <em>para tu sector</em></h1>
    <p class="pg-lead">Las ${SECTORES.length} páginas de sector de ${esc(cfg.site.brand)}, con el mismo servicio de siempre: ${esc(cfg.web.priceLong)}, ${esc(cfg.dominio.incluido.toLowerCase())} y ${esc(cfg.soporte.displayShort.toLowerCase())}. ${esc(cfg.proyectos.display)} proyectos entregados en toda España.</p>
  </div>
</section>

<section class="pg-sec">
  <div class="w">
    <h2>Elige tu <em>gremio</em></h2>
    <p class="pg-sub">Cada página explica qué necesita una web de ese sector y enseña trabajos reales. Si tu actividad no está en la lista, la web se hace igual: escríbenos y lo hablamos.</p>
    <div class="grid">
${tarjetas}
    </div>
  </div>
</section>

<section class="pg-sec">
  <div class="w">
    <h2>Diseño web <em>por ciudad</em></h2>
    <p class="pg-sub">El servicio es 100% remoto y llega a toda España. Estas son las ciudades con página propia.</p>
    <div class="chips">${CIUDADES.map(c => `<a href="/${c.slug}" class="chip">${esc(c.label)}</a>`).join('')}</div>
  </div>
</section>

<section class="pg-sec">
  <div class="w" style="text-align:center">
    <h2>¿No encuentras <em>tu sector?</em></h2>
    <p class="pg-sub" style="margin:0 auto 24px">Hacemos la web de cualquier autónomo o pequeño negocio. Cuéntanos a qué te dedicas y te decimos qué necesita tu web.</p>
    ${waLink(cfg, `Hola, quiero mi web por ${cfg.web.priceFull}.`, 'sectores_cta', 'btn')}${icon('whatsapp', { size: 18 })}Preguntar por WhatsApp</a>
  </div>
</section>`;

  return pagina(cfg, {
    titulo: `Páginas web por sector — ${cfg.web.priceFull} | ${cfg.site.brand}`,
    descripcion: `Índice de las ${SECTORES.length} páginas de sector de ${cfg.site.brand}: fontaneros, electricistas, peluquerías, restaurantes, abogados y más. Web profesional por ${cfg.web.priceFull}, online en ${cfg.entrega.short}.`,
    ruta: '/sectores',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Páginas web por sector',
      url: cfg.site.domain + '/sectores',
      isPartOf: { '@id': cfg.site.domain + '/#website' },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: SECTORES.length,
        itemListElement: SECTORES.map((s, i) => ({
          '@type': 'ListItem', position: i + 1, name: `Web para ${s.label.toLowerCase()}`, url: `${cfg.site.domain}/${s.slug}`
        }))
      }
    },
    cuerpo
  });
}

// ---------------------------------------------------------------------------
// /auditorias
// ---------------------------------------------------------------------------

export function auditorias(cfg) {
  const li = xs => xs.map(t => `<li>${check}<span>${esc(t)}</span></li>`).join('');
  const cuerpo = `<section class="pg-hero">
  <div class="w">
    <div class="pg-eyebrow">Servicios adicionales</div>
    <h1>¿Ya tienes web? <em>Analízala.</em></h1>
    <p class="pg-lead">Un informe con lo que falla y en qué orden arreglarlo. Pago único, sin cuotas y sin compromiso de contratar nada más.</p>
  </div>
</section>

<section class="pg-sec">
  <div class="w">
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
      <div class="card">
        <span class="card-ico">${icon('search', { size: 21 })}</span>
        <h3>Auditoría SEO</h3>
        <div class="price"><b>${esc(cfg.auditoriaSeo.price)}</b><span>${esc(cfg.auditoriaSeo.priceFull.replace(cfg.auditoriaSeo.price, '').trim())} · pago único</span></div>
        <p style="margin-bottom:18px">Rendimiento, SEO técnico y Core Web Vitals de tu web actual, con un plan de acción priorizado.</p>
        <ul class="feat">${li([
          'Puntuación Lighthouse completa',
          'SEO técnico on-page y off-page',
          'Core Web Vitals y velocidad de carga',
          'Informe PDF con plan de acción priorizado'
        ])}</ul>
        ${waLink(cfg, `Hola, quiero una Auditoría SEO por ${cfg.auditoriaSeo.priceFull}.`, 'auditorias_seo', 'btn')}${icon('whatsapp', { size: 18 })}Solicitar auditoría</a>
      </div>
      <div class="card">
        <span class="card-ico">${icon('instagram', { size: 21 })}</span>
        <h3>Auditoría de redes sociales</h3>
        <div class="price"><b>${esc(cfg.auditoriaRrss.price)}</b><span>${esc(cfg.auditoriaRrss.priceFull.replace(cfg.auditoriaRrss.price, '').trim())} · pago único</span></div>
        <p style="margin-bottom:18px">Instagram y TikTok: cómo se ve tu marca, qué contenido funciona y qué cambiar primero.</p>
        <ul class="feat">${li([
          'Análisis de perfil, bio y enlaces',
          'Métricas de engagement reales',
          'Recomendaciones de contenido personalizadas',
          'Informe PDF profesional'
        ])}</ul>
        ${waLink(cfg, `Hola, quiero una Auditoría de RRSS por ${cfg.auditoriaRrss.priceFull}.`, 'auditorias_rrss', 'btn')}${icon('whatsapp', { size: 18 })}Solicitar auditoría</a>
      </div>
    </div>
  </div>
</section>

<section class="pg-sec">
  <div class="w">
    <h2>Qué pasa <em>después</em></h2>
    <p class="pg-sub">Recibes el informe y decides. Si prefieres empezar de cero, una web nueva cuesta ${esc(cfg.web.priceLong)} y está publicada en un ${esc(cfg.entrega.displayLong.toLowerCase())}. No prometemos primeras posiciones en Google: prometemos una web correctamente configurada y un diagnóstico honesto.</p>
    <div class="chips">
      <a href="/precios" class="chip">Ver precios</a>
      <a href="/comparativa" class="chip">Comparativa</a>
      <a href="/marketing" class="chip">Marketing mensual</a>
      <a href="/preguntas-frecuentes" class="chip">Preguntas frecuentes</a>
    </div>
  </div>
</section>`;

  return pagina(cfg, {
    titulo: `Auditoría SEO ${cfg.auditoriaSeo.priceFull} y auditoría de redes ${cfg.auditoriaRrss.priceFull} | ${cfg.site.brand}`,
    descripcion: `Auditoría SEO por ${cfg.auditoriaSeo.priceFull} y auditoría de Instagram y TikTok por ${cfg.auditoriaRrss.priceFull}. Informe PDF con plan de acción priorizado. Pago único, sin cuotas.`,
    ruta: '/auditorias',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: 'Auditorías',
      url: cfg.site.domain + '/auditorias',
      itemListElement: [
        { '@type': 'Offer', name: 'Auditoría SEO', price: cfg.auditoriaSeo.priceAmount, priceCurrency: 'EUR', url: cfg.site.domain + '/auditorias' },
        { '@type': 'Offer', name: 'Auditoría de redes sociales', price: cfg.auditoriaRrss.priceAmount, priceCurrency: 'EUR', url: cfg.site.domain + '/auditorias' }
      ]
    },
    cuerpo
  });
}

// ---------------------------------------------------------------------------
// /marketing
// ---------------------------------------------------------------------------

export function marketing(cfg) {
  const li = xs => xs.map(t => `<li>${check}<span>${esc(t)}</span></li>`).join('');
  const cuerpo = `<section class="pg-hero">
  <div class="w">
    <div class="pg-eyebrow">Marketing mensual</div>
    <h1>Más que una web. <em>Crece online.</em></h1>
    <p class="pg-lead">Gestión de redes sociales y campañas de pago para autónomos y pequeños negocios. Sin permanencia: se paga mes a mes y se puede parar cuando quieras.</p>
  </div>
</section>

<section class="pg-sec">
  <div class="w">
    <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
      <div class="card">
        <span class="card-ico">${icon('instagram', { size: 21 })}</span>
        <h3>Gestión de redes sociales</h3>
        <div class="price"><b>${esc(cfg.rrss.price)}</b><span>+ IVA / mes</span></div>
        <p style="margin-bottom:18px">Nos encargamos de tu Instagram y TikTok para que tú te dediques a tu negocio.</p>
        <ul class="feat">${li([
          '12 publicaciones al mes (3 por semana)',
          'Diseño gráfico de cada publicación',
          'Textos y hashtags optimizados',
          'Stories semanales',
          'Informe mensual de resultados'
        ])}</ul>
        ${waLink(cfg, `Hola, me interesa la gestión de RRSS por ${cfg.rrss.priceFull}.`, 'marketing_rrss', 'btn')}${icon('whatsapp', { size: 18 })}Solicitar</a>
      </div>
      <div class="card">
        <span class="card-ico">${icon('chart', { size: 21 })}</span>
        <h3>Campañas de pago</h3>
        <div class="price"><b>${esc(cfg.campanas.price)}</b><span>+ IVA / mes de gestión</span></div>
        <p style="margin-bottom:18px">Google Ads y Meta Ads gestionados por nosotros. Tú pones el presupuesto publicitario, nosotros lo optimizamos.</p>
        <ul class="feat">${li([
          'Google Ads o Meta Ads',
          'Configuración y optimización continua',
          'Segmentación por ciudad y sector',
          'Creación de anuncios y textos',
          'El presupuesto publicitario va aparte'
        ])}</ul>
        ${waLink(cfg, `Hola, me interesan las campañas de pago desde ${cfg.campanas.priceFull}.`, 'marketing_campanas', 'btn')}${icon('whatsapp', { size: 18 })}Solicitar</a>
      </div>
      <div class="card">
        <span class="card-ico">${icon('layers', { size: 21 })}</span>
        <h3>Pack redes + campañas</h3>
        <div class="price"><b>${esc(cfg.packRrssCampanas.price)}</b><span>+ IVA / mes</span></div>
        <p style="margin-bottom:18px">Los dos servicios juntos, con un único interlocutor y un solo informe mensual.</p>
        <ul class="feat">${li([
          'Todo lo de gestión de redes sociales',
          'Todo lo de campañas de pago',
          'Informe mensual conjunto',
          'Sin permanencia'
        ])}</ul>
        ${waLink(cfg, `Hola, me interesa el pack de RRSS y campañas por ${cfg.packRrssCampanas.priceFull}.`, 'marketing_pack', 'btn')}${icon('whatsapp', { size: 18 })}Solicitar</a>
      </div>
    </div>
  </div>
</section>

<section class="pg-sec">
  <div class="w">
    <h2>Posicionamiento en <em>asistentes de IA</em></h2>
    <p class="pg-sub">Cada vez más gente pregunta a ChatGPT, Gemini o Perplexity antes de contratar. <a href="https://www.autoridadgeo.com" target="_blank" rel="noopener" style="color:var(--bright)">AutoridadGEO</a>, nuestro servicio hermano, publica contenido para que los asistentes de IA con búsqueda encuentren y citen tu marca.</p>
    <div class="chips">
      <a href="https://www.autoridadgeo.com" target="_blank" rel="noopener" class="chip">Ver AutoridadGEO ${icon('arrow-up-right', { size: 13 })}</a>
      <a href="/auditorias" class="chip">Auditorías</a>
      <a href="/precios" class="chip">Precios de la web</a>
    </div>
  </div>
</section>`;

  return pagina(cfg, {
    titulo: `Gestión de redes sociales y campañas desde ${cfg.rrss.priceFull} | ${cfg.site.brand}`,
    descripcion: `Gestión de Instagram y TikTok por ${cfg.rrss.priceFull} y campañas de Google Ads o Meta Ads por ${cfg.campanas.priceFull} de gestión. Pack conjunto por ${cfg.packRrssCampanas.priceFull}. Sin permanencia.`,
    ruta: '/marketing',
    jsonld: {
      '@context': 'https://schema.org',
      '@type': 'OfferCatalog',
      name: 'Marketing mensual',
      url: cfg.site.domain + '/marketing',
      itemListElement: [
        { '@type': 'Offer', name: 'Gestión de redes sociales', price: cfg.rrss.priceAmount, priceCurrency: 'EUR', url: cfg.site.domain + '/marketing' },
        { '@type': 'Offer', name: 'Gestión de campañas de pago', price: cfg.campanas.priceAmount, priceCurrency: 'EUR', url: cfg.site.domain + '/marketing' },
        { '@type': 'Offer', name: 'Pack redes sociales y campañas', price: cfg.packRrssCampanas.priceAmount, priceCurrency: 'EUR', url: cfg.site.domain + '/marketing' }
      ]
    },
    cuerpo
  });
}

// ---------------------------------------------------------------------------
// /aviso-legal
// ---------------------------------------------------------------------------

export function avisoLegal(cfg) {
  const todo = (t, d) => `<div class="todo"><b>TODO — pendiente de dato real</b><p><strong>${esc(t)}:</strong> ${esc(d)}</p></div>`;
  const cuerpo = `<section class="pg-hero">
  <div class="w">
    <div class="pg-eyebrow">Legal</div>
    <h1>Aviso legal</h1>
    <p class="pg-lead">Información general del titular de este sitio web, conforme al artículo 10 de la Ley 34/2002 de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE).</p>
  </div>
</section>

<section class="pg-sec">
  <div class="w prose">
    <h2>Titular del sitio web</h2>
    ${todo('Denominación social o nombre y apellidos del titular', 'no facilitado. Debe indicarse el nombre fiscal exacto del autónomo o de la sociedad titular de damemiweb.com.')}
    ${todo('NIF / CIF', 'no facilitado.')}
    ${todo('Domicilio social o dirección a efectos de notificaciones', 'no facilitado.')}
    ${todo('Correo electrónico de contacto', 'no facilitado. El sitio solo publica hoy el teléfono de WhatsApp.')}
    ${todo('Datos registrales', 'si el titular es una sociedad mercantil, debe indicarse el registro mercantil, tomo, folio y hoja de inscripción.')}
    <p>Mientras tanto, el canal de contacto operativo es el teléfono <a href="tel:${esc(cfg.site.phone)}">${esc(cfg.site.phoneDisplay)}</a> y el <a href="/contacto">formulario de contacto</a>.</p>

    <h2>Objeto</h2>
    <p>Este sitio web ofrece servicios de diseño y desarrollo web para autónomos y pequeños negocios en España, así como servicios complementarios de auditoría y marketing digital. Las condiciones concretas de contratación figuran en los <a href="/terminos">términos y condiciones</a>.</p>

    <h2>Condiciones de uso</h2>
    <p>El acceso a este sitio web es gratuito y no requiere registro previo, salvo en las áreas privadas de cliente. La persona usuaria se compromete a hacer un uso lícito de los contenidos y a no emplearlos con fines contrarios a la ley, a la buena fe o al orden público.</p>

    <h2>Propiedad intelectual e industrial</h2>
    <p>Los textos, el diseño, el código, la marca «${esc(cfg.site.brand)}» y el resto de elementos de este sitio pertenecen a su titular o se utilizan con licencia. Queda prohibida su reproducción, distribución o transformación sin autorización expresa, salvo los usos permitidos por la ley. Los nombres comerciales y las webs de clientes enlazadas desde <a href="/proyectos">Proyectos</a> pertenecen a sus respectivos titulares y se muestran a efectos de portfolio.</p>

    <h2>Responsabilidad</h2>
    <p>El titular no se hace responsable de las interrupciones del servicio ajenas a su control ni del contenido de las webs de terceros enlazadas desde este sitio. La información publicada sobre plazos, precios y servicios se mantiene actualizada; en caso de discrepancia prevalece lo pactado por escrito con cada cliente.</p>

    <h2>Protección de datos y cookies</h2>
    <p>El tratamiento de los datos personales se describe en la <a href="/privacidad">política de privacidad</a> y el uso de cookies en la <a href="/cookies">política de cookies</a>.</p>

    <h2>Legislación aplicable</h2>
    <p>Estas condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales del domicilio de la persona consumidora cuando así lo imponga la normativa de consumo.</p>

    <p style="margin-top:32px;font-size:13px;color:var(--mist)">Última actualización: ${esc(cfg.site.lastUpdated)}.</p>
  </div>
</section>`;

  return pagina(cfg, {
    titulo: `Aviso legal | ${cfg.site.brand}`,
    descripcion: `Aviso legal de ${cfg.site.brand}: titular del sitio, condiciones de uso, propiedad intelectual, responsabilidad y legislación aplicable.`,
    ruta: '/aviso-legal',
    robots: 'index, follow',
    cuerpo
  });
}
