// The bottom tabs, and the Hero, Chronicle and Hall of Champions screens.
// (The Adventure screen is in ui.js.)
import { on } from './game-events.js';
import { lifeStatus } from './life.js';
import { rarityOf, itemStatsText } from './items.js';
import { tagInfo, skillChip, classById, classPath, skillByName, describeEffects, quirkById } from './skills.js';
import { originById } from './background.js';
import { dreamById } from './dreams.js';
import { dreamText } from '../../data/dreams.js';
import { mentorText, mentorSettings } from '../../data/mentors.js';
import { residentsOf } from './mentors.js';
import { shardById } from './shards.js';
import { shards, shardText } from '../../data/shards.js';
import { conquestOf, bossTitle } from './castles.js';
import { castleText } from '../../data/castles.js';
import { currentAct, actInfo, verseById, isSealed } from './story.js';
import { storyText } from '../../data/story.js';
import { finaleText } from '../../data/finale.js';
import { verses, verseText, verseSettings } from '../../data/verses.js';
import { regions } from '../../data/regions.js';
import { chronicleStats } from './records.js';
import { revealedShare } from './fog.js';
import { logLine } from './ui.js';
import { picture, TILE } from './art.js';
import { fill, capitalize } from './text.js';
import { slots, statNames } from '../../data/items.js';
import { tags, skillPicks } from '../../data/skills.js';
import { classes, evolutions } from '../../data/classes.js';
import { heroSprite } from '../../data/art.js';
import { heroTabText, hallText, chronicleText } from '../../data/records.js';

const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V'];
const STAT_ORDER = ['power', 'defense', 'speed', 'luck'];

// Events that change what the Hero tab shows.
const HERO_EVENTS = ['season', 'arrive', 'fight-end', 'level-up', 'equip', 'choice-made', 'potion', 'shop', 'epithet'];

