// Vice City Cover Lab — the cover painter.
// Paints the whole poster onto any 2D canvas at any size: sky and sun,
// skyline, photo panels with per-panel crop, rotation, flip and filter,
// palms, birds and waves, halftone, the title block in four lettering
// styles, a comic speech bubble, badge and heat stars, grain and vignette.
// The same function paints the live preview and the exported PNG, so what
// you see is exactly what you share.
import { LAYOUTS, GRADES, PANEL_FILTERS } from './design.js';

/** Deterministic PRNG so grain and birds look the same on every export. */
export function labRandom(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Wraps a title into at most two lines that fit `maxWidth` at `fontPx`. */
export function wrapTitle(ctx, text, fontPx, maxWidth) {
  const words = (text || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines = [''];
  for (const word of words) {
    const trial = lines[lines.length - 1] ? `${lines[lines.length - 1]} ${word}` : word;
    if (ctx.measureText(trial).width <= maxWidth || !lines[lines.length - 1]) {
      lines[lines.length - 1] = trial;
    } else if (lines.length < 2) {
      lines.push(word);
    } else {
      lines[1] += ` ${word}`;
    }
  }
  return lines.filter(Boolean);
}

/** Draws one photo cover-fit into a rectangle, with zoom, pan, rotation. */
export function paintPhoto(ctx, img, x, y, w, h, slot, gradeFilter) {
  if (!img || !img.naturalWidth) return false;
  const extra = PANEL_FILTERS[slot.filter] || PANEL_FILTERS.none;
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight) * slot.zoom;
  const pw = img.naturalWidth * scale;
  const ph = img.naturalHeight * scale;
  // A tall photo in a wide panel crops toward its top third, so heads survive.
  const topBias = ph > h ? (ph - h) * 0.30 : 0;
  const dx = x + (w - pw) / 2 + slot.ox * w;
  const dy = y + (h - ph) / 2 + slot.oy * h + topBias;
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  if (slot.rot) ctx.rotate((slot.rot * Math.PI) / 180);
  if (slot.flip) ctx.scale(-1, 1);
  ctx.translate(-(x + w / 2), -(y + h / 2));
  ctx.filter = [gradeFilter, extra.css].filter((f) => f && f !== 'none').join(' ') || 'none';
  ctx.drawImage(img, dx, dy, pw, ph);
  ctx.restore();
  return true;
}

/** One palm tree silhouette: leaning trunk, seven drooping fronds. */
export function paintPalm(ctx, x, y, s, lean, colour) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(lean);
  ctx.fillStyle = colour;
  ctx.strokeStyle = colour;
  ctx.lineWidth = Math.max(3, s * 0.05);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(s * 0.12, -s * 0.48, s * 0.04, -s * 0.9);
  ctx.stroke();
  const topX = s * 0.04;
  const topY = -s * 0.9;
  for (let i = 0; i < 7; i++) {
    const a = (-170 + i * 26) * (Math.PI / 180);
    const len = s * (0.44 + (i % 2) * 0.08);
    const tipX = topX + Math.cos(a) * len;
    const tipY = topY + Math.sin(a) * len + s * 0.32;
    const midX = topX + Math.cos(a) * len * 0.55;
    const midY = topY + Math.sin(a) * len * 0.55 - s * 0.12;
    const px = -Math.sin(a);
    const py = Math.cos(a);
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(midX + px * s * 0.08, midY + py * s * 0.08, tipX, tipY);
    ctx.quadraticCurveTo(midX - px * s * 0.02, midY - py * s * 0.02, topX, topY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(topX, topY, s * 0.05, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** A jagged city skyline silhouette along a baseline. */
export function paintSkyline(ctx, W, baseY, h, colour, rng) {
  ctx.save();
  ctx.fillStyle = colour;
  let x = 0;
  while (x < W) {
    const bw = W * (0.04 + rng() * 0.07);
    const bh = h * (0.35 + rng() * 0.65);
    ctx.fillRect(x, baseY - bh, bw, bh);
    // A rooftop antenna on every third tower.
    if (rng() > 0.66) ctx.fillRect(x + bw / 2 - 1, baseY - bh - h * 0.14, 2, h * 0.14);
    // Lit windows: a few warm dots on each tower.
    ctx.fillStyle = 'rgba(255, 214, 130, 0.85)';
    for (let k = 0; k < 4; k++) {
      if (rng() > 0.5) ctx.fillRect(x + bw * (0.15 + rng() * 0.7), baseY - bh + h * (0.1 + rng() * 0.7), 3, 4);
    }
    ctx.fillStyle = colour;
    x += bw + W * 0.008;
  }
  ctx.restore();
}

/** A few distant birds: small double-arc strokes in the sky. */
export function paintBirds(ctx, W, H, colour, rng) {
  ctx.save();
  ctx.strokeStyle = colour;
  ctx.lineWidth = Math.max(2, W * 0.002);
  ctx.lineCap = 'round';
  for (let i = 0; i < 5; i++) {
    const bx = W * (0.12 + rng() * 0.7);
    const by = H * (0.06 + rng() * 0.16);
    const s = W * (0.012 + rng() * 0.012);
    ctx.beginPath();
    ctx.moveTo(bx - s, by);
    ctx.quadraticCurveTo(bx - s * 0.4, by - s * 0.7, bx, by);
    ctx.quadraticCurveTo(bx + s * 0.4, by - s * 0.7, bx + s, by);
    ctx.stroke();
  }
  ctx.restore();
}

/** Rolling wave lines along the bottom edge. */
export function paintWaves(ctx, W, H, colour) {
  ctx.save();
  ctx.strokeStyle = colour;
  ctx.lineWidth = Math.max(2, H * 0.004);
  for (let row = 0; row < 3; row++) {
    const y = H * (0.94 + row * 0.02);
    ctx.globalAlpha = 0.55 - row * 0.15;
    ctx.beginPath();
    for (let x = 0; x <= W; x += W / 24) {
      const yy = y + Math.sin((x / W) * Math.PI * 4 + row * 1.7) * H * 0.006;
      if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
    }
    ctx.stroke();
  }
  ctx.restore();
}

/** Halftone dots fading down across a band of the sky. */
export function paintHalftone(ctx, x, y, w, h, colour, maxR) {
  const step = Math.max(10, maxR * 2.4);
  ctx.save();
  ctx.fillStyle = colour;
  for (let yy = y; yy < y + h; yy += step) {
    const fade = 1 - (yy - y) / h;
    for (let xx = x; xx < x + w; xx += step) {
      ctx.globalAlpha = 0.30 * fade + 0.05;
      ctx.beginPath();
      ctx.arc(xx + step / 2, yy + step / 2, Math.max(0.6, maxR * fade), 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** A jagged starburst badge with centred text. */
export function paintBurst(ctx, cx, cy, r, text, fill, ink) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  const points = 14;
  for (let i = 0; i < points * 2; i++) {
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.76;
    const px = Math.cos(a) * rr;
    const py = Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.lineWidth = Math.max(2, r * 0.06);
  ctx.strokeStyle = ink;
  ctx.stroke();
  ctx.fillStyle = ink;
  const textSize = Math.min(r * 0.32, (r * 1.5) / Math.max(1, text.length));
  ctx.font = `bold ${textSize}px Anton, 'Arial Black', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, r * 0.03);
  ctx.restore();
}

/** Five heat stars, `filled` of them lit. */
export function paintHeat(ctx, x, y, size, filled, lit, dim) {
  ctx.save();
  ctx.translate(x, y);
  for (let i = 0; i < 5; i++) {
    const cx = i * size * 1.25;
    ctx.beginPath();
    for (let p = 0; p < 10; p++) {
      const a = (p / 10) * Math.PI * 2 - Math.PI / 2;
      const rr = p % 2 === 0 ? size / 2 : size / 4.5;
      const px = cx + Math.cos(a) * rr;
      const py = Math.sin(a) * rr;
      if (p === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = i < filled ? lit : dim;
    ctx.fill();
    ctx.lineWidth = Math.max(1.5, size * 0.06);
    ctx.strokeStyle = 'rgba(0,0,0,0.55)';
    ctx.stroke();
  }
  ctx.restore();
}

/** A comic speech bubble with a tail, top-left of the cover. */
export function paintBubble(ctx, x, y, w, text, ink, paper) {
  const h = w * 0.30;
  ctx.save();
  ctx.fillStyle = paper;
  ctx.strokeStyle = ink;
  ctx.lineWidth = Math.max(3, w * 0.012);
  ctx.beginPath();
  const r = h * 0.28;
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + w * 0.34, y + h);
  ctx.lineTo(x + w * 0.22, y + h * 1.28);
  ctx.lineTo(x + w * 0.24, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = ink;
  ctx.font = `bold ${Math.max(13, w * 0.075)}px 'Comic Sans MS', 'Chalkboard SE', cursive`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + w / 2, y + h / 2, w * 0.92);
  ctx.restore();
}

/**
 * Paints the full cover.
 * @param {HTMLCanvasElement} canvas - target canvas (its own pixel size).
 * @param {object} state - lab state from design.js `defaultLabState()`.
 * @param {Array} photos - image elements (or null) by library index.
 */
export function paintCover(canvas, state, photos) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  const u = Math.min(W, H) / 1000;
  const grade = GRADES[state.grade] || GRADES.sunset;
  const layout = LAYOUTS[state.layout] || LAYOUTS.masthead;
  const rng = labRandom(20261119 + state.title.length * 131 + state.layout.length * 17);

  // --- Sky: vertical sunset gradient, sun with rays and glow. ---
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  grade.sky.forEach((c, i) => sky.addColorStop(i / (grade.sky.length - 1), c));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  const sunX = W * 0.74;
  const sunY = H * 0.28;
  const sunR = Math.min(W, H) * 0.15;
  if (state.rays) {
    ctx.save();
    ctx.translate(sunX, sunY);
    ctx.fillStyle = 'rgba(255,255,255,0.09)';
    for (let i = 0; i < 12; i++) {
      ctx.rotate((Math.PI * 2) / 12);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(sunR * 2.6, -sunR * 0.10);
      ctx.lineTo(sunR * 2.6, sunR * 0.10);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 2.4);
  glow.addColorStop(0, grade.sun);
  glow.addColorStop(0.35, grade.sun + '55');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(sunX - sunR * 2.4, sunY - sunR * 2.4, sunR * 4.8, sunR * 4.8);
  ctx.fillStyle = grade.sun;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();

  if (state.birds) paintBirds(ctx, W, H, 'rgba(10,2,20,0.7)', rng);
  if (state.halftone) paintHalftone(ctx, 0, H * 0.02, W, H * 0.15, '#ffffff', Math.max(3, 7 * u));

  // --- Photo panels, each framed in the chosen frame style. ---
  const rects = layout.panels(W, H);
  const border = Math.max(3, 7 * u);
  rects.forEach((r, i) => {
    const px = r.x * W;
    const py = r.y * H;
    const pw = r.w * W;
    const ph = r.h * H;
    const slot = state.panels[i] || { photo: 0, zoom: 1, ox: 0, oy: 0, rot: 0, flip: false, filter: 'none' };
    const img = photos[slot.photo] || null;
    ctx.save();
    if (r.rot) {
      ctx.translate(px + pw / 2, py + ph / 2);
      ctx.rotate((r.rot * Math.PI) / 180);
      ctx.translate(-pw / 2, -ph / 2);
    } else {
      ctx.translate(px, py);
    }
    const style = state.frameStyle || 'comic';
    if (style === 'comic') {
      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(border * 0.9, border * 1.1, pw, ph);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, pw, ph);
    } else if (style === 'ink') {
      ctx.fillStyle = grade.ink;
      ctx.fillRect(0, 0, pw, ph);
    } else if (style === 'glow') {
      ctx.save();
      ctx.shadowColor = grade.accent;
      ctx.shadowBlur = Math.max(10, 26 * u);
      ctx.fillStyle = grade.accent;
      ctx.fillRect(0, 0, pw, ph);
      ctx.restore();
      ctx.fillStyle = grade.ink;
      ctx.fillRect(border * 0.4, border * 0.4, pw - border * 0.8, ph - border * 0.8);
    }
    const inset = style === 'bare' ? 0 : border;
    const inner = { x: inset, y: inset, w: pw - inset * 2, h: ph - inset * 2 };
    ctx.save();
    ctx.beginPath();
    ctx.rect(inner.x, inner.y, inner.w, inner.h);
    ctx.clip();
    if (img) {
      paintPhoto(ctx, img, inner.x, inner.y, inner.w, inner.h, slot, grade.photoFilter);
    } else {
      const empty = ctx.createLinearGradient(0, inner.y, 0, inner.y + inner.h);
      empty.addColorStop(0, '#3a2a55');
      empty.addColorStop(1, '#12041f');
      ctx.fillStyle = empty;
      ctx.fillRect(inner.x, inner.y, inner.w, inner.h);
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.font = `${Math.max(14, 22 * u)}px Anton, 'Arial Black', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ADD A PHOTO', inner.x + inner.w / 2, inner.y + inner.h / 2);
    }
    // Grade tint over the photo, then a bottom fade for readability.
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = grade.photoTint;
    ctx.fillRect(inner.x, inner.y, inner.w, inner.h);
    ctx.globalCompositeOperation = 'source-over';
    const fade = ctx.createLinearGradient(0, inner.y + inner.h * 0.55, 0, inner.y + inner.h);
    fade.addColorStop(0, 'rgba(10,2,20,0)');
    fade.addColorStop(1, 'rgba(10,2,20,0.45)');
    ctx.fillStyle = fade;
    ctx.fillRect(inner.x, inner.y, inner.w, inner.h);
    // Polaroid caption strip: a white band at the photo's foot.
    if (state.layout === 'polaroids' && i > 0) {
      const stripH = Math.max(12, 30 * u);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(inner.x, inner.y + inner.h - stripH, inner.w, stripH);
    }
    ctx.restore();
    ctx.restore();
  });

  // --- Decorations along the bottom and the skyline band. ---
  if (state.skyline) paintSkyline(ctx, W, H * 0.985, H * 0.10, 'rgba(8,2,16,0.9)', rng);
  if (state.palms) {
    const palmColour = 'rgba(8,2,16,0.88)';
    const base = H * 0.985;
    paintPalm(ctx, W * 0.03, base, Math.min(W, H) * 0.20, -0.10, palmColour);
    paintPalm(ctx, W * 0.97, base, Math.min(W, H) * 0.17, 0.12, palmColour);
  }
  if (state.waves) paintWaves(ctx, W, H, 'rgba(255,255,255,0.8)');

  // --- Title block: four lettering styles, zone from the layout. ---
  const zone = layout.titleZone(W, H);
  const zx = zone.x * W;
  const zy = zone.y * H;
  const zw = zone.w * W;
  const zoneH = zone.maxH * H;
  const align = zone.align || 'center';
  const anchorX = align === 'left' ? zx : align === 'right' ? zx + zw : zx + zw / 2;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';

  const titleText = (state.title || 'VICE HEIST').toUpperCase();
  let fontPx = Math.min(zoneH * 0.52, zw * 0.24) * (state.titleScale || 1);
  ctx.font = `${fontPx}px Anton, 'Arial Black', sans-serif`;
  let lines = wrapTitle(ctx, titleText, fontPx, zw);
  while (lines.length > 2 && fontPx > 16) {
    fontPx *= 0.92;
    ctx.font = `${fontPx}px Anton, 'Arial Black', sans-serif`;
    lines = wrapTitle(ctx, titleText, fontPx, zw);
  }
  const lineH = fontPx * 1.02;
  const style = state.titleStyle || 'gradient';
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.strokeStyle = grade.ink;
  ctx.lineWidth = Math.max(3, fontPx * 0.07);
  if (style === 'gradient') {
    const tg = ctx.createLinearGradient(0, zy, 0, zy + lineH * lines.length);
    grade.titleGrad.forEach((c, i) => tg.addColorStop(i / (grade.titleGrad.length - 1), c));
    ctx.fillStyle = tg;
  } else if (style === 'solid') {
    ctx.fillStyle = '#ffffff';
  } else if (style === 'outline') {
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.lineWidth = Math.max(4, fontPx * 0.10);
    ctx.strokeStyle = '#ffffff';
  } else if (style === 'neon') {
    ctx.shadowColor = grade.accent;
    ctx.shadowBlur = Math.max(10, 28 * u);
    ctx.fillStyle = '#ffffff';
  }
  ctx.shadowColor = style === 'neon' ? grade.accent : 'rgba(0,0,0,0.65)';
  ctx.shadowBlur = style === 'neon' ? Math.max(10, 28 * u) : Math.max(4, 10 * u);
  ctx.shadowOffsetY = style === 'neon' ? 0 : Math.max(3, 6 * u);
  lines.forEach((line, i) => {
    const y = zy + lineH * (i + 1) - lineH * 0.12;
    if (style !== 'outline') ctx.strokeText(line, anchorX, y);
    ctx.fillText(line, anchorX, y);
    if (style === 'outline') ctx.strokeText(line, anchorX, y);
  });
  ctx.restore();

  // Neon script subtitle under the title.
  const subY = zy + lineH * lines.length + fontPx * 0.38;
  if (state.subtitle) {
    const subPx = Math.max(18, fontPx * 0.42);
    ctx.save();
    ctx.font = `${subPx}px Pacifico, cursive`;
    ctx.textAlign = align;
    ctx.shadowColor = grade.accent;
    ctx.shadowBlur = Math.max(8, 22 * u);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(state.subtitle, anchorX, subY);
    ctx.shadowBlur = 0;
    ctx.fillStyle = grade.accent;
    ctx.globalAlpha = 0.9;
    ctx.fillText(state.subtitle, anchorX, subY);
    ctx.restore();
  }

  // Tagline in small capitals.
  if (state.tagline) {
    const tagPx = Math.max(11, Math.min(W, H) * 0.016);
    ctx.save();
    ctx.font = `bold ${tagPx}px 'Arial Narrow', Arial, sans-serif`;
    ctx.textAlign = align;
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur = Math.max(2, 4 * u);
    ctx.fillText(state.tagline.toUpperCase(), anchorX, subY + fontPx * 0.34);
    ctx.restore();
  }

  // Issue line along the very bottom edge.
  if (state.issue) {
    const issPx = Math.max(11, Math.min(W, H) * 0.015);
    ctx.save();
    ctx.font = `bold ${issPx}px 'Arial Narrow', Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = Math.max(2, 4 * u);
    ctx.fillText(state.issue.toUpperCase(), W / 2, H - Math.max(8, 14 * u));
    ctx.restore();
  }

  // --- Speech bubble, drawn after the title so it always sits on top.
  // When the title lives at the top of the cover the bubble drops to the
  // bottom-left instead, so the two never fight for the same corner. ---
  if (state.bubble === 'on' && state.bubbleText) {
    const titleOnTop = zone.y < 0.10 * H;
    const bx = W * 0.04;
    const by = titleOnTop ? H * 0.84 : H * 0.05;
    paintBubble(ctx, bx, by, W * 0.30, state.bubbleText.slice(0, 40), grade.ink, '#ffffff');
  }

  // Badge starburst top-right and heat stars top-left.
  if (state.badge) {
    const br = Math.max(26, Math.min(W, H) * 0.052);
    paintBurst(ctx, W - br * 1.25, br * 1.25, br, state.badge.toUpperCase().slice(0, 10), '#ffe600', grade.ink);
  }
  if (state.heat > 0) {
    const starSize = Math.max(14, Math.min(W, H) * 0.024);
    paintHeat(ctx, W * 0.035, H * 0.03, starSize, state.heat, '#ffe600', 'rgba(255,255,255,0.25)');
  }

  // --- Grain and vignette finish the poster look. ---
  if (state.grain) {
    ctx.save();
    const dots = Math.floor((W * H) / 260);
    for (let i = 0; i < dots; i++) {
      const gx = rng() * W;
      const gy = rng() * H;
      ctx.globalAlpha = 0.05 + rng() * 0.09;
      ctx.fillStyle = rng() > 0.5 ? '#ffffff' : '#000000';
      ctx.fillRect(gx, gy, Math.max(1, 1.6 * u), Math.max(1, 1.6 * u));
    }
    ctx.restore();
  }
  if (state.vignette) {
    const vig = ctx.createRadialGradient(
      W / 2, H / 2, Math.min(W, H) * 0.42,
      W / 2, H / 2, Math.max(W, H) * 0.75,
    );
    vig.addColorStop(0, 'rgba(0,0,0,0)');
    vig.addColorStop(1, 'rgba(5,0,15,0.42)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);
  }

  // --- Outer double frame. ---
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = Math.max(4, 10 * u);
  ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, W - ctx.lineWidth, H - ctx.lineWidth);
  ctx.strokeStyle = grade.ink;
  ctx.lineWidth = Math.max(2, 3 * u);
  const off = Math.max(4, 10 * u) + ctx.lineWidth;
  ctx.strokeRect(off, off, W - off * 2, H - off * 2);
  ctx.restore();
}
