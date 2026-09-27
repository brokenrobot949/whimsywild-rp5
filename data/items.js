// Gear, gold and potions.
// All numbers are starting values to tune during Phase 1 playtests.

// The four gear slots. `empty` shows when the hero has nothing in that slot.
export const slots = [
  { id: 'weapon', name: 'Weapon', empty: 'No weapon' },
  { id: 'armor', name: 'Armor', empty: 'No armor' },
  { id: 'helm', name: 'Helm', empty: 'No helm' },
  { id: 'trinket', name: 'Trinket', empty: 'No trinket' },
];

// Rarities, from most to least common.
//   dropWeight  how often monsters drop this rarity, compared with the others
//   shopWeight  how often shops stock it (0 means never)
//   strength    multiplies the item's stats
//   color       the color of its name
//   prefixes    one is picked for the item's name, like "Mildly Enchanted Cudgel"
export const rarities = [
  {
    id: 'common', name: 'Common', dropWeight: 60, shopWeight: 70, strength: 1, color: '#6b6158',
    prefixes: ['Plain', 'Sturdy', 'Secondhand', 'Slightly Bent', 'Well-Worn'],
  },
  {
    id: 'uncommon', name: 'Uncommon', dropWeight: 25, shopWeight: 30, strength: 1.3, color: '#3d7a28',
    prefixes: ['Polished', 'Well-Oiled', 'Mildly Enchanted', 'Rather Fine'],
  },
  {
    id: 'rare', name: 'Rare', dropWeight: 10, shopWeight: 10, strength: 1.7, color: '#2f63b0',
    prefixes: ['Gleaming', 'Humming', 'Masterwork', 'Rather Magical'],
  },
  {
    id: 'epic', name: 'Epic', dropWeight: 4, shopWeight: 0, strength: 2.2, color: '#7b3fb0',
    prefixes: ['Heroic', 'Glorious', 'Radiant', 'Suspiciously Powerful'],
  },
  {
    id: 'legendary', name: 'Legendary', dropWeight: 1, shopWeight: 0, strength: 3, color: '#b8580f',
    prefixes: ['Legendary', 'Fabled', 'Mythic', 'Dragon-Kissed'],
  },
];

// How much each stat point counts when the hero compares two items. Shop prices use it too.
export const statWorth = { power: 3, defense: 2, maxHp: 0.5, speed: 3, luck: 1 };

// How stats are named in item descriptions.
export const statNames = { power: 'power', defense: 'defense', maxHp: 'HP', speed: 'speed', luck: 'luck' };

// Each item level adds this share of the item's level-1 HP, power and defense.
// Speed and luck grow only with rarity, not with level.
export const itemGrowth = 0.17;

// Base items. The stats are for a Common item at level 1.
//   tag  the kind of hero it suits: Might, Arcane, Faith, Cunning or Wild.
//        (Heroes will favor their own tags once skills arrive.)
export const baseItems = [
  { name: 'Cudgel', slot: 'weapon', tag: 'Might', stats: { power: 1.6 } },
  { name: 'Short Sword', slot: 'weapon', tag: 'Might', stats: { power: 1.4, defense: 0.3 } },
  { name: 'Walking Staff', slot: 'weapon', tag: 'Arcane', stats: { power: 1.2, maxHp: 3 } },
  { name: 'Candlestick', slot: 'weapon', tag: 'Faith', stats: { power: 1.2, defense: 0.5 } },
  { name: 'Dagger', slot: 'weapon', tag: 'Cunning', stats: { power: 1.1, luck: 2 } },
  { name: 'Pitchfork', slot: 'weapon', tag: 'Wild', stats: { power: 1.3, speed: 0.5 } },

  { name: 'Chainmail Vest', slot: 'armor', tag: 'Might', stats: { defense: 1.2, maxHp: 2 } },
  { name: 'Wizard Robe', slot: 'armor', tag: 'Arcane', stats: { defense: 0.5, maxHp: 3, luck: 1 } },
  { name: "Pilgrim's Cloak", slot: 'armor', tag: 'Faith', stats: { defense: 0.7, maxHp: 5 } },
  { name: 'Leather Jerkin', slot: 'armor', tag: 'Cunning', stats: { defense: 0.8, speed: 0.5 } },
  { name: 'Mossy Tunic', slot: 'armor', tag: 'Wild', stats: { defense: 0.6, maxHp: 4 } },

  { name: 'Tin Pot Helm', slot: 'helm', tag: 'Might', stats: { defense: 0.8, maxHp: 1 } },
  { name: 'Pointy Hat', slot: 'helm', tag: 'Arcane', stats: { defense: 0.3, luck: 2 } },
  { name: 'Humble Hood', slot: 'helm', tag: 'Faith', stats: { defense: 0.4, maxHp: 3 } },
  { name: 'Feathered Cap', slot: 'helm', tag: 'Cunning', stats: { defense: 0.3, luck: 1, speed: 0.3 } },
  { name: 'Straw Hat', slot: 'helm', tag: 'Wild', stats: { defense: 0.3, maxHp: 3 } },

  { name: 'Iron Ring', slot: 'trinket', tag: 'Might', stats: { power: 0.4, defense: 0.3 } },
  { name: 'Glowing Marble', slot: 'trinket', tag: 'Arcane', stats: { power: 0.6 } },
  { name: 'Holy Pebble', slot: 'trinket', tag: 'Faith', stats: { defense: 0.4, maxHp: 2 } },
  { name: 'Lucky Button', slot: 'trinket', tag: 'Cunning', stats: { luck: 3 } },
  { name: 'Acorn Charm', slot: 'trinket', tag: 'Wild', stats: { maxHp: 4 } },
];

export const loot = {
  dropChance: 0.3,        // chance a beaten monster drops an item
  potionDropChance: 0.1,  // chance a beaten monster drops a healing potion
  goldPerMonsterLevel: 3, // gold from a win = this × the monster's level × between 0.5 and 1.5
  priceFactor: 4,         // shop price = the item's worth (from statWorth) × this
  sellShare: 0.25,        // items the hero doesn't keep are sold for this share of their price
};

export const potions = {
  start: 1,         // potions each hero sets out with
  carry: 5,         // the most potions a hero will carry
  heals: 0.4,       // share of max HP a potion restores
  drinkBelow: 0.3,  // drunk in a fight when HP is below this share of max HP
  pricePerLevel: 8, // price in town = this × the hero's level
};

// Log lines. {a} is an item, like "a Mildly Enchanted Cudgel". {town} is the town.
// Keep lines under about 45 characters plus the item name.
export const lootLines = {
  found: ['found {a} and put it on at once.', 'claimed {a} from the fallen foe.', 'looted {a}. A clear improvement.'],
  bought: ['bought {a} in {town}.', 'splurged on {a} in {town}.'],
  potionsBought: ['stocked up on healing potions in {town}.', 'bought a few potions in {town}, just in case.'],
  drank: ['gulped down a healing potion mid-fight.', 'drank a potion. It tasted faintly of turnips.', 'swigged a potion and felt much better.'],
};
