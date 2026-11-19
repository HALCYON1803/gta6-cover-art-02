// Vice City Cover Lab — the design data: layouts, colour grades, one-click
// looks, story titles, panel filters and frame styles. All original work for
// gta6-cover-art-02. No Rockstar art, logos or fonts are used anywhere here.
//
// A layout is a set of photo panels in normalised 0..1 space plus a title
// zone. Panels carry their own rotation; the painter clips each photo to its
// panel rectangle, so a rotated panel reads as a tilted snapshot.

/** One poster layout: panel rectangles and where the title block sits. */
export const LAYOUTS = {
  masthead: {
    name: 'Magazine Masthead',
    blurb: 'Full-bleed photo, giant masthead title, footer issue line.',
    panels: () => [
      { x: 0, y: 0, w: 1, h: 1, rot: 0, bleed: true },
      { x: 0.60, y: 0.66, w: 0.34, h: 0.26, rot: -3 },
    ],
    titleZone: () => ({ x: 0.04, y: 0.03, w: 0.92, align: 'left', maxH: 0.26 }),
    panelsCount: 2,
  },
  diagonal: {
    name: 'Diagonal Slash',
    blurb: 'Two photos split by a diagonal slash, title band at the foot.',
    panels: () => [
      { x: -0.06, y: -0.04, w: 0.62, h: 0.72, rot: -8 },
      { x: 0.44, y: 0.30, w: 0.62, h: 0.72, rot: -8 },
    ],
    titleZone: () => ({ x: 0.04, y: 0.78, w: 0.92, align: 'center', maxH: 0.19 }),
    panelsCount: 2,
  },
  triptych: {
    name: 'Triptych',
    blurb: 'Three tall columns side by side, title across the middle.',
    panels: () => [
      { x: 0.015, y: 0.015, w: 0.315, h: 0.97, rot: 0 },
      { x: 0.3425, y: 0.015, w: 0.315, h: 0.97, rot: 0 },
      { x: 0.67, y: 0.015, w: 0.315, h: 0.97, rot: 0 },
    ],
    titleZone: () => ({ x: 0.04, y: 0.36, w: 0.92, align: 'center', maxH: 0.28 }),
    panelsCount: 3,
  },
  polaroids: {
    name: 'Polaroid Stack',
    blurb: 'Full-bleed photo under three tilted polaroid snapshots.',
    panels: () => [
      { x: 0, y: 0, w: 1, h: 1, rot: 0, bleed: true },
      { x: 0.05, y: 0.44, w: 0.38, h: 0.40, rot: -6 },
      { x: 0.32, y: 0.52, w: 0.38, h: 0.40, rot: 2 },
      { x: 0.58, y: 0.44, w: 0.38, h: 0.40, rot: 6 },
    ],
    titleZone: () => ({ x: 0.04, y: 0.03, w: 0.92, align: 'center', maxH: 0.26 }),
    panelsCount: 4,
  },
  centerstage: {
    name: 'Center Stage',
    blurb: 'Big centre hero with four small corner panels, title below.',
    panels: () => [
      { x: 0.26, y: 0.08, w: 0.48, h: 0.60, rot: 0 },
      { x: 0.02, y: 0.02, w: 0.22, h: 0.26, rot: -2 },
      { x: 0.76, y: 0.02, w: 0.22, h: 0.26, rot: 2 },
      { x: 0.02, y: 0.70, w: 0.22, h: 0.26, rot: 2 },
      { x: 0.76, y: 0.70, w: 0.22, h: 0.26, rot: -2 },
    ],
    titleZone: () => ({ x: 0.24, y: 0.68, w: 0.52, align: 'center', maxH: 0.28 }),
    panelsCount: 5,
  },
  skyline: {
    name: 'Skyline Strip',
    blurb: 'Wide cinema band on top, two panels below, title in the middle.',
    panels: () => [
      { x: 0.015, y: 0.015, w: 0.97, h: 0.46, rot: 0 },
      { x: 0.015, y: 0.485, w: 0.475, h: 0.36, rot: 0 },
      { x: 0.51, y: 0.485, w: 0.475, h: 0.36, rot: 0 },
    ],
    titleZone: () => ({ x: 0.04, y: 0.845, w: 0.92, align: 'center', maxH: 0.14 }),
    panelsCount: 3,
  },
  splitHero: {
    name: 'Split Hero',
    blurb: 'Tall hero photo left, two stacked panels right, title low left.',
    panels: () => [
      { x: 0.015, y: 0.015, w: 0.565, h: 0.97, rot: 0 },
      { x: 0.595, y: 0.015, w: 0.39, h: 0.475, rot: 0 },
      { x: 0.595, y: 0.51, w: 0.39, h: 0.475, rot: 0 },
    ],
    titleZone: () => ({ x: 0.035, y: 0.66, w: 0.54, align: 'left', maxH: 0.30 }),
    panelsCount: 3,
  },
  comic4: {
    name: 'Comic Four',
    blurb: '2 x 2 comic grid, each panel tilted a touch, title on top.',
    panels: () => [
      { x: 0.02, y: 0.17, w: 0.475, h: 0.385, rot: -1.5 },
      { x: 0.505, y: 0.17, w: 0.475, h: 0.385, rot: 1.5 },
      { x: 0.02, y: 0.575, w: 0.475, h: 0.385, rot: 1.5 },
      { x: 0.505, y: 0.575, w: 0.475, h: 0.385, rot: -1.5 },
    ],
    titleZone: () => ({ x: 0.04, y: 0.02, w: 0.92, align: 'center', maxH: 0.14 }),
    panelsCount: 4,
  },
  filmstrip: {
    name: 'Film Strip',
    blurb: 'A strip of four frames above one big hero photo, title on top.',
    panels: () => [
      { x: 0.015, y: 0.455, w: 0.97, h: 0.53, rot: 0 },
      { x: 0.02, y: 0.14, w: 0.23, h: 0.30, rot: 0 },
      { x: 0.265, y: 0.14, w: 0.23, h: 0.30, rot: 0 },
      { x: 0.51, y: 0.14, w: 0.23, h: 0.30, rot: 0 },
      { x: 0.755, y: 0.14, w: 0.23, h: 0.30, rot: 0 },
    ],
    titleZone: () => ({ x: 0.04, y: 0.015, w: 0.92, align: 'center', maxH: 0.12 }),
    panelsCount: 5,
  },
};

