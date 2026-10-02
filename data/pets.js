// Pets: small animals a hero can adopt, through a rare story event in each region (see the "Pets"
// events in events.js). A pet follows its hero on the map, joins in fights now and then, and
// helps in a small way besides. A hero has at most one pet.
//
// When the hero retires, the pet retires with them. When the hero falls, the pet waits by their
// grave, and the next hero to pay their respects there takes it in.
//
//   id       a short name for the save (keep it the same once players have it)
//   kind     what it is, like "Squirrel Kit"
//   sprite   its picture (see art.js)
//   effects  how it helps, like a skill's effects (see skills.js)
//   help     in fights: every `every` seconds it strikes for `strike` times the hero's blow
//   verb     what it does when it strikes, on the fight card: "Biscuit nipped for 4"
//   flavor   a line about it, for the Hero tab

export const petSettings = {
  firstHelp: 0.2, // the pet's first strike in a fight comes after this share of its usual wait
};

export const pets = [
  {
    id: 'squirrel-kit', kind: 'Squirrel Kit', sprite: { sheet: 'creatures', tile: 175 },
    effects: { potionFind: 0.05 }, help: { every: 3, strike: 0.25 }, verb: 'nipped',
    flavor: 'Buries things for later. Sometimes the things are potions.',
  },
  {
    id: 'lamb', kind: 'Lamb', sprite: { sheet: 'creatures', tile: 153 },
    effects: { healing: 0.2 }, help: { every: 3.5, strike: 0.25 }, verb: 'headbutted',
    flavor: 'Warm, woolly and very good at naps. Everyone rests better near a lamb.',
  },
  {
    id: 'fox-kit', kind: 'Fox Kit', sprite: { sheet: 'creatures', tile: 169 },
    effects: { gold: 0.1 }, help: { every: 3, strike: 0.25 }, verb: 'snapped',
    flavor: 'Has a nose for anything shiny, and pockets it before anyone notices.',
  },
  {
    id: 'otter-pup', kind: 'Otter Pup', sprite: { sheet: 'creatures', tile: 176 },
    effects: { potionHealing: 0.15 }, help: { every: 3, strike: 0.25 }, verb: 'splashed',
    flavor: 'Always finds the freshest water, and insists on sharing it.',
  },
  {
    id: 'mountain-kid', kind: 'Mountain Kid', sprite: { sheet: 'creatures', tile: 152 },
    effects: { travelSpeed: 0.1 }, help: { every: 3, strike: 0.3 }, verb: 'butted',
    flavor: 'A young goat who knows every shortcut, and takes all of them.',
  },
  {
    id: 'wolf-pup', kind: 'Wolf Pup', sprite: { sheet: 'creatures', tile: 142 },
    effects: { boost: { power: 0.04 } }, help: { every: 2.5, strike: 0.3 }, verb: 'bit',
    flavor: 'Fierce, loyal and about the size of a loaf of bread.',
  },
  {
    id: 'owlet', kind: 'Owlet', sprite: { sheet: 'creatures', tile: 131 },
    effects: { xp: 0.08 }, help: { every: 3, strike: 0.25 }, verb: 'swooped',
    flavor: 'Watches everything with enormous eyes, and seems to remember it all.',
  },
];

// Names for pets. The hero picks one at random when they adopt.
export const petNames = [
  'Biscuit', 'Pudding', 'Sir Wiggles', 'Turnip', 'Mabel', 'Crumpet', 'Pickle', 'Bramble', 'Nutmeg',
  'Waffles', 'Mister Socks', 'Dumpling', 'Clover', 'Fig', 'Hobnob', 'Muffin', 'Pip', 'Button',
  'Lady Fluff', 'Bean', 'Toffee', 'Chestnut', 'Old Tom', 'Sprout',
];

// Words on the Hero tab, the fight card and elsewhere. {pet} is like "Biscuit the Lamb".
export const petText = {
  title: '{name} the {kind}',
  heroTab: 'Companion',
  helps: 'Joins in fights every {every} seconds.',
  hit: '{name} {verb} for {damage}',  // on the fight card
  missed: '{name} {verb}, and missed',
  hall: 'With {pet}.',                // on the Hall of Champions card
};

// Log lines. {pet} is like "Biscuit the Lamb" and {name} just "Biscuit".
export const petLines = {
  adopted: ['was adopted by {pet}.', 'gained a companion: {pet}.'],
  // A fallen hero's pet, taken in by the hero who pays respects at the grave. {fallen} is the fallen
  // hero's first name.
  fromGrave: ['found {pet} still waiting by {fallen}\'s grave, and took them in.'],
  retired: 'settled down with {pet} at their side.',
  waits: '{name} would not leave their side.', // logged when the hero falls
};
