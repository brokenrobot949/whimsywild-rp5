// Sound and music, all made in code (no audio files). Each sound effect is a short recipe of
// tones and noise, and the music is a music-box lullaby written as notes.
//
// Notes are written like 'C4' (middle C), 'F#5' or 'Bb3': a letter, an optional # (sharp) or
// b (flat), and an octave number. A4 is 440 Hz. A number instead of a note is a pitch in Hz.

// Starting settings. Players change these in Settings, and their choices are remembered.
export const audioSettings = {
  musicVolume: 0.4,   // 0 is silent, 1 is full
  effectsVolume: 0.6,
};

// Sound effects. Each has layers that play together (or one after another, using `at`):
//   wave    'sine' (soft), 'triangle' (mellow), 'square' (chiptune), 'sawtooth' (buzzy)
//           or 'noise' (hiss, for hits, whooshes and rumbles)
//   pitch   the note (or, for noise, how high or low the hiss sounds)
//   to      slides the pitch to this over the layer's length (optional)
//   at      seconds after the sound starts (optional; 0 if left out)
//   length  seconds it lasts
//   volume  how loud, from 0 to 1 (keep most below 0.3; they add up)
//   attack  seconds to swell in (optional; a quick 0.005 if left out)
// `gap` is the fewest milliseconds between two plays of the same sound, so fast fights don't clatter.
export const sounds = {
  // ---- Fights ----
  fightStart: {
    gap: 200,
    layers: [
      { wave: 'square', pitch: 'E4', length: 0.07, volume: 0.12 },
      { wave: 'square', pitch: 'A4', at: 0.08, length: 0.12, volume: 0.12 },
    ],
  },
  swing: { // the hero lands a blow
    gap: 70,
    layers: [
      { wave: 'noise', pitch: 2400, to: 700, length: 0.08, volume: 0.4 },
      { wave: 'square', pitch: 'A3', to: 'A2', length: 0.05, volume: 0.08 },
    ],
  },
  critical: {
    gap: 70,
    layers: [
      { wave: 'noise', pitch: 3200, to: 900, length: 0.09, volume: 0.25 },
      { wave: 'square', pitch: 'E5', to: 'E6', length: 0.08, volume: 0.1 },
    ],
  },
  hurt: { // a monster lands a blow on the hero
    gap: 70,
    layers: [
      { wave: 'noise', pitch: 900, to: 200, length: 0.1, volume: 0.28 },
      { wave: 'triangle', pitch: 'D3', to: 'D2', length: 0.12, volume: 0.25 },
    ],
  },
  yip: { // the hero's pet joins in
    gap: 150,
    layers: [
      { wave: 'triangle', pitch: 'C6', to: 'G6', length: 0.06, volume: 0.1 },
      { wave: 'noise', pitch: 3000, to: 1500, length: 0.05, volume: 0.12 },
    ],
  },
  whiff: { // a blow misses
    gap: 70,
    layers: [{ wave: 'noise', pitch: 5000, to: 2500, length: 0.12, volume: 0.22, attack: 0.03 }],
  },
  spell: { // an attack skill
    gap: 90,
    layers: [
      { wave: 'triangle', pitch: 'A4', to: 'A6', length: 0.16, volume: 0.16 },
      { wave: 'sine', pitch: 'E6', at: 0.06, length: 0.14, volume: 0.1 },
    ],
  },
  heal: { // a healing skill
    gap: 150,
    layers: [
      { wave: 'sine', pitch: 'C5', to: 'G5', length: 0.2, volume: 0.15 },
      { wave: 'sine', pitch: 'E5', to: 'B5', at: 0.08, length: 0.22, volume: 0.12 },
    ],
  },
  potion: {
    gap: 200,
    layers: [
      { wave: 'sine', pitch: 'G4', to: 'D5', length: 0.06, volume: 0.15 },
      { wave: 'sine', pitch: 'B4', to: 'F5', at: 0.07, length: 0.06, volume: 0.15 },
      { wave: 'sine', pitch: 'D5', to: 'A5', at: 0.14, length: 0.08, volume: 0.15 },
    ],
  },
  victory: {
    gap: 150,
    layers: [
      { wave: 'square', pitch: 'C5', length: 0.07, volume: 0.1 },
      { wave: 'square', pitch: 'E5', at: 0.07, length: 0.07, volume: 0.1 },
      { wave: 'square', pitch: 'G5', at: 0.14, length: 0.14, volume: 0.1 },
    ],
  },
  death: {
    gap: 500,
    layers: [
      { wave: 'triangle', pitch: 'G4', length: 0.3, volume: 0.22 },
      { wave: 'triangle', pitch: 'E4', at: 0.3, length: 0.3, volume: 0.22 },
      { wave: 'triangle', pitch: 'C4', at: 0.6, length: 0.8, volume: 0.22 },
      { wave: 'sine', pitch: 'C3', at: 0.6, length: 1, volume: 0.2 },
    ],
  },

  // ---- Growing stronger ----
  levelUp: {
    gap: 300,
    layers: [
      { wave: 'triangle', pitch: 'C5', length: 0.08, volume: 0.18 },
      { wave: 'triangle', pitch: 'E5', at: 0.08, length: 0.08, volume: 0.18 },
      { wave: 'triangle', pitch: 'G5', at: 0.16, length: 0.08, volume: 0.18 },
      { wave: 'triangle', pitch: 'C6', at: 0.24, length: 0.3, volume: 0.18 },
    ],
  },
  equip: { // putting on a new item
    gap: 150,
    layers: [
      { wave: 'noise', pitch: 6000, length: 0.03, volume: 0.1 },
      { wave: 'triangle', pitch: 'E6', to: 'B5', length: 0.09, volume: 0.12 },
    ],
  },
  fanfare: { // a new epithet
    gap: 500,
    layers: [
      { wave: 'square', pitch: 'G4', length: 0.1, volume: 0.1 },
      { wave: 'square', pitch: 'C5', at: 0.1, length: 0.1, volume: 0.1 },
      { wave: 'square', pitch: 'E5', at: 0.2, length: 0.1, volume: 0.1 },
      { wave: 'square', pitch: 'G5', at: 0.3, length: 0.35, volume: 0.1 },
    ],
  },

  // ---- The world ----
  begin: { // a hero sets out
    gap: 500,
    layers: [
      { wave: 'triangle', pitch: 'G4', length: 0.12, volume: 0.15 },
      { wave: 'triangle', pitch: 'C5', at: 0.12, length: 0.25, volume: 0.15 },
    ],
  },
  arrive: {
    gap: 300,
    layers: [
      { wave: 'sine', pitch: 'E5', length: 0.1, volume: 0.1 },
      { wave: 'sine', pitch: 'A5', at: 0.1, length: 0.18, volume: 0.1 },
    ],
  },
  discovery: {
    gap: 300,
    layers: [
      { wave: 'sine', pitch: 'E5', length: 0.08, volume: 0.12 },
      { wave: 'sine', pitch: 'G#5', at: 0.07, length: 0.08, volume: 0.12 },
      { wave: 'sine', pitch: 'B5', at: 0.14, length: 0.08, volume: 0.12 },
      { wave: 'sine', pitch: 'E6', at: 0.21, length: 0.3, volume: 0.12 },
    ],
  },
  chime: { // a story event
    gap: 300,
    layers: [{ wave: 'sine', pitch: 'A5', length: 0.4, volume: 0.1 }, { wave: 'sine', pitch: 'E6', at: 0.05, length: 0.4, volume: 0.05 }],
  },
  bell: { // paying respects at a grave
    gap: 500,
    layers: [
      { wave: 'sine', pitch: 'A4', length: 1.4, volume: 0.15 },
      { wave: 'sine', pitch: 'E5', length: 1.1, volume: 0.08 },
      { wave: 'sine', pitch: 'A5', length: 0.8, volume: 0.04 },
    ],
  },
  shard: { // finding a dream shard
    gap: 500,
    layers: [
      { wave: 'sine', pitch: 'C6', length: 0.9, volume: 0.1 },
      { wave: 'sine', pitch: 'G6', at: 0.12, length: 0.8, volume: 0.08 },
      { wave: 'sine', pitch: 'E7', at: 0.24, length: 0.7, volume: 0.06 },
    ],
  },
  rumble: { // a tremor
    gap: 1000,
    layers: [
      { wave: 'noise', pitch: 140, to: 60, length: 1.3, volume: 0.45, attack: 0.15 },
      { wave: 'sine', pitch: 45, to: 32, length: 1.3, volume: 0.35, attack: 0.1 },
    ],
  },
  retire: {
    gap: 500,
    layers: [
      { wave: 'triangle', pitch: 'C5', length: 0.25, volume: 0.15 },
      { wave: 'triangle', pitch: 'G4', at: 0.25, length: 0.25, volume: 0.15 },
      { wave: 'triangle', pitch: 'E4', at: 0.5, length: 0.25, volume: 0.15 },
      { wave: 'triangle', pitch: 'C4', at: 0.75, length: 0.8, volume: 0.15 },
    ],
  },
  doorway: { // going into a dungeon
    gap: 500,
    layers: [
      { wave: 'noise', pitch: 300, to: 120, length: 0.5, volume: 0.25, attack: 0.05 },
      { wave: 'triangle', pitch: 'A3', length: 0.25, volume: 0.15 },
      { wave: 'triangle', pitch: 'E3', at: 0.22, length: 0.45, volume: 0.15 },
    ],
  },
  chest: { // a treasure chest, or a dungeon's treasure
    gap: 200,
    layers: [
      { wave: 'square', pitch: 'B5', length: 0.07, volume: 0.1 },
      { wave: 'square', pitch: 'E6', at: 0.07, length: 0.22, volume: 0.1 },
    ],
  },
  triumph: { // clearing a dungeon
    gap: 500,
    layers: [
      { wave: 'triangle', pitch: 'C5', length: 0.1, volume: 0.16 },
      { wave: 'triangle', pitch: 'G5', at: 0.1, length: 0.1, volume: 0.16 },
      { wave: 'triangle', pitch: 'E5', at: 0.2, length: 0.1, volume: 0.16 },
      { wave: 'triangle', pitch: 'C6', at: 0.3, length: 0.4, volume: 0.16 },
      { wave: 'sine', pitch: 'C4', at: 0.3, length: 0.5, volume: 0.12 },
    ],
  },
  bossMove: { // a castle boss uses its special move
    gap: 300,
    layers: [
      { wave: 'sawtooth', pitch: 'A2', to: 'D2', length: 0.45, volume: 0.12, attack: 0.02 },
      { wave: 'noise', pitch: 500, to: 150, length: 0.35, volume: 0.25, attack: 0.01 },
    ],
  },
  conquest: { // a castle is conquered
    gap: 1000,
    layers: [
      { wave: 'square', pitch: 'G4', length: 0.12, volume: 0.09 },
      { wave: 'square', pitch: 'C5', at: 0.14, length: 0.12, volume: 0.09 },
      { wave: 'square', pitch: 'E5', at: 0.28, length: 0.12, volume: 0.09 },
      { wave: 'square', pitch: 'G5', at: 0.42, length: 0.3, volume: 0.09 },
      { wave: 'square', pitch: 'E5', at: 0.74, length: 0.12, volume: 0.09 },
      { wave: 'square', pitch: 'G5', at: 0.88, length: 0.8, volume: 0.1 },
      { wave: 'triangle', pitch: 'C4', at: 0.42, length: 1.2, volume: 0.14 },
      { wave: 'triangle', pitch: 'G3', at: 0.88, length: 0.8, volume: 0.12 },
    ],
  },
  verse: { // finding a verse of the lullaby: the lullaby's first notes, on the music box
    gap: 1000,
    layers: [
      { wave: 'sine', pitch: 'G5', length: 0.9, volume: 0.12 },
      { wave: 'sine', pitch: 'E5', at: 0.36, length: 0.8, volume: 0.1 },
      { wave: 'sine', pitch: 'F5', at: 0.54, length: 0.7, volume: 0.1 },
      { wave: 'sine', pitch: 'E5', at: 0.72, length: 0.7, volume: 0.1 },
      { wave: 'sine', pitch: 'D5', at: 0.9, length: 0.7, volume: 0.1 },
      { wave: 'sine', pitch: 'C5', at: 1.08, length: 1.2, volume: 0.12 },
      { wave: 'sine', pitch: 'C4', at: 1.08, length: 1.2, volume: 0.06 },
    ],
  },
  click: { // a choice is made
    gap: 80,
    layers: [{ wave: 'square', pitch: 'C6', length: 0.03, volume: 0.1 }],
  },
};