/** Colour grades: sky, sun, photo tint, title gradient, accent, ink. */
export const GRADES = {
  sunset: {
    name: 'Vice Sunset',
    sky: ['#160838', '#6d1a63', '#e8435f', '#ff8a3d', '#ffd166'],
    sun: '#fff3b0', photoTint: 'rgba(255,110,60,0.15)',
    photoFilter: 'saturate(1.35) contrast(1.08)',
    titleGrad: ['#fff7ae', '#ffb347', '#ff5e62', '#ff2e88'],
    accent: '#2de2ff', ink: '#12041f',
  },
  neon: {
    name: 'Neon Night',
    sky: ['#030014', '#160a45', '#6d1a9e', '#ff2e88', '#00e5ff'],
    sun: '#ff9de2', photoTint: 'rgba(0,229,255,0.13)',
    photoFilter: 'saturate(1.5) contrast(1.12)',
    titleGrad: ['#a5f3ff', '#2de2ff', '#ff2e88', '#ff8ad8'],
    accent: '#ffe600', ink: '#030014',
  },
  gold: {
    name: 'Palm Gold',
    sky: ['#201003', '#6e3405', '#d9731c', '#ffc53d', '#fff1a8'],
    sun: '#fffbe6', photoTint: 'rgba(255,180,40,0.17)',
    photoFilter: 'saturate(1.25) contrast(1.05)',
    titleGrad: ['#fffbe6', '#ffd166', '#ff9a3d', '#b25a00'],
    accent: '#7b1e6b', ink: '#201003',
  },
  teal: {
    name: 'Teal Noir',
    sky: ['#01121a', '#05303c', '#0d6666', '#2de2c0', '#b8fff1'],
    sun: '#e6fff8', photoTint: 'rgba(45,226,192,0.12)',
    photoFilter: 'saturate(1.2) contrast(1.14)',
    titleGrad: ['#e6fff8', '#7df9dd', '#2de2c0', '#0d6666'],
    accent: '#ff5e62', ink: '#01121a',
  },
  candy: {
    name: 'Cotton Candy',
    sky: ['#2a0a4a', '#7b2a8a', '#e05aa8', '#ff9ecf', '#b8fff1'],
    sun: '#fff0fa', photoTint: 'rgba(224,90,168,0.15)',
    photoFilter: 'saturate(1.45) contrast(1.06)',
    titleGrad: ['#fff0fa', '#ffb3dd', '#ff5ea8', '#7b2a8a'],
    accent: '#7df9dd', ink: '#2a0a4a',
  },
  ocean: {
    name: 'Ocean Drive',
    sky: ['#02122e', '#0a2a5e', '#1466a8', '#2fb3d9', '#ffd166'],
    sun: '#fffbe6', photoTint: 'rgba(47,179,217,0.14)',
    photoFilter: 'saturate(1.3) contrast(1.1)',
    titleGrad: ['#ffffff', '#a5e3ff', '#2fb3d9', '#ff8a3d'],
    accent: '#ff5e62', ink: '#02122e',
  },
  flare: {
    name: 'Solar Flare',
    sky: ['#2e0500', '#7a1a00', '#e8500f', '#ffb347', '#fff7ae'],
    sun: '#ffffff', photoTint: 'rgba(255,140,40,0.18)',
    photoFilter: 'saturate(1.4) contrast(1.1)',
    titleGrad: ['#ffffff', '#ffd166', '#ff8a3d', '#e8500f'],
    accent: '#2de2ff', ink: '#2e0500',
  },
  noir: {
    name: 'Vice Noir',
    sky: ['#040404', '#14141c', '#33333f', '#767686', '#e8e8f0'],
    sun: '#ffffff', photoTint: 'rgba(255,255,255,0.07)',
    photoFilter: 'grayscale(0.85) contrast(1.18)',
    titleGrad: ['#ffffff', '#d8d8e6', '#9a9aad', '#55555f'],
    accent: '#ff2e54', ink: '#040404',
  },
};

