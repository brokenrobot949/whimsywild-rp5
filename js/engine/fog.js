// Fog of war. The whole world starts hidden; the fog lifts around every hero and never
// returns, so the dragon's shape appears over many lives.

// Lifts the fog in a circle around a tile. Returns the places seen for the first time.
export function revealAround(world, x, y, radius) {
  const { width, height, fog } = world;
  for (let ty = Math.max(0, y - radius); ty <= Math.min(height - 1, y + radius); ty++) {
    for (let tx = Math.max(0, x - radius); tx <= Math.min(width - 1, x + radius); tx++) {
      const i = ty * width + tx;
      if (fog[i] || (tx - x) ** 2 + (ty - y) ** 2 > radius * radius + radius) continue;
      fog[i] = 1;
      world.fogVersion = (world.fogVersion ?? 0) + 1; // lets the map know to redraw its overview
    }
  }
  const found = [];
  for (const place of world.places) {
    if (world.discovered.has(place.name) || !fog[place.y * width + place.x]) continue;
    world.discovered.add(place.name);
    found.push(place);
  }
  return found;
}

export function isRevealed(world, x, y) {
  return world.fog[y * world.width + x] === 1;
}

// The share of the land (not the sea) that has been revealed, from 0 to 1.
export function revealedShare(world) {
  let seen = 0;
  for (let i = 0; i < world.fog.length; i++) if (world.fog[i] && world.regionOf[i]) seen++;
  return seen / world.landTiles;
}

// ---- Saving ----
// The fog is saved as one bit per tile, written as text.

export function packFog(fog) {
  const bytes = new Uint8Array(Math.ceil(fog.length / 8));
  for (let i = 0; i < fog.length; i++) if (fog[i]) bytes[i >> 3] |= 1 << (i & 7);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

// Reads saved fog into the world. A save from a different-sized map is ignored.
export function unpackFog(world, text) {
  if (!text) return;
  let binary;
  try {
    binary = atob(text);
  } catch {
    return;
  }
  if (binary.length !== Math.ceil(world.fog.length / 8)) return;
  for (let i = 0; i < world.fog.length; i++) world.fog[i] = (binary.charCodeAt(i >> 3) >> (i & 7)) & 1;
  world.fogVersion = (world.fogVersion ?? 0) + 1;
}
