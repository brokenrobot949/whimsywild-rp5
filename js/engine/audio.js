// Sound and music, made in code with the browser's Web Audio API (there are no audio files).
// The recipes for each sound, and the lullaby, are in data/audio.js.
//
// Browsers only allow sound after the player has tapped or pressed a key, so nothing plays
// until then. Sound pauses while the page is hidden. The engine announces game moments
// (see game-events.js), and this file picks a sound for each.
import { sounds, soundFor, music, audioSettings } from '../../data/audio.js';
import { on } from './game-events.js';
import { loadSetting, saveSetting } from './save.js';

const WAVES = ['sine', 'triangle', 'square', 'sawtooth', 'noise'];
const QUIET = 0.0001; // "silent", for fades (a fade can't reach exactly zero)
const SCHEDULE_AHEAD = 1.5; // seconds: the next play-through of the music is lined up this early

// ---- Checking the data ----
// Runs once at startup, so a typo in data/audio.js shows a clear message.

for (const [name, sound] of Object.entries(sounds)) {
  const owner = `The sound "${name}" in data/audio.js`;
  if (!sound.layers?.length) throw new Error(`${owner} needs at least one layer.`);
  for (const layer of sound.layers) {
    if (!WAVES.includes(layer.wave)) throw new Error(`${owner} has the wave "${layer.wave}". Waves must be one of: ${WAVES.join(', ')}.`);
    frequency(layer.pitch, owner);
    if (layer.to !== undefined) frequency(layer.to, owner);
    if (!(layer.length > 0)) throw new Error(`${owner} needs a length above 0 for each layer.`);
  }
}
for (const [moment, name] of Object.entries(soundFor)) {
  if (name && !sounds[name]) throw new Error(`soundFor.${moment} in data/audio.js is "${name}", which isn't one of the sounds.`);
}
for (const [note] of music.melody) if (note !== 'rest') frequency(note, 'The music in data/audio.js');
for (const chord of music.chords) {
  if (!music.chordNotes[chord]) throw new Error(`The music in data/audio.js uses the chord "${chord}", which isn't in chordNotes.`);
}
for (const notes of Object.values(music.chordNotes)) for (const note of notes) frequency(note, 'The music in data/audio.js');

