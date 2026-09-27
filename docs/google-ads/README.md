# Campaña de Google Ads: contactos por WhatsApp

**Objetivo:** que quien busca una web para su negocio nos escriba por WhatsApp
para contratar la web de **250€ + IVA, pago único**.

**Conversión que optimizamos:** clic en cualquier enlace de WhatsApp de la web
(cabecera, hero, barra móvil, botón flotante, modal de salida…). Ya lo mide
`dmw.js`; en cuanto se rellena `googleAds` en `site.config.json` se envía
también como conversión de Google Ads.

Ficheros de esta carpeta (listos para importar con **Google Ads Editor**):

| Fichero | Qué es |
|---|---|
| `grupos.csv` | Los 18 grupos de anuncios con su CPC máximo inicial |
| `anuncios.csv` | Un anuncio adaptable (RSA) por grupo: 15 titulares, 4 descripciones, rutas y URL final |
| `palabras-clave.csv` | 176 palabras clave (concordancia de frase + exacta) |
| `negativas.csv` | Negativas a nivel de campaña (gratis, cursos, Wix, empleo…) |

Todos los titulares tienen ≤ 30 caracteres, las descripciones ≤ 90 y las rutas ≤ 15.

> Ojo: esta carpeta se publica con el resto del repositorio (Cloudflare Pages
> sirve la raíz). `_headers` le pone `noindex`, pero cualquiera con la URL
> puede verla. No guardar aquí nada privado (presupuestos reales, datos de
> clientes, accesos).

---

## 1. Estructura

### Campaña 1 · `DMW | Search | Web 250€` — la principal

Búsquedas genéricas de gente que quiere una web. Aterrizan en la home o en
`/precios`.

| Grupo | Intención | URL final |
|---|---|---|
| Web barata y precio | "página web barata", "pago único", "sin cuotas", "precio" | `/precios` |
| Web autonomos y pymes | "página web para autónomos / mi negocio / pymes" | `/` |
| Diseno web profesional | "empresa / agencia de diseño web", "contratar página web" | `/` |
| Web rapida | "página web urgente / rápida / en 72 horas" | `/` |

### Campaña 2 · `DMW | Search | Sectores`

Un grupo por sector, cada uno a **su landing de sector**, que ya existe
(`/web-fontaneros`, `/web-reformas`…). Coincidencia búsqueda → anuncio →
página muy alta = mejor nivel de calidad y CPC más barato.

Fontaneros, electricistas, reformas, mudanzas, peluquerías, restaurantes,
dentistas, abogados, psicólogos, talleres, estética, cerrajeros,
climatización y academias.

Van en campaña aparte para poder darles su propio presupuesto: tienen menos
volumen pero convierten mejor. Si algún grupo sale como "volumen de búsqueda
bajo", no pasa nada: se deja y se mira en un mes.

---

## 2. Configuración de las campañas

| Ajuste | Valor |
|---|---|
| Tipo | Búsqueda (Search). **Sin** Red de Display. **Sin** socios de búsqueda al principio |
| Ubicación | España · opción **"Presencia: personas que están en tus ubicaciones"** (no "interés") |
| Idioma | Español |
| Dispositivos | Todos. WhatsApp convierte sobre todo en móvil: revisar a las 2 semanas |
| Horario | 24/7 al principio; con datos, bajar puja de madrugada si no convierte |
| Presupuesto | **15 €/día** Campaña 1 + **5 €/día** Campaña 2 (≈ 600 €/mes) |
| Puja semanas 1–2 | **Maximizar clics** con CPC máx. 1,20 € (1,00 € en sectores) |
| Puja después | **Maximizar conversiones** cuando haya ≥ 15–20 conversiones; luego **CPA objetivo** |
| Rotación | Optimizar (por defecto) |
| Conversión de la campaña | Solo "Contacto WhatsApp" como principal (ver §4) |

