/**
 * Landings de sector generadas: /web-cerrajeros, /web-climatizacion, etc.
 *
 * Son los sectores en los que ya hay clientes reales (ver proyectos-data.mjs)
 * y que no tenían página propia. Cada landing enseña las webs reales de su
 * sector, lo que necesita la web de ese negocio y preguntas propias.
 *
 * Se regeneran en cada `node tools/build.mjs`: no editar los .html a mano.
 * Para añadir un sector: una entrada aquí, otra en SECTORES (data.mjs) y
 * `node tools/build.mjs`.
 */
import { pagina } from './pagina.mjs';
import { icon } from './icons.mjs';
import { waLink } from './partials.mjs';
import { SECTORES } from './data.mjs';
import { todasLasWebs } from './proyectos-data.mjs';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const check = icon('check', { size: 16 });

/*
 * nombre      plural para frases ("cerrajeros")
 * h1          titular; lo que va entre *asteriscos* sale resaltado
 * lead        entradilla del hero
 * busquedas   búsquedas reales de sus clientes (para el bloque de SEO local)
 * claves      [título, texto] de lo que tiene que resolver la web
 * faqs        [pregunta, respuesta] propias del sector
 * ejemplos    dominios de proyectos-data.mjs que se enseñan como trabajos
 * relacionados slugs de otras landings
 */
