// The story of the Sleeping Dragon, told in three acts, and the Sweet Dreams that follow once
// it's finished (Act 4). Acts move on with what heroes achieve in the world, never with how many
// heroes have lived. Each new act begins with a short interlude card, shown before the next
// hero is rolled.

export const storySettings = {
  act2Castles: 1,     // Act 2 begins once this many monster castles have been conquered
  act3Verses: 5,      // Act 3 begins once this many verses of the lullaby have been found
  tavernChance: 0.3,  // chance that a hero arriving in a town overhears some tavern talk
};

// The acts. `omen` is logged at the moment an act begins, in the life of the hero who began it.
// Keep omens under about 70 characters. The interlude is shown between heroes.
export const acts = [
  {
    act: 1, name: 'The Stirring',
  },
  {
    act: 2, name: 'The Dreamlands',
    omen: 'felt the ground sigh, as if something far below had turned over.',
    interlude: {
      title: 'Act 2: The Dreamlands',
      body: 'Word spreads from the fallen castle. The monsters were never monsters at all: they are '
        + 'dreams, leaking up from something vast asleep beneath the land. The hills are its back, the '
        + 'rivers run along its scales, and it is dreaming badly. The scholars have a name for it now: '
        + 'Sominus. Long ago a lullaby sang it to sleep. The song is lost, but its verses are said to '
        + 'lie hidden in the dungeons and castles of every region.',
    },
  },
  {
    act: 3, name: 'The Waking',
    omen: 'heard, for a moment, the whole land humming along to the lullaby.',
    interlude: {
      title: 'Act 3: The Waking',
      body: 'With most of the lullaby found, the heroes finally understand the nightmare. Sominus is '
        + 'not angry. Sominus is lonely. It has slept so long that it fears the world has forgotten it, '
        + 'and the fear leaks out as monsters. Far to the north, the smoke over its head is thinning. '
        + 'Whoever reaches Smokecrown may sing it back to sleep.',
    },
  },
  {
    // The post-game: it begins when a hero sings the whole lullaby (see finale.js), and never ends.
    act: 4, name: 'Sweet Dreams',
    interlude: {
      title: 'Sominus Sleeps',
      body: 'Deep beneath Whimsywild, the great dragon turns over once, and settles, and sleeps. '
        + 'Its dreams are gentle now: full of sunlit tails and warm bread and heroes, every one of '
        + 'them remembered. The world stays open, and there are always more stories to tell.',
    },
  },
];

// Act 4, Sweet Dreams: once the dragon sleeps peacefully, its dreams turn gentle, and a little
// strange. (Some dreams and story events also only come in Act 4, or stop: see `fromAct` and
// `untilAct` in dreams.js and events.js.)
export const sweetDreams = {
  calm: 0.03,  // every region's monsters are this much weaker (0.03 is 3%), on top of any castle's.
               // With every castle fallen, about 6 heroes in 100 die without it; 3% roughly halves
               // that, and 5% leaves hardly any risk at all
  // New rumors that join a place's own, by place name. Keep each under about 60 characters.
  rumors: {
    Tailsend: ['Tailsend is holding a festival. Nobody knows what for.'],
    "Tail's Tip": ["The Tail's Tip has started wagging, very slowly."],
    'Drowsy Pond': ['The Drowsy Pond reflects a smiling face now.'],
    Haunchford: ['The scarecrows of Haunchford have started waving.'],
    'Giant Sunflower': ['The Giant Sunflower turns to face the sleeper below.'],
    Scaleport: ['Coins in Scaleport now land heads up, every time.'],
    "Dragon's Purse": ["The Dragon's Purse is giving things away."],
    'Fairy Ring': ['The fairies are dancing again, and they want partners.'],
    Fenmoot: ['Fenmoot swears the frogs are singing the lullaby.'],
    "Knight's Rest": ["The knights at Knight's Rest are finally resting."],
    'Old Battlefield': ['Flowers have grown over the Old Battlefield.'],
    Lastlight: ['Lastlight has let a few of its lamps go out. Nobody is lost.'],
    Lidwater: ['Lidwater ripples now, like an eye dreaming happily.'],
    'The Smoking Nostril': ['The Smoking Nostril puffs out little smoke rings.'],
  },
};

// Tavern talk, overheard in towns: what folk are saying in each act. Keep lines under about
// 70 characters (the log adds "Autumn, age 34: " in front).
export const tavernLines = {
  1: [
    'heard a farmer swear the hills had moved an inch overnight.',
    'heard the innkeeper blame the tremors on the Sleeper, then laugh.',
    'heard an old woman sing about something asleep beneath the world.',
    'heard a bard sing of the Sleeper. Nobody clapped.',
    'heard that the monsters are worse every year. Everyone agreed.',
    'heard a child ask what the Sleeper dreams about.',
  ],
  2: [
    'heard a scholar say the name Sominus, very quietly.',
    'heard that the monsters are only bad dreams. They still bite.',
    'heard the whole tavern humming half a lullaby.',
    'heard a child ask if the dragon has nice dreams too.',
    'heard folk argue over which hill is the dragon\'s nose.',
    'heard that somebody found a verse, and wept to hear it sung.',
  ],
  3: [
    'heard that the dragon is only lonely. Folk left out bread for it.',
    'saw someone carve their name on the tavern wall, to be remembered.',
    'heard the whole tavern try to sing the lullaby. Badly, but kindly.',
    'heard that the smoke over Smokecrown is thinning.',
    'heard a bard sing the names of heroes long gone.',
    'heard folk wish the dragon goodnight before bed.',
  ],
  4: [
    'heard that the monsters are yawning more than they bite.',
    'heard a bard sing the whole lullaby, start to finish. Twice.',
    'heard that the Lullaby-Singer\'s name is carved over every door.',
    'heard that the dragon snored last night, happily.',
    'heard folk arguing over what Sominus dreams of now.',
    'heard that a goose apologized to someone. Nobody believes it.',
  ],
};

// Words in the Chronicle. {words} are filled in automatically.
export const storyText = {
  chronicleAct: 'The story',
  actValue: 'Act {act}: {name}',
  interludeButton: 'Continue',
};