**Cuánto podemos pagar por contacto.** Con una venta de 250€ y cerrando,
por ejemplo, 1 de cada 3 conversaciones de WhatsApp, pagar **25 € por
contacto** son **75 € por venta**. Ese es el techo razonable para arrancar;
el dato real de cierre lo da el paso 5.

---

## 3. Recursos (extensiones)

Se añaden a nivel de cuenta o de las dos campañas.

**Enlaces de sitio** (texto ≤ 25, descripciones ≤ 35):

| Texto | URL | Descripción 1 | Descripción 2 |
|---|---|---|---|
| Precios | `/precios` | 250€ + IVA, pago único | Sin cuotas ni permanencia |
| Webs que hemos hecho | `/proyectos` | +111 webs entregadas | Mira ejemplos de tu sector |
| Opiniones de clientes | `/resenas` | 5,0 en Google | 83 reseñas en Google |
| Preguntas frecuentes | `/preguntas-frecuentes` | Plazos, dominio y soporte | Todo lo que incluye tu web |
| Webs por sector | `/sectores` | Fontaneros, reformas y más | Diseñadas para tu gremio |

**Textos destacados** (≤ 25): `Pago único` · `Sin cuotas mensuales` ·
`Dominio .com incluido` · `Online en 72 h` · `12 meses de soporte` ·
`5,0 en Google` · `Respuesta por WhatsApp`

**Fragmentos estructurados** — encabezado *Servicios*: `Diseño web`,
`SEO local`, `Dominio .com`, `Botón de WhatsApp`, `Formulario de contacto`,
`Ficha de Google`.

**Llamada:** 662 549 694, solo en horario en que se coge el teléfono.
Conversión de llamadas: *llamadas desde anuncios de ≥ 60 s*, como
**secundaria**.

**Precio:** tipo *Servicios* · "Página web profesional" · 250 € · "Pago
único + IVA" · URL `/precios`.

**Imagen y logotipo:** `logo_damemiweb_icon.png` y capturas de
`/proyectos-capturas/` (cuadradas y 1,91:1).

**Mensaje / WhatsApp:** si la cuenta ofrece el recurso de mensaje con
WhatsApp, añadirlo con el 662 549 694 y el texto "Hola, quiero mi web por
250€ + IVA.". No está disponible en todas las cuentas; la campaña no depende
de él porque la conversión se mide en la web.

---

## 4. Medición: pasos para activarla

La web ya lleva:

- **Consent Mode v2** en todas las páginas (`tools/gtag.mjs`): todo denegado
  hasta que el visitante acepta el banner. Google lo exige en el EEE para
  medir conversiones de Ads.
- Evento `contacto_whatsapp` en GA4 en cada clic de WhatsApp.
- Conversión de Google Ads en cada clic de WhatsApp, **en cuanto se rellene
  la config**.
- Si la visita viene de un anuncio (`gclid`, `gbraid`, `wbraid` o
  `utm_source=google&utm_medium=cpc`), el mensaje de WhatsApp termina en
  **"Te encontré en Google."**. Así se sabe qué conversaciones trae la
  campaña.

Para activarlo:

1. Google Ads → **Objetivos → Conversiones → Nueva acción → Sitio web →
   configurar manualmente**.
   - Nombre: `Contacto WhatsApp`
   - Categoría: **Contacto**
   - Valor: 25 € (el CPA objetivo; se ajusta con el dato real)
   - Recuento: **Una** (varios clics de la misma persona = 1 contacto)
   - Ventana de conversión por clic: 30 días
   - Acción **principal**
2. En "Configuración de la etiqueta → Usar Google tag" copiar:
   - el ID `AW-XXXXXXXXXX`
   - la etiqueta de conversión (lo que va tras la barra en
     `send_to: 'AW-XXXXXXXXXX/abcDEF123'`)
3. Ponerlos en `site.config.json`:
   ```json
   "googleAds": { "id": "AW-XXXXXXXXXX", "conversionWhatsapp": "abcDEF123" }
   ```
