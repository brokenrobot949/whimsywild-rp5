// New Game+: "Sominus Rolls Over". Once the dragon has been sung to sleep (Act 4), the player can
// let it dream again. It turns over in its sleep, and the land turns with it: the map is flipped
// (a different way each time), the fog returns, and the story starts again from Act 1. The hero
// who sang the lullaby becomes a legend, and gives every hero of the new dream a small gift.
// Each new dream is either gentle (just like before) or restless (tougher, but more rewarding).
//
// Inside the game each world is a "dream": the first dream, the second dream, and so on.

// The two kinds of new dream. A restless dream can make monsters tougher (monsterStrength, as in
// dreams.js: 0.03 is 3%, and a little goes a long way) and give every hero effects like a skill's.
export const moods = {
  gentle: {
    name: 'A gentle dream',
    detail: 'Everything as it was the first time.',
  },
  restless: {
    name: 'A restless dream',
    detail: 'Monsters are a little tougher, but heroes earn more gold and experience.',
    monsterStrength: 0.03,
    effects: { gold: 0.25, xp: 0.25 },
  },
};

// The legend: the hero who last sang the lullaby. Every hero of the next dream carries their gift.
// {name} is the legend's name and {first} their first name.
export const legend = {
  effects: { boost: { maxHp: 0.05, power: 0.05 } },
  text: '{name}, who sang the dragon to sleep, gives a token of the old song',
  line: 'carried a token from {first}, who once sang the dragon to sleep.',
};

// The order the map turns, one step each new dream (then round again): 0 is the world as first
// made, 1 is mirrored left to right, 2 upside down, and 3 both.
export const turns = [0, 1, 2, 3];

// Words on cards, in the Chronicle and in the Hall of Champions. {words} are filled in.
export const newDreamText = {
  // In the Chronicle, under Act 4.
  button: 'Let Sominus dream again',
  pending: 'Sominus will roll over when this hero\'s tale ends.',
  // The card that asks.
  promptTitle: 'Let Sominus dream again?',
  promptBody: 'The dragon will turn over in its sleep, and the land with it. The map will be new, the '
    + 'fog will return, and the story will begin again from the start: castles, verses and dream '
    + 'shards, all to find again. Your heroes stay in the Hall of Champions, and {singer} becomes a '
    + 'legend. What will it dream?',
  notYet: 'Not yet',
  notYetDetail: 'Stay in this peaceful world a while',
  // Logged when the choice is made in the middle of a hero's life.
  pendingLine: 'felt the ground begin to tilt, ever so slowly. The world is turning over.',
  // The card that begins the new dream.
  rollOverTitle: 'Sominus Rolls Over',
  rollOverBody: 'Far below Whimsywild, the great dragon stirs, and sighs, and turns over in its '
    + 'sleep. Hills slide, rivers wander, and the land comes to rest a new way round. The fog rolls '
    + 'back in. Only the old tales remember how {legend} once sang the dragon to sleep. {mood}',
  moodLines: {
    gentle: 'Its new dream is a gentle one.',
    restless: 'Its new dream is a restless one: the monsters are tougher, but so are the rewards.',
  },
  // Added to the start of Act 1's retelling in every dream after the first.
  oldTale: 'Long ago, the tales say, {legend} sang a great dragon to sleep. Since then the land has '
    + 'turned over, and nobody quite remembers how the song went.',
  // On the New Hero card.
  legendLabel: 'The legend:',
  restlessLabel: 'A restless dream.',
  // In the Chronicle.
  pastHeading: 'Past dreams',
  pastTitle: 'The {ordinal} dream',
  pastEntry: 'Sung to sleep by {singer}, age {age}, after {heroes} heroes.',
  pastRestless: 'A restless dream.',
  current: 'Now: the {ordinal} dream',
  // In the Hall of Champions, once there's more than one dream.
  hallTag: 'The {ordinal} dream',
  ordinals: ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'],
  ordinalBeyond: '{n}th',
};