export const LANDINGS = [
  {
    slug: 'web-cerrajeros', nombre: 'cerrajeros',
    h1: 'Página web para *cerrajeros*',
    lead: 'Cuando alguien se queda fuera de casa no compara diez webs: llama a la primera que le inspira confianza y tiene el teléfono a mano. Tu web tiene que ser esa.',
    busquedas: ['cerrajero urgente cerca de mí', 'cerrajero 24 horas', 'abrir puerta sin romper', 'cambiar bombín precio', 'cerrajero barato'],
    claves: [
      ['Llamada en un toque', 'Botón de llamada y de WhatsApp fijos en el móvil. En una urgencia nadie rellena formularios.'],
      ['Servicio 24 horas bien visible', 'Horario, tiempo de llegada aproximado y zonas que cubres, arriba del todo y sin buscar.'],
      ['Precios orientativos', 'Apertura de puerta, cambio de bombín, cerraduras de seguridad: dar una horquilla quita miedo al cliente.'],
      ['Confianza frente a los abusos', 'Nombre real, fotos de tu furgoneta y tus trabajos, reseñas de Google. Es lo que te separa de los anuncios fantasma.'],
      ['Una página por servicio', 'Aperturas, bombines, puertas acorazadas, persianas, cajas fuertes: cada servicio con su texto para salir en su búsqueda.']
    ],
    faqs: [
      ['¿La web puede decir que atiendo 24 horas?', 'Sí, y conviene que lo diga en el titular, en el botón de llamada y en los datos estructurados de horario para que Google lo muestre.'],
      ['¿Puedo poner varias zonas o pueblos?', 'Sí. Listamos las zonas que cubres y las mencionamos en los textos. Si trabajas en varias ciudades lo planteamos al preparar el contenido.'],
      ['¿Me ayudáis con la ficha de Google?', 'Te dejamos la web preparada para enlazarla con tu Perfil de Empresa de Google y te explicamos cómo pedir reseñas, que en este sector pesan mucho.']
    ],
    ejemplos: ['anivalcerrajero24h', 'cerrajeroparamadrid', 'cerrajeroenplasencia', 'cerrajerosred', 'henrytucerrajero', 'losmejorescerrajeros', 'tecniseguridadanival', 'hierrosjuancar'],
    relacionados: ['web-fontaneros', 'web-electricistas', 'web-reparaciones']
  },
  {
    slug: 'web-climatizacion', nombre: 'empresas de climatización y calderas',
    h1: 'Página web para *climatización y calderas*',
    lead: 'Instalación de aire acondicionado, mantenimiento de calderas, averías en pleno invierno o en plena ola de calor: la demanda llega de golpe y se la lleva quien aparece primero con una web clara.',
    busquedas: ['instalar aire acondicionado precio', 'técnico de calderas cerca', 'revisión de caldera obligatoria', 'reparación aire acondicionado', 'cambiar caldera de gas'],
    claves: [
      ['Servicios por separado', 'Instalación, mantenimiento, reparación y cambio de equipo, cada uno con su explicación y su llamada a la acción.'],
      ['Marcas con las que trabajas', 'Muchos clientes buscan por marca de caldera o de split. Nombrarlas ayuda a aparecer y da confianza.'],
      ['Temporada alta preparada', 'Mensajes de verano e invierno que se cambian en un momento: los cambios de contenido van incluidos 12 meses.'],
      ['Presupuesto por WhatsApp', 'El cliente te manda foto del equipo o de la placa y tú respondes con precio. Sin llamadas perdidas.'],
      ['Carné y garantías', 'Instalador habilitado, garantía de la instalación y certificados: lo que el cliente quiere ver antes de meterte en casa.']
    ],
    faqs: [
      ['¿Puedo tener una sección de mantenimiento con contrato anual?', 'Sí. Explicamos qué incluye tu contrato de mantenimiento y el cliente lo solicita por WhatsApp o por teléfono.'],
      ['¿Sirve también si hago electricidad o fontanería?', 'Sí. Muchas empresas de climatización hacen las tres cosas: organizamos la web por servicios para que cada uno tenga su espacio.'],
      ['¿Podéis poner ofertas de temporada?', 'Sí. Durante los 12 meses de soporte cambiamos textos y ofertas cuando nos lo pidas.']
    ],
    ejemplos: ['calderasparamadrid', 'calderasyelectricidad', 'juneclimatizacion', 'jjclimayreformas', 'alquileraireacondicionado'],
    relacionados: ['web-fontaneros', 'web-electricistas', 'web-reformas']
  },
  {
    slug: 'web-pintores', nombre: 'pintores',
    h1: 'Página web para *pintores* y empresas de pintura',
    lead: 'En pintura el cliente compra por lo que ve. Una web con tus trabajos antes y después, bien ordenados, vende más que cualquier folleto.',
    busquedas: ['pintor de pisos precio', 'pintar piso completo', 'pintores económicos', 'quitar gotelé precio', 'pintura de fachadas'],
    claves: [
      ['Galería antes y después', 'Tus trabajos reales, ordenados por tipo: pisos, fachadas, locales, gotelé, lacados.'],
      ['Precio por metro o por estancia', 'Una orientación de precio filtra a quien no encaja y anima a pedir presupuesto a quien sí.'],
      ['Presupuesto con fotos', 'El cliente te manda fotos de las paredes por WhatsApp y tú calculas sin desplazarte.'],
      ['Limpieza y plazos', 'Protección de muebles, limpieza al terminar y días de trabajo: es lo que más preocupa al que pinta su casa.'],
      ['Parquet, tarima y acabados', 'Si también haces suelos o pladur, cada servicio con su apartado para aparecer en su búsqueda.']
    ],
    faqs: [
      ['¿Puedo subir muchas fotos de trabajos?', 'Sí. Montamos una galería optimizada para que cargue rápido en el móvil aunque tenga muchas imágenes.'],
      ['¿Y si también hago reformas?', 'Lo incluimos como otro servicio. Si las reformas son tu actividad principal, mira también la página de web para reformas.'],
      ['¿Puedo añadir trabajos nuevos después?', 'Sí. Durante 12 meses nos mandas las fotos y las subimos nosotros.']
    ],
    ejemplos: ['pinturasandra', 'pinturaslite', 'amhpintores', 'parquetytarimamadrid', 'tarimasremasol'],
    relacionados: ['web-reformas', 'web-tejados', 'web-administradores-de-fincas']
  },
  {
    slug: 'web-tejados', nombre: 'empresas de tejados',
    h1: 'Página web para *tejados* y cubiertas',
    lead: 'Una gotera no espera. Quien busca un tejadista necesita ver que eres de la zona, que trabajas con seguridad y que puede llamarte hoy.',
    busquedas: ['arreglar tejado goteras', 'tejadista cerca de mí', 'impermeabilizar terraza', 'cambiar tejado precio', 'reparación de canalones'],
    claves: [
      ['Urgencias por goteras', 'Botón de llamada y mensaje claro para reparaciones urgentes tras lluvias y temporales.'],
      ['Trabajos en altura con seguridad', 'Seguro de responsabilidad civil, medios de seguridad y fotos de obra real: tranquiliza al cliente y a la comunidad.'],
      ['Servicios uno a uno', 'Reparación de tejados, impermeabilización, canalones, cubiertas de panel, limpieza y revisión.'],
      ['Zona de trabajo', 'Pueblos y comarcas que cubres, bien a la vista: en este sector casi todo se decide por cercanía.'],
      ['Comunidades de vecinos', 'Un apartado para administradores y comunidades, que son clientes recurrentes y de obra grande.']
    ],
    faqs: [
      ['¿Me sirve si trabajo en una comarca y no en una gran ciudad?', 'Sí. Mencionamos tus pueblos y comarcas en los textos para que la web responda a búsquedas de tu zona.'],
      ['¿Puedo enseñar obras con fotos de dron?', 'Sí. Las optimizamos para que se vean bien y carguen rápido en el móvil.'],
      ['¿Incluye formulario para presupuestos?', 'El contacto principal es por WhatsApp y teléfono, que es lo que más convierte. Si necesitas formulario, lo hablamos.']
    ],
    ejemplos: ['tejadosencantabria', 'tejadosroberto'],
    relacionados: ['web-reformas', 'web-pintores', 'web-administradores-de-fincas']
  },
  {
    slug: 'web-reparaciones', nombre: 'servicios técnicos y reparaciones',
    h1: 'Página web para *reparaciones* y servicio técnico',
    lead: 'Electrodomésticos, pequeñas reparaciones del hogar, multiservicios: el cliente quiere saber qué arreglas, cuánto tarda y si vas hoy. Tu web se lo dice en diez segundos.',
    busquedas: ['servicio técnico lavadoras', 'reparación de electrodomésticos a domicilio', 'manitas cerca de mí', 'arreglar frigorífico', 'multiservicios hogar'],
    claves: [
      ['Qué reparas, con marcas', 'Lista de aparatos y marcas con las que trabajas. Es exactamente lo que teclea el cliente.'],
      ['Precio de desplazamiento', 'Decir qué cuesta la visita y el diagnóstico evita llamadas que no acaban en trabajo.'],
      ['Cita rápida por WhatsApp', 'El cliente te cuenta la avería con una foto o un vídeo y cerráis la visita en el chat.'],
      ['Garantía de la reparación', 'Garantía de piezas y mano de obra por escrito: el argumento que más pesa frente al "compra uno nuevo".'],
      ['Zonas y horarios', 'Barrios y municipios que cubres y franjas horarias, sin letra pequeña.']
    ],
    faqs: [
      ['¿Puedo poner que no soy servicio oficial pero trabajo todas las marcas?', 'Sí, y conviene decirlo claro. Nombramos las marcas con las que trabajas sin presentarnos como servicio oficial.'],
      ['¿Vale para un multiservicios que hace de todo?', 'Sí. Ordenamos los servicios por tipo para que cada cliente encuentre el suyo sin perderse.'],
      ['¿Cuánto tarda en estar online?', 'Un máximo de 72 horas desde que recibimos tu información.']
    ],
    ejemplos: ['ag-reparaciones', 'sibrareparaciones', 'serviciotecnicodemallorca', 'gsatsoluciones', 'multiserviciosor'],
    relacionados: ['web-electricistas', 'web-climatizacion', 'web-cerrajeros']
  },
  {
    slug: 'web-jardineria', nombre: 'jardineros',
    h1: 'Página web para *jardinería* y mantenimiento de jardines',
    lead: 'Mantenimiento de jardines, podas, césped, riego: trabajos que se repiten cada mes. Una web bien hecha te trae clientes fijos, no solo encargos sueltos.',
    busquedas: ['jardinero cerca de mí', 'mantenimiento de jardines precio', 'poda de árboles', 'instalar césped artificial', 'sistema de riego automático'],
    claves: [
      ['Mantenimiento periódico', 'Planes mensuales o por temporada explicados con claridad: es la parte más rentable del negocio.'],
      ['Fotos de jardines reales', 'Antes y después de tus trabajos. En jardinería la foto vende sola.'],
      ['Servicios con nombre propio', 'Poda, desbroce, césped natural y artificial, riego, limpieza de parcelas: cada uno con su texto.'],
      ['Comunidades y urbanizaciones', 'Un apartado para zonas comunes, que son contratos estables.'],
      ['Presupuesto con foto', 'El cliente te manda una foto del jardín por WhatsApp y le das una primera cifra.']
    ],
    faqs: [
      ['¿Puedo ofrecer planes de mantenimiento mensuales?', 'Sí. Los explicamos en la web y el cliente los solicita por WhatsApp. El cobro lo gestionas tú como siempre.'],
      ['¿Sirve para una empresa pequeña de una o dos personas?', 'Sí. La mayoría de nuestros clientes son autónomos o negocios de pocas personas.'],
      ['¿Podéis cambiar los textos según la temporada?', 'Sí. Los cambios de contenido van incluidos durante 12 meses.']
    ],
    ejemplos: ['jarditrabajos'],
    relacionados: ['web-control-de-plagas', 'web-reparaciones', 'web-administradores-de-fincas']
  },
  {
    slug: 'web-control-de-plagas', nombre: 'empresas de control de plagas',
    h1: 'Página web para *control de plagas*',
    lead: 'Quien descubre cucarachas, chinches o ratas en casa busca una solución ya, con discreción y con garantías. Tu web tiene que transmitir las tres cosas.',
    busquedas: ['eliminar cucarachas', 'empresa de desinsectación', 'chinches en casa qué hacer', 'desratización precio', 'fumigar piso'],
    claves: [
      ['Una página por plaga', 'Cucarachas, chinches, ratas y ratones, termitas, avispas: cada plaga con su explicación y su tratamiento.'],
      ['Registro y certificados', 'Número de registro oficial (ROESB) y certificado de tratamiento: imprescindibles para bares, restaurantes y comunidades.'],
      ['Discreción', 'Vehículos sin rotular, visitas a la hora que convenga: es una preocupación real del cliente y hay que decirlo.'],
      ['Garantía del tratamiento', 'Revisiones incluidas y qué pasa si la plaga vuelve.'],
      ['Clientes de empresa', 'Planes de control periódico para hostelería, comercios y comunidades de vecinos.']
    ],
    faqs: [
      ['¿Puedo tener una página para cada plaga?', 'Sí, y es lo recomendable: cada plaga es una búsqueda distinta en Google.'],
      ['¿Dónde pongo el número de registro?', 'En la página principal y en el pie, junto a tus datos de empresa. Da mucha confianza a los clientes de empresa.'],
      ['¿Incluye botón de urgencias?', 'Sí. Llamada y WhatsApp siempre visibles en el móvil.']
    ],
    ejemplos: ['tuplagaenmejoresmanos'],
    relacionados: ['web-jardineria', 'web-restaurantes', 'web-administradores-de-fincas']
  },
  {
    slug: 'web-vaciados', nombre: 'empresas de vaciado de pisos',
    h1: 'Página web para *vaciados de pisos*',
    lead: 'Herencias, desahucios, mudanzas, trasteros: el que necesita vaciar un piso quiere precio cerrado, rapidez y saber que todo acaba donde debe.',
    busquedas: ['vaciar piso precio', 'vaciado de pisos gratis', 'vaciar trastero', 'recogida de muebles viejos', 'vaciado de pisos por herencia'],
    claves: [
      ['Precio cerrado tras ver fotos', 'El cliente manda fotos o un vídeo por WhatsApp y recibe presupuesto sin visita.'],
      ['Vaciado con valoración', 'Si descuentas lo que se puede aprovechar o revender, explícalo: es tu mejor argumento.'],
      ['Gestión legal de residuos', 'Punto limpio y reciclaje: el cliente quiere saber que no acabará en una cuneta.'],
      ['Casos típicos', 'Herencias, pisos de alquiler, locales, trasteros, garajes: cada caso con sus palabras.'],
      ['Limpieza final', 'Si entregas el piso limpio y listo para vender o alquilar, que se vea.']
    ],
    faqs: [
      ['¿Puedo combinar vaciados y mudanzas en la misma web?', 'Sí. Organizamos los dos servicios por separado para que cada uno salga en su búsqueda.'],
      ['¿Se puede pedir presupuesto con fotos?', 'Sí. El botón de WhatsApp lleva un mensaje preparado para que el cliente mande fotos o vídeo.'],
      ['¿Trabajáis con empresas de otras ciudades?', 'Sí. El servicio se presta en remoto y hacemos webs para toda España.']
    ],
    ejemplos: ['vaciadosnelo', 'mudanzasyvaciadoscerca'],
    relacionados: ['web-mudanzas', 'web-portes', 'web-inmobiliarias']
  },
  {
    slug: 'web-portes', nombre: 'empresas de portes y transporte',
    h1: 'Página web para *portes* y transporte',
    lead: 'Pequeños portes, transporte de mercancías, camión grúa, logística: el cliente compara precio y fiabilidad en dos minutos. Tu web tiene que ganarle esos dos minutos.',
    busquedas: ['portes baratos', 'transporte de muebles', 'furgoneta con conductor', 'alquiler camión grúa', 'empresa de transporte de mercancías'],
    claves: [
      ['Tarifas orientativas', 'Precio por hora, por trayecto o por tipo de porte: con una orientación el cliente se decide antes.'],
      ['Tu flota', 'Furgonetas, camiones, grúa, plataforma: capacidad y fotos reales de tus vehículos.'],
      ['Particulares y empresas', 'Dos caminos distintos en la web: el porte puntual y el transporte recurrente.'],
      ['Reserva por WhatsApp', 'Origen, destino, fecha y fotos de la carga en un mensaje.'],
      ['Zonas y rutas', 'Ciudades, rutas habituales y si haces nacional: cuanto más claro, menos llamadas perdidas.']
    ],
    faqs: [
      ['¿Vale para un autónomo con una sola furgoneta?', 'Sí. Buena parte de nuestros clientes de portes son autónomos con uno o dos vehículos.'],
      ['¿Puedo tener una sección para empresas?', 'Sí. Separamos el servicio a particulares del de empresas y logística.'],
      ['¿La web puede calcular el precio sola?', 'La versión estándar recibe los datos por WhatsApp y tú das el precio. Si necesitas calculadora, lo hablamos.']
    ],
    ejemplos: ['portesromero', 'portesmata', 'tusportesmadrid', 'transporteshermarkez', 'jndalitransport', 'manoderechalogistica', 'serviciocamiongrua'],
    relacionados: ['web-mudanzas', 'web-vaciados', 'web-taxis']
  },
  {
    slug: 'web-taxis', nombre: 'taxistas',
    h1: 'Página web para *taxis* y VTC',
    lead: 'Traslados al aeropuerto, viajes largos, servicios concertados: una web propia te trae los viajes que las aplicaciones no te dan y que el cliente reserva directamente contigo.',
    busquedas: ['taxi al aeropuerto', 'reservar taxi', 'taxi para viajes largos', 'taxi adaptado', 'taxi 24 horas'],
    claves: [
      ['Reserva directa', 'Botón de llamada y WhatsApp para reservar sin comisiones de intermediarios.'],
      ['Traslados con precio', 'Aeropuerto, estación, hospitales: rutas habituales con su precio orientativo.'],
      ['Tu vehículo', 'Plazas, maletero, taxi adaptado o de 7 plazas: lo que el cliente necesita saber para elegirte.'],
      ['Servicios concertados', 'Empresas, hoteles, residencias y mutuas: un apartado para clientes recurrentes.'],
      ['Disponibilidad', 'Horario, 24 horas o reserva previa, y municipio de la licencia.']
    ],
    faqs: [
      ['¿Me sirve si trabajo en un pueblo?', 'Sí. En pueblos y comarcas una web propia es muchas veces la única forma de que te encuentren fuera de la parada.'],
      ['¿Puedo poner precios de trayectos?', 'Sí, como orientación. Los cambiamos cuando nos lo pidas durante 12 meses.'],
      ['¿Y si soy VTC?', 'También. Adaptamos los textos a tu licencia y a la forma de contratar que te permita.']
    ],
    ejemplos: ['taxiayorataxiban'],
    relacionados: ['web-portes', 'web-talleres-mecanicos', 'web-mudanzas']
  },
  {
    slug: 'web-estetica', nombre: 'centros de estética',
    h1: 'Página web para *centros de estética* y salones de uñas',
    lead: 'Uñas, pestañas, depilación, tratamientos faciales: tus clientas eligen por las fotos y reservan por el móvil. Tu web tiene que estar a la altura de tu Instagram y llevarlas a la cita.',
    busquedas: ['uñas de gel cerca de mí', 'centro de estética', 'lifting de pestañas precio', 'depilación láser', 'manicura semipermanente'],
    claves: [
      ['Carta de servicios con precios', 'Tratamientos agrupados y con precio: la pregunta que más te hacen por mensaje, contestada.'],
      ['Galería de trabajos', 'Tus diseños de uñas y resultados reales, enlazados con tu Instagram.'],
      ['Cita por WhatsApp', 'La clienta elige tratamiento y te escribe con el mensaje preparado.'],
      ['Ubicación y horario', 'Mapa, cómo llegar y horario: lo que se consulta justo antes de ir.'],
      ['Bonos y tarjetas regalo', 'Un apartado para promociones y bonos, que se cambia en cada temporada.']
    ],
    faqs: [
      ['¿Puedo conectar mi sistema de reservas?', 'Sí. Si ya usas una aplicación de citas, ponemos el enlace en los botones de reserva.'],
      ['¿Y si también hago peluquería?', 'Lo incluimos. Si la peluquería es tu actividad principal, mira también la página de web para peluquerías.'],
      ['¿Podéis cambiar la carta de precios?', 'Sí. Durante 12 meses los cambios de contenido van incluidos.']
    ],
    ejemplos: ['adrianoterosalondebelleza', 'linamarianailsalon', 'straycuts'],
    relacionados: ['web-peluquerias', 'web-tiendas', 'web-nutricionistas']
  },
  {
    slug: 'web-tiendas', nombre: 'tiendas y comercios',
    h1: 'Página web para *tiendas* y comercio local',
    lead: 'Personalización, alimentación, moda, regalos: una web con tu catálogo, tu ubicación y un botón de pedido por WhatsApp vende más que un perfil de redes que nadie encuentra en Google.',
    busquedas: ['tienda cerca de mí', 'camisetas personalizadas', 'regalos personalizados', 'frutería a domicilio', 'tienda online pequeña'],
    claves: [
      ['Catálogo visual', 'Tus productos con foto y precio orientativo, agrupados por categoría.'],
      ['Pedido por WhatsApp', 'El cliente elige y te escribe con el producto ya indicado. Sin pasarela, sin comisiones.'],
      ['Tienda física en el mapa', 'Dirección, horario y cómo llegar para quien prefiere ir en persona.'],
      ['Envíos y recogida', 'Qué zonas cubres, plazos y si hay recogida en tienda.'],
      ['Pedidos para empresas', 'Si haces personalización o pedidos grandes, un apartado para empresas y eventos.']
    ],
    faqs: [
      ['¿Es una tienda online con carrito?', 'La web estándar muestra el catálogo y recibe pedidos por WhatsApp, que para un comercio local suele funcionar mejor. Si necesitas carrito y pago online, lo presupuestamos aparte.'],
      ['¿Cuántos productos puedo poner?', 'Los que necesites mostrar. Para catálogos muy grandes lo planteamos por categorías.'],
      ['¿Podéis añadir productos nuevos?', 'Sí. Durante 12 meses nos mandas los cambios y los hacemos nosotros.']
    ],
    ejemplos: ['charlespersonalizaciones', 'tulogoencamisetas', 'tropicalvapers', 'hortifruta', 'sherrymagen', 'eliskaravan'],
    relacionados: ['web-estetica', 'web-restaurantes', 'web-fotografos']
  },
  {
    slug: 'web-inmobiliarias', nombre: 'inmobiliarias',
    h1: 'Página web para *inmobiliarias*',
    lead: 'Los portales se quedan tus contactos y cobran por cada anuncio. Una web propia te da una marca, captación de propietarios y un sitio donde enseñar tus inmuebles a tu manera.',
    busquedas: ['inmobiliaria en mi zona', 'vender mi piso rápido', 'tasación gratuita de vivienda', 'pisos en alquiler', 'casas rurales en alquiler'],
    claves: [
      ['Captación de propietarios', 'Una sección para quien quiere vender o alquilar: valoración gratuita por WhatsApp.'],
      ['Inmuebles destacados', 'Tus mejores viviendas con fotos, datos clave y enlace a tu portal o a tu ficha.'],
      ['Tu zona, a fondo', 'Barrios y municipios donde trabajas, con texto propio: es tu ventaja frente a los grandes portales.'],
      ['Alquiler vacacional', 'Si gestionas alojamientos, cada uno con su galería, servicios y botón de reserva.'],
      ['Equipo y trayectoria', 'Caras, años en la zona y operaciones cerradas: la confianza en inmobiliaria es personal.']
    ],
    faqs: [
      ['¿Puedo publicar mis inmuebles en la web?', 'Sí. Montamos una sección con tus inmuebles destacados. Si trabajas con un CRM inmobiliario, enlazamos tu escaparate.'],
      ['¿Sirve para alquiler vacacional?', 'Sí. Cada alojamiento con su galería, servicios, ubicación y botón de consulta o reserva.'],
      ['¿Puedo cambiar los inmuebles cuando se vendan?', 'Sí. Durante 12 meses los cambios de contenido van incluidos.']
    ],
    ejemplos: ['paradiseinmo', 'vivecasarapa'],
    relacionados: ['web-administradores-de-fincas', 'web-reformas', 'web-abogados']
  },
  {
    slug: 'web-administradores-de-fincas', nombre: 'administradores de fincas',
    h1: 'Página web para *administradores de fincas*',
    lead: 'Las comunidades cambian de administrador cuando están descontentas, y lo primero que hace el presidente es buscar alternativas en Google. Tu web tiene que estar ahí y transmitir orden y transparencia.',
    busquedas: ['administrador de fincas cerca', 'cambiar de administrador de fincas', 'administración de comunidades precio', 'administrador de fincas colegiado', 'gestión de comunidades de vecinos'],
    claves: [
      ['Qué incluye tu gestión', 'Juntas, cuentas, morosidad, seguros, incidencias: detallado, porque es lo que se compara al cambiar de administrador.'],
      ['Colegiación y seguros', 'Número de colegiado y seguro de responsabilidad civil a la vista.'],
      ['Canal de incidencias', 'WhatsApp y teléfono para vecinos, con horario de atención claro.'],
      ['Cómo es el cambio', 'Explicar el traspaso de documentación quita el miedo a cambiar de administrador.'],
      ['Zonas y tipo de fincas', 'Comunidades, garajes, mancomunidades, locales: dónde y qué gestionas.']
    ],
    faqs: [
      ['¿Puedo tener un acceso para vecinos?', 'La web estándar enlaza con la plataforma o aplicación de comunidades que ya uses. Si necesitas un área privada propia, lo presupuestamos aparte.'],
      ['¿Dónde pongo mi número de colegiado?', 'En la página principal y en el pie, junto a tus datos: es obligatorio y además da confianza.'],
      ['¿Cuánto tarda?', 'Un máximo de 72 horas desde que recibimos tu información.']
    ],
    ejemplos: ['administradoresdefincasmadridws'],
    relacionados: ['web-abogados', 'web-inmobiliarias', 'web-reformas']
  }
];

