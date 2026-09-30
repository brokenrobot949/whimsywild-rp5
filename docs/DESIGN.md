# Whimsywild RP5 — Game Design Document

Snapshot of Rob's design doc, September 25, 2026. This file is the design source of truth for Claude Code. When a design decision changes, update this file.

## Overview

Whimsywild RP5 is a whimsical high-fantasy browser RPG where each hero lives one five-minute adventure, and every life reveals more of the shared world of Whimsywild. The "RP5" in the name plays on "RPG" and the five-minute session.

Each session rolls a new hero who quests, levels up, evolves their class and gathers loot until they die or retire. The tone is in the spirit of HeroQuest: grounded, traditional fantasy with whimsy in the names, flavor text, monsters and events.

The player guides but never controls. They choose skills, destinations and story outcomes, while the hero travels, fights, loots and equips on their own. Whimsywild RP5 builds on Go Quest's lifespan and Chronicle ideas, compressed to five minutes, with a persistent world map as the long-term progression.

**Design pillars**

- **Five minutes, one life.** Every session is a complete story with a beginning, middle and end.
- **Guide, don't control.** The player shapes the hero through choices; the hero acts on their own.
- **The world remembers.** The map, conquests, graves and story persist across every hero.
- **Every hero matters.** Even a hero who dies early adds to the map, the Hall of Champions and the finale.

**Reference games:** Reigns (short lives, persistent story), Rogue Legacy (a new hero each run), Hades (story advances through death), Progress Quest (the adventure log as entertainment).

## The Hero's Life

A hero's life is measured in years: about 50 in-game years pass over 5 real minutes, ending in retirement or death. Age is the clock that keeps every run close to five minutes; death is the risk that cuts it short.

| Parameter | Starting value |
| --- | --- |
| Starting age | 18 |
| Real time per in-game year | ~6 seconds (one season ≈ 1.5 seconds) |
| Can choose to retire | Age 60+, while in a town |
| Automatic retirement | Age ~70 |
| Target game time per life | 3–5 minutes, plus time spent on choices |

The log timestamps events by season and age, for example "Autumn, age 34: slew the Moss Wyrm."

**How a life ends**

- **Death** can happen in combat or through risky events. The hero leaves a grave on the map where they fell.
- **Retirement** happens by choice in a town from age 60, or automatically around 70. The hero settles in that town as a mentor. A hero who reaches 70 away from a town settles in the last town they visited. The card that asks whether to retire says how many mentors the town has already, and when it has its full three, which of them would step back.

Retirement should always be the better outcome for future heroes. That creates real tension around risky choices late in life.

**Decision budget**

| Decision | When it happens | Per life |
| --- | --- | --- |
| Skill pick (choose 1 of 3) | Every 3 levels | ~8 |
| Class evolution (choose 1 of 2) | Levels 5 and 15 | 2 |
| Destination (choose a rumor) | Leaving a town or camp | 3–5 |
| Story event (choose 1 of 2–3) | On the road, in dungeons, in towns | 4–6 |
| Retire now? | In a town, age 60+ | 0–1 |

That totals about 17–22 decisions, roughly one every 15–20 seconds. This keeps the player involved without turning the game into a clicker.

**Pausing**

- Every choice pauses the clock, so nobody is rushed while reading.
- The game pauses automatically when the browser tab or app is hidden.
- An **Auto-decide** setting lets the hero make each choice after a short delay, for fully idle play. The hero decides based on their tags (rules below).

**Auto-decide rules**

- **Skill picks and class evolution:** the option that best matches the hero's highest tags.
- **Story events:** every option carries a tag ("Charge the troll" is Might, "Trick it" is Cunning), and the hero picks the option matching their top tag, so heroes act in character.
- **Rumors:** the one that best suits the hero: a region that fits their level, not too far away.
- **Retirement:** at the first town visit after age 65.

**Story events**

- They happen now and then while the hero walks, and sometimes on arriving in a town, about 4–6 per life. Each event happens at most once per life, and some belong to one region.
- Every option carries a tag. Some options always work; others are chancy, and each point the hero has in the option's tag makes success likelier. The card shows the odds in words: Likely, Could go either way, or Risky.
- Outcomes can give or take gold, give experience, potions or an item, heal or hurt (a hurt can be fatal), start a fight, cost time, or grant a blessing: a small bonus that lasts a few years and is listed on the Hero tab.

## Hero Creation

Each hero is rolled automatically with a name, an origin and a quirk; before the life begins, the player picks a starting town and can reroll or rename the hero. The hero starts at that town's recruitment level (see World Map).

**Origins** give a small nudge toward one skill tag and a starting item. Target 15 origins for v1, three per tag.

| Origin | Tag nudge | Starting item |
| --- | --- | --- |
| Turnip Farmer | Wild | Sturdy Pitchfork |
| Failed Bard | Cunning | Out-of-Tune Lute |
| Knight's Stable Hand | Might | Borrowed Helmet |
| Temple Candle-Snuffer | Faith | Blessed Snuffer |
| Wizard's Apprentice (Fired) | Arcane | Singed Spellbook |

The tag nudge is one starting point in that tag, which makes its skills likelier to be offered and counts towards classes and story-event odds. The starting item is a Common item of the hero's starting level; a recruit's Common weapon is only taken if it's better.

**Quirks** add a small modifier and unlock special events. Target 20 quirks for v1.

- **Afraid of Geese:** weaker against birds; unlocks goose-related events.
- **Talks to Their Sword:** the sword tells the exact odds of each option in story events.
- **Collects Spoons:** finds a little more loot.
- **Terrible Sense of Direction:** rumors occasionally lead somewhere unexpected.

Monsters belong to families (birds, plants, bugs and so on), so quirks like Afraid of Geese or Refuses to Eat Vegetables can make a hero weaker or stronger against a whole family.

**Names and epithets**

