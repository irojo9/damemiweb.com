/**
 * Set único de iconos SVG inline de damemiweb.com.
 *
 * Todos los iconos comparten el mismo trazo (Feather/Lucide, 24x24, stroke
 * currentColor, 1.75 de grosor) para que el sitio se vea como un solo sistema.
 * Sustituyen a los emojis que se usaban como iconografía en nav, footer,
 * tarjetas y contacto.
 *
 * Uso: icon('wrench', {size:20, cls:'sl-ico'})
 *  - Decorativo por defecto: sale con aria-hidden="true" y sin nombre accesible.
 *  - icon('whatsapp', {label:'WhatsApp'}) lo convierte en img con <title>.
 */

const P = {
  // Navegación e interfaz
  'chevron-down': '<path d="M6 9l6 6 6-6"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  'arrow-up-right': '<path d="M7 17L17 7"/><path d="M8 7h9v9"/>',
  'menu': '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
  'close': '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
  'check': '<path d="M4 12.5l5 5L20 6.5"/>',
  'plus': '<path d="M12 5v14"/><path d="M5 12h14"/>',
  'user': '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5"/>',
  'star': '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',

  // Contacto y redes
  'whatsapp': '<path d="M3.5 20.5l1.3-4.3A8.2 8.2 0 1 1 8 19.4l-4.5 1.1z"/><path d="M9 9.2c0 3 2.3 5.3 5.2 5.4.6 0 1.1-.4 1.2-1l.1-.6-2-.9-.8 1a4.6 4.6 0 0 1-2-2l1-.8-.9-2-.6.1c-.6.1-1.1.6-1.2 1.2z"/>',
  'instagram': '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.8"/><path d="M17.2 6.8h.01"/>',
  'tiktok': '<path d="M14 4v10.2a3.3 3.3 0 1 1-2.6-3.2"/><path d="M14 4c.4 2.3 2 3.8 4.4 4"/>',
  'mail': '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M4 7l8 5.5L20 7"/>',
  'phone': '<path d="M6.5 3.8h3l1.4 3.6-2 1.4a10.5 10.5 0 0 0 5.3 5.3l1.4-2 3.6 1.4v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 6a2 2 0 0 1 2-2.2z"/>',
  'message': '<path d="M4 5.5h16v11H9l-5 4z"/>',
  'map-pin': '<path d="M12 21s6.5-6 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15 12 21 12 21z"/><circle cx="12" cy="10.5" r="2.5"/>',

  // Propuesta de valor
  'zap': '<path d="M13.5 3L5 13.5h5.5L10 21l8.5-10.5H13z"/>',
  'search': '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  'globe': '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5a14 14 0 0 1 0 17"/><path d="M12 3.5a14 14 0 0 0 0 17"/>',
  'euro': '<path d="M17.5 6.5a6.5 6.5 0 1 0 0 11"/><path d="M4.5 10.5h8"/><path d="M4.5 13.5h8"/>',
  'clock': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  'shield': '<path d="M12 3.5l7 2.6v5.2c0 4-2.9 7.3-7 9-4.1-1.7-7-5-7-9V6.1z"/>',
  'sparkles': '<path d="M12 3.5l1.7 4.3 4.3 1.7-4.3 1.7L12 15.5l-1.7-4.3L6 9.5l4.3-1.7z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  'layers': '<path d="M12 3.5l8.5 4.3L12 12 3.5 7.8z"/><path d="M3.5 12.2L12 16.5l8.5-4.3"/><path d="M3.5 16.4L12 20.7l8.5-4.3"/>',
  'chart': '<path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16.5V11"/><path d="M13 16.5V7.5"/><path d="M18 16.5v-4"/>',
  'file-text': '<path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z"/><path d="M14 3.5v5h5"/><path d="M8.5 13h7"/><path d="M8.5 16.5h5"/>',
  'monitor': '<rect x="3" y="4.5" width="18" height="12" rx="2"/><path d="M9 20.5h6"/><path d="M12 16.5v4"/>',
  'rocket': '<path d="M12 3.5c3.5 2 5.5 5.5 5.5 9.5L12 18l-5.5-5c0-4 2-7.5 5.5-9.5z"/><circle cx="12" cy="10" r="1.8"/><path d="M8.5 17c-1.5.8-2 2.2-2 3.8 1.6 0 3-.5 3.8-2"/>',
  'pencil': '<path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19z"/>',
  'lightbulb': '<path d="M9 17h6"/><path d="M10 20.5h4"/><path d="M12 3.5a5.5 5.5 0 0 1 3.3 9.9c-.5.4-.8 1-.8 1.6H9.5c0-.6-.3-1.2-.8-1.6A5.5 5.5 0 0 1 12 3.5z"/>',

  // Sectores
  'wrench': '<path d="M15.5 4.5a4.5 4.5 0 0 0-5.9 5.9L4 16l4 4 5.6-5.6a4.5 4.5 0 0 0 5.9-5.9l-2.8 2.8-2.5-2.5z"/>',
  'plug': '<path d="M9 3.5v5"/><path d="M15 3.5v5"/><path d="M6.5 8.5h11v3a5.5 5.5 0 0 1-11 0z"/><path d="M12 17v3.5"/>',
  'scissors': '<circle cx="6.5" cy="18" r="2.5"/><circle cx="6.5" cy="6" r="2.5"/><path d="M8.5 7.5L20 18"/><path d="M8.5 16.5L20 6"/>',
  'utensils': '<path d="M7 3.5v8"/><path d="M4.5 3.5v4a2.5 2.5 0 0 0 5 0v-4"/><path d="M7 11.5v9"/><path d="M17.5 3.5c-1.5 1.5-2 3-2 5s.7 2.5 2 2.5v9"/>',
  'truck': '<path d="M3 6.5h10v10H3z"/><path d="M13 9.5h4l3 3v4h-7z"/><circle cx="7" cy="18.5" r="1.8"/><circle cx="17" cy="18.5" r="1.8"/>',
  'hammer': '<path d="M13.5 6.5l-9 9 3.5 3.5 9-9"/><path d="M12 5l4-1.5 4.5 4.5L19 12l-3.5-3.5z"/>',
  'scale': '<path d="M12 4v16"/><path d="M6 20h12"/><path d="M4 9.5l3-5 3 5a3 3 0 0 1-6 0z"/><path d="M14 9.5l3-5 3 5a3 3 0 0 1-6 0z"/>',
  'tooth': '<path d="M7 3.8c1.8 0 2.6 1 5 1s3.2-1 5-1c2 0 2.5 2.3 2 5-.4 2-1 2.6-1.4 5.4-.3 2.3-.6 5.3-2.1 5.3-1.4 0-1.6-2.4-2-4.5-.3-1.6-.7-2.5-1.5-2.5s-1.2.9-1.5 2.5c-.4 2.1-.6 4.5-2 4.5-1.5 0-1.8-3-2.1-5.3C6.5 11.4 5.9 10.8 5.5 8.8c-.5-2.7 0-5 1.5-5z"/>',
  'brain': '<path d="M12 5a3 3 0 0 0-5.6 1.5A3 3 0 0 0 5 12a3 3 0 0 0 2 4.8A2.8 2.8 0 0 0 12 19z"/><path d="M12 5a3 3 0 0 1 5.6 1.5A3 3 0 0 1 19 12a3 3 0 0 1-2 4.8A2.8 2.8 0 0 1 12 19z"/><path d="M12 5v14"/>',
  'book': '<path d="M4.5 4.5h10a3 3 0 0 1 3 3v12H7.5a3 3 0 0 1-3-3z"/><path d="M17.5 19.5h2v-15h-2"/>',
  'camera': '<path d="M4 8h3.5l1.5-2.5h6L16.5 8H20v11H4z"/><circle cx="12" cy="13.2" r="3.5"/>',
  'target': '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>',
  'apple': '<path d="M12 7c-3 0-5.5 2.2-5.5 5.7 0 3.5 2.4 7.8 4.3 7.8.9 0 1.2-.6 2.2-.6s1.3.6 2.2.6c1.9 0 4.3-4.3 4.3-7.8C19.5 9.2 17 7 14 7c-.8 0-1.4.3-2 .3S12.8 7 12 7z"/><path d="M12.5 6.5c0-1.7 1.2-3 2.8-3.2"/>',
  'car': '<path d="M4.5 16v3h3v-3"/><path d="M16.5 16v3h3v-3"/><path d="M3.5 16v-4l2-5h13l2 5v4z"/><path d="M6.5 12.5h2"/><path d="M15.5 12.5h2"/>',
  'store': '<path d="M4 9.5V20h16V9.5"/><path d="M3 9.5L5 4.5h14l2 5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z"/><path d="M10 20v-5.5h4V20"/>',
  'calendar': '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M8 3v4"/><path d="M16 3v4"/><path d="M3.5 10h17"/>',
  'smartphone': '<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>',
  'handshake': '<path d="M3 12.5l4-4 3 2.5 4-3.5 3 2.5"/><path d="M7 8.5L11 5l6 3.5 4 4-3 3-3-2.5"/><path d="M3 12.5l3 3 3-1.5"/>',
  'briefcase': '<rect x="3" y="7.5" width="18" height="12" rx="2"/><path d="M9 7.5V5.5h6v2"/><path d="M3 12.5h18"/>',
  'key': '<circle cx="8" cy="15" r="4"/><path d="M10.8 12.2L20 3"/><path d="M17 6l3 3"/><path d="M14.5 8.5l2.5 2.5"/>',
  'flame': '<path d="M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-2 2-3 4-3 6-1-1-1.5-2-1.5-3C7 10 6 12.5 6 15a6 6 0 0 0 6 6z"/>',
  'paint-roller': '<rect x="4" y="3.5" width="14" height="5" rx="1.5"/><path d="M18 6h2v5h-8v3"/><path d="M11 14h2v6.5h-2z"/>',
  'roof': '<path d="M2.5 12L12 4l9.5 8"/><path d="M5.5 10v10h13V10"/><path d="M10 20v-5h4v5"/>',
  'cog': '<circle cx="12" cy="12" r="3"/><path d="M12 3.5v2.5"/><path d="M12 18v2.5"/><path d="M3.5 12H6"/><path d="M18 12h2.5"/><path d="M6 6l1.8 1.8"/><path d="M16.2 16.2L18 18"/><path d="M6 18l1.8-1.8"/><path d="M16.2 7.8L18 6"/>',
  'box': '<path d="M3.5 7.5L12 3.5l8.5 4v9L12 20.5l-8.5-4z"/><path d="M3.5 7.5L12 11.5l8.5-4"/><path d="M12 11.5v9"/>',
  'leaf': '<path d="M5 19c0-8 5-13.5 15-14.5C19 14.5 13.5 19 5 19z"/><path d="M5 19l7-7"/>',
  'bug': '<rect x="7.5" y="8" width="9" height="12" rx="4.5"/><path d="M9.5 8a2.5 2.5 0 0 1 5 0"/><path d="M12 12v8"/><path d="M4 13h3.5"/><path d="M16.5 13H20"/><path d="M5 8.5l2.8 1.8"/><path d="M19 8.5l-2.8 1.8"/><path d="M5 18.5l2.8-1.5"/><path d="M19 18.5l-2.8-1.5"/>',
  'building': '<rect x="5" y="3.5" width="14" height="17" rx="1.5"/><path d="M9 7.5h1.5"/><path d="M13.5 7.5H15"/><path d="M9 11.5h1.5"/><path d="M13.5 11.5H15"/><path d="M10.5 20.5v-4h3v4"/>',
  'bag': '<path d="M5 8h14l-1 12.5H6z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/>'
};

export function icon(name, opts = {}) {
  const path = P[name];
  if (!path) throw new Error(`Icono desconocido: ${name}`);
  const size = opts.size || 20;
  const cls = opts.cls ? ` class="${opts.cls}"` : '';
  const style = opts.style ? ` style="${opts.style}"` : '';
  const sw = opts.stroke || 1.75;
  const a11y = opts.label
    ? ` role="img" aria-label="${opts.label}"`
    : ' aria-hidden="true" focusable="false"';
  return `<svg${cls}${style} width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${a11y}>${path}</svg>`;
}

export const iconNames = Object.keys(P);
