// The Settings panel: How to play, Auto-decide, sound, and backing up or loading the save as a
// text code.
import { settingsText } from '../../data/records.js';
import { soundFor } from '../../data/audio.js';
import { helpText, helpTopics } from '../../data/help.js';

//   getAutoDecide / setAutoDecide   read and change the Auto-decide setting
//   audio                           the sound system (see audio.js)
//   makeCode                        returns the save code for the current progress
//   loadCode(text)                  loads a pasted save code (throws with a message if it can't)
//   onOpen / onClose                called as the panel opens and closes
export function createSettingsPanel({ getAutoDecide, setAutoDecide, audio, makeCode, loadCode, onOpen, onClose }) {
  const byId = (id) => document.getElementById(id);
  const layer = byId('settings');
  const auto = byId('setting-auto');
  const mute = byId('setting-mute');
  const musicVolume = byId('setting-music');
  const effectsVolume = byId('setting-effects');
  const code = byId('save-code');
  const paste = byId('save-paste');
  const message = byId('save-message');
  buildHelp(byId('help'));

  function open() {
    auto.checked = getAutoDecide();
    const { muted, music, effects } = audio.volumes;
    mute.checked = muted;
    musicVolume.value = Math.round(music * 100);
    effectsVolume.value = Math.round(effects * 100);
    code.hidden = true;
    code.value = '';
    paste.value = '';
    message.textContent = '';
    layer.hidden = false;
    onOpen();
  }

  function close() {
    if (layer.hidden) return;
    layer.hidden = true;
    onClose();
  }

  byId('open-settings').addEventListener('click', open);
  byId('settings-close').addEventListener('click', close);
  layer.addEventListener('click', (event) => { if (event.target === layer) close(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  auto.addEventListener('change', () => setAutoDecide(auto.checked));
  mute.addEventListener('change', () => audio.setMuted(mute.checked));
  musicVolume.addEventListener('input', () => audio.setMusicVolume(musicVolume.value / 100));
  effectsVolume.addEventListener('input', () => audio.setEffectsVolume(effectsVolume.value / 100));
  // A little sound on letting go of the effects slider, to hear the new volume.
  effectsVolume.addEventListener('change', () => audio.play(soundFor.levelUp));

  byId('save-copy').addEventListener('click', async () => {
    code.value = makeCode();
    code.hidden = false;
    code.select();
    try {
      await navigator.clipboard.writeText(code.value);
      message.textContent = settingsText.copied;
    } catch {
      message.textContent = settingsText.selectToCopy;
    }
  });

  byId('save-load').addEventListener('click', () => {
    if (!paste.value.trim()) {
      message.textContent = settingsText.emptyPaste;
      return;
    }
    try {
      loadCode(paste.value);
    } catch (error) {
      message.textContent = error.message;
    }
  });

  return {
    // Keeps the checkbox in step when Auto-decide is changed from a choice card.
    sync() {
      auto.checked = getAutoDecide();
    },
  };
}

// "How to play": a section that opens with a tap, holding one small section per topic
// (the words are in data/help.js).
function buildHelp(box) {
  const summary = document.createElement('summary');
  summary.textContent = helpText.heading;
  const hint = document.createElement('p');
  hint.className = 'hint';
  hint.textContent = helpText.hint;
  box.replaceChildren(summary, hint);
  for (const topic of helpTopics) {
    const section = document.createElement('details');
    section.className = 'help-topic';
    const title = document.createElement('summary');
    title.textContent = topic.title;
    section.append(title);
    for (const text of topic.text) {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      section.append(paragraph);
    }
    box.append(section);
  }
}
