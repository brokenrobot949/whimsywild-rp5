// The finale: the Deepest Nightmare. Once every verse of the lullaby has been found, a way into
// the dragon's dream opens through Lidwater, the closed eye. Inside, the hero passes through one
// dream from every region, tail to head, and then sings the whole lullaby while the Nightmare
// fights back. Singing the last verse ends the story, and the hero's life with it: the ending
// then scrolls the name, epithet and greatest deed of every hero who ever lived.
//
// A hero who retreats or falls leaves the Nightmare waiting for the next hero. It's played in
// the same panel as dungeons and castles (see dungeons.js).

export const finaleSettings = {
  entrance: 'Lidwater',  // the landmark the way in opens from (a place in regions.js)
  harderBy: 5,          // rumors and Auto-decide treat the Nightmare as this many levels above
                        // Smokecrown, so heroes are steered there once they're strong
  rumorWeight: 3,       // while open, rumors of it come up this many times as often
  // The dreams, in order: one room for each region, then the song.
  dreams: ['tailwoods', 'hindhill', 'flank', 'fens', 'spine', 'claws', 'smokecrown'],
  dreamLevels: 2,       // monsters in the dreams are the hero's own level, plus this many
  dreamHeal: 0.1,       // as each new dream begins, the hero gets back this share of max HP
  nightmare: 'Nightmare', // the monster the hero sings to (from monsters.js, with song: true)
  songLevels: 0,        // it's the hero's own level, plus this many
  roomSeconds: 1.5,     // time between rooms
  retreatBelow: 0.7,    // between rooms, a hero below this share of max HP may turn back (there's
                        // no turning back once the song begins, so only a hero in good shape should)
  autoRetreatBelow: 0.65, // Auto-decide turns back below this share, and presses on otherwise
};

// Words on cards, in the panel, in the Chronicle and in the ending. {words} are filled in.
export const finaleText = {
  panelName: 'The Deepest Nightmare',
  logName: 'the Deepest Nightmare', // how the log names it in a sentence
  pressOnDetail: 'The song is close', // on the card that asks a hurt hero whether to press on
  dreamRoom: 'A dream of {theme}',  // {theme} is the region's dream theme, from regions.js
  songRoom: 'The lullaby',
  songNote: 'Sang "{title}"',     // on the fight card, as each verse is sung
  rumorNote: 'The Deepest Nightmare', // shown on rumor cards for the way in
  // While the way in is open, these replace the entrance's own rumors.
  rumors: [
    'Lidwater has opened. They say you can walk into the dream.',
    'The closed eye is flickering. Someone must go in and sing.',
    'All seven verses are found. Now someone must sing them.',
  ],
  epithet: 'the Lullaby-Singer',    // the hero who finishes the song
  deed: 'Sang Sominus to sleep.',
  ending: 'Sang Sominus to sleep, in the heart of the Deepest Nightmare.', // the hero's ending
  // The ending: a scroll of every hero. (The card that follows is Act 4's interlude, in story.js.)
  rollTitle: 'The Last Verse',
  rollIntro: 'The lullaby\'s last verse was never written. It is the story of everyone who came looking.',
  rollSkip: 'Skip',
  secondsPerHero: 1.6,              // how long the scroll lingers on each hero
};

// Log lines. {theme}, {title} and {a} are filled in automatically. Keep under ~70 characters.
export const finaleLines = {
  opened: 'heard that the closed eye had opened, just a crack. Lidwater waits.',
  enter: [
    'waded into Lidwater, and closed their eyes, and dreamed.',
    'stepped into the closed eye, and fell into the dream.',
  ],
  dream: [
    'drifted into a dream of {theme}.',
    'fell deeper, into a dream of {theme}.',
  ],
  song: 'reached the heart of the Nightmare, and began to sing.',
  retreat: ['woke with a start on the shore of Lidwater, gasping.', 'fled the Nightmare, and woke beside Lidwater.'],
  sang: 'sang "{title}". The Nightmare faltered.',
  slept: 'watched the Nightmare curl up small. Far below, Sominus slept.',
  remembered: 'will be remembered, always, as {first} {epithet}.',
};
