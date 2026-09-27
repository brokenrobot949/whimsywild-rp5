// Seeded random numbers. The same seed always gives the same sequence,
// so a hero's whole life can be replayed from their seed.

export function randomSeed() {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0];
}

// mulberry32: small, fast and plenty random for a game.
export function createRng(seed) {
  let state = seed >>> 0;

  function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    pick: (list) => list[Math.floor(next() * list.length)],
    chance: (probability) => next() < probability,
    get state() { return state; },
  };
}

// Deals items in shuffled order with no repeats until every item has been used,
// then reshuffles. Keeps log lines from repeating too soon.
export function createDeck(rng, items) {
  let pile = [];
  let last;
  return function draw() {
    if (pile.length === 0) {
      pile = shuffle(rng, [...items]);
      // Don't deal the same item twice in a row across a reshuffle.
      const top = pile.length - 1;
      if (top > 0 && pile[top] === last) [pile[0], pile[top]] = [pile[top], pile[0]];
    }
    last = pile.pop();
    return last;
  };
}

function shuffle(rng, list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rng.next() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}
