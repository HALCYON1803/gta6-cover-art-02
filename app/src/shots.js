// Fixed scenes for screenshots: ?shot=editor shows the lab with a sample
// photo; ?shot=cover shows the exported cover alone. `look` picks a
// one-click look, `photo` picks the sample, `size` the export size.
// window.__shotReady is set once the scene has painted.
export async function runShot(shot, query, setup) {
  if (shot === 'cover') document.body.classList.add('shot-cover');
  const look = query.get('look') ?? 'vice-heist';
  const photo = query.get('photo') ?? 'boulevard';
  const size = query.get('size') ?? '1920x1080';
  await setup(look, photo, size);
  await document.fonts.ready;
  requestAnimationFrame(() => requestAnimationFrame(() => { window.__shotReady = true; }));
}