// A note like 'C4', 'F#5' or 'Bb3' (or a number of Hz) as a frequency in Hz.
function frequency(pitch, owner = 'A sound') {
  if (typeof pitch === 'number' && pitch > 0) return pitch;
  const match = /^([A-G])([#b]?)(-?\d)$/.exec(pitch ?? '');
  if (!match) throw new Error(`${owner} has the note "${pitch}". Write notes like 'C4', 'F#5' or 'Bb3', or give a number of Hz.`);
  const semitone = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[match[1]] + (match[2] === '#' ? 1 : match[2] === 'b' ? -1 : 0);
  const fromA4 = Number(match[3]) * 12 + semitone - 57;
  return 440 * 2 ** (fromA4 / 12);
}

// ---- The sound system ----

export function createAudio() {
  const volumes = {
    muted: loadSetting('mute', 'no') === 'yes',
    music: Number(loadSetting('music-volume', audioSettings.musicVolume)),
    effects: Number(loadSetting('effects-volume', audioSettings.effectsVolume)),
  };
  let context = null;
  let master = null;
  let musicBus = null;
  let effectsBus = null;
  let noise = null;
  const lastPlayed = new Map(); // sound name → when it last played, for `gap`

  // Starts the sound on the first tap or key press (browsers block it before then), and wakes
  // it again if the browser put it to sleep.
  function wake() {
    if (document.hidden) return;
    if (context) {
      if (context.state === 'suspended') context.resume();
      return;
    }
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return; // a very old browser: the game simply stays silent
    context = new Context();
    master = context.createGain();
    master.connect(context.destination);
    musicBus = context.createGain();
    musicBus.connect(master);
    effectsBus = context.createGain();
    effectsBus.connect(master);
    noise = noiseBuffer(context);
    applyVolumes();
    startMusic();
  }
  document.addEventListener('pointerdown', wake);
  document.addEventListener('keydown', wake);
  document.addEventListener('visibilitychange', () => {
    if (!context) return;
    if (document.hidden) context.suspend();
    else context.resume();
  });

  function applyVolumes() {
    if (!context) return;
    const now = context.currentTime;
    master.gain.setTargetAtTime(volumes.muted ? 0 : 1, now, 0.05);
    musicBus.gain.setTargetAtTime(volumes.music, now, 0.05);
    effectsBus.gain.setTargetAtTime(volumes.effects, now, 0.05);
  }

  // ---- Sound effects ----

  function play(name) {
    if (!name || !context || context.state !== 'running' || volumes.muted || volumes.effects <= 0) return;
    const sound = sounds[name];
    const now = performance.now();
    if (now - (lastPlayed.get(name) ?? -Infinity) < (sound.gap ?? 0)) return;
    lastPlayed.set(name, now);
    const start = context.currentTime + 0.01;
    for (const layer of sound.layers) playLayer(layer, start + (layer.at ?? 0));
  }

  function playLayer(layer, start) {
    const end = start + layer.length;
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(QUIET, start);
    envelope.gain.exponentialRampToValueAtTime(Math.max(QUIET, layer.volume), start + Math.min(layer.attack ?? 0.005, layer.length / 2));
    envelope.gain.exponentialRampToValueAtTime(QUIET, end);
    envelope.connect(effectsBus);

    let source;
    let pitch;
    if (layer.wave === 'noise') {
      source = context.createBufferSource();
      source.buffer = noise;
      source.loop = true;
      const filter = context.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 1;
      pitch = filter.frequency;
      source.connect(filter);
      filter.connect(envelope);
    } else {
      source = context.createOscillator();
      source.type = layer.wave;
      pitch = source.frequency;
      source.connect(envelope);
    }
    pitch.setValueAtTime(frequency(layer.pitch), start);
    if (layer.to !== undefined) pitch.exponentialRampToValueAtTime(frequency(layer.to), end);
    source.start(start);
    source.stop(end + 0.02);
  }

  // ---- Music ----
  // The lullaby is lined up one play-through at a time, a little before it's needed.

  function startMusic() {
    const beat = 60 / music.tempo;
    const loopSeconds = (music.chords.length + music.restBars) * music.beatsPerBar * beat;
    let nextStart = context.currentTime + 0.5;
    let playThrough = 0;
    const lineUp = () => {
      if (context.state !== 'running' || context.currentTime < nextStart - SCHEDULE_AHEAD) return;
      scheduleLullaby(nextStart, playThrough % 2 === 1 ? music.everyOther : 0);
      nextStart += loopSeconds;
      playThrough += 1;
    };
    lineUp();
    setInterval(lineUp, 250);
  }

  function scheduleLullaby(start, shift) {
    const beat = 60 / music.tempo;
    let time = start;
    for (const [note, beats] of music.melody) {
      if (note !== 'rest') pluck(frequency(note) * 2 ** (shift / 12), time, music.melodyVolume);
      time += beats * beat;
    }
    music.chords.forEach((chord, bar) => {
      const notes = music.chordNotes[chord];
      music.pattern.forEach((index, beatInBar) => {
        pluck(frequency(notes[index]), start + (bar * music.beatsPerBar + beatInBar) * beat, music.accompanimentVolume);
      });
    });
  }

  // One music-box note: a quick, bright pluck that rings away.
  function pluck(hz, start, volume) {
    const envelope = context.createGain();
    envelope.gain.setValueAtTime(QUIET, start);
    envelope.gain.exponentialRampToValueAtTime(volume, start + 0.005);
    envelope.gain.exponentialRampToValueAtTime(QUIET, start + music.ring);
    envelope.connect(musicBus);
    for (const [multiple, share] of [[1, 1], [2, 0.3], [3, 0.08]]) {
      const tone = context.createOscillator();
      tone.type = 'sine';
      tone.frequency.value = hz * multiple;
      const level = context.createGain();
      level.gain.value = share;
      tone.connect(level);
      level.connect(envelope);
      tone.start(start);
      tone.stop(start + music.ring + 0.05);
    }
  }

  // ---- Game moments ----

  on('life-start', () => play(soundFor.lifeStart));
  on('fight-start', () => play(soundFor.fightStart));
  on('hit', ({ by, dodged, critical }) => {
    if (dodged) play(soundFor.missed);
    else if (by === 'hero') play(critical ? soundFor.heroCritical : soundFor.heroHit);
    else play(soundFor.monsterHit);
  });
  on('skill', ({ healed }) => play(healed === undefined ? soundFor.attackSkill : soundFor.healSkill));
  on('potion', () => play(soundFor.potion));
  on('fight-end', ({ won }) => { if (won) play(soundFor.fightWon); });
  on('death', () => play(soundFor.death));
  on('level-up', () => play(soundFor.levelUp));
  on('equip', () => play(soundFor.equip));
  on('epithet', () => play(soundFor.epithet));
  on('arrive', () => play(soundFor.arrive));
  on('discovery', () => play(soundFor.discovery));
  on('story-event', () => play(soundFor.storyEvent));
  on('respects', () => play(soundFor.respects));
  on('shard', () => play(soundFor.shard));
  on('tremor', () => play(soundFor.tremor));
  on('life-end', ({ life }) => { if (life.ending.kind === 'retired') play(soundFor.retired); });
  on('choice-made', () => play(soundFor.choice));
  on('dungeon-enter', () => play(soundFor.dungeonEnter));
  on('dungeon-room', ({ room }) => { if (room === 'treasure' || room === 'prize') play(soundFor.treasure); });
  on('dungeon-leave', ({ place, cleared }) => { if (cleared && place.kind !== 'castle') play(soundFor.dungeonCleared); });
  on('castle-conquered', () => play(soundFor.castleConquered));
  on('song-verse', () => play(soundFor.songVerse));
  on('finale', () => play(soundFor.finale));
  on('boss-move', () => play(soundFor.bossMove));
  on('verse', () => play(soundFor.verseFound));
  on('act', () => play(soundFor.newAct));

  return {
    get volumes() {
      return { ...volumes };
    },
    setMuted(muted) {
      volumes.muted = muted;
      saveSetting('mute', muted ? 'yes' : 'no');
      applyVolumes();
    },
    setMusicVolume(share) {
      volumes.music = share;
      saveSetting('music-volume', share);
      applyVolumes();
    },
    setEffectsVolume(share) {
      volumes.effects = share;
      saveSetting('effects-volume', share);
      applyVolumes();
    },
    play, // for trying a sound, like when the effects volume changes
  };
}

// A second of white noise, the raw material for hits, whooshes and rumbles.
function noiseBuffer(context) {
  const buffer = context.createBuffer(1, context.sampleRate, context.sampleRate);
  const data = buffer.getChannelData(0);
  let seed = 12345; // fixed, so the hiss is the same every time
  for (let i = 0; i < data.length; i++) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    data[i] = (seed / 4294967296) * 2 - 1;
  }
  return buffer;
}
