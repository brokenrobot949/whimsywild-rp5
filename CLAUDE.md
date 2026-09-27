# Whimsywild RP5 — Project Context for Claude Code

Whimsywild RP5 is a whimsical high-fantasy browser RPG. Each hero lives a roughly five-minute adventure, and a persistent world map reveals itself over many lives. The world is Whimsywild, and the sleeping dragon beneath it is Sominus. The full design is in `docs/DESIGN.md`. Read it before starting any feature, and follow it.

## Working with Rob

- Rob is the game designer and has no coding experience. You are the programmer.
- After each change, explain in plain language what changed, how to see it working, and anything Rob needs to do.
- If the design is unclear, or a technical limit would change the design, ask Rob instead of guessing.
- When Rob changes a design decision, update `docs/DESIGN.md` so it stays the source of truth.
- Build in the phases from `docs/DESIGN.md`, in small, testable slices. **Current phase: Phase 1 (Core life).**
- Rob commits and pushes with GitHub Desktop. Do not run `git push` unless Rob asks.

## Hard constraints

- Static site hosted on GitHub Pages: plain HTML, CSS and JavaScript only.
- No build step, no npm packages, no frameworks, no CDN links and no external network requests. Every file lives in this repo.
- Use JavaScript ES modules (`import` / `export`).
- Use relative paths only (`./js/main.js`, `../data/skills.js`). Never start a path with `/`. The live site is served from the `/whimsywild-rp5/` subfolder, so root-absolute paths break online.
- Use lowercase file and folder names with hyphens. GitHub Pages is case-sensitive even when Rob's computer is not.
- Mobile-first portrait layout that also works on desktop.

## Saves

- Save to localStorage only.
- Prefix every key with `whimsywild-rp5:`. Rob's other games share the same github.io address, so unprefixed keys can collide.
- Every save includes a version number, with a migration path for older saves.
- Include export and import of the full save as a copyable text code.

## Architecture

```
whimsywild-rp5/
  index.html
  CLAUDE.md
  docs/DESIGN.md
  css/style.css
  js/main.js         startup and game loop
  js/engine/         hero, combat, map, story, save, ui
  data/              classes, skills, origins, quirks, monsters,
                     items, events, rumors, regions, dreams, story
  assets/tiles/      map tiles
  assets/sprites/    hero and monster sprites
```

- `js/engine/` holds logic. `data/` holds all content: names, numbers and flavor text. Never hardcode content in engine files.
- Data files are ES modules that export plain arrays and objects, with short comments so Rob can safely edit numbers and text.
- A fixed-rate game loop drives the simulation. It pauses while a choice card is open and when the page is hidden (`visibilitychange`).
- Each hero has a seeded random number generator, and the seed is stored with the hero so a run can be replayed.
- The world map is drawn on a canvas with 16 × 16 tiles, scaled up with `image-rendering: pixelated`. Draw only the visible viewport.
- The engine emits named game events (level-up, hit, discovery, death and so on). The UI listens to them now, and audio will hook into them in Phase 3.
- Class data must support a third (legendary) tier, even though v1 ships only two tiers.
- Auto-decide chooses by the hero's tags, so every story-event option in `data/` carries a tag.

## Art and audio

- Art: Kenney CC0 pixel-art packs from one family (such as the Tiny series). Rob downloads the packs and adds the files to `assets/`. For monsters without a matching sprite, reuse existing sprites with recolors or tints.
- Audio (Phase 3): MP3 files only. Start audio only after the player's first tap. Include mute plus separate music and effects volume, saved under the `whimsywild-rp5:` key prefix.

## Tone and writing

- Grounded, traditional fantasy with whimsy in names, flavor text, monsters and events.
- Adventure log lines are short (about 90 characters or fewer) and stamped with season and age, like "Autumn, age 34: slew the Moss Wyrm."

## Testing

- Opening `index.html` directly will not work because of ES modules. Start a simple local static server from the repo root and give Rob the address to open.
- Remind Rob to hard refresh after changes, since browsers cache JavaScript files.
- Add a debug mode, turned on by adding `?debug` to the URL, with:
  - a game-speed multiplier (1×, 5×, 20×) so full lives can be tested quickly
  - the current hero's seed
  - a "Reset save" button
  - a playtest log that records each life's length, final level and ending, with averages across lives
