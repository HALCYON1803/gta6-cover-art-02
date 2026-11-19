# Post on X — Vice City Cover Lab (gta6-cover-art-02)

STATUS: NOT POSTED YET — waiting for the user to post (no X route is
connected, no X account password is ever asked for). The play code below is
still a placeholder: the competition is not live on make.fun yet
(`GET /api/competitions/gta6-cover-art-02` still answers "no competition"),
so no play code can be fetched until it goes live. DO NOT post without the
real play code — fill it in first, then copy-paste the text exactly.

## Exact post text (copy-paste, English)

Just built Vice City Cover Lab — a free offline GTA 6-style cover art maker: 9 layouts, 8 sunset & neon grades, per-panel crop, exact PNG export. A make.fun bounty paying $250 in real rewards! @makefunai https://make.fun/bounty/gta6-cover-art-02 PLAYCODE

Replace PLAYCODE with the real code, e.g. `makefun-oak-river-lantern`
(format: `makefun-` + three words). Get it with:
`node cli/makefun.mjs check --play-code 0` from inside the kit, or
`GET /api/competitions/gta6-cover-art-02/play-code` signed in as @halcyon1803.

## Picture to attach (first picture)

`x-post-cover.png` in this repo (1920 × 1080 PNG, the Ocean Drive cover the
app exported) — or `screenshots/1-cover.jpg` (1280 × 720). The picture must
be a screenshot of the app or a cover it exported, as PNG/JPEG/WebP.

## How to post, step by step

1. Open X in a browser, signed in to a PUBLIC account (Settings → Privacy
   and safety → Audience → "Protect your posts" OFF).
2. Click Post, attach `x-post-cover.png` (first picture).
3. Paste the text above with the REAL play code filled in. Check before
   posting: the text carries `@makefunai` AND the make.fun bounty link AND
   the play code, and says what was built + that it is a make.fun bounty
   paying real money. A post's text cannot be edited after posting.
4. Post it BEFORE the deadline: 21/11/2026 21:00 +07 (14:00 UTC). Keep the
   post up and the account public until the results are out.
5. Click the post's Share → Copy link. The URL looks like
   `https://x.com/<handle>/status/<digits>`.
6. Tell the agent the URL. The agent writes it into `POST.json` as
   `{"url": "https://x.com/<handle>/status/<id>"}` and resubmits the entry
   (new commit) before the deadline.

## Why the entry is submitted with a placeholder for now

`POST.json` currently holds the kit's placeholder URL. The site's entry-link
check refuses a placeholder post, so this first submission is expected to
be held at the post check until the real post URL is in. The app itself is
complete and graded on its own; the post never scores. Once the user posts,
we update POST.json and resubmit before 21/11 21:00 +07.