export function createScreens({ art, world, getLife, getLives }) {
  const panels = {
    adventure: document.getElementById('panel-adventure'),
    hero: document.getElementById('panel-hero'),
    chronicle: document.getElementById('panel-chronicle'),
    hall: document.getElementById('panel-hall'),
  };
  const buttons = [...document.querySelectorAll('#tabs [data-tab]')];
  let active = 'adventure';
  let openLog = null; // the Hall entry whose log is open, if any

  function show(name) {
    active = name;
    document.body.dataset.tab = name;
    for (const [key, panel] of Object.entries(panels)) panel.hidden = key !== name;
    for (const button of buttons) {
      if (button.dataset.tab === name) button.setAttribute('aria-current', 'page');
      else button.removeAttribute('aria-current');
    }
    if (name !== 'hall') openLog = null;
    render();
  }

  function render() {
    if (active === 'hero') renderHero();
    else if (active === 'chronicle') renderChronicle();
    else if (active === 'hall') renderHall();
  }

  // ---- Hero ----

  function renderHero() {
    const life = getLife();
    if (!life) return;
    const { hero } = life;
    const panel = panels.hero;
    const scroll = panel.scrollTop;
    panel.replaceChildren();

    const heroClass = hero.class ? classById(hero.class) : null;
    const header = element('div', 'hero-card');
    header.append(portrait(heroClass ? heroClass.sprite : heroSprite));
    const who = element('div');
    who.append(
      element('h2', '', `${hero.name} ${hero.epithet}`),
      element('div', '', `${heroClass ? `${heroClass.name} · ` : ''}Level ${hero.level} · Age ${hero.age}`),
      element('div', 'muted', lifeStatus(life)),
    );
    header.append(who);
    panel.append(header);

    // Stats
    panel.append(element('h3', '', heroTabText.stats));
    const stats = element('dl', 'stat-grid');
    const addStat = (label, value) => stats.append(element('dt', '', label), element('dd', '', value));
    const maxHp = Math.ceil(hero.stats.maxHp);
    addStat(statNames.maxHp, `${Math.min(Math.ceil(hero.hp), maxHp)} / ${maxHp}`);
    for (const stat of STAT_ORDER) addStat(capitalize(statNames[stat]), Number(hero.stats[stat].toFixed(1)));
    addStat(heroTabText.gold, hero.gold.toLocaleString());
    addStat(heroTabText.potions, hero.potions);
    panel.append(stats);

    // Origin and quirk
    const origin = originById(hero.origin);
    const quirk = quirkById(hero.quirk);
    if (origin || quirk) {
      panel.append(element('h3', '', heroTabText.background));
      const list = element('ul', 'plain-list');
      if (origin) {
        const tag = tagInfo(origin.tag);
        const chip = element('span', 'tag-chip', tag.id);
        chip.style.background = tag.color;
        const item = element('li');
        item.append(element('b', '', origin.name), ' ', chip, element('div', 'flavor', origin.flavor));
        list.append(item);
      }
      if (quirk) {
        const item = element('li');
        item.append(element('b', '', `${quirk.name}. `), quirk.about, element('div', 'muted', describeEffects(quirk.effects)));
        list.append(item);
      }
      panel.append(list);
    }

    // What the starting town's mentors passed on
    if (hero.mentors.length > 0) {
      panel.append(element('h3', '', mentorText.heroTab));
      const list = element('ul', 'plain-list');
      for (const mentor of hero.mentors) {
        const item = element('li');
        item.append(element('b', '', `${mentor.name}: `), mentor.text ?? '');
        list.append(item);
      }
      panel.append(list);
    }

    // Tonight's dream
    const dream = dreamById(hero.dream);
    if (dream) {
      panel.append(element('h3', '', dreamText.label));
      const line = element('p');
      line.append(element('b', '', `${dream.name}. `), dream.text);
      if (dream.effects) line.append(element('div', 'muted', describeEffects(dream.effects)));
      panel.append(line);
    }

    // Class path
    panel.append(element('h3', '', heroTabText.path));
    const path = element('ul', 'plain-list');
    const taken = classPath(hero);
    for (const step of evolutions) {
      const chosen = taken.find((option) => option.tier === step.tier);
      const offered = classes.some((option) => option.tier === step.tier);
      const item = element('li');
      item.append(element('b', '', `Level ${step.level}: `));
      if (chosen) {
        item.append(`${chosen.name}. `, element('span', 'muted', `${chosen.perk.name}: ${describeEffects(chosen.perk.effects)}`));
      } else {
        item.append(offered && hero.level < step.level ? heroTabText.notYet : heroTabText.unknown);
      }
      path.append(item);
    }
    panel.append(path);

    // Blessings from story events, while they last
    if (hero.blessings.length > 0) {
      panel.append(element('h3', '', heroTabText.blessings));
      const list = element('ul', 'plain-list');
      for (const blessing of hero.blessings) {
        const item = element('li');
        item.append(element('b', '', `${blessing.name}. `), describeEffects(blessing.effects));
        item.append(element('div', 'muted', fill(heroTabText.blessingLeft, { seasons: blessing.until - life.seasonsPassed })));
        list.append(item);
      }
      panel.append(list);
    }

    // Tags
    panel.append(element('h3', '', heroTabText.tags));
    const tagList = element('ul', 'tag-bars');
    const most = Math.max(1, ...Object.values(hero.tags));
    for (const tag of tags) {
      const row = element('li');
      const bar = element('div', 'bar');
      const amount = element('div', 'fill');
      amount.style.width = `${(hero.tags[tag.id] / most) * 100}%`;
      amount.style.background = tag.color;
      bar.append(amount);
      row.append(element('span', 'tag-name', tag.id), bar, element('span', 'tag-count', hero.tags[tag.id]));
      tagList.append(row);
    }
    panel.append(tagList);

    // Skills
    panel.append(element('h3', '', heroTabText.skills));
    const known = Object.entries(hero.skills).filter(([name]) => skillByName(name));
    if (known.length === 0) {
      panel.append(element('p', 'muted', fill(heroTabText.noSkills, { level: skillPicks.everyLevels })));
    } else {
      const list = element('ul', 'plain-list');
      for (const [name, rank] of known) {
        const skill = skillByName(name);
        const tag = skillChip(skill);
        const item = element('li');
        const chip = element('span', 'tag-chip', tag.id);
        chip.style.background = tag.color;
        item.append(element('b', '', `${name} ${ROMAN[rank] ?? rank}`), ' ', chip);
        item.append(element('div', '', describeEffects(skill.ranks[rank - 1])));
        item.append(element('div', 'flavor', skill.flavor));
        list.append(item);
      }
      panel.append(list);
    }

    // Gear
    panel.append(element('h3', '', heroTabText.gear));
    const gear = element('ul', 'plain-list');
    for (const slot of slots) {
      const item = hero.gear[slot.id];
      const row = element('li');
      row.append(element('span', 'slot-name', `${slot.name}: `));
      if (item) {
        const name = element('b', '', item.name);
        name.style.color = rarityOf(item).color;
        row.append(name, element('div', 'muted', `${rarityOf(item).name}, level ${item.level}. ${capitalize(itemStatsText(item))}`));
      } else {
        row.append(element('span', 'muted', slot.empty));
      }
      gear.append(row);
    }
    panel.append(gear);
    panel.scrollTop = scroll;
  }

  // A hero or class picture, drawn crisp at a larger size.
  function portrait(sprite) {
    const canvas = document.createElement('canvas');
    canvas.width = TILE;
    canvas.height = TILE;
    canvas.className = 'portrait';
    const look = picture(art, sprite.sheet, sprite.tile, 'A portrait');
    canvas.getContext('2d').drawImage(look.image, look.sx, look.sy, TILE, TILE, 0, 0, TILE, TILE);
    return canvas;
  }

  // ---- Chronicle ----

  function renderChronicle() {
    const panel = panels.chronicle;
    const lives = getLives();
    panel.replaceChildren(element('h2', '', chronicleText.title));
    const list = element('dl', 'chronicle');
    const add = (label, value) => list.append(element('dt', '', label), element('dd', '', value));
    const counted = (entry) => (entry ? fill(chronicleText.countValue, entry) : chronicleText.none);
    const towns = world.places.filter((place) => place.kind === 'town');
    const act = currentAct(world);
    add(storyText.chronicleAct, world.finale ? fill(finaleText.chronicleDone, { name: world.finale.hero, epithet: world.finale.epithet, age: world.finale.age }) : fill(storyText.actValue, actInfo(act)));
    add(chronicleText.mapRevealed, `${Math.floor(revealedShare(world) * 100)}%`);
    add(chronicleText.townsFound, fill(chronicleText.townsValue, {
      found: towns.filter((town) => world.discovered.has(town.name)).length,
      total: towns.length,
    }));
    panel.append(list);
    if (lives.length === 0) {
      panel.append(element('p', 'muted', chronicleText.empty));
      return;
    }
    const stats = chronicleStats(lives);
    add(chronicleText.heroes, stats.heroes.toLocaleString());
    add(chronicleText.years, stats.years.toLocaleString());
    add(chronicleText.monsters, stats.monstersSlain.toLocaleString());
    add(chronicleText.gold, stats.goldFound.toLocaleString());
    add(chronicleText.retired, stats.retired.toLocaleString());
    add(chronicleText.fell, stats.fell.toLocaleString());
    add(chronicleText.heirlooms, fill(chronicleText.heirloomsValue, {
      waiting: world.graves.filter((grave) => grave.heirloom && !grave.claimedBy).length,
      claimed: world.graves.filter((grave) => grave.claimedBy).length,
    }));
    add(chronicleText.cause, counted(stats.commonCause));
    add(chronicleText.commonClass, counted(stats.commonClass));
    add(chronicleText.longest, fill(chronicleText.longestValue, stats.longest));
    add(chronicleText.highest, fill(chronicleText.highestValue, stats.highest));
    // The retired heroes of each town: the newest are its mentors, the rest residents.
    for (const town of towns) {
      const residents = residentsOf(world, town.name);
      if (residents.length === 0) continue;
      const shown = residents.slice(0, mentorSettings.gifts).map((mentor) => `${mentor.name} ${mentor.epithet}`);
      const more = residents.length - shown.length;
      if (more > 0) shown.push(fill(mentorText.residents[more === 1 ? 0 : 1], { count: more }));
      add(fill(mentorText.chronicle, { town: town.name }), shown.join(', '));
    }

    // Monster castles: who holds each one that's been found, or who conquered it.
    const castles = world.places.filter((place) => place.kind === 'castle' && !isSealed(world, place.region));
    panel.append(element('h3', '', fill(castleText.chronicleHeading, { conquered: world.conquered.length, total: castles.length })));
    const castleList = element('ul', 'plain-list');
    for (const castle of castles.filter((place) => world.discovered.has(place.name))) {
      const conquest = conquestOf(world, castle.name);
      const item = element('li');
      item.append(
        element('b', '', castle.name),
        element('div', 'muted', conquest ? fill(castleText.conquered, conquest) : fill(castleText.held, { boss: bossTitle(castle) })),
      );
      castleList.append(item);
    }
    const hidden = castles.filter((place) => !world.discovered.has(place.name)).length;
    if (hidden > 0) castleList.append(element('li', 'muted', hidden === 1 ? castleText.hiddenOne : fill(castleText.hidden, { count: hidden })));
    panel.append(castleList);

    // The lullaby, once it's known: the verses found so far, with their words.
    if (act >= verseSettings.findFromAct) {
      panel.append(element('h3', '', fill(verseText.heading, { found: world.verses.length, total: verses.length })));
      const song = element('ul', 'plain-list verse-list');
      for (const found of world.verses) {
        const verse = verseById(found.id);
        const place = world.places.find((option) => option.name === verse.place);
        const item = element('li');
        const words = element('div', 'verse-words');
        for (const line of verse.lines) words.append(element('div', '', line));
        item.append(
          element('b', '', verse.title),
          words,
          element('div', 'muted', fill(verseText.foundBy, { place: place?.logName ?? verse.place, hero: found.hero, age: found.age })),
        );
        song.append(item);
      }
      const lost = verses.length - world.verses.length;
      if (lost > 0) song.append(element('li', 'muted', lost === 1 ? verseText.lostOne : fill(verseText.lost, { count: lost })));
      panel.append(song);
    }

    // Dream shards, in the order they were found.
    panel.append(element('h3', '', fill(shardText.heading, { found: world.shards.length, total: shards.length })));
    if (world.shards.length === 0) {
      panel.append(element('p', 'muted', shardText.none));
      return;
    }
    const lore = element('ul', 'plain-list shard-list');
    for (const found of world.shards) {
      const shard = shardById(found.id);
      const place = world.places.find((option) => option.name === shard.place);
      const item = element('li');
      item.append(
        element('b', '', shard.title),
        element('div', 'flavor', shard.text),
        element('div', 'muted', fill(shardText.foundAt, { place: place?.logName ?? shard.place, hero: found.hero })),
      );
      lore.append(item);
    }
    panel.append(lore);
  }

  // ---- Hall of Champions ----

  function renderHall() {
    const panel = panels.hall;
    const lives = getLives();
    panel.replaceChildren();
    if (openLog) {
      renderHallLog(panel, openLog);
      return;
    }
    panel.append(element('h2', '', hallText.title));
    if (lives.length === 0) {
      panel.append(element('p', 'muted', hallText.empty));
      return;
    }
    panel.append(element('p', 'muted', hallText.tapHint));
    const list = element('div', 'hall-list');
    for (const record of [...lives].reverse()) {
      const card = element('button', 'hall-card');
      card.type = 'button';
      const heroClass = classes.find((option) => option.name === record.className);
      card.append(portrait(heroClass ? heroClass.sprite : heroSprite));
      const text = element('div');
      text.append(
        element('b', '', `${record.name} ${record.epithet}`),
        element('div', '', `${record.className ? `${record.className} · ` : ''}Level ${record.level}`),
        element('div', 'muted', fill(hallText.ageLine, { age: record.age, town: record.startTown })),
      );
      // Heroes from before origins, quirks and dreams have none of them.
      const background = [record.origin, record.quirk, record.dream].filter(Boolean).join(' · ');
      if (background) text.append(element('div', 'muted', background));
      if (record.deed) text.append(element('div', '', fill(hallText.deed, { deed: record.deed }))); // older saves have none
      text.append(element('div', 'flavor', record.endingText));
      card.append(text);
      card.onclick = () => {
        openLog = record;
        render();
        panel.scrollTop = 0;
      };
      list.append(card);
    }
    panel.append(list);
  }

  function renderHallLog(panel, record) {
    const back = element('button', 'back-button', `← ${hallText.back}`);
    back.type = 'button';
    back.onclick = () => {
      openLog = null;
      render();
    };
    panel.append(back, element('h2', '', `${record.name} ${record.epithet}`), element('p', 'flavor', record.endingText));
    if (!record.log) {
      panel.append(element('p', 'muted', hallText.fadedLog));
      return;
    }
    // Oldest first, so it reads like a story.
    const list = element('ol', 'story-log');
    for (const [kind, stamp, text, color] of record.log) list.append(logLine({ kind, stamp, text, color }));
    panel.append(list);
  }

  for (const button of buttons) button.addEventListener('click', () => show(button.dataset.tab));
  for (const name of HERO_EVENTS) on(name, () => { if (active === 'hero') renderHero(); });

  show('adventure');
  return { show, refresh: render };
}

function element(tag, className = '', text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

