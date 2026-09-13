# Mudanza Express

Juego arcade servido en `/juego_mudanzas`.

## Por qué está reescrito

El prototipo original (adjunto por el cliente en `Mudanza-Express-juego.rar`) era
una aplicación **React + Vite + Babylon.js** con tres PNG de 1920×1920 que
sumaban **10,6 MB**. Este repositorio es el artefacto que despliega Cloudflare
Pages tal cual: no hay paso de compilación, así que no podía publicarse sin
montar un bundler en el hosting y sin cargar 1,5 MB de motor 3D más los assets.

Se reescribió como juego autocontenido en **Canvas 2D con proyección
pseudo-3D**, conservando la dirección de arte, los sprites y las mecánicas.

| | Prototipo | Aquí |
|---|---|---|
| Stack | React + Vite + Babylon.js | HTML + un `.js` sin dependencias |
| Despliegue | Requiere `pnpm build` | Se sirve tal cual |
| Assets | 10,6 MB (3 PNG de 1920 px) | 60 KB (3 WebP recortados) |
| Total de la página | ~12 MB | ~140 KB |

Los sprites se redujeron recortando el alfa vacío y remuestreando en dos pasadas
con Chromium; el arte es el mismo.

## Ficheros

- `../juego_mudanzas.html` — la página. Cabecera y pie los inyecta
  `tools/build.mjs` en los marcadores `<!--dmw:header-->` y `<!--dmw:footer-->`.
- `juego.js` — motor, lógica y HUD. Sin dependencias.
- `camion.webp`, `caja.webp`, `cono.webp` — sprites.

## Encuadre

La cámara no usa constantes sueltas: en `medir()` se derivan la escala, la
altura de cámara y la distancia del jugador a partir de dos decisiones de
diseño —los tres carriles ocupan un porcentaje fijo del ancho y el camión apoya
las ruedas al 92 % del alto—. Por eso el encuadre es el mismo en 16:9 de
escritorio y en 3:4 de móvil. El tamaño del camión se ata al **ancho de carril**,
no al alto del lienzo, o en vertical ocuparía casi dos carriles.

## Fallos del prototipo corregidos

1. **«Nuevo récord» no aparecía nunca.** `finish()` asignaba `best = score`
   antes de evaluar `score > best`, así que la comparación siempre daba falso.
2. **El roce puntuaba también al esquivar cajas**, premiando justo lo contrario
   de lo que el juego pide. Ahora solo cuentan los conos.
3. **Una flecha después de morir reiniciaba la partida** sin dejar leer el
   resultado: `move()` llamaba a `start()` en fase `gameover`.
4. **Las oleadas podían tapar los tres carriles a la vez** y dejar la partida sin
   salida: el carril y el tipo se sorteaban por separado. Ahora cada oleada
   reserva al menos un carril libre (hay una prueba que lanza 400 oleadas a
   dificultad máxima).
5. La barra de progreso medía `cajas / 30`, un denominador arbitrario. Ahora
   marca el tiempo restante.

## Novedades

Pausa con `Esc`/`P` y automática al cambiar de pestaña · sonido sintetizado con
WebAudio y silencio recordado · mandos táctiles además del deslizamiento ·
`prefers-reduced-motion` respetado · récord y preferencias en `localStorage` ·
modo `?demo` con piloto automático para capturas.

## Probar

```sh
python3 -m http.server 8000    # y abrir /juego_mudanzas.html
```