Names are generated from fantasy first and last name lists. Epithets are earned from deeds during the life, such as "Wendel Goblinbane" or "Gwendolyn the Mildly Brave." A hero who earns nothing gets a default epithet like "the Hopeful." A hero can earn a grander epithet later in life, which replaces the earlier one; the log announces each new epithet.

**Rerolls and custom names**

- The player can reroll up to 3 times per hero, changing the origin, quirk and generated name.
- The player can type their own hero name, up to 20 characters. A typed name stays through rerolls.
- Tonight's dream never rerolls, because it belongs to the world, not the hero. This stops players fishing for the best modifier.

## Classes & Skills

Class evolution emerges from skill choices: every skill carries one of five tags, and a hero's tag totals decide which classes they can become. Players never need to study a skill tree.

| Tag | Theme | Base class |
| --- | --- | --- |
| Might | Weapons, armor, strength | Fighter |
| Arcane | Spells and elements | Mage |
| Faith | Healing and holy power | Cleric |
| Cunning | Stealth, tricks and luck | Rogue |
| Wild | Beasts, nature and survival | Ranger |

**Evolution**

1. **Level 5, base class.** The player chooses between the base classes of their two highest tags.
2. **Level 15, advanced class.** The player chooses between the two advanced classes their tags best qualify for. There are 15: ten two-tag hybrids plus five single-tag masters.
3. **Legendary tier (post-v1 update).** A whimsical title class around level 30. It is not in v1, but class data leaves room for a third tier so it is easy to add.

Each evolution choice card shows the class name, a flavor line and its signature perk, so the pick feels meaningful. With Auto-decide on, the hero picks by their tags.

A hero keeps the perk of every class they take, so an advanced class adds its perk to the base class's rather than replacing it. When two advanced classes match the hero's tags equally, the two-tag blend is offered before a single-tag master.

**Advanced classes** (row + column = the two tags; the diagonal is the single-tag master)

|  | Might | Arcane | Faith | Cunning | Wild |
| --- | --- | --- | --- | --- | --- |
| **Might** | Champion | Spellblade | Paladin | Duelist | Barbarian |
| **Arcane** |  | Archmage | Oracle | Illusionist | Hedge Witch |
| **Faith** |  |  | High Priest | Friar | Druid |
| **Cunning** |  |  |  | Master Thief | Beastmaster |
| **Wild** |  |  |  |  | Warden |

Class names stay grounded; the whimsy lives in skill names and flavor text.

**Skills**

- Each skill pick offers three options, weighted toward the hero's current tags. At least one option is always off-tag, so a hero can pivot.
- Skills have three ranks. Picking a skill the hero already knows ranks it up.
- Active skills fire automatically in combat on cooldowns; passive skills apply all the time.
- Target 30 skills for v1, six per tag. Examples: Aggressive Shield Bash (Might), Fireball (Slightly Too Large) (Arcane), Stern Blessing (Faith), Borrow Permanently (Cunning), Squirrel Friend (Wild).

**Lullaby verses as skills**

Once any hero finds a lullaby verse, it can appear as a special, tag-free skill option for all future heroes. For example, the Verse of the Quiet Hills lets the hero lull monsters in that region to sleep. This is how story progress feeds directly into hero builds.

## Combat, Loot & Leveling

Combat, looting and equipping are fully automatic; a typical fight resolves in 2–5 seconds. The fun is watching it unfold in the adventure log.

**Combat**

- Fights are automatic exchanges shown in a small encounter card over the map, narrated line by line in the log.
- Core stats: HP, Power, Defense, Speed and Luck.
- The hero uses skills automatically in priority order and drinks potions below 30% HP.
- HP fully recovers in towns and slowly regenerates while traveling.

**Loot**

- Four gear slots: Weapon, Armor, Helm and Trinket.
- Five rarities: Common, Uncommon, Rare, Epic and Legendary.
- Item names carry the whimsy, for example "Mildly Enchanted Boots."
- The hero equips an item automatically if it scores better, with the score favoring the hero's tags.
- Gold is spent automatically in towns on potions and shop upgrades, and it counts toward lifetime stats.

**Leveling**

- A full life should reach roughly level 20–25 when starting from level 1.
- Early levels come fast (level 5 within about 45 seconds), then slow down.
- Each level grants automatic stat gains; every third level also offers a skill pick.

All numbers here are starting values to be tuned during Phase 1 playtests.

## World Map & Exploration

The world is one fixed map, identical for every player, shaped like a colossal sleeping dragon and hidden under fog until heroes explore it. Over many lives the fog lifts and the dragon's shape emerges; the map reveal is the story reveal.

**Map basics**

- A tile grid of roughly 200 × 200 tiles.
- Fog clears in a radius of 3–5 tiles around the hero and never returns. Its edges are drawn rounded, so the explored land curves rather than stepping in squares.
- Mountain ranges form the spine, a smoking volcano is the nostril, and a lake is the closed eye.
- Danger rises toward the head, where the dragon's dreams are strongest.

**Regions** (tail to head)

| Region | Body part | Dream theme | Example monsters | Levels | Town (recruit level) |
| --- | --- | --- | --- | --- | --- |
| The Tailwoods | Tail | A lazy summer | Grumpy badgers, slime puddles | 1–6 | Tailsend (1) |
| Hindhill Farms | Hind legs | Hunger | Living vegetables, pie golems | 5–10 | Haunchford (4) |
| The Glittering Flank | Side | Gold | Mimics, treasure goblins | 9–14 | Scaleport (8) |
| The Wingshade Fens | Folded wing | Being small | Giant frogs, enormous beetles | 13–18 | Fenmoot (12) |
| The Spine Peaks | Spine | Knights | Armored beasts, dragon-hunter ghosts | 17–22 | Ridgehold (16) |
| The Clawlands | Forelegs | An ancient war | Phantom soldiers, war drakes | 21–26 | Talonreach (20) |
| Smokecrown | Head | Loneliness (the deepest nightmare) | Lonely echoes, forgotten dolls, ember wisps | 25–30 | Lastlight (24) |

