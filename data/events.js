// Story events: small moments where the player picks what the hero does, from 2 or 3 options.
// They happen now and then on the road, and sometimes on arriving in a town.
// All numbers are starting values to tune during playtests.

export const eventSettings = {
  roadMinGapSeconds: 20,   // walking time after a road event before another can happen
  roadChancePerSecond: 0.06, // after the gap, the chance of a road event per second of walking
  townChance: 0.25,        // the chance of a town event on arriving in a town
  tagBonus: 0.08,          // each point the hero has in an option's tag adds this to its chance
  bestChance: 0.95,        // no chancy option succeeds more often than this
  // Tremors: the Sleeper stirs, the map shakes, and a tremor event follows (see the end of the list).
  tremorsPerLife: [1, 2],  // each life has between this many tremors
  tremorAges: [22, 66],    // ...at random ages between these (the tremor waits until the hero is walking)
};

// Every event:
//   id       a short name for the save (letters and hyphens; keep it the same once players have it)
//   where    'road' (while walking), 'town' (on arriving in a town), 'dungeon' (a strange room
//            in a dungeon) or 'tremor' (when the Sleeper stirs; these also need an `opening`
//            line, logged as the ground shakes)
//   regions  where it can happen (optional; anywhere if left out). Region ids are in regions.js
//   levels   [lowest, highest] hero levels it can happen at (optional)
//   quirk    only heroes with this quirk get it (optional; quirk ids are in quirks.js)
//   fromAct  it only happens from this act of the story on (optional; 4 is Sweet Dreams, see story.js)
//   untilAct ...or only up to this act (optional)
//   weight   how common it is next to the others (optional; 1 if left out)
//   title    the card's title. Start it with "The" or "A", since the log may use it in a sentence
//   text     what the hero sees, shown on the card
//   options  2 or 3 choices. Each has:
//     text     the button
//     tag      Might, Arcane, Faith, Cunning or Wild. Auto-decide picks the option matching
//              the hero's strongest tag, and heroes strong in the tag succeed more often
//     chance   how often it works, from 0 to 1, before the tag bonus (leave out if it always works)
//     success  what happens when it works, and failure what happens when it doesn't
//
// What can happen (all optional, apart from `line`):
//   line      logged in the adventure log (keep under about 70 characters)
//   gold: 2   gold worth this many fights at the hero's level (negative loses gold)
//   xp: 1     experience worth this many fights at the hero's level
//   hp: -0.2  heals or hurts by this share of max HP (0.2 is 20%). A hurt can be fatal!
//   potions: 1               healing potions gained
//   item: 'drop'             an item like a monster drop, at the hero's level
//   item: { rarity: 'rare', slot: 'helm' }   a particular rarity and/or slot
//   fight: 'Mimic'           a fight with that monster (not in town events)
//   fight: { monster: 'Mimic', levels: 2 }   ...and this many levels stronger than usual
//   fight: { levels: 1 }     a fight with a monster from the region the hero is in
//   reveal: 12               lifts the fog this many tiles around the hero
//   blessing: { name: 'Hedge Blessing', effects: { boost: { maxHp: 0.1 } }, seasons: 24 }
//             effects like a skill's (see skills.js) that last this many seasons
//   rest: 2   seasons spent here (the hero heals as they wait)

