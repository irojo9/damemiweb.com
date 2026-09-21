# damemiweb.com

Sitio estático servido por **Cloudflare Pages** directamente desde la raíz de
este repositorio. **No hay paso de compilación en el hosting**: lo que hay en
`main` es exactamente lo que se publica.

Por eso el generador de este repositorio reescribe los `.html` *en el sitio* y
el resultado se commitea.

---

## Regla número uno

> Los precios, el número de proyectos, la valoración, el plazo de entrega, la
> cabecera y el pie **no se editan a mano en el HTML**.

Salen de `site.config.json` y de `tools/`, y se propagan con:

```sh
node tools/build.mjs      # reescribe el sitio desde la configuración
node tools/check.mjs      # comprobaciones antes de publicar
```

`build.mjs` es idempotente: ejecutarlo dos veces deja el mismo árbol.

---

## Cómo cambiar algo

| Quiero cambiar… | Toco… | Y luego |
|---|---|---|
| El precio, los proyectos, las reseñas, el plazo, el soporte… | `site.config.json` | `node tools/build.mjs` |
| La cabecera o el pie (los comparten las 127 páginas) | `tools/partials.mjs` | `node tools/build.mjs` |
| Un icono | `tools/icons.mjs` | `node tools/build.mjs` |
| La lista de sectores o ciudades | `tools/data.mjs` | `node tools/build.mjs` |
| `/sectores`, `/auditorias`, `/marketing`, `/aviso-legal` | `tools/paginas-nuevas.mjs` | `node tools/build.mjs` |
| El portfolio de la home o la franja "Otros servicios" | `tools/portfolio.mjs` | `node tools/build.mjs` |
| El texto propio de una página concreta | ese `.html` | `node tools/build.mjs` |

Los ficheros **generados por completo** (no editar a mano): `sitemap.xml`, la
línea `Sitemap:` de `robots.txt`, `sectores.html`, `auditorias.html`,
`marketing.html`, `aviso-legal.html`, y dentro de `dmw.js` los bloques
`dmw:config` y `dmw:icons`.

Dentro de las páginas, lo que hay entre marcadores también es generado:

```html
<!--dmw:header--> … <!--/dmw:header-->
<!--dmw:footer--> … <!--/dmw:footer-->
<!--dmw:portfolio--> … <!--/dmw:portfolio-->   (solo en la home)
<!--dmw:otros--> … <!--/dmw:otros-->           (solo en la home)
```

---

## Antes de publicar

```sh
node tools/check.mjs
```

Comprueba, y falla si algo no cuadra:

1. Que no queden restos de la oferta antigua ni URLs sin `www`.
2. Que cada página tenga **un solo `<h1>`** y un `canonical` con `www`.
3. Que el `sitemap.xml` no contenga URLs en `noindex` ni URLs sin fichero.
4. Que no haya **enlaces internos ni anclas rotas** (crawl local completo).
5. Que el sitio esté regenerado con la configuración actual
   (`node tools/build.mjs --check`, apto para CI).

Para ver el sitio en local:

```sh
python3 -m http.server 8000
```

---

## Dominio canónico

Todo apunta a `https://www.damemiweb.com`. La redirección 301 de
`damemiweb.com` → `www.damemiweb.com` **no está en `_redirects`**: Cloudflare
Pages no permite condicionar una regla por nombre de host. Vive como *Redirect
Rule* de la zona de Cloudflare y debe seguir activa. Comprobación:

```sh
curl -sI https://damemiweb.com/ | grep -i '^location'
# location: https://www.damemiweb.com/
```

---

## El Worker `multi-web` no debe tocar este dominio

La zona `damemiweb.com` de Cloudflare aloja dos cosas distintas:

1. **Este sitio**, servido por Cloudflare Pages desde `main`.
2. **La plataforma multi-web**: el Worker `multi-web`, que sirve las webs de
   clientes desde el bucket R2 `clientes-web`, usando como carpeta el nombre
   del host sin `www.` (`fontanero.com` → `clientes-web/fontanero.com/...`).
   Las webs de cliente se suben ahí desde `irojo9/multiweb-deploy`, y cada
   repositorio de cliente se llama igual que su dominio.

`damemiweb.com` **no vive en R2**: no existe la carpeta `clientes-web/damemiweb.com/`
y no debe existir. Por eso, si una ruta del Worker llega a capturar
`www.damemiweb.com`, el sitio entero devuelve este texto plano:

```
Archivo no encontrado

Dominio: www.damemiweb.com
Carpeta: damemiweb.com
Archivo: index.html
R2 Key: damemiweb.com/index.html
```

Es exactamente lo que pasa con una ruta comodín del tipo `*.damemiweb.com/*`
(la que se añade para los subdominios de previsualización, por ejemplo
`cliente.damemiweb.com`): el comodín no coincide con el ápice `damemiweb.com`,
pero sí con `www.damemiweb.com`. Y como el ápice redirige 301 a `www`, el sitio
público se cae por completo aunque el ápice "funcione".

Reglas para no repetirlo:

- **Nada de rutas comodín sobre esta zona.** Cada subdominio de
  previsualización lleva su propia ruta exacta
  (`cliente.damemiweb.com/*` → Worker `multi-web`).
- Si por lo que sea hace falta el comodín, hay que añadir además las rutas
  `damemiweb.com/*` y `www.damemiweb.com/*` con **Worker: None**: en Cloudflare
  la ruta más específica gana, y así el sitio corporativo vuelve a Pages.

Comprobación (debe devolver el HTML del sitio, no el texto de arriba):

```sh
curl -s https://www.damemiweb.com/ | head -1
# <!DOCTYPE html>
```

Dónde se mira: **Workers & Pages → `multi-web` → Settings → Domains & Routes**.

---

## Cambios pendientes de decisión

`site.config.json` → `fase4` guarda dos cambios **implementados y apagados**,
con su razonamiento en el bloque `_fase4`. Activarlos es poner el interruptor a
`true` y ejecutar `node tools/build.mjs`; volver a `false` los deshace.
