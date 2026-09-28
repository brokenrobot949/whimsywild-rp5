// Epithets: titles heroes earn from their deeds, like "Maude Tumblewick Badgerbane".
// A hero keeps the first epithet they earn until they earn one with a higher rank,
// which replaces it. The log announces each new one.
//
//   epithet  the title, shown after the hero's name
//   rank     when a hero has earned several, the highest rank wins
//   when     what earns it, one of:
//              slain: 'Grumpy Badger', count: 8   defeat that many of one kind of monster
//              slainTotal: 45                     defeat that many monsters of any kind
//              closeCalls: 3                      win that many fights with barely any HP left
//              potions: 5                         drink that many potions
//              goldFound: 1500                    find that much gold in one life
//              visits: 'Drowsy Pond', count: 5    arrive at a place that many times
//              found: 'legendary'                 find an item of that rarity
//              level: 20                          reach that level
//              skillRank: 3                       raise any skill to that rank
//              respects: 2                        pay respects at that many graves

// The epithet every hero starts with.
export const defaultEpithet = 'the Hopeful';

// A "close call" is winning a fight with less than this share of max HP left (0.15 is 15%).
export const closeCallShare = 0.15;

export const epithets = [
  { epithet: 'the Seasoned', rank: 1, when: { level: 20 } },
  { epithet: 'the Practiced', rank: 1, when: { skillRank: 3 } },
  { epithet: 'the Heir', rank: 1, when: { respects: 1 } },
  { epithet: 'Badgerbane', rank: 2, when: { slain: 'Grumpy Badger', count: 8 } },
  { epithet: 'the Slime-Mopper', rank: 2, when: { slain: 'Slime Puddle', count: 8 } },
  { epithet: 'the Bee-Botherer', rank: 2, when: { slain: 'Dozy Bumblebee', count: 6 } },
  { epithet: 'the Mushroom-Picker', rank: 2, when: { slain: 'Wandering Toadstool', count: 6 } },
  { epithet: 'the Pond-Napper', rank: 2, when: { visits: 'Drowsy Pond', count: 4 } },
  { epithet: 'the Goose-Chaser', rank: 3, when: { slain: 'Indignant Goose', count: 7 } },
  { epithet: 'the Well-Hydrated', rank: 3, when: { potions: 4 } },
  { epithet: 'the Well-Off', rank: 3, when: { goldFound: 1500 } },
  { epithet: 'the Pie-Eater', rank: 3, when: { slain: 'Pie Golem', count: 5 } },
  { epithet: 'the Goblin-Fleecer', rank: 3, when: { slain: 'Treasure Goblin', count: 6 } },
  { epithet: 'the Unswallowed', rank: 5, when: { slain: 'Mimic', count: 4 } },
  { epithet: 'the Frog-Kisser', rank: 3, when: { slain: 'Pompous Bullfrog', count: 6 } },
  { epithet: 'Snailbane', rank: 4, when: { slain: 'Stately Snail', count: 4 } },
  { epithet: 'the Log-Sitter', rank: 5, when: { slain: 'Grinning Marshgator', count: 3 } },
  { epithet: 'Trufflebane', rank: 4, when: { slain: 'Truffle Boar', count: 4 } },
  { epithet: 'the Mildly Brave', rank: 4, when: { closeCalls: 2 } },
  { epithet: 'the Unstoppable', rank: 5, when: { slainTotal: 38 } },
  { epithet: 'the Dazzling', rank: 6, when: { found: 'legendary' } },
];

// Logged when a hero earns a new epithet. {first} is their first name.
export const epithetLines = [
  'became known far and wide as {first} {epithet}.',
  'was dubbed {first} {epithet} by the locals.',
  'earned a new name: {first} {epithet}.',
];
