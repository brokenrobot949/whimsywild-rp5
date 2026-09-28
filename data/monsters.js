// Monsters: the dragon's dreams, leaking into the world.
//
//   name        what the monster is called
//   region      where it lives (from regions.js)
//   sprite      its picture (see art.js)
//   weight      how common it is next to the others in its region (2 is twice as common as 1)
//   stats       its stats at level 1 (combat.js explains what each one does)
//   xp          experience for beating it: 1 is normal, 1.5 is half as much again
//   gold        gold for beating it (optional): 1 is normal, 2 is double
//   meetLines   logged when a fight starts
//   defeatLines logged when the hero wins
//   deathLines  logged, and shown on the end card, when the monster wins
//
// A monster's level is near the hero's, but always within its region's levels (regions.js).
// In the lines, {a} becomes "a Grumpy Badger" and {the} becomes "the Grumpy Badger".
// Keep lines under about 60 characters.

export const monsters = [
  // ---- The Tailwoods ----
  {
    name: 'Grumpy Badger', region: 'tailwoods', weight: 3, xp: 1,
    sprite: { sheet: 'creatures', tile: 178 },
    stats: { maxHp: 20, power: 5, defense: 3, speed: 7, luck: 3 },
    meetLines: ['woke {a}. It was not pleased.', 'was confronted by {a} about the noise.'],
    defeatLines: ['sent {the} back to its sett, grumbling.', 'out-grumped {the}.'],
    deathLines: ['was flattened by {a}.', 'lost a grudge match with {a}.'],
  },
  {
    name: 'Slime Puddle', region: 'tailwoods', weight: 3, xp: 0.8,
    sprite: { sheet: 'dungeon', tile: 108 },
    stats: { maxHp: 14, power: 4, defense: 1, speed: 8, luck: 3 },
    meetLines: ['stepped in {a}. It stepped back.', 'was ambushed by {a} posing as rain.'],
    defeatLines: ['mopped up {the}.', 'evaporated {the} through sheer determination.'],
    deathLines: ['was slowly absorbed by {a}.', 'slipped on {a} and never got up.'],
  },
  {
    name: 'Indignant Goose', region: 'tailwoods', weight: 2, xp: 1,
    sprite: { sheet: 'creatures', tile: 150 },
    stats: { maxHp: 12, power: 5, defense: 1, speed: 11, luck: 6 },
    meetLines: ['was honked at by {a}.', 'made eye contact with {a}. A mistake.'],
    defeatLines: ['out-honked {the}.', 'sent {the} flapping off in a huff.'],
    deathLines: ['was pecked into legend by {a}.', 'was chased off a bridge by {a}.'],
  },
  {
    name: 'Dozy Bumblebee', region: 'tailwoods', weight: 2, xp: 0.8,
    sprite: { sheet: 'creatures', tile: 140 },
    stats: { maxHp: 10, power: 4, defense: 1, speed: 12, luck: 8 },
    meetLines: ['disturbed {a} mid-snooze.', 'was buzzed by {a}, freshly woken.'],
    defeatLines: ['swatted {the} back to sleep.', 'lulled {the} into a deep nap.'],
    deathLines: ['was stung silly by {a}.', 'was buzzed to bits by {a}.'],
  },
  {
    name: 'Truffle Boar', region: 'tailwoods', weight: 1, xp: 1.4,
    sprite: { sheet: 'creatures', tile: 160 },
    stats: { maxHp: 22, power: 6, defense: 3, speed: 7, luck: 3 },
    meetLines: ['was charged by {a} guarding its truffles.', 'stood between {a} and a truffle.'],
    defeatLines: ['toppled {the} and kept the truffle.', 'sent {the} snorting into the bracken.'],
    deathLines: ['was trampled by {a} over a truffle.', 'was gored by {a}. Not worth the truffle.'],
  },
  {
    name: 'Wandering Toadstool', region: 'tailwoods', weight: 2, xp: 1,
    sprite: { sheet: 'creatures', tile: 13 },
    stats: { maxHp: 18, power: 4, defense: 3, speed: 6, luck: 2 },
    meetLines: ['bumped into {a} on its stroll.', 'was blocked by {a}, which would not budge.'],
    defeatLines: ['picked {the} and had it for supper.', 'toppled {the}. Spores everywhere.'],
    deathLines: ['was spored into a stupor by {a}.', 'was befuddled to death by {a}.'],
  },

  // ---- Hindhill Farms: the dragon dreams of hunger ----
  {
    name: 'Angry Turnip', region: 'hindhill', weight: 3, xp: 0.8,
    sprite: { sheet: 'farm', tile: 20 },
    stats: { maxHp: 16, power: 4.5, defense: 2, speed: 9, luck: 3 },
    meetLines: ['was ambushed by {a} from its furrow.', 'pulled up {a}. It pulled back.'],
    defeatLines: ['mashed {the}.', 'put {the} back in the ground.'],
    deathLines: ['was pummelled by {a}.', 'was turned into compost by {a}.'],
  },
  {
    name: 'Belligerent Cabbage', region: 'hindhill', weight: 3, xp: 0.9,
    sprite: { sheet: 'farm', tile: 56 },
    stats: { maxHp: 21, power: 4.5, defense: 4, speed: 6, luck: 2 },
    meetLines: ['was blocked by {a}, leaves bristling.', 'trod on {a}, which took it personally.'],
    defeatLines: ['shredded {the} into coleslaw.', 'peeled {the} down to nothing.'],
    deathLines: ['was smothered by {a}.', 'was outlasted by {a}, leaf by leaf.'],
  },
  {
    name: 'Pie Golem', region: 'hindhill', weight: 2, xp: 1.3,
    sprite: { sheet: 'creatures', tile: 126 },
    stats: { maxHp: 30, power: 7, defense: 4, speed: 5, luck: 2 },
    meetLines: ['smelled {a} before seeing it.', 'was challenged by {a}, still warm.'],
    defeatLines: ['ate {the}. Most of it.', 'cut {the} into generous slices.'],
    deathLines: ['was baked into {a}.', 'was flattened by {a}, crust and all.'],
  },
  {
    name: 'Possessed Scarecrow', region: 'hindhill', weight: 2, xp: 1,
    sprite: { sheet: 'farm', tile: 109 },
    stats: { maxHp: 18, power: 5.5, defense: 3, speed: 8, luck: 7 },
    meetLines: ['noticed {a} had moved. Twice.', 'was stared down by {a}.'],
    defeatLines: ['knocked the stuffing out of {the}.', 'sent {the} back to its pole.'],
    deathLines: ['was scared to death by {a}.', 'was stuffed into a sack by {a}.'],
  },
  {
    name: 'Ravenous Crow', region: 'hindhill', weight: 2, xp: 0.9,
    sprite: { sheet: 'creatures', tile: 136 },
    stats: { maxHp: 14, power: 5.5, defense: 1, speed: 12, luck: 6 },
    meetLines: ['was mobbed by {a} after a sandwich.', 'caught {a} eyeing the rations.'],
    defeatLines: ['shooed {the} off, featherless.', 'out-cawed {the}.'],
    deathLines: ['was pecked to pieces by {a}.', 'lost the last sandwich, and more, to {a}.'],
  },
  {
    name: 'Grain Weevil', region: 'hindhill', weight: 2, xp: 0.8,
    sprite: { sheet: 'creatures', tile: 143 },
    stats: { maxHp: 17, power: 4.5, defense: 3, speed: 8, luck: 3 },
    meetLines: ['stepped on {a}. It did not crunch.', 'found {a} in the grain store.'],
    defeatLines: ['squashed {the} flat.', 'swept {the} out of the barn.'],
    deathLines: ['was nibbled away by {a}.', 'was carried off by {a}, grain by grain.'],
  },

  // ---- The Glittering Flank: the dragon dreams of gold ----
  {
    name: 'Mimic', region: 'flank', weight: 2, xp: 1.4, gold: 2,
    sprite: { sheet: 'dungeon', tile: 92 },
    stats: { maxHp: 23, power: 6.5, defense: 4, speed: 7, luck: 4 },
    meetLines: ['opened a treasure chest. It opened back.', 'reached into {a}, which reached back.'],
    defeatLines: ['emptied {the}, finally.', 'slammed {the} shut for good.'],
    deathLines: ['was swallowed by {a}.', 'was swallowed by {a} pretending to be a smaller one.'],
  },
  {
    name: 'Treasure Goblin', region: 'flank', weight: 3, xp: 0.9, gold: 3,
    sprite: { sheet: 'creatures', tile: 10 },
    stats: { maxHp: 12.5, power: 4, defense: 2, speed: 12, luck: 8 },
    meetLines: ['caught {a} with a sack of coins.', 'was pickpocketed by {a}.'],
    defeatLines: ['emptied the pockets of {the}.', 'sent {the} off, a good deal lighter.'],
    deathLines: ['was robbed blind by {a}.', 'was jingled to death by {a}.'],
  },
  {
    name: 'Goblin Hoarder', region: 'flank', weight: 2, xp: 1.1, gold: 2,
    sprite: { sheet: 'creatures', tile: 11 },
    stats: { maxHp: 21, power: 4.5, defense: 4, speed: 7, luck: 4 },
    meetLines: ['was charged a toll by {a}.', 'found {a} guarding a pile of spoons.'],
    defeatLines: ['broke up the hoard of {the}.', 'paid {the} back in kind.'],
    deathLines: ['was buried under the hoard of {a}.', 'was added to the collection of {a}.'],
  },
  {
    name: 'Gilded Golem', region: 'flank', weight: 2, xp: 1.2,
    sprite: { sheet: 'creatures', tile: 83 },
    stats: { maxHp: 26.5, power: 5, defense: 5, speed: 5, luck: 2 },
    meetLines: ['woke {a}, which glowed indignantly.', 'was blinded by the shine of {a}.'],
    defeatLines: ['melted {the} down.', 'chipped {the} into loose change.'],
    deathLines: ['was flattened by {a}.', 'was gilded, permanently, by {a}.'],
  },
  {
    name: 'Coin-Snatching Magpie', region: 'flank', weight: 2, xp: 0.9, gold: 1.5,
    sprite: { sheet: 'creatures', tile: 130 },
    stats: { maxHp: 11.5, power: 4.5, defense: 2, speed: 13, luck: 8 },
    meetLines: ['was swooped on by {a}.', 'noticed {a} eyeing the gold buttons.'],
    defeatLines: ['won the buttons back from {the}.', 'grounded {the}.'],
    deathLines: ['was pecked apart by {a}.', 'was carried off, coin by coin, by {a}.'],
  },
  {
    name: 'Hoarding Wyrmling', region: 'flank', weight: 1, xp: 1.5, gold: 2,
    sprite: { sheet: 'creatures', tile: 33 },
    stats: { maxHp: 24.5, power: 6.5, defense: 4, speed: 8, luck: 4 },
    meetLines: ['disturbed {a} counting its hoard.', 'stepped on the tail of {a}.'],
    defeatLines: ['sent {the} home to its mother.', 'toppled {the} off its hoard.'],
    deathLines: ['was toasted by {a}.', 'became part of the hoard of {a}.'],
  },

  // ---- The Wingshade Fens: the dragon dreams of being small ----
  {
    name: 'Pompous Bullfrog', region: 'fens', weight: 3, xp: 1,
    sprite: { sheet: 'creatures', tile: 147 },
    stats: { maxHp: 22, power: 6, defense: 3, speed: 7, luck: 4 },
    meetLines: ['was croaked at, deafeningly, by {a}.', 'was mistaken for a fly by {a}.'],
    defeatLines: ['deflated {the} with a well-aimed poke.', 'sent {the} back to its lily pad.'],
    deathLines: ['was swallowed whole by {a}.', 'was mistaken for a fly by {a}, for good.'],
  },
  {
    name: 'Towering Newt', region: 'fens', weight: 3, xp: 0.9,
    sprite: { sheet: 'creatures', tile: 146 },
    stats: { maxHp: 14, power: 5, defense: 2, speed: 11, luck: 5 },
    meetLines: ['was loomed over by {a}.', 'met {a}, which was the size of a barn.'],
    defeatLines: ['tickled {the} until it fled.', 'toppled {the} like a tall tree.'],
    deathLines: ['was trodden on by {a}.', 'was flicked into the bog by {a}.'],
  },
  {
    name: 'Enormous Beetle', region: 'fens', weight: 2, xp: 1.1,
    sprite: { sheet: 'creatures', tile: 137 },
    stats: { maxHp: 24, power: 5, defense: 5, speed: 5, luck: 2 },
    meetLines: ['heard {a} trundle out of the reeds.', 'mistook {a} for a hill. The hill moved.'],
    defeatLines: ['flipped {the} onto its back.', 'cracked the shell of {the}.'],
    deathLines: ['was trundled flat by {a}.', 'was carried off by {a} as a snack for later.'],
  },
  {
    name: 'Stately Snail', region: 'fens', weight: 2, xp: 1.2,
    sprite: { sheet: 'dungeon', tile: 124 },
    stats: { maxHp: 30, power: 5, defense: 5, speed: 3, luck: 3 },
    meetLines: ['was overtaken, very slowly, by {a}.', 'stood in the way of {a}. Eventually.'],
    defeatLines: ['outpaced {the} with ease.', 'sent {the} back into its shell.'],
    deathLines: ['was slimed flat by {a}.', 'stood still too long near {a}.'],
  },
  {
    name: 'Grumbling Snapper', region: 'fens', weight: 2, xp: 1.1,
    sprite: { sheet: 'creatures', tile: 149 },
    stats: { maxHp: 22, power: 6, defense: 5, speed: 6, luck: 3 },
    meetLines: ['stepped on a rock that turned out to be {a}.', 'was snapped at by {a}.'],
    defeatLines: ['sent {the} grumbling into the reeds.', 'out-stubborned {the}.'],
    deathLines: ['was snapped up by {a}.', 'was out-grumbled, and out-snapped, by {a}.'],
  },
  {
    name: 'Grinning Marshgator', region: 'fens', weight: 1, xp: 1.5,
    sprite: { sheet: 'creatures', tile: 148 },
    stats: { maxHp: 26, power: 7, defense: 5, speed: 6, luck: 3 },
    meetLines: ['mistook {a} for a log. It grinned.', 'was grinned at by {a}. Too many teeth.'],
    defeatLines: ['wiped the grin off {the}.', 'tied the jaws of {the} shut with a bootlace.'],
    deathLines: ['was eaten by {a}, still grinning.', 'sat down on {a}, thinking it was a log.'],
  },
];