// Which sound plays for which moment in the game. Leave a moment out, or set it to null, for silence.
export const soundFor = {
  lifeStart: 'begin',
  fightStart: 'fightStart',
  heroHit: 'swing',
  heroCritical: 'critical',
  monsterHit: 'hurt',
  missed: 'whiff',
  attackSkill: 'spell',
  healSkill: 'heal',
  potion: 'potion',
  fightWon: 'victory',
  death: 'death',
  levelUp: 'levelUp',
  equip: 'equip',
  epithet: 'fanfare',
  arrive: 'arrive',
  discovery: 'discovery',
  storyEvent: 'chime',
  respects: 'bell',
  shard: 'shard',
  tremor: 'rumble',
  retired: 'retire',
  choice: 'click',
  dungeonEnter: 'doorway',
  treasure: 'chest',
  dungeonCleared: 'triumph',
  bossMove: 'bossMove',
  castleConquered: 'conquest',
  nemesisMeet: 'bossMove',
  nemesisAvenged: 'triumph',
  treasureFound: 'fanfare',
  petHit: 'yip',
  songVerse: 'verse',
  finale: 'retire',
  verseFound: 'verse',
  newAct: 'rumble',
};

// The music: a music-box lullaby, in waltz time, that loops quietly all through a life.
// (The world's lost lullaby had seven verses; this is just a village tune about it.)
//   tempo       beats per minute
//   restBars    quiet bars between one play-through and the next
//   ring        seconds each music-box note rings on for
//   melody      [note, beats] pairs; 'rest' for a pause
//   chords      one chord per bar, from `chordNotes`; the accompaniment plays the chord's notes
//               in the order of `pattern` (0 is the chord's first note), one per beat
//   everyOther  every other play-through, the melody moves up this many semitones (12 is an octave)
export const music = {
  tempo: 72,
  beatsPerBar: 3,
  restBars: 2,
  ring: 1.8,
  melodyVolume: 0.18,       // kept soft, so the music sits behind the sound effects
  accompanimentVolume: 0.07,
  everyOther: 12,
  melody: [
    ['G4', 2], ['E4', 1],
    ['F4', 1], ['E4', 1], ['D4', 1],
    ['C4', 2], ['E4', 1],
    ['G4', 3],
    ['A4', 2], ['G4', 1],
    ['F4', 1], ['E4', 1], ['D4', 1],
    ['E4', 2], ['D4', 1],
    ['C4', 3],
    ['E4', 2], ['G4', 1],
    ['C5', 2], ['B4', 1],
    ['A4', 1], ['G4', 1], ['F4', 1],
    ['G4', 3],
    ['A4', 2], ['F4', 1],
    ['E4', 1], ['D4', 1], ['C4', 1],
    ['D4', 2], ['E4', 1],
    ['C4', 3],
  ],
  chords: ['C', 'G', 'C', 'G', 'F', 'G', 'G', 'C', 'C', 'Am', 'F', 'G', 'F', 'C', 'G', 'C'],
  pattern: [0, 2, 1],
  chordNotes: {
    C: ['C3', 'E3', 'G3'],
    G: ['G2', 'B2', 'D3'],
    F: ['F2', 'A2', 'C3'],
    Am: ['A2', 'C3', 'E3'],
    Dm: ['D3', 'F3', 'A3'],
    Em: ['E2', 'G2', 'B2'],
  },
};
