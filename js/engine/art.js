// Loads the art sheets and finds pictures on them.
import { sheets } from '../../data/art.js';

export const TILE = 16; // every picture is 16 × 16 pixels

// Loads every sheet listed in data/art.js, as { sheetName: image }.
export async function loadArt() {
  const loaded = await Promise.all(
    Object.entries(sheets).map(async ([name, path]) => [name, await loadImage(path)]),
  );
  return Object.fromEntries(loaded);
}

function loadImage(path) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load the picture ${path}. Check the file is there, with exactly that name.`));
    image.src = path;
  });
}

// Finds picture number `tile` on a sheet. `owner` names what uses it, for the error message.
export function picture(art, sheetName, tile, owner) {
  const image = art[sheetName];
  if (!image) throw new Error(`${owner} uses the art sheet "${sheetName}", which is not listed in data/art.js.`);
  const columns = image.width / TILE;
  const count = columns * (image.height / TILE);
  if (!Number.isInteger(tile) || tile < 0 || tile >= count) {
    throw new Error(`${owner} uses picture ${tile}, but the "${sheetName}" sheet only has pictures 0 to ${count - 1}.`);
  }
  return { image, sx: (tile % columns) * TILE, sy: Math.floor(tile / columns) * TILE };
}

// A copy of a sheet with some colors swapped, e.g. { '#eaa56c': '#5fa5dd' }.
// Colors within a whisker of the old color count too, in case the browser shifts them slightly.
export function recolorSheet(image, swaps, owner) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  const g = canvas.getContext('2d');
  g.drawImage(image, 0, 0);
  const pixels = g.getImageData(0, 0, canvas.width, canvas.height);
  const table = Object.entries(swaps).map(([from, to]) => [toRgb(from, owner), toRgb(to, owner)]);
  const data = pixels.data;
  for (let i = 0; i < data.length; i += 4) {
    for (const [from, to] of table) {
      if (Math.abs(data[i] - from[0]) + Math.abs(data[i + 1] - from[1]) + Math.abs(data[i + 2] - from[2]) <= 12) {
        data[i] = to[0];
        data[i + 1] = to[1];
        data[i + 2] = to[2];
        break;
      }
    }
  }
  g.putImageData(pixels, 0, 0);
  return canvas;
}

function toRgb(color, owner) {
  if (!/^#[0-9a-f]{6}$/i.test(color)) throw new Error(`${owner} has the color "${color}". Colors must look like #eaa56c.`);
  const n = parseInt(color.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
}
