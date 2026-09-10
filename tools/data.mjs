/**
 * Datos estructurales del sitio: sectores, ciudades y categorías de proyectos.
 * Los contadores de proyectos NO se escriben a mano: se calculan desde
 * proyectos.html en tools/build.mjs (contarProyectos).
 */

export const SECTORES = [
  { slug: 'web-fontaneros',         label: 'Fontaneros',        singular: 'fontanería',      icon: 'wrench'    },
  { slug: 'web-electricistas',      label: 'Electricistas',     singular: 'electricista',    icon: 'plug'      },
  { slug: 'web-peluquerias',        label: 'Peluquerías',       singular: 'peluquería',      icon: 'scissors'  },
  { slug: 'web-restaurantes',       label: 'Restaurantes',      singular: 'restaurante',     icon: 'utensils'  },
  { slug: 'web-mudanzas',           label: 'Mudanzas',          singular: 'empresa de mudanzas', icon: 'truck' },
  { slug: 'web-reformas',           label: 'Reformas',          singular: 'empresa de reformas', icon: 'hammer'},
  { slug: 'web-abogados',           label: 'Abogados',          singular: 'despacho',        icon: 'scale'     },
  { slug: 'web-dentistas',          label: 'Dentistas',         singular: 'clínica dental',  icon: 'tooth'     },
  { slug: 'web-psicologos',         label: 'Psicólogos',        singular: 'consulta',        icon: 'brain'     },
  { slug: 'web-academias',          label: 'Academias',         singular: 'academia',        icon: 'book'      },
  { slug: 'web-fotografos',         label: 'Fotógrafos',        singular: 'estudio',         icon: 'camera'    },
  { slug: 'web-coaches',            label: 'Coaches',           singular: 'consultoría',     icon: 'target'    },
  { slug: 'web-nutricionistas',     label: 'Nutricionistas',    singular: 'consulta',        icon: 'apple'     },
  { slug: 'web-talleres-mecanicos', label: 'Talleres mecánicos',singular: 'taller',          icon: 'car'       }
];

export const CIUDADES = [
  { slug: 'diseno-web-a-coruna',   label: 'A Coruña'   },
  { slug: 'diseno-web-alicante',   label: 'Alicante'   },
  { slug: 'diseno-web-barcelona',  label: 'Barcelona'  },
  { slug: 'diseno-web-bilbao',     label: 'Bilbao'     },
  { slug: 'diseno-web-burgos',     label: 'Burgos'     },
  { slug: 'diseno-web-cordoba',    label: 'Córdoba'    },
  { slug: 'diseno-web-gijon',      label: 'Gijón'      },
  { slug: 'diseno-web-granada',    label: 'Granada'    },
  { slug: 'diseno-web-las-palmas', label: 'Las Palmas' },
  { slug: 'diseno-web-logrono',    label: 'Logroño'    },
  { slug: 'diseno-web-madrid',     label: 'Madrid'     },
  { slug: 'diseno-web-malaga',     label: 'Málaga'     },
  { slug: 'diseno-web-murcia',     label: 'Murcia'     },
  { slug: 'diseno-web-palma',      label: 'Palma'      },
  { slug: 'diseno-web-pamplona',   label: 'Pamplona'   },
  { slug: 'diseno-web-salamanca',  label: 'Salamanca'  },
  { slug: 'diseno-web-santander',  label: 'Santander'  },
  { slug: 'diseno-web-sevilla',    label: 'Sevilla'    },
  { slug: 'diseno-web-valencia',   label: 'Valencia'   },
  { slug: 'diseno-web-valladolid', label: 'Valladolid' },
  { slug: 'diseno-web-vigo',       label: 'Vigo'       },
  { slug: 'diseno-web-vitoria',    label: 'Vitoria'    },
  { slug: 'diseno-web-zaragoza',   label: 'Zaragoza'   }
];

/**
 * Bloques de /proyectos. El campo `count` NO se rellena aquí: build.mjs lo
 * calcula contando las tarjetas reales de cada bloque en proyectos.html.
 */
export const CATEGORIAS_PROYECTOS = [
  { key: 'Hogar y Servicios',       href: '/web-fontaneros',  icon: 'wrench',   color: '#22c55e' },
  { key: 'Reformas y Construcción', href: '/web-reformas',    icon: 'hammer',   color: '#f59e0b' },
  { key: 'Transporte y Mudanzas',   href: '/web-mudanzas',    icon: 'truck',    color: '#3b82f6' },
  { key: 'Comercio y Tiendas',      href: '/sectores',        icon: 'store',    color: '#a855f7' },
  { key: 'Formación y Tech',        href: '/web-academias',   icon: 'book',     color: '#7FA3F5' },
  { key: 'Otros sectores',          href: '/sectores',        icon: 'layers',   color: '#ef4444' }
];
