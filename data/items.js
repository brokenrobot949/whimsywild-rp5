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
  // Treasures: one of a kind, each with a name of its own and something special about it (see
  // data/treasures.js). Never dropped or sold in shops; heroes find them in particular places.
  //   keepWorth  when a hero compares it with other gear, it counts as this many times as good,
  //              so heroes hold on to their treasures for a good while
  {
    id: 'treasure', name: 'Treasure', dropWeight: 0, shopWeight: 0, strength: 3, color: '#a07800',
    prefixes: [], keepWorth: 1.5,
  },
];

// How much each stat point counts when the hero compares two items. Shop prices use it too.
export const statWorth = { power: 3, defense: 2, maxHp: 0.5, speed: 3, luck: 1 };

// How stats are named in item descriptions.
export const statNames = { power: 'power', defense: 'defense', maxHp: 'HP', speed: 'speed', luck: 'luck' };

// Each item level adds this share of the item's level-1 HP, power and defense.
// Speed and luck grow only with rarity, not with level.
export const itemGrowth = 0.17;

// Base items. The stats are for a Common item at level 1. Each slot has three items for each tag.
//   tag  the kind of hero it suits: Might, Arcane, Faith, Cunning or Wild.
// To keep items fair, keep a new item's stats near the others in its slot. Adding up each stat
// times its worth (statWorth above): weapons come to about 5, armor about 3.5, helms about 2.3
// and trinkets about 2. Speed and luck don't grow with level, so items made mostly of them
// matter most early on.
export const baseItems = [
  // Weapons
  { name: 'Cudgel', slot: 'weapon', tag: 'Might', stats: { power: 1.6 } },
  { name: 'Short Sword', slot: 'weapon', tag: 'Might', stats: { power: 1.4, defense: 0.3 } },
  { name: "Woodcutter's Axe", slot: 'weapon', tag: 'Might', stats: { power: 1.5, maxHp: 1 } },
  { name: 'Walking Staff', slot: 'weapon', tag: 'Arcane', stats: { power: 1.2, maxHp: 3 } },
  { name: 'Wand of Mild Sparks', slot: 'weapon', tag: 'Arcane', stats: { power: 1.3, luck: 1 } },
  { name: 'Crystal-Tipped Rod', slot: 'weapon', tag: 'Arcane', stats: { power: 1.4, maxHp: 1 } },
  { name: 'Candlestick', slot: 'weapon', tag: 'Faith', stats: { power: 1.2, defense: 0.5 } },
  { name: 'Bell-Mace', slot: 'weapon', tag: 'Faith', stats: { power: 1.3, defense: 0.4 } },
  { name: "Shepherd's Crook", slot: 'weapon', tag: 'Faith', stats: { power: 1.1, maxHp: 3 } },
  { name: 'Dagger', slot: 'weapon', tag: 'Cunning', stats: { power: 1.1, luck: 2 } },
  { name: 'Sword-Cane', slot: 'weapon', tag: 'Cunning', stats: { power: 1.2, speed: 0.4 } },
  { name: 'Slingshot', slot: 'weapon', tag: 'Cunning', stats: { power: 1, luck: 1, speed: 0.3 } },
  { name: 'Pitchfork', slot: 'weapon', tag: 'Wild', stats: { power: 1.3, speed: 0.5 } },
  { name: 'Hunting Bow', slot: 'weapon', tag: 'Wild', stats: { power: 1.4, speed: 0.2 } },
  { name: 'Garden Sickle', slot: 'weapon', tag: 'Wild', stats: { power: 1.3, luck: 1 } },

  // Armor
  { name: 'Chainmail Vest', slot: 'armor', tag: 'Might', stats: { defense: 1.2, maxHp: 2 } },
  { name: 'Dented Breastplate', slot: 'armor', tag: 'Might', stats: { defense: 1.4, maxHp: 1 } },
  { name: 'Padded Gambeson', slot: 'armor', tag: 'Might', stats: { defense: 1, maxHp: 3 } },
  { name: 'Wizard Robe', slot: 'armor', tag: 'Arcane', stats: { defense: 0.5, maxHp: 3, luck: 1 } },
  { name: 'Starry Mantle', slot: 'armor', tag: 'Arcane', stats: { defense: 0.5, maxHp: 2, luck: 1.5 } },
  { name: "Alchemist's Apron", slot: 'armor', tag: 'Arcane', stats: { defense: 0.7, maxHp: 3, luck: 0.5 } },
  { name: "Pilgrim's Cloak", slot: 'armor', tag: 'Faith', stats: { defense: 0.7, maxHp: 5 } },
  { name: 'Woolen Habit', slot: 'armor', tag: 'Faith', stats: { defense: 0.6, maxHp: 5 } },
  { name: 'Embroidered Vestments', slot: 'armor', tag: 'Faith', stats: { defense: 0.8, maxHp: 4 } },
  { name: 'Leather Jerkin', slot: 'armor', tag: 'Cunning', stats: { defense: 0.8, speed: 0.5 } },
  { name: 'Shadowy Cloak', slot: 'armor', tag: 'Cunning', stats: { defense: 0.6, speed: 0.5, luck: 0.5 } },
  { name: 'Patched Waistcoat', slot: 'armor', tag: 'Cunning', stats: { defense: 0.7, maxHp: 1, luck: 1.5 } },
  { name: 'Mossy Tunic', slot: 'armor', tag: 'Wild', stats: { defense: 0.6, maxHp: 4 } },
  { name: 'Bark Mail', slot: 'armor', tag: 'Wild', stats: { defense: 1, maxHp: 2 } },
  { name: 'Fur-Lined Coat', slot: 'armor', tag: 'Wild', stats: { defense: 0.5, maxHp: 5 } },

  // Helms
  { name: 'Tin Pot Helm', slot: 'helm', tag: 'Might', stats: { defense: 0.8, maxHp: 1 } },
  { name: 'Horned Helmet', slot: 'helm', tag: 'Might', stats: { defense: 0.9, maxHp: 0.5 } },
  { name: 'Kettle Hat', slot: 'helm', tag: 'Might', stats: { defense: 1 } },
  { name: 'Pointy Hat', slot: 'helm', tag: 'Arcane', stats: { defense: 0.3, luck: 2 } },
  { name: 'Thinking Cap', slot: 'helm', tag: 'Arcane', stats: { defense: 0.2, maxHp: 2, luck: 1 } },
  { name: 'Circlet of Mild Insight', slot: 'helm', tag: 'Arcane', stats: { defense: 0.2, power: 0.3, luck: 1 } },
  { name: 'Humble Hood', slot: 'helm', tag: 'Faith', stats: { defense: 0.4, maxHp: 3 } },
  { name: 'Halo-Shaped Hat', slot: 'helm', tag: 'Faith', stats: { defense: 0.5, maxHp: 2.5 } },
  { name: "Monk's Cowl", slot: 'helm', tag: 'Faith', stats: { defense: 0.4, maxHp: 2, luck: 0.5 } },
  { name: 'Feathered Cap', slot: 'helm', tag: 'Cunning', stats: { defense: 0.3, luck: 1, speed: 0.3 } },
  { name: 'Rakish Eyepatch', slot: 'helm', tag: 'Cunning', stats: { luck: 1.5, speed: 0.3 } },
  { name: 'Masked Hood', slot: 'helm', tag: 'Cunning', stats: { defense: 0.3, speed: 0.5 } },
  { name: 'Straw Hat', slot: 'helm', tag: 'Wild', stats: { defense: 0.3, maxHp: 3 } },
  { name: 'Antler Crown', slot: 'helm', tag: 'Wild', stats: { defense: 0.5, maxHp: 2, luck: 0.3 } },
  { name: 'Flower Wreath', slot: 'helm', tag: 'Wild', stats: { maxHp: 3, luck: 1 } },

  // Trinkets
  { name: 'Iron Ring', slot: 'trinket', tag: 'Might', stats: { power: 0.4, defense: 0.3 } },
  { name: 'Whetstone', slot: 'trinket', tag: 'Might', stats: { power: 0.6 } },
  { name: "Champion's Medal", slot: 'trinket', tag: 'Might', stats: { defense: 0.4, maxHp: 2 } },
  { name: 'Glowing Marble', slot: 'trinket', tag: 'Arcane', stats: { power: 0.6 } },
  { name: 'Bottled Thundercloud', slot: 'trinket', tag: 'Arcane', stats: { power: 0.5, luck: 0.5 } },
  { name: "Wizard's Spare Spectacles", slot: 'trinket', tag: 'Arcane', stats: { power: 0.3, luck: 1 } },
  { name: 'Holy Pebble', slot: 'trinket', tag: 'Faith', stats: { defense: 0.4, maxHp: 2 } },
  { name: 'Prayer Beads', slot: 'trinket', tag: 'Faith', stats: { defense: 0.2, maxHp: 3 } },
  { name: "Saint's Thimble", slot: 'trinket', tag: 'Faith', stats: { defense: 0.6, luck: 0.5 } },
  { name: 'Lucky Button', slot: 'trinket', tag: 'Cunning', stats: { luck: 3 } },
  { name: 'Loaded Dice', slot: 'trinket', tag: 'Cunning', stats: { luck: 2.5 } },
  { name: 'Pocket Watch', slot: 'trinket', tag: 'Cunning', stats: { defense: 0.4, speed: 0.3 } },
  { name: 'Acorn Charm', slot: 'trinket', tag: 'Wild', stats: { maxHp: 4 } },
  { name: 'Bird Whistle', slot: 'trinket', tag: 'Wild', stats: { speed: 0.2, maxHp: 2.5 } },
  { name: "Rabbit's Foot", slot: 'trinket', tag: 'Wild', stats: { luck: 1, maxHp: 2 } },
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
