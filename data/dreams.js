// Tonight's dream: what the sleeping dragon dreams of during a hero's life. Each life has one,
// and it changes the whole life a little. The dream belongs to the world, not the hero, so
// rerolling a hero or choosing another town never changes it; the next hero gets a new one.
//
//   id      a short name for the save (keep it the same once players have it)
//   name    shown on the New Hero card and the hero strip
//   text    what it does, in a few words, for the New Hero card
//   line    logged as the life begins (keep under about 70 characters)
// And any of these (all optional):
//   effects          like a skill's (see skills.js), for every hero who lives under this dream
//   monsters         makes some monsters commoner: { 'Mimic': 4 } is four times as common
//   monsterStrength  0.05 makes every monster 5% tougher (HP, power and defense); -0.05 weaker.
//                    A little goes a long way: 0.05 roughly doubles how often heroes die
//   fightRate        1.3 means 30% more fights on the road; 0.7 means 30% fewer
//   eventRate        1.5 means 50% more story events
//   fromAct          the dragon only dreams this from this act on (4 is Sweet Dreams; see story.js)
//   untilAct         ...or only up to this act

export const dreams = [
  {
    id: 'gold', name: 'Dreams of Gold',
    text: 'More treasure, and more mimics.',
    line: 'heard the ground jingle all night, as if the world dreamed of gold.',
    effects: { gold: 0.3, loot: 0.05 },
    monsters: { Mimic: 4, 'Treasure Goblin': 2 },
  },
  {
    id: 'feasts', name: 'Dreams of Feasts',
    text: 'Potions heal twice as much, and pie golems roam.',
    line: 'woke to the smell of baking pies, from nowhere in particular.',
    effects: { potionHealing: 1 },
    monsters: { 'Pie Golem': 4 },
  },
  {
    id: 'rain', name: 'Dreams of Rain',
    text: 'Slow, soggy roads. Slimes and frogs thrive.',
    line: 'woke to rain from a clear sky. Something vast was dreaming of it.',
    effects: { travelSpeed: -0.1, healing: 0.2 },
    monsters: { 'Slime Puddle': 3, 'Pompous Bullfrog': 3 },
  },
  {
    id: 'flying', name: 'Dreams of Flying',
    text: 'Light feet on the road. Birds everywhere.',
    line: 'felt light enough to float away, and nearly did.',
    effects: { travelSpeed: 0.25 },
    monsters: { 'Indignant Goose': 3, 'Ravenous Crow': 3, 'Coin-Snatching Magpie': 3 },
  },
  {
    id: 'books', name: 'Dreams of Old Books',
    text: 'Every lesson sticks. More experience.',
    line: 'dreamed of dusty libraries, and woke up knowing things.',
    effects: { xp: 0.2 },
  },
  {
    id: 'quiet', name: 'Dreams of Quiet',
    text: 'Fewer monsters on the roads.',
    line: 'woke to a hush over the land. Even the monsters were sleepy.',
    fightRate: 0.7,
  },
  {
    id: 'storms', name: 'Dreams of Storms',
    text: 'More monsters, and fiercer ones.',
    line: 'heard thunder rumble under the ground. The Sleeper is restless.',
    fightRate: 1.25, monsterStrength: 0.03,
    untilAct: 3, // once the dragon sleeps peacefully (Act 4), it never dreams of storms again
  },
  {
    id: 'giants', name: 'Dreams of Giants',
    text: 'Monsters are bigger, but teach more.',
    line: 'dreamed of towering things. The monsters look larger today.',
    monsterStrength: 0.05, effects: { xp: 0.2 },
    untilAct: 3,
  },
  {
    id: 'luck', name: 'Dreams of Clover',
    text: 'Fortune smiles: more luck, better odds in story events.',
    line: 'found four-leaf clovers growing in their boots.',
    effects: { boost: { luck: 0.5 }, eventLuck: 0.1 },
  },
  {
    id: 'home', name: 'Dreams of Home',
    text: 'Wounds mend quickly on the road.',
    line: 'dreamed of a warm hearth, and woke up feeling mended.',
    effects: { healing: 0.5 },
  },
  {
    id: 'adventure', name: 'Dreams of Adventure',
    text: 'Strange things happen more often.',
    line: 'felt the world tilt towards adventure. Anything could happen.',
    eventRate: 1.6,
  },
  {
    id: 'mushrooms', name: 'Dreams of Mushrooms',
    text: 'Toadstools everywhere. Potions are easy to find.',
    line: 'woke up to find mushrooms had sprouted on everything overnight.',
    effects: { potionFind: 0.1 },
    monsters: { 'Wandering Toadstool': 4 },
  },

  // ---- Sweet Dreams: only once the dragon sleeps peacefully (Act 4) ----
  {
    id: 'picnics', name: 'Dreams of Picnics', fromAct: 4,
    text: 'Fewer fights. Monsters would rather share a sandwich.',
    line: 'woke on a checked blanket, with a sandwich nobody remembered making.',
    fightRate: 0.75, effects: { gold: 0.15 },
  },
  {
    id: 'lanterns', name: 'Dreams of Lanterns', fromAct: 4,
    text: 'Lanterns light every road. Quicker travel, more stories.',
    line: 'saw lanterns glowing along every road, lit by nobody at all.',
    effects: { travelSpeed: 0.15 }, eventRate: 1.4,
  },
  {
    id: 'upside-down', name: 'Dreams of Upside-Down', fromAct: 4,
    text: 'The sky is underfoot. Strange, but lucky, and educational.',
    line: 'woke with the sky beneath their boots. It was fine, somehow.',
    effects: { xp: 0.15, boost: { luck: 0.2 } },
  },
  {
    id: 'old-friends', name: 'Dreams of Old Friends', fromAct: 4,
    text: 'Every hero who came before waves hello. Wounds mend fast.',
    line: 'dreamed of every hero who came before, all of them waving.',
    effects: { healing: 0.5, boost: { maxHp: 0.05 } },
  },
];

// Words on the New Hero card, the hero strip and the Hero tab. {name} is the dream's name.
export const dreamText = {
  label: "Tonight's dream",
  strip: '☾ {name}',
};
