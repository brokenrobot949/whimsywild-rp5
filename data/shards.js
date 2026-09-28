// Dream shards: fragments of the Sleeper's dreams, found at landmarks. Each shard is found
// once, by whichever hero finds it first, and is kept in the Chronicle for good.
// In Act 1 nobody knows what the Sleeper is, so the shards only hint.
//
//   id     a short name for the save (keep it the same once players have it)
//   place  the landmark it's found at (a place name from regions.js)
//   title  its name, shown in the log and the Chronicle
//   text   the fragment itself, shown in the Chronicle. A sentence or three

export const shardSettings = {
  findChance: 0.25, // the chance of finding a landmark's shard on arriving there, until someone has
  perLife: 1,       // the most shards one hero can find in their life
};

export const shards = [
  // ---- The Tailwoods: the dragon dreams of a lazy summer ----
  {
    id: 'warm-tail', place: "Tail's Tip", title: 'The Warm Tail',
    text: 'Sun on the tip of a tail, and not a care in the world. Something enormous is smiling in its sleep.',
  },
  {
    id: 'reflections', place: 'Drowsy Pond', title: 'Reflections',
    text: 'In the still water, the shape of a great eye, closed. It has been closed for a very long time.',
  },
  {
    id: 'turning-wheel', place: 'Old Mill', title: 'The Turning Wheel',
    text: 'Round and round, like a song sung over and over. The words are gone. Only the rhythm remains.',
  },
  {
    id: 'roots', place: 'Hollow Oak', title: 'Roots',
    text: 'The roots go down and down, and at the bottom they are warm, and they are breathing.',
  },
  {
    id: 'small-grumbles', place: 'Badger Hollow', title: 'Small Grumbles',
    text: 'Everything here grumbles in its sleep. Perhaps it learned how from something much larger.',
  },
  {
    id: 'circle-of-stones', place: 'Mossy Stones', title: 'A Circle of Stones',
    text: 'Someone once stood in this circle and sang. The stones still hum the first line, very softly.',
  },

  // ---- Hindhill Farms: the dragon dreams of hunger ----
  {
    id: 'long-feast', place: 'Great Haystack', title: 'The Long Feast',
    text: 'A feast that never ends, eaten alone at a table built for a thousand guests.',
  },
  {
    id: 'folded-legs', place: 'Kneecap Barn', title: 'Folded Legs',
    text: "The hills here bend like a sleeper's knees, drawn up against the cold.",
  },
  {
    id: 'windfall', place: 'Heelstone Orchard', title: 'Windfall',
    text: 'Apples fall, and something far below counts every one, the way a child counts sheep.',
  },
  {
    id: 'towards-the-sun', place: 'Giant Sunflower', title: 'Towards the Sun',
    text: 'Everything here turns to face the light. The dreamer remembers the light, and misses it.',
  },

  // ---- The Glittering Flank: the dragon dreams of gold ----
  {
    id: 'rise-and-fall', place: 'Ribcage Ridge', title: 'Rise and Fall',
    text: 'The ridge rises and falls, so slowly that no one alive has noticed. In, and out. In, and out.',
  },
  {
    id: 'one-scale', place: 'Gilded Scale', title: 'One Scale of Many',
    text: 'Each coin is a memory of being admired. The dreamer counts them all, and still feels poor.',
  },
  {
    id: 'deep-rumble', place: 'Belly Mine', title: 'The Deep Rumble',
    text: 'Deep in the mine, a sound like a vast stomach. Not hungry, exactly. Just very, very old.',
  },
  {
    id: 'keeping-close', place: "Dragon's Purse", title: 'Keeping Close',
    text: 'A hoard is only a way of keeping things close. The dreamer keeps everything close, and it is still not enough.',
  },

  // ---- The Wingshade Fens: the dragon dreams of being small ----
  {
    id: 'single-feather', place: 'Featherwell', title: 'A Single Feather',
    text: 'Once, the dreamer could fly. Now it only dreams of the wind beneath great folded wings.',
  },
  {
    id: 'rain-on-a-wing', place: 'Rain Barrel', title: 'Rain on a Wing',
    text: 'Rain drums on something vast and leathery, and the sound is almost a lullaby.',
  },
  {
    id: 'the-arrow', place: "Giant's Arrow", title: 'The Arrow',
    text: 'Someone was afraid, once, and shot at the sleeping hill. The hill did not wake. It only felt sad.',
  },
  {
    id: 'very-small', place: 'Fairy Ring', title: 'Very Small',
    text: 'In the dream, everything is huge, and the dreamer is tiny and alone, waiting for someone to sing.',
  },

  // ---- The Spine Peaks: the dragon dreams of knights ----
  {
    id: 'long-back', place: 'Vertebra Pass', title: 'The Long Back',
    text: 'Somewhere far below, a back aches from lying still for far too many centuries.',
  },
  {
    id: 'knights', place: "Knight's Rest", title: 'Knights',
    text: 'Knights came with lances once, very small and very brave. The dreamer never understood why they were angry.',
  },
  {
    id: 'the-hunters', place: "Hunters' Cairn", title: 'The Hunters',
    text: 'The hunters never came home. The dreamer did not mean it. It was only rolling over in its sleep.',
  },
  {
    id: 'watching', place: 'Old Watchtower', title: 'Watching',
    text: 'Someone built a tower to watch for the dreamer waking. They are all gone now. The dreamer is still asleep.',
  },

  // ---- The Clawlands: the dragon dreams of an ancient war ----
  {
    id: 'long-war', place: 'Old Battlefield', title: 'The Long War',
    text: 'Two armies once fought over whose mountain this was. Neither thought to ask the mountain.',
  },
  {
    id: 'ringing', place: 'War Anvil', title: 'Ringing',
    text: 'Every blow on the anvil rang through the ground, like a bell in a dream that will not stop.',
  },
  {
    id: 'locked-out', place: 'Rusted Gate', title: 'Locked Out',
    text: 'A gate to keep something out, or to keep something in. The dreamer has forgotten which side it was on.',
  },
  {
    id: 'scratch', place: 'Great Furrows', title: 'Scratch',
    text: 'A great claw scratched the ground here once, the way a sleeper scratches an itch.',
  },

  // ---- Smokecrown: the dragon dreams of loneliness ----
  {
    id: 'breath', place: 'The Smoking Nostril', title: 'Breath',
    text: 'In, and out, and in. The slow breathing of something that has been alone for a very long time.',
  },
  {
    id: 'behind-the-lid', place: 'Lidwater', title: 'Behind the Lid',
    text: 'Behind the closed eye, a dream of faces, all of them looking for it. It cannot quite believe it.',
  },
  {
    id: 'last-word', place: 'Jawbone Ridge', title: 'The Last Word',
    text: 'A mouth that has not spoken in a thousand years, trying to remember how a name is said.',
  },
  {
    id: 'twitch', place: 'The Whisker Stones', title: 'Twitch',
    text: 'A whisker twitches at every footstep. Someone is coming. After all this time, someone is coming.',
  },
];

// Logged when a hero finds a shard. {title} is its title.
export const shardLines = [
  'found a dream shard: "{title}".',
  'picked up a dream shard called "{title}".',
  'caught a dream shard glittering in the grass: "{title}".',
];

// In the Chronicle. {found} and {total} are filled in automatically.
export const shardText = {
  heading: 'Dream shards ({found} of {total})',
  none: 'No dream shards yet. Heroes sometimes find them at landmarks.',
  foundAt: 'Found at {place} by {hero}',
};
