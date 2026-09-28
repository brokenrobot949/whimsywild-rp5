// Tonight's dream: checking the data and rolling a new dream for each hero.
// A dream's effects are added to the hero's in skills.js; its monsters and rates are used in life.js.
import { dreams } from '../../data/dreams.js';
import { monsters } from '../../data/monsters.js';
import { checkEffects } from './skills.js';

// Check the data once at startup, so a typo shows a clear message.
const ids = new Set();
for (const dream of dreams) {
  const owner = `The dream "${dream.name ?? dream.id}" in data/dreams.js`;
  if (!dream.id || ids.has(dream.id)) throw new Error(`${owner} needs an id that no other dream uses.`);
  ids.add(dream.id);
  if (!dream.name || !dream.text || !dream.line) throw new Error(`${owner} needs a name, a text and a line.`);
  if (dream.effects) checkEffects(dream.effects, owner);
  for (const name of Object.keys(dream.monsters ?? {})) {
    if (!monsters.some((kind) => kind.name === name)) throw new Error(`${owner} makes "${name}" commoner, but it isn't in data/monsters.js.`);
  }
  for (const key of ['fightRate', 'eventRate']) {
    if (key in dream && !(dream[key] > 0)) throw new Error(`${owner} needs a ${key} above 0.`);
  }
}

export function dreamById(id) {
  return dreams.find((dream) => dream.id === id) ?? null;
}

// A new dream for the next hero, never the same one twice in a row, and one the dragon dreams
// in this act of the story (see fromAct and untilAct in data/dreams.js).
// `random` is a function giving a number from 0 to 1, like Math.random.
export function rollDream(random, lastId, act = 1) {
  const choices = dreams.filter((dream) => dream.id !== lastId
    && (dream.fromAct ?? 1) <= act && act <= (dream.untilAct ?? Infinity));
  return choices[Math.floor(random() * choices.length)]?.id ?? null;
}
