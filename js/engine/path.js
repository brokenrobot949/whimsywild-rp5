// Finding the quickest way across a grid (A* search). Used for walking and for laying roads.

const DIRECTIONS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

// `costOf(index)` is the cost of stepping onto a square (Infinity if it can't be entered);
// `cheapest` is the lowest cost any square can have, which keeps the search quick and correct.
// Returns the squares to step on in order, not counting the start, as { x, y }, or null if
// there's no way through.
export function findRoute(width, height, costOf, cheapest, from, to) {
  const start = from.y * width + from.x;
  const goal = to.y * width + to.x;
  const cost = new Float64Array(width * height).fill(Infinity);
  const cameFrom = new Int32Array(width * height).fill(-1);
  const done = new Uint8Array(width * height);
  const open = new MinHeap();
  cost[start] = 0;
  open.push(start, 0);

  while (open.size > 0) {
    const current = open.pop();
    if (current === goal) break;
    if (done[current]) continue;
    done[current] = 1;
    const cx = current % width;
    const cy = (current - cx) / width;
    for (const [dx, dy] of DIRECTIONS) {
      const nx = cx + dx;
      const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const next = ny * width + nx;
      const step = costOf(next);
      if (step === Infinity) continue;
      const nextCost = cost[current] + step;
      if (nextCost < cost[next]) {
        cost[next] = nextCost;
        cameFrom[next] = current;
        open.push(next, nextCost + (Math.abs(nx - to.x) + Math.abs(ny - to.y)) * cheapest);
      }
    }
  }

  if (cost[goal] === Infinity) return null;
  const route = [];
  for (let i = goal; i !== start; i = cameFrom[i]) route.push({ x: i % width, y: Math.floor(i / width) });
  return route.reverse();
}

// A queue that always hands back the item with the lowest priority first.
class MinHeap {
  constructor() {
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  push(value, priority) {
    const items = this.items;
    items.push({ value, priority });
    let i = items.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (items[parent].priority <= items[i].priority) break;
      [items[parent], items[i]] = [items[i], items[parent]];
      i = parent;
    }
  }

  pop() {
    const items = this.items;
    const top = items[0];
    const last = items.pop();
    if (items.length > 0) {
      items[0] = last;
      let i = 0;
      for (;;) {
        const left = 2 * i + 1;
        const right = left + 1;
        let smallest = i;
        if (left < items.length && items[left].priority < items[smallest].priority) smallest = left;
        if (right < items.length && items[right].priority < items[smallest].priority) smallest = right;
        if (smallest === i) break;
        [items[smallest], items[i]] = [items[i], items[smallest]];
        i = smallest;
      }
    }
    return top.value;
  }
}
