// Origins: where a hero comes from. Every hero is rolled with one (rerolling changes it).
// An origin gives a small nudge towards one tag (one tag point to start with, which makes
// that tag's skills likelier to be offered) and a starting item.
//
//   id     a short name for the save (keep it the same once players have it)
//   name   shown on the New Hero card and the Hero tab
//   tag    Might, Arcane, Faith, Cunning or Wild
//   item   the starting item: its name, slot (weapon, armor, helm or trinket) and stats at
//          level 1, like the base items in items.js. Heroes starting in a later town get it
//          at their starting level
//   flavor a line shown on the Hero tab

export const origins = [
  // ---- Might ----
  {
    id: 'stable-hand', name: "Knight's Stable Hand", tag: 'Might',
    item: { name: 'Borrowed Helmet', slot: 'helm', stats: { defense: 0.9, maxHp: 2 } },
    flavor: 'Mucked out the stables of great knights, and picked up a few moves.',
  },
  {
    id: 'smith-apprentice', name: "Blacksmith's Apprentice", tag: 'Might',
    item: { name: 'Lopsided Hammer', slot: 'weapon', stats: { power: 1.7 } },
    flavor: 'Made mostly horseshoes. Some of them were even horseshoe-shaped.',
  },
  {
    id: 'bouncer', name: 'Tavern Bouncer', tag: 'Might',
    item: { name: 'Stout Leather Apron', slot: 'armor', stats: { defense: 1, maxHp: 3 } },
    flavor: 'Threw out every troublemaker in town, twice.',
  },

  // ---- Arcane ----
  {
    id: 'fired-apprentice', name: "Wizard's Apprentice (Fired)", tag: 'Arcane',
    item: { name: 'Singed Spellbook', slot: 'trinket', stats: { power: 0.7 } },
    flavor: 'There was an incident with the tower. And the moat. And the cat.',
  },
  {
    id: 'stargazer', name: "Astrologer's Assistant", tag: 'Arcane',
    item: { name: 'Crumpled Star Chart', slot: 'trinket', stats: { luck: 2, power: 0.3 } },
    flavor: 'Counted the stars every night. Got a different answer every time.',
  },
  {
    id: 'alchemist-taster', name: "Alchemist's Taster", tag: 'Arcane',
    item: { name: 'Stained Robe', slot: 'armor', stats: { defense: 0.5, maxHp: 4 } },
    flavor: "Tasted every potion first. Glows faintly in the dark.",
  },

  // ---- Faith ----
  {
    id: 'candle-snuffer', name: 'Temple Candle-Snuffer', tag: 'Faith',
    item: { name: 'Blessed Snuffer', slot: 'weapon', stats: { power: 1.2, defense: 0.5 } },
    flavor: 'Put out ten thousand candles. Never once burned a finger.',
  },
  {
    id: 'lost-pilgrim', name: 'Pilgrim Who Got Lost', tag: 'Faith',
    item: { name: 'Very Long Scarf', slot: 'armor', stats: { defense: 0.4, maxHp: 5 } },
    flavor: 'Set out for a holy mountain. Found several unholy ones first.',
  },
  {
    id: 'bell-ringer', name: 'Bell-Ringer', tag: 'Faith',
    item: { name: 'Tiny Bronze Bell', slot: 'trinket', stats: { defense: 0.4, maxHp: 2 } },
    flavor: 'Rang the bells every morning. The whole valley is grateful it stopped.',
  },

  // ---- Cunning ----
  {
    id: 'failed-bard', name: 'Failed Bard', tag: 'Cunning',
    item: { name: 'Out-of-Tune Lute', slot: 'trinket', stats: { luck: 2, speed: 0.3 } },
    flavor: 'Knows every song ever written, and none of them all the way through.',
  },
  {
    id: 'reformed-pickpocket', name: 'Reformed Pickpocket', tag: 'Cunning',
    item: { name: 'Borrowed Dagger', slot: 'weapon', stats: { power: 1.1, luck: 2 } },
    flavor: 'Entirely reformed. Mostly reformed. Reformed on Sundays.',
  },
  {
    id: 'card-sharp', name: 'Card Sharp', tag: 'Cunning',
    item: { name: 'Marked Deck of Cards', slot: 'trinket', stats: { luck: 3 } },
    flavor: 'Never lost a game of cards, and never quite explained why.',
  },

  // ---- Wild ----
  {
    id: 'turnip-farmer', name: 'Turnip Farmer', tag: 'Wild',
    item: { name: 'Sturdy Pitchfork', slot: 'weapon', stats: { power: 1.3, speed: 0.5 } },
    flavor: 'Grew the second-largest turnip in the county, and is still bitter about it.',
  },
  {
    id: 'goat-herder', name: 'Goat Herder', tag: 'Wild',
    item: { name: 'Goat-Hair Cloak', slot: 'armor', stats: { defense: 0.6, maxHp: 4 } },
    flavor: 'Understands goats, which is more than most people can say.',
  },
  {
    id: 'beekeeper', name: 'Beekeeper', tag: 'Wild',
    item: { name: "Beekeeper's Veil", slot: 'helm', stats: { defense: 0.3, maxHp: 3 } },
    flavor: 'Has been stung so often that bees now simply apologize.',
  },
];
