/**
 * Portfolio de /proyectos: TODAS las webs entregadas, organizadas por sector.
 *
 * Es la fuente de la sección de proyectos.html (entre <!--dmw:proyectos--> y
 * <!--/dmw:proyectos-->), de los contadores de la home y de las webs de ejemplo
 * que enseña cada landing de sector. Para añadir una web: se añade aquí, en su
 * subsector, y se ejecuta `node tools/build.mjs`. build.mjs avisa si
 * site.config.json → proyectos.count no coincide con el total.
 *
 * Estructura: 6 categorías (las tarjetas de la home) → subsectores. `landing`
 * es la página de sector que enlaza el subsector, si la hay.
 */

export const PORTFOLIO = [
  {
    key: 'Hogar y Servicios', color: '#22c55e', subs: [
      { nombre: 'Fontanería', landing: 'web-fontaneros', webs: [
        ['https://elfontanerodemadrid.com', 'El Fontanero de Madrid'],
        ['https://fontaneriacalderon.com', 'Fontanería Calderón'],
        ['https://fontaneroparasevilla.com', 'Fontanero Para Sevilla'],
        ['https://fontaneroguadalajara.com', 'Fontanero Guadalajara'],
        ['https://cambiodetuberias.com', 'Cambio de Tuberías'],
        ['https://www.zone-font.com', 'Zone Font']
      ] },
      { nombre: 'Climatización y calderas', landing: 'web-climatizacion', webs: [
        ['https://calderasparamadrid.com', 'Calderas Para Madrid'],
        ['https://calderasyelectricidad.com', 'Calderas y Electricidad'],
        ['https://juneclimatizacion.com', 'June Climatización'],
        ['https://jjclimayreformas.com', 'JJ Clima y Reformas'],
        ['https://alquileraireacondicionado.es', 'Alquiler Aire Acondicionado']
      ] },
      { nombre: 'Electricistas e instalaciones', landing: 'web-electricistas', webs: [
        ['https://electricistasparamadrid.com', 'Electricistas Para Madrid'],
        ['https://electricidad-industrial.com', 'Electricidad Industrial'],
        ['https://instalacioneselectricasfernando.com', 'Instalaciones Eléctricas Fernando'],
        ['https://www.zone-electric.com', 'Zone Electric'],
        ['https://sonluz-24.com', 'Sonluz 24'],
        ['https://kableca.com', 'Kableca'],
        ['https://instalacionescastelec.com', 'Instalaciones Castelec'],
        ['https://instalacionestomas.com', 'Instalaciones Tomás'],
        ['https://kaderinstalaciones.com', 'Kader Instalaciones'],
        ['https://diversidadindustrial.com', 'Diversidad Industrial']
      ] },
      { nombre: 'Cerrajería', landing: 'web-cerrajeros', webs: [
        ['https://anivalcerrajero24h.com', 'Anival Cerrajero 24h'],
        ['https://cerrajeroparamadrid.com', 'Cerrajero Para Madrid'],
        ['https://cerrajeroenplasencia.com', 'Cerrajero en Plasencia'],
        ['https://cerrajerosred.com', 'Cerrajeros Red'],
        ['https://henrytucerrajero.com', 'Henry Tu Cerrajero'],
        ['https://losmejorescerrajeros.com', 'Los Mejores Cerrajeros'],
        ['https://tecniseguridadanival.com', 'Tecni-Seguridad Anival'],
        ['https://hierrosjuancar.com', 'Hierros Juancar']
      ] },
      { nombre: 'Reparaciones y servicio técnico', landing: 'web-reparaciones', webs: [
        ['https://ag-reparaciones.com', 'AG Reparaciones'],
        ['https://sibrareparaciones.es', 'Sibra Reparaciones'],
        ['https://serviciotecnicodemallorca.com', 'Servicio Técnico de Mallorca'],
        ['https://gsatsoluciones.com', 'GSAT Soluciones'],
        ['https://multiserviciosor.com', 'Multiservicios OR']
      ] },
      { nombre: 'Jardinería, plagas y limpieza', landing: 'web-jardineria', webs: [
        ['https://jarditrabajos.com', 'Jardi Trabajos'],
        ['https://tuplagaenmejoresmanos.com', 'Tu Plaga en Mejores Manos'],
        ['https://qlimpiooutlet.com', 'Qlimpio Outlet']
      ] }
    ]
  },
  {
    key: 'Reformas y Construcción', color: '#f59e0b', subs: [
      { nombre: 'Reformas integrales y construcción', landing: 'web-reformas', webs: [
        ['https://construccioneskraft.com', 'Construcciones Kraft'],
        ['https://construccionesloal.com', 'Construcciones Loal'],
        ['https://construccionesyreformasraycosasa.com', 'Construcciones y Reformas Rayco'],
        ['https://reformasrayco.com', 'Reformas Rayco'],
        ['https://reformasyconstruccionesmario.com', 'Reformas y Construcciones Mario'],
        ['https://exactareformas.com', 'Exacta Reformas'],
        ['https://jmreformasyservicios.com', 'JM Reformas y Servicios'],
        ['https://jyareformasintegrales.com', 'JYA Reformas Integrales'],
        ['https://reformasintegralescantabria.com', 'Reformas Integrales Cantabria'],
        ['https://cemaitjintegral.com', 'Cemaitj Integral'],
        ['https://reformas24cabral.com', 'Reformas 24 Cabral'],
        ['https://reformasalvaradopizarro.com', 'Reformas Alvarado Pizarro'],
        ['https://alvaradoreformas.com', 'Alvarado Reformas'],
        ['https://reformasdanielmultiservicios.com', 'Reformas Daniel Multiservicios'],
        ['https://reformasdanut.com', 'Reformas Danut'],
        ['https://reformasfjr.com', 'Reformas FJR'],
        ['https://reformasmanuelrios.com', 'Reformas Manuel Ríos'],
        ['https://reformasmosma.com', 'Reformas Mosma'],
        ['https://reformasrocla.es', 'Reformas Rocla'],
        ['https://reformasyamadrid.com', 'Reformas Ya Madrid'],
        ['https://nlreformasypladur.com', 'NL Reformas y Pladur']
      ] },
      { nombre: 'Pintores, parquet y tarimas', landing: 'web-pintores', webs: [
        ['https://pinturasandra.com', 'Pinturas Andra'],
        ['https://pinturaslite.com', 'Pinturas Lite'],
        ['https://amhpintores.com', 'AMH Pintores'],
        ['https://parquetytarimamadrid.es', 'Parquet y Tarima Madrid'],
        ['https://tarimasremasol.com', 'Tarimas Remasol']
      ] },
      { nombre: 'Tejados y cubiertas', landing: 'web-tejados', webs: [
        ['https://tejadosencantabria.com', 'Tejados en Cantabria'],
        ['https://tejadosroberto.com', 'Tejados Roberto']
      ] }
    ]
  },
  {
    key: 'Transporte y Mudanzas', color: '#3b82f6', subs: [
      { nombre: 'Mudanzas', landing: 'web-mudanzas', webs: [
        ['https://mamudanzas.com', 'MA Mudanzas'],
        ['https://montajesymudanzas.com', 'Montajes y Mudanzas'],
        ['https://mudaexpress.es', 'Muda Express'],
        ['https://mudanzasenvasvi.com', 'Mudanzas Envasvi'],
        ['https://mudanzasjpm.com', 'Mudanzas JPM'],
        ['https://mudanzasyreformaslym.com', 'Mudanzas y Reformas LYM'],
        ['https://mudanzasytransportesrey.com', 'Mudanzas y Transportes Rey']
      ] },
      { nombre: 'Vaciados de pisos', landing: 'web-vaciados', webs: [
        ['https://vaciadosnelo.com', 'Vaciados Nelo'],
        ['https://mudanzasyvaciadoscerca.com', 'Mudanzas y Vaciados Cerca']
      ] },
      { nombre: 'Portes, transporte y logística', landing: 'web-portes', webs: [
        ['https://portesromero.com', 'Portes Romero'],
        ['https://portesmata.com', 'Portes Mata'],
        ['https://tusportesmadrid.com', 'Tus Portes Madrid'],
        ['https://transporteshermarkez.com', 'Transportes Hermarkez'],
        ['https://jndalitransport.es', 'JN Dali Transport'],
        ['https://manoderechalogistica.com', 'Mano Derecha Logística'],
        ['https://serviciocamiongrua.com', 'Servicio Camión Grúa']
      ] },
      { nombre: 'Taxis', landing: 'web-taxis', webs: [
        ['https://taxiayorataxiban.com', 'Taxi Ayora Taxiban']
      ] }
    ]
  },
  {
    key: 'Comercio y Tiendas', color: '#a855f7', subs: [
      { nombre: 'Belleza y estética', landing: 'web-estetica', webs: [
        ['https://www.adrianoterosalondebelleza.com', 'Adriano Tero Salón de Belleza'],
        ['https://linamarianailsalon.com', 'Lina Maria Nail Salon'],
        ['https://straycuts.com', 'Straycuts']
      ] },
      { nombre: 'Tiendas y comercio local', landing: 'web-tiendas', webs: [
        ['https://charlespersonalizaciones.com', 'Charles Personalizaciones'],
        ['https://tulogoencamisetas.com', 'Tu Logo en Camisetas'],
        ['https://tropicalvapers.com', 'Tropical Vapers'],
        ['https://hortifruta.com', 'Hortifruta'],
        ['https://sherrymagen.com', 'Sherry Magen'],
        ['https://eliskaravan.com', 'Elis Karavan']
      ] },
      { nombre: 'Inmobiliarias', landing: 'web-inmobiliarias', webs: [
        ['https://paradiseinmo.com', 'Paradise Inmo'],
        ['https://vivecasarapa.com', 'Vive Casa Rapa']
      ] },
      { nombre: 'Administradores de fincas', landing: 'web-administradores-de-fincas', webs: [
        ['https://administradoresdefincasmadridws.com', 'Administradores de Fincas Madrid']
      ] }
    ]
  },
  {
    key: 'Formación y Tech', color: '#7FA3F5', subs: [
      { nombre: 'Formación y academias', landing: 'web-academias', webs: [
        ['https://aulaformacion10.com', 'Aula Formación 10'],
        ['https://fide13formacion.com', 'Fide13 Formación'],
        ['https://yaprofesional.com', 'Ya Profesional']
      ] },
      { nombre: 'Consultoría y recursos humanos', landing: 'web-coaches', webs: [
        ['https://eserpsubvenciones.com', 'ESERP Subvenciones'],
        ['https://nosomosrecursos.com', 'No Somos Recursos'],
        ['https://gotalentgo.com', 'GoTalentGo'],
        ['https://optimomadrid.com', 'Óptimo Madrid']
      ] },
      { nombre: 'Tecnología y software', landing: null, webs: [
        ['https://www.autoridadgeo.com', 'AutoridadGEO'],
        ['https://hefestocrm.com', 'Hefesto CRM'],
        ['https://hefestoforgelabs.com', 'Hefesto Forge Labs'],
        ['https://kmisito.com', 'KMisito']
      ] }
    ]
  },
  {
    key: 'Otros sectores', color: '#ef4444', subs: [
      { nombre: 'Ocio, cultura y otros', landing: null, webs: [
        ['https://cuentosdeloasis.com', 'Cuentos de Loasis'],
        ['https://djrobles.com', 'DJ Robles'],
        ['https://ligapatria.com', 'Liga Patria'],
        ['https://startdustrunner.com', 'Stardust Runner'],
        ['https://tenalbaop3.com', 'Tenalba OP3'],
        ['https://goryekaray.com', 'Goryekaray']
      ] }
    ]
  }
];

/** Todas las webs, planas: [{ url, nombre, categoria, sub, landing }] */
export function todasLasWebs() {
  return PORTFOLIO.flatMap(c => c.subs.flatMap(s =>
    s.webs.map(([url, nombre]) => ({ url, nombre, categoria: c.key, sub: s.nombre, landing: s.landing }))));
}

/** Webs de ejemplo para la landing `slug` (las de los subsectores que enlazan a ella). */
export function websDeLanding(slug) {
  return todasLasWebs().filter(w => w.landing === slug);
}
