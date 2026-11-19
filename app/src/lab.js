// Vice City Cover Lab — the editor.
// Wires the page: photo library, layout/grade/look pickers, word fields,
// per-panel crop controls, undo/redo, randomize, exact-size PNG export and
// the fixed screenshot scenes (?shot=cover / ?shot=editor).
import { paintCover } from './paint.js';
import {
  LAYOUTS, GRADES, LOOKS, STORY_TITLES, PANEL_FILTERS, FRAME_STYLES,
  TITLE_STYLES, EXPORT_SIZES, defaultLabState, applyLook,
} from './design.js';
import { runShot } from './shots.js';

const $ = (id) => document.getElementById(id);
const canvas = $('cover');
const statusEl = $('status');
let state = defaultLabState();
// The photo library: image elements by index; 0 and 1 are the shipped samples.
let library = [];
let history = [];
let historyAt = -1;
let dragging = null;

/** Loads an image from a URL, resolving once it can be drawn. */
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function say(msg) { statusEl.textContent = msg; }

/** Repaints the preview canvas from the current state. */
export function repaint() {
  const size = EXPORT_SIZES.find((s) => s.id === state.size) || EXPORT_SIZES[2];
  if (canvas.width !== size.w || canvas.height !== size.h) {
    canvas.width = size.w;
    canvas.height = size.h;
  }
  paintCover(canvas, state, library);
}

/** Pushes the current state onto the undo stack. */
function commit(label) {
  history = history.slice(0, historyAt + 1);
  history.push(JSON.stringify(state));
  if (history.length > 40) history.shift();
  historyAt = history.length - 1;
  if (label) say(label);
  syncPanelControls();
}

function undo() {
  if (historyAt <= 0) { say('Nothing to undo.'); return; }
  historyAt -= 1;
  state = JSON.parse(history[historyAt]);
  repaint();
  syncAll();
  say('Undid.');
}

function redo() {
  if (historyAt >= history.length - 1) { say('Nothing to redo.'); return; }
  historyAt += 1;
  state = JSON.parse(history[historyAt]);
  repaint();
  syncAll();
  say('Redid.');
}

/** Applies a one-click look and records it. */
function pickLook(look) {
  state = applyLook(state, look);
  state.lookId = look.id;
  commit(`Look: ${look.name}.`);
  repaint();
  syncAll();
}

/** Picks a layout, keeping words, photos and crops. */
function pickLayout(id) {
  state.layout = id;
  const layout = LAYOUTS[id];
  state.selected = 0;
  commit(`Layout: ${layout.name}.`);
  repaint();
  syncAll();
}

function pickGrade(id) {
  state.grade = id;
  commit(`Grade: ${GRADES[id].name}.`);
  repaint();
  syncAll();
}

/** Randomizes layout, grade, look words and frame — photos stay put. */
function randomize() {
  const layoutIds = Object.keys(LAYOUTS);
  const gradeIds = Object.keys(GRADES);
  const look = LOOKS[Math.floor(Math.random() * LOOKS.length)];
  state = applyLook(state, look);
  state.lookId = look.id;
  state.layout = layoutIds[Math.floor(Math.random() * layoutIds.length)];
  state.grade = gradeIds[Math.floor(Math.random() * gradeIds.length)];
  state.title = STORY_TITLES[Math.floor(Math.random() * STORY_TITLES.length)];
  commit('Random look — spin again for another.');
  repaint();
  syncAll();
}

function resetLab() {
  const keepPhotos = library;
  state = defaultLabState();
  library = keepPhotos;
  commit('Reset to the Vice Heist look.');
  repaint();
  syncAll();
}

