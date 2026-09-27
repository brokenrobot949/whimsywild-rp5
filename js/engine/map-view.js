// Draws the world map on the canvas: terrain, places, the road ahead and the hero.
// Tiles are 16 × 16 pixels, scaled up by a whole number so the pixel art stays crisp,
// and only the tiles in view are drawn. The pictures come from the art sheets in data/art.js.
import { terrain } from '../../data/terrain.js';
import { heroSprite } from '../../data/art.js';
import { monsters } from '../../data/monsters.js';
import { classes } from '../../data/classes.js';
import { TILE, picture, recolorSheet } from './art.js';

const TILES_ACROSS = 12;    // roughly how many tiles fit across the map view
const BACKGROUND = '#16131f';
const LUNGE_SECONDS = 0.15; // how long a fighter leans in when striking (game time)
const LUNGE_PIXELS = 3;     // how far they lean, in art pixels

export function createMapView(canvas, world, art) {
  const ctx = canvas.getContext('2d');
  const plan = planTiles(world, art);
  const heroLook = picture(art, heroSprite.sheet, heroSprite.tile, 'The hero'); // before choosing a class
  const markers = world.places
    .filter((place) => place.sprite)
    .map((place) => ({ place, look: picture(art, place.sprite.sheet, place.sprite.tile, place.name) }));
  const monsterLooks = new Map(monsters.map((kind) => [kind, picture(art, kind.sprite.sheet, kind.sprite.tile, kind.name)]));
  const classLooks = new Map(classes.map((option) => [option.id, picture(art, option.sprite.sheet, option.sprite.tile, `The class "${option.name}"`)]));
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
    const blit = (look, x, y) => ctx.drawImage(look.image, look.sx, look.sy, TILE, TILE, x, y, size, size);
    const drawShadow = (x, y) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(x + 4 * scale, y + 14 * scale, 8 * scale, 2 * scale);
    };
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const heroAt = heroPosition(life, leftover);
    const camX = cameraOffset(heroAt.x, world.width, size, canvas.width);
    const camY = cameraOffset(heroAt.y, world.height, size, canvas.height);
    const firstCol = Math.max(0, Math.floor(camX / size));
    const lastCol = Math.min(world.width - 1, Math.floor((camX + canvas.width) / size));
    const firstRow = Math.max(0, Math.floor(camY / size));
    const lastRow = Math.min(world.height - 1, Math.floor((camY + canvas.height) / size));
    const inView = (x, y) => x >= firstCol && x <= lastCol && y >= firstRow && y <= lastRow;

    for (let y = firstRow; y <= lastRow; y++) {
      for (let x = firstCol; x <= lastCol; x++) {
        for (const look of plan[y * world.width + x].ground) blit(look, x * size - camX, y * size - camY);
      }
    }
    // Tall things like roofs reach into the square above, so they go on top of the ground,
    // including for the row just below the view.
    for (let y = firstRow; y <= Math.min(world.height - 1, lastRow + 1); y++) {
      for (let x = firstCol; x <= lastCol; x++) {
        for (const look of plan[y * world.width + x].above) blit(look, x * size - camX, (y - 1) * size - camY);
      }
    }

    // The road ahead, as a trail of small dots.
    ctx.fillStyle = 'rgba(255, 250, 235, 0.7)';
    const ahead = life.step ? [life.step.to, ...life.path] : life.path;
    for (const spot of ahead) {
      if (!inView(spot.x, spot.y)) continue;
      ctx.fillRect(spot.x * size - camX + 7 * scale, spot.y * size - camY + 7 * scale, 2 * scale, 2 * scale);
    }

    for (const { place, look } of markers) {
      if (inView(place.x, place.y)) blit(look, place.x * size - camX, place.y * size - camY);
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

  return { draw };
}

// Works out, once, which pictures draw each square of the map:
// `ground` pictures in the square itself, and `above` pictures in the square above it.
function planTiles(world, art) {
  const recolored = new Map();
  const idAt = (x, y) => (x < 0 || y < 0 || x >= world.width || y >= world.height ? null : world.tiles[y * world.width + x]);

  function look(id, tile) {
    const type = terrain[id];
    const owner = `The terrain "${id}" in data/terrain.js`;
    const found = picture(art, type.sheet, tile, owner);
    if (!type.recolor) return found;
    if (!recolored.has(id)) recolored.set(id, recolorSheet(found.image, type.recolor, owner));
    return { ...found, image: recolored.get(id) };
  }

  // Picks the edge picture that fits the neighbors, or one of the plain pictures.
  // Squares off the edge of the map count as the same terrain, so forests and rivers run off it.
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

  return world.tiles.map((id, i) => {
    const x = i % world.width;
    const y = Math.floor(i / world.width);
    const type = terrain[id];
    const pairIndex = variety(x, y) % type.tiles.length;
    return {
      ground: groundLayers(id, x, y),
      above: type.above ? [look(id, type.above[pairIndex % type.above.length])] : [],
    };
  });
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

// Keeps the hero centred, without scrolling past the edge of the map.
// If the whole map fits in view, it is centred instead.
function cameraOffset(heroTile, tilesLong, size, viewLong) {
  const mapLong = tilesLong * size;
  if (mapLong <= viewLong) return Math.round((mapLong - viewLong) / 2);
  const ideal = (heroTile + 0.5) * size - viewLong / 2;
  return Math.round(Math.min(Math.max(ideal, 0), mapLong - viewLong));
}