const conResalte = t => esc(t).replace(/\*([^*]+)\*/g, '<em>$1</em>');
const sinResalte = t => t.replace(/\*/g, '');

const EXTRA_CSS = `<style>
.ld-hero-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.btn-ghost{display:inline-flex;align-items:center;gap:8px;padding:13px 22px;border-radius:10px;border:1px solid var(--line);font-size:15px;font-weight:500;color:rgba(255,255,255,.8);transition:border-color .15s}
.btn-ghost:hover{border-color:var(--bright);color:#fff}
.ld-trust{display:flex;flex-wrap:wrap;gap:8px 22px;margin-top:26px;font-size:13px;color:rgba(255,255,255,.5)}
.ld-trust span{display:inline-flex;align-items:center;gap:7px}
.ld-trust svg{color:var(--bright)}
.ld-webs{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}
.ld-web{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#141414;border:1px solid var(--line);border-radius:12px;padding:15px 17px;font-size:14px;font-weight:500;transition:border-color .15s}
.ld-web:hover{border-color:var(--bright)}
.ld-web small{display:block;font-size:12px;font-weight:300;color:var(--mist);margin-top:2px;word-break:break-all}
.ld-web svg{flex-shrink:0;color:var(--bright)}
.ld-steps{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;counter-reset:paso}
.ld-step{background:#141414;border:1px solid var(--line);border-radius:14px;padding:22px}
.ld-step::before{counter-increment:paso;content:counter(paso);display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:rgba(127,163,245,.14);color:var(--bright);font-weight:600;font-size:14px;margin-bottom:12px}
.ld-step p{font-size:14px;font-weight:300;color:var(--mist)}
.ld-faq{max-width:780px;display:flex;flex-direction:column;gap:10px}
.ld-faq details{background:#141414;border:1px solid var(--line);border-radius:12px;padding:0 20px}
.ld-faq summary{cursor:pointer;padding:18px 0;font-size:16px;font-weight:500;list-style:none;display:flex;justify-content:space-between;gap:16px}
.ld-faq summary::-webkit-details-marker{display:none}
.ld-faq summary::after{content:'+';color:var(--bright);font-size:20px;line-height:1}
.ld-faq details[open] summary::after{content:'–'}
.ld-faq details p{font-size:15px;font-weight:300;color:rgba(255,255,255,.66);padding:0 0 18px}
.ld-two{display:grid;grid-template-columns:1.1fr 1fr;gap:40px;align-items:start}
@media(max-width:820px){.ld-two{grid-template-columns:1fr;gap:24px}}
</style>`;

