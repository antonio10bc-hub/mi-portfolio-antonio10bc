/*
 * Los hechizos del minijuego secreto, dibujados en un <canvas> con el mismo
 * vocabulario de la web: tinta negra sobre papel, contornos gruesos, cruces "+".
 * Cada hechizo es un efecto con `update(dt)` (devuelve si sigue vivo) y
 * `draw(ctx)`. Va en el cliente y es pura animación: aquí sí vale Math.random(),
 * no hay HTML de servidor que tenga que coincidir.
 */

import type { Element } from "@/lib/spellbook";

export const INK = "#141214";
const PAPER = "#FFFFFF";

export type Vec = { x: number; y: number };

export interface Effect {
  /** Avanza `dt` segundos. Devuelve false cuando el efecto ha terminado. */
  update(dt: number): boolean;
  draw(ctx: CanvasRenderingContext2D): void;
  /** Temblor de pantalla que pide ahora mismo, en px. */
  shake?: number;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const ease = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 3);
/** Crece rápido, aguanta y se apaga: la vida de casi todas las partículas. */
const swell = (t: number) => (t < 0.15 ? t / 0.15 : t > 0.7 ? Math.max(0, (1 - t) / 0.3) : 1);

function pen(ctx: CanvasRenderingContext2D, width: number, alpha = 1) {
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  ctx.strokeStyle = INK;
  ctx.fillStyle = INK;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
}

/**
 * Traza el camino actual en tinta con un ribete de papel debajo, como una
 * pegatina: así la línea se lee también sobre una foto oscura (los hechizos
 * sueltos caen encima de la obra que flota).
 */
function haloStroke(ctx: CanvasRenderingContext2D) {
  const ink = ctx.strokeStyle;
  const width = ctx.lineWidth;
  ctx.strokeStyle = PAPER;
  ctx.lineWidth = width + 3;
  ctx.stroke();
  ctx.strokeStyle = ink;
  ctx.lineWidth = width;
  ctx.stroke();
}

/** La cruz de la túnica: la estrella y la chispa de todo el sitio. */
export function cross(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, rot: number, w: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(-s, s * 0.06);
  ctx.lineTo(s, -s * 0.06);
  ctx.moveTo(-s * 0.05, -s);
  ctx.lineTo(s * 0.05, s);
  ctx.lineWidth = w;
  haloStroke(ctx);
  ctx.restore();
}

/** Llama de dibujo animado: gota invertida con contorno y lengua interior maciza. */
function flame(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, w: number, sway: number) {
  ctx.beginPath();
  ctx.moveTo(x + sway, y - h);
  ctx.quadraticCurveTo(x + w * 1.1, y - h * 0.35, x, y);
  ctx.quadraticCurveTo(x - w * 1.1, y - h * 0.35, x + sway, y - h);
  ctx.fillStyle = PAPER;
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + sway * 0.6, y - h * 0.55);
  ctx.quadraticCurveTo(x + w * 0.5, y - h * 0.18, x, y - h * 0.04);
  ctx.quadraticCurveTo(x - w * 0.5, y - h * 0.18, x + sway * 0.6, y - h * 0.55);
  ctx.fillStyle = INK;
  ctx.fill();
}

/** Gota orientada según su velocidad. */
function drop(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, angle: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle - Math.PI / 2);
  ctx.beginPath();
  ctx.moveTo(0, -r * 2.2);
  ctx.quadraticCurveTo(r * 1.1, -r * 0.2, 0, r);
  ctx.quadraticCurveTo(-r * 1.1, -r * 0.2, 0, -r * 2.2);
  ctx.fillStyle = PAPER;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function snowflake(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3;
    const cx = Math.cos(a);
    const cy = Math.sin(a);
    ctx.moveTo(0, 0);
    ctx.lineTo(cx * r, cy * r);
    // ramitas en V a dos tercios del brazo
    const bx = cx * r * 0.6;
    const by = cy * r * 0.6;
    for (const s of [-1, 1]) {
      const b = a + s * 0.7;
      ctx.moveTo(bx, by);
      ctx.lineTo(bx + Math.cos(b) * r * 0.32, by + Math.sin(b) * r * 0.32);
    }
  }
  ctx.stroke();
  ctx.restore();
}

