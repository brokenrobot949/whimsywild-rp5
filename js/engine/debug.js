// Debug tools, shown when the page address ends with ?debug
// Game speed, the hero's seed (with a replay link), a save reset,
// and a playtest log of every finished life with averages.
import { loadSetting, saveSetting } from './save.js';

const SPEEDS = [1, 5, 20];

// onReset erases the save and reloads (main.js does it, so autosave can't write the old save back).
export function createDebugPanel({ getLife, getLives, onSpeed, onReset }) {
  const panel = document.getElementById('debug');
  panel.innerHTML = `
    <summary>Debug</summary>
    <div class="debug-row">Speed <span class="debug-speeds">
      ${SPEEDS.map((speed) => `<button type="button" data-speed="${speed}">${speed}×</button>`).join('')}
    </span></div>
    <div class="debug-row">Seed <span class="debug-seed"></span> <a class="debug-replay" href="#">replay</a></div>
    <div class="debug-row"><button type="button" class="debug-reset">Reset save</button></div>
    <h3>Playtest log</h3>
    <p class="debug-note">Length is game time at 1× speed, not counting pauses.</p>
    <p class="debug-averages"></p>
    <table>
      <thead><tr><th>#</th><th>Hero</th><th>Class</th><th>Length</th><th>Lv</th><th>Ending</th></tr></thead>
      <tbody></tbody>
    </table>`;
  panel.hidden = false;
  panel.open = loadSetting('debug-open', 'yes') === 'yes';
  panel.addEventListener('toggle', () => saveSetting('debug-open', panel.open ? 'yes' : 'no'));

  const find = (selector) => panel.querySelector(selector);
  const speedButtons = [...panel.querySelectorAll('[data-speed]')];

  let speed = Number(loadSetting('debug-speed', 1));
  if (!SPEEDS.includes(speed)) speed = 1;

  function setSpeed(next) {
    speed = next;
    saveSetting('debug-speed', speed);
    speedButtons.forEach((button) => button.classList.toggle('active', Number(button.dataset.speed) === speed));
    onSpeed(speed);
  }
  speedButtons.forEach((button) => button.addEventListener('click', () => setSpeed(Number(button.dataset.speed))));

  find('.debug-reset').addEventListener('click', () => {
    if (!confirm('Erase all Whimsywild RP5 saves and settings in this browser?')) return;
    onReset();
  });

  function refresh() {
    const seed = getLife()?.hero.seed;
    find('.debug-seed').textContent = seed ?? '-';
    find('.debug-replay').href = seed === undefined ? '#' : `?debug&seed=${seed}`;

    const lives = getLives();
    const rows = find('tbody');
    rows.replaceChildren();
    if (lives.length === 0) {
      find('.debug-averages').textContent = 'No lives finished yet.';
      return;
    }
    const average = (pick) => lives.reduce((sum, life) => sum + pick(life), 0) / lives.length;
    const endings = {};
    for (const life of lives) endings[life.ending] = (endings[life.ending] ?? 0) + 1;
    const endingText = Object.entries(endings).map(([ending, count]) => `${count} ${ending}`).join(', ');
    const deaths = lives.filter((life) => life.ending === 'died');
    const deathAge = deaths.length
      ? ` Average age at death ${Math.round(deaths.reduce((sum, life) => sum + life.age, 0) / deaths.length)}.`
      : '';
    const classCounts = {};
    for (const life of lives) if (life.className) classCounts[life.className] = (classCounts[life.className] ?? 0) + 1;
    const classText = Object.keys(classCounts).length
      ? ` Classes: ${Object.entries(classCounts).map(([name, count]) => `${count} ${name}`).join(', ')}.`
      : '';
    find('.debug-averages').textContent =
      `${lives.length} ${lives.length === 1 ? 'life' : 'lives'}. Average length ${clock(average((life) => life.gameSeconds))}, ` +
      `average level ${average((life) => life.level).toFixed(1)}. Endings: ${endingText}.${deathAge}${classText}`;

    lives.forEach((life, index) => {
      const row = document.createElement('tr');
      for (const value of [index + 1, life.name, life.className ?? '-', clock(life.gameSeconds), life.level, life.ending]) {
        const cell = document.createElement('td');
        cell.textContent = value;
        row.append(cell);
      }
      row.title = `${life.endingText} (seed ${life.seed})`;
      rows.prepend(row);
    });
  }

  setSpeed(speed);
  return { speed, refresh };
}

// 312 seconds → "5:12"
function clock(seconds) {
  const whole = Math.round(seconds);
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}
