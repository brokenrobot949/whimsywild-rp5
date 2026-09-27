// Skills. Every skill carries one of five tags. A hero's tag totals decide which classes
// they can become, and which skills they're offered.
// All numbers are starting values to tune during Phase 1 playtests.

// The five tags. `color` marks them on cards and chips.
export const tags = [
  { id: 'Might', theme: 'Weapons, armor and strength', color: '#b8483a' },
  { id: 'Arcane', theme: 'Spells and elements', color: '#5b4bc4' },
  { id: 'Faith', theme: 'Healing and holy power', color: '#b0841f' },
  { id: 'Cunning', theme: 'Stealth, tricks and luck', color: '#3f6c80' },
  { id: 'Wild', theme: 'Beasts, nature and survival', color: '#3d7a28' },
];

export const skillPicks = {
  everyLevels: 3,    // a skill pick every this many levels (at levels 3, 6, 9 and so on)
  options: 3,        // skills offered at each pick
  tagWeight: 1.5,    // each point the hero has in a tag makes that tag's skills this much likelier to be offered
  startCharge: 0.7,  // active skills start each fight this far towards ready (1 means ready at once)
};

// How long Auto-decide waits before choosing, in seconds (shorter at debug speeds).
export const autoDecideSeconds = 2;

// Skills.
//   kind    'active' skills fire in fights when ready; 'passive' skills always apply
//   flavor  a line shown on the choice card
//   ranks   what the skill does at rank 1, 2 and 3 (each rank is the full effect, not an addition)
//
// Effects a rank can have:
//   boost: { power: 0.1 }  +10% to a stat (power, defense, maxHp, speed or luck)
//   healing: 0.3          heals 30% faster while traveling
//   potionHealing: 0.3    potions heal 30% more
//   gold: 0.2             20% more gold from fights
//   loot: 0.05            +5% chance a monster drops an item
//   potionFind: 0.05      +5% chance a monster drops a potion
//   xp: 0.1               10% more experience
//   dodge: 5              +5% chance to dodge blows
//   critDamage: 0.5       critical hits deal 50% more
//   thorns: 0.2           monsters take 20% of the damage they deal back
//   lifesteal: 0.1        heals 10% of damage dealt
//   firstStrike: true     the hero's first blow in a fight lands at once
//   skillDamage: 0.3      active skills deal 30% more damage
// Active skills also need:
//   cooldown: 6           seconds between uses
// and do some of these when used:
//   strike: 1.5           a blow for 150% damage
//   hits: 3               that many blows
//   stun: 1               the monster loses 1 second
//   drain: 0.5            heals 50% of the damage dealt
//   heal: 0.3             heals 30% of max HP
//   when: 0.5             only used when HP is below 50% (for heals; 0.6 if left out)
export const skills = [
  // ---- Might ----
  {
    name: 'Aggressive Shield Bash', tag: 'Might', kind: 'active',
    flavor: 'Less a technique than a strongly held opinion.',
    ranks: [
      { strike: 1.5, stun: 0.5, cooldown: 5 },
      { strike: 1.8, stun: 0.7, cooldown: 5 },
      { strike: 2.1, stun: 0.9, cooldown: 4.5 },
    ],
  },
  {
    name: 'Mighty Swing', tag: 'Might', kind: 'active',
    flavor: 'Wind up, swing, apologize to the furniture.',
    ranks: [
      { strike: 2, cooldown: 7 },
      { strike: 2.5, cooldown: 6.5 },
      { strike: 3, cooldown: 6 },
    ],
  },
  {
    name: 'Second Wind', tag: 'Might', kind: 'active',
    flavor: 'A deep breath and a stern word with oneself.',
    ranks: [
      { heal: 0.2, when: 0.4, cooldown: 12 },
      { heal: 0.3, when: 0.4, cooldown: 11 },
      { heal: 0.4, when: 0.4, cooldown: 10 },
    ],
  },
  {
    name: 'Iron Constitution', tag: 'Might', kind: 'passive',
    flavor: 'Has eaten worse. Has eaten much worse.',
    ranks: [{ boost: { maxHp: 0.1 } }, { boost: { maxHp: 0.2 } }, { boost: { maxHp: 0.3 } }],
  },
  {
    name: 'Stubborn Stance', tag: 'Might', kind: 'passive',
    flavor: 'Simply refuses to fall over.',
    ranks: [{ boost: { defense: 0.1 } }, { boost: { defense: 0.2 } }, { boost: { defense: 0.3 } }],
  },
  {
    name: 'Big Arms', tag: 'Might', kind: 'passive',
    flavor: "Mostly from carrying other people's luggage.",
    ranks: [{ boost: { power: 0.08 } }, { boost: { power: 0.16 } }, { boost: { power: 0.24 } }],
  },

  // ---- Arcane ----
  {
    name: 'Fireball (Slightly Too Large)', tag: 'Arcane', kind: 'active',
    flavor: "Singes the eyebrows. Mostly the caster's.",
    ranks: [
      { strike: 2.2, cooldown: 7 },
      { strike: 2.7, cooldown: 6.5 },
      { strike: 3.2, cooldown: 6 },
    ],
  },
  {
    name: 'Frost Snap', tag: 'Arcane', kind: 'active',
    flavor: 'A sharp chill and a sharper remark.',
    ranks: [
      { strike: 1.2, stun: 1, cooldown: 6 },
      { strike: 1.4, stun: 1.3, cooldown: 5.5 },
      { strike: 1.6, stun: 1.6, cooldown: 5 },
    ],
  },
  {
    name: 'Arcane Missiles', tag: 'Arcane', kind: 'active',
    flavor: 'Three little bolts, each with opinions.',
    ranks: [
      { strike: 0.6, hits: 3, cooldown: 6 },
      { strike: 0.7, hits: 3, cooldown: 5.5 },
      { strike: 0.8, hits: 4, cooldown: 5 },
    ],
  },
  {
    name: 'Siphon Spark', tag: 'Arcane', kind: 'active',
    flavor: 'Borrows a little life. Never gives it back.',
    ranks: [
      { strike: 1.3, drain: 0.5, cooldown: 6 },
      { strike: 1.5, drain: 0.6, cooldown: 6 },
      { strike: 1.7, drain: 0.7, cooldown: 5.5 },
    ],
  },
  {
    name: 'Mana Shield', tag: 'Arcane', kind: 'passive',
    flavor: 'Hurts to hit, in a sparkly sort of way.',
    ranks: [{ thorns: 0.15 }, { thorns: 0.25 }, { thorns: 0.35 }],
  },
  {
    name: 'Scholarly Mind', tag: 'Arcane', kind: 'passive',
    flavor: 'Takes notes. Even during fights.',
    ranks: [{ xp: 0.08 }, { xp: 0.16 }, { xp: 0.24 }],
  },

  // ---- Faith ----
  {
    name: 'Stern Blessing', tag: 'Faith', kind: 'active',
    flavor: 'A blessing delivered in the tone of a scolding.',
    ranks: [
      { heal: 0.25, when: 0.5, cooldown: 10 },
      { heal: 0.35, when: 0.5, cooldown: 9 },
      { heal: 0.45, when: 0.5, cooldown: 8 },
    ],
  },
  {
    name: 'Holy Smite', tag: 'Faith', kind: 'active',
    flavor: 'Righteousness, applied firmly.',
    ranks: [
      { strike: 1.8, cooldown: 6 },
      { strike: 2.2, cooldown: 5.5 },
      { strike: 2.6, cooldown: 5 },
    ],
  },
  {
    name: 'Blessed Rest', tag: 'Faith', kind: 'passive',
    flavor: 'Sleeps the sleep of the faintly smug.',
    ranks: [{ healing: 0.3 }, { healing: 0.6 }, { healing: 0.9 }],
  },
  {
    name: 'Holy Water', tag: 'Faith', kind: 'passive',
    flavor: 'Blesses every potion. Some of them twice.',
    ranks: [{ potionHealing: 0.3 }, { potionHealing: 0.6 }, { potionHealing: 0.9 }],
  },
  {
    name: 'Candlelit Resolve', tag: 'Faith', kind: 'passive',
    flavor: 'Keeps a candle lit. Keeps going.',
    ranks: [
      { boost: { maxHp: 0.06, defense: 0.06 } },
      { boost: { maxHp: 0.12, defense: 0.12 } },
      { boost: { maxHp: 0.18, defense: 0.18 } },
    ],
  },
  {
    name: 'Righteous Vigor', tag: 'Faith', kind: 'passive',
    flavor: 'Every blow landed restores a little faith, and a little health.',
    ranks: [{ lifesteal: 0.08 }, { lifesteal: 0.14 }, { lifesteal: 0.2 }],
  },

  // ---- Cunning ----
  {
    name: 'Dirty Trick', tag: 'Cunning', kind: 'active',
    flavor: "Sand in the eyes. Or flour. Whatever's handy.",
    ranks: [
      { strike: 1.2, stun: 1.2, cooldown: 6 },
      { strike: 1.4, stun: 1.5, cooldown: 5.5 },
      { strike: 1.6, stun: 1.8, cooldown: 5 },
    ],
  },
  {
    name: 'Quick Stab', tag: 'Cunning', kind: 'active',
    flavor: 'Two quick jabs and a cheeky wink.',
    ranks: [
      { strike: 0.8, hits: 2, cooldown: 4 },
      { strike: 0.9, hits: 2, cooldown: 3.5 },
      { strike: 1, hits: 3, cooldown: 3 },
    ],
  },
  {
    name: 'Borrow Permanently', tag: 'Cunning', kind: 'passive',
    flavor: 'It was practically asking to be taken.',
    ranks: [{ gold: 0.2 }, { gold: 0.4 }, { gold: 0.6 }],
  },
  {
    name: 'Sneak Attack', tag: 'Cunning', kind: 'passive',
    flavor: 'Strikes first, from behind, with no apology.',
    ranks: [
      { firstStrike: true, critDamage: 0.25 },
      { firstStrike: true, critDamage: 0.5 },
      { firstStrike: true, critDamage: 0.75 },
    ],
  },
  {
    name: 'Duck and Weave', tag: 'Cunning', kind: 'passive',
    flavor: 'Mostly ducking. Some weaving.',
    ranks: [{ dodge: 5 }, { dodge: 9 }, { dodge: 13 }],
  },
  {
    name: 'Nimble Fingers', tag: 'Cunning', kind: 'passive',
    flavor: 'Pockets things before anyone else notices them.',
    ranks: [{ loot: 0.08 }, { loot: 0.15 }, { loot: 0.22 }],
  },

  // ---- Wild ----
  {
    name: 'Squirrel Friend', tag: 'Wild', kind: 'active',
    flavor: 'A squirrel joins in, briefly and ferociously.',
    ranks: [
      { strike: 1.4, cooldown: 5 },
      { strike: 1.7, cooldown: 4.5 },
      { strike: 2, cooldown: 4 },
    ],
  },
  {
    name: 'Bee Swarm', tag: 'Wild', kind: 'active',
    flavor: 'Brings some friends. The friends are bees.',
    ranks: [
      { strike: 0.5, hits: 4, cooldown: 7 },
      { strike: 0.6, hits: 4, cooldown: 6.5 },
      { strike: 0.7, hits: 5, cooldown: 6 },
    ],
  },
  {
    name: 'Forager', tag: 'Wild', kind: 'passive',
    flavor: 'Knows which berries heal and which berries bite.',
    ranks: [{ potionFind: 0.05 }, { potionFind: 0.1 }, { potionFind: 0.15 }],
  },
  {
    name: 'Fleet of Foot', tag: 'Wild', kind: 'passive',
    flavor: 'Quick on the trail. Quicker away from it.',
    ranks: [{ boost: { speed: 0.08 } }, { boost: { speed: 0.16 } }, { boost: { speed: 0.24 } }],
  },
  {
    name: 'Bark Skin', tag: 'Wild', kind: 'passive',
    flavor: 'A little rough around the edges. On purpose.',
    ranks: [
      { boost: { maxHp: 0.06, defense: 0.08 } },
      { boost: { maxHp: 0.12, defense: 0.16 } },
      { boost: { maxHp: 0.18, defense: 0.24 } },
    ],
  },
  {
    name: "Hunter's Eye", tag: 'Wild', kind: 'passive',
    flavor: 'Never misses a detail. Occasionally misses lunch.',
    ranks: [{ boost: { luck: 0.4 } }, { boost: { luck: 0.8 } }, { boost: { luck: 1.2 } }],
  },
];