Place names are body-part puns (Tailsend, Haunchford, the Clawlands) that the townsfolk never question. They foreshadow the Act 2 reveal that the world is the dragon.

About three extra hamlets sit off the main paths as bonus discoveries, for roughly 10 towns total.

**Towns and recruitment levels**

Once discovered, a town becomes a starting point for future heroes. Heroes start at the town's recruitment level with modest gear (a Common weapon of that level), so every town is a real checkpoint. (Armor was dropped from the starting gear in the Phase 2 tuning, so a later start carries about the same risk of death as starting in Tailsend.) Before hearing their first rumors, they make the skill and class choices of the levels they skipped. Map rule: each region's main town must be reachable from the previous town within one good life.

**Steering with rumors**

- In a town or at camp, the player picks one of 2–3 rumors, each showing a rough direction and a danger rating of 1–3 skulls. A rumor leading somewhere no hero has found yet carries a teal "✦ Unexplored" badge, so new ground stands out.
- One rumor always suits the hero: a place that is near and in a region that fits their level. Auto-decide picks the best-suited rumor, weighing a level of mismatch against a walk of about 30 tiles. A town's new recruits, who start one level below its region, count as ready for that region.
- Example: "A dragon naps on Mount Grumble" or "The miller's cat vanished near the old ruins."
- The hero travels there automatically, with encounters and events along the way.
- At the rumor's end, the hero explores up to two nearby places in the same region on their own, then walks back to the nearest town if one is close; otherwise they make camp and hear the next rumors there.
- Rumor pools depend on the region, the story act and what has been discovered. Some rumors point into the fog.
- "?" markers at the fog's edge hint at undiscovered sites.

**Map features**

| Feature | What it is | What it does |
| --- | --- | --- |
| Town | Rest, shop, rumors, retirement | Becomes a starting point once found |
| Dungeon | A pocket of dream, 3–7 rooms | Loot; may hold a lullaby verse |
| Monster castle | A nightmare that took root, with a boss | Stays conquered for good; region danger drops; may hold a verse |
| Landmark or shrine | One-off point of interest | A temporary blessing or a dream shard (lore) |
| Grave | Where a past hero died | Pay respects to recover one heirloom |

In v1, dungeons and castles play as a sequence of rooms shown in a panel, not as separate maps.

**Dungeons**