/** One-click looks: layout + grade + words + finish in a single tap. */
export const LOOKS = [
  {
    id: 'vice-heist', name: 'Vice Heist', layout: 'masthead', grade: 'sunset',
    title: 'VICE HEIST', subtitle: 'Golden Hour Getaway', tagline: 'PALMS  •  NEON  •  NO BRAKES',
    issue: 'VICE CITY  •  ISSUE No. 06  •  2026', badge: 'EST. 2026', heat: 5,
    titleStyle: 'gradient', frameStyle: 'comic', bubble: '', bubbleText: '',
    palms: true, skyline: true, birds: true, waves: false, halftone: true, rays: true, grain: true, vignette: true,
  },
  {
    id: 'neon-drive', name: 'Neon Drive', layout: 'diagonal', grade: 'neon',
    title: 'NEON DRIVE', subtitle: 'After Dark', tagline: 'THE CITY NEVER SLEEPS',
    issue: 'OCEAN DRIVE  •  NIGHT EDITION  •  2026', badge: 'LIVE', heat: 4,
    titleStyle: 'neon', frameStyle: 'glow', bubble: '', bubbleText: '',
    palms: false, skyline: true, birds: false, waves: false, halftone: false, rays: false, grain: true, vignette: true,
  },
  {
    id: 'palm-royale', name: 'Palm Royale', layout: 'triptych', grade: 'gold',
    title: 'PALM ROYALE', subtitle: 'Top Down Summer', tagline: 'COAST ROAD  •  GOLDEN HOUR  •  TOP DOWN',
    issue: 'BOULEVARD  •  ISSUE No. 01  •  2026', badge: 'No. 1', heat: 5,
    titleStyle: 'gradient', frameStyle: 'comic', bubble: '', bubbleText: '',
    palms: true, skyline: false, birds: true, waves: false, halftone: true, rays: true, grain: true, vignette: true,
  },
  {
    id: 'cotton-candy', name: 'Cotton Candy', layout: 'polaroids', grade: 'candy',
    title: 'COTTON CANDY', subtitle: 'Sweet Nights', tagline: 'DANCE  •  DRIVE  •  DISAPPEAR',
    issue: 'VICE CITY  •  SWEET EDITION  •  2026', badge: 'SWEET', heat: 5,
    titleStyle: 'solid', frameStyle: 'comic', bubble: 'on', bubbleText: 'Best night ever!',
    palms: true, skyline: false, birds: true, waves: false, halftone: true, rays: false, grain: false, vignette: true,
  },
  {
    id: 'last-call', name: 'Last Call', layout: 'centerstage', grade: 'noir',
    title: 'LAST CALL', subtitle: 'Midnight Noir', tagline: 'EVERY STORY ENDS AT THE PIER',
    issue: 'THE PIER  •  FINAL EDITION  •  2026', badge: 'FINAL', heat: 4,
    titleStyle: 'outline', frameStyle: 'ink', bubble: '', bubbleText: '',
    palms: false, skyline: true, birds: false, waves: true, halftone: true, rays: false, grain: true, vignette: true,
  },
  {
    id: 'ocean-drive', name: 'Ocean Drive', layout: 'skyline', grade: 'ocean',
    title: 'OCEAN DRIVE', subtitle: 'Salt Air Stories', tagline: 'SALT AIR  •  NEON SIGNS  •  LOW TIDE',
    issue: 'OCEAN DRIVE  •  ISSUE No. 12  •  2026', badge: 'WAVE', heat: 4,
    titleStyle: 'gradient', frameStyle: 'comic', bubble: '', bubbleText: '',
    palms: true, skyline: true, birds: true, waves: true, halftone: false, rays: true, grain: true, vignette: true,
  },
  {
    id: 'solar-run', name: 'Solar Run', layout: 'filmstrip', grade: 'flare',
    title: 'SOLAR RUN', subtitle: 'Chase the Sun', tagline: 'FOUR FRAMES  •  ONE GETAWAY  •  NO BRAKES',
    issue: 'VICE CITY  •  SUNSET CUT  •  2026', badge: 'HOT', heat: 5,
    titleStyle: 'gradient', frameStyle: 'comic', bubble: '', bubbleText: '',
    palms: true, skyline: true, birds: true, waves: false, halftone: true, rays: true, grain: true, vignette: true,
  },
  {
    id: 'midnight-run', name: 'Midnight Run', layout: 'comic4', grade: 'teal',
    title: 'MIDNIGHT RUN', subtitle: 'Night Shift', tagline: 'FOUR PANELS  •  ONE LONG NIGHT',
    issue: 'NIGHT SHIFT  •  ISSUE No. 03  •  2026', badge: '3 AM', heat: 3,
    titleStyle: 'neon', frameStyle: 'glow', bubble: 'on', bubbleText: 'Follow me!',
    palms: false, skyline: true, birds: false, waves: false, halftone: false, rays: false, grain: true, vignette: true,
  },
];

