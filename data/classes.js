// Classes. A hero evolves by choosing between two classes at certain levels;
// the two on offer are the ones whose tags best match the hero's skills.
//
//   tier    1 is a base class (level 5), 2 advanced (level 15), 3 legendary (a later update)
//   tags    the tags the class stands for. A single-tag class of tier 2 or 3 lists its tag
//           twice, so it competes fairly with two-tag classes
//   sprite  the hero's picture once they take the class (see art.js)
//   flavor  a line shown on the choice card
//   perk    the class's signature perk: its name, and effects like a skill's (see skills.js)

// When heroes choose a class, and from which tier.
// Phase 1 has only the five base classes, so level 15 has nothing to offer yet.
export const evolutions = [
  { level: 5, tier: 1 },
  { level: 15, tier: 2 },
];

export const classes = [
  {
    id: 'fighter', name: 'Fighter', tier: 1, tags: ['Might'],
    sprite: { sheet: 'dungeon', tile: 97 },
    flavor: 'Stands at the front. Mostly by accident.',
    perk: { name: 'Stalwart', effects: { boost: { maxHp: 0.15, defense: 0.1 } } },
  },
  {
    id: 'mage', name: 'Mage', tier: 1, tags: ['Arcane'],
    sprite: { sheet: 'dungeon', tile: 84 },
    flavor: 'Knows several words of power, and uses them loudly.',
    perk: { name: 'Arcane Surge', effects: { skillDamage: 0.5, boost: { maxHp: 0.1 } } },
  },
  {
    id: 'cleric', name: 'Cleric', tier: 1, tags: ['Faith'],
    sprite: { sheet: 'creatures', tile: 37 },
    flavor: 'Heals others. Lectures them too.',
    perk: { name: 'Blessed Recovery', effects: { healing: 0.5, potionHealing: 0.25 } },
  },
  {
    id: 'rogue', name: 'Rogue', tier: 1, tags: ['Cunning'],
    sprite: { sheet: 'creatures', tile: 67 },
    flavor: "Never met a pocket they didn't like.",
    perk: { name: 'Light Fingers', effects: { gold: 0.3, dodge: 12, critDamage: 0.5, boost: { maxHp: 0.1 } } },
  },
  {
    id: 'ranger', name: 'Ranger', tier: 1, tags: ['Wild'],
    sprite: { sheet: 'dungeon', tile: 112 },
    flavor: 'Talks to trees. The trees are very polite.',
    perk: { name: 'Pathfinder', effects: { boost: { speed: 0.15 }, firstStrike: true } },
  },
];

// Logged when a hero takes a class. {a} is the class with "a" or "an", like "a Fighter".
export const classLines = [
  'became {a}, and looked the part.',
  'took up the life of {a}.',
  'found their calling as {a}.',
];
