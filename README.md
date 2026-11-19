# Vice City Cover Lab — Make GTA 6 Cover Art

[![make.fun](https://make.fun/badge/gta6-cover-art-02.svg)](https://make.fun/bounty/gta6-cover-art-02)
[![rank](https://make.fun/badge/gta6-cover-art-02/HALCYON1803/gta6-cover-art-02/rank.svg)](https://make.fun/bounty/gta6-cover-art-02)
[![reward](https://make.fun/badge/gta6-cover-art-02/HALCYON1803/gta6-cover-art-02/reward.svg)](https://make.fun/bounty/gta6-cover-art-02)

Turn any photo and a caption into GTA 6-style cover art, offline in your browser. No upload, no account, no watermark — your photos never leave your machine.

## What it does

- **9 poster layouts** — Magazine Masthead, Diagonal Slash, Triptych, Polaroid Stack, Center Stage, Skyline Strip, Split Hero, Comic Four and Film Strip.
- **8 colour grades** — Vice Sunset, Neon Night, Palm Gold, Teal Noir, Cotton Candy, Ocean Drive, Solar Flare and Vice Noir, each with its own sky, sun, photo tint and title gradient.
- **8 one-click looks** — Vice Heist, Neon Drive, Palm Royale, Cotton Candy, Last Call, Ocean Drive, Solar Run and Midnight Run — plus a random-look dice.
- **Any photo, per panel** — up to 6 photos in the library, drag-and-drop or shipped samples. Click a panel to select it, drag to pan, scroll to zoom, or use the sliders for zoom, pan, rotation, flip and a per-panel filter (Warm, Cool, Vivid, Mono, Dusk). One photo can fill every panel, or each panel can hold a different photo.
- **Real poster lettering** — 4 title styles (Sunset Gradient, Solid White, Outline Only, Neon Glow), gradient Anton titles, neon Pacifico script subtitles, tagline, issue line, starburst badge and a 5-star heat meter. 12 quick-pick story titles.
- **Comic extras** — a speech bubble with your own words, palm trees, city skyline with lit windows, birds, ocean waves, halftone sky, sun rays, film grain and vignette, all toggleable.
- **4 frame styles** — Comic White, Ink Black, Neon Glow or Bare Edge.
- **Exact PNG export** — 1080 × 1080, 1080 × 1350 and 1920 × 1080, one at a time or all three in one click. Undo/redo throughout, keyboard shortcuts (Ctrl+Z / Ctrl+S / R).

## Try it

```sh
node serve.ts
# open http://localhost:8080
```

Pick a look, drop in a photo, export. Three steps to a cover.

## How it is built

- `app/index.html` + `app/style.css` — the editor.
- `app/src/design.js` — layouts, grades, one-click looks, story titles, filters and frame styles.
- `app/src/paint.js` — the cover painter (`paintCover`): sky, sun, skyline, panels, palms, birds, waves, halftone, title block, speech bubble, badge, grain and vignette. The same function paints the live preview and the exported PNG, so what you see is what you share.
- `app/src/lab.js` — editor wiring, undo/redo, drag-to-pan, exact-size export.
- `app/src/shots.js` — fixed screenshot scenes (`?shot=cover` / `?shot=editor`).
- `app/fonts/` — Anton and Pacifico under the SIL Open Font License, bundled locally so the app works with no network.
- `app/samples/` — model-made sample photos shipped with the competition kit, free to use.
- `main.ts` — the make.fun hand-in program; `vendor/makefun-app.ts` is the kit's library, unchanged.

## Originality

All art, lettering and code in this app are original. No Rockstar Games logos, official artwork, characters or fonts are used. The sample photos are model-made images shipped with the competition kit.

## The post on X

See [X_POST.md](X_POST.md) for the exact post text (with the real play code) and step-by-step posting instructions. The post URL goes in `POST.json` once it is live.

## License

MIT — see [LICENSE](LICENSE).