/** Quick-pick story titles for the caption field. */
export const STORY_TITLES = [
  'VICE HEIST', 'NEON DRIVE', 'PALM ROYALE', 'OCEAN DRIVE', 'LAST CALL',
  'SOLAR RUN', 'MIDNIGHT RUN', 'COTTON CANDY', 'BOULEVARD QUEEN',
  'PIER PRESSURE', 'SUNSET STRIP', 'GOLDEN HOUR',
];

/** Per-panel photo filters, applied on top of the grade tint. */
export const PANEL_FILTERS = {
  none: { name: 'Natural', css: 'none' },
  warm: { name: 'Warm', css: 'sepia(0.35) saturate(1.3)' },
  cool: { name: 'Cool', css: 'saturate(1.1) hue-rotate(18deg)' },
  vivid: { name: 'Vivid', css: 'saturate(1.8) contrast(1.15)' },
  mono: { name: 'Mono', css: 'grayscale(1) contrast(1.15)' },
  dusk: { name: 'Dusk', css: 'sepia(0.5) hue-rotate(-20deg) saturate(1.2)' },
};

/** Panel frame styles. */
export const FRAME_STYLES = {
  comic: { name: 'Comic White', blurb: 'White frame, ink shadow.' },
  ink: { name: 'Ink Black', blurb: 'Thick black frame.' },
  glow: { name: 'Neon Glow', blurb: 'Glowing accent edge.' },
  bare: { name: 'Bare Edge', blurb: 'No frame at all.' },
};