/** Rayo por desplazamiento del punto medio: zigzag con algún brote. */
function boltPath(from: Vec, to: Vec, spread: number, depth: number): Vec[] {
  if (depth === 0) return [from, to];
  const mid = { x: (from.x + to.x) / 2 + rand(-spread, spread), y: (from.y + to.y) / 2 + rand(-spread * 0.3, spread * 0.3) };
  return [...boltPath(from, mid, spread / 2, depth - 1), ...boltPath(mid, to, spread / 2, depth - 1).slice(1)];
}

function polyline(ctx: CanvasRenderingContext2D, pts: Vec[], halo = false) {
  ctx.beginPath();
  pts.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  if (halo) haloStroke(ctx);
  else ctx.stroke();
}

// --- El viaje: de la punta de la varita al sitio de la letra -------------------

export function projectile(from: Vec, to: Vec, onArrive: () => void): Effect {
  let t = 0;
  let arrived = false;
  const control = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 160 };
  const trail: (Vec & { life: number; rot: number })[] = [];
  const duration = 0.42;
  const at = (k: number): Vec => ({
    x: (1 - k) * (1 - k) * from.x + 2 * (1 - k) * k * control.x + k * k * to.x,
    y: (1 - k) * (1 - k) * from.y + 2 * (1 - k) * k * control.y + k * k * to.y,
  });
  return {
    update(dt) {
      t += dt;
      const k = Math.min(t / duration, 1);
      const p = at(ease(k));
      if (!arrived) trail.push({ ...p, life: 1, rot: rand(0, Math.PI) });
      trail.forEach((c) => (c.life -= dt * 2.6));
      if (k >= 1 && !arrived) {
        arrived = true;
        onArrive();
      }
      return trail.some((c) => c.life > 0);
    },
    draw(ctx) {
      trail.forEach((c, i) => {
        if (c.life <= 0) return;
        pen(ctx, 2.6, c.life);
        if (i % 3 === 0) cross(ctx, c.x, c.y, 5 + c.life * 5, c.rot, 2.6);
      });
      if (!arrived) {
        const p = at(ease(Math.min(t / duration, 1)));
        pen(ctx, 3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    },
  };
}

// --- Los siete hechizos ----------------------------------------------------------
//
// Cada hechizo llena una zona (`Area`): la obra que flota, para los hechizos
// sueltos de la home, o una caja alrededor de la letra dibujada, en el minijuego.
// El número de partículas y su tamaño crecen con la zona, para que una ventana
// grande quede cubierta de punta a punta y no con un estallido en el centro.

/** Zona del hechizo, en px de pantalla: esquina superior izquierda y tamaño. */
export type Area = { x: number; y: number; w: number; h: number };

/** La caja de un hechizo lanzado en un punto (las letras del minijuego). */
export const areaAround = (at: Vec): Area => ({ x: at.x - 130, y: at.y - 110, w: 260, h: 220 });

const centre = (a: Area): Vec => ({ x: a.x + a.w / 2, y: a.y + a.h / 2 });
/** Cuántas veces más partículas que en la caja de una letra (de 1 a 3). */
const amount = (a: Area) => Math.max(1, Math.min(3, (a.w * a.h) / (260 * 220)));
/** Cuánto más grandes (de 1 a 2.2), según el alto de la zona. */
const grow = (a: Area) => Math.max(1, Math.min(2.2, a.h / 220));
const inX = (a: Area, from = 0, to = 1) => a.x + a.w * rand(from, to);
const inY = (a: Area, from = 0, to = 1) => a.y + a.h * rand(from, to);
/** Distancia del centro al borde de la elipse inscrita en la zona, en la dirección `angle`. */
const toEdge = (a: Area, angle: number) => {
  const rx = a.w / 2;
  const ry = a.h / 2;
  return (rx * ry) / Math.hypot(ry * Math.cos(angle), rx * Math.sin(angle));
};

function fire(area: Area): Effect {
  let t = 0;
  const at = centre(area);
  const g = grow(area);
  const flames = Array.from({ length: Math.round(22 * amount(area)) }, () => ({
    x: inX(area, 0.04, 0.96),
    y: inY(area, 0.55, 1.02),
    vy: rand(-170, -60) * g,
    h: rand(34, 84) * g,
    w: rand(11, 23) * g,
    life: rand(0.7, 1.4),
    age: rand(-0.25, 0),
    phase: rand(0, 6),
  }));
  const embers = Array.from({ length: Math.round(16 * amount(area)) }, () => ({ x: inX(area, 0.05, 0.95), y: inY(area, 0.4, 0.9), vx: rand(-40, 40), vy: rand(-260, -120) * g, rot: rand(0, 3), life: rand(0.8, 1.6), age: 0 }));
  return {
    update(dt) {
      t += dt;
      flames.forEach((f) => {
        f.age += dt;
        if (f.age > 0) f.y += f.vy * dt;
      });
      embers.forEach((e) => {
        e.age += dt;
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        e.rot += dt * 4;
      });
      return t < 1.8;
    },
    draw(ctx) {
      // la llama grande, en el centro
      const big = swell(t / 1.4);
      if (big > 0) {
        pen(ctx, 3.4);
        flame(ctx, at.x, area.y + area.h * 0.98, Math.max(210, area.h * 0.9) * big, Math.max(62, area.w * 0.16) * big, Math.sin(t * 14) * 12 * g);
      }
      flames.forEach((f) => {
        if (f.age <= 0 || f.age > f.life) return;
        const s = swell(f.age / f.life);
        pen(ctx, 2.6);
        flame(ctx, f.x, f.y, f.h * s, f.w * s, Math.sin(t * 18 + f.phase) * 5);
      });
      embers.forEach((e) => {
        if (e.age > e.life) return;
        pen(ctx, 2.4, 1 - e.age / e.life);
        cross(ctx, e.x, e.y, 6, e.rot, 2.4);
      });
      ctx.globalAlpha = 1;
    },
  };
}

function water(area: Area): Effect {
  let t = 0;
  const at = centre(area);
  const g = grow(area);
  const ground = area.y + area.h * 0.92;
  // Varios surtidores repartidos a lo ancho, para que el agua cubra toda la zona.
  const drops = Array.from({ length: Math.round(30 * amount(area)) }, () => {
    const a = rand(-150, -30) * (Math.PI / 180);
    const v = rand(220, 460) * Math.sqrt(g);
    return { x: inX(area, 0.06, 0.94), y: ground - 4, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rand(4, 8) * Math.sqrt(g), alive: true };
  });
  const ripples: { x: number; age: number; max: number }[] = [{ x: at.x, age: 0, max: Math.max(90, area.w * 0.3) }];
  return {
    update(dt) {
      t += dt;
      drops.forEach((d) => {
        if (!d.alive) return;
        d.vy += 980 * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;
        if (d.y > ground && d.vy > 0) {
          d.alive = false;
          ripples.push({ x: d.x, age: 0, max: rand(26, 50) });
        }
      });
      ripples.forEach((r) => (r.age += dt));
      return t < 2.2;
    },
    draw(ctx) {
      // la superficie del agua, una ola a mano que aparece y se va
      const s = swell(t / 2.2);
      pen(ctx, 3, s);
      ctx.beginPath();
      for (let x = 0; x <= area.w; x += 6) {
        const y = ground + Math.sin(x / 22 + t * 6) * 5 * s;
        if (x === 0) ctx.moveTo(area.x + x, y);
        else ctx.lineTo(area.x + x, y);
      }
      haloStroke(ctx);
      drops.forEach((d) => {
        if (!d.alive) return;
        pen(ctx, 2.4);
        drop(ctx, d.x, d.y, d.r, Math.atan2(d.vy, d.vx));
      });
      ripples.forEach((r) => {
        const k = r.age / 0.9;
        if (k > 1) return;
        pen(ctx, 2.4, 1 - k);
        ctx.beginPath();
        ctx.ellipse(r.x, ground, r.max * ease(k), r.max * ease(k) * 0.28, 0, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    },
  };
}

function wind(area: Area): Effect {
  let t = 0;
  const g = grow(area);
  const swirls = Array.from({ length: Math.round(6 * amount(area)) }, (_, k) => ({
    x: inX(area, 0.1, 0.9),
    y: inY(area, 0.15, 0.85),
    vx: (k % 2 ? 1 : -1) * rand(60, 160),
    vy: rand(-70, -10),
    size: rand(0.7, 1.3) * g,
    spin: rand(5, 9) * (k % 2 ? 1 : -1),
    delay: k * 0.07,
  }));
  const dashes = Array.from({ length: Math.round(14 * amount(area)) }, () => ({ y: inY(area, 0.02, 0.98), x: inX(area), len: rand(50, 140) * g, v: rand(500, 900) * (Math.random() < 0.5 ? -1 : 1), delay: rand(0, 0.5) }));
  const leaves = Array.from({ length: Math.round(9 * amount(area)) }, () => ({ x: inX(area, 0.1, 0.9), y: inY(area, 0.2, 0.8), vx: rand(-320, 320), vy: rand(-260, 40), rot: rand(0, 6), spin: rand(-9, 9) }));
  return {
    update(dt) {
      t += dt;
      swirls.forEach((s) => {
        if (t < s.delay) return;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
      });
      dashes.forEach((d) => {
        if (t > d.delay) d.x += d.v * dt;
      });
      leaves.forEach((l) => {
        l.vx *= 0.985;
        l.vy += 140 * dt;
        l.x += l.vx * dt;
        l.y += l.vy * dt;
        l.rot += l.spin * dt;
      });
      return t < 1.9;
    },
    draw(ctx) {
      swirls.forEach((s) => {
        const k = (t - s.delay) / 1.6;
        if (k <= 0 || k > 1) return;
        pen(ctx, 3, swell(k));
        ctx.beginPath();
        const turns = 2.6 * ease(k * 1.6);
        for (let a = 0; a <= turns * Math.PI * 2; a += 0.25) {
          const r = (3 + a * 6) * s.size;
          const x = s.x + Math.cos(a + t * s.spin) * r;
          const y = s.y + Math.sin(a + t * s.spin) * r * 0.75;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        haloStroke(ctx);
      });
      dashes.forEach((d) => {
        const k = (t - d.delay) / 0.8;
        if (k <= 0 || k > 1) return;
        pen(ctx, 2.6, swell(k));
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - Math.sign(d.v) * d.len, d.y);
        haloStroke(ctx);
      });
      leaves.forEach((l) => {
        pen(ctx, 2.2, 1 - t / 1.9);
        ctx.save();
        ctx.translate(l.x, l.y);
        ctx.rotate(l.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, 11, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = PAPER;
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-11, 0);
        ctx.lineTo(11, 0);
        ctx.stroke();
        ctx.restore();
      });
      ctx.globalAlpha = 1;
    },
  };
}

function earth(area: Area): Effect {
  let t = 0;
  let shake = 0;
  const g = grow(area);
  const ground = area.y + area.h * 0.95;
  const rocks = Array.from({ length: Math.round(9 * amount(area)) }, (_, k) => {
    const size = rand(14, 32) * Math.sqrt(g);
    return {
      x: inX(area, 0.06, 0.94),
      y: area.y - rand(120, 360) - k * 22,
      vy: rand(0, 120),
      size,
      rot: rand(0, 6),
      spin: rand(-3, 3),
      verts: Array.from({ length: 7 }, (_, i) => ({ a: (i / 7) * Math.PI * 2 + rand(-0.25, 0.25), r: size * rand(0.7, 1.15) })),
      bounced: false,
      landed: false,
    };
  });
  const cracks: { pts: Vec[]; born: number }[] = [];
  const puffs: { x: number; age: number }[] = [];
  const crackAt = (x: number) => {
    for (let k = 0; k < 3; k++) {
      const pts: Vec[] = [{ x, y: ground }];
      const dir = rand(-1, 1) > 0 ? 1 : -1;
      for (let i = 0; i < 5; i++) {
        const last = pts[pts.length - 1];
        pts.push({ x: last.x + dir * rand(10, 26), y: last.y + rand(-2, 14) });
      }
      cracks.push({ pts, born: t });
    }
  };
  return {
    get shake() {
      return shake;
    },
    update(dt) {
      t += dt;
      shake = Math.max(0, shake - dt * 40);
      rocks.forEach((r) => {
        if (r.landed) return;
        r.vy += 1900 * dt;
        r.y += r.vy * dt;
        r.rot += r.spin * dt;
        if (r.y + r.size * 0.7 > ground && r.vy > 0) {
          r.y = ground - r.size * 0.7;
          if (!r.bounced) {
            r.bounced = true;
            r.vy = -r.vy * 0.32;
            shake = Math.max(shake, 11);
            puffs.push({ x: r.x, age: 0 });
            crackAt(r.x);
          } else {
            r.landed = true;
          }
        }
      });
      puffs.forEach((p) => (p.age += dt));
      return t < 2.3;
    },
    draw(ctx) {
      const fade = t > 1.8 ? 1 - (t - 1.8) / 0.5 : 1;
      cracks.forEach((c) => {
        const k = ease((t - c.born) / 0.35);
        pen(ctx, 2.6, fade);
        polyline(ctx, c.pts.slice(0, Math.max(2, Math.ceil(c.pts.length * k))), true);
      });
      puffs.forEach((p) => {
        const k = p.age / 0.6;
        if (k > 1) return;
        pen(ctx, 2.2, 1 - k);
        for (const dx of [-18, 0, 18]) {
          ctx.beginPath();
          ctx.arc(p.x + dx * (1 + k), ground - 6 - k * 14, 6 + k * 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
      rocks.forEach((r) => {
        pen(ctx, 2.6, fade);
        ctx.save();
        ctx.translate(r.x, r.y);
        ctx.rotate(r.rot);
        ctx.beginPath();
        r.verts.forEach((v, i) => (i === 0 ? ctx.moveTo(Math.cos(v.a) * v.r, Math.sin(v.a) * v.r) : ctx.lineTo(Math.cos(v.a) * v.r, Math.sin(v.a) * v.r)));
        ctx.closePath();
        ctx.fill();
        // un brillo de papel, para que se lea como piedra y no como mancha
        ctx.strokeStyle = PAPER;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-r.size * 0.35, -r.size * 0.25);
        ctx.lineTo(-r.size * 0.05, -r.size * 0.4);
        ctx.stroke();
        ctx.restore();
      });
      ctx.globalAlpha = 1;
    },
  };
}

function lightning(area: Area, height: number): Effect {
  let t = 0;
  let shake = 0;
  const n = Math.round(3 * amount(area));
  const strikes = Array.from({ length: n }, (_, k) => {
    const delay = k * (0.62 / n);
    // Repartidas a lo ancho: cada descarga cae en su franja de la zona.
    const to = { x: area.x + area.w * ((k + rand(0.2, 0.8)) / n), y: inY(area, 0.45, 0.9) };
    const from = { x: to.x + rand(-60, 60), y: -20 };
    const main = boltPath(from, to, 120, 6);
    const branches = [0, 1].map(() => {
      const start = main[Math.floor(rand(main.length * 0.3, main.length * 0.7))];
      return boltPath(start, { x: start.x + rand(-140, 140), y: start.y + rand(60, 160) }, 50, 4);
    });
    const sparks = Array.from({ length: 10 }, () => ({ a: rand(0, Math.PI * 2), v: rand(120, 320), rot: rand(0, 3) }));
    return { delay, to, main, branches, sparks, hit: false };
  });
  return {
    get shake() {
      return shake;
    },
    update(dt) {
      t += dt;
      shake = Math.max(0, shake - dt * 50);
      strikes.forEach((s) => {
        if (!s.hit && t >= s.delay) {
          s.hit = true;
          shake = 15;
        }
      });
      return t < 2;
    },
    draw(ctx) {
      strikes.forEach((s) => {
        const k = t - s.delay;
        if (k < 0 || k > 0.16) return;
        // fogonazo: la pantalla en tinta un instante
        if (k < 0.05) {
          ctx.globalAlpha = 0.85 * (1 - k / 0.05);
          ctx.fillStyle = INK;
          ctx.fillRect(0, 0, ctx.canvas.width, height);
        }
        pen(ctx, 9);
        polyline(ctx, s.main);
        s.branches.forEach((b) => {
          pen(ctx, 4);
          polyline(ctx, b);
        });
        ctx.globalAlpha = 1;
        ctx.strokeStyle = PAPER;
        ctx.lineWidth = 2.4;
        polyline(ctx, s.main);
      });
      // chamusquina y chispas en el sitio de cada impacto
      strikes.forEach(({ delay, to, sparks }) => {
        const k = (t - delay) / 1.2;
        if (k <= 0 || k > 1) return;
        pen(ctx, 3, 1 - k);
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(to.x + Math.cos(a) * 14, to.y + Math.sin(a) * 14);
          ctx.lineTo(to.x + Math.cos(a) * (30 + (i % 2) * 18), to.y + Math.sin(a) * (30 + (i % 2) * 18));
          haloStroke(ctx);
        }
        sparks.forEach((sp) => {
          const d = sp.v * ease(k);
          cross(ctx, to.x + Math.cos(sp.a) * d, to.y + Math.sin(sp.a) * d, 6, sp.rot + k * 6, 2.4);
        });
      });
      ctx.globalAlpha = 1;
    },
  };
}

function ice(area: Area): Effect {
  let t = 0;
  const at = centre(area);
  const g = grow(area);
  // Púas hasta casi el borde de la zona, en todas direcciones.
  const count = Math.round(11 * Math.sqrt(amount(area))) + 3;
  const spikes = Array.from({ length: count }, (_, k) => {
    const a = (k / count) * Math.PI * 2 + rand(-0.15, 0.15);
    return { a, len: toEdge(area, a) * rand(0.55, 0.95), w: rand(9, 15) * g };
  });
  const shards: { x: number; y: number; vx: number; vy: number; rot: number; spin: number; s: number }[] = [];
  const flakes = Array.from({ length: Math.round(16 * amount(area)) }, () => {
    const a = rand(0, Math.PI * 2);
    const v = rand(30, 120);
    return { x: inX(area, 0.05, 0.95), y: inY(area, 0.05, 0.95), vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rand(7, 15) * Math.sqrt(g), rot: rand(0, 1), spin: rand(-2, 2), phase: rand(0, 6) };
  });
  let shattered = false;
  return {
    update(dt) {
      t += dt;
      if (!shattered && t > 0.75) {
        shattered = true;
        spikes.forEach((s) => {
          for (let i = 0; i < 3; i++) {
            const d = s.len * rand(0.3, 1);
            shards.push({ x: at.x + Math.cos(s.a) * d, y: at.y + Math.sin(s.a) * d, vx: Math.cos(s.a) * rand(40, 160), vy: Math.sin(s.a) * rand(40, 160) - 80, rot: rand(0, 6), spin: rand(-8, 8), s: rand(5, 10) });
          }
        });
      }
      shards.forEach((s) => {
        s.vy += 900 * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.rot += s.spin * dt;
      });
      flakes.forEach((f) => {
        f.vx *= 0.96;
        f.vy = f.vy * 0.96 + 30 * dt;
        f.x += (f.vx + Math.sin(t * 3 + f.phase) * 20) * dt;
        f.y += f.vy * dt;
        f.rot += f.spin * dt;
      });
      return t < 2.4;
    },
    draw(ctx) {
      if (!shattered) {
        const k = ease(t / 0.3);
        spikes.forEach((s) => {
          const tip = { x: at.x + Math.cos(s.a) * s.len * k, y: at.y + Math.sin(s.a) * s.len * k };
          const nx = -Math.sin(s.a) * s.w * 0.5;
          const ny = Math.cos(s.a) * s.w * 0.5;
          pen(ctx, 2.6);
          ctx.beginPath();
          ctx.moveTo(at.x + nx, at.y + ny);
          ctx.lineTo(tip.x, tip.y);
          ctx.lineTo(at.x - nx, at.y - ny);
          ctx.closePath();
          ctx.fillStyle = PAPER;
          ctx.fill();
          ctx.stroke();
        });
      }
      shards.forEach((s) => {
        pen(ctx, 2.2, Math.max(0, 1 - (t - 0.75) / 0.9));
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.beginPath();
        ctx.moveTo(0, -s.s);
        ctx.lineTo(s.s * 0.6, s.s);
        ctx.lineTo(-s.s * 0.6, s.s);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      });
      flakes.forEach((f) => {
        pen(ctx, 2.2, swell(t / 2.4));
        snowflake(ctx, f.x, f.y, f.r, f.rot);
      });
      ctx.globalAlpha = 1;
    },
  };
}

function light(area: Area): Effect {
  let t = 0;
  let shake = 8;
  const at = centre(area);
  const g = grow(area);
  const burst = Array.from({ length: Math.round(56 * amount(area)) }, () => {
    const a = rand(0, Math.PI * 2);
    const v = rand(220, 640) * Math.sqrt(g);
    return { x: at.x, y: at.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, rot: rand(0, 3), spin: rand(-8, 8), s: rand(6, 14) };
  });
  return {
    get shake() {
      return shake;
    },
    update(dt) {
      t += dt;
      shake = Math.max(0, shake - dt * 20);
      burst.forEach((b) => {
        b.vx *= 0.985;
        b.vy = b.vy * 0.985 + 380 * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.rot += b.spin * dt;
      });
      return t < 2.6;
    },
    draw(ctx) {
      const k = t / 2.6;
      // rayos que giran despacio
      pen(ctx, 3.2, swell(k));
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2 + t * 0.6;
        const r0 = 40 * g + Math.sin(t * 8 + i) * 6;
        // Los rayos llegan hasta el borde de la zona.
        const r1 = r0 + Math.max(0, toEdge(area, a) - r0) * (i % 2 ? 0.6 : 1) * ease(t / 0.5);
        ctx.beginPath();
        ctx.moveTo(at.x + Math.cos(a) * r0, at.y + Math.sin(a) * r0);
        ctx.lineTo(at.x + Math.cos(a) * r1, at.y + Math.sin(a) * r1);
        haloStroke(ctx);
      }
      // el sol a mano
      ctx.beginPath();
      ctx.arc(at.x, at.y, 28 * g * ease(t / 0.35), 0, Math.PI * 2);
      ctx.fillStyle = PAPER;
      ctx.fill();
      ctx.stroke();
      // anillo que se abre
      const ring = ease(t / 1.2);
      pen(ctx, 6 * (1 - ring) + 1, 1 - ring);
      ctx.beginPath();
      ctx.arc(at.x, at.y, 40 + ring * Math.max(300, Math.hypot(area.w, area.h) * 0.6), 0, Math.PI * 2);
      haloStroke(ctx);
      burst.forEach((b) => {
        pen(ctx, 2.8, 1 - k);
        cross(ctx, b.x, b.y, b.s, b.rot, 2.8);
      });
      ctx.globalAlpha = 1;
    },
  };
}

/** El hechizo de cada elemento, llenando su zona. */
export function spell(element: Element, area: Area, height: number): Effect {
  switch (element) {
    case "fire":
      return fire(area);
    case "water":
      return water(area);
    case "wind":
      return wind(area);
    case "earth":
      return earth(area);
    case "lightning":
      return lightning(area, height);
    case "ice":
      return ice(area);
    case "light":
      return light(area);
  }
}

/** Fallo: una nube de humo donde estaba la letra. */
export function puff(at: Vec): Effect {
  let t = 0;
  const clouds = Array.from({ length: 7 }, (_, k) => ({ a: (k / 7) * Math.PI * 2, r: rand(10, 18) }));
  return {
    update(dt) {
      t += dt;
      return t < 0.8;
    },
    draw(ctx) {
      const k = ease(t / 0.8);
      pen(ctx, 2.6, 1 - k);
      clouds.forEach((c) => {
        const d = 24 + k * 50;
        ctx.beginPath();
        ctx.arc(at.x + Math.cos(c.a) * d, at.y + Math.sin(c.a) * d * 0.7 - k * 30, c.r * (1 + k), 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
    },
  };
}

/** Celebración final: cruces que llueven sin parar hasta que se cierra. */
export function confetti(width: number): Effect & { stop(): void } {
  let running = true;
  const bits: { x: number; y: number; vy: number; rot: number; spin: number; s: number; sway: number }[] = [];
  let spawn = 0;
  let t = 0;
  return {
    stop() {
      running = false;
    },
    update(dt) {
      t += dt;
      spawn += dt;
      while (running && spawn > 0.05) {
        spawn -= 0.05;
        bits.push({ x: rand(0, width), y: -20, vy: rand(80, 200), rot: rand(0, 3), spin: rand(-4, 4), s: rand(5, 12), sway: rand(0, 6) });
      }
      bits.forEach((b) => {
        b.y += b.vy * dt;
        b.x += Math.sin(t * 2 + b.sway) * 30 * dt;
        b.rot += b.spin * dt;
      });
      for (let i = bits.length - 1; i >= 0; i--) if (bits[i].y > 4000) bits.splice(i, 1);
      return running || bits.length > 0;
    },
    draw(ctx) {
      bits.forEach((b) => {
        pen(ctx, 2.6);
        cross(ctx, b.x, b.y, b.s, b.rot, 2.6);
      });
      ctx.globalAlpha = 1;
    },
  };
}
