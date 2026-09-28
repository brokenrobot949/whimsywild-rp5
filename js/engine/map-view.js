// Draws the world map on the canvas: terrain, fog, places, the road ahead and the hero.
// Tiles are 16 × 16 pixels, scaled up by a whole number so the pixel art stays crisp,
// and only the tiles in view are drawn. Zoomed far out, the map switches to an overview
// with one small square per tile. The pictures come from the art sheets in data/art.js.
//
// The camera follows the hero. Drag to look around, and scroll or pinch to zoom; the camera
// drifts back to the hero after a few seconds, or at once on a double-click.
import { terrain } from '../../data/terrain.js';
import { heroSprite } from '../../data/art.js';
import { monsters } from '../../data/monsters.js';
import { classes } from '../../data/classes.js';
import { graveSettings } from '../../data/graves.js';
import { isConquered } from './castles.js';
import { isFinaleEntrance } from './finale.js';
import { TILE, picture, recolorSheet } from './art.js';

const TILES_ACROSS = 12;     // roughly how many tiles fit across the map view at first
const ZOOM_SIZES = [1, 2, 4, 8, 16, 32, 48, 64, 80, 96, 112, 128]; // screen pixels per tile
const FOLLOW_AFTER_MS = 5000; // after looking around, the camera returns to the hero
const HINT_RANGE = 8;         // undiscovered places this close to explored land show a "?"
const BACKGROUND = '#16131f';
const FOG = '#2b2538';
const MIST = 'rgba(236, 232, 255, 0.55)';
const FOG_ROUNDING = 0.5;   // how round the fog's edges are: 0 is square, 0.5 is fully round
const LUNGE_SECONDS = 0.15;  // how long a fighter leans in when striking (game time)
const LUNGE_PIXELS = 3;      // how far they lean, in art pixels
const GLINT = '#f2d45c';     // the twinkle on a grave whose heirloom still waits
const GRAVE_LABEL = '#d9d2e6';
const BANNER = '#e04a36';   // the banner over a conquered castle
const POLE = '#3b2d25';
const HELD = '#e0523a';     // a castle still held by its boss, on the zoomed-out map
const DREAM_GLINT = '#d7b4ff'; // the sparkle over the way into the finale

