// Graves: where heroes fell. A hero who dies leaves a tombstone on the map, with their best
// item left beside it as an heirloom. The first later hero to pass close by pays respects
// and takes the heirloom, remade for their own level (the same item, just as strong for them
// as it was for its first owner). The tombstone stays on the map afterward.

export const graveSettings = {
  keep: 30,         // the map keeps this many graves; the oldest go first
  respectRange: 3,  // a hero walking within this many tiles of a grave with an heirloom pays respects
  sprite: { sheet: 'dungeon', tile: 64 }, // the tombstone (see art.js)
  labelZoom: 32,    // the fallen hero's name shows under the tombstone at this zoom and closer
};

// ---- Log lines ----
// Names and items can be long, so keep the fixed words in each line short (about 30
// characters). Words in {braces} are filled in automatically:
//   {fallen}  the fallen hero's first name and epithet, like "Maude the Pie-Eater"
//   {the}     the heirloom, like "the Humming Dagger"
export const graveLines = {
  // Passing a grave with an heirloom.
  respects: [
    'paid respects at the grave of {fallen}.',
    'left a daisy at the grave of {fallen}.',
    'stood a while at the grave of {fallen}.',
  ],
  // Then, when the heirloom is better than what the hero has.
  kept: [
    'took up {the} as an heirloom.',
    'promised to carry {the} with honor.',
  ],
  // Or, when it isn't: the hero sells it on at the next market.
  sold: [
    'took {the} to sell at the next market.',
    'carried off {the} to fund the quest.',
  ],
};