export const events = [
  // ---- Anywhere on the road ----
  {
    id: 'troll-bridge', where: 'road',
    title: 'The Troll Bridge',
    text: 'A troll lives under the bridge ahead. It demands a toll: three riddles, or one good sandwich.',
    options: [
      {
        text: 'Charge the troll', tag: 'Might', chance: 0.55,
        success: { line: 'knocked a troll off its own bridge and took its toll box.', gold: 3 },
        failure: { line: 'lost a wrestling match with a troll, and swam home.', hp: -0.25 },
      },
      {
        text: 'Answer its riddles', tag: 'Arcane', chance: 0.55,
        success: { line: 'out-riddled a troll, who wept and paid them to leave.', gold: 2, xp: 1 },
        failure: { line: 'got a troll riddle wrong, and paid it to stop gloating.', gold: -1 },
      },
      {
        text: 'Share your sandwich', tag: 'Faith',
        success: { line: 'shared a sandwich with a troll. A lovely afternoon.', hp: 0.2, xp: 0.5 },
      },
    ],
  },
  {
    id: 'stuck-merchant', where: 'road',
    title: 'A Stranded Merchant',
    text: "A merchant's cart has lost a wheel in a ditch. The merchant looks hopeful. The mule does not.",
    options: [
      {
        text: 'Lift the cart out', tag: 'Might',
        success: { line: "heaved a merchant's cart out of a ditch, and was given a gift.", item: 'drop' },
      },
      {
        text: 'Haggle for their stock', tag: 'Cunning', chance: 0.6,
        success: { line: 'haggled a stranded merchant down to almost nothing.', item: { rarity: 'uncommon' } },
        failure: { line: 'was out-haggled by a merchant sitting in a ditch.', gold: -1 },
      },
      {
        text: 'Bless the mule', tag: 'Faith',
        success: { line: "blessed a merchant's mule. The mule seemed moved.", potions: 1 },
      },
    ],
  },
  {
    id: 'hedge-shrine', where: 'road',
    title: 'The Shrine in the Hedge',
    text: 'A tiny shrine hides in the hedgerow, with a bowl for offerings and a sign that says PLEASE.',
    options: [
      {
        text: 'Leave an offering', tag: 'Faith',
        success: {
          line: 'left a coin at a hedge shrine and felt oddly sturdier.', gold: -0.5,
          blessing: { name: 'Hedge Blessing', effects: { boost: { maxHp: 0.1 } }, seasons: 24 },
        },
      },
      {
        text: 'Study the carvings', tag: 'Arcane', chance: 0.7,
        success: { line: 'read the old runes on a hedge shrine, and learned a little.', xp: 1.5 },
        failure: { line: 'read the runes on a hedge shrine upside down.' },
      },
      {
        text: 'Pocket the offerings', tag: 'Cunning', chance: 0.5,
        success: { line: "emptied a hedge shrine's bowl. Nobody saw. Probably.", gold: 2 },
        failure: { line: 'robbed a hedge shrine and was chased off by its bees.', hp: -0.2 },
      },
    ],
  },
  {
    id: 'wizard-tower', where: 'road',
    title: 'A Tower That Was Not There Yesterday',
    text: 'A crooked tower stands where no tower stood yesterday. Its door knocker is fast asleep.',
    options: [
      {
        text: 'Knock loudly', tag: 'Might', chance: 0.5,
        success: { line: "woke a door knocker and was let into a wizard's library.", xp: 2 },
        failure: { line: "knocked too hard on a wizard's door, which bit them.", hp: -0.15 },
      },
      {
        text: 'Say the magic word', tag: 'Arcane', chance: 0.6,
        success: { line: "said the magic word and was given a wizard's spare trinket.", item: { rarity: 'rare', slot: 'trinket' } },
        failure: { line: 'said the wrong magic word. The tower walked off.' },
      },
      {
        text: 'Climb in a window', tag: 'Cunning', chance: 0.55,
        success: { line: "crept into a wizard's tower and borrowed two potions.", potions: 2 },
        failure: { line: "climbed into a wizard's tower, and straight back out of it.", hp: -0.2 },
      },
    ],
  },
  {
    id: 'old-knight', where: 'road',
    title: 'The Forgetful Knight',
    text: 'An old knight blocks the road, demanding a duel to settle a matter he cannot quite remember.',
    options: [
      {
        text: 'Accept the duel', tag: 'Might', chance: 0.6,
        success: { line: 'bested an old knight, who gave them his lucky helm.', item: { slot: 'helm' } },
        failure: { line: 'lost a duel to an old knight, who was very kind about it.', hp: -0.2 },
      },
      {
        text: 'Help him remember', tag: 'Faith',
        success: { line: 'helped an old knight recall his quarrel. It was about a hat.', xp: 1 },
      },
      {
        text: 'Insist he already won', tag: 'Cunning',
        success: { line: 'convinced an old knight he had already won. He left happy.', xp: 0.5 },
      },
    ],
  },
  {
    id: 'snared-wolf', where: 'road',
    title: 'A Wolf in a Snare',
    text: "A wolf lies tangled in a poacher's snare, growling at everything, including the snare.",
    options: [
      {
        text: 'Free it gently', tag: 'Wild', chance: 0.65,
        success: {
          line: 'freed a wolf from a snare. It ran beside them for a while.',
          blessing: { name: "Wolf's Company", effects: { boost: { power: 0.1 } }, seasons: 20 },
        },
        failure: { line: 'freed a snared wolf, and was bitten for the trouble.', hp: -0.2 },
      },
      {
        text: 'Bandage its leg', tag: 'Faith',
        success: { line: "bandaged a wolf's leg. It licked their hand, suspiciously.", xp: 1 },
      },
      {
        text: "Leave it for someone else", tag: 'Cunning',
        success: { line: 'decided the wolf was somebody else\'s problem.' },
      },
    ],
  },

  // ---- The Tailwoods ----
  {
    id: 'fairy-dance', where: 'road', regions: ['tailwoods', 'fens'],
    title: 'A Ring of Glowing Mushrooms',
    text: 'A ring of mushrooms glows faintly in the grass. A small voice inside invites them to dance.',
    options: [
      {
        text: 'Dance!', tag: 'Wild', chance: 0.6,
        success: { line: 'danced in a fairy ring all night and woke up refreshed.', hp: 1, potions: 1 },
        failure: { line: 'danced in a fairy ring and lost a whole year to it.', rest: 4 },
      },
      {
        text: 'Decline politely', tag: 'Faith',
        success: { line: 'politely declined a fairy dance. The fairies sulked.', xp: 0.3 },
      },
      {
        text: 'Pick the mushrooms', tag: 'Cunning', chance: 0.5,
        success: { line: 'picked glowing mushrooms and sold them for a tidy sum.', gold: 2 },
        failure: { line: "picked a fairy ring's mushrooms. The fairies picked back.", hp: -0.2 },
      },
    ],
  },
  {
    id: 'goose-standoff', where: 'road', regions: ['tailwoods'],
    title: 'A Goose in the Road',
    text: 'A goose stands in the middle of the road, honking at the sky, the road, and now at them.',
    options: [
      {
        text: 'Stand your ground', tag: 'Might',
        success: { line: 'stood their ground against a goose. The goose stood its ground too.', fight: 'Indignant Goose' },
      },
      {
        text: 'Offer it some bread', tag: 'Wild', chance: 0.7,
        success: {
          line: 'fed a goose some bread and made a friend for life.',
          blessing: { name: 'Goose Friendship', effects: { dodge: 5 }, seasons: 24 },
        },
        failure: { line: 'offered a goose bread. It took the bread, and a finger.', hp: -0.1 },
      },
      {
        text: 'Go the long way round', tag: 'Cunning',
        success: { line: 'went the long way round a goose. It took all day.', rest: 1 },
      },
    ],
  },

  // ---- Hindhill Farms ----
  {
    id: 'scarecrow-head', where: 'road', regions: ['hindhill'],
    title: "The Scarecrow's Complaint",
    text: 'A scarecrow waves them over and explains, quite politely, that it has the wrong head.',
    options: [
      {
        text: 'Help it find the right one', tag: 'Faith',
        success: { line: 'helped a scarecrow find its real head, a lovely pumpkin.', xp: 1, potions: 1 },
      },
      {
        text: 'Sell it a turnip', tag: 'Cunning', chance: 0.6,
        success: { line: 'sold a scarecrow a turnip for a head. It was thrilled.', gold: 2 },
        failure: { line: 'tried to sell a scarecrow a turnip. It was not that kind of scarecrow.', fight: 'Possessed Scarecrow' },
      },
      {
        text: 'Tell it to stop talking', tag: 'Might',
        success: { line: 'told a scarecrow to stop talking. It took that badly.', fight: 'Possessed Scarecrow' },
      },
    ],
  },
  {
    id: 'runaway-cart', where: 'road', regions: ['hindhill'],
    title: 'A Runaway Hay Cart',
    text: 'A hay cart with no driver thunders down the hill towards a very small village.',
    options: [
      {
        text: 'Stop it bare-handed', tag: 'Might', chance: 0.6,
        success: { line: 'stopped a runaway hay cart with their bare hands.', xp: 1.5, gold: 1 },
        failure: { line: 'tried to stop a runaway cart and was run over, gently.', hp: -0.25 },
      },
      {
        text: 'Turn the horse aside', tag: 'Wild', chance: 0.7,
        success: { line: 'turned a runaway horse aside with a well-timed whinny.', xp: 1.5 },
        failure: { line: 'whinnied at a runaway horse. The horse was offended.', hp: -0.15 },
      },
      {
        text: 'Shout a warning', tag: 'Faith',
        success: { line: 'shouted a warning, and the village scattered in time.', xp: 0.5 },
      },
    ],
  },

  // ---- The Glittering Flank ----
  {
    id: 'buried-chest', where: 'road', regions: ['flank'],
    title: 'A Glint in the Ground',
    text: "Something golden pokes out of the earth. It might be treasure. It might be a Mimic's toe.",
    options: [
      {
        text: 'Dig it up', tag: 'Might', chance: 0.6,
        success: { line: 'dug up a buried chest full of old coins.', gold: 4 },
        failure: { line: 'dug up a buried chest. It had teeth.', fight: 'Mimic' },
      },
      {
        text: 'Feel for magic', tag: 'Arcane', chance: 0.7,
        success: { line: 'sensed a real treasure chest, and dug up a fine find.', item: { rarity: 'rare' } },
        failure: { line: 'felt no magic in a buried chest. It was hungry, not magic.', fight: 'Mimic' },
      },
      {
        text: 'Poke it with a stick', tag: 'Cunning',
        success: { line: 'poked a buried chest with a stick. It poked back, so they left.', xp: 0.3 },
      },
    ],
  },
  {
    id: 'goblin-toll', where: 'road', regions: ['flank'],
    title: 'The Goblin Toll Gate',
    text: 'A goblin in a very official hat has built a toll gate in the middle of an open field.',
    options: [
      {
        text: 'Pay the toll', tag: 'Faith',
        success: { line: 'paid a goblin toll. The hat was very convincing.', gold: -1, xp: 0.5 },
      },
      {
        text: 'Refuse to pay', tag: 'Might',
        success: { line: 'refused to pay a goblin toll. The goblin took it personally.', fight: 'Treasure Goblin' },
      },
      {
        text: 'Forge a pass', tag: 'Cunning', chance: 0.65,
        success: { line: 'forged a toll pass and sold copies to other travelers.', gold: 3 },
        failure: { line: 'forged a toll pass. The goblin forged a better fine.', gold: -1.5 },
      },
    ],
  },

  // ---- The Wingshade Fens ----
  {
    id: 'frog-prince', where: 'road', regions: ['fens'],
    title: 'The Frog Who Would Be Prince',
    text: 'A pompous frog on a lily pad claims to be a cursed prince, and asks for a kiss to break it.',
    options: [
      {
        text: 'Kiss the frog', tag: 'Faith', chance: 0.4,
        success: { line: 'kissed a frog who became a prince and paid handsomely.', gold: 5 },
        failure: { line: 'kissed a frog. It was just a frog, but a very happy one.', xp: 0.5 },
      },
      {
        text: 'Look for the curse', tag: 'Arcane', chance: 0.6,
        success: { line: 'lifted a curse from a frog prince, and got a royal reward.', item: { rarity: 'rare' } },
        failure: { line: 'found no curse on a frog. It croaked, rudely.' },
      },
      {
        text: 'Ask the other frogs', tag: 'Wild',
        success: { line: 'asked around the pond. The frog is not a prince.', xp: 0.5 },
      },
    ],
  },
  {
    id: 'giant-dewdrop', where: 'road', regions: ['fens'],
    title: 'A World Grown Enormous',
    text: 'Everything around them swells to enormous size. A dewdrop as big as a boulder rolls past.',
    options: [
      {
        text: 'Ride the dewdrop', tag: 'Wild', chance: 0.6,
        success: {
          line: 'rode a giant dewdrop across the fens. Marvelous.',
          blessing: { name: 'Dewdrop Glow', effects: { healing: 0.4 }, seasons: 20 },
        },
        failure: { line: 'rode a giant dewdrop straight into a puddle.', hp: -0.1 },
      },
      {
        text: 'Study the dream', tag: 'Arcane', chance: 0.6,
        success: { line: 'studied a waking dream and understood a little more.', xp: 2 },
        failure: { line: 'studied a waking dream and got a headache for it.', hp: -0.1 },
      },
      {
        text: 'Wait until it passes', tag: 'Faith',
        success: { line: 'waited until the world was the right size again.', rest: 2 },
      },
    ],
  },

  // ---- The Spine Peaks ----
  {
    id: 'polite-joust', where: 'road', regions: ['spine'],
    title: 'A Knight Requests a Joust',
    text: 'A knight in full armor blocks the pass and asks, very politely, for a joust.',
    options: [
      {
        text: 'Accept the joust', tag: 'Might', chance: 0.55,
        success: { line: 'unhorsed a very polite knight in a fair joust.', item: { slot: 'helm', rarity: 'uncommon' } },
        failure: { line: 'was politely unhorsed by a knight.', hp: -0.25 },
      },
      {
        text: 'Decline with a bow', tag: 'Faith',
        success: {
          line: 'declined a joust so graciously the knight blessed them.',
          blessing: { name: 'Knightly Grace', effects: { boost: { defense: 0.1 } }, seasons: 20 },
        },
      },
      {
        text: 'Mention his horse is a goat', tag: 'Cunning', chance: 0.6,
        success: { line: 'pointed out the knight was riding a goat. He left, red-faced.', xp: 1.5 },
        failure: { line: 'pointed out the knight was riding a goat. The goat charged.', hp: -0.15 },
      },
    ],
  },
  {
    id: 'avalanche', where: 'road', regions: ['spine'],
    title: 'A Rumble of Snow',
    text: 'High above, the snow begins to slide, gathering speed and noise on its way down.',
    options: [
      {
        text: 'Run for it', tag: 'Wild', chance: 0.6,
        success: { line: 'outran an avalanche with one enormous leap.', xp: 1.5 },
        failure: { line: 'was buried in snow for an afternoon.', hp: -0.15, rest: 2 },
      },
      {
        text: 'Shelter behind a rock', tag: 'Cunning',
        success: { line: 'sheltered behind a rock as the snow roared past.', rest: 1 },
      },
      {
        text: 'Hold it back with a spell', tag: 'Arcane', chance: 0.5,
        success: { line: 'held back an avalanche with a shimmering wall.', xp: 2 },
        failure: { line: 'tried to stop an avalanche with a spell. It did not stop.', hp: -0.3 },
      },
    ],
  },

  // ---- The Clawlands ----
  {
    id: 'ghost-general', where: 'road', regions: ['claws'],
    title: 'The Ghost General',
    text: 'A ghostly general reviews troops that are no longer there, and orders them to report.',
    options: [
      {
        text: 'Salute and report', tag: 'Might',
        success: {
          line: 'reported for duty to a ghostly general, who was pleased.',
          blessing: { name: "Old Soldier's Drill", effects: { boost: { power: 0.1 } }, seasons: 20 },
        },
      },
      {
        text: 'Tell him the war is over', tag: 'Faith', chance: 0.6,
        success: { line: 'told a ghost the war was over. He wept, and faded.', xp: 2 },
        failure: { line: 'told a ghost the war was over. He did not believe it.', fight: 'Phantom Soldier' },
      },
      {
        text: 'Quietly desert', tag: 'Cunning',
        success: { line: 'deserted an army that no longer existed.', xp: 0.3 },
      },
    ],
  },
  {
    id: 'supply-wagon', where: 'road', regions: ['claws'],
    title: 'A Rusted Supply Wagon',
    text: 'An old army wagon lies half-buried, its crates still sealed with wax.',
    options: [
      {
        text: 'Pry it open', tag: 'Might', chance: 0.6,
        success: { line: 'pried open an old army wagon, still full of supplies.', potions: 2, gold: 2 },
        failure: { line: 'pried open an old wagon. Something was still guarding it.', fight: 'Buried Legionnaire' },
      },
      {
        text: 'Read the manifest', tag: 'Arcane',
        success: { line: "read an old wagon's manifest and found its hidden drawer.", item: 'drop' },
      },
      {
        text: 'Leave it for the dead', tag: 'Faith',
        success: { line: 'left the old wagon for the soldiers who never came back for it.', xp: 0.5 },
      },
    ],
  },

  // ---- Smokecrown ----
  {
    id: 'empty-chair', where: 'road', regions: ['smokecrown'],
    title: 'The Empty Chair',
    text: 'In a little house in the ash, an old man has set the table for two. The other chair is empty. "They\'ll be along," he says.',
    options: [
      {
        text: 'Sit and keep him company', tag: 'Faith',
        success: {
          line: 'kept an old man company over supper. He talked all night.',
          blessing: { name: 'Good Company', effects: { boost: { maxHp: 0.1 } }, seasons: 20 },
        },
      },
      {
        text: 'Go and look for his guest', tag: 'Cunning', chance: 0.5,
        success: { line: "found an old man's long-lost friend, and walked them home.", xp: 2, reveal: 10 },
        failure: { line: 'searched the ash for an old man\'s friend, and found only smoke.', hp: -0.15 },
      },
      {
        text: 'Mend his roof', tag: 'Might',
        success: { line: "mended an old man's roof. He pressed a coin into their hand.", gold: 2 },
      },
    ],
  },
  {
    id: 'unsent-letter', where: 'road', regions: ['smokecrown'],
    title: 'A Letter Never Sent',
    text: 'A letter tumbles along the road in the hot wind. It is addressed "To whoever finds this."',
    options: [
      {
        text: 'Read it aloud', tag: 'Arcane',
        success: { line: 'read a lonely letter aloud to the smoke. Something listened.', xp: 1.5 },
      },
      {
        text: 'Write a reply', tag: 'Faith', chance: 0.7,
        success: {
          line: 'wrote a kind reply to a letter nobody sent, and felt lighter.',
          blessing: { name: 'A Kind Word', effects: { healing: 0.5 }, seasons: 20 },
        },
        failure: { line: 'wrote a reply. The wind snatched it, and brought company.', fight: 'Fading Shade' },
      },
      {
        text: 'Pocket it', tag: 'Cunning',
        success: { line: 'pocketed a lost letter. It had a coin folded inside.', gold: 1 },
      },
    ],
  },
  {
    id: 'ember-rain', where: 'road', regions: ['smokecrown'],
    title: 'A Rain of Embers',
    text: 'Far off, the Smoking Nostril sneezes. Glowing embers begin to fall like red snow.',
    options: [
      {
        text: 'Run for cover', tag: 'Wild', chance: 0.6,
        success: { line: 'dodged a rain of embers, dancing all the way.', xp: 1.5 },
        failure: { line: 'was singed all over by a rain of embers.', hp: -0.2 },
      },
      {
        text: 'Hold up a shield', tag: 'Might',
        success: { line: 'held up a shield against a rain of embers. It glowed for days.', rest: 1 },
      },
      {
        text: 'Catch one in a jar', tag: 'Arcane', chance: 0.5,
        success: { line: 'caught an ember in a jar. It makes a lovely lamp.', item: 'drop' },
        failure: { line: 'tried to catch an ember. It caught fire, and grew.', fight: 'Ember Wisp' },
      },
    ],
  },

  // ---- Sweet Dreams: once the dragon sleeps peacefully (Act 4), one for each region ----
  {
    id: 'badger-tea', where: 'road', regions: ['tailwoods'], fromAct: 4, weight: 2,
    title: "A Badger's Tea Party",
    text: 'In a clearing, a dozen badgers sit around a tiny table, pouring tea. One of them pulls out a chair.',
    options: [
      {
        text: 'Sit down for tea', tag: 'Faith',
        success: {
          line: 'had tea with a dozen badgers. Not one of them was grumpy.',
          blessing: { name: 'Well Rested', effects: { healing: 0.5 }, seasons: 20 },
        },
      },
      {
        text: 'Bring out a cake', tag: 'Cunning',
        success: { line: 'brought cake to a badger tea party, and left with a gift.', item: 'drop' },
      },
      {
        text: 'Teach them a song', tag: 'Arcane', chance: 0.7,
        success: { line: 'taught a dozen badgers the lullaby. They sang it well.', xp: 2 },
        failure: { line: 'sang for some badgers, who politely asked them to stop.', xp: 0.5 },
      },
    ],
  },
  {
    id: 'pumpkin-coach', where: 'road', regions: ['hindhill'], fromAct: 4, weight: 2,
    title: 'The Pumpkin Coach',
    text: 'A pumpkin the size of a cart rolls up beside the road, and a little door in its side swings open.',
    options: [
      {
        text: 'Climb in', tag: 'Wild', chance: 0.7,
        success: { line: 'rode a pumpkin coach across the fields, very fast.', reveal: 14, xp: 1 },
        failure: { line: 'rode a pumpkin coach into a ditch. Soup everywhere.', hp: -0.1 },
      },
      {
        text: 'Carve it a smile', tag: 'Might',
        success: { line: 'carved a smile into a pumpkin coach. It smiled back.', gold: 2 },
      },
      {
        text: 'Ask where it goes', tag: 'Arcane',
        success: { line: 'asked a pumpkin coach where it went. "Wherever," it said.', reveal: 10 },
      },
    ],
  },
  {
    id: 'generous-mimic', where: 'road', regions: ['flank'], fromAct: 4, weight: 2,
    title: 'A Generous Mimic',
    text: 'A treasure chest waddles up, opens its lid, and offers its contents. It seems to have given up biting.',
    options: [
      {
        text: 'Accept the gift', tag: 'Faith',
        success: { line: 'accepted a gift from a mimic. It wagged its lid.', item: { rarity: 'rare' } },
      },
      {
        text: 'Check for teeth first', tag: 'Cunning',
        success: { line: 'checked a friendly mimic for teeth. Gold teeth, as it happened.', gold: 3 },
      },
      {
        text: 'Give it something back', tag: 'Might',
        success: {
          line: 'gave a mimic their old boots. It was delighted.',
          blessing: { name: 'Good Deed', effects: { boost: { luck: 0.2 } }, seasons: 20 },
        },
      },
    ],
  },
  {
    id: 'tiny-parade', where: 'road', regions: ['fens'], fromAct: 4, weight: 2,
    title: 'The Tiny Parade',
    text: 'A parade of beetles, newts and one very proud snail marches through the reeds, beating tiny drums.',
    options: [
      {
        text: 'Join the parade', tag: 'Wild',
        success: { line: 'marched in a parade of beetles and newts, and kept the beat.', xp: 1.5 },
      },
      {
        text: 'Throw petals', tag: 'Faith',
        success: {
          line: 'threw petals for a tiny parade. The snail bowed.',
          blessing: { name: 'Small Joys', effects: { boost: { maxHp: 0.1 } }, seasons: 20 },
        },
      },
      {
        text: 'Offer to lead it', tag: 'Might', chance: 0.6,
        success: { line: 'led a tiny parade all the way to Fenmoot. A triumph.', xp: 2, gold: 1 },
        failure: { line: 'tried to lead a tiny parade, and stepped on the drummer.', xp: 0.3 },
      },
    ],
  },
  {
    id: 'gardening-knight', where: 'road', regions: ['spine'], fromAct: 4, weight: 2,
    title: 'A Knight at Leisure',
    text: 'A rusted knight has hung up his sword and planted a garden in his helmet. He waves a trowel.',
    options: [
      {
        text: 'Help him weed', tag: 'Wild',
        success: { line: 'weeded a knight\'s helmet garden. He gave them a carrot.', hp: 0.3, xp: 1 },
      },
      {
        text: 'Ask for his advice', tag: 'Faith',
        success: {
          line: 'asked a retired knight for advice. "Rest," he said.',
          blessing: { name: 'Old Soldier\'s Calm', effects: { boost: { defense: 0.1 } }, seasons: 20 },
        },
      },
      {
        text: 'Challenge him to a friendly joust', tag: 'Might', chance: 0.6,
        success: { line: 'won a friendly joust with a gardening knight.', item: { slot: 'helm', rarity: 'rare' } },
        failure: { line: 'lost a friendly joust to a gardening knight, and a trowel.', hp: -0.1 },
      },
    ],
  },
  {
    id: 'soldiers-home', where: 'road', regions: ['claws'], fromAct: 4, weight: 2,
    title: 'The Ghosts Go Home',
    text: 'A column of phantom soldiers marches past, singing, with flowers stuck in their helmets. The war is over.',
    options: [
      {
        text: 'Salute them', tag: 'Might',
        success: {
          line: 'saluted a ghost army marching home. They saluted back.',
          blessing: { name: 'Honor Guard', effects: { boost: { power: 0.1 } }, seasons: 20 },
        },
      },
      {
        text: 'Sing along', tag: 'Faith',
        success: { line: 'sang with a ghost army on its way home. It was the lullaby.', xp: 2 },
      },
      {
        text: 'Ask what they will do now', tag: 'Cunning',
        success: { line: 'asked some ghosts their plans. "Bees," said one. "Maybe bees."', xp: 0.5, gold: 1 },
      },
    ],
  },
  {
    id: 'lamps-out', where: 'road', regions: ['smokecrown'], fromAct: 4, weight: 2,
    title: 'The Lamps Go Out',
    text: 'Folk from Lastlight are walking the roads, blowing out the lanterns one by one. Nobody out here is lost any more.',
    options: [
      {
        text: 'Help blow them out', tag: 'Faith',
        success: { line: 'helped blow out the lanterns of Smokecrown, one by one.', xp: 2 },
      },
      {
        text: 'Keep one as a keepsake', tag: 'Cunning',
        success: { line: 'kept a lantern from Smokecrown. It still glows, faintly.', item: { slot: 'trinket' } },
      },
      {
        text: 'Light a bonfire instead', tag: 'Arcane',
        success: {
          line: 'lit a bonfire in Smokecrown, and everyone came to sit by it.',
          blessing: { name: 'Warm Company', effects: { healing: 0.4, boost: { maxHp: 0.05 } }, seasons: 20 },
        },
      },
    ],
  },

  // ---- Only for heroes with a particular quirk ----
  {
    id: 'gaggle', where: 'road', quirk: 'afraid-of-geese', weight: 3,
    title: 'A Gathering of Geese',
    text: 'Geese. Dozens of them, in a field beside the road. Every single one is looking this way.',
    options: [
      {
        text: 'Face your fear', tag: 'Might', chance: 0.45,
        success: {
          line: 'stared down a whole gaggle of geese. The fear is less now.',
          blessing: { name: 'Goose Courage', effects: { against: { bird: 0.3 } }, seasons: 40 },
        },
        failure: { line: 'stared down a gaggle of geese. The geese stared back harder.', hp: -0.2 },
      },
      {
        text: 'Run for it', tag: 'Cunning',
        success: { line: 'fled a field of geese at a truly impressive speed.', xp: 0.3 },
      },
      {
        text: 'Bribe them with bread', tag: 'Wild', chance: 0.6,
        success: { line: 'bribed a gaggle of geese with bread. An uneasy peace.', xp: 1 },
        failure: { line: 'offered a gaggle bread. The gaggle wanted all the bread.', gold: -1 },
      },
    ],
  },
  {
    id: 'sword-opinion', where: 'road', quirk: 'talks-to-sword', weight: 3,
    title: 'The Sword Has Opinions',
    text: 'Their sword insists they leave the road, and will not stop going on about it.',
    options: [
      {
        text: 'Follow the sword', tag: 'Might', chance: 0.7,
        success: { line: 'followed their sword off the road, to a hidden cache.', item: 'drop', gold: 1 },
        failure: { line: 'followed their sword into a bog. The sword apologized.', rest: 1 },
      },
      {
        text: 'Argue with it', tag: 'Arcane', chance: 0.6,
        success: { line: 'won an argument with their own sword. It sulked, but sharper.', blessing: { name: 'Sulking Sword', effects: { boost: { power: 0.1 } }, seasons: 16 } },
        failure: { line: 'lost an argument with their own sword. Awkward.' },
      },
      {
        text: 'Ignore it', tag: 'Faith',
        success: { line: 'ignored their sword all afternoon. Peace at last.', hp: 0.2 },
      },
    ],
  },
  {
    id: 'hopelessly-lost', where: 'road', quirk: 'no-sense-of-direction', weight: 3,
    title: 'A Road That Is Now a Field',
    text: 'The road has become a field, which has become a different field. Nothing is where it should be.',
    options: [
      {
        text: 'Ask a cow for directions', tag: 'Wild', chance: 0.6,
        success: { line: 'asked a cow for directions. The cow was right.', xp: 1 },
        failure: { line: 'asked a cow for directions. The cow was wrong.', rest: 2 },
      },
      {
        text: 'Navigate by the stars', tag: 'Arcane', chance: 0.6,
        success: {
          line: 'followed the stars, and found a forgotten shrine.',
          blessing: { name: 'Starlight', effects: { boost: { luck: 0.2 } }, seasons: 20 },
        },
        failure: { line: 'followed the wrong star for most of a week.', rest: 2 },
      },
      {
        text: 'Walk on confidently', tag: 'Might',
        success: { line: 'walked on confidently until the wrong way became the right one.', rest: 1 },
      },
    ],
  },
  {
    id: 'spoon-fair', where: 'town', quirk: 'collects-spoons', weight: 3,
    title: 'The Traveling Spoon Fair',
    text: 'A traveling spoon fair has come to town. There are spoons as far as the eye can see.',
    options: [
      {
        text: 'Hunt for the rarest spoon', tag: 'Cunning', chance: 0.6,
        success: { line: 'found the rarest spoon at the fair. It was enchanted!', item: { rarity: 'rare', slot: 'trinket' } },
        failure: { line: 'bought the rarest spoon at the fair. It was a fork.', gold: -1 },
      },
      {
        text: 'Swap spoons with collectors', tag: 'Wild',
        success: {
          line: 'swapped spoons with fellow collectors all afternoon. Bliss.',
          blessing: { name: 'Spoon Contentment', effects: { healing: 0.3 }, seasons: 20 },
        },
      },
      {
        text: 'Show off the collection', tag: 'Faith',
        success: { line: 'showed their spoon collection to a very polite crowd.', xp: 0.5 },
      },
    ],
  },

  // ---- In towns ----
  {
    id: 'tavern-brawl', where: 'town',
    title: 'A Tavern Brawl',
    text: 'A brawl breaks out in the tavern over whether a turnip counts as a fruit.',
    options: [
      {
        text: 'Join in', tag: 'Might', chance: 0.6,
        success: { line: 'won a tavern brawl, and several free drinks.', xp: 1, gold: 1 },
        failure: { line: 'lost a tavern brawl, and a tooth.', hp: -0.2 },
      },
      {
        text: 'Calm everyone down', tag: 'Faith', chance: 0.7,
        success: { line: 'settled a tavern brawl with a stern speech.', xp: 1.5 },
        failure: { line: 'tried to stop a tavern brawl, and was hit by a chair.', hp: -0.15 },
      },
      {
        text: 'Slip out with the tip jar', tag: 'Cunning', chance: 0.6,
        success: { line: 'slipped out of a tavern brawl with the tip jar.', gold: 2 },
        failure: { line: 'was caught with the tip jar and made to wash dishes.', rest: 2 },
      },
    ],
  },
  {
    id: 'wishing-well', where: 'town',
    title: 'The Wishing Well',
    text: 'The town well is said to grant wishes. Mostly small ones.',
    options: [
      {
        text: 'Toss in a coin', tag: 'Faith', chance: 0.6,
        success: {
          line: 'tossed a coin in the wishing well and felt lucky.', gold: -0.5,
          blessing: { name: 'Luck of the Well', effects: { boost: { luck: 0.3 } }, seasons: 20 },
        },
        failure: { line: 'made a wish at the well. The well said no.', gold: -0.5 },
      },
      {
        text: 'Fish out the coins', tag: 'Cunning', chance: 0.5,
        success: { line: 'fished the wishing well for coins. Nobody wished them well.', gold: 3 },
        failure: { line: 'fell into the wishing well, which was not the wish.', hp: -0.1, rest: 1 },
      },
      {
        text: 'Just draw some water', tag: 'Wild',
        success: { line: 'drew water from the wishing well. It was just water. Nice.', hp: 0.3 },
      },
    ],
  },
  {
    id: 'fortune-teller', where: 'town',
    title: 'The Fortune Teller',
    text: 'A fortune teller with a cracked crystal ball offers to read their future, for a small fee.',
    options: [
      {
        text: 'Pay for a reading', tag: 'Arcane', chance: 0.7,
        success: {
          line: 'had their fortune told, and dodged a falling pot the next day.', gold: -0.5,
          blessing: { name: "Fortune's Favor", effects: { dodge: 8 }, seasons: 20 },
        },
        failure: { line: 'was told of a tall, dark stranger. Nothing came of it.', gold: -0.5 },
      },
      {
        text: 'Expose the fraud', tag: 'Cunning', chance: 0.6,
        success: { line: 'exposed a fake fortune teller, and collected a reward.', gold: 2 },
        failure: { line: 'accused a fortune teller of fraud. She saw that coming.' },
      },
      {
        text: 'Bless the crystal ball', tag: 'Faith',
        success: { line: 'blessed a cracked crystal ball. It cracked a little less.', xp: 0.5 },
      },
    ],
  },
  {
    id: 'pie-contest', where: 'town', regions: ['hindhill'],
    title: 'The Pie-Eating Contest',
    text: 'The town is holding a pie-eating contest. The reigning champion is a very large goose.',
    options: [
      {
        text: 'Enter and eat', tag: 'Might', chance: 0.5,
        success: { line: 'beat a goose in a pie-eating contest. Glory!', gold: 2, xp: 0.5 },
        failure: { line: 'lost a pie-eating contest to a goose. Humbling.', hp: -0.1 },
      },
      {
        text: 'Judge the pies', tag: 'Faith',
        success: {
          line: 'judged a pie contest fairly, and took home the leftovers.',
          blessing: { name: 'Full Belly', effects: { healing: 0.3 }, seasons: 16 },
        },
      },
      {
        text: 'Bet on the goose', tag: 'Cunning', chance: 0.6,
        success: { line: 'bet on the goose in a pie contest and won handsomely.', gold: 3 },
        failure: { line: 'bet on the goose. The goose let everyone down.', gold: -1 },
      },
    ],
  },

  // ---- In dungeons: forks, traps and puzzles (the "strange rooms" of dungeons.js) ----
  {
    id: 'two-passages', where: 'dungeon',
    title: 'Two Passages',
    text: 'The tunnel splits. From the left comes a deep snoring. From the right, a faint glint of gold.',
    options: [
      {
        text: 'Creep left, quietly', tag: 'Cunning', chance: 0.6,
        success: { line: 'crept past something snoring, and borrowed from its stash.', item: 'drop' },
        failure: { line: 'crept past something snoring. It woke up.', fight: { levels: 1 } },
      },
      {
        text: 'Follow the glint', tag: 'Wild',
        success: { line: 'followed a glint of gold to a small pile of coins.', gold: 2 },
      },
      {
        text: 'March left, loudly', tag: 'Might',
        success: { line: 'marched towards the snoring, loudly. It stopped.', fight: { levels: 1 }, xp: 0.5 },
      },
    ],
  },
  {
    id: 'suspicious-flagstone', where: 'dungeon',
    title: 'A Suspicious Flagstone',
    text: 'One flagstone in the floor is much cleaner than all the others.',
    options: [
      {
        text: 'Step around it', tag: 'Cunning',
        success: { line: 'stepped carefully around a suspicious flagstone.', xp: 0.5 },
      },
      {
        text: 'Jump over it', tag: 'Wild', chance: 0.7,
        success: { line: 'leapt a trapped flagstone with room to spare.', xp: 1 },
        failure: { line: 'landed on the flagstone. Darts, everywhere.', hp: -0.2 },
      },
      {
        text: 'Disarm the trap', tag: 'Arcane', chance: 0.6,
        success: { line: 'disarmed a dart trap, and kept the darts.', gold: 1, xp: 1 },
        failure: { line: 'tried to disarm a trap. The trap won.', hp: -0.2 },
      },
    ],
  },
  {
    id: 'riddling-door', where: 'dungeon',
    title: 'The Riddling Door',
    text: 'A door with a stone face asks: "What has keys, but opens no locks?"',
    options: [
      {
        text: '"A piano!"', tag: 'Arcane', chance: 0.7,
        success: { line: 'answered a riddling door. It swung open, pleased.', item: 'drop' },
        failure: { line: 'answered a riddling door wrongly. It sulked, but opened.' },
      },
      {
        text: 'Kick it', tag: 'Might', chance: 0.6,
        success: { line: 'kicked a riddling door open. It stopped asking.', xp: 1 },
        failure: { line: 'kicked a riddling door. It kicked back.', hp: -0.15 },
      },
      {
        text: 'Flatter it', tag: 'Cunning', chance: 0.7,
        success: { line: 'flattered a riddling door until it opened, blushing.', xp: 1 },
        failure: { line: 'flattered a riddling door. It saw right through it.' },
      },
    ],
  },
  {
    id: 'sleeping-guard', where: 'dungeon',
    title: 'A Sleeping Guard',
    text: 'Something large sleeps across the passage, snoring gently.',
    options: [
      {
        text: 'Sneak past', tag: 'Cunning', chance: 0.65,
        success: { line: 'tiptoed past a sleeping monster.', xp: 1 },
        failure: { line: 'stepped on a twig. The monster woke up.', fight: { levels: 1 } },
      },
      {
        text: 'Strike while it sleeps', tag: 'Might',
        success: { line: 'struck first at a sleeping monster.', fight: { levels: 0 } },
      },
      {
        text: 'Sing it deeper asleep', tag: 'Faith', chance: 0.6,
        success: { line: 'sang a monster deeper asleep and slipped by.', xp: 1.5 },
        failure: { line: 'sang to a sleeping monster, which woke to complain.', fight: { levels: 1 } },
      },
    ],
  },
  {
    id: 'forgotten-shrine', where: 'dungeon',
    title: 'A Forgotten Shrine',
    text: 'A small shrine glows in an alcove, beside a bowl of perfectly still water.',
    options: [
      {
        text: 'Drink the water', tag: 'Faith',
        success: { line: 'drank from a forgotten shrine and felt restored.', hp: 0.5 },
      },
      {
        text: 'Study its glow', tag: 'Arcane',
        success: {
          line: 'studied a glowing shrine until some of the glow stayed.',
          blessing: { name: "Shrine's Glow", effects: { skillDamage: 0.15 }, seasons: 16 },
        },
      },
      {
        text: 'Take the silver bowl', tag: 'Cunning', chance: 0.5,
        success: { line: 'took a silver bowl from a shrine. Nothing happened.', gold: 3 },
        failure: { line: 'took the shrine bowl. The shrine took offense.', hp: -0.25 },
      },
    ],
  },
  {
    id: 'groaning-ceiling', where: 'dungeon',
    title: 'The Ceiling Groans',
    text: 'Dust trickles down. The whole hall is about to come down.',
    options: [
      {
        text: 'Run for it', tag: 'Wild', chance: 0.7,
        success: { line: 'dashed through a collapsing hall just in time.', xp: 1 },
        failure: { line: 'was caught under falling stones.', hp: -0.25 },
      },
      {
        text: 'Hold it up', tag: 'Might', chance: 0.5,
        success: { line: 'held up a falling ceiling long enough to get through.', xp: 2 },
        failure: { line: 'held up a falling ceiling. Briefly.', hp: -0.3 },
      },
      {
        text: 'Find another way', tag: 'Cunning',
        success: { line: 'found a side passage around a collapsing hall.', rest: 1 },
      },
    ],
  },

  // ---- Tremors: when the Sleeper stirs, one of these happens (each at most once a life) ----
  {
    id: 'tremor-snore', where: 'tremor',
    title: 'The Sleeper Snores',
    opening: 'heard a long, low rumble roll across the land, like a snore.',
    text: 'A rumble rolls across the land, long and low, and a great warm wind rises at their back.',
    options: [
      {
        text: 'Ride the wind', tag: 'Wild',
        success: {
          line: 'let the snoring wind carry them along at a gallop.',
          blessing: { name: 'Snore Winds', effects: { travelSpeed: 0.5 }, seasons: 12 },
        },
      },
      {
        text: 'Listen closely', tag: 'Arcane', chance: 0.6,
        success: { line: 'heard a half-remembered tune, deep inside the snore.', xp: 2 },
        failure: { line: 'listened to the snore until their ears rang.' },
      },
      {
        text: 'Take shelter', tag: 'Faith',
        success: { line: 'sheltered from the great wind and said a small prayer.', hp: 0.3 },
      },
    ],
  },
  {
    id: 'tremor-roll', where: 'tremor',
    title: 'The Ground Rolls Over',
    opening: 'felt the whole world tilt, as if something vast rolled over.',
    text: 'The land tilts, groans and settles. Where there was a hillside, a cave mouth now yawns.',
    options: [
      {
        text: 'Explore the new cave', tag: 'Might', chance: 0.6,
        success: { line: 'explored a cave the tremor had opened, and found treasure.', item: { rarity: 'rare' } },
        failure: { line: 'explored a new cave, which closed again rather suddenly.', hp: -0.2 },
      },
      {
        text: 'Climb up and look around', tag: 'Wild',
        success: { line: 'climbed high after the tremor and saw far across the land.', reveal: 14 },
      },
      {
        text: 'Map the new ground', tag: 'Cunning',
        success: { line: 'mapped the land the tremor had rearranged.', reveal: 10, xp: 0.5 },
      },
    ],
  },
  {
    id: 'tremor-sneeze', where: 'tremor',
    title: 'A Great Sneeze',
    opening: 'heard something sneeze, far away to the north-east.',
    text: 'Far to the north-east, something sneezes. Smoke rises, and warm ash drifts down like snow.',
    options: [
      {
        text: 'Shield others from the ash', tag: 'Faith', chance: 0.7,
        success: { line: 'sheltered a village from falling ash. They were grateful.', gold: 2, xp: 1 },
        failure: { line: 'sheltered a village from ash, and caught a nasty cough.', hp: -0.15 },
      },
      {
        text: 'Catch a falling ember', tag: 'Arcane', chance: 0.5,
        success: { line: 'caught a glowing ember from the sky. It hums with warmth.', item: { rarity: 'rare', slot: 'trinket' } },
        failure: { line: 'tried to catch a falling ember. It was hot.', hp: -0.2 },
      },
      {
        text: 'Keep your head down', tag: 'Cunning',
        success: { line: 'kept their head down until the ash stopped falling.', rest: 1 },
      },
    ],
  },
  {
    id: 'tremor-sigh', where: 'tremor',
    title: 'The Ground Sighs',
    opening: 'felt the ground tremble, then sigh, very softly.',
    text: 'The ground trembles, and for a moment it seems to sigh, like a sleeper having a bad dream.',
    options: [
      {
        text: 'Sing it a lullaby', tag: 'Faith', chance: 0.5,
        success: {
          line: 'sang to the trembling ground, and it grew calm. Odd.',
          blessing: { name: 'Lullaby Calm', effects: { healing: 0.4 }, seasons: 20 },
        },
        failure: { line: 'sang to the ground. The ground did not care for the key.' },
      },
      {
        text: 'Press an ear to the ground', tag: 'Wild',
        success: { line: 'pressed an ear to the ground and heard a vast, slow heartbeat.', xp: 1.5 },
      },
      {
        text: 'Hold on tight', tag: 'Might',
        success: { line: 'held on tight until the shaking stopped.', hp: 0.1 },
      },
    ],
  },
  {
    id: 'tremor-crack', where: 'tremor',
    title: 'A Crack in the Road',
    opening: 'saw the road split with a crack, and something climb out.',
    text: 'A long crack opens across the road, and something climbs out of it, blinking in the light.',
    options: [
      {
        text: 'Fight it', tag: 'Might',
        success: { line: 'faced whatever climbed out of the crack.', fight: { levels: 1 } },
      },
      {
        text: 'Push it back down', tag: 'Cunning', chance: 0.6,
        success: { line: 'shoved a half-woken dream back down its crack.', xp: 1.5 },
        failure: { line: 'tried to push a dream back down a crack. It pushed back.', fight: { levels: 2 } },
      },
      {
        text: 'Seal the crack', tag: 'Faith', chance: 0.6,
        success: {
          line: 'sealed a crack in the road with a stern prayer.', xp: 1,
          blessing: { name: 'Steady Ground', effects: { boost: { defense: 0.1 } }, seasons: 16 },
        },
        failure: { line: 'prayed over a crack in the road, which widened rudely.', hp: -0.15 },
      },
    ],
  },
  {
    id: 'tremor-scales', where: 'tremor', regions: ['flank'],
    title: 'The Ground Ripples Like Scales',
    opening: 'watched the ground ripple like scales, and coins spill out.',
    text: 'The ground ripples like scales settling, and old coins spill up out of the earth.',
    options: [
      {
        text: 'Gather the coins', tag: 'Cunning',
        success: { line: 'gathered coins shaken loose from the ground by a tremor.', gold: 3 },
      },
      {
        text: 'Look for where they came from', tag: 'Arcane', chance: 0.5,
        success: { line: 'traced the coins to a buried golden scale, and a relic beside it.', item: { rarity: 'rare' } },
        failure: { line: 'looked for the source of the coins, and found only mud.' },
      },
      {
        text: 'Leave them be', tag: 'Faith',
        success: {
          line: 'left the shaken-loose coins where they lay. It felt right.',
          blessing: { name: 'Clear Conscience', effects: { boost: { luck: 0.2 } }, seasons: 16 },
        },
      },
    ],
  },
];

// Words on the event cards and in the log. {words} are filled in automatically.
export const eventText = {
  // How the odds of a chancy option look on the card, from the hero's actual chance.
  odds: [[0.75, 'Likely'], [0.5, 'Could go either way'], [0, 'Risky']],
  swordOdds: 'The sword says {percent}%', // instead, for heroes who talk to their sword
  died: 'never recovered from {event}.',  // logged when an event's hurt is fatal. {event} is its title
  // Logged when an event's item is better than what the hero wears. {a} is the item.
  newItem: ['put on {a} straight away.', 'tried on {a}. A perfect fit.'],
  blessingFaded: 'felt the {blessing} fade away.', // {blessing} is its name
};
