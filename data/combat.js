// Fighting, experience and healing.
// All numbers are starting values to tune during Phase 1 playtests.
//
// What the stats do:
//   maxHp    hit points; at 0 the hero dies
//   power    how hard blows land
//   defense  softens the blows that land
//   speed    blows every 10 seconds (10 is one blow a second)
//   luck     percent chance of a critical hit, and half that chance to dodge a blow

// The hero's stats at level 1, and what each new level adds.
export const heroStats = {
  start: { maxHp: 30, power: 6, defense: 3, speed: 10, luck: 5 },
  perLevel: { maxHp: 5, power: 1, defense: 0.5, speed: 0.1, luck: 0.2 },
};

export const experience = {
  perMonsterLevel: 10, // XP for a win = this × the monster's level × the monster's own xp number
  // XP needed to go up from level L = perLevel × L + perLevelSquared × L × L
  toNextLevel: { perLevel: 7, perLevelSquared: 0.5 },
};

export const encounters = {
  minGapSeconds: 3,     // walking time after a fight before another can start
  chancePerSecond: 0.3, // after the gap, the chance of a fight per second of walking
  // Phase 1: a monster's level is the hero's level plus one of these, so monsters
  // grow with the hero until Phase 2 adds harder regions (see DESIGN.md).
  levelOffsets: [-1, 0, 0, 1],
  // Each monster level adds this share of its level-1 HP, power and defense. A little faster
  // than the hero's own growth, so monsters keep up with heroes who have gear and skills.
  monsterGrowth: 0.22,
};

export const blows = {
  spread: 0.2,        // each blow varies by up to 20% either way
  critical: 2,        // critical hits do this many times the damage
  firstBlowWait: 0.5, // share of the usual wait before the first blow of a fight
};

export const healing = {
  // Share of max HP regained each second outside fights (0.012 is 1.2%). Towns heal fully.
  // Along with monsterGrowth above, this is the strongest dial for how often heroes die:
  // lower healing or faster monster growth means more deaths.
  perSecond: 0.012,
};

// Logged each time the hero goes up a level. {level} is the new level.
export const levelUpLines = [
  'reached level {level} and felt noticeably more heroic.',
  'reached level {level}. Stood a little taller.',
  'reached level {level} and celebrated with a modest jig.',
  'grew to level {level}. The bards remained unimpressed.',
  'reached level {level}. Somewhere, a badger felt uneasy.',
];

// Short notes on the encounter card for each blow. {damage} is the damage dealt.
export const blowNotes = {
  heroHit: 'Hit for {damage}',
  heroCritical: 'Critical hit! {damage}',
  heroMissed: 'It dodged',
  monsterHit: 'Took {damage}',
  monsterCritical: 'Ouch! Took {damage}',
  monsterMissed: 'Dodged!',
  potion: 'Drank a potion',
  skillHit: '{skill}! {damage}',
  skillHeal: '{skill}: +{healed} HP',
  victory: 'Victory!',
};
