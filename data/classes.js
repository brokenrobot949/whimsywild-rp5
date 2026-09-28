// Classes. A hero evolves by choosing between two classes at certain levels;
// the two on offer are the ones whose tags best match the hero's skills.
//
//   tier    1 is a base class (level 5), 2 advanced (level 15), 3 legendary (a later update)
//   tags    the tags the class stands for. A single-tag class of tier 2 or 3 lists its tag
//           twice, so it competes fairly with two-tag classes
//   sprite  the hero's picture once they take the class (see art.js)
//   flavor  a line shown on the choice card
//   perk    the class's signature perk: its name, and effects like a skill's (see skills.js).
//           A hero keeps the perks of every class they've taken, so an advanced class adds
//           its perk to the base class's

// When heroes choose a class, and from which tier. A tier with no classes yet is skipped.
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

  // ---- Advanced classes (level 15) ----
  // Ten two-tag hybrids and five single-tag masters.
  {
    id: 'champion', name: 'Champion', tier: 2, tags: ['Might', 'Might'],
    sprite: { sheet: 'creatures', tile: 18 },
    flavor: 'Has won every tournament, including several nobody else entered.',
    perk: { name: 'Unbreakable', effects: { boost: { maxHp: 0.2, power: 0.15 } } },
  },
  {
    id: 'spellblade', name: 'Spellblade', tier: 2, tags: ['Might', 'Arcane'],
    sprite: { sheet: 'creatures', tile: 17 },
    flavor: 'Writes spells on the sword, in case of forgetting them.',
    perk: { name: 'Runed Edge', effects: { boost: { power: 0.15 }, skillDamage: 0.3 } },
  },
  {
    id: 'paladin', name: 'Paladin', tier: 2, tags: ['Might', 'Faith'],
    sprite: { sheet: 'dungeon', tile: 100 },
    flavor: 'Smites evil, then apologizes for the mess.',
    perk: { name: 'Righteous Aegis', effects: { boost: { defense: 0.2 }, thorns: 0.15 } },
  },
  {
    id: 'duelist', name: 'Duelist', tier: 2, tags: ['Might', 'Cunning'],
    sprite: { sheet: 'dungeon', tile: 98 },
    flavor: 'Bows before every fight. Wins most of them anyway.',
    perk: { name: 'Riposte', effects: { dodge: 8, thorns: 0.25 } },
  },
  {
    id: 'barbarian', name: 'Barbarian', tier: 2, tags: ['Might', 'Wild'],
    sprite: { sheet: 'dungeon', tile: 87 },
    flavor: 'Shouts at monsters. Shouts at weather. Shouts at breakfast.',
    perk: { name: 'Battle Fury', effects: { boost: { power: 0.2 }, lifesteal: 0.08 } },
  },
  {
    id: 'archmage', name: 'Archmage', tier: 2, tags: ['Arcane', 'Arcane'],
    sprite: { sheet: 'creatures', tile: 65 },
    flavor: 'Has read every book in the tower, and written three.',
    perk: { name: 'Grand Incantation', effects: { skillDamage: 0.6, boost: { maxHp: 0.1 } } },
  },
  {
    id: 'oracle', name: 'Oracle', tier: 2, tags: ['Arcane', 'Faith'],
    sprite: { sheet: 'dungeon', tile: 99 },
    flavor: "Saw this coming. Didn't say anything, though.",
    perk: { name: 'Foresight', effects: { dodge: 10, xp: 0.15 } },
  },
  {
    id: 'illusionist', name: 'Illusionist', tier: 2, tags: ['Arcane', 'Cunning'],
    sprite: { sheet: 'creatures', tile: 66 },
    flavor: 'Is standing just to the left of where you think.',
    perk: { name: 'Mirror Image', effects: { dodge: 15, skillDamage: 0.2 } },
  },
  {
    id: 'hedgeWitch', name: 'Hedge Witch', tier: 2, tags: ['Arcane', 'Wild'],
    sprite: { sheet: 'creatures', tile: 27 },
    flavor: 'Brews potions from hedges. The hedges have complained.',
    perk: { name: 'Bubbling Cauldron', effects: { potionHealing: 0.5, potionFind: 0.1, skillDamage: 0.2 } },
  },
  {
    id: 'highPriest', name: 'High Priest', tier: 2, tags: ['Faith', 'Faith'],
    sprite: { sheet: 'creatures', tile: 35 },
    flavor: 'Blesses everything, including several suspicious puddles.',
    perk: { name: 'Small Miracles', effects: { healing: 0.6, lifesteal: 0.05, boost: { maxHp: 0.15 } } },
  },
  {
    id: 'friar', name: 'Friar', tier: 2, tags: ['Faith', 'Cunning'],
    sprite: { sheet: 'dungeon', tile: 86 },
    flavor: 'Takes a vow of poverty, and a small collection for the roof.',
    perk: { name: 'Passing the Hat', effects: { gold: 0.25, potionHealing: 0.3, boost: { maxHp: 0.15 } } },
  },
  {
    id: 'druid', name: 'Druid', tier: 2, tags: ['Faith', 'Wild'],
    sprite: { sheet: 'dungeon', tile: 111 },
    flavor: 'Prays to the oak. The oak is considering it.',
    perk: { name: 'Bramble Ward', effects: { healing: 0.4, thorns: 0.15 } },
  },
  {
    id: 'masterThief', name: 'Master Thief', tier: 2, tags: ['Cunning', 'Cunning'],
    sprite: { sheet: 'creatures', tile: 100 },
    flavor: "Once stole a king's shadow. Gave it back, eventually.",
    perk: { name: 'Five-Finger Discount', effects: { gold: 0.4, loot: 0.08, critDamage: 0.5 } },
  },
  {
    id: 'beastmaster', name: 'Beastmaster', tier: 2, tags: ['Cunning', 'Wild'],
    sprite: { sheet: 'dungeon', tile: 110 },
    flavor: 'Wears a very patient crab as a hat.',
    perk: { name: 'Pack Tactics', effects: { boost: { power: 0.15, speed: 0.1 } } },
  },
  {
    id: 'warden', name: 'Warden', tier: 2, tags: ['Wild', 'Wild'],
    sprite: { sheet: 'creatures', tile: 16 },
    flavor: 'Guards the forest, which appreciates the company.',
    perk: { name: "Warden's Oath", effects: { boost: { maxHp: 0.15, defense: 0.15 }, healing: 0.3 } },
  },
];

// Logged when a hero takes a class. {a} is the class with "a" or "an", like "a Fighter".
export const classLines = [
  'became {a}, and looked the part.',
  'took up the life of {a}.',
  'found their calling as {a}.',
];
