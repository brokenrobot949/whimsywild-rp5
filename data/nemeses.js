// Nemeses: when a monster fells a hero, it can become a nemesis. It gets a name, grows a little
// stronger, and makes its lair at the nearest landmark in that region. Rumors speak of it, and it
// sometimes roams the region looking for trouble. Each region holds at most one nemesis. A nemesis
// that fells another hero grows stronger still. The hero who defeats it avenges everyone it felled,
// and takes the first one's heirloom from their grave. Nemeses belong to the world, so they last
// from hero to hero (but a new dream, in New Game+, starts without any).

export const nemesisSettings = {
  chance: 1,          // the chance a hero's killer becomes a nemesis (if its region has none yet)
  levels: 2,          // a nemesis is this many levels above the level it had when it struck
  strength: 0.1,      // and this much tougher besides (0.1 is 10%)
  growth: 1,          // each further hero it fells makes it this many levels stronger
  aboveHero: 1,       // it never fights below the hero facing it: at least this many levels above them
  roamChance: 0.12,   // when a fight starts in its region, the chance it's the nemesis instead
  showBelow: 3,       // it only shows itself to heroes no more than this many levels below it
  rumorWeight: 2,     // its lair comes up this many times as often in rumors
  keepAvenged: 10,    // how many avenged nemeses the Chronicle remembers
  rewardGold: 4,      // with no heirloom left to recover, the avenger finds gold worth this many fights
  deedPerLevel: 4,    // how grand a deed avenging is: this times the nemesis's level
};

// Names for nemeses. Each is given out once while that nemesis lives.
export const nemesisNames = [
  'Honkwell', 'Grumblewick', 'Old Snaggletooth', 'Mumblepuff', 'Bristleback', 'Sir Squelch',
  'Gnashly', 'Thornbottom', 'Wobblejaw', 'Grimsnout', 'Pickles the Dread', 'Barnaby Blackheart',
  'Mudbelly', 'Old Crookshank', 'Sniffles', 'Gristle', 'Lady Murk', 'Rumbletum', 'Scowlington',
  'Nettlesome', 'Big Agnes', 'The Unpleasant Pip',
];

// Words in rumors, on cards and in the Chronicle. {words} are filled in automatically.
export const nemesisText = {
  title: '{name} the {kind}',            // how a nemesis is named, like "Honkwell the Indignant Goose"
  rumors: [
    '{nemesis}, who felled {victim}, lurks near {place}.',
    'They say {nemesis} still prowls {place}.',
  ],
  rumorNote: 'Nemesis',                  // the badge on a rumor that leads to a nemesis's lair
  chronicleHeading: 'Nemeses',
  felled: 'Felled {victims}. Lurks near {place}.',
  avenged: 'Felled {victims}. Avenged by {hero}.',
  none: 'No nemeses. Long may it last.',
  and: ' and ',                          // between the last two names in a list of victims
};

// Log lines. {nemesis}, {victim}, {a} and {gold} are filled in. Nemesis names are long, so keep
// the rest of each line short (the whole line should stay under about 70 characters).
export const nemesisLines = {
  meet: [
    'faced {nemesis}, who felled {victim}.',
    'was hunted down by {nemesis}.',
  ],
  lair: [
    'found {nemesis} lurking here.',
    'tracked {nemesis} to its lair.',
  ],
  avenged: [
    'avenged {victim}! {nemesis} is no more.',
    'struck down {nemesis} at last.',
  ],
  // Logged at the end of a fallen hero's life, when their killer becomes (or was) a nemesis.
  born: 'was the first to fall to {nemesis}.',
  grew: 'made {nemesis} bolder still.',
  heirloom: 'took back {a} from {victim}\'s grave.',
  noHeirloom: 'found {gold} gold in the lair.',
};