/** Exports the current cover at exact size as a PNG download. */
function exportOne(sizeId) {
  const size = EXPORT_SIZES.find((s) => s.id === sizeId) || EXPORT_SIZES[2];
  const off = document.createElement('canvas');
  off.width = size.w;
  off.height = size.h;
  paintCover(off, state, library);
  off.toBlob((blob) => {
    if (!blob) { say('Export failed — try again.'); return; }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `vice-city-cover-${size.w}x${size.h}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    say(`Saved vice-city-cover-${size.w}x${size.h}.png`);
  }, 'image/png');
}

/** Exports all three post sizes, one download after another. */
function exportAll() {
  EXPORT_SIZES.forEach((s, i) => {
    setTimeout(() => exportOne(s.id), i * 450);
  });
  say('Exporting all three sizes…');
}

/** The panel the pointer is over, in canvas pixels. */
function panelAt(cx, cy) {
  const layout = LAYOUTS[state.layout];
  const rects = layout.panels(canvas.width, canvas.height);
  for (let i = rects.length - 1; i >= 0; i--) {
    const r = rects[i];
    if (cx >= r.x * canvas.width && cx <= (r.x + r.w) * canvas.width
      && cy >= r.y * canvas.height && cy <= (r.y + r.h) * canvas.height) return i;
  }
  return -1;
}

function canvasPoint(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - rect.left) / rect.width) * canvas.width,
    y: ((e.clientY - rect.top) / rect.height) * canvas.height,
  };
}

// --- Pointer: click a panel to select it, drag to pan its photo. ---
canvas.addEventListener('pointerdown', (e) => {
  const p = canvasPoint(e);
  const hit = panelAt(p.x, p.y);
  if (hit < 0) return;
  state.selected = hit;
  syncPanelControls();
  dragging = { panel: hit, x: p.x, y: p.y, ox: state.panels[hit].ox, oy: state.panels[hit].oy, moved: false };
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const p = canvasPoint(e);
  const slot = state.panels[dragging.panel];
  const dx = (p.x - dragging.x) / canvas.width;
  const dy = (p.y - dragging.y) / canvas.height;
  if (Math.abs(dx) + Math.abs(dy) > 0.002) dragging.moved = true;
  slot.ox = Math.max(-0.6, Math.min(0.6, dragging.ox + dx));
  slot.oy = Math.max(-0.6, Math.min(0.6, dragging.oy + dy));
  repaint();
});
canvas.addEventListener('pointerup', () => {
  if (dragging && dragging.moved) commit('Panned the photo.');
  dragging = null;
});
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const slot = state.panels[state.selected];
  slot.zoom = Math.max(1, Math.min(3, slot.zoom * (e.deltaY < 0 ? 1.08 : 0.93)));
  $('zoom').value = slot.zoom;
  $('zoomVal').textContent = `${slot.zoom.toFixed(2)}×`;
  repaint();
}, { passive: false });

// --- Photo library: samples, uploads, drag-and-drop. ---
async function addSample(name, label) {
  try {
    const img = await loadImage(`samples/${name}.jpg`);
    library.push(img);
    addPhotoChip(library.length - 1, label || name);
    repaint();
  } catch { say(`Could not load sample ${name}.`); }
}

function addPhotoChip(index, label) {
  const chip = document.createElement('button');
  chip.type = 'button';
  chip.className = 'photo-chip';
  chip.textContent = label;
  chip.title = `Use ${label} in the selected panel`;
  chip.addEventListener('click', () => {
    state.panels[state.selected].photo = index;
    commit(`${label} in panel ${state.selected + 1}.`);
    repaint();
    syncPanelControls();
  });
  $('photos').appendChild(chip);
}

async function addUploads(files) {
  for (const file of files) {
    if (library.length >= 6) { say('Library full — 6 photos max.'); break; }
    if (!file.type.startsWith('image/')) continue;
    const img = await loadImage(URL.createObjectURL(file));
    library.push(img);
    addPhotoChip(library.length - 1, file.name.replace(/\.[^.]+$/, '').slice(0, 14) || 'Photo');
  }
  repaint();
  say(`${library.length} photos in the library.`);
}

$('upload').addEventListener('change', (e) => addUploads([...e.target.files]));
$('dropzone').addEventListener('click', () => $('upload').click());
$('dropzone').addEventListener('dragover', (e) => { e.preventDefault(); $('dropzone').classList.add('over'); });
$('dropzone').addEventListener('dragleave', () => $('dropzone').classList.remove('over'));
$('dropzone').addEventListener('drop', (e) => {
  e.preventDefault();
  $('dropzone').classList.remove('over');
  addUploads([...e.dataTransfer.files]);
});

// --- Picker grids: layouts, grades, looks, story titles. ---
function buildPickers() {
  const layoutGrid = $('layouts');
  Object.entries(LAYOUTS).forEach(([id, layout]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick';
    b.dataset.layout = id;
    b.innerHTML = `<strong>${layout.name}</strong><span>${layout.blurb}</span>`;
    b.addEventListener('click', () => pickLayout(id));
    layoutGrid.appendChild(b);
  });
  const gradeGrid = $('grades');
  Object.entries(GRADES).forEach(([id, grade]) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'swatch';
    b.dataset.grade = id;
    b.style.background = `linear-gradient(135deg, ${grade.sky[1]}, ${grade.sky[3]}, ${grade.sky[4]})`;
    b.innerHTML = `<span>${grade.name}</span>`;
    b.addEventListener('click', () => pickGrade(id));
    gradeGrid.appendChild(b);
  });
  const lookGrid = $('looks');
  LOOKS.forEach((look) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pick look';
    b.dataset.look = look.id;
    const grade = GRADES[look.grade];
    b.style.background = `linear-gradient(135deg, ${grade.sky[0]}, ${grade.sky[2]})`;
    b.innerHTML = `<strong>${look.name}</strong><span>${LAYOUTS[look.layout].name} · ${grade.name}</span>`;
    b.addEventListener('click', () => pickLook(look));
    lookGrid.appendChild(b);
  });
  const titleChips = $('titleChips');
  STORY_TITLES.forEach((t) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip';
    b.textContent = t;
    b.addEventListener('click', () => {
      state.title = t;
      $('title').value = t;
      commit(`Title: ${t}.`);
      repaint();
    });
    titleChips.appendChild(b);
  });
  const frameSel = $('frameStyle');
  Object.entries(FRAME_STYLES).forEach(([id, f]) => {
    const o = document.createElement('option');
    o.value = id;
    o.textContent = `${f.name} — ${f.blurb}`;
    frameSel.appendChild(o);
  });
  const titleSel = $('titleStyle');
  Object.entries(TITLE_STYLES).forEach(([id, t]) => {
    const o = document.createElement('option');
    o.value = id;
    o.textContent = t.name;
    titleSel.appendChild(o);
  });
  const filterSel = $('panelFilter');
  Object.entries(PANEL_FILTERS).forEach(([id, f]) => {
    const o = document.createElement('option');
    o.value = id;
    o.textContent = f.name;
    filterSel.appendChild(o);
  });
  const sizeSel = $('size');
  EXPORT_SIZES.forEach((s) => {
    const o = document.createElement('option');
    o.value = s.id;
    o.textContent = s.label;
    sizeSel.appendChild(o);
  });
}

// --- Word fields and toggles. ---
function bindWords() {
  const textFields = [
    ['title', 'title'], ['subtitle', 'subtitle'], ['tagline', 'tagline'],
    ['issue', 'issue'], ['badge', 'badge'], ['bubbleText', 'bubbleText'],
  ];
  textFields.forEach(([id, key]) => {
    $(id).addEventListener('input', (e) => { state[key] = e.target.value; repaint(); });
    $(id).addEventListener('change', () => commit('Words updated.'));
  });
  $('heat').addEventListener('input', (e) => {
    state.heat = Number(e.target.value);
    $('heatVal').textContent = `${state.heat} ★`;
    repaint();
  });
  $('heat').addEventListener('change', () => commit('Heat stars updated.'));
  $('titleScale').addEventListener('input', (e) => {
    state.titleScale = Number(e.target.value);
    $('titleScaleVal').textContent = `${state.titleScale.toFixed(1)}×`;
    repaint();
  });
  $('titleScale').addEventListener('change', () => commit('Title size updated.'));
  $('titleStyle').addEventListener('change', (e) => {
    state.titleStyle = e.target.value;
    commit(`Title style: ${TITLE_STYLES[state.titleStyle].name}.`);
    repaint();
  });
  $('frameStyle').addEventListener('change', (e) => {
    state.frameStyle = e.target.value;
    commit(`Frame: ${FRAME_STYLES[state.frameStyle].name}.`);
    repaint();
  });
  $('size').addEventListener('change', (e) => {
    state.size = e.target.value;
    commit(`Export size: ${state.size}.`);
    repaint();
  });
  const toggles = ['palms', 'skyline', 'birds', 'waves', 'halftone', 'rays', 'grain', 'vignette', 'bubble'];
  toggles.forEach((key) => {
    $(key).addEventListener('change', (e) => {
      state[key] = key === 'bubble' ? (e.target.checked ? 'on' : '') : e.target.checked;
      $('bubbleTextRow').style.display = state.bubble === 'on' ? '' : 'none';
      commit(`${key} ${e.target.checked ? 'on' : 'off'}.`);
      repaint();
    });
  });
}

// --- Per-panel crop controls for the selected panel. ---
function syncPanelControls() {
  const slot = state.panels[state.selected];
  $('panelLabel').textContent = `Panel ${state.selected + 1} of ${LAYOUTS[state.layout].panelsCount}`;
  $('panelPhoto').value = String(slot.photo);
  $('zoom').value = slot.zoom;
  $('zoomVal').textContent = `${slot.zoom.toFixed(2)}×`;
  $('panX').value = slot.ox;
  $('panY').value = slot.oy;
  $('rot').value = slot.rot;
  $('rotVal').textContent = `${slot.rot}°`;
  $('flip').checked = slot.flip;
  $('panelFilter').value = slot.filter;
}

function bindPanelControls() {
  const photoSel = $('panelPhoto');
  for (let i = 0; i < 6; i++) {
    const o = document.createElement('option');
    o.value = String(i);
    o.textContent = `Photo ${i + 1}`;
    photoSel.appendChild(o);
  }
  photoSel.addEventListener('change', (e) => {
    state.panels[state.selected].photo = Number(e.target.value);
    commit(`Panel ${state.selected + 1} uses photo ${Number(e.target.value) + 1}.`);
    repaint();
  });
  $('zoom').addEventListener('input', (e) => {
    state.panels[state.selected].zoom = Number(e.target.value);
    $('zoomVal').textContent = `${state.panels[state.selected].zoom.toFixed(2)}×`;
    repaint();
  });
  $('zoom').addEventListener('change', () => commit('Zoom updated.'));
  $('panX').addEventListener('input', (e) => {
    state.panels[state.selected].ox = Number(e.target.value);
    repaint();
  });
  $('panX').addEventListener('change', () => commit('Pan updated.'));
  $('panY').addEventListener('input', (e) => {
    state.panels[state.selected].oy = Number(e.target.value);
    repaint();
  });
  $('panY').addEventListener('change', () => commit('Pan updated.'));
  $('rot').addEventListener('input', (e) => {
    state.panels[state.selected].rot = Number(e.target.value);
    $('rotVal').textContent = `${state.panels[state.selected].rot}°`;
    repaint();
  });
  $('rot').addEventListener('change', () => commit('Rotation updated.'));
  $('flip').addEventListener('change', (e) => {
    state.panels[state.selected].flip = e.target.checked;
    commit(e.target.checked ? 'Photo flipped.' : 'Flip cleared.');
    repaint();
  });
  $('panelFilter').addEventListener('change', (e) => {
    state.panels[state.selected].filter = e.target.value;
    commit(`Panel filter: ${PANEL_FILTERS[e.target.value].name}.`);
    repaint();
  });
  $('prevPanel').addEventListener('click', () => {
    const n = LAYOUTS[state.layout].panelsCount;
    state.selected = (state.selected - 1 + n) % n;
    syncPanelControls();
    repaint();
  });
  $('nextPanel').addEventListener('click', () => {
    const n = LAYOUTS[state.layout].panelsCount;
    state.selected = (state.selected + 1) % n;
    syncPanelControls();
    repaint();
  });
}

/** Reflects the whole state back into every control. */
function syncAll() {
  $('title').value = state.title;
  $('subtitle').value = state.subtitle;
  $('tagline').value = state.tagline;
  $('issue').value = state.issue;
  $('badge').value = state.badge;
  $('bubbleText').value = state.bubbleText;
  $('heat').value = state.heat;
  $('heatVal').textContent = `${state.heat} ★`;
  $('titleScale').value = state.titleScale;
  $('titleScaleVal').textContent = `${state.titleScale.toFixed(1)}×`;
  $('titleStyle').value = state.titleStyle;
  $('frameStyle').value = state.frameStyle;
  $('size').value = state.size;
  ['palms', 'skyline', 'birds', 'waves', 'halftone', 'rays', 'grain', 'vignette'].forEach((k) => { $(k).checked = !!state[k]; });
  $('bubble').checked = state.bubble === 'on';
  $('bubbleTextRow').style.display = state.bubble === 'on' ? '' : 'none';
  document.querySelectorAll('[data-layout]').forEach((b) => b.classList.toggle('active', b.dataset.layout === state.layout));
  document.querySelectorAll('[data-grade]').forEach((b) => b.classList.toggle('active', b.dataset.grade === state.grade));
  document.querySelectorAll('[data-look]').forEach((b) => b.classList.toggle('active', b.dataset.look === state.lookId));
  syncPanelControls();
}

// --- Top buttons and keyboard shortcuts. ---
$('exportOne').addEventListener('click', () => exportOne(state.size));
$('exportAll').addEventListener('click', exportAll);
$('random').addEventListener('click', randomize);
$('reset').addEventListener('click', resetLab);
$('undo').addEventListener('click', undo);
$('redo').addEventListener('click', redo);
document.addEventListener('keydown', (e) => {
  if (e.target.matches('input, textarea, select')) return;
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
  else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); }
  else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); exportOne(state.size); }
  else if (e.key.toLowerCase() === 'r' && !e.ctrlKey && !e.metaKey) { randomize(); }
});

buildPickers();
bindWords();
bindPanelControls();

// --- Boot: load the samples, then paint. A ?shot= query sets up a scene. ---
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
async function boot() {
  await document.fonts.ready;
  await addSample('boulevard', 'Boulevard');
  await addSample('pier', 'Pier');
  if (shot) {
    await runShot(shot, params, async (lookId, photoName, sizeId) => {
      const look = LOOKS.find((l) => l.id === lookId);
      if (look) state = applyLook(state, look);
      if (sizeId) state.size = sizeId;
      const idx = library.findIndex((_, i) => i === (photoName === 'pier' ? 1 : 0));
      // Deal distinct photos and distinct crops per panel: a cover that
      // repeats the same framing in every panel reads as a template.
      const crops = [
        { zoom: 1.00, ox: 0.00, oy: 0.00 },
        { zoom: 1.45, ox: -0.14, oy: 0.06 },
        { zoom: 1.30, ox: 0.12, oy: -0.04 },
        { zoom: 1.70, ox: 0.08, oy: 0.10 },
        { zoom: 1.15, ox: -0.06, oy: 0.08 },
      ];
      state.panels.forEach((p, i) => {
        p.photo = i % 2 === 0 ? idx : 1 - idx;
        const c = crops[i % crops.length];
        p.zoom = c.zoom; p.ox = c.ox; p.oy = c.oy;
      });
      commit('Shot scene ready.');
      repaint();
      syncAll();
    });
  } else {
    commit('Vice Heist look loaded.');
    repaint();
    syncAll();
    say('Pick a look, drop in a photo, export your cover.');
  }
}
boot();