// `onPointerTile(x, y)` is told which tile the pointer is over (used by debug mode).
export function createMapView(canvas, world, art, { onPointerTile } = {}) {
  const ctx = canvas.getContext('2d');
  const { plan, colors } = planTiles(world, art);
  const heroLook = picture(art, heroSprite.sheet, heroSprite.tile, 'The hero'); // before choosing a class
  const markers = world.places
    .filter((place) => place.sprite)
    .map((place) => ({ place, look: picture(art, place.sprite.sheet, place.sprite.tile, place.name) }));
  const monsterLooks = new Map(monsters.map((kind) => [kind, picture(art, kind.sprite.sheet, kind.sprite.tile, kind.name)]));
  const classLooks = new Map(classes.map((option) => [option.id, picture(art, option.sprite.sheet, option.sprite.tile, `The class "${option.name}"`)]));
  const graveLook = picture(art, graveSettings.sprite.sheet, graveSettings.sprite.tile, 'The grave in data/graves.js');
  const overview = createOverview(world, colors);
  let zoom = null;     // position in ZOOM_SIZES, set on the first fit
  let camera = null;   // where the player is looking, in tiles; null while following the hero
  let lastLook = 0;
  let showAll = false; // debug: draw the whole map, ignoring the fog
  let center = { x: 0, y: 0 };
  let hints = [];      // undiscovered places near the edge of the fog, marked with a "?"
  let hintsFor = null;
  let picking = null;  // while a new hero is being set up: { towns, chosen }, shown on the whole map

  function refreshHints() {
    const key = `${world.fogVersion ?? 0}/${world.sealVersion ?? 0}/${world.discovered.size}`;
    if (key === hintsFor) return;
    hintsFor = key;
    const nearExplored = (place) => {
      for (let y = Math.max(0, place.y - HINT_RANGE); y <= Math.min(world.height - 1, place.y + HINT_RANGE); y++) {
        for (let x = Math.max(0, place.x - HINT_RANGE); x <= Math.min(world.width - 1, place.x + HINT_RANGE); x++) {
          if (world.fog[y * world.width + x]) return true;
        }
      }
      return false;
    };
    hints = world.places.filter((place) => !world.discovered.has(place.name)
      && !world.sealed[place.y * world.width + place.x] && nearExplored(place));
  }

  function fit() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    if (zoom === null && canvas.width > 1) {
      const wanted = TILE * Math.max(1, Math.round(canvas.width / (TILE * TILES_ACROSS)));
      zoom = ZOOM_SIZES.indexOf(ZOOM_SIZES.reduce((best, size) => (Math.abs(size - wanted) < Math.abs(best - wanted) ? size : best)));
    }
  }
  new ResizeObserver(fit).observe(canvas);
  fit();

  // ---- Looking around ----

  const pointers = new Map();
  let pinchStart = 0;
  const tileSize = () => ZOOM_SIZES[zoom ?? 5];
  const look = () => {
    if (!camera) camera = { ...center };
    lastLook = performance.now();
  };
  const zoomBy = (steps) => {
    zoom = Math.max(0, Math.min(ZOOM_SIZES.length - 1, (zoom ?? 5) + steps));
    look();
  };

  canvas.addEventListener('pointerdown', (event) => {
    try {
      canvas.setPointerCapture(event.pointerId); // keep following the drag even off the map
    } catch {
      // Some browsers refuse for unusual pointers; dragging still works without it.
    }
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2) pinchStart = pinchDistance();
  });
  canvas.addEventListener('pointermove', (event) => {
    reportTile(event);
    const last = pointers.get(event.pointerId);
    if (!last) return;
    const ratio = window.devicePixelRatio || 1;
    if (pointers.size === 1) {
      look();
      camera.x -= ((event.clientX - last.x) * ratio) / tileSize();
      camera.y -= ((event.clientY - last.y) * ratio) / tileSize();
    }
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 2 && pinchStart > 0) {
      const change = pinchDistance() / pinchStart;
      if (change > 1.35 || change < 0.74) {
        zoomBy(change > 1 ? 1 : -1);
        pinchStart = pinchDistance();
      }
    }
  });
  const release = (event) => {
    pointers.delete(event.pointerId);
    pinchStart = 0;
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? 1 : -1);
  }, { passive: false });
  canvas.addEventListener('dblclick', () => { camera = null; });

  function pinchDistance() {
    const [a, b] = [...pointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function reportTile(event) {
    if (!onPointerTile) return;
    const rect = canvas.getBoundingClientRect();
    const ratio = canvas.width / rect.width;
    const size = tileSize();
    const x = Math.floor((center.x * size - canvas.width / 2 + (event.clientX - rect.left) * ratio) / size);
    const y = Math.floor((center.y * size - canvas.height / 2 + (event.clientY - rect.top) * ratio) / size);
    if (x >= 0 && y >= 0 && x < world.width && y < world.height) onPointerTile(x, y);
  }

  // ---- Drawing ----

  // `leftover` is game time not yet simulated, used to glide the hero smoothly between steps.
  function draw(life, leftover) {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (camera && performance.now() - lastLook > FOLLOW_AFTER_MS && pointers.size === 0) camera = null;

    const heroAt = heroPosition(life, leftover);
    // While a new hero is being set up, show the whole world so the towns can be seen.
    const fitWhole = ZOOM_SIZES.filter((option) => option < TILE && option <= Math.min(canvas.width / world.width, canvas.height / world.height)).at(-1) ?? 1;
    const size = picking ? fitWhole : tileSize();
    // The camera's centre, in tiles, kept within the map.
    const target = picking ? { x: world.width / 2, y: world.height / 2 } : camera ?? { x: heroAt.x + 0.5, y: heroAt.y + 0.5 };
    const halfW = canvas.width / 2 / size;
    const halfH = canvas.height / 2 / size;
    center = {
      x: world.width <= halfW * 2 ? world.width / 2 : Math.min(Math.max(target.x, halfW), world.width - halfW),
      y: world.height <= halfH * 2 ? world.height / 2 : Math.min(Math.max(target.y, halfH), world.height - halfH),
    };
    if (camera) camera = { ...center };
    const camX = Math.round(center.x * size - canvas.width / 2);
    const camY = Math.round(center.y * size - canvas.height / 2);

    if (size >= TILE) drawTiles(life, leftover, heroAt, size, camX, camY);
    else drawOverview(life, heroAt, size, camX, camY);
  }

  function drawTiles(life, leftover, heroAt, size, camX, camY) {
    const scale = size / TILE;
    const blit = (lookAt, x, y) => ctx.drawImage(lookAt.image, lookAt.sx, lookAt.sy, TILE, TILE, x, y, size, size);
    const drawShadow = (x, y) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(x + 4 * scale, y + 14 * scale, 8 * scale, 2 * scale);
    };
    const seen = (x, y) => showAll || world.fog[y * world.width + x] === 1;
    const firstCol = Math.max(0, Math.floor(camX / size));
    const lastCol = Math.min(world.width - 1, Math.floor((camX + canvas.width) / size));
    const firstRow = Math.max(0, Math.floor(camY / size));
    const lastRow = Math.min(world.height - 1, Math.floor((camY + canvas.height) / size));
    const inView = (x, y) => x >= firstCol && x <= lastCol && y >= firstRow && y <= lastRow;

    for (let y = firstRow; y <= lastRow; y++) {
      for (let x = firstCol; x <= lastCol; x++) {
        const i = y * world.width + x;
        if (!seen(x, y)) continue;
        for (const layer of plan[i].ground) blit(layer, x * size - camX, y * size - camY);
      }
    }
    // Tall things like roofs reach into the square above, so they go on top of the ground,
    // including for the row just below the view.
    for (let y = firstRow; y <= Math.min(world.height - 1, lastRow + 1); y++) {
      for (let x = firstCol; x <= lastCol; x++) {
        if (!seen(x, y)) continue;
        for (const layer of plan[y * world.width + x].above) blit(layer, x * size - camX, (y - 1) * size - camY);
      }
    }
    // Dream-mist over sealed regions.
    ctx.fillStyle = MIST;
    for (let y = firstRow; y <= lastRow; y++) {
      for (let x = firstCol; x <= lastCol; x++) {
        if (seen(x, y) && world.sealed[y * world.width + x]) ctx.fillRect(x * size - camX, y * size - camY, size, size);
      }
    }
    // Fog over everything not yet seen, with its edges rounded off: a fogged square's corner is
    // rounded where the land beside it on both sides has been seen, and the fog fills in the
    // inside corners of seen squares, so the edge of the explored world curves.
    // (Off the edge of the map counts as neither, so the edges stay square.)
    const inMap = (x, y) => x >= 0 && y >= 0 && x < world.width && y < world.height;
    const fogged = (x, y) => inMap(x, y) && !seen(x, y);
    const clear = (x, y) => inMap(x, y) && seen(x, y);
    const round = size * FOG_ROUNDING;
    ctx.fillStyle = FOG;
    for (let y = firstRow; y <= lastRow; y++) {
      for (let x = firstCol; x <= lastCol; x++) {
        const px = x * size - camX;
        const py = y * size - camY;
        if (fogged(x, y)) {
          const open = (dx, dy) => clear(x + dx, y) && clear(x, y + dy);
          const corners = [open(-1, -1), open(1, -1), open(1, 1), open(-1, 1)].map((rounded) => (rounded ? round : 0));
          if (corners.some(Boolean)) roundedSquare(px, py, size, corners);
          else ctx.fillRect(px, py, size, size);
        } else {
          // An inside corner: fog on both sides and across the corner.
          for (const [dx, dy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
            if (fogged(x + dx, y) && fogged(x, y + dy) && fogged(x + dx, y + dy)) insideCorner(px, py, size, dx, dy, round);
          }
        }
      }
    }

    // The road ahead, as a trail of small dots.
    ctx.fillStyle = 'rgba(255, 250, 235, 0.7)';
    const ahead = life.step ? [life.step.to, ...life.path] : life.path;
    for (const spot of ahead) {
      if (!inView(spot.x, spot.y) || !seen(spot.x, spot.y)) continue;
      ctx.fillRect(spot.x * size - camX + 7 * scale, spot.y * size - camY + 7 * scale, 2 * scale, 2 * scale);
    }

    for (const { place, look: lookAt } of markers) {
      if (!inView(place.x, place.y) || !seen(place.x, place.y)) continue;
      const x = place.x * size - camX;
      const y = place.y * size - camY;
      blit(lookAt, x, y);
      if (place.kind === 'castle' && isConquered(world, place.name)) {
        // A banner flies over a conquered castle: a pole, and a pennant blowing to the right.
        ctx.fillStyle = POLE;
        ctx.fillRect(x + 7 * scale, y - 7 * scale, scale, 9 * scale);
        ctx.fillStyle = BANNER;
        ctx.fillRect(x + 8 * scale, y - 7 * scale, 5 * scale, 2 * scale);
        ctx.fillRect(x + 8 * scale, y - 5 * scale, 3 * scale, scale);
      }
      if (isFinaleEntrance(world, place)) {
        // The way into the dragon's dream is open: a violet sparkle over the entrance.
        ctx.fillStyle = DREAM_GLINT;
        ctx.fillRect(x + 7 * scale, y - 4 * scale, 2 * scale, 6 * scale);
        ctx.fillRect(x + 5 * scale, y - 2 * scale, 6 * scale, 2 * scale);
      }
    }

    // Graves, with a twinkle on those whose heirloom still waits. A hero who has just fallen
    // lies where they fell; their tombstone appears once the next hero sets out.
    const graves = world.graves.filter((grave) => grave !== life.ending?.grave
      && grave.x >= firstCol - 2 && grave.x <= lastCol + 2 && grave.y >= firstRow - 1 && grave.y <= lastRow && seen(grave.x, grave.y));
    for (const grave of graves) {
      const x = grave.x * size - camX;
      const y = grave.y * size - camY;
      blit(graveLook, x, y);
      if (grave.heirloom && !grave.claimedBy) {
        ctx.fillStyle = GLINT;
        ctx.fillRect(x + 13 * scale, y, scale, 3 * scale); // a small four-pointed sparkle
        ctx.fillRect(x + 12 * scale, y + scale, 3 * scale, scale);
      }
    }

    const labelSize = Math.round(size * 0.34);
    setLabelFont(labelSize);
    for (const place of world.places) {
      if (place.x < firstCol - 2 || place.x > lastCol + 2 || place.y < firstRow - 1 || place.y > lastRow) continue;
      if (!seen(place.x, place.y)) continue;
      label(place.name, place.x * size - camX + size / 2, (place.y + 1) * size - camY + Math.round(scale / 2));
    }
    if (size >= graveSettings.labelZoom) {
      setLabelFont(Math.round(size * 0.26), GRAVE_LABEL);
      for (const grave of graves) {
        label(grave.name.split(' ')[0], grave.x * size - camX + size / 2, (grave.y + 1) * size - camY + Math.round(scale / 2));
      }
    }
    if (!showAll) {
      refreshHints();
      setLabelFont(Math.round(size * 0.7), '#f2d45c');
      for (const place of hints) {
        if (inView(place.x, place.y)) label('?', place.x * size - camX + size / 2, place.y * size - camY + Math.round(size * 0.1));
      }
    }

    // In a fight, the monster stands on the next tile and each fighter leans in as they strike.
    const { fight } = life;
    let heroLunge = { x: 0, y: 0 };
    if (fight) {
      const toward = { x: Math.sign(fight.x - life.hero.x), y: Math.sign(fight.y - life.hero.y) };
      const blow = fight.lastBlow;
      const lunging = blow && fight.elapsed + leftover - blow.at < LUNGE_SECONDS;
      const lean = LUNGE_PIXELS * scale;
      if (lunging && blow.by === 'hero') heroLunge = { x: toward.x * lean, y: toward.y * lean };
      const monsterLunge = lunging && blow.by === 'monster' ? { x: -toward.x * lean, y: -toward.y * lean } : { x: 0, y: 0 };
      const monsterX = fight.x * size - camX + monsterLunge.x;
      const monsterY = fight.y * size - camY + monsterLunge.y;
      drawShadow(monsterX, monsterY);
      blit(monsterLooks.get(fight.monster.kind), monsterX, monsterY);
    }

    const hero = life.hero.class ? classLooks.get(life.hero.class) : heroLook;
    const heroX = Math.round(heroAt.x * size - camX) + heroLunge.x;
    const heroY = Math.round(heroAt.y * size - camY) + heroLunge.y;
    if (life.ending?.kind === 'died') {
      // Fallen: the hero lies on their side.
      ctx.save();
      ctx.translate(heroX + size / 2, heroY + size / 2);
      ctx.rotate(-Math.PI / 2);
      blit(hero, -size / 2, -size / 2);
      ctx.restore();
      return;
    }
    const bob = heroAt.moving && heroAt.progress < 0.5 ? scale : 0;
    drawShadow(heroX, heroY);
    blit(hero, heroX, heroY - bob);
  }

  // A filled square with some corners rounded: `corners` are the radii of the top-left,
  // top-right, bottom-right and bottom-left corners (0 for a square corner).
  function roundedSquare(x, y, size, [tl, tr, br, bl]) {
    ctx.beginPath();
    ctx.moveTo(x + tl, y);
    ctx.lineTo(x + size - tr, y);
    if (tr) ctx.arc(x + size - tr, y + tr, tr, -Math.PI / 2, 0);
    ctx.lineTo(x + size, y + size - br);
    if (br) ctx.arc(x + size - br, y + size - br, br, 0, Math.PI / 2);
    ctx.lineTo(x + bl, y + size);
    if (bl) ctx.arc(x + bl, y + size - bl, bl, Math.PI / 2, Math.PI);
    ctx.lineTo(x, y + tl);
    if (tl) ctx.arc(x + tl, y + tl, tl, Math.PI, Math.PI * 1.5);
    ctx.closePath();
    ctx.fill();
  }

  // Fills the inside corner of a square (the corner towards dx, dy) up to a curve of radius r.
  function insideCorner(x, y, size, dx, dy, r) {
    const cx = dx < 0 ? x : x + size; // the corner itself
    const cy = dy < 0 ? y : y + size;
    const ax = cx - dx * r;           // the centre of the curve, inside the square
    const ay = cy - dy * r;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(ax, cy);
    // The quarter circle from (ax, cy) round to (cx, ay), bulging towards the corner.
    const from = Math.atan2(cy - ay, 0);
    const to = Math.atan2(0, cx - ax);
    ctx.arc(ax, ay, r, from, to, (dx < 0) === (dy < 0));
    ctx.closePath();
    ctx.fill();
  }

  // Zoomed far out: one small square per tile, with towns and the hero marked.
  function drawOverview(life, heroAt, size, camX, camY) {
    overview.refresh(showAll);
    ctx.drawImage(overview.canvas, -camX, -camY, world.width * size, world.height * size);
    const dot = Math.max(3, size * 2);
    ctx.fillStyle = GRAVE_LABEL;
    for (const grave of world.graves) {
      if (grave === life.ending?.grave || (!showAll && !world.fog[grave.y * world.width + grave.x])) continue;
      ctx.fillRect(grave.x * size - camX - dot / 3, grave.y * size - camY - dot / 3, (dot * 2) / 3, (dot * 2) / 3);
    }
    const fontPx = 12 * (window.devicePixelRatio || 1);
    setLabelFont(fontPx);
    // Town names go under their dot, or above it if that would overlap a name already written.
    const placed = [];
    const townLabel = (text, x, y, gap = dot) => {
      const half = ctx.measureText(text).width / 2;
      const spots = [y + gap, y - gap - fontPx];
      const free = spots.find((top) => !placed.some((box) => x - half < box.right && x + half > box.left
        && top < box.bottom && top + fontPx > box.top)) ?? spots[0];
      placed.push({ left: x - half, right: x + half, top: free, bottom: free + fontPx });
      label(text, x, free);
    };
    for (const place of world.places) {
      if (!showAll && !world.fog[place.y * world.width + place.x]) continue;
      const x = place.x * size - camX;
      const y = place.y * size - camY;
      const held = place.kind === 'castle' && !isConquered(world, place.name);
      ctx.fillStyle = place.kind === 'town' ? '#fff6dc' : held ? HELD : '#f2d45c';
      ctx.fillRect(x - dot / 2, y - dot / 2, dot, dot);
      if (place.kind !== 'town') continue;
      // Setting up a new hero: each starting town shows its level, and the chosen one is ringed.
      if (picking?.towns.includes(place)) {
        if (place === picking.chosen) {
          const ring = dot * 3;
          ctx.strokeStyle = '#f2d45c';
          ctx.lineWidth = Math.max(2, dot / 2);
          ctx.strokeRect(x - ring / 2, y - ring / 2, ring, ring);
        }
        setLabelFont(fontPx, place === picking.chosen ? '#f2d45c' : '#fff6dc');
        townLabel(`${place.name} · Lv ${place.recruitLevel ?? 1}`, x, y, dot * 2); // clear of the ring
        setLabelFont(fontPx);
      } else {
        townLabel(place.name, x, y);
      }
    }
    if (picking) return; // no hero on the map until they begin
    if (!showAll) {
      refreshHints();
      setLabelFont(14 * (window.devicePixelRatio || 1), '#f2d45c');
      for (const place of hints) label('?', place.x * size - camX, place.y * size - camY - 7 * (window.devicePixelRatio || 1));
    }
    ctx.fillStyle = '#ff5a3c';
    const heroDot = dot + 2;
    ctx.fillRect(heroAt.x * size - camX - heroDot / 2, heroAt.y * size - camY - heroDot / 2, heroDot, heroDot);
  }

  function setLabelFont(sizePx, color = '#fff6dc') {
    ctx.font = `bold ${sizePx}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(2, Math.round(sizePx / 5));
    ctx.strokeStyle = 'rgba(30, 24, 40, 0.9)';
    ctx.fillStyle = color;
  }

  function label(text, x, y) {
    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);
  }

  return {
    draw,
    // Debug: show the whole map, ignoring the fog.
    setShowAll(on) {
      showAll = on;
    },
    // While a new hero is being set up: the towns they can start in, and the one chosen.
    // Null goes back to following the hero.
    showStartingTowns(choice) {
      picking = choice;
      camera = null;
    },
  };
}

// The overview: a small picture of the whole map, one pixel per tile, redrawn when the fog lifts.
function createOverview(world, colors) {
  const canvas = document.createElement('canvas');
  canvas.width = world.width;
  canvas.height = world.height;
  const g = canvas.getContext('2d');
  const fog = hexToRgb(FOG);
  const mist = [236, 232, 255];
  let drawnFor = null;
  return {
    canvas,
    refresh(showAll) {
      const key = `${world.fogVersion ?? 0}/${world.sealVersion ?? 0}/${showAll}`; // redrawn when fog lifts or mist clears
      if (key === drawnFor) return;
      drawnFor = key;
      const image = g.createImageData(world.width, world.height);
      for (let i = 0; i < world.tiles.length; i++) {
        let rgb = showAll || world.fog[i] ? colors.get(world.tiles[i]) : fog;
        if (rgb !== fog && world.sealed[i]) rgb = rgb.map((c, n) => Math.round(c * 0.45 + mist[n] * 0.55));
        image.data.set([...rgb, 255], i * 4);
      }
      g.putImageData(image, 0, 0);
    },
  };
}

// Works out, once, which pictures draw each square of the map: `ground` pictures in the square
// itself, and `above` pictures in the square above it. Also finds each terrain's average color,
// for the zoomed-out overview.
function planTiles(world, art) {
  const recolored = new Map();
  const looks = new Map();
  const idAt = (x, y) => (x < 0 || y < 0 || x >= world.width || y >= world.height ? null : world.tiles[y * world.width + x]);

  function look(id, tile) {
    const key = `${id}/${tile}`;
    if (looks.has(key)) return looks.get(key);
    const type = terrain[id];
    const owner = `The terrain "${id}" in data/terrain.js`;
    let found = picture(art, type.sheet, tile, owner);
    if (type.recolor) {
      if (!recolored.has(id)) recolored.set(id, recolorSheet(found.image, type.recolor, owner));
      found = { ...found, image: recolored.get(id) };
    }
    looks.set(key, found);
    return found;
  }

  // Picks the edge picture that fits the neighbors, or one of the plain pictures.
  // Squares off the edge of the map count as the same terrain, so forests and seas run off it.
  function chooseTile(id, x, y) {
    const type = terrain[id];
    if (type.edges) {
      const same = (dx, dy) => {
        const other = idAt(x + dx, y + dy);
        return other === null || other === id || (type.joins ?? []).includes(other);
      };
      const west = same(-1, 0);
      const east = same(1, 0);
      const north = same(0, -1);
      const south = same(0, 1);
      if ((west || east) && (north || south)) {
        const column = !west ? 0 : !east ? 2 : 1;
        const row = !north ? 0 : !south ? 2 : 1;
        return type.edges[row * 3 + column];
      }
    }
    return type.tiles[variety(x, y) % type.tiles.length];
  }

  function groundLayers(id, x, y) {
    const type = terrain[id];
    const layers = type.under ? groundLayers(type.under, x, y) : [];
    layers.push(look(id, chooseTile(id, x, y)));
    return layers;
  }

  const plan = world.tiles.map((id, i) => {
    const x = i % world.width;
    const y = Math.floor(i / world.width);
    const type = terrain[id];
    const ground = groundLayers(id, x, y);
    // Decorations, like crops in a field, on some squares.
    const roll = variety(y + 7919, x + 104729);
    if (type.decor && (roll % 1000) / 1000 < (type.decorChance ?? 0.5)) ground.push(look(id, type.decor[(roll >>> 10) % type.decor.length]));
    const pairIndex = variety(x, y) % type.tiles.length;
    return { ground, above: type.above ? [look(id, type.above[pairIndex % type.above.length])] : [] };
  });

  // Each terrain's average color: its plain picture (over what's under it), averaged.
  const colors = new Map();
  const swatch = document.createElement('canvas');
  swatch.width = TILE;
  swatch.height = TILE;
  const g = swatch.getContext('2d', { willReadFrequently: true });
  for (const id of Object.keys(terrain)) {
    g.clearRect(0, 0, TILE, TILE);
    const chain = [];
    for (let at = id; at; at = terrain[at].under) chain.unshift(at);
    for (const layer of chain) {
      const type = terrain[layer];
      const pictureAt = look(layer, type.edges ? type.edges[4] : type.tiles[0]);
      g.drawImage(pictureAt.image, pictureAt.sx, pictureAt.sy, TILE, TILE, 0, 0, TILE, TILE);
    }
    const data = g.getImageData(0, 0, TILE, TILE).data;
    const sum = [0, 0, 0];
    let count = 0;
    for (let p = 0; p < data.length; p += 4) {
      if (data[p + 3] < 128) continue;
      sum[0] += data[p];
      sum[1] += data[p + 1];
      sum[2] += data[p + 2];
      count++;
    }
    colors.set(id, sum.map((total) => Math.round(total / Math.max(1, count))));
  }
  return { plan, colors };
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}

// A steady jumble of numbers from a map position, so each square always picks the same picture.
function variety(x, y) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

// Where the hero is, in tiles (fractions while walking between two tiles).
function heroPosition(life, leftover) {
  const { hero, step } = life;
  if (!step) return { x: hero.x, y: hero.y, moving: false, progress: 0 };
  const progress = Math.min(1, step.progress + leftover / step.seconds);
  return {
    x: step.from.x + (step.to.x - step.from.x) * progress,
    y: step.from.y + (step.to.y - step.from.y) * progress,
    moving: true,
    progress,
  };
}