There are 11 dungeons, spread across the seven regions (Smokecrown's, the Forgotten Attic, opens with Act 3). Each has a guardian, a monster from its region picked to be tough, such as the Grumpy Badger in the Snoring Burrow or the Siege Ogre in the Siege Tunnels. The numbers are in `data/dungeons.js`, and the dungeons themselves are places in `data/regions.js`.

- Rumors lead to dungeons like any other place, and the rumor card says "Dungeon". Rumors and Auto-decide treat a dungeon as 2 levels tougher than its region, so heroes are steered there once they've grown into the region.
- Going in, a panel over the map shows the dungeon's name, one pip per room and the room the hero is in ("Room 2 of 6: Something lurks here"). The hero goes through 4–6 rooms, then meets the guardian, then reaches the treasure.
- Rooms are drawn at random: fights (most often), treasure chests (gold, and sometimes an item), strange rooms (a story event, sometimes with a fork), and quiet alcoves (the hero rests and heals some HP). Heroes don't heal on their own inside, so every fight counts.
- The treasure at the end is a big pile of gold and a Rare, Epic or, rarely, Legendary item.
- Between rooms, a hero below half HP is asked whether to press on or retreat (not when only the treasure is left). Auto-decide retreats below 40% HP. Retreating leaves the dungeon uncleared.
- A hero who dies inside leaves a grave at the dungeon's door.
- Each hero can clear a dungeon once per life. Clearing one is a grand deed that can become the hero's greatest deed in the Hall of Champions, and two in one life earn the epithet "the Delver".
- Dungeons will hold some of the lullaby verses when those arrive.

With dungeons in, about 1 hero in 10 dies before retiring (11% from Tailsend, 6% Haunchford, 15% Scaleport, 12% Fenmoot, 7% Ridgehold, 7% Talonreach). An average life visits two dungeons and clears four in five of the ones it enters.

**Monster castles**

Each region has one monster castle, a nightmare that took root, held by a boss. There are seven; Smokecrown's, Hornhold, opens with Act 3. The numbers are in `data/castles.js`, the castles are places in `data/regions.js`, and the bosses are in `data/monsters.js`.

| Castle | Region | Boss | Special move |
| --- | --- | --- | --- |
| Stumptail Keep | The Tailwoods | Old Grizzlewick, a bear | Mighty Yawn: a light blow that leaves the hero drowsy, losing 3 seconds |
| Castle Hock | Hindhill Farms | The Glutton Lord | Second Helping: heals 15% of his health when hurt |
| Goldrib Hall | The Glittering Flank | Baron Goldtooth, a goblin | Coin Barrage: three quick blows |
| Pinion Tower | The Wingshade Fens | The Mossmother | Deep Roots: a heavy blow that heals her |
| Crookback Castle | The Spine Peaks | Sir Grimsby the Unyielding, a ghostly knight | Thundering Charge: a blow more than twice as hard |
| Knucklebone Fortress | The Clawlands | The Bone Marshal | Charge of the Dead: a heavy blow that staggers the hero |
| Hornhold | Smokecrown | The Forgotten King | Lonely Wail: two blows that leave the hero stunned |

- A castle plays like a dungeon, in the same panel over the map (with a red border): 5–7 rooms, mostly fights, then the boss, then the hoard. Monsters inside are a level above those outside.
- A boss always fights at the top of its region's levels, plus one, so a castle is hard for a hero just arriving in the region and easier for one who has outgrown it. Every few seconds the boss uses its special move instead of a plain blow, shown on the fight card. A boss fight lasts about 11 seconds, against about 3 for an ordinary fight.
- Rumors lead to castles like any other place. The card says "Castle" and shows one more danger skull than the region would (3 at most). Rumors and Auto-decide treat a castle as 3 levels tougher than its region.
- Heroes turn back sooner than in dungeons: a hero below 60% health is asked whether to press on, and Auto-decide retreats below 50%.
- The hoard holds a great pile of gold and an Epic or Legendary item.
- Beating the boss conquers the castle for good. Its banner flies on the map, it's no longer rumored, the Chronicle names the hero who conquered it, and the monsters of its region are 3% weaker from then on. Conquering a castle is the grandest deed so far and earns the epithet "the Castle-Breaker".
- A hero who retreats or falls leaves the castle as it was, and the boss is back to full strength for the next hero. A hero who falls inside leaves a grave at the gate.
- A hero who reaches retirement age inside a castle (or dungeon) finishes it before retiring.

Balance, from test runs: heroes who go into a castle conquer it about 65% of the time, retreat 27% and die 8%. While every castle still stands, about 9–18% of heroes die per life, depending on the starting town. In a save where castles stay conquered, most fall within the first 20–40 lives, and about 1 hero in 12 dies over that stretch. With every castle conquered, about 6 heroes in 100 die. (A 10% weaker region was tested first, but it made deaths almost vanish, about 2 in 100, so it was set to 3%.)

**Smokecrown**

The dragon's head, where it dreams of loneliness. Dream-mist covers it until Act 3 begins (`opensInAct: 3` in `data/regions.js`). When the mist lifts, it lifts at once, even in the middle of a hero's life, and that hero's log says so.

- **Lastlight** (recruitment level 24) sits below Lidwater, the lake that is the dragon's closed eye. Every window has a candle in it, just in case. Once a hero has found it, it's a starting town like any other.
- **Landmarks**, each with a dream shard: Lidwater, Jawbone Ridge, the Whisker Stones and the Smoking Nostril, joined to Lastlight by roads. The road from Ridgehold leads in.
- **The Forgotten Attic**, a dungeon of things nobody came back for, guarded by a Forgotten Doll.
- **Hornhold**, a castle on the tip of the dragon's horn, held by the Forgotten King, whom nobody remembers. It hides the seventh verse, "You Are Not Alone".
- **Monsters**: the Lonely Echo, Forgotten Doll, Fading Shade, Ember Wisp, Weeping Gargoyle and Ash Wyrm (levels 25–30). The region also has its own wandering lines, three story events (the Empty Chair, a Letter Never Sent, a Rain of Embers), and three epithets.
- Balance, from test runs: Smokecrown's monsters are tuned to be the most dangerous of any region, but only slightly. With every castle fallen and no region calmed, about 7 in 100 Lastlight heroes die, against about 4 from Talonreach. Small changes matter here: 4% tougher monsters doubled the deaths, so they were set 3% above the starting numbers. While Hornhold stands, about 14 in 100 Lastlight heroes die, mostly to the Forgotten King (Hornhold attempts: about half conquered, 43% retreat, 8% die). Once it falls, about 3 in 100.

**Tremors**

One or two times per life, the dragon stirs and something happens mid-run. A snore sends strong winds that speed travel. A roll-over shifts terrain to reveal a hidden cave. A sneeze makes the volcano erupt, bringing fire monsters. Tremors are good moments for story choices.

In the game, each life has one or two tremors at random ages between 22 and 66. When one comes due, the next time the hero is walking the map shakes, a rumble is logged, and a tremor event follows: a story event of its own kind (the Sleeper snores, the ground rolls over, a great sneeze, the ground sighs, a crack in the road, the ground ripples like scales). Tremor outcomes can also lift the fog far around the hero or bring a monster out of the ground. The map doesn't change shape; the "hidden cave" and "fire monsters" play out as story choices until later phases add dungeons and the volcano.

## Story: The Sleeping Dragon

Sominus, a colossal dragon, sleeps beneath the world of Whimsywild, trapped in a nightmare, and heroes across many lives recover a lost lullaby to soothe it back into peaceful sleep. The dragon is not a villain, and the ending is not a boss kill.

**Premise**

Centuries ago, the dragon was sung to sleep with a lullaby. The song was forgotten, and now the dragon is stuck in a nightmare. Its dreams leak into the world as monsters, and its restless stirring causes tremors. In Act 1, people know it only as the Sleeper; its true name, Sominus, echoes Somnus, the Roman god of sleep.

**Three acts**

Acts advance with world progress, never with hero count, so the story never feels like a grind.

| Act | What players learn | Advances when |
| --- | --- | --- |
| 1. The Stirring | Tremors are growing; taverns tell legends of the Sleeper. Monsters seem like ordinary threats. | The first monster castle is conquered |
| 2. The Dreamlands | Monsters are the dragon's dreams, and the world is the dragon. Its true name, Sominus, is revealed. A lullaby once put it to sleep; its 7 verses are scattered across the regions. | 5 of the 6 verses of the open regions are found |
| 3. The Waking | The heart of the nightmare is loneliness: the dragon fears the world has forgotten it. The head region opens. | All verses found and Smokecrown reached |
| 4. Sweet Dreams (the post-game) | The dragon sleeps peacefully, and its dreams turn gentle and a little strange. | Never ends: it begins when the song is sung |

In the game (numbers in `data/story.js`):

- The world starts in Act 1. Act 2 begins the moment the first castle is conquered, and Act 3 once 5 of the 6 verses of the open regions are found.
- The hero whose deed begins an act gets a line in their log, such as "felt the ground sigh, as if something far below had turned over."
- Each act's interlude is a card shown before the next hero is rolled (between heroes, never mid-life). Act 2's names Sominus and tells of the lost lullaby, and Act 3's reveals the dragon's loneliness and that the smoke over Smokecrown is thinning.
- Tavern talk changes with the act. A hero arriving in a town sometimes overhears a line (3 times in 10), from the Sleeper's legends in Act 1 to the dragon's name in Act 2 and its loneliness in Act 3.
- The Chronicle shows the current act.
- When Act 3 begins, the dream-mist lifts from Smokecrown at once (the hero whose deed began it sees it lift, in their log). See "Smokecrown" above.
- In test runs of a save that uses all six towns, Act 2 begins within the first 1–3 lives, and Act 3 after about 25–50 lives.

**The lullaby**

There are 7 verses, one per region, each hidden in a dungeon or a monster castle. A found verse is found permanently and becomes a skill option for every future hero.

In the game (numbers in `data/verses.js`), there are seven verses. Smokecrown's, in Hornhold, can only be found once Act 3 has opened the region.

| Verse | Region | Hidden in | Skill |
| --- | --- | --- | --- |
| Hush, Little Hills | The Tailwoods | Snoring Burrow (dungeon) | Heal faster while traveling |
| Warm Bread, Warm Bed | Hindhill Farms | Root Cellar (dungeon) | More max HP |
| Count the Golden Sheep | The Glittering Flank | Goldrib Hall (castle) | More gold and luck |
| Small Things Sleep Soundly | The Wingshade Fens | Pinion Tower (castle) | Dodge more often |
| The Knight Lays Down His Lance | The Spine Peaks | Barrow of Knights (dungeon) | A blow that lulls the monster, stunning it |
| The Drums Grow Quiet | The Clawlands | Knucklebone Fortress (castle) | A heal when badly hurt |
| You Are Not Alone | Smokecrown | Hornhold (castle) | A little more power, defense and max HP |

- Verses can only be found once the lullaby is known, from Act 2 on.
- A verse in a dungeon is well hidden: each hero who clears that dungeon has a 1 in 4 chance to find it. A verse in a castle is always found by the hero who conquers the castle. (If a castle fell before the lullaby was known, the next hero to visit it finds the verse.)
- While a verse is lost, rumors about its hiding place come up twice as often, with an extra rumor that hints at the song.
- Finding a verse is logged with a music-box phrase of the lullaby. It's a grand deed, earns the epithet "the Songfinder", and the Chronicle shows each found verse's words and who found it.
- Each verse is a skill with three ranks, like any other, but with no tag: its card shows a purple "Lullaby" chip. Found verses join the skills offered at skill picks for every later hero. Learning one doesn't add to any tag, so it doesn't shape the hero's class. Auto-decide rates a verse one point below the hero's strongest tag.
- Once every verse is found, about half of heroes learn one.

**The finale**

In Smokecrown, a hero enters the dragon's deepest nightmare as a special dream dungeon, fights through it and sings. The lullaby's last verse was never written; it is the stories of the heroes who came looking.

The ending scrolls the name, epithet and greatest deed of every hero the player ever ran. Those stories are what finally soothe the dragon, so every hero, even one who died in the first minute, is part of the ending.

In the game (numbers in `data/finale.js`):

- **The way in.** When the seventh verse is found, the way into the dragon's dream opens through Lidwater, the closed eye by Lastlight. That hero's log says so, a violet sparkle appears over Lidwater on the map, and Lidwater's rumors change ("Lidwater has opened. They say you can walk into the dream."). Those rumors come up three times as often, and the card says "The Deepest Nightmare". Rumors and Auto-decide treat it as 5 levels tougher than Smokecrown, so heroes are steered there at about level 30 and up. A hero wandering nearby never walks in by accident: only a chosen rumor leads there.
- **The Deepest Nightmare** plays in the same panel as dungeons and castles, with a violet border. It has eight rooms: a dream from each region in turn, tail to head ("A dream of a lazy summer", "A dream of hunger" and so on to "A dream of loneliness"), then the song. In each dream the hero gets back a little health (10%) and fights one of that region's monsters at their own level plus 2, so the early dreams are gentle and the later ones are hard.
- **The song.** The last room is the Nightmare itself, fought at the hero's own level. As it weakens, the hero sings the lullaby one verse at a time, each logged and shown on the fight card. The seventh verse comes as the Nightmare finally curls up and sleeps. It isn't a kill: the dragon is sung to sleep.
- **Turning back.** Between rooms, a hero below 70% health is asked whether to press on; Auto-decide turns back below 65%. There's no turning back once the song begins. A hero who turns back wakes beside Lidwater, and one who falls leaves a grave there. Either way the Nightmare waits, unchanged, for the next hero.
- **The ending.** The hero who finishes the song ends their life right there, as Rob chose. They become "the Lullaby-Singer", and their greatest deed is "Sang Sominus to sleep." After their end card, the ending scrolls every hero ever run, oldest first, with the singer last (it can be skipped). Then Act 4 begins: its interlude card, "Sominus Sleeps", comes before the next hero, and play goes on. The Chronicle's story line then reads "Sominus sleeps, sung to sleep by…". See "After the ending" below.
- **Debug:** "Next act" in Act 3 finds the remaining verses, opening the way in. "Preview ending" plays the ending with the heroes so far, without changing the save.
- Balance, from test runs: heroes who go in sing the dragon to sleep about half the time, turn back 43% and die 9%. A visit takes about 45 seconds, and the song fight about 15. From a fresh world, the whole story took about 45–90 lives. The way in opened when Hornhold fell, and the first hero or two to go in sang the dragon to sleep.

**After the ending**

The dragon sleeps peacefully and its dreams turn pleasant. The world stays open, with gentler but stranger dream content and new rumors to explore.

In the game, this is Act 4, **Sweet Dreams** (numbers in `sweetDreams` in `data/story.js`). It begins the moment the song is sung and never ends:

- Its interlude, "Sominus Sleeps", is shown before the first hero after the ending.
- **Gentler:** every region's monsters are 3% weaker, on top of any castle's calm. The dragon never again dreams of storms or giants, the two dangerous dreams. With every castle fallen, about 6 heroes in 100 die without the extra calm; with it, and the gentler dreams, about 3 in 100.
- **Stranger dreams:** four new dreams can only come in Act 4: Picnics (fewer fights, more gold), Lanterns (quicker travel, more story events), Upside-Down (more experience and luck), and Old Friends (every hero who came before waves hello; wounds mend fast).
- **Stranger events:** one new story event for each region, only in Act 4: a badgers' tea party, a pumpkin coach, a generous mimic, a tiny parade of beetles and newts, a knight who has taken up gardening, ghost soldiers marching home, and Lastlight's folk blowing out their lanterns because nobody is lost any more. About one hero in two meets one.
- **New rumors:** 14 places have new rumors in Act 4 ("The Tail's Tip has started wagging, very slowly."), and the tavern talk changes again.
- Everything else goes on as before: castles stay conquered, verses are still offered as skills, and the Nightmare stays closed.
- **Debug:** "Next act" in Act 3 with every verse found sings the song in the name of "Debug", so Act 4 can be tried straight away.

**Tonight's dream**

Every life opens with a run modifier describing what the dragon dreams about tonight. Target 12 for v1.

- **Dreams of gold:** more treasure, more mimics.
- **Dreams of rain:** fens spread, fire is weaker.
- **Dreams of feasts:** food heals double, pie golems roam.

A dream can give every hero an effect (like a skill's), make some monsters commoner, make all monsters a little tougher, or change how often fights and story events happen. Each new hero after a finished life gets a new dream, never the same one twice in a row, and it stays the same through rerolls and changes of starting town. It shows on the New Hero card, the hero strip, the Hero tab and the Hall of Champions, and its own line opens the adventure log. Most dreams are gentle; a couple (Giants, Storms) roughly double the risk of death, in exchange for more experience or more fights.

**How lore is delivered**

- **Dream shards:** short lore entries found at landmarks and collected in the Chronicle. Target about 30. Each landmark holds one shard (30 in all, 4 of them in Smokecrown). A hero arriving at a landmark whose shard is still waiting has a 25% chance to find it, and each hero finds at most one per life, so the collection fills over a few dozen lives. The Chronicle lists found shards with who found them, and finding one earns the epithet "the Dreamfinder". In Act 1 the shards only hint at what the Sleeper is.
- **Rumors and tavern talk** carry legends and hints.
- **Act transitions** play as a short interlude between heroes.

## Persistence & Legacy

Everything a hero discovers or changes stays in the world for every hero after them; only the hero's own level, gear and gold are lost.

| What persists | How it carries forward |
| --- | --- |
| Revealed map | Fog stays lifted permanently |
| Discovered towns | Become starting towns for future heroes |
| Conquered castles | Stay conquered, with the conquering hero's banner on the map and their name in the Chronicle; the region's monsters are 3% weaker from then on. (Hamlets that open up once a castle falls are still to come) |
| Lullaby verses | Found for good (from Act 2 on), listed with their words in the Chronicle, and offered as skills to every future hero |
| Dream shards | Saved as lore entries in the Chronicle |
| Graves | A dead hero leaves a tombstone where they fell; a later hero passing by can pay respects and recover one heirloom (their best item, scaled to the new hero) |
| Mentors | Retired heroes settle in a town, and each of the town's three most recent mentors gives a future hero starting there one gift, drawn at random from a pool: usually a lesson, some gold or a few class tricks, sometimes something valuable, sometimes a funny dud. Older retirees stay listed as residents |
| Hall of Champions and Chronicle | Every hero and every lifetime stat is recorded |

Graves and mentors make death and retirement feel different: death leaves an heirloom out in the world, while retirement strengthens a town for everyone who starts there.

**How mentors work**

- From age 60, arriving in a town asks whether to retire there. Auto-decide retires at the first town visit from age 65. A hero who reaches 70 on the road retires to the last town they visited.
- The retired hero becomes the town's newest mentor. Each town remembers its 12 most recent retirees, listed in the Chronicle; the newest three are its mentors.
- Each of the town's three newest mentors gives a new hero one gift, drawn at random from a pool (Rob's idea), so heroes from the same town start a little differently. The New Hero card lists each mentor's gift, the log opens with them, and the Hero tab keeps them. Rerolling a hero draws the gifts again.
- The pool, most common first: a lesson (the mentor's best skill is always an option at the first skill pick), a purse of gold, a few class tricks (a small share of the mentor's class perk); less often a healing potion, the mentor's old gear, or starting one level higher; rarely a treasured heirloom (a Rare item) or a masterclass (a free rank in the mentor's best skill); and now and then a dud, such as a piece of bad advice, which does nothing at all.
- A mentor who retired at a higher level gives better gifts: their valuable gifts get likelier and their duds rarer.
- Early fights are where most heroes die, so gifts that help at the start matter a lot; one extra potion or one old item roughly halves a hero's chance of dying young. In testing, three mentors take deaths from about 10% to about 5%, and heroes who draw two strong gifts rarely die. Rob chose to keep it that way: a town with mentors is a real reward for building it up over many lives, rather than making monsters tougher everywhere to compensate.
- (Earlier, Rob chose a lesson offered at the first pick over a free skill rank, since a free rank from one mentor cut deaths from about 12% to about 3%. The free rank now lives on as the rare masterclass gift.)
- Heroes who retired before mentors existed were settled in the town their ending names.

