// Mentors: retired heroes settle in a town, and future heroes who start there learn from them.
// The most recent mentors in a town each give a new hero one gift, drawn at random from the
// pool below. Older retirees stay on as residents, listed in the Chronicle.

export const mentorSettings = {
  gifts: 3,      // how many of a town's most recent mentors give a gift
  residents: 12, // how many retired heroes each town remembers
};

// Choosing to retire.
export const retirement = {
  offerFrom: 60, // from this age, arriving in a town offers the choice to retire there
  autoAt: 65,    // Auto-decide retires at the first town visit from this age
};
// (Heroes who reach retireAge in life.js retire wherever they are, to the last town they visited.)

// The gift pool. Each mentor gives one gift, drawn at random: a gift with weight 10 is ten times
// as likely as one with weight 1. `perLevel` adds that much weight for each of the mentor's
// levels, so heroes who retired at a high level give better gifts (a negative perLevel makes a
// gift rarer from them). Rerolling a hero draws their gifts again.
//
//   kind    what the gift does:
//             'lesson'     the mentor's best skill is one of the options at the first skill pick
//             'perk'       a share (`share`) of the mentor's class perk, for the whole life
//             'gold'       gold worth `amount` fights at the hero's starting level
//             'potions'    `amount` healing potions
//             'gear'       an item of the mentor's, of `rarity`, named with `itemName`
//             'level'      the hero starts one level higher than the town's usual level
//             'skillRank'  a free rank in the mentor's best skill, straight away
//             'dud'        nothing at all, but it makes a good story
//   text    shown on the New Hero card and the Hero tab
//   line    logged as the life begins (keep under about 60 characters)
// Words in {braces} are filled in automatically: {first} the mentor's first name, {skill} their
// best skill, {class} their class, {effects} the perk share, {gold}, {count}, {a} and {item}.
export const gifts = [
  // Early fights are where most heroes die, so anything that helps at the start matters a lot:
  // one extra potion or one old item roughly halves a hero's chance of dying young. That's why
  // the strong gifts are kept rare.

  // ---- Common ----
  {
    id: 'lesson', kind: 'lesson', weight: 10,
    text: 'will teach {skill} at the first skill pick',
    line: 'was promised a lesson in {skill} by {first}.',
  },
  {
    id: 'purse', kind: 'gold', weight: 10, amount: 6,
    text: '{gold} gold for the road',
    line: 'was handed a purse of {gold} gold by {first}.',
  },
  {
    id: 'class-tricks', kind: 'perk', weight: 6, share: 0.05,
    text: 'shared some {class} tricks: {effects}',
    line: 'picked up a few {class} tricks from {first}.',
  },

  // ---- Uncommon ----
  {
    id: 'potion', kind: 'potions', weight: 1.5, amount: 1,
    text: 'a healing potion, just in case',
    line: 'was given a healing potion by {first}, just in case.',
  },
  {
    id: 'old-gear', kind: 'gear', weight: 1, perLevel: 0.03, rarity: 'common', itemName: "{first}'s Old {base}",
    text: '{item}',
    line: 'was given {a} by {first}.',
  },
  {
    id: 'head-start', kind: 'level', weight: 1, perLevel: 0.03,
    text: 'hard training: starts one level higher',
    line: 'trained hard with {first}, and set out a level ahead.',
  },

  // ---- Rare ----
  {
    id: 'heirloom', kind: 'gear', weight: 0.4, perLevel: 0.02, rarity: 'rare', itemName: "{first}'s Treasured {base}",
    text: '{item}, a treasured heirloom',
    line: 'inherited {a} from {first}.',
  },
  {
    id: 'masterclass', kind: 'skillRank', weight: 0.4, perLevel: 0.02,
    text: 'a masterclass: knows {skill} from the start',
    line: 'was taught {skill} by {first}, then and there.',
  },

  // ---- Duds ----
  {
    id: 'bad-advice', kind: 'dud', weight: 2, perLevel: -0.02,
    text: 'a piece of bad advice',
    line: 'got some very confident, very bad advice from {first}.',
  },
  {
    id: 'long-story', kind: 'dud', weight: 2, perLevel: -0.02,
    text: 'a very long story about the old days',
    line: 'sat through a very long story from {first}.',
  },
  {
    id: 'lucky-rock', kind: 'dud', weight: 1.5, perLevel: -0.02,
    text: 'a rock, which {first} insists is lucky',
    line: 'was given a lucky rock by {first}. It is a rock.',
  },
];

// Words on cards and screens. {words} are filled in automatically.
export const mentorText = {
  retireTitle: 'Retire in {town}?',
  retireBody: 'At {age}, {first} could settle in {town} as a mentor. Heroes who start in {town} later would learn from them.',
  retire: 'Retire here',
  retireDetail: 'Become a mentor in {town}',
  stay: 'Keep adventuring',
  stayDetail: 'There may be one more adventure left',
  // On the New Hero card, under the towns, and on the Hero tab.
  label: 'Mentors in {town}:',
  gift: '{name}: {gift}',
  // On the town buttons of the New Hero card.
  count: ['1 mentor', '{count} mentors'],
  // On the Hero tab.
  heroTab: 'Mentors',
  // On the first skill pick, next to the mentor's skill. {mentor} is their first name.
  lessonNote: "{mentor}'s lesson",
  // In the Chronicle.
  chronicle: 'Mentors of {town}',
  residents: ['and 1 more resident', 'and {count} more residents'],
};

// Log lines. {skill} and {mentor} are filled in automatically. Skill names can be long, so keep
// the other words short.
export const mentorLines = {
  // When the hero picks the skill a mentor promised to teach.
  taught: ['learned {skill} from {mentor}.', 'was taught {skill} by old {mentor}.'],
  stay: ['decided there was one more adventure in them yet.', 'thought about retiring, then thought better of it.'],
};
