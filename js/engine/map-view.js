// Draws the world map on the canvas: terrain, places, the road ahead and the hero.
// Tiles are 16 × 16 pixels, scaled up by a whole number so the pixel art stays crisp,
// and only the tiles in view are drawn. Until the Kenney art is added, the tiles and
// the hero are simple placeholder drawings made here in code.
import { terrain } from '../../data/terrain.js';
import { createRng } from './rng.js';

const TILE = 16;
const TILES_ACROSS = 12; // roughly how many tiles fit across the map view
const VARIANTS = 3;      // placeholder look-alikes per terrain, so fields don't look stamped
const BACKGROUND = '#16131f';

export function createMapView(canvas, world) {
  const ctx = canvas.getContext('2d');
  const tiles = makePlaceholderTiles();
  const heroSprite = makeSprite(HERO_PIXELS, HERO_COLORS);
  const flagSprite = makeSprite(FLAG_PIXELS, FLAG_COLORS);
  let scale = 1;

  function fit() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio));
    scale = Math.max(1, Math.round(canvas.width / (TILE * TILES_ACROSS)));
  }
  new ResizeObserver(fit).observe(canvas);
  fit();

  // `leftover` is game time not yet simulated, used to glide the hero smoothly between steps.
  function draw(life, leftover) {
    const size = TILE * scale;
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const hero = heroPosition(life, leftover);
    const camX = cameraOffset(hero.x, world.width, size, canvas.width);
    const camY = cameraOffset(hero.y, world.height, size, canvas.height);
    const firstCol = Math.max(0, Math.floor(camX / size));
    const lastCol = Math.min(world.width - 1, Math.floor((camX + canvas.width) / size));
    const firstRow = Math.max(0, Math.floor(camY / size));
    const lastRow = Math.min(world.height - 1, Math.floor((camY + canvas.height) / size));
    const inView = (x, y) => x >= firstCol && x <= lastCol && y >= firstRow && y <= lastRow;

    for (let y = firstRow; y <= lastRow; y++) {
      for (let x = firstCol; x <= lastCol; x++) {
        const looks = tiles[world.tiles[y * world.width + x]];
        ctx.drawImage(looks[(x * 7 + y * 13) % VARIANTS], x * size - camX, y * size - camY, size, size);
      }
    }

    // The road ahead, as a trail of small dots.
    ctx.fillStyle = 'rgba(255, 250, 235, 0.7)';
    const ahead = life.step ? [life.step.to, ...life.path] : life.path;
    for (const spot of ahead) {
      if (!inView(spot.x, spot.y)) continue;
      ctx.fillRect(spot.x * size - camX + 7 * scale, spot.y * size - camY + 7 * scale, 2 * scale, 2 * scale);
    }

    for (const place of world.places) {
      if (place.kind === 'landmark' && inView(place.x, place.y)) {
        ctx.drawImage(flagSprite, place.x * size - camX, place.y * size - camY, size, size);
      }
    }

    const labelSize = Math.round(size * 0.34);
    ctx.font = `bold ${labelSize}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(2, Math.round(labelSize / 5));
    ctx.strokeStyle = 'rgba(30, 24, 40, 0.9)';
    ctx.fillStyle = '#fff6dc';
    for (const place of world.places) {
      if (place.x < firstCol - 2 || place.x > lastCol + 2 || place.y < firstRow - 1 || place.y > lastRow) continue;
      const labelX = place.x * size - camX + size / 2;
      const labelY = (place.y + 1) * size - camY + Math.round(scale / 2);
      ctx.strokeText(place.name, labelX, labelY);
      ctx.fillText(place.name, labelX, labelY);
    }

    const heroX = Math.round(hero.x * size - camX);
    const heroY = Math.round(hero.y * size - camY);
    const bob = hero.moving && hero.progress < 0.5 ? scale : 0;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(heroX + 4 * scale, heroY + 14 * scale, 8 * scale, 2 * scale);
    ctx.drawImage(heroSprite, heroX, heroY - bob, size, size);
  }

  return { draw };
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

// Keeps the hero centred, without scrolling past the edge of the map.
// If the whole map fits in view, it is centred instead.
function cameraOffset(heroTile, tilesLong, size, viewLong) {
  const mapLong = tilesLong * size;
  if (mapLong <= viewLong) return Math.round((mapLong - viewLong) / 2);
  const ideal = (heroTile + 0.5) * size - viewLong / 2;
  return Math.round(Math.min(Math.max(ideal, 0), mapLong - viewLong));
}

// ---- Placeholder art ----

function makePlaceholderTiles() {
  const rng = createRng(20260927); // fixed seed, so the map looks the same every time
  const result = {};
  for (const [id, type] of Object.entries(terrain)) {
    result[id] = Array.from({ length: VARIANTS }, () => paintTile(type, rng));
  }
  return result;
}

function paintTile(type, rng) {
  const canvas = document.createElement('canvas');
  canvas.width = TILE;
  canvas.height = TILE;
  const g = canvas.getContext('2d');
  const px = (x, y, w, h, color) => {
    g.fillStyle = color;
    g.fillRect(x, y, w, h);
  };
  // Draws a shape given as rows of [y, fromX, toX], optionally with a 1-pixel outline.
  const shape = (rows, dx, color, outline) => {
    if (outline) {
      for (const [ox, oy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        for (const [y, from, to] of rows) px(from + dx + ox, y + oy, to - from + 1, 1, outline);
      }
    }
    for (const [y, from, to] of rows) px(from + dx, y, to - from + 1, 1, color);
  };

  px(0, 0, TILE, TILE, type.color);
  const detail = type.detail;

  switch (type.pattern) {
    case 'speckle':
      for (let i = 0; i < 7; i++) px(rng.int(0, 15), rng.int(0, 14), 1, 2, detail);
      break;

    case 'flowers':
      for (let i = 0; i < 5; i++) px(rng.int(0, 15), rng.int(0, 14), 1, 2, shade(type.color, -0.2));
      for (let i = 0; i < 3; i++) {
        const x = rng.int(1, 14);
        const y = rng.int(1, 14);
        const petal = rng.chance(0.5) ? '#fdf6e3' : '#f4a6c0';
        px(x - 1, y, 3, 1, petal);
        px(x, y - 1, 1, 3, petal);
        px(x, y, 1, 1, detail);
      }
      break;

    case 'tree': {
      const dx = rng.int(-1, 1);
      px(4 + dx, 13, 8, 2, shade(type.color, -0.3));
      px(7 + dx, 9, 2, 5, '#6b4a2f');
      const canopy = [[1, 6, 9], [2, 4, 11], [3, 3, 12], [4, 3, 12], [5, 3, 12], [6, 3, 12], [7, 4, 11], [8, 5, 10]];
      shape(canopy, dx, detail, shade(detail, -0.45));
      px(5 + dx, 3, 2, 2, shade(detail, 0.3));
      px(4 + dx, 5, 1, 1, shade(detail, 0.3));
      break;
    }

    case 'hills': {
      const dx = rng.int(-2, 2);
      const mound = [[6, 6, 9], [7, 5, 10], [8, 4, 11], [9, 3, 12], [10, 2, 13], [11, 2, 13]];
      shape(mound, dx, detail, shade(detail, -0.35));
      px(6 + dx, 6, 3, 1, shade(detail, 0.35));
      px(5 + dx, 7, 1, 1, shade(detail, 0.35));
      break;
    }

    case 'waves':
      for (let i = 0; i < 3; i++) {
        const x = rng.int(0, 11);
        const y = rng.int(2, 14);
        px(x, y, 2, 1, detail);
        px(x + 2, y - 1, 2, 1, detail);
      }
      break;

    case 'planks':
      for (let x = 1; x < TILE; x += 4) px(x, 0, 1, TILE, detail);
      px(0, 0, TILE, 2, shade(type.color, -0.35));
      px(0, 14, TILE, 2, shade(type.color, -0.35));
      break;

    case 'house': {
      for (let i = 0; i < 4; i++) px(rng.int(0, 15), rng.int(12, 14), 1, 2, shade(type.color, -0.2));
      px(2, 6, 12, 9, '#3b2f2f');
      px(3, 7, 10, 7, '#ecdcb4');
      const roof = [[2, 6, 9], [3, 5, 10], [4, 4, 11], [5, 3, 12], [6, 2, 13]];
      shape(roof, 0, detail, '#3b2f2f');
      px(7, 10, 2, 4, '#6b4a2f');
      px(4, 9, 2, 2, '#8fc3ea');
      px(10, 9, 2, 2, '#8fc3ea');
      break;
    }

    default:
      break;
  }
  return canvas;
}

// Lightens (amount above 0) or darkens (amount below 0) a #rrggbb color.
function shade(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const channel = (c) => Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount);
  return `rgb(${channel(n >> 16)}, ${channel((n >> 8) & 255)}, ${channel(n & 255)})`;
}

function makeSprite(rows, colors) {
  const canvas = document.createElement('canvas');
  canvas.width = TILE;
  canvas.height = TILE;
  const g = canvas.getContext('2d');
  rows.forEach((row, y) => {
    [...row].forEach((key, x) => {
      if (!colors[key]) return;
      g.fillStyle = colors[key];
      g.fillRect(x, y, 1, 1);
    });
  });
  return canvas;
}

// A little hooded adventurer. Each letter is one pixel; dots are see-through.
const HERO_PIXELS = [
  '................',
  '......oooo......',
  '.....orrrro.....',
  '....orrrrrro....',
  '....oossssoo....',
  '.....okssko.....',
  '.....osssso.....',
  '....obbbbbbo....',
  '...obbbbbbbbo...',
  '...osbbbbbbso...',
  '....obyyyybo....',
  '....obbbbbbo....',
  '.....ollllo.....',
  '.....ol..lo.....',
  '....ooo..ooo....',
];
const HERO_COLORS = {
  o: '#2b2135', // outline
  r: '#c8483a', // hood
  s: '#f2c9a0', // skin
  k: '#2b2135', // eyes
  b: '#3f6fb5', // tunic
  y: '#8a5a2b', // belt
  l: '#6b4a2f', // legs
};

// A pennant on a pole, marking a landmark.
const FLAG_PIXELS = [
  '................',
  '..........o.....',
  '......rrrro.....',
  '.......rrro.....',
  '........rro.....',
  '.........ro.....',
  '..........o.....',
  '..........o.....',
  '..........o.....',
  '.........ooo....',
];
const FLAG_COLORS = { o: '#3b2f2f', r: '#e04a3a' };
