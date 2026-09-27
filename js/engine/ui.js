// The page around the map: the hero strip, the adventure log and the cards.
import { on } from './game-events.js';
import { lifeStatus } from './life.js';
import { fill } from './text.js';
import { seasons } from '../../data/life.js';

export function createUi() {
  const byId = (id) => document.getElementById(id);
  const strip = {
    name: byId('hero-name'),
    level: byId('hero-level'),
    age: byId('hero-age'),
    season: byId('hero-season'),
    status: byId('hero-status'),
  };
  const log = byId('log');
  const card = {
    layer: byId('card-layer'),
    title: byId('card-title'),
    body: byId('card-body'),
    button: byId('card-button'),
  };
  let life = null;

  function showHero() {
    if (!life) return;
    const { hero } = life;
    strip.name.textContent = `${hero.name} ${hero.epithet}`;
    strip.level.textContent = hero.level;
    strip.age.textContent = hero.age;
    strip.season.textContent = seasons[hero.season];
    strip.status.textContent = lifeStatus(life);
  }

  // Newest lines go at the top, so the latest news is always in view.
  function addEntry(entry) {
    const item = document.createElement('li');
    item.className = `log-${entry.kind}`;
    const stamp = document.createElement('span');
    stamp.className = 'stamp';
    stamp.textContent = `${entry.stamp}:`;
    item.append(stamp, ` ${entry.text}`);
    log.prepend(item);
  }

  on('log', ({ entry }) => addEntry(entry));
  for (const name of ['season', 'depart', 'arrive', 'life-end']) on(name, showHero);

  return {
    setLife(next) {
      life = next;
      log.replaceChildren();
      life.log.forEach(addEntry);
      showHero();
    },

    // Shows a card over the log. `text` has a title, body and button, with {words} filled from `values`.
    showCard(text, values, onChoose) {
      card.title.textContent = fill(text.title, values);
      card.body.textContent = fill(text.body, values);
      card.button.textContent = text.button;
      card.button.onclick = () => {
        card.layer.hidden = true;
        onChoose();
      };
      card.layer.hidden = false;
      card.button.focus({ preventScroll: true });
    },
  };
}