/** Title lettering styles. */
export const TITLE_STYLES = {
  gradient: { name: 'Sunset Gradient' },
  solid: { name: 'Solid White' },
  outline: { name: 'Outline Only' },
  neon: { name: 'Neon Glow' },
};

/** The three post sizes the bounty asks for, exact pixels. */
export const EXPORT_SIZES = [
  { id: '1080x1080', label: 'Square · 1080 × 1080', w: 1080, h: 1080 },
  { id: '1080x1350', label: 'Portrait · 1080 × 1350', w: 1080, h: 1350 },
  { id: '1920x1080', label: 'Wide · 1920 × 1080', w: 1920, h: 1080 },
];

/** A fresh default lab state. */
export function defaultLabState() {
  return {
    layout: 'masthead',
    grade: 'sunset',
    size: '1920x1080',
    title: 'VICE HEIST',
    subtitle: 'Golden Hour Getaway',
    tagline: 'PALMS  •  NEON  •  NO BRAKES',
    issue: 'VICE CITY  •  ISSUE No. 06  •  2026',
    badge: 'EST. 2026',
    heat: 5,
    titleStyle: 'gradient',
    titleScale: 1,
    bubble: '',
    bubbleText: 'Best night ever!',
    frameStyle: 'comic',
    palms: true,
    skyline: true,
    birds: true,
    waves: false,
    halftone: true,
    rays: true,
    grain: true,
    vignette: true,
    selected: 0,
    // One slot per possible panel (max 5 here); each picks a library photo
    // and its own crop: zoom, pan, rotation, flip and filter. The crops
    // differ on purpose, so no two panels ever show the same framing.
    panels: [
      { photo: 0, zoom: 1.00, ox: 0.00, oy: 0.00, rot: 0, flip: false, filter: 'none' },
      { photo: 1, zoom: 1.45, ox: -0.14, oy: 0.06, rot: 0, flip: false, filter: 'none' },
      { photo: 0, zoom: 1.30, ox: 0.12, oy: -0.04, rot: 0, flip: false, filter: 'warm' },
      { photo: 1, zoom: 1.70, ox: 0.08, oy: 0.10, rot: 0, flip: false, filter: 'none' },
      { photo: 0, zoom: 1.15, ox: -0.06, oy: 0.08, rot: 0, flip: false, filter: 'cool' },
      { photo: 1, zoom: 1.50, ox: -0.10, oy: -0.06, rot: 0, flip: true, filter: 'none' },
      { photo: 0, zoom: 1.60, ox: 0.10, oy: 0.02, rot: 0, flip: false, filter: 'vivid' },
      { photo: 1, zoom: 1.25, ox: 0.00, oy: -0.08, rot: 0, flip: false, filter: 'none' },
      { photo: 0, zoom: 1.40, ox: -0.08, oy: 0.00, rot: 0, flip: false, filter: 'dusk' },
    ],
  };
}

/** Applies a one-click look onto a state, keeping the photos and crops. */
export function applyLook(state, look) {
  const keep = { panels: state.panels, selected: state.selected, size: state.size };
  const next = { ...state, ...look };
  delete next.id;
  delete next.name;
  return { ...next, ...keep };
}
