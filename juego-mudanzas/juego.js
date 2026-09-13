/**
 * Mudanza Express — juego arcade de Dame mi web.
 *
 * Reescritura del prototipo original (React + Vite + Babylon.js) como juego
 * autocontenido en Canvas 2D con proyeccion pseudo-3D. El sitio es estatico y
 * se sirve tal cual desde Cloudflare Pages: no hay paso de compilacion, asi que
 * el juego no puede depender de un bundler ni de 1,5 MB de motor 3D.
 *
 * Controles: flechas o A/D para cambiar de carril, espacio para empezar,
 * Esc o P para pausar, M para silenciar. En movil, deslizar o los botones.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------
  // Ajustes
  // ---------------------------------------------------------------------

  var CFG = {
    duracion: 30,            // segundos de partida
    carriles: 3,
    anchoCarril: 620,        // unidades de mundo (un carril ≈ 3,2 m)
    profundidadCamara: 0.84, // 1/tan(fov/2), fov ≈ 100°
    zHorizonte: 30000,
    puntosCaja: 100,
    bonusCombo: 24,
    tiempoCaja: 0.4,         // segundos que suma recoger una caja
    penalizacionCono: 2.5,   // segundos que resta chocar
    puntosRoce: 35,
    bonusRoce: 5,
    velocidadBase: 5200,     // unidades por segundo
    claves: { record: 'mudanza-express:record', silencio: 'mudanza-express:silencio' }
  };

  var COLOR = {
    cielo1: '#1b2a63', cielo2: '#6b3a6e', cielo3: '#c4553f',
    noche: '#0b1738', asfalto1: '#232f4d', asfalto2: '#1e2942',
    bordillo1: '#ffc83d', bordillo2: '#e8552f',
    linea: '#fff1d5', acera: '#2b365c', coral: '#ff654f', crema: '#fff1d5',
    ambar: '#ffc83d', menta: '#5ad7c0'
  };

  // ---------------------------------------------------------------------
  // Utilidades
  // ---------------------------------------------------------------------

  var lim = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var azar = function (n) { return Math.floor(Math.random() * n); };

  function guardar(clave, valor) {
    try { localStorage.setItem(clave, String(valor)); } catch (e) { /* modo privado */ }
  }
  function leer(clave, pordefecto) {
    try { var v = localStorage.getItem(clave); return v === null ? pordefecto : v; }
    catch (e) { return pordefecto; }
  }

  var menosMovimiento = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  // ---------------------------------------------------------------------
  // Sonido: sintetizado con WebAudio, sin ficheros que descargar
  // ---------------------------------------------------------------------

  var Audio_ = {
    ctx: null,
    silencio: leer(CFG.claves.silencio, '0') === '1',
    preparar: function () {
      if (this.ctx || this.silencio) return;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
    },
    tono: function (frec, dur, tipo, vol, desliz) {
      if (this.silencio || !this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      var t = this.ctx.currentTime;
      var osc = this.ctx.createOscillator();
      var gan = this.ctx.createGain();
      osc.type = tipo || 'sine';
      osc.frequency.setValueAtTime(frec, t);
      if (desliz) osc.frequency.exponentialRampToValueAtTime(Math.max(30, desliz), t + dur);
      gan.gain.setValueAtTime(0.0001, t);
      gan.gain.exponentialRampToValueAtTime(vol || 0.18, t + 0.012);
      gan.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gan); gan.connect(this.ctx.destination);
      osc.start(t); osc.stop(t + dur + 0.02);
    },
    ruido: function (dur, vol) {
      if (this.silencio || !this.ctx) return;
      var n = Math.floor(this.ctx.sampleRate * dur);
      var buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
      var d = buf.getChannelData(0);
      for (var i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      var src = this.ctx.createBufferSource(); src.buffer = buf;
      var g = this.ctx.createGain(); g.gain.value = vol || 0.3;
      var f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
      src.connect(f); f.connect(g); g.connect(this.ctx.destination); src.start();
    },
    caja: function (combo) { this.tono(520 + Math.min(combo, 12) * 45, 0.14, 'triangle', 0.2); },
    roce: function () { this.tono(880, 0.09, 'sine', 0.1, 1400); },
    choque: function () { this.ruido(0.32, 0.35); this.tono(90, 0.28, 'sawtooth', 0.22, 42); },
    inicio: function () { this.tono(392, 0.1, 'triangle', 0.16); var s = this; setTimeout(function () { s.tono(587, 0.16, 'triangle', 0.16); }, 110); },
    fin: function () { var s = this; [440, 349, 262].forEach(function (f, i) { setTimeout(function () { s.tono(f, 0.22, 'triangle', 0.16); }, i * 130); }); },
    record: function () { var s = this; [523, 659, 784, 1046].forEach(function (f, i) { setTimeout(function () { s.tono(f, 0.2, 'triangle', 0.18); }, i * 110); }); },
    tic: function () { this.tono(1200, 0.05, 'square', 0.07); }
  };

  // ---------------------------------------------------------------------
  // Recursos
  // ---------------------------------------------------------------------

  var IMG = {};
  function cargarImagenes(lista, hecho) {
    var pendientes = lista.length;
    if (!pendientes) return hecho();
    lista.forEach(function (it) {
      var im = new Image();
      im.onload = im.onerror = function () { if (--pendientes === 0) hecho(); };
      im.src = it.url;
      IMG[it.nombre] = im;
    });
  }

  // ---------------------------------------------------------------------
  // Juego
  // ---------------------------------------------------------------------

  function Juego(lienzo, hud, opciones) {
    this.c = lienzo;
    this.x = lienzo.getContext('2d');
    this.hud = hud;
    this.demo = !!(opciones && opciones.demo);

    this.ancho = 0; this.alto = 0; this.dpr = 1;
    this.fase = 'portada';           // portada | jugando | pausa | fin
    this.record = parseInt(leer(CFG.claves.record, '0'), 10) || 0;
    this.objetos = [];
    this.particulas = [];
    this.avisos = [];
    this.faroles = [];
    this.edificios = [];
    this.reiniciarPartida();
    this.generarCiudad();

    this.sacudida = 0;
    this.desplazamiento = 0;         // avance acumulado, mueve el decorado
    this.ultimo = 0;
    this.acumulado = 0;
    this.rafId = 0;
    this.ticAnterior = 0;
  }

  Juego.prototype.reiniciarPartida = function () {
    this.puntos = 0;
    this.combo = 0;
    this.mejorCombo = 0;
    this.cajas = 0;
    this.choques = 0;
    this.tiempo = CFG.duracion;
    this.transcurrido = 0;
    this.carril = 1;
    this.carrilX = 0;
    this.inclinacion = 0;
    this.relojOleada = 0.9;
    this.objetos.length = 0;
    this.particulas.length = 0;
    this.avisos.length = 0;
    this.destello = 0;
    this.invulnerable = 0;
  };

  /* Decorado lateral: se genera una vez y se recicla por delante del jugador. */
  Juego.prototype.generarCiudad = function () {
    this.edificios.length = 0;
    this.faroles.length = 0;
    for (var i = 0; i < 26; i++) {
      for (var lado = -1; lado <= 1; lado += 2) {
        this.edificios.push({
          z: i * 1500 + (lado > 0 ? 700 : 0),
          lado: lado,
          ancho: 620 + ((i * 7) % 5) * 170,
          alto: 820 + ((i * 13) % 7) * 300,
          calido: (i + (lado > 0 ? 1 : 0)) % 3 === 0,
          ventanas: 2 + ((i * 5) % 3)
        });
      }
    }
    for (var j = 0; j < 22; j++) {
      for (var l = -1; l <= 1; l += 2) this.faroles.push({ z: j * 1800 + 400, lado: l });
    }
  };

  // --- Proyeccion pseudo-3D -------------------------------------------------

  /**
   * Proyeccion pseudo-3D clasica: la camara esta en (0, alturaCamara, 0) y
   * mira al eje Z. `s` es el factor de escala a esa profundidad, que sirve
   * tanto para colocar como para dimensionar (ver `tam`).
   */
  Juego.prototype.proyectar = function (x, y, z) {
    var s = CFG.profundidadCamara / Math.max(140, z);
    return {
      x: this.ancho / 2 + s * x * this.f,
      y: this.horizonte + s * (this.camH - y) * this.f,
      s: s
    };
  };

  /** Tamaño en pixeles de un objeto de `unidades` de alto a esa escala. */
  Juego.prototype.tam = function (s, unidades) {
    return s * unidades * this.f;
  };

  Juego.prototype.medir = function () {
    var caja = this.c.parentNode.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.ancho = Math.max(320, Math.round(caja.width));
    this.alto = Math.max(240, Math.round(caja.height));
    this.c.width = Math.round(this.ancho * this.dpr);
    this.c.height = Math.round(this.alto * this.dpr);
    this.c.style.width = this.ancho + 'px';
    this.c.style.height = this.alto + 'px';
    this.x.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    /* El encuadre se deriva de tres decisiones de diseño, no de constantes
       sueltas, para que sea el mismo en 16:9 de escritorio y en 3:4 de movil:
         - los tres carriles ocupan el 78 % del ancho a la altura del jugador,
         - y el camion apoya las ruedas al 92 % del alto.
       El tamaño del camion NO se ata al alto del lienzo sino al ancho de
       carril: en vertical (3:4) el lienzo es mucho mas alto y el camion
       acababa ocupando casi dos carriles. */
    this.f = this.ancho / 2;
    this.horizonte = Math.round(this.alto * 0.40);
    var ocupa = this.ancho < this.alto ? 0.94 : 0.78;
    this.sJugador = (ocupa * this.ancho) / (CFG.carriles * CFG.anchoCarril * this.f);
    this.camH = (0.92 * this.alto - this.horizonte) / (this.sJugador * this.f);
    this.zJugador = CFG.profundidadCamara / this.sJugador;
    this.altoCamion = CFG.anchoCarril * 0.94;   // ancho ≈ 0,8 carriles
    this.altoCaja = this.altoCamion * 0.40;
    this.altoCono = this.altoCamion * 0.32;
  };

  // --- Dibujo ---------------------------------------------------------------

  Juego.prototype.dibujarCielo = function () {
    var x = this.x, h = this.horizonte;
    var g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, COLOR.cielo1);
    g.addColorStop(0.55, COLOR.cielo2);
    g.addColorStop(1, COLOR.cielo3);
    x.fillStyle = g;
    x.fillRect(0, 0, this.ancho, h);

    // Sol bajo, centrado en la fuga
    var r = Math.min(this.ancho, this.alto) * 0.16;
    var sg = x.createRadialGradient(this.ancho / 2, h, 0, this.ancho / 2, h, r * 2.2);
    sg.addColorStop(0, 'rgba(255,200,61,.75)');
    sg.addColorStop(1, 'rgba(255,200,61,0)');
    x.fillStyle = sg;
    x.beginPath(); x.arc(this.ancho / 2, h, r * 2.2, 0, Math.PI * 2); x.fill();

    // Silueta de ciudad al fondo, con parallaje lento
    var off = (this.desplazamiento * 0.004) % 220;
    x.fillStyle = 'rgba(11,23,56,.82)';
    for (var i = -2; i < this.ancho / 110 + 2; i++) {
      var bx = i * 110 - off;
      var bh = 26 + ((i * 37) % 9) * 11;
      var bw = 56 + ((i * 17) % 5) * 13;
      x.fillRect(bx, h - bh, bw, bh);
    }
    x.fillStyle = 'rgba(255,200,61,.5)';
    for (var k = -2; k < this.ancho / 110 + 2; k++) {
      var vx = k * 110 - off + 12;
      var vh = 26 + ((k * 37) % 9) * 11;
      for (var f = 0; f < 3; f++) {
        if (((k + f) * 13) % 4 === 0) x.fillRect(vx + f * 14, h - vh + 10 + f * 9, 5, 6);
      }
    }
  };

  /** Un quad entre dos tramos de carretera, de x1..x2 en el lejano y en el cercano. */
  Juego.prototype.franja = function (aLejos, bLejos, aCerca, bCerca, color) {
    var x = this.x;
    x.fillStyle = color;
    x.beginPath();
    x.moveTo(aLejos.x, aLejos.y);
    x.lineTo(bLejos.x, bLejos.y);
    x.lineTo(bCerca.x, bCerca.y);
    x.lineTo(aCerca.x, aCerca.y);
    x.closePath();
    x.fill();
  };

  Juego.prototype.dibujarCarretera = function () {
    var medio = (CFG.anchoCarril * CFG.carriles) / 2;
    var acera = medio * 2.6;
    var pasos = 60;

    for (var i = pasos; i > 0; i--) {
      // Reparto cuadratico: mas tramos cerca, que es donde se juega
      var zL = 220 + Math.pow(i / pasos, 2.1) * CFG.zHorizonte;
      var zC = 220 + Math.pow((i - 1) / pasos, 2.1) * CFG.zHorizonte;

      var L = this.proyectar(-medio, 0, zL), R = this.proyectar(medio, 0, zL);
      var l = this.proyectar(-medio, 0, zC), r = this.proyectar(medio, 0, zC);
      if (R.x - L.x < 0.5 || l.y - L.y < 0.35) continue;

      // Alterna con el avance para que se lea la velocidad
      var par = Math.floor((zL + this.desplazamiento) / 1600) % 2 === 0;

      // Aceras, a ras de calzada
      var AL = this.proyectar(-acera, 0, zL), AR = this.proyectar(acera, 0, zL);
      var al = this.proyectar(-acera, 0, zC), ar = this.proyectar(acera, 0, zC);
      this.franja(AL, L, al, l, par ? '#2b365c' : '#26304f');
      this.franja(R, AR, r, ar, par ? '#2b365c' : '#26304f');

      // Calzada
      this.franja(L, R, l, r, par ? COLOR.asfalto1 : COLOR.asfalto2);

      // Bordillos: franjas estrechas pegadas al borde, no barras verticales
      var grosor = CFG.anchoCarril * 0.09;
      var bl1 = this.proyectar(-medio - grosor, 0, zL), bl2 = this.proyectar(-medio, 0, zL);
      var bl3 = this.proyectar(-medio - grosor, 0, zC), bl4 = this.proyectar(-medio, 0, zC);
      this.franja(bl1, bl2, bl3, bl4, par ? COLOR.bordillo1 : COLOR.bordillo2);
      var br1 = this.proyectar(medio, 0, zL), br2 = this.proyectar(medio + grosor, 0, zL);
      var br3 = this.proyectar(medio, 0, zC), br4 = this.proyectar(medio + grosor, 0, zC);
      this.franja(br1, br2, br3, br4, par ? COLOR.bordillo1 : COLOR.bordillo2);

      // Lineas discontinuas entre carriles
      if (par) {
        var ancho = CFG.anchoCarril * 0.035;
        for (var c = 1; c < CFG.carriles; c++) {
          var lx = -medio + c * CFG.anchoCarril;
          this.franja(
            this.proyectar(lx - ancho, 0, zL), this.proyectar(lx + ancho, 0, zL),
            this.proyectar(lx - ancho, 0, zC), this.proyectar(lx + ancho, 0, zC),
            COLOR.linea);
        }
      }
    }
  };

  Juego.prototype.dibujarDecorado = function () {
    var x = this.x, self = this;
    var anchoMedio = (CFG.anchoCarril * CFG.carriles) / 2;
    var ciclo = 26 * 1500;

    var items = [];
    this.edificios.forEach(function (e) {
      var z = ((e.z - self.desplazamiento) % ciclo + ciclo) % ciclo;
      if (z > 300 && z < CFG.zHorizonte) items.push({ t: 'e', z: z, o: e });
    });
    this.faroles.forEach(function (f) {
      var z = ((f.z - self.desplazamiento) % (22 * 1800) + 22 * 1800) % (22 * 1800);
      if (z > 300 && z < CFG.zHorizonte * 0.8) items.push({ t: 'f', z: z, o: f });
    });
    items.sort(function (a, b) { return b.z - a.z; });

    items.forEach(function (it) {
      var o = it.o;
      if (it.t === 'e') {
        var base = self.proyectar(o.lado * (anchoMedio * 4.2 + o.ancho / 2), 0, it.z);
        var techo = self.proyectar(o.lado * (anchoMedio * 4.2 + o.ancho / 2), o.alto, it.z);
        var w = self.tam(base.s, o.ancho);
        if (w < 1 || base.y - techo.y < 1) return;
        var lejania = Math.min(1, it.z / 22000);
        x.globalAlpha = 0.55 + (1 - lejania) * 0.45;
        x.fillStyle = o.calido ? '#3d2a48' : '#16295a';
        x.fillRect(base.x - w / 2, techo.y, w, base.y - techo.y);
        x.globalAlpha = 1;
        if (w < 14) return;
        x.fillStyle = 'rgba(255,200,61,.5)';
        var vw = Math.max(1, w * 0.14), vh = Math.max(1, (base.y - techo.y) * 0.06);
        for (var r = 0; r < o.ventanas; r++) {
          for (var cnum = 0; cnum < 2; cnum++) {
            if (((r + cnum + o.ancho) % 3) === 0) continue;
            x.fillRect(base.x - w * 0.3 + cnum * w * 0.34, techo.y + (base.y - techo.y) * (0.16 + r * 0.2), vw, vh);
          }
        }
      } else {
        var pie = self.proyectar(o.lado * (anchoMedio * 1.25), 0, it.z);
        var luz = self.proyectar(o.lado * (anchoMedio * 1.25), 760, it.z);
        var gw = Math.max(1, self.tam(pie.s, 26));
        if (gw < 0.6 || pie.y - luz.y < 1) return;
        x.fillStyle = '#16295a';
        x.fillRect(pie.x - gw / 2, luz.y, gw, pie.y - luz.y);
        var radio = Math.min(gw * 7, self.alto * 0.09);
        var rg = x.createRadialGradient(luz.x, luz.y, 0, luz.x, luz.y, radio);
        rg.addColorStop(0, 'rgba(255,200,61,.8)');
        rg.addColorStop(.45, 'rgba(255,170,60,.28)');
        rg.addColorStop(1, 'rgba(255,200,61,0)');
        x.fillStyle = rg;
        x.beginPath(); x.arc(luz.x, luz.y, radio, 0, Math.PI * 2); x.fill();
        x.fillStyle = COLOR.crema;
        x.beginPath(); x.arc(luz.x, luz.y, Math.max(1, gw * .9), 0, Math.PI * 2); x.fill();
      }
    });
  };

  Juego.prototype.sombra = function (px, py, w) {
    var x = this.x;
    var g = x.createRadialGradient(px, py, 0, px, py, w);
    g.addColorStop(0, 'rgba(5,10,26,.55)');
    g.addColorStop(1, 'rgba(5,10,26,0)');
    x.fillStyle = g;
    x.save(); x.translate(px, py); x.scale(1, 0.32);
    x.beginPath(); x.arc(0, 0, w, 0, Math.PI * 2); x.fill();
    x.restore();
  };

  Juego.prototype.dibujarObjetos = function () {
    var x = this.x, self = this;
    var ordenados = this.objetos.slice().sort(function (a, b) { return b.z - a.z; });
    ordenados.forEach(function (o) {
      var p = self.proyectar(o.x, 0, o.z);
      var im = IMG[o.tipo === 'caja' ? 'caja' : 'cono'];
      if (!im || !im.width || p.s <= 0) return;
      var h = self.tam(p.s, o.tipo === 'caja' ? self.altoCaja : self.altoCono);
      var w = h * (im.width / im.height);
      if (h < 1.5) return;
      self.sombra(p.x, p.y, w * 0.46);
      if (o.tipo === 'caja') {
        x.save();
        x.shadowColor = 'rgba(255,200,61,.75)';
        x.shadowBlur = Math.min(40, h * 0.35);
        x.drawImage(im, p.x - w / 2, p.y - h, w, h);
        x.restore();
      } else {
        x.drawImage(im, p.x - w / 2, p.y - h, w, h);
      }
    });
  };

  Juego.prototype.dibujarCamion = function () {
    var x = this.x;
    var im = IMG.camion;
    var p = this.proyectar(this.carrilX, 0, this.zJugador);
    var h = this.tam(p.s, this.altoCamion);
    if (!im || !im.width || h < 4) return;
    var w = h * (im.width / im.height);
    var bote = menosMovimiento.matches ? 0 : Math.sin(this.transcurrido * 15) * h * 0.008;

    // Haz de faros hacia el horizonte. Va debajo del camion: se ve la
    // carretera iluminada por delante, no un velo sobre la carroceria.
    if (!menosMovimiento.matches) {
      var g = x.createLinearGradient(p.x, p.y - h * 1.6, p.x, p.y);
      g.addColorStop(0, 'rgba(255,241,213,0)');
      g.addColorStop(1, 'rgba(255,241,213,.09)');
      x.fillStyle = g;
      // Ancho junto al camion y estrechandose hacia el horizonte: asi es como
      // se ve en perspectiva la luz apoyada sobre el asfalto.
      x.beginPath();
      x.moveTo(p.x - w * 1.05, p.y);
      x.lineTo(p.x + w * 1.05, p.y);
      x.lineTo(p.x + w * 0.26, p.y - h * 1.5);
      x.lineTo(p.x - w * 0.26, p.y - h * 1.5);
      x.closePath(); x.fill();
    }

    this.sombra(p.x, p.y + bote, w * 0.42);
    x.save();
    x.translate(p.x, p.y + bote);
    x.rotate(this.inclinacion * 0.16);
    if (this.invulnerable > 0 && Math.floor(this.invulnerable * 12) % 2 === 0) x.globalAlpha = 0.45;
    x.drawImage(im, -w / 2, -h, w, h);
    x.restore();

    // Resplandor de los pilotos traseros: refuerza que el camion se aleja
    if (!menosMovimiento.matches) {
      var py = p.y + bote - h * 0.17;
      [-w * 0.34, w * 0.34].forEach(function (dx) {
        var rg = x.createRadialGradient(p.x + dx, py, 0, p.x + dx, py, w * 0.17);
        rg.addColorStop(0, 'rgba(255,70,50,.5)');
        rg.addColorStop(1, 'rgba(255,70,50,0)');
        x.fillStyle = rg;
        x.beginPath(); x.arc(p.x + dx, py, w * 0.17, 0, Math.PI * 2); x.fill();
      });
    }
  };

  Juego.prototype.dibujarParticulas = function () {
    var x = this.x, self = this;
    this.particulas.forEach(function (q) {
      var p = self.proyectar(q.x, q.y, q.z);
      var r = Math.min(self.alto * 0.03, Math.max(1, self.tam(p.s, q.r)));
      x.globalAlpha = lim(q.vida / q.maxVida, 0, 1);
      x.fillStyle = q.color;
      x.beginPath(); x.arc(p.x, p.y, r, 0, Math.PI * 2); x.fill();
      x.globalAlpha = 1;
    });
  };

  Juego.prototype.dibujarAvisos = function () {
    if (!this.avisos.length) return;
    var x = this.x, self = this;
    var base = this.proyectar(0, this.altoCamion, this.zJugador);
    var tamano = Math.max(13, Math.round(this.alto * 0.036));

    x.save();
    x.font = '700 ' + tamano + 'px "DM Sans", system-ui, sans-serif';
    x.textAlign = 'center';
    x.lineJoin = 'round';
    x.lineWidth = Math.max(3, tamano * 0.28);
    this.avisos.forEach(function (a, i) {
      var t = 1 - a.vida / a.maxVida;
      var p = self.proyectar(a.x, 0, self.zJugador);
      // El texto se queda dentro del lienzo aunque el carril este en el borde
      var margen = x.measureText(a.texto).width / 2 + 10;
      p.x = lim(p.x, margen, self.ancho - margen);
      // Escalonado por posicion en la cola: dos avisos seguidos no se solapan
      var y = base.y - tamano * 0.6 - t * tamano * 2.2 - i * tamano * 1.25;
      x.globalAlpha = Math.min(1, a.vida / a.maxVida * 1.6);
      x.strokeStyle = 'rgba(11,23,56,.92)';
      x.strokeText(a.texto, p.x, y);
      x.fillStyle = a.color;
      x.fillText(a.texto, p.x, y);
    });
    x.restore();
  };

  // --- Logica ---------------------------------------------------------------

  Juego.prototype.xDeCarril = function (n) {
    return (n - (CFG.carriles - 1) / 2) * CFG.anchoCarril;
  };

  Juego.prototype.dificultad = function () {
    return 1 + Math.min(1.8, this.transcurrido / 20) + Math.min(0.9, this.combo / 18);
  };

  /**
   * Oleadas en vez de objetos sueltos al azar.
   *
   * El prototipo sorteaba carril y tipo por separado, asi que podia tapar los
   * tres carriles con conos a la vez y dejar la partida sin salida. Aqui cada
   * oleada reserva siempre al menos un carril libre.
   */
  Juego.prototype.lanzarOleada = function () {
    var d = this.dificultad();
    var z = 13000 + Math.random() * 2200;
    var libres = [0, 1, 2];
    var conos = this.transcurrido < 4 ? 0 : Math.min(2, 1 + (Math.random() < (d - 1) * 0.5 ? 1 : 0));

    for (var i = 0; i < conos; i++) {
      var idx = azar(libres.length);
      var carril = libres.splice(idx, 1)[0];
      this.objetos.push({ tipo: 'cono', carril: carril, x: this.xDeCarril(carril), z: z + (Math.random() - 0.5) * 900, vivo: true, roce: false });
    }
    // En los carriles que quedan libres aparecen cajas: recompensa por leer la oleada
    var cajas = 1 + (Math.random() < 0.35 ? 1 : 0);
    for (var j = 0; j < cajas && libres.length; j++) {
      var k = azar(libres.length);
      var cl = libres.splice(k, 1)[0];
      this.objetos.push({ tipo: 'caja', carril: cl, x: this.xDeCarril(cl), z: z + (Math.random() - 0.5) * 700, vivo: true, roce: false });
    }
  };

  Juego.prototype.aviso = function (texto, color, carril) {
    this.avisos.push({ texto: texto, color: color, vida: 0.9, maxVida: 0.9, x: this.xDeCarril(carril === undefined ? this.carril : carril), z: this.zJugador + 160 });
  };

  Juego.prototype.estallido = function (carril, color, n) {
    if (menosMovimiento.matches) return;
    for (var i = 0; i < n; i++) {
      // Nacen a la altura de la caja y caen enseguida: son chispas del impacto,
      // no globos. Sin esto se quedaban flotando sobre la linea del horizonte.
      this.particulas.push({
        x: this.xDeCarril(carril) + (Math.random() - 0.5) * 260,
        y: 120 + Math.random() * 240,
        z: this.zJugador + (Math.random() - 0.5) * 260,
        vx: (Math.random() - 0.5) * 700, vy: 260 + Math.random() * 420, vz: -120 - Math.random() * 260,
        r: 8 + Math.random() * 11, color: color, vida: 0.45, maxVida: 0.45
      });
    }
  };

  Juego.prototype.mover = function (dir) {
    if (this.fase === 'portada' || this.fase === 'fin') return;   // no reinicia por error
    if (this.fase === 'pausa') return;
    var nuevo = lim(this.carril + dir, 0, CFG.carriles - 1);
    if (nuevo === this.carril) return;
    this.carril = nuevo;
    this.inclinacion = dir * 0.9;
  };

  Juego.prototype.empezar = function () {
    Audio_.preparar();
    this.reiniciarPartida();
    this.fase = 'jugando';
    this.carrilX = this.xDeCarril(this.carril);
    Audio_.inicio();
    this.hud.actualizarFase(this);
  };

  Juego.prototype.pausar = function (forzar) {
    if (this.fase === 'jugando') { this.fase = 'pausa'; }
    else if (this.fase === 'pausa' && !forzar) { this.fase = 'jugando'; this.ultimo = 0; }
    this.hud.actualizarFase(this);
  };

  Juego.prototype.terminar = function () {
    this.fase = 'fin';
    // El prototipo actualizaba el record ANTES de compararlo, asi que el
    // mensaje "Nuevo record" no llegaba a mostrarse nunca.
    this.esRecord = this.puntos > this.record;
    if (this.esRecord) { this.record = this.puntos; guardar(CFG.claves.record, this.record); }
    this.objetos.length = 0;
    if (this.esRecord) Audio_.record(); else Audio_.fin();
    this.hud.actualizarFase(this);
  };

  Juego.prototype.actualizar = function (dt) {
    var self = this;

    // El camion interpola hacia el carril objetivo
    var destino = this.xDeCarril(this.carril);
    this.carrilX = lerp(this.carrilX, destino, Math.min(1, dt * 11));
    this.inclinacion = lerp(this.inclinacion, 0, Math.min(1, dt * 7));
    if (this.sacudida > 0) this.sacudida = Math.max(0, this.sacudida - dt * 2.6);
    if (this.destello > 0) this.destello = Math.max(0, this.destello - dt * 2.4);
    if (this.invulnerable > 0) this.invulnerable = Math.max(0, this.invulnerable - dt);

    var d = this.dificultad();
    var velocidad = CFG.velocidadBase * d;
    if (this.fase !== 'jugando') velocidad *= 0.35;      // el decorado sigue vivo en portada
    this.desplazamiento += velocidad * dt;

    // Particulas y avisos viven tambien fuera de la partida para que se apaguen
    for (var i = this.particulas.length - 1; i >= 0; i--) {
      var q = this.particulas[i];
      q.vida -= dt;
      q.x += q.vx * dt; q.y += q.vy * dt; q.vy -= 2200 * dt;
      // No se acercan mas que el jugador: si no, se proyectan como manchones
      q.z = Math.max(this.zJugador * 0.92, q.z + q.vz * dt);
      if (q.vida <= 0 || q.y < 0) this.particulas.splice(i, 1);
    }
    for (var j = this.avisos.length - 1; j >= 0; j--) {
      this.avisos[j].vida -= dt;
      if (this.avisos[j].vida <= 0) this.avisos.splice(j, 1);
    }

    if (this.fase !== 'jugando') return;

    this.transcurrido += dt;
    var antes = Math.ceil(this.tiempo);
    this.tiempo -= dt;
    var ahora = Math.ceil(this.tiempo);
    if (ahora !== antes && ahora <= 5 && ahora > 0) Audio_.tic();

    this.relojOleada -= dt;
    if (this.relojOleada <= 0) {
      this.lanzarOleada();
      this.relojOleada = Math.max(0.62, 1.5 - this.transcurrido * 0.02) / Math.min(1.5, d * 0.8);
    }

    for (var k = this.objetos.length - 1; k >= 0; k--) {
      var o = this.objetos[k];
      o.z -= velocidad * dt;

      // Roce: pasar cerca de un CONO del carril contiguo da bonus.
      // En el prototipo tambien puntuaba esquivar cajas, que es justo lo que
      // no quieres que haga el jugador.
      if (!o.roce && o.tipo === 'cono' && o.z < this.zJugador + 900 && o.z > this.zJugador - 400 && Math.abs(o.carril - this.carril) === 1) {
        o.roce = true;
        this.combo += 1;
        this.mejorCombo = Math.max(this.mejorCombo, this.combo);
        var bonus = CFG.puntosRoce + this.combo * CFG.bonusRoce;
        this.puntos += bonus;
        this.aviso('¡Por poco! +' + bonus, COLOR.menta, o.carril);
        Audio_.roce();
      }

      if (o.z < this.zJugador + 300 && o.z > this.zJugador - 360) {
        if (o.carril === this.carril && o.vivo) {
          o.vivo = false;
          if (o.tipo === 'caja') {
            this.cajas += 1;
            this.combo += 1;
            this.mejorCombo = Math.max(this.mejorCombo, this.combo);
            var ganado = CFG.puntosCaja + this.combo * CFG.bonusCombo;
            this.puntos += ganado;
            this.tiempo = Math.min(CFG.duracion, this.tiempo + CFG.tiempoCaja);
            this.aviso('+' + ganado, COLOR.ambar);
            this.estallido(o.carril, COLOR.ambar, 10);
            this.destello = 0.5;
            Audio_.caja(this.combo);
          } else if (this.invulnerable <= 0) {
            this.choques += 1;
            this.combo = 0;
            this.tiempo = Math.max(0, this.tiempo - CFG.penalizacionCono);
            this.invulnerable = 0.9;
            this.sacudida = 1;
            this.aviso('−' + CFG.penalizacionCono.toString().replace('.', ',') + ' s', COLOR.coral);
            this.estallido(o.carril, COLOR.coral, 14);
            Audio_.choque();
            if (navigator.vibrate && !menosMovimiento.matches) navigator.vibrate(60);
          }
          this.objetos.splice(k, 1);
          continue;
        }
      }
      if (o.z < this.zJugador - 480) this.objetos.splice(k, 1);
    }

    if (this.demo) this.pilotoAutomatico(dt);
    if (this.tiempo <= 0) { this.tiempo = 0; this.terminar(); }
  };

  /* Modo ?demo: partida automatica para capturas y para la portada. */
  Juego.prototype.pilotoAutomatico = function (dt) {
    this.relojDemo = (this.relojDemo || 0) - dt;
    if (this.relojDemo > 0) return;
    this.relojDemo = 0.28;
    var self = this;
    var minZ = this.zJugador + 250;
    var cerca = this.objetos.filter(function (o) { return o.z > minZ && o.z < 9000; });
    var riesgo = {}, premio = {};
    cerca.forEach(function (o) {
      var peso = 1 - o.z / 9000;
      if (o.tipo === 'cono') riesgo[o.carril] = (riesgo[o.carril] || 0) + peso;
      else premio[o.carril] = (premio[o.carril] || 0) + peso;
    });
    var mejor = this.carril, mejorNota = -Infinity;
    for (var c = 0; c < CFG.carriles; c++) {
      if (Math.abs(c - this.carril) > 1) continue;
      var nota = (premio[c] || 0) * 2 - (riesgo[c] || 0) * 5 - Math.abs(c - this.carril) * 0.1;
      if (nota > mejorNota) { mejorNota = nota; mejor = c; }
    }
    if (mejor !== this.carril) this.mover(mejor > this.carril ? 1 : -1);
  };

  // --- Bucle y entrada ------------------------------------------------------

  Juego.prototype.pintar = function () {
    var x = this.x;
    x.save();
    if (this.sacudida > 0 && !menosMovimiento.matches) {
      var s = this.sacudida * 9;
      x.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s);
    }
    this.dibujarCielo();
    this.dibujarCarretera();
    this.dibujarDecorado();
    this.dibujarObjetos();
    this.dibujarParticulas();
    this.dibujarCamion();
    this.dibujarAvisos();
    x.restore();

    if (this.destello > 0) {
      x.fillStyle = 'rgba(255,200,61,' + (this.destello * 0.12).toFixed(3) + ')';
      x.fillRect(0, 0, this.ancho, this.alto);
    }
    if (this.sacudida > 0) {
      x.fillStyle = 'rgba(255,101,79,' + (this.sacudida * 0.18).toFixed(3) + ')';
      x.fillRect(0, 0, this.ancho, this.alto);
    }
    // Vinetas: enmarcan la escena y ayudan a leer el HUD encima
    var v = x.createLinearGradient(0, 0, 0, this.alto);
    v.addColorStop(0, 'rgba(11,23,56,.45)');
    v.addColorStop(0.35, 'rgba(11,23,56,0)');
    v.addColorStop(1, 'rgba(11,23,56,.5)');
    x.fillStyle = v;
    x.fillRect(0, 0, this.ancho, this.alto);
  };

  Juego.prototype.bucle = function (t) {
    var self = this;
    this.rafId = requestAnimationFrame(function (n) { self.bucle(n); });
    if (!this.ultimo) { this.ultimo = t; return; }
    var dt = Math.min((t - this.ultimo) / 1000, 0.05);
    this.ultimo = t;
    this.actualizar(dt);
    this.pintar();
    this.hud.actualizar(this);
  };

  Juego.prototype.arrancar = function () {
    var self = this;
    this.medir();
    window.addEventListener('resize', function () { self.medir(); });
    this.rafId = requestAnimationFrame(function (t) { self.bucle(t); });

    // El juego se detiene solo al cambiar de pestana: no se pierde la partida
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && self.fase === 'jugando') self.pausar(true);
      self.ultimo = 0;
    });

    document.addEventListener('keydown', function (e) {
      var k = e.key.toLowerCase();
      if (k === 'arrowleft' || k === 'a') { e.preventDefault(); self.mover(-1); }
      else if (k === 'arrowright' || k === 'd') { e.preventDefault(); self.mover(1); }
      else if (k === ' ' || k === 'enter') {
        if (self.fase === 'portada' || self.fase === 'fin') { e.preventDefault(); self.empezar(); }
      } else if (k === 'escape' || k === 'p') { if (self.fase === 'jugando' || self.fase === 'pausa') { e.preventDefault(); self.pausar(); } }
      else if (k === 'm') { self.hud.alternarSonido(); }
    });

    // Puntero y tactil: deslizar, o tocar la mitad izquierda/derecha
    var iniX = null, iniY = null, iniT = 0, movido = false;
    this.c.addEventListener('pointerdown', function (e) {
      iniX = e.clientX; iniY = e.clientY; iniT = Date.now(); movido = false;
      self.c.setPointerCapture && self.c.setPointerCapture(e.pointerId);
    });
    this.c.addEventListener('pointermove', function (e) {
      if (iniX === null || movido) return;
      var dx = e.clientX - iniX;
      if (Math.abs(dx) > 34 && Math.abs(dx) > Math.abs(e.clientY - iniY)) {
        movido = true;
        self.mover(dx > 0 ? 1 : -1);
      }
    });
    this.c.addEventListener('pointerup', function (e) {
      if (iniX === null) return;
      var rapido = Date.now() - iniT < 350;
      var quieto = Math.abs(e.clientX - iniX) < 16 && Math.abs(e.clientY - iniY) < 16;
      if (!movido && rapido && quieto) {
        var caja = self.c.getBoundingClientRect();
        self.mover(e.clientX - caja.left < caja.width / 2 ? -1 : 1);
      }
      iniX = null;
    });
    this.c.addEventListener('pointercancel', function () { iniX = null; });
  };

  // ---------------------------------------------------------------------
  // HUD
  // ---------------------------------------------------------------------

  function Hud(raiz) {
    this.raiz = raiz;
    this.e = {};
    var self = this;
    ['puntos', 'combo', 'tiempo', 'record', 'cajas', 'barra', 'capa', 'capaTitulo',
     'capaTexto', 'capaBoton', 'capaDatos', 'sonido', 'pausaBoton'].forEach(function (n) {
      self.e[n] = raiz.querySelector('[data-e="' + n + '"]');
    });
    this.ultimoPuntos = -1;
    this.ultimoCombo = -1;
    this.ultimoSeg = -1;
    this.sincronizarSonido();
  }

  Hud.prototype.num = function (v) { return Math.round(v).toLocaleString('es-ES'); };

  Hud.prototype.alternarSonido = function () {
    Audio_.silencio = !Audio_.silencio;
    guardar(CFG.claves.silencio, Audio_.silencio ? '1' : '0');
    if (!Audio_.silencio) Audio_.preparar();
    this.sincronizarSonido();
  };

  Hud.prototype.sincronizarSonido = function () {
    if (!this.e.sonido) return;
    this.e.sonido.setAttribute('aria-pressed', Audio_.silencio ? 'true' : 'false');
    this.e.sonido.setAttribute('aria-label', Audio_.silencio ? 'Activar sonido' : 'Silenciar');
    this.e.sonido.textContent = Audio_.silencio ? '🔇' : '🔊';
  };

  Hud.prototype.actualizar = function (j) {
    if (j.puntos !== this.ultimoPuntos) {
      this.ultimoPuntos = j.puntos;
      this.e.puntos.textContent = this.num(j.puntos);
    }
    if (j.combo !== this.ultimoCombo) {
      this.ultimoCombo = j.combo;
      this.e.combo.textContent = 'Combo ×' + j.combo;
      this.e.combo.hidden = j.combo < 2;
      if (j.combo >= 2) {
        this.e.combo.classList.remove('late');
        void this.e.combo.offsetWidth;
        this.e.combo.classList.add('late');
      }
    }
    var seg = Math.ceil(j.tiempo);
    if (seg !== this.ultimoSeg) {
      this.ultimoSeg = seg;
      this.e.tiempo.textContent = seg + 's';
      this.e.tiempo.parentNode.classList.toggle('urgente', seg <= 5 && j.fase === 'jugando');
    }
    this.e.record.textContent = this.num(j.record);
    this.e.cajas.textContent = j.cajas;
    this.e.barra.style.transform = 'scaleX(' + (j.tiempo / CFG.duracion).toFixed(4) + ')';
  };

  Hud.prototype.actualizarFase = function (j) {
    var c = this.e.capa;
    this.raiz.dataset.fase = j.fase;
    if (j.fase === 'jugando') { c.hidden = true; this.e.pausaBoton.hidden = false; return; }
    c.hidden = false;
    this.e.pausaBoton.hidden = j.fase !== 'pausa';

    if (j.fase === 'portada') {
      this.e.capaTitulo.textContent = 'Mudanza Express';
      this.e.capaTexto.textContent = 'Recoge cajas, esquiva conos y llega lo más lejos posible en ' + CFG.duracion + ' segundos.';
      this.e.capaBoton.textContent = 'Empezar ruta';
      this.e.capaDatos.hidden = j.record <= 0;
      if (j.record > 0) this.e.capaDatos.innerHTML = 'Tu récord: <b>' + this.num(j.record) + '</b>';
    } else if (j.fase === 'pausa') {
      this.e.capaTitulo.textContent = 'En pausa';
      this.e.capaTexto.textContent = 'Respira. La ruta te espera.';
      this.e.capaBoton.textContent = 'Seguir';
      this.e.capaDatos.hidden = true;
    } else {
      this.e.capaTitulo.textContent = j.esRecord ? '¡Nuevo récord!' : 'Ruta completada';
      this.e.capaTexto.textContent = j.esRecord
        ? 'Has batido tu marca anterior. A ver si aguanta.'
        : 'Otra vuelta y la mejoras.';
      this.e.capaBoton.textContent = 'Volver a jugar';
      this.e.capaDatos.hidden = false;
      this.e.capaDatos.innerHTML =
        '<span><b>' + this.num(j.puntos) + '</b>puntos</span>' +
        '<span><b>' + j.cajas + '</b>cajas</span>' +
        '<span><b>×' + j.mejorCombo + '</b>mejor combo</span>' +
        '<span><b>' + this.num(j.record) + '</b>récord</span>';
    }
  };

  // ---------------------------------------------------------------------
  // Arranque
  // ---------------------------------------------------------------------

  function iniciar() {
    var raiz = document.getElementById('mudanza');
    if (!raiz) return;
    var lienzo = raiz.querySelector('canvas');
    var demo = new URLSearchParams(location.search).has('demo');

    cargarImagenes([
      { nombre: 'camion', url: '/juego-mudanzas/camion.webp' },
      { nombre: 'caja', url: '/juego-mudanzas/caja.webp' },
      { nombre: 'cono', url: '/juego-mudanzas/cono.webp' }
    ], function () {
      var hud = new Hud(raiz);
      var juego = new Juego(lienzo, hud, { demo: demo });
      hud.actualizarFase(juego);
      juego.arrancar();

      hud.e.capaBoton.addEventListener('click', function () {
        if (juego.fase === 'pausa') juego.pausar(); else juego.empezar();
        lienzo.focus();
      });
      hud.e.pausaBoton.addEventListener('click', function () { juego.pausar(); });
      hud.e.sonido.addEventListener('click', function () { hud.alternarSonido(); });
      raiz.querySelectorAll('[data-mover]').forEach(function (b) {
        b.addEventListener('click', function () { juego.mover(Number(b.dataset.mover)); });
      });
      if (demo) setTimeout(function () { juego.empezar(); }, 400);
      window.mudanzaExpress = juego;   // util para QA desde la consola
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
