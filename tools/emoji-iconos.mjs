/**
 * FASE 3 — Emojis usados como iconografía → iconos SVG del set único.
 *
 * Solo se tocan los emojis que hacen de icono, identificados por la clase del
 * elemento que los contiene (nav, pie, tarjetas, listas de enlaces, contacto…).
 * Los emojis dentro del texto redaccional de los artículos del blog se quedan
 * como están: ahí son parte de la escritura, no interfaz.
 */

/** Clase del contenedor → tamaño del icono que la sustituye. */
export const CONTEXTOS = {
  // Ilustración grande del hero de las páginas de ciudad y sector
  'hero-vis-num': 44, 'hvis': 44, 'hero-img': 44, 'ac-img-inner': 40,
  // Iconos de tarjeta
  'bc-ico': 24, 'sc-ico': 24, 'rc-ico': 24, 'benefit-icon': 24, 'inc-ico': 24,
  'rec-ico': 24, 'card-icon': 24, 'ch-icon': 24, 'sector-icon': 22,
  'eco-sat-ico': 24, 'cway-ico': 22,
  // Iconos en línea
  'rl': 18, 'sl-ico': 20, 'ht-icon': 17, 'tico': 18, 'step-chip': 15,
  'rc-note': 16, 'solution-label': 16, 'qa-btn-ico': 17, 'toc-emoji': 17,
  'n-client-ico': 16, 'card-title': 18, 'bc-img': 40, 'fsoc': 19
};

/**
 * Emoji → nombre del icono. Los emojis decorativos de ciudad (🏛️, 🌉, 🌴…)
 * comparten icono a propósito: la ilustración pasa a ser una marca de lugar
 * coherente en las 23 páginas en vez de 23 dibujos distintos.
 */
export const MAPA = {
  '📍': 'map-pin', '🗺️': 'map-pin', '🗺': 'map-pin',
  '🔍': 'search', '🔬': 'search',
  '💬': 'message', '📣': 'message',
  '🌐': 'globe',
  '💰': 'euro', '💳': 'euro', '💸': 'euro',
  '⚡': 'zap', '🚨': 'zap',
  '📸': 'camera', '📷': 'camera', '🖼️': 'camera', '🖼': 'camera',
  '⭐': 'star', '🌟': 'star', '🏅': 'star', '🏆': 'star',
  '🔧': 'wrench', '🔩': 'wrench', '🛠️': 'wrench', '🛠': 'wrench',
  '🔨': 'hammer',
  '🚛': 'truck',
  '✂️': 'scissors', '✂': 'scissors',
  '📚': 'book', '📰': 'file-text', '📄': 'file-text', '🧾': 'file-text',
  '📋': 'file-text', '🎫': 'file-text', '📝': 'pencil',
  '⚖️': 'scale', '⚖': 'scale',
  '🎯': 'target', '⚽': 'target',
  '📅': 'calendar',
  '✓': 'check', '✅': 'check',
  '🦷': 'tooth',
  '🧠': 'brain',
  '📱': 'smartphone', '📲': 'smartphone',
  '💻': 'monitor',
  '🤖': 'sparkles', '🎁': 'sparkles', '🎉': 'sparkles',
  '🚀': 'rocket',
  '🤝': 'handshake',
  '🎵': 'tiktok',
  '🍽️': 'utensils', '🍽': 'utensils', '🍴': 'utensils',
  '📞': 'phone',
  '🥗': 'apple',
  '🛍️': 'store', '🛍': 'store', '🏠': 'store', '🏦': 'store',
  '💡': 'lightbulb',
  '✍️': 'pencil', '✍': 'pencil', '✏': 'pencil', '✏️': 'pencil', '🎨': 'pencil',
  '👋': 'user', '👤': 'user',
  '💌': 'mail', '📧': 'mail', '📤': 'mail',
  '🔑': 'shield',
  '📈': 'chart',
  '🚗': 'car', '🔒': 'shield',
  // Ilustraciones de ciudad
  '🏙️': 'map-pin', '🏙': 'map-pin', '🏛️': 'map-pin', '🏛': 'map-pin',
  '🏰': 'map-pin', '🌉': 'map-pin', '⛪': 'map-pin', '🌸': 'map-pin',
  '🏔️': 'map-pin', '🏔': 'map-pin', '🌴': 'map-pin', '🍷': 'map-pin',
  '☀️': 'map-pin', '☀': 'map-pin', '🍋': 'map-pin', '🏝️': 'map-pin',
  '🏝': 'map-pin', '🐂': 'map-pin', '🌺': 'map-pin', '🌿': 'map-pin',
  '🌊': 'map-pin', '⚓': 'map-pin', '🏖️': 'map-pin', '🏖': 'map-pin'
};

/** Emojis con presentación de imagen, más el selector de variación opcional. */
const EMOJI_RE = /(?:[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]|[\u{2B00}-\u{2BFF}]|[\u{2190}-\u{21FF}])\u{FE0F}?/gu;

/** Símbolos tipográficos que NO son emoji-icono y se quedan como texto. */
const CONSERVAR = new Set(['→', '←', '↑', '↓', '↗', '✕', '✔', '★', '☆', '·', '✦']);

/**
 * Devuelve el nombre de clase reconocido del elemento abierto justo antes de
 * `pos`, o null si ese elemento no es un contenedor de iconos.
 */
function contexto(html, pos) {
  const i = html.lastIndexOf('<', pos);
  if (i === -1) return null;
  const fin = html.indexOf('>', i);
  if (fin === -1 || fin > pos) return null;
  const tag = html.slice(i, fin);
  const cls = tag.match(/class="([^"]*)"/);
  if (!cls) return null;
  for (const nombre of cls[1].split(/\s+/)) {
    if (Object.prototype.hasOwnProperty.call(CONTEXTOS, nombre)) return nombre;
  }
  return null;
}

export function sustituirEmojiIconos(html, icon, avisar) {
  return html.replace(EMOJI_RE, (emoji, pos) => {
    if (CONSERVAR.has(emoji) || CONSERVAR.has(emoji[0])) return emoji;
    const clase = contexto(html, pos);
    if (!clase) return emoji;
    const nombre = MAPA[emoji] || MAPA[emoji.replace('️', '')];
    if (!nombre) { avisar?.(`emoji sin icono equivalente: ${emoji} (clase ${clase})`); return emoji; }
    return icon(nombre, { size: CONTEXTOS[clase], style: 'vertical-align:middle;flex-shrink:0' });
  });
}
