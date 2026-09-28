// The Adventure screen around the map: the hero strip, the adventure log, the encounter card
// and the cards. (The Hero, Chronicle and Hall of Champions tabs are in screens.js.)
import { on } from './game-events.js';
import { lifeStatus } from './life.js';
import { xpToNextLevel } from './hero.js';
import { tagInfo, classById, skillRank, describeEffects } from './skills.js';
import { skullsFor, directionTo, distanceWord } from './rumors.js';
import { regions } from '../../data/regions.js';
import { rumorText, danger } from '../../data/rumors.js';
import { picture, TILE } from './art.js';
import { fill } from './text.js';
import { seasons, newHeroText, recruits } from '../../data/life.js';
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
  for (const name of ['season', 'depart', 'arrive', 'fight-start', 'fight-end', 'level-up', 'potion', 'shop', 'choice-made', 'epithet', 'life-end']) {
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

    // The New Hero card: type a name, reroll, pick a starting town, then Begin.
    //   towns    the towns to start from; the life's start town is shown as chosen
    //   typed    the name the player has typed so far, if any
    //   onName(text), onReroll(), onTown(town), onBegin()
    showNewHero({ towns, typed, onName, onReroll, onTown, onBegin }) {
      const { hero } = life;
      clearTimeout(autoTimer);
      rearmAuto = null;
      card.title.textContent = newHeroText.title;
      card.body.hidden = true;
      card.auto.hidden = true;

      const nameField = document.createElement('label');
      nameField.className = 'field';
      const input = document.createElement('input');
      input.type = 'text';
      input.maxLength = recruits.nameLength;
      input.value = typed ?? '';
      input.placeholder = life.rolledName;
      input.autocomplete = 'off';
      input.addEventListener('input', () => {
        onName(input.value);
        showHero();
      });
      nameField.append(newHeroText.nameLabel, input);

      const about = document.createElement('p');
      about.className = 'muted';
      about.textContent = fill(newHeroText.about, { epithet: hero.epithet, age: hero.age });

      const reroll = document.createElement('button');
      reroll.type = 'button';
      reroll.className = 'small';
      reroll.disabled = life.rerollsLeft <= 0;
      reroll.textContent = life.rerollsLeft > 0 ? fill(newHeroText.reroll, { left: life.rerollsLeft }) : newHeroText.noRerolls;
      reroll.onclick = onReroll;

      const townsLabel = document.createElement('p');
      townsLabel.className = 'field-label';
      townsLabel.textContent = newHeroText.townsLabel;
      const townList = document.createElement('div');
      townList.className = 'town-list';
      for (const town of towns) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `option${town === life.startTown ? ' leaning' : ''}`;
        const title = document.createElement('span');
        title.className = 'option-title';
        title.textContent = fill(newHeroText.town, { town: town.name });
        const detail = document.createElement('span');
        detail.className = 'option-detail';
        detail.textContent = fill(newHeroText.townDetail, { level: town.recruitLevel ?? 1, region: regions[town.region].name });
        button.append(title, detail);
        button.onclick = () => onTown(town);
        townList.append(button);
      }

      const begin = document.createElement('button');
      begin.type = 'button';
      begin.className = 'option primary';
      begin.textContent = newHeroText.begin;
      begin.onclick = () => {
        card.layer.hidden = true;
        delete document.body.dataset.card;
        onBegin();
      };

      card.options.replaceChildren(nameField, about, reroll, townsLabel, townList, begin);
      card.layer.hidden = false;
      document.body.dataset.card = 'open';
      card.layer.scrollTop = card.layer.scrollHeight;
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

    // A skill, class or rumor choice.
    showChoice(choice, current, { auto, onPick }) {
      const { hero, world } = current;
      let options;
      let title;
      if (choice.kind === 'rumor') {
        title = choice.town ? fill(rumorText.townTitle, { town: choice.town }) : rumorText.campTitle;
        options = choice.options.map(({ place, text }) => {
          const where = fill(rumorText.detail, {
            distance: distanceWord(hero, place),
            direction: directionTo(hero, place),
            region: regions[place.region].name,
          });
          return {
            title: text,
            note: danger.skull.repeat(skullsFor(hero.level, place.region)),
            detail: world.discovered.has(place.name) ? where : `${where} · ${rumorText.unexplored}`,
          };
        });
      } else if (choice.kind === 'class') {
        title = fill(choiceText.classTitle, { level: choice.level });
        options = choice.options.map((option) => ({
          title: option.name,
          tags: [...new Set(option.tags)].map(tagInfo),
          detail: `${option.perk.name}: ${describeEffects(option.perk.effects)}`,
          flavor: option.flavor,
        }));
      } else {
        title = fill(choiceText.skillTitle, { level: choice.level });
        options = choice.options.map((skill) => {
          const rank = skillRank(hero, skill);
          return {
            title: skill.name,
            tags: [tagInfo(skill.tag)],
            note: rank === 0 ? choiceText.newSkill : fill(choiceText.rank, { rank: rank + 1, max: skill.ranks.length }),
            detail: describeEffects(skill.ranks[rank]),
            flavor: skill.flavor,
          };
        });
      }
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
