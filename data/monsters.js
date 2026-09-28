// Monsters: the dragon's dreams, leaking into the world.
//
//   name        what the monster is called
//   region      where it lives (from regions.js)
//   family      what sort of creature it is (from `families` below); some quirks care
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

// Families of monster, and how they're named in descriptions like "+30% damage against plants".
export const families = {
  beast: 'beasts', bird: 'birds', bug: 'bugs', plant: 'plants', slime: 'slimes',
  construct: 'constructs', goblin: 'goblins', reptile: 'reptiles', amphibian: 'amphibians',
  spirit: 'spirits', undead: 'the undead', dragon: 'dragons', giant: 'giants',
};

export const monsters = [
  // ---- The Tailwoods ----
  {
    name: 'Grumpy Badger', region: 'tailwoods', family: 'beast', weight: 3, xp: 1,
    sprite: { sheet: 'creatures', tile: 178 },
    stats: { maxHp: 20, power: 5, defense: 3, speed: 7, luck: 3 },
    meetLines: ['woke {a}. It was not pleased.', 'was confronted by {a} about the noise.'],
    defeatLines: ['sent {the} back to its sett, grumbling.', 'out-grumped {the}.'],
    deathLines: ['was flattened by {a}.', 'lost a grudge match with {a}.'],
  },
  {
    name: 'Slime Puddle', region: 'tailwoods', family: 'slime', weight: 3, xp: 0.8,
    sprite: { sheet: 'dungeon', tile: 108 },
    stats: { maxHp: 14, power: 4, defense: 1, speed: 8, luck: 3 },
    meetLines: ['stepped in {a}. It stepped back.', 'was ambushed by {a} posing as rain.'],
    defeatLines: ['mopped up {the}.', 'evaporated {the} through sheer determination.'],
    deathLines: ['was slowly absorbed by {a}.', 'slipped on {a} and never got up.'],
  },
  {
    name: 'Indignant Goose', region: 'tailwoods', family: 'bird', weight: 2, xp: 1,
    sprite: { sheet: 'creatures', tile: 150 },
    stats: { maxHp: 12, power: 5, defense: 1, speed: 11, luck: 6 },
    meetLines: ['was honked at by {a}.', 'made eye contact with {a}. A mistake.'],
    defeatLines: ['out-honked {the}.', 'sent {the} flapping off in a huff.'],
    deathLines: ['was pecked into legend by {a}.', 'was chased off a bridge by {a}.'],
  },
  {
    name: 'Dozy Bumblebee', region: 'tailwoods', family: 'bug', weight: 2, xp: 0.8,
    sprite: { sheet: 'creatures', tile: 140 },
    stats: { maxHp: 10, power: 4, defense: 1, speed: 12, luck: 8 },
    meetLines: ['disturbed {a} mid-snooze.', 'was buzzed by {a}, freshly woken.'],
    defeatLines: ['swatted {the} back to sleep.', 'lulled {the} into a deep nap.'],
    deathLines: ['was stung silly by {a}.', 'was buzzed to bits by {a}.'],
  },
  {
    name: 'Truffle Boar', region: 'tailwoods', family: 'beast', weight: 1, xp: 1.4,
    sprite: { sheet: 'creatures', tile: 160 },
    stats: { maxHp: 22, power: 6, defense: 3, speed: 7, luck: 3 },
    meetLines: ['was charged by {a} guarding its truffles.', 'stood between {a} and a truffle.'],
    defeatLines: ['toppled {the} and kept the truffle.', 'sent {the} snorting into the bracken.'],
    deathLines: ['was trampled by {a} over a truffle.', 'was gored by {a}. Not worth the truffle.'],
  },
  {
    name: 'Wandering Toadstool', region: 'tailwoods', family: 'plant', weight: 2, xp: 1,
    sprite: { sheet: 'creatures', tile: 13 },
    stats: { maxHp: 18, power: 4, defense: 3, speed: 6, luck: 2 },
    meetLines: ['bumped into {a} on its stroll.', 'was blocked by {a}, which would not budge.'],
    defeatLines: ['picked {the} and had it for supper.', 'toppled {the}. Spores everywhere.'],
    deathLines: ['was spored into a stupor by {a}.', 'was befuddled to death by {a}.'],
  },

  // ---- Hindhill Farms: the dragon dreams of hunger ----
  {
    name: 'Angry Turnip', region: 'hindhill', family: 'plant', weight: 3, xp: 0.8,
    sprite: { sheet: 'farm', tile: 20 },
    stats: { maxHp: 16, power: 4.5, defense: 2, speed: 9, luck: 3 },
    meetLines: ['was ambushed by {a} from its furrow.', 'pulled up {a}. It pulled back.'],
    defeatLines: ['mashed {the}.', 'put {the} back in the ground.'],
    deathLines: ['was pummelled by {a}.', 'was turned into compost by {a}.'],
  },
  {
    name: 'Belligerent Cabbage', region: 'hindhill', family: 'plant', weight: 3, xp: 0.9,
    sprite: { sheet: 'farm', tile: 56 },
    stats: { maxHp: 21, power: 4.5, defense: 4, speed: 6, luck: 2 },
    meetLines: ['was blocked by {a}, leaves bristling.', 'trod on {a}, which took it personally.'],
    defeatLines: ['shredded {the} into coleslaw.', 'peeled {the} down to nothing.'],
    deathLines: ['was smothered by {a}.', 'was outlasted by {a}, leaf by leaf.'],
  },
  {
    name: 'Pie Golem', region: 'hindhill', family: 'construct', weight: 2, xp: 1.3,
    sprite: { sheet: 'creatures', tile: 126 },
    stats: { maxHp: 30, power: 7, defense: 4, speed: 5, luck: 2 },
    meetLines: ['smelled {a} before seeing it.', 'was challenged by {a}, still warm.'],
    defeatLines: ['ate {the}. Most of it.', 'cut {the} into generous slices.'],
    deathLines: ['was baked into {a}.', 'was flattened by {a}, crust and all.'],
  },
  {
    name: 'Possessed Scarecrow', region: 'hindhill', family: 'construct', weight: 2, xp: 1,
    sprite: { sheet: 'farm', tile: 109 },
    stats: { maxHp: 18, power: 5.5, defense: 3, speed: 8, luck: 7 },
    meetLines: ['noticed {a} had moved. Twice.', 'was stared down by {a}.'],
    defeatLines: ['knocked the stuffing out of {the}.', 'sent {the} back to its pole.'],
    deathLines: ['was scared to death by {a}.', 'was stuffed into a sack by {a}.'],
  },
  {
    name: 'Ravenous Crow', region: 'hindhill', family: 'bird', weight: 2, xp: 0.9,
    sprite: { sheet: 'creatures', tile: 136 },
    stats: { maxHp: 14, power: 5.5, defense: 1, speed: 12, luck: 6 },
    meetLines: ['was mobbed by {a} after a sandwich.', 'caught {a} eyeing the rations.'],
    defeatLines: ['shooed {the} off, featherless.', 'out-cawed {the}.'],
    deathLines: ['was pecked to pieces by {a}.', 'lost the last sandwich, and more, to {a}.'],
  },
  {
    name: 'Grain Weevil', region: 'hindhill', family: 'bug', weight: 2, xp: 0.8,
    sprite: { sheet: 'creatures', tile: 143 },
    stats: { maxHp: 17, power: 4.5, defense: 3, speed: 8, luck: 3 },
    meetLines: ['stepped on {a}. It did not crunch.', 'found {a} in the grain store.'],
    defeatLines: ['squashed {the} flat.', 'swept {the} out of the barn.'],
    deathLines: ['was nibbled away by {a}.', 'was carried off by {a}, grain by grain.'],
  },

  // ---- The Glittering Flank: the dragon dreams of gold ----
  {
    name: 'Mimic', region: 'flank', family: 'construct', weight: 2, xp: 1.4, gold: 2,
    sprite: { sheet: 'dungeon', tile: 92 },
    stats: { maxHp: 23, power: 6.5, defense: 4, speed: 7, luck: 4 },
    meetLines: ['opened a treasure chest. It opened back.', 'reached into {a}, which reached back.'],
    defeatLines: ['emptied {the}, finally.', 'slammed {the} shut for good.'],
    deathLines: ['was swallowed by {a}.', 'was swallowed by {a} pretending to be a smaller one.'],
  },
  {
    name: 'Treasure Goblin', region: 'flank', family: 'goblin', weight: 3, xp: 0.9, gold: 3,
    sprite: { sheet: 'creatures', tile: 10 },
    stats: { maxHp: 12.5, power: 4, defense: 2, speed: 12, luck: 8 },
    meetLines: ['caught {a} with a sack of coins.', 'was pickpocketed by {a}.'],
    defeatLines: ['emptied the pockets of {the}.', 'sent {the} off, a good deal lighter.'],
    deathLines: ['was robbed blind by {a}.', 'was jingled to death by {a}.'],
  },
  {
    name: 'Goblin Hoarder', region: 'flank', family: 'goblin', weight: 2, xp: 1.1, gold: 2,
    sprite: { sheet: 'creatures', tile: 11 },
    stats: { maxHp: 21, power: 4.5, defense: 4, speed: 7, luck: 4 },
    meetLines: ['was charged a toll by {a}.', 'found {a} guarding a pile of spoons.'],
    defeatLines: ['broke up the hoard of {the}.', 'paid {the} back in kind.'],
    deathLines: ['was buried under the hoard of {a}.', 'was added to the collection of {a}.'],
  },
  {
    name: 'Gilded Golem', region: 'flank', family: 'construct', weight: 2, xp: 1.2,
    sprite: { sheet: 'creatures', tile: 83 },
    stats: { maxHp: 26.5, power: 5, defense: 5, speed: 5, luck: 2 },
    meetLines: ['woke {a}, which glowed indignantly.', 'was blinded by the shine of {a}.'],
    defeatLines: ['melted {the} down.', 'chipped {the} into loose change.'],
    deathLines: ['was flattened by {a}.', 'was gilded, permanently, by {a}.'],
  },
  {
    name: 'Coin-Snatching Magpie', region: 'flank', family: 'bird', weight: 2, xp: 0.9, gold: 1.5,
    sprite: { sheet: 'creatures', tile: 130 },
    stats: { maxHp: 11.5, power: 4.5, defense: 2, speed: 13, luck: 8 },
    meetLines: ['was swooped on by {a}.', 'noticed {a} eyeing the gold buttons.'],
    defeatLines: ['won the buttons back from {the}.', 'grounded {the}.'],
    deathLines: ['was pecked apart by {a}.', 'was carried off, coin by coin, by {a}.'],
  },
  {
    name: 'Hoarding Wyrmling', region: 'flank', family: 'reptile', weight: 1, xp: 1.5, gold: 2,
    sprite: { sheet: 'creatures', tile: 33 },
    stats: { maxHp: 24.5, power: 6.5, defense: 4, speed: 8, luck: 4 },
    meetLines: ['disturbed {a} counting its hoard.', 'stepped on the tail of {a}.'],
    defeatLines: ['sent {the} home to its mother.', 'toppled {the} off its hoard.'],
    deathLines: ['was toasted by {a}.', 'became part of the hoard of {a}.'],
  },

  // ---- The Wingshade Fens: the dragon dreams of being small ----
  {
    name: 'Pompous Bullfrog', region: 'fens', family: 'amphibian', weight: 3, xp: 1,
    sprite: { sheet: 'creatures', tile: 147 },
    stats: { maxHp: 22, power: 6, defense: 3, speed: 7, luck: 4 },
    meetLines: ['was croaked at, deafeningly, by {a}.', 'was mistaken for a fly by {a}.'],
    defeatLines: ['deflated {the} with a well-aimed poke.', 'sent {the} back to its lily pad.'],
    deathLines: ['was swallowed whole by {a}.', 'was mistaken for a fly by {a}, for good.'],
  },
  {
    name: 'Towering Newt', region: 'fens', family: 'amphibian', weight: 3, xp: 0.9,
    sprite: { sheet: 'creatures', tile: 146 },
    stats: { maxHp: 14, power: 5, defense: 2, speed: 11, luck: 5 },
    meetLines: ['was loomed over by {a}.', 'met {a}, which was the size of a barn.'],
    defeatLines: ['tickled {the} until it fled.', 'toppled {the} like a tall tree.'],
    deathLines: ['was trodden on by {a}.', 'was flicked into the bog by {a}.'],
  },
  {
    name: 'Enormous Beetle', region: 'fens', family: 'bug', weight: 2, xp: 1.1,
    sprite: { sheet: 'creatures', tile: 137 },
    stats: { maxHp: 24, power: 5, defense: 5, speed: 5, luck: 2 },
    meetLines: ['heard {a} trundle out of the reeds.', 'mistook {a} for a hill. The hill moved.'],
    defeatLines: ['flipped {the} onto its back.', 'cracked the shell of {the}.'],
    deathLines: ['was trundled flat by {a}.', 'was carried off by {a} as a snack for later.'],
  },
  {
    name: 'Stately Snail', region: 'fens', family: 'bug', weight: 2, xp: 1.2,
    sprite: { sheet: 'dungeon', tile: 124 },
    stats: { maxHp: 30, power: 5, defense: 5, speed: 3, luck: 3 },
    meetLines: ['was overtaken, very slowly, by {a}.', 'stood in the way of {a}. Eventually.'],
    defeatLines: ['outpaced {the} with ease.', 'sent {the} back into its shell.'],
    deathLines: ['was slimed flat by {a}.', 'stood still too long near {a}.'],
  },
  {
    name: 'Grumbling Snapper', region: 'fens', family: 'reptile', weight: 2, xp: 1.1,
    sprite: { sheet: 'creatures', tile: 149 },
    stats: { maxHp: 22, power: 6, defense: 5, speed: 6, luck: 3 },
    meetLines: ['stepped on a rock that turned out to be {a}.', 'was snapped at by {a}.'],
    defeatLines: ['sent {the} grumbling into the reeds.', 'out-stubborned {the}.'],
    deathLines: ['was snapped up by {a}.', 'was out-grumbled, and out-snapped, by {a}.'],
  },
  {
    name: 'Grinning Marshgator', region: 'fens', family: 'reptile', weight: 1, xp: 1.5,
    sprite: { sheet: 'creatures', tile: 148 },
    stats: { maxHp: 26, power: 7, defense: 5, speed: 6, luck: 3 },
    meetLines: ['mistook {a} for a log. It grinned.', 'was grinned at by {a}. Too many teeth.'],
    defeatLines: ['wiped the grin off {the}.', 'tied the jaws of {the} shut with a bootlace.'],
    deathLines: ['was eaten by {a}, still grinning.', 'sat down on {a}, thinking it was a log.'],
  },

  // ---- The Spine Peaks: the dragon dreams of knights ----
  {
    name: 'Rusted Knight', region: 'spine', family: 'construct', weight: 3, xp: 1,
    sprite: { sheet: 'creatures', tile: 128 },
    stats: { maxHp: 24, power: 5.5, defense: 5, speed: 6, luck: 3 },
    meetLines: ['was challenged to a duel by {a}, clanking.', 'heard {a} demand a joust.'],
    defeatLines: ['knocked the helmet off {the}. Nobody inside.', 'sent {the} rattling down the mountain.'],
    deathLines: ['was run through by {a}.', 'lost a joust to {a}, fair and square.'],
  },
  {
    name: 'Ghostly Dragon-Hunter', region: 'spine', family: 'spirit', weight: 2, xp: 1.2,
    sprite: { sheet: 'creatures', tile: 4 },
    stats: { maxHp: 22, power: 6, defense: 3, speed: 7, luck: 5 },
    meetLines: ['met {a}, still hunting something huge.', 'was mistaken for a dragon by {a}.'],
    defeatLines: ['laid {the} to rest at last.', 'told {the} the hunt was over.'],
    deathLines: ['was hunted down by {a}.', 'was mistaken for a dragon by {a}, fatally.'],
  },
  {
    name: 'Mountain Griffin', region: 'spine', family: 'bird', weight: 2, xp: 1.1,
    sprite: { sheet: 'creatures', tile: 105 },
    stats: { maxHp: 22, power: 6, defense: 3, speed: 9, luck: 5 },
    meetLines: ['was swooped on by {a}.', 'disturbed the nest of {a}.'],
    defeatLines: ['sent {the} squawking over the peaks.', 'plucked a fine feather from {the}.'],
    deathLines: ['was carried off by {a}.', 'was dropped from a great height by {a}.'],
  },
  {
    name: 'Stone Sentinel', region: 'spine', family: 'construct', weight: 2, xp: 1.2,
    sprite: { sheet: 'creatures', tile: 127 },
    stats: { maxHp: 30, power: 5, defense: 6, speed: 4, luck: 2 },
    meetLines: ['woke {a} guarding the pass.', 'was ordered to halt by {a}.'],
    defeatLines: ['crumbled {the} into gravel.', 'got past {the} at last.'],
    deathLines: ['was flattened by {a}.', 'was ordered to halt by {a}, for good.'],
  },
  {
    name: 'Grumbling Yeti', region: 'spine', family: 'beast', weight: 2, xp: 1,
    sprite: { sheet: 'creatures', tile: 43 },
    stats: { maxHp: 26, power: 6, defense: 3, speed: 6, luck: 3 },
    meetLines: ['was grumbled at by {a}.', 'found {a} hogging the path.'],
    defeatLines: ['sent {the} back to its cave, grumbling.', 'out-grumbled {the}.'],
    deathLines: ['was sat on by {a}.', 'was hugged far too hard by {a}.'],
  },
  {
    name: 'Iron-Antlered Stag', region: 'spine', family: 'beast', weight: 1, xp: 1.3,
    sprite: { sheet: 'creatures', tile: 161 },
    stats: { maxHp: 24, power: 7, defense: 4, speed: 8, luck: 4 },
    meetLines: ['faced {a}, antlers lowered.', 'heard {a} ring its antlers like bells.'],
    defeatLines: ['broke an antler off {the}.', 'sent {the} bounding away.'],
    deathLines: ['was tossed off a cliff by {a}.', 'was run down by {a}.'],
  },

  // ---- The Clawlands: the dragon dreams of an ancient war ----
  {
    name: 'Phantom Soldier', region: 'claws', family: 'spirit', weight: 3, xp: 1,
    sprite: { sheet: 'creatures', tile: 47 },
    stats: { maxHp: 22, power: 5.5, defense: 4, speed: 7, luck: 3 },
    meetLines: ['was ordered to fall in by {a}.', 'saw {a} still marching to war.'],
    defeatLines: ['dismissed {the}. The war is over.', 'sent {the} home at last.'],
    deathLines: ['was cut down by {a}.', 'was drafted by {a}, forever.'],
  },
  {
    name: 'Skeleton Archer', region: 'claws', family: 'undead', weight: 2, xp: 1,
    sprite: { sheet: 'creatures', tile: 1 },
    stats: { maxHp: 18, power: 6, defense: 2, speed: 8, luck: 6 },
    meetLines: ['was shot at by {a}. It missed, at first.', 'dodged the first arrow from {a}.'],
    defeatLines: ['scattered the bones of {the}.', 'snapped the bow of {the}.'],
    deathLines: ['was feathered with arrows by {a}.', 'caught one arrow too many from {a}.'],
  },
  {
    name: 'Buried Legionnaire', region: 'claws', family: 'undead', weight: 2, xp: 1.1,
    sprite: { sheet: 'creatures', tile: 95 },
    stats: { maxHp: 26, power: 5.5, defense: 5, speed: 5, luck: 3 },
    meetLines: ['watched {a} dig itself out.', 'was saluted by {a}, then attacked.'],
    defeatLines: ['reburied {the}, with honors.', 'dismissed {the} from service.'],
    deathLines: ['was dragged under by {a}.', 'was outlasted by {a}.'],
  },
  {
    name: 'Siege Ogre', region: 'claws', family: 'giant', weight: 2, xp: 1.3,
    sprite: { sheet: 'creatures', tile: 125 },
    stats: { maxHp: 30, power: 6, defense: 4, speed: 4, luck: 2 },
    meetLines: ['saw {a} carrying a battering ram.', 'was mistaken for a castle gate by {a}.'],
    defeatLines: ['toppled {the} like a siege tower.', 'sent {the} off to find another war.'],
    deathLines: ['was battered flat by {a}.', 'was knocked down like a gate by {a}.'],
  },
  {
    name: 'Nightmare Charger', region: 'claws', family: 'spirit', weight: 1, xp: 1.3,
    sprite: { sheet: 'creatures', tile: 54 },
    stats: { maxHp: 24, power: 6, defense: 3, speed: 10, luck: 4 },
    meetLines: ['heard hooves, then saw {a}.', 'was charged by {a}.'],
    defeatLines: ['broke the charge of {the}.', 'banished {the} back to its bad dream.'],
    deathLines: ['was trampled by {a}.', 'was run down by {a}.'],
  },
  {
    name: 'War Drake', region: 'claws', family: 'dragon', weight: 1, xp: 1.5,
    sprite: { sheet: 'creatures', tile: 32 },
    stats: { maxHp: 28, power: 7, defense: 5, speed: 7, luck: 4 },
    meetLines: ['was roared at by {a}.', 'saw {a} circling overhead.'],
    defeatLines: ['grounded {the} for good.', 'sent {the} limping off the battlefield.'],
    deathLines: ['was scorched by {a}.', 'was carried off by {a}.'],
  },

  // ---- Smokecrown: the dragon dreams of loneliness (opens in Act 3) ----
  {
    name: 'Lonely Echo', region: 'smokecrown', family: 'spirit', weight: 3, xp: 1,
    sprite: { sheet: 'creatures', tile: 48 },
    stats: { maxHp: 20.6, power: 6.2, defense: 2, speed: 10, luck: 6 },
    meetLines: ['heard {a} repeat their name back to them.', 'was followed by {a}, saying everything twice.'],
    defeatLines: ['quieted {the} at last. At last.', 'had the last word with {the}.'],
    deathLines: ['was talked into the ground by {a}.', 'was echoed out of the world by {a}.'],
  },
  {
    name: 'Forgotten Doll', region: 'smokecrown', family: 'construct', weight: 2, xp: 1.1,
    sprite: { sheet: 'creatures', tile: 118 },
    stats: { maxHp: 22.7, power: 6.2, defense: 4, speed: 7, luck: 4 },
    meetLines: ['found {a} sitting alone, waiting to be played with.', 'was asked to play by {a}. Forever.'],
    defeatLines: ['tucked {the} into a box, gently.', 'put {the} to bed at last.'],
    deathLines: ['was hugged far too tightly by {a}.', 'was made to play forever by {a}.'],
  },
  {
    name: 'Fading Shade', region: 'smokecrown', family: 'spirit', weight: 2, xp: 1,
    sprite: { sheet: 'creatures', tile: 86 },
    stats: { maxHp: 18.5, power: 6.7, defense: 2, speed: 9, luck: 7 },
    meetLines: ['saw {a} flicker at the edge of the smoke.', 'was brushed by {a}, cold as a lost memory.'],
    defeatLines: ['remembered {the} for a moment, and it faded happily.', 'let {the} drift off into the smoke.'],
    deathLines: ['was forgotten, along with {a}.', 'faded into the smoke with {a}.'],
  },
  {
    name: 'Ember Wisp', region: 'smokecrown', family: 'spirit', weight: 2, xp: 1,
    sprite: { sheet: 'creatures', tile: 45 },
    stats: { maxHp: 16.5, power: 7.2, defense: 2, speed: 11, luck: 5 },
    meetLines: ['was singed by {a} drifting up from a vent.', 'saw {a} dancing over the lava.'],
    defeatLines: ['snuffed out {the}.', 'blew out {the} like a birthday candle.'],
    deathLines: ['was burned to a crisp by {a}.', 'was set alight by {a}.'],
  },
  {
    name: 'Weeping Gargoyle', region: 'smokecrown', family: 'construct', weight: 1, xp: 1.3,
    sprite: { sheet: 'creatures', tile: 69 },
    stats: { maxHp: 30.9, power: 6.2, defense: 6, speed: 4, luck: 2 },
    meetLines: ['disturbed {a} crying on an empty roof.', 'was pounced on by {a}, lonely for company.'],
    defeatLines: ['crumbled {the} back into gravel.', 'sent {the} back to its roof, still sniffling.'],
    deathLines: ['was crushed under {a}.', 'was sat on, sadly, by {a}.'],
  },
  {
    name: 'Ash Wyrm', region: 'smokecrown', family: 'dragon', weight: 1, xp: 1.5,
    sprite: { sheet: 'creatures', tile: 111 },
    stats: { maxHp: 28.8, power: 7.2, defense: 5, speed: 7, luck: 4 },
    meetLines: ['saw {a} rise out of the ash.', 'was coughed at by {a}.'],
    defeatLines: ['sent {the} slithering back under the ash.', 'buried {the} in its own ash.'],
    deathLines: ['was smothered in ash by {a}.', 'was swallowed whole by {a}.'],
  },

  // ---- Castle bosses ----
  // Each holds one castle (see castles.js), and never wanders the land. Bosses are fought
  // only once they're reached, in the castle's last room. Extra fields:
  //   boss        true: this monster only appears as a castle's boss
  //   properName  true for a name like "Baron Goldtooth", used without "a" or "the"
  //   special     the boss's special move, used every so often instead of a plain blow:
  //                 name   shown on the fight card
  //                 every  seconds between uses (the first comes about halfway through that)
  //                 strike damage, where 1 is a plain blow (and 2 is double)
  //                 hits   how many blows it lands (optional)
  //                 stun   seconds the hero loses before their next blow (optional)
  //                 drain  share of the damage the boss heals (optional; 0.5 is half)
  //                 heal   share of max HP the boss heals, instead of striking (optional)
  //                 when   for a heal: only below this share of max HP (0.6 is 60%)
  {
    name: 'Old Grizzlewick', region: 'tailwoods', family: 'beast', boss: true, properName: true, xp: 5, gold: 3,
    sprite: { sheet: 'creatures', tile: 163 },
    stats: { maxHp: 72, power: 7.7, defense: 4, speed: 6, luck: 3 },
    special: { name: 'Mighty Yawn', every: 5, strike: 0.6, stun: 3 },
    meetLines: ['woke Old Grizzlewick. Nobody wakes Old Grizzlewick.'],
    defeatLines: ['sent Old Grizzlewick back to sleep, for good this time.', 'out-snored Old Grizzlewick.'],
    deathLines: ['was sat on by Old Grizzlewick.', 'was yawned at, then flattened, by Old Grizzlewick.'],
  },
  {
    name: 'Glutton Lord', region: 'hindhill', family: 'giant', boss: true, xp: 5, gold: 3,
    sprite: { sheet: 'creatures', tile: 44 },
    stats: { maxHp: 78, power: 9.4, defense: 4, speed: 5, luck: 2 },
    special: { name: 'Second Helping', every: 6, heal: 0.15, when: 0.7 },
    meetLines: ['interrupted {the} at dinner.'],
    defeatLines: ['toppled {the} from his banquet table.', 'left {the} with an empty plate at last.'],
    deathLines: ['was eaten by {a}. It was bound to happen.', 'became the last course for {a}.'],
  },
  {
    name: 'Baron Goldtooth', region: 'flank', family: 'goblin', boss: true, properName: true, xp: 5, gold: 5,
    sprite: { sheet: 'creatures', tile: 96 },
    stats: { maxHp: 68, power: 8.3, defense: 4, speed: 8, luck: 6 },
    special: { name: 'Coin Barrage', every: 5, strike: 0.6, hits: 3 },
    meetLines: ['was charged a toll by Baron Goldtooth.'],
    defeatLines: ['knocked the gold tooth out of Baron Goldtooth.', 'foreclosed on Baron Goldtooth.'],
    deathLines: ['was buried in coins by Baron Goldtooth.', 'was taxed to death by Baron Goldtooth.'],
  },
  {
    name: 'Mossmother', region: 'fens', family: 'plant', boss: true, xp: 5, gold: 3,
    sprite: { sheet: 'creatures', tile: 7 },
    stats: { maxHp: 81, power: 8.3, defense: 5, speed: 6, luck: 3 },
    special: { name: 'Deep Roots', every: 5, strike: 1.4, drain: 0.6 },
    meetLines: ['was tangled up by {the}.'],
    defeatLines: ['pulled {the} up by the roots.', 'weeded out {the}.'],
    deathLines: ['was wrapped in moss by {the}.', 'became part of the bog, courtesy of {the}.'],
  },
  {
    name: 'Sir Grimsby the Unyielding', region: 'spine', family: 'undead', boss: true, properName: true, xp: 5, gold: 3,
    sprite: { sheet: 'creatures', tile: 15 },
    stats: { maxHp: 75, power: 9.9, defense: 6, speed: 6, luck: 4 },
    special: { name: 'Thundering Charge', every: 6, strike: 2.4 },
    meetLines: ['was challenged to a duel by Sir Grimsby.'],
    defeatLines: ['made Sir Grimsby yield at last.', 'knocked Sir Grimsby off his high horse.'],
    deathLines: ['was unhorsed for good by Sir Grimsby.', 'lost the duel to Sir Grimsby the Unyielding.'],
  },
  {
    name: 'Bone Marshal', region: 'claws', family: 'undead', boss: true, xp: 5, gold: 3,
    sprite: { sheet: 'creatures', tile: 2 },
    stats: { maxHp: 86, power: 9.9, defense: 5, speed: 7, luck: 4 },
    special: { name: 'Charge of the Dead', every: 6, strike: 1.6, stun: 1.5 },
    meetLines: ['was saluted by {the}, then attacked.'],
    defeatLines: ['discharged {the} from the ancient war.', 'sounded the retreat for {the}.'],
    deathLines: ['was drafted into the dead army by {the}.', 'fell in the last charge of {the}.'],
  },
  {
    name: 'Forgotten King', region: 'smokecrown', family: 'spirit', boss: true, xp: 5, gold: 3,
    sprite: { sheet: 'creatures', tile: 28 },
    stats: { maxHp: 86, power: 9.9, defense: 5, speed: 6, luck: 4 },
    special: { name: 'Lonely Wail', every: 6, strike: 0.9, hits: 2, stun: 1.5 },
    meetLines: ['was greeted by {the}: "At last, a visitor."'],
    defeatLines: ['told {the} his own name. He smiled, and faded.', 'sat with {the} until he slept.'],
    deathLines: ['was kept by {the}, for company.', 'was forgotten, alongside {the}.'],
  },

  // ---- The finale ----
  // Met only at the end of the Deepest Nightmare (see finale.js). `song: true` means the hero
  // sings a verse of the lullaby each time it loses a share of its HP, and beating it finishes
  // the song and the story.
  {
    name: 'Nightmare', region: 'smokecrown', family: 'dragon', boss: true, song: true, xp: 0,
    sprite: { sheet: 'creatures', tile: 75 },
    stats: { maxHp: 112, power: 9, defense: 5, speed: 6, luck: 4 },
    special: { name: 'Bad Dream', every: 6, strike: 1.5, stun: 1.5 },
    meetLines: ['faced the Nightmare itself.'],
    defeatLines: ['sang the Nightmare to sleep.'],
    deathLines: ['was lost in the Nightmare, halfway through a verse.', 'fell silent in the Nightmare.'],
  },
];