4. `node tools/build.mjs && node tools/check.mjs`, commit y publicar.
5. Comprobar con **Google Tag Assistant** (tagassistant.google.com): al
   aceptar cookies y pulsar un WhatsApp debe salir el evento `conversion`.
   En Google Ads la acción pasa a "Registrando conversiones" en unas horas.
6. Vincular **GA4 ↔ Google Ads** (Admin de GA4 → Vinculación de productos)
   para ver audiencias y, si se quiere, importar `contacto_whatsapp` como
   conversión **secundaria** (nunca las dos como principales: contaría doble).
7. Activar **conversiones avanzadas**: no aplica, no recogemos email en el
   clic de WhatsApp. Se puede ignorar el aviso.

---

## 5. Cerrar el círculo: de clic a venta

Un clic en WhatsApp no es un cliente. Para saber si la campaña da dinero:

- Etiquetar en **WhatsApp Business** con una etiqueta `Google Ads` cada chat
  que llegue con "Te encontré en Google.", y marcar `Vendido` cuando se
  cierre.
- Cada lunes apuntar: contactos de Ads, ventas de Ads y gasto. Con eso sale el
  **coste por venta real**, que es la cifra que decide si se sube o baja el
  presupuesto.
- Más adelante, si hay volumen, se puede subir a Google Ads una conversión
  offline "Venta" para que la puja optimice por ventas y no por clics.

---

## 6. Calendario de optimización

| Cuándo | Qué hacer |
|---|---|
| Día 1–3 | Revisar que los anuncios estén aprobados y que la conversión registre. Mirar el **informe de términos de búsqueda** a diario y añadir negativas |
| Semana 1–2 | Negativas 2 veces por semana. Pausar palabras clave con gasto > 25 € y 0 conversiones |
| Semana 2 | Si hay ≥ 15 conversiones → pasar a **Maximizar conversiones**. Revisar móvil vs. escritorio y horarios |
| Semana 4 | Mirar los titulares con rendimiento "Bajo" en los RSA y sustituirlos. Mover presupuesto hacia los grupos con mejor coste por contacto |
| Mes 2 | Con ≥ 30 conversiones/mes → **CPA objetivo** al CPA real de las últimas 4 semanas. Probar socios de búsqueda |
| Mes 3 | Valorar campaña de **remarketing** (Display/YouTube) a quien visitó `/precios` y no escribió |

**Términos de búsqueda típicos a vigilar** (añadir como negativas si salen):
nombres de otras agencias, "gratis", "curso", "plantilla", "dominio" suelto,
"hosting" suelto, "correo corporativo", "tienda online" (si no se quiere ese
producto), búsquedas en catalán/gallego/euskera si no se atienden.

---

## 7. Checklist antes de lanzar

- [ ] Conversión `Contacto WhatsApp` creada y `googleAds` rellenado en `site.config.json`
- [ ] Sitio regenerado y publicado; Tag Assistant muestra `conversion` al pulsar WhatsApp
- [ ] Importados `grupos.csv`, `palabras-clave.csv`, `anuncios.csv` y `negativas.csv` en Google Ads Editor (crear antes las 2 campañas con los ajustes de §2)
- [ ] Recursos de §3 añadidos
- [ ] Facturación configurada y presupuesto diario puesto
- [ ] WhatsApp Business con respuesta rápida y mensaje de ausencia fuera de horario (el que responde en 5 minutos gana)
- [ ] Etiquetas `Google Ads` y `Vendido` creadas en WhatsApp Business

## 8. Importar en Google Ads Editor

1. Descargar la cuenta en Google Ads Editor.
2. Crear a mano las dos campañas con los nombres exactos
   `DMW | Search | Web 250€` y `DMW | Search | Sectores` y los ajustes de §2.
3. *Cuenta → Importar → Desde archivo*, en este orden: `grupos.csv`,
   `palabras-clave.csv`, `anuncios.csv`, `negativas.csv`.
4. Revisar los cambios propuestos (Editor avisa si alguna columna no la
   reconoce) y **Publicar**.

Los CSV se generaron comprobando los límites de caracteres; si se edita un
titular a mano, que siga en ≤ 30 caracteres.
