/**
 * Etiqueta de Google (gtag.js) de todas las páginas: GA4 y, si está
 * configurada, Google Ads. Se genera desde site.config.json → site.ga4 y
 * googleAds, y tools/build.mjs la reescribe en cada página.
 *
 * Lleva Consent Mode v2: por defecto todo denegado hasta que el visitante
 * acepta en el banner de cookies (dmw.js hace el `consent update`). Si ya
 * aceptó en otra visita, se concede desde el principio para no perder la
 * primera página vista. Google Ads lo exige en el EEE para medir
 * conversiones y usar audiencias.
 */

export const ETIQUETA_RE = /<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=[^"]*"><\/script>\s*<script>(?:(?!<\/script>)[\s\S])*?gtag\(\s*'config'(?:(?!<\/script>)[\s\S])*<\/script>/;

export function etiquetaGoogle(cfg) {
  const ga4 = cfg.site.ga4;
  const ads = cfg.googleAds?.id;
  const consentimiento =
    "(function(){var s='denied';try{if(localStorage.getItem('cookie-consent')==='accepted')s='granted'}catch(e){}"
    + "gtag('consent','default',{ad_storage:s,ad_user_data:s,ad_personalization:s,analytics_storage:s,wait_for_update:500})})();";
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${ga4}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}${consentimiento}gtag('js',new Date());gtag('config','${ga4}');${ads ? `gtag('config','${ads}');` : ''}</script>`;
}
