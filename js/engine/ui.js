// The Adventure screen around the map: the hero strip, the adventure log, the encounter card
// and the cards. (The Hero, Chronicle and Hall of Champions tabs are in screens.js.)
import { on } from './game-events.js';
import { lifeStatus, visitName } from './life.js';
import { visitKind } from './dungeons.js';
import { isFinaleEntrance, dreamRegion } from './finale.js';
import { finaleText } from '../../data/finale.js';
import { moods, newDreamText } from '../../data/new-dream.js';
import { nemesisAt } from './nemeses.js';
import { nemesisText } from '../../data/nemeses.js';
import { petKind } from './pets.js';
import { petText } from '../../data/pets.js';
import { xpToNextLevel } from './hero.js';
import { tagInfo, skillChip, classById, skillRank, describeEffects, quirkById } from './skills.js';
import { placeSkulls, directionTo, distanceWord } from './rumors.js';
import { eventById, oddsWord } from './events.js';
import { originById } from './background.js';
import { dreamById } from './dreams.js';
import { dreamText } from '../../data/dreams.js';
import { mentorText, mentorSettings } from '../../data/mentors.js';
import { mentorsFor } from './mentors.js';
import { dungeonText } from '../../data/dungeons.js';
import { castleText } from '../../data/castles.js';
import { regions } from '../../data/regions.js';
import { rumorText, danger } from '../../data/rumors.js';
import { picture, TILE } from './art.js';
import { fill, withArticle } from './text.js';
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
    dream: byId('hero-dream'),
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
  const dungeonBox = {
    box: byId('dungeon'),
    name: byId('dungeon-name'),
    rooms: byId('dungeon-rooms'),
    note: byId('dungeon-note'),
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
    const dream = dreamById(hero.dream);
    strip.dream.textContent = dream ? fill(dreamText.strip, { name: dream.name }) : '';
    strip.dream.title = dream ? `${dreamText.label}: ${dream.text}` : '';
  }

  // Called every frame, since HP creeps back up while the hero travels.
  function showHp() {
    const { hero } = life;
    const maxHp = Math.ceil(hero.stats.maxHp);
    const hp = Math.min(Math.ceil(hero.hp), maxHp); // rounded the same way, so never "82 / 81"
    const key = `${hp}/${maxHp}`;
    if (key === shownHp) return;
    shownHp = key;
    const share = hero.hp / hero.stats.maxHp;
    strip.hp.style.width = percent(share);
    strip.hp.className = `fill ${share > 0.5 ? 'good' : share > 0.25 ? 'worried' : 'danger'}`;
    strip.hpText.textContent = `${hp} / ${maxHp} HP`;
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
      button.className = options.length === 1 ? 'option primary' : 'option';
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
        // Badges that stand out at the end of the detail line, like "Unexplored" on a rumor.
        // Each is { text, kind }, and its kind picks its color (see .option-badge in style.css).
        if (key === 'detail') {
          for (const { text: label, kind } of option.badges ?? []) {
            const badge = document.createElement('span');
            badge.className = `option-badge ${kind}`;
            badge.textContent = label;
            line.append(' ', badge);
          }
        }
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
    delete document.body.dataset.picking;
    card.layer.scrollTop = card.layer.scrollHeight;
    buttons[0].focus({ preventScroll: true });
  }

  on('log', ({ entry }) => addEntry(entry));
  for (const name of ['season', 'depart', 'arrive', 'fight-start', 'fight-end', 'level-up', 'potion', 'shop', 'choice-made', 'epithet', 'life-end']) {
    on(name, showHero);
  }
  on('fight-start', ({ monster }) => showEncounter(monster));
  // The map shakes when the Sleeper stirs.
  on('tremor', () => {
    const map = byId('map');
    map.classList.remove('shaking');
    void map.offsetWidth; // restarts the animation if it's already playing
    map.classList.add('shaking');
  });
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
  on('boss-move', ({ life: current, move, damage, healed }) => {
    const note = healed === undefined ? castleText.bossMove : castleText.bossHeal;
    encounter.note.textContent = fill(note, { move: move.name, damage, healed });
    showMonsterHp(current.fight.monster);
  });
  on('song-verse', ({ verse }) => { encounter.note.textContent = fill(finaleText.songNote, { title: verse.title }); });
  on('pet-hit', ({ life: current, pet, dodged, damage }) => {
    encounter.note.textContent = fill(dodged ? petText.missed : petText.hit, { name: pet.name, verb: petKind(pet)?.verb ?? '', damage });
    if (current.fight) showMonsterHp(current.fight.monster);
  });
  for (const name of ['dungeon-enter', 'dungeon-room', 'dungeon-leave', 'life-end']) on(name, showDungeon);

  // The dungeon (or castle) panel: one pip per room, the current one lit, and what's in it.
  function showDungeon() {
    const dungeon = life?.dungeon;
    dungeonBox.box.hidden = !dungeon || Boolean(life.ending);
    if (dungeonBox.box.hidden) return;
    const { place, rooms, index } = dungeon;
    const kind = visitKind(dungeon);
    dungeonBox.box.classList.toggle('castle', kind === 'castle');
    dungeonBox.box.classList.toggle('nightmare', kind === 'nightmare');
    dungeonBox.name.textContent = kind === 'nightmare' ? finaleText.panelName : place.name;
    dungeonBox.rooms.replaceChildren(...rooms.map((room, i) => {
      const pip = document.createElement('li');
      pip.className = [dreamRegion(room) ? 'dream' : room, i < index - 1 ? 'done' : i === index - 1 ? 'current' : ''].join(' ');
      return pip;
    }));
    dungeonBox.note.textContent = index > 0
      ? `${fill(dungeonText.progress, { room: index, rooms: rooms.length })}: ${roomLabel(kind, rooms[index - 1])}`
      : '';
  }

  // What a room is called in the panel: "A treasure chest", or "A dream of gold".
  function roomLabel(kind, room) {
    if (kind === 'nightmare') {
      const region = dreamRegion(room);
      if (!region) return finaleText.songRoom;
      const theme = regions[region].dreamTheme;
      return fill(finaleText.dreamRoom, { theme: theme.charAt(0).toLowerCase() + theme.slice(1) });
    }
    return (kind === 'castle' ? castleText.rooms : dungeonText.rooms)[room];
  }

  return {
    setLife(next) {
      life = next;
      shownHp = null;
      hideEncounter();
      log.replaceChildren();
      life.log.forEach(addEntry);
      showHero();
      showHp();
      // A hero picked up mid-fight, or mid-dungeon, shows it straight away.
      if (life.fight && !life.ending) showEncounter(life.fight.monster);
      showDungeon();
    },

    update() {
      if (life) showHp();
    },

    // Called when Auto-decide is switched in Settings, so a waiting choice card follows along.
    syncAutoDecide(on) {
      rearmAuto?.(on);
    },

    // The New Hero card: type a name, reroll, pick a starting town, then Begin.
    //   towns        the towns to start from; the life's start town is shown as chosen
    //   mentorCount  how many mentors each town has: mentorCount(town)
    //   typed        the name the player has typed so far, if any
    //   onName(text), onReroll(), onTown(town), onBegin()
    showNewHero({ towns, mentorCount, typed, onName, onReroll, onTown, onBegin }) {
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
      const background = backgroundLines(hero);
      // Tonight's dream belongs to the world, so it goes above the hero and never rerolls.
      const dream = dreamById(hero.dream);
      const dreamLine = document.createElement('p');
      dreamLine.className = 'dream-line';
      if (dream) {
        const name = document.createElement('b');
        name.textContent = `${dreamText.label}: ${dream.name}.`;
        dreamLine.append(name, ' ', dream.text);
      }
      // A restless New Game+ dream is shown with tonight's dream.
      if (hero.mood === 'restless') {
        const restless = document.createElement('b');
        restless.textContent = newDreamText.restlessLabel;
        dreamLine.append(dream ? document.createElement('br') : '', restless, ' ', moods.restless.detail);
      }

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
        const count = mentorCount(town);
        if (count > 0) detail.textContent += ` · ${fill(mentorText.count[count === 1 ? 0 : 1], { count })}`;
        button.append(title, detail);
        button.onclick = () => onTown(town);
        townList.append(button);
      }

      // What the chosen town's mentors are giving this hero, and the legend's gift (New Game+).
      const mentorLine = document.createElement('div');
      mentorLine.className = 'mentor-line';
      const townMentors = hero.mentors.filter((mentor) => !mentor.legend);
      const legend = hero.mentors.find((mentor) => mentor.legend);
      if (legend) {
        const line = document.createElement('p');
        const label = document.createElement('b');
        label.textContent = newDreamText.legendLabel;
        line.append(label, ' ', `${legend.text}.`);
        mentorLine.append(line);
      }
      if (townMentors.length > 0) {
        const heading = document.createElement('b');
        heading.textContent = fill(mentorText.label, { town: life.startTown.name });
        const list = document.createElement('ul');
        for (const mentor of townMentors) {
          const item = document.createElement('li');
          item.textContent = fill(mentorText.gift, { name: mentor.name, gift: mentor.text ?? '' });
          list.append(item);
        }
        mentorLine.append(heading, list);
      }

      const begin = document.createElement('button');
      begin.type = 'button';
      begin.className = 'option primary';
      begin.textContent = newHeroText.begin;
      begin.onclick = () => {
        delete document.body.dataset.picking;
        card.layer.hidden = true;
        delete document.body.dataset.card;
        onBegin();
      };

      card.options.replaceChildren(
        ...(dream || hero.mood === 'restless' ? [dreamLine] : []), nameField, about, background, reroll, townsLabel, townList,
        ...(hero.mentors.length > 0 ? [mentorLine] : []), begin,
      );
      card.layer.hidden = false;
      document.body.dataset.card = 'open';
      document.body.dataset.picking = 'yes'; // the map keeps its size, to show the towns
      card.layer.scrollTop = card.layer.scrollHeight;
    },

    // A card with a few options and no Auto-decide, like the choice of a new dream.
    //   options  [{ title, detail }]; onPick(index) is told which was chosen
    showPrompt({ title, body, options, onPick }) {
      showCard({ title, body, options, onPick });
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

    // The ending: the name, epithet and greatest deed of every hero in `records` (oldest first)
    // scroll slowly up the screen. The player can skip it. `closing` is an optional card to show
    // after, { title, body, button }. (In play, Act 4's interlude follows instead, as the next
    // hero is rolled.)
    showEnding(records, onDone, closing = null) {
      const box = byId('ending');
      const roll = byId('ending-roll');
      const skip = byId('ending-skip');
      const title = document.createElement('h2');
      title.textContent = finaleText.rollTitle;
      const intro = document.createElement('p');
      intro.className = 'ending-intro';
      intro.textContent = finaleText.rollIntro;
      const credits = records.map((record) => {
        const credit = document.createElement('div');
        credit.className = 'credit';
        const name = document.createElement('b');
        name.textContent = `${record.name} ${record.epithet}`;
        const deed = document.createElement('div');
        deed.textContent = record.deed ?? '';
        credit.append(name, deed);
        return credit;
      });
      roll.replaceChildren(title, intro, ...credits);
      skip.textContent = finaleText.rollSkip;
      const seconds = 8 + records.length * finaleText.secondsPerHero;
      roll.style.animation = 'none';
      void roll.offsetWidth; // restarts the scroll if it has played before
      roll.style.animation = `ending-roll ${seconds}s linear forwards`;
      box.hidden = false;
      const finish = () => {
        roll.onanimationend = null;
        skip.onclick = null;
        box.hidden = true;
        if (closing) showCard({ title: closing.title, body: closing.body, options: [{ title: closing.button }], onPick: onDone });
        else onDone();
      };
      roll.onanimationend = finish;
      skip.onclick = finish;
    },

    // A skill, class, rumor or story event choice.
    showChoice(choice, current, { auto, onPick }) {
      const { hero, world } = current;
      let options;
      let title;
      let body;
      if (choice.kind === 'rumor') {
        title = choice.town ? fill(rumorText.townTitle, { town: choice.town }) : rumorText.campTitle;
        options = choice.options.map(({ place, text }) => {
          let where = fill(rumorText.detail, {
            distance: distanceWord(hero, place),
            direction: directionTo(hero, place),
            region: regions[place.region].name,
          });
          if (place.kind === 'dungeon') where += ` · ${dungeonText.rumorNote}`;
          if (place.kind === 'castle') where += ` · ${castleText.rumorNote}`;
          if (isFinaleEntrance(world, place)) where += ` · ${finaleText.rumorNote}`;
          return {
            title: text,
            note: danger.skull.repeat(placeSkulls(hero.level, place, world)),
            detail: where,
            badges: [ // new ground, and a nemesis's lair, stand out
              !world.discovered.has(place.name) && { text: rumorText.unexplored, kind: 'unexplored' },
              nemesisAt(world, place.name) && { text: nemesisText.rumorNote, kind: 'nemesis' },
            ].filter(Boolean),
          };
        });
      } else if (choice.kind === 'retreat') {
        const nightmare = current.dungeon && visitKind(current.dungeon) === 'nightmare';
        const values = { first: hero.name.split(' ')[0], left: choice.left, place: current.dungeon ? visitName(current.dungeon) : choice.place };
        title = dungeonText.retreatTitle;
        body = fill(dungeonText.retreatBody, values);
        options = [
          { title: dungeonText.pressOn, detail: nightmare ? finaleText.pressOnDetail : dungeonText.pressOnDetail },
          { title: dungeonText.retreat, detail: dungeonText.retreatDetail },
        ];
      } else if (choice.kind === 'retire') {
        const values = { town: choice.town, age: hero.age, first: hero.name.split(' ')[0] };
        title = fill(mentorText.retireTitle, values);
        // How many mentors the town has now, and who would step back if it's full.
        const mentors = mentorsFor(world, choice.town);
        const count = mentors.length;
        const lines = mentorText.retireMentors;
        const mentorsNow = count === 0 ? lines.none
          : count < mentorSettings.gifts ? lines.some[count === 1 ? 0 : 1]
            : lines.full;
        body = `${fill(mentorText.retireBody, values)} ${fill(mentorsNow, { ...values, count, oldest: mentors.at(-1)?.name.split(' ')[0] ?? '' })}`;
        options = [
          { title: mentorText.retire, detail: fill(mentorText.retireDetail, values) },
          { title: mentorText.stay, detail: mentorText.stayDetail },
        ];
      } else if (choice.kind === 'event') {
        const event = eventById(choice.event);
        title = event.title;
        body = event.text;
        options = event.options.map((option) => ({
          title: option.text,
          tags: [tagInfo(option.tag)],
          note: oddsWord(hero, option),
        }));
      } else if (choice.kind === 'class') {
        title = fill(choiceText.classTitle, { level: choice.level });
        const current = hero.class ? classById(hero.class) : null;
        if (current) body = fill(choiceText.keepsPerk, { perk: current.perk.name, class: current.name });
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
          let note = rank === 0 ? choiceText.newSkill : fill(choiceText.rank, { rank: rank + 1, max: skill.ranks.length });
          if (choice.lesson?.skill === skill.name) note += ` · ${fill(mentorText.lessonNote, { mentor: choice.lesson.mentor.split(' ')[0] })}`;
          return {
            title: skill.name,
            tags: [skillChip(skill)],
            note,
            detail: describeEffects(skill.ranks[rank]),
            flavor: skill.flavor,
          };
        });
      }
      showCard({ title, body, options, onPick, auto });
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

// The hero's origin and quirk, for the New Hero card:
// "Failed Bard [Cunning] Starts with an Out-of-Tune Lute." and "Afraid of Geese: Weaker against birds."
function backgroundLines(hero) {
  const box = document.createElement('div');
  box.className = 'hero-background';
  const origin = originById(hero.origin);
  const quirk = quirkById(hero.quirk);
  if (origin) {
    const line = document.createElement('p');
    const name = document.createElement('b');
    name.textContent = origin.name;
    const tag = tagInfo(origin.tag);
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.textContent = tag.id;
    chip.style.background = tag.color;
    line.append(name, ' ', chip, ' ', fill(newHeroText.originItem, { a: withArticle(origin.item.name) }));
    box.append(line);
  }
  if (quirk) {
    const line = document.createElement('p');
    const name = document.createElement('b');
    name.textContent = fill(newHeroText.quirk, { quirk: quirk.name });
    line.append(name, ' ', quirk.about);
    box.append(line);
  }
  return box;
}

export function percent(share) {
  return `${Math.max(0, Math.min(1, share)) * 100}%`;
}