// How effects are described on cards. {percent} shows a share as a percent (0.2 → 20);
// {value} shows the number as it is; {stat} is a stat name.
export const effectText = {
  boost: '+{percent}% {stat}',
  healing: 'heals {percent}% faster on the road',
  potionHealing: 'potions heal {percent}% more',
  gold: '+{percent}% gold',
  loot: '+{percent}% chance of loot',
  potionFind: '+{percent}% chance of finding potions',
  xp: '+{percent}% experience',
  dodge: '+{value}% dodge',
  critDamage: 'critical hits deal +{percent}%',
  thorns: 'attackers take {percent}% of their damage back',
  lifesteal: 'heals {percent}% of damage dealt',
  firstStrike: 'always strikes first',
  skillDamage: 'skills deal +{percent}% damage',
  strike: 'strikes for {percent}% damage',
  hits: '{value} times',
  stun: 'stuns for {value}s',
  drain: 'heals {percent}% of the damage',
  heal: 'heals {percent}% HP',
  when: 'when below {percent}% HP',
  cooldown: 'every {value}s',
};

// Text on the choice cards.
export const choiceText = {
  skillTitle: 'Level {level}: choose a skill',
  classTitle: 'Level {level}: choose a class',
  newSkill: 'New',
  rank: 'Rank {rank} of {max}',
  autoDecide: 'Auto-decide choices',
};

// Log lines. {skill} is the skill's name, {rank} its new rank.
export const skillLines = {
  learned: ['learned {skill}.', 'picked up {skill} from a passing expert.', 'got the hang of {skill}.'],
  improved: ['improved {skill} to rank {rank}.', 'practiced {skill} until it reached rank {rank}.'],
};