## Interface

Whimsywild RP5 is designed mobile-first in portrait, with the live adventure on one screen and tabs for the hero and the records. On wide screens the map sits on the left and the panels on the right.

**Bottom navigation:** Adventure · Hero · Chronicle · Hall of Champions

**Adventure screen (during a life)**

- **World Map (top, about 40% on phones):** follows the hero's sprite; the player can drag and pinch to look around the revealed world. On phones, while a choice card is open, the map shrinks to about a fifth of the screen so the whole card fits without scrolling (except on the New Hero card, where the map shows the towns).
- **Hero strip:** name and epithet, class, age, level, HP bar and tonight's dream.
- **Adventure log (bottom):** scrolling, whimsical narration of every fight, find and event, stamped by season and age.
- **Choice cards** slide up over the log and pause the clock.
- **Encounter cards** pop over the map briefly during fights.

**New Hero screen (between lives)**

The full World Map shows every discovered town and its recruitment level. The player picks a town, sees the rolled hero (name, origin, quirk, tonight's dream), can reroll up to 3 times or type a name, then taps Begin.

**Hero tab**

Stats, class and evolution path, tag totals, skills and ranks, equipped gear, origin and quirk, and this life's full log.

**Chronicle tab**

- Lifetime stats: heroes run, total years adventured, monsters slain, gold found, map percentage revealed, towns found, castles conquered, verses found, most common cause of death, most-played class and longest life.
- The story so far, at the top: one section for each act the world has reached, which opens with a tap to retell that act. The current act starts open, marked "now", with a "What's next" hint (for example, how many verses are found). Acts not yet reached stay hidden. The rest of the Chronicle is grouped under The world, Heroes and Mentors, then monster castles, the lullaby and dream shards.

**Hall of Champions tab**

One card per hero, newest first. Each card shows:

- Name and epithet, final class and level
- Age at the end, and starting town
- Greatest deed
- How it ended, in whimsical terms: "Swallowed by a mimic pretending to be a smaller mimic" or "Retired to Haunchford to raise geese"

Tapping a card opens that hero's full adventure log.

**Settings**

How to play (a short guide for new players, one topic per tap, in `data/help.js`), then mute, separate music and sound effect volume, and the Auto-decide toggle. Settings are remembered between sessions. If a phone refuses to start the sound, the game stays silent and tries again at the next tap, without showing an error; any error message that does appear has a close button.

## Technical Architecture

Whimsywild RP5 is a static multi-file website: plain HTML, CSS and JavaScript with no build step and no CDN, hosted on GitHub Pages. Every file the game needs lives in the repository.

**Folder structure**

```
whimsywild-rp5/
  index.html
  CLAUDE.md
  docs/
    DESIGN.md        this file
  css/
    style.css
  js/
    main.js          startup and game loop
    engine/          hero, combat, map, story, save, ui
  data/              classes, skills, origins, quirks, monsters,
                     items, events, rumors, regions, dreams, story
  assets/
    tiles/           map tiles
    sprites/         hero and monster sprites
```

**Engine and data stay separate.** All content lives in `data/` as plain lists of names, numbers and text. Rob can tune numbers and rewrite flavor text without touching game logic, and each system can change without disturbing the others.

**Code structure**

- JavaScript modules (`import`/`export`) connect the files.
- Because of modules, double-clicking `index.html` will not run the game. Testing needs a local server, which Claude Code can start, or the live GitHub Pages URL.
- A fixed-rate game loop drives the simulation. It pauses on choices and when the tab is hidden.
- Each hero uses a seeded random generator, so a buggy run can be replayed exactly.

**Debug mode**

Adding `?debug` to the URL shows a game-speed control (1×, 5×, 20×), the hero's seed, a save reset and a playtest log. The log records each life's length, final level and ending, so batches of lives can be checked against the five-minute target.

**Saves**

- Autosave to the browser's localStorage at key moments: each discovery, each choice and the end of every life.
- The save format carries a version number so future updates can upgrade old saves.
- Export and import saves as a text code. Progress is tied to one browser and device, and clearing site data erases it, so the backup matters.

**Rendering and map**

- The World Map is drawn on an HTML canvas using 16 × 16 pixel tiles, scaled up crisply. Only the visible area is drawn.
- Fog of war is stored as a compact grid, one value per tile.
- Terrain comes from a seeded generator shaped by a dragon-silhouette mask. Towns, dungeons, castles and landmarks are hand-placed in `data/regions`.
- Optional: the free Tiled map editor, for painting the map by hand.
- Panels, cards and the log are regular HTML and CSS.

**Art**

Use Kenney's free CC0 pixel-art packs, sticking to one family (such as Tiny Town and Tiny Dungeon from the Tiny series) so styles match. Monsters and animals also come from Tiny Creatures by Clint Bellanger, a CC0 expansion made to match Tiny Dungeon. Whimsical monsters without a matching sprite use recolored and tinted versions of existing sprites. Crediting Kenney and Clint Bellanger on an About screen is optional under CC0 but courteous.

**Audio**

- Sound effects and music are made in code with the browser's Web Audio API: retro chiptune-style blips for the effects, and a gentle music-box lullaby for the music. There are no audio files, so there's nothing to download, no file format to worry about and no license to check. (Rob chose this over Kenney's audio packs, which come as OGG files rather than the MP3 files older iPhones need.)
- The sounds and the lullaby's notes are described in `data/audio.js`, so they can be tuned or rewritten there.
- Audio starts after the player's first tap (such as the Begin button), since phones block sound until then.
- Settings: mute, plus separate music and effects volume, remembered between sessions.
- From Phase 1, the engine signals key moments (level-up, hit, discovery, death) so sounds can be attached in Phase 3 without rewiring.

## Build Phases

Build in four phases, each playable on its own; Phase 1 proves a five-minute life is fun before the world gets big.

| Phase | Scope | Done when |
| --- | --- | --- |
| 1. Core life | One town and one region (the Tailwoods), age clock, automatic travel, combat and loot, leveling, skill picks, base classes, death and retirement, Hall of Champions, basic Chronicle, saves, debug mode | A full life plays start to finish in about five minutes and feels good |
| 2. The world | Fog-of-war map, 3–4 regions and towns, rumors, choosing a starting town, recruitment levels, graves | A second town can be discovered and used as a starting point |
| 3. Depth | Advanced classes, origins and quirks, story events, tonight's dream, tremors, mentors, dream shards, sound effects and music | Lives feel distinct from one another |
| 4. The dragon | All 7 regions, dungeons, monster castles, lullaby verses, three acts, finale, post-game | The story can be finished |

**Content targets for the full v1**

| Content | Target |
| --- | --- |
| Regions | 7 |
| Towns | ~10 (7 main towns + ~3 hamlets) |
| Classes | 20 (5 base + 15 advanced) |
| Skills | 30 (6 per tag) |
| Origins | 15 |
| Quirks | 20 |
| Monsters | ~40 (5–6 per region) |
| Base items | ~60 |
| Story events | 50+ |
| Rumors | ~40 |
| Dream modifiers | 12 |
| Dungeons | ~10 |
| Monster castles | 7 (one per region) |
| Lullaby verses | 7 |
| Dream shards | ~30 |

## Decisions

Every design question is decided.

| Question | Decision |
| --- | --- |
| Dragon and world names | Sominus; Whimsywild |
| Region and town names | Keep the current names |
| Class evolution | Player picks 1 of 2 classes at levels 5 and 15 |
| Art | Kenney pixel-art packs (Tiny Town, Tiny Dungeon), plus Tiny Creatures for monsters and animals |
| Rerolls and naming | Up to 3 rerolls per hero; the player can type a name |
| Mentors | Several per town, with diminishing returns |
| Legendary class tier | Post-v1 update |
| Auto-decide | Chooses by the hero's tags |
| Sound and music | In scope, added in Phase 3. Made in code (synthesized chiptune effects and a music-box lullaby) rather than from audio files |
| Tuning | Run length, XP curve and drop rates set during Phase 1 playtests |
| Automatic retirement away from town | The hero settles in the last town they visited |
| Hall of Champions logs | The 50 most recent heroes keep their full adventure log; older heroes keep their card, since browser storage is limited |
| Epithets | Added at the end of Phase 1, earned from deeds during the life |
| World map in Phase 2 | The whole dragon is built at once, all 7 regions under fog. Regions not yet playable are sealed by dream-mist until their phase |
| How the map is made | A seeded generator fills in terrain from a coarse dragon outline drawn as text in the data files; towns and landmarks are placed by hand |
| Phase 2 regions | Start with 3 playable regions: the Tailwoods, Hindhill Farms and the Glittering Flank. The Wingshade Fens open at the end of Phase 2; the wing's tip drapes down past the Spine to meet the Flank, so the Fens can be reached without crossing a sealed region |
| Phase 4 regions | The Spine Peaks and the Clawlands open first, with Ridgehold and Talonreach as starting towns. Smokecrown stays sealed until Act 3, as the story says |
| Dungeons | 10 dungeons, played room by room in a panel over the map: 4–6 random rooms, then a guardian, then the treasure. A badly hurt hero may retreat between rooms. Each can be cleared once per life. See "Dungeons" above |
| Monster castles | One per region, played like a longer, harder dungeon that ends with a boss who has a special move. Beating the boss conquers the castle for good: a banner on the map, the region's monsters 3% weaker, and no more rumors of it. Failed attempts leave the castle as it was. See "Monster castles" above |
| Lullaby verses and acts | Seven verses, one per region, hidden in dungeons (1 in 4 chance per clear) or castles (found on conquest), findable from Act 2. Each is a tag-free skill offered to later heroes. Act 2 begins with the first conquered castle, Act 3 once 5 of the 6 verses are found; each act's interlude is shown between heroes. See "Three acts" and "The lullaby" above |
| Smokecrown | Opens when Act 3 begins, at once. Lastlight (level 24), four landmarks with shards, the Forgotten Attic dungeon, and Hornhold castle with the seventh verse. See "Smokecrown" above |
| The finale | Once all seven verses are found, the Deepest Nightmare opens through Lidwater: a dream from each region, then the song, where the hero sings each verse as the Nightmare weakens. The hero who finishes it ends their life right there as "the Lullaby-Singer", and the ending scrolls every hero ever run. See "The finale" above |
| The post-game | Act 4, Sweet Dreams, begins when the song is sung and never ends: every region 3% calmer, no more storm or giant dreams, four new gentle dreams, a new story event per region, new rumors and tavern talk. See "After the ending" above |
| Dangerous ground | Heroes steer around regions whose lowest monster level is more than 3 above their own, unless that region is where they're going, and they only head "home" to towns in regions they can handle. So a hero only faces a far tougher region by choosing a risky rumor, never by taking a shortcut |
| Graves and heirlooms | A fallen hero's tombstone stays on the map, marked with their first name (the 30 most recent are kept). Their best item waits beside it as an heirloom, shown by a gold sparkle. The first later hero to pass within 3 tiles pays respects and takes it, remade at their own level; they wear it if it's better, or sell it. Taking one earns the epithet "the Heir" |
| Rumor choices per life | About 7–9 at the end of Phase 2, above the 3–5 in the decision budget. Kept as they are for now; revisit once story events add their own decisions |
| Late-life danger in Phase 2 | Heroes retire around level 21–27 while the open regions stop at level 18, so late life is nearly risk-free. Accepted until the Spine Peaks and later regions open |
| Monster levels | From Phase 2, a monster's level is near the hero's but always within its region's range, so the danger of a rumor depends on where it leads. (In Phase 1, with only the Tailwoods, monsters grew with the hero instead, with titles such as "Elder".) Castle bosses always fight at the top of their region's range, plus one |