export function landing(cfg, L) {
  const s = SECTORES.find(x => x.slug === L.slug);
  if (!s) throw new Error(`${L.slug} no está en SECTORES (data.mjs)`);
  const webs = todasLasWebs().filter(w => L.ejemplos.some(d => w.url.includes(d)));
  const dominio = u => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  const titulo = sinResalte(L.h1);
  const msg = `Hola, tengo un negocio de ${s.label.toLowerCase()} y quiero mi web por ${cfg.web.priceFull}.`;
  const loc = L.slug.replace(/^web-/, '').replace(/-/g, '_');

  const bloqueWebs = webs.length ? `<section class="pg-sec">
  <div class="w">
    <h2>Webs que ya hemos hecho <em>para ${esc(L.nombre)}</em></h2>
    <p class="pg-sub">${webs.length === 1 ? 'Un proyecto real' : `${webs.length} proyectos reales`} de este sector, publicados y funcionando. Pulsa para visitarlos: son de clientes reales, no maquetas.</p>
    <div class="ld-webs">
${webs.map(w => `      <a href="${w.url}" target="_blank" rel="noopener" class="ld-web"><span>${esc(w.nombre)}<small>${esc(dominio(w.url))}</small></span>${icon('arrow-up-right', { size: 16 })}</a>`).join('\n')}
    </div>
    <p style="margin-top:22px"><a href="/proyectos" class="card-link">Ver los ${esc(cfg.proyectos.count)} proyectos por sector ${icon('arrow-right', { size: 14 })}</a></p>
  </div>
</section>` : '';

  const relacionados = L.relacionados.map(r => SECTORES.find(x => x.slug === r)).filter(Boolean);

  const cuerpo = `${EXTRA_CSS}
<section class="pg-hero">
  <div class="w">
    <div class="pg-eyebrow">Web para ${esc(s.label.toLowerCase())}</div>
    <h1>${conResalte(L.h1)}</h1>
    <p class="pg-lead">${esc(L.lead)} ${esc(cfg.web.priceLong)}, online en ${esc(cfg.entrega.short)}.</p>
    <div class="ld-hero-cta">
      ${waLink(cfg, msg, `${loc}_hero`, 'btn')}${icon('whatsapp', { size: 18 })}Quiero mi web</a>
      <a href="${webs.length ? '#trabajos' : '/proyectos'}" class="btn-ghost">Ver trabajos reales ${icon('arrow-right', { size: 15 })}</a>
    </div>
    <div class="ld-trust">
      <span>${icon('star', { size: 15 })}${esc(cfg.resenas.display)}</span>
      <span>${icon('check', { size: 15 })}${esc(cfg.proyectos.displayLong)} entregados</span>
      <span>${icon('clock', { size: 15 })}${esc(cfg.entrega.display)}</span>
    </div>
  </div>
</section>

<section class="pg-sec">
  <div class="w">
    <h2>Lo que tiene que hacer <em>la web de tu ${esc(s.singular)}</em></h2>
    <p class="pg-sub">No basta con estar en internet. Esto es lo que preparamos en cada web de ${esc(L.nombre)} para que el que la visita acabe llamando.</p>
    <div class="grid">
${L.claves.map(([t, d]) => `      <div class="card"><span class="card-ico">${icon(s.icon, { size: 20 })}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`).join('\n')}
    </div>
  </div>
</section>
${bloqueWebs ? bloqueWebs.replace('<section class="pg-sec">', '<section class="pg-sec" id="trabajos">') : ''}
<section class="pg-sec">
  <div class="w ld-two">
    <div>
      <h2>Todo incluido <em>por ${esc(cfg.web.price)}</em></h2>
      <p class="pg-sub">${esc(cfg.web.priceLong)}. Sin cuotas mensuales y sin permanencia.</p>
      <ul class="feat">${[
        'Diseño a medida con tus textos, fotos y colores',
        cfg.dominio.incluido,
        'Adaptada al móvil, con botón de llamada y de WhatsApp',
        'SEO local: textos, etiquetas y datos estructurados de tu zona',
        'Preparada para enlazar tu Perfil de Empresa de Google',
        cfg.soporte.displayShort + ': ' + cfg.soporte.detalle.split('. ')[0].toLowerCase(),
        cfg.entrega.display
      ].map(t => `<li>${check}<span>${esc(t)}</span></li>`).join('')}</ul>
      ${waLink(cfg, msg, `${loc}_incluye`, 'btn')}${icon('whatsapp', { size: 18 })}Empezar por WhatsApp</a>
    </div>
    <div>
      <h3>Lo que buscan tus clientes</h3>
      <p class="pg-sub" style="margin-bottom:16px">Estas son búsquedas típicas de tu sector. Escribimos los textos de tu web para responderlas con tu zona de trabajo.</p>
      <div class="chips">${L.busquedas.map(b => `<span class="chip">${esc(b)}</span>`).join('')}</div>
      <p style="font-size:13px;color:var(--mist);margin-top:16px">El posicionamiento orgánico depende de tu competencia y lleva tiempo: no prometemos primeras posiciones, preparamos la web para competir.</p>
    </div>
  </div>
</section>

<section class="pg-sec">
  <div class="w">
    <h2>Cómo <em>trabajamos</em></h2>
    <p class="pg-sub">Sin reuniones eternas ni formularios de veinte campos.</p>
    <div class="ld-steps">
      <div class="ld-step"><h3>Nos escribes</h3><p>Por WhatsApp nos cuentas a qué te dedicas, tu zona y tus servicios. Si tienes fotos y logo, nos los mandas.</p></div>
      <div class="ld-step"><h3>La hacemos</h3><p>Diseño, textos y SEO local. ${esc(cfg.entrega.display)}.</p></div>
      <div class="ld-step"><h3>Revisas y publicamos</h3><p>Pides los cambios que quieras y la publicamos en tu dominio. Pago único de ${esc(cfg.web.priceFull)}.</p></div>
    </div>
  </div>
</section>

<section class="pg-sec">
  <div class="w">
    <h2>Preguntas de <em>${esc(L.nombre)}</em></h2>
    <p class="pg-sub">Lo que más nos preguntan en este sector.</p>
    <div class="ld-faq">
${L.faqs.map(([q, a]) => `      <details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n')}
      <details><summary>¿Cuánto cuesta y qué pago después?</summary><p>${esc(cfg.web.priceLong)}. ${esc(cfg.soporte.detalle)} ${esc(cfg.dominio.renovacionDisplay)}.</p></details>
    </div>
  </div>
</section>

<section class="pg-sec">
  <div class="w">
    <h2>Otros sectores <em>parecidos</em></h2>
    <p class="pg-sub">Si tu negocio toca varios gremios, estas páginas también te pueden servir.</p>
    <div class="chips">${relacionados.map(r => `<a href="/${r.slug}" class="chip">Web para ${esc(r.label.toLowerCase())}</a>`).join('')}<a href="/sectores" class="chip">Todos los sectores</a></div>
  </div>
</section>

<section class="pg-sec">
  <div class="w" style="text-align:center">
    <h2>Tu web de ${esc(s.singular)}, <em>en ${esc(cfg.entrega.short)}</em></h2>
    <p class="pg-sub" style="margin:0 auto 24px">Escríbenos, cuéntanos tu negocio y empezamos hoy.</p>
    ${waLink(cfg, msg, `${loc}_cta`, 'btn')}${icon('whatsapp', { size: 18 })}Hablar por WhatsApp</a>
  </div>
</section>`;

  const url = `${cfg.site.domain}/${L.slug}`;
  return pagina(cfg, {
    titulo: `${titulo} — ${cfg.web.priceFull} | ${cfg.site.brand}`,
    descripcion: `${titulo} por ${cfg.web.priceFull}, pago único. Diseño a medida, dominio, SEO local y botón de WhatsApp. Online en ${cfg.entrega.short}.${webs.length ? ` Mira ${webs.length === 1 ? 'el trabajo real' : `${webs.length} trabajos reales`} del sector.` : ''}`,
    ruta: '/' + L.slug,
    jsonld: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Service',
          name: titulo,
          serviceType: 'Diseño de páginas web',
          url,
          provider: { '@id': cfg.site.domain + '/#org' },
          areaServed: { '@type': 'Country', name: 'España' },
          audience: { '@type': 'BusinessAudience', name: s.label },
          offers: { '@type': 'Offer', price: cfg.web.priceAmount, priceCurrency: cfg.web.priceCurrency, url }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: cfg.site.domain + '/' },
            { '@type': 'ListItem', position: 2, name: 'Sectores', item: cfg.site.domain + '/sectores' },
            { '@type': 'ListItem', position: 3, name: s.label, item: url }
          ]
        },
        {
          '@type': 'FAQPage',
          mainEntity: L.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
        }
      ]
    },
    cuerpo
  });
}
