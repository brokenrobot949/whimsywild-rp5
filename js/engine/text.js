// Small helpers for text that comes from the data files.

// Replaces {words} in a line with values, e.g. fill('left {town}', { town: 'Tailsend' }).
export function fill(line, values) {
  return line.replace(/\{(\w+)\}/g, (match, key) => (key in values ? String(values[key]) : match));
}

// "Elder Grumpy Badger" → "an Elder Grumpy Badger"
export function withArticle(name) {
  return `${/^[aeiou]/i.test(name) ? 'an' : 'a'} ${name}`;
}

export function capitalize(line) {
  return line.charAt(0).toUpperCase() + line.slice(1);
}
