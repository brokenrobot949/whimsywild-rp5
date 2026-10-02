// Pets: small animals that follow a hero (see data/pets.js). A hero's pet is saved with them as
// { id, name }, where `id` is the kind of pet in pets.js. Adopting, fighting and graves are in life.js.
import { pets, petNames, petText } from '../../data/pets.js';
import { sheets } from '../../data/art.js';
import { checkEffects } from './skills.js';
import { fill } from './text.js';

// Check the data once at startup, so a typo shows a clear message.
const seen = new Set();
for (const pet of pets) {
  const owner = `The pet "${pet.kind ?? pet.id}" in data/pets.js`;
  if (!pet.id || seen.has(pet.id)) throw new Error(`${owner} needs an id that no other pet uses.`);
  seen.add(pet.id);
  if (!pet.kind || !pet.verb || !pet.flavor) throw new Error(`${owner} needs a kind, a verb and a flavor line.`);
  if (!sheets[pet.sprite?.sheet] || !Number.isInteger(pet.sprite?.tile)) throw new Error(`${owner} needs a sprite with a sheet from art.js and a tile number.`);
  if (!(pet.help?.every > 0) || !(pet.help?.strike > 0)) throw new Error(`${owner} needs help: { every, strike }, both above 0.`);
  checkEffects(pet.effects ?? {}, owner);
}
if (petNames.length === 0) throw new Error('data/pets.js needs at least one name in petNames.');

// The kind of pet (from pets.js) a hero's pet is, or null if it has none (or it's been removed).
export function petKind(pet) {
  return (pet && pets.find((kind) => kind.id === pet.id)) ?? null;
}

// A newly adopted pet of the given kind, with a name.
export function newPet(rng, id) {
  return { id, name: rng.pick(petNames) };
}

// "Biscuit the Lamb"
export function petTitle(pet) {
  return fill(petText.title, { name: pet.name, kind: petKind(pet)?.kind ?? '' });
}
