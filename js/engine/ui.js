// The Adventure screen around the map: the hero strip, the adventure log, the encounter card
// and the cards. (The Hero, Chronicle and Hall of Champions tabs are in screens.js.)
import { on } from './game-events.js';
import { lifeStatus } from './life.js';
import { xpToNextLevel } from './hero.js';
import { tagInfo, classById, skillRank, describeEffects } from './skills.js';
import { picture, TILE } from './art.js';
import { fill } from './text.js';
import { seasons } from '../../data/life.js';
import { blowNotes } from '../../data/combat.js';
import { choiceText } from '../../data/skills.js';

const ENCOUNTER_LINGER_MS = 700; // how long the encounter card stays up after a win

export function createUi(art) {
  const byId = (id) => document.getElementById(id);
  const strip = {
    name: byId('hero-name'),
    heroClass: byId('hero-class'),
    level: byId('hero-level'),
    age: byId('hero-age'),
    season: byId('hero-season'),
    hp: byId('hero-hp'),
    hpText: byId('hero-hp-text'),
    xp: byId('hero-xp'),
    status: byId('hero-status'),
  };
  const log = byId('log');
  const card = {
    layer: byId('card-layer'),
    title: byId('card-title'),
    body: byId('card-body'),
    options: byId('card-options'),
    auto: byId('card-auto'),
    autoBox: byId('card-auto-box'),
    autoText: byId('card-auto-text'),
  };
  const encounter = {
    box: byId('encounter'),
    sprite: byId('encounter-sprite').getContext('2d'),
    name: byId('encounter-name'),
    hp: byId('encounter-hp'),
    note: byId('encounter-note'),
  };
  let life = null;
  let shownHp = null;
  let hideTimer = null;
  let autoTimer = null;
  let rearmAuto = null; // restarts the open card's Auto-decide countdown, if it has one

  function showHero() {
    if (!life) return;
    const { hero } = life;
    strip.name.textContent = `${hero.name} ${hero.epithet}`;
    strip.heroClass.textContent = hero.class ? `${classById(hero.class).name} · ` : '';
    strip.level.textContent = hero.level;
    strip.age.textContent = hero.age;
    strip.season.textContent = seasons[hero.season];
    strip.xp.style.width = percent(hero.xp / xpToNextLevel(hero.level));
    strip.status.textContent = lifeStatus(life);
  }

  // Called every frame, since HP creeps back up while the hero travels.
  function showHp() {
    const { hero } = life;
    const hp = Math.ceil(hero.hp);
    const key = `${hp}/${hero.stats.maxHp}`;
    if (key === shownHp) return;
    shownHp = key;
    const share = hero.hp / hero.stats.maxHp;
    strip.hp.style.width = percent(share);
    strip.hp.className = `fill ${share > 0.5 ? 'good' : share > 0.25 ? 'worried' : 'danger'}`;
    strip.hpText.textContent = `${hp} / ${Math.round(hero.stats.maxHp)} HP`;
  }

  // Newest lines go at the top, so the latest news is always in view.
  function addEntry(entry) {
    log.prepend(logLine(entry));
  }

  function showEncounter(monster) {
    clearTimeout(hideTimer);
    const look = picture(art, monster.kind.sprite.sheet, monster.kind.sprite.tile, monster.kind.name);
    encounter.sprite.clearRect(0, 0, TILE, TILE);
    encounter.sprite.drawImage(look.image, look.sx, look.sy, TILE, TILE, 0, 0, TILE, TILE);
    encounter.name.textContent = `${monster.name} · Lv ${monster.level}`;
    encounter.note.textContent = '';
    showMonsterHp(monster);
    encounter.box.hidden = false;
  }

  function showMonsterHp(monster) {
    encounter.hp.style.width = percent(monster.hp / monster.stats.maxHp);
  }

  function hideEncounter() {
    clearTimeout(hideTimer);
    encounter.box.hidden = true;
  }

  // Shows a card over the log, with a button for each option.
  //   options  [{ title, tags, note, detail, flavor }]; only `title` is needed
  //   auto     optional Auto-decide: { enabled, pickIndex, delayMs, onToggle }
  function showCard({ title, body, options, onPick, auto }) {
    clearTimeout(autoTimer);
    card.title.textContent = title;
    card.body.textContent = body ?? '';
    card.body.hidden = !body;
    const buttons = options.map((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = option.detail ? 'option' : 'option primary';
      const head = document.createElement('span');
      head.className = 'option-title';
      head.textContent = option.title;
      button.append(head);
      for (const tag of option.tags ?? []) {
        const chip = document.createElement('span');
        chip.className = 'tag-chip';
        chip.textContent = tag.id;
        chip.style.background = tag.color;
        button.append(' ', chip);
      }
      if (option.note) {
        const note = document.createElement('span');
        note.className = 'option-note';
        note.textContent = option.note;
        button.append(' ', note);
      }
      for (const [key, text] of [['detail', option.detail], ['flavor', option.flavor]]) {
        if (!text) continue;
        const line = document.createElement('span');
        line.className = `option-${key}`;
        line.textContent = text;
        button.append(line);
      }
      button.onclick = () => choose(index);
      return button;
    });
    card.options.replaceChildren(...buttons);

    function choose(index) {
      clearTimeout(autoTimer);
      rearmAuto = null;
      card.layer.hidden = true;
      delete document.body.dataset.card;
      onPick(index);
    }

    card.auto.hidden = !auto;
    rearmAuto = null;
    if (auto) {
      // While Auto-decide is on, the option it will take is highlighted, then taken after a moment.
      const arm = () => {
        clearTimeout(autoTimer);
        buttons.forEach((button) => button.classList.remove('leaning'));
        if (!card.autoBox.checked) return;
        buttons[auto.pickIndex].classList.add('leaning');
        autoTimer = setTimeout(() => choose(auto.pickIndex), auto.delayMs);
      };
      card.autoText.textContent = choiceText.autoDecide;
      card.autoBox.checked = auto.enabled;
      card.autoBox.onchange = () => {
        auto.onToggle(card.autoBox.checked);
        arm();
      };
      rearmAuto = (on) => {
        card.autoBox.checked = on;
        arm();
      };
      arm();
    }
    card.layer.hidden = false;
    document.body.dataset.card = 'open'; // lets the other tabs hide the card and flag it on the Adventure tab
    card.layer.scrollTop = card.layer.scrollHeight;
    buttons[0].focus({ preventScroll: true });
  }

  on('log', ({ entry }) => addEntry(entry));
  for (const name of ['season', 'depart', 'arrive', 'fight-start', 'fight-end', 'level-up', 'potion', 'shop', 'choice-made', 'life-end']) {
    on(name, showHero);
  }
  on('fight-start', ({ monster }) => showEncounter(monster));
  on('potion', () => { encounter.note.textContent = blowNotes.potion; });
  on('hit', ({ life: current, by, dodged, critical, damage }) => {
    const note = by === 'hero'
      ? (dodged ? blowNotes.heroMissed : critical ? blowNotes.heroCritical : blowNotes.heroHit)
      : (dodged ? blowNotes.monsterMissed : critical ? blowNotes.monsterCritical : blowNotes.monsterHit);
    encounter.note.textContent = fill(note, { damage });
    showMonsterHp(current.fight.monster);
  });
  on('skill', ({ life: current, skill, damage, healed }) => {
    if (!current.fight) return; // the skill won the fight, so "Victory!" stays
    const note = healed === undefined ? blowNotes.skillHit : blowNotes.skillHeal;
    encounter.note.textContent = fill(note, { skill: skill.name, damage, healed });
  });
  on('fight-end', ({ won }) => {
    if (!won) return; // after a loss the card stays up until the next hero
    encounter.note.textContent = blowNotes.victory;
    hideTimer = setTimeout(hideEncounter, ENCOUNTER_LINGER_MS);
  });

  return {
    setLife(next) {
      life = next;
      shownHp = null;
      hideEncounter();
      log.replaceChildren();
      life.log.forEach(addEntry);
      showHero();
      showHp();
      // A hero picked up mid-fight shows the fight straight away.
      if (life.fight && !life.ending) showEncounter(life.fight.monster);
    },

    update() {
      if (life) showHp();
    },

    // Called when Auto-decide is switched in Settings, so a waiting choice card follows along.
    syncAutoDecide(on) {
      rearmAuto?.(on);
    },

    // A card with one button, like Begin or Next hero. {words} in the text are filled from `values`.
    showMessage(text, values, onDone) {
      showCard({
        title: fill(text.title, values),
        body: fill(text.body, values),
        options: [{ title: text.button }],
        onPick: onDone,
      });
    },

    // A skill or class choice.
    showChoice(choice, hero, { auto, onPick }) {
      const options = choice.kind === 'class'
        ? choice.options.map((option) => ({
          title: option.name,
          tags: [...new Set(option.tags)].map(tagInfo),
          detail: `${option.perk.name}: ${describeEffects(option.perk.effects)}`,
          flavor: option.flavor,
        }))
        : choice.options.map((skill) => {
          const rank = skillRank(hero, skill);
          return {
            title: skill.name,
            tags: [tagInfo(skill.tag)],
            note: rank === 0 ? choiceText.newSkill : fill(choiceText.rank, { rank: rank + 1, max: skill.ranks.length }),
            detail: describeEffects(skill.ranks[rank]),
            flavor: skill.flavor,
          };
        });
      const title = fill(choice.kind === 'class' ? choiceText.classTitle : choiceText.skillTitle, { level: choice.level });
      showCard({ title, options, onPick, auto });
    },
  };
}

// One adventure log line: "Autumn, age 34: slew the Moss Wyrm." Also used by the Hall of Champions.
export function logLine({ kind, stamp, text, color }) {
  const item = document.createElement('li');
  item.className = `log-${kind}`;
  const when = document.createElement('span');
  when.className = 'stamp';
  when.textContent = `${stamp}:`;
  item.append(when, ` ${text}`);
  if (color) item.style.color = color;
  return item;
}

export function percent(share) {
  return `${Math.max(0, Math.min(1, share)) * 100}%`;
}
