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
- **Retirement** happens by choice in a town from age 60, or automatically around 70. The hero settles in that town as a mentor. A hero who reaches 70 away from a town settles in the last town they visited.

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

## Hero Creation

Each hero is rolled automatically with a name, an origin and a quirk; before the life begins, the player picks a starting town and can reroll or rename the hero. The hero starts at that town's recruitment level (see World Map).

**Origins** give a small nudge toward one skill tag and a starting item. Target 15 origins for v1, three per tag.

| Origin | Tag nudge | Starting item |
| --- | --- | --- |
| Turnip Farmer | Wild | Sturdy Pitchfork |
| Failed Bard | Cunning | Out-of-Tune Lute |
| Knight's Stable Boy | Might | Borrowed Helmet |
| Temple Candle-Snuffer | Faith | Blessed Snuffer |
| Wizard's Apprentice (Fired) | Arcane | Singed Spellbook |

**Quirks** add a small modifier and unlock special events. Target 20 quirks for v1.

- **Afraid of Geese:** weaker against birds; unlocks goose-related events.
- **Talks to Their Sword:** the sword sometimes offers hints during story events.
- **Collects Spoons:** finds extra trinkets.
- **Terrible Sense of Direction:** rumors occasionally lead somewhere unexpected.

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
- Fog clears in a radius of 3–5 tiles around the hero and never returns.
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
| Smokecrown | Head | Loneliness (the deepest nightmare) | Forgotten things, fading echoes | 25+ | Lastlight (24) |

Place names are body-part puns (Tailsend, Haunchford, the Clawlands) that the townsfolk never question. They foreshadow the Act 2 reveal that the world is the dragon.

About three extra hamlets sit off the main paths as bonus discoveries, for roughly 10 towns total.

**Towns and recruitment levels**

Once discovered, a town becomes a starting point for future heroes. Heroes start at the town's recruitment level with modest gear (a Common weapon of that level), so every town is a real checkpoint. (Armor was dropped from the starting gear in the Phase 2 tuning, so a later start carries about the same risk of death as starting in Tailsend.) Before hearing their first rumors, they make the skill and class choices of the levels they skipped. Map rule: each region's main town must be reachable from the previous town within one good life.

**Steering with rumors**

- In a town or at camp, the player picks one of 2–3 rumors, each showing a rough direction and a danger rating of 1–3 skulls.
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

**Tremors**

One or two times per life, the dragon stirs and something happens mid-run. A snore sends strong winds that speed travel. A roll-over shifts terrain to reveal a hidden cave. A sneeze makes the volcano erupt, bringing fire monsters. Tremors are good moments for story choices.

## Story: The Sleeping Dragon

Sominus, a colossal dragon, sleeps beneath the world of Whimsywild, trapped in a nightmare, and heroes across many lives recover a lost lullaby to soothe it back into peaceful sleep. The dragon is not a villain, and the ending is not a boss kill.

**Premise**

Centuries ago, the dragon was sung to sleep with a lullaby. The song was forgotten, and now the dragon is stuck in a nightmare. Its dreams leak into the world as monsters, and its restless stirring causes tremors. In Act 1, people know it only as the Sleeper; its true name, Sominus, echoes Somnus, the Roman god of sleep.

**Three acts**

Acts advance with world progress, never with hero count, so the story never feels like a grind.

| Act | What players learn | Advances when |
| --- | --- | --- |
| 1. The Stirring | Tremors are growing; taverns tell legends of the Sleeper. Monsters seem like ordinary threats. | The first monster castle is conquered |
| 2. The Dreamlands | Monsters are the dragon's dreams, and the world is the dragon. Its true name, Sominus, is revealed. A lullaby once put it to sleep; its 7 verses are scattered across the regions. | Most verses are found (e.g., 5 of 7) |
| 3. The Waking | The heart of the nightmare is loneliness: the dragon fears the world has forgotten it. The head region opens. | All verses found and Smokecrown reached |

**The lullaby**

There are 7 verses, one per region, each hidden in a dungeon or a monster castle. A found verse is found permanently and becomes a skill option for every future hero.

**The finale**

In Smokecrown, a hero enters the dragon's deepest nightmare as a special dream dungeon, fights through it and sings. The lullaby's last verse was never written; it is the stories of the heroes who came looking.

The ending scrolls the name, epithet and greatest deed of every hero the player ever ran. Those stories are what finally soothe the dragon, so every hero, even one who died in the first minute, is part of the ending.

**After the ending**

The dragon sleeps peacefully and its dreams turn pleasant. The world stays open, with gentler but stranger dream content and new rumors to explore.

**Tonight's dream**

Every life opens with a run modifier describing what the dragon dreams about tonight. Target 12 for v1.

- **Dreams of gold:** more treasure, more mimics.
- **Dreams of rain:** fens spread, fire is weaker.
- **Dreams of feasts:** food heals double, pie golems roam.

**How lore is delivered**

- **Dream shards:** short lore entries found at landmarks and collected in the Chronicle. Target about 30.
- **Rumors and tavern talk** carry legends and hints.
- **Act transitions** play as a short interlude between heroes.

## Persistence & Legacy

Everything a hero discovers or changes stays in the world for every hero after them; only the hero's own level, gear and gold are lost.

| What persists | How it carries forward |
| --- | --- |
| Revealed map | Fog stays lifted permanently |
| Discovered towns | Become starting towns for future heroes |
| Conquered castles | Stay conquered; region danger drops one step; some make room for a new hamlet |
| Lullaby verses | Become skill options for every future hero |
| Dream shards | Saved as lore entries in the Chronicle |
| Graves | A dead hero leaves a tombstone where they fell; a later hero passing by can pay respects and recover one heirloom (their best item, scaled to the new hero) |
| Mentors | Retired heroes settle in a town, and future heroes starting there get small perks, such as a free rank in a mentor's signature skill. The three most recent mentors apply at full, half and quarter strength; older retirees stay listed as residents |
| Hall of Champions and Chronicle | Every hero and every lifetime stat is recorded |

Graves and mentors make death and retirement feel different: death leaves an heirloom out in the world, while retirement strengthens a town for everyone who starts there.

## Interface

Whimsywild RP5 is designed mobile-first in portrait, with the live adventure on one screen and tabs for the hero and the records. On wide screens the map sits on the left and the panels on the right.

**Bottom navigation:** Adventure · Hero · Chronicle · Hall of Champions

**Adventure screen (during a life)**

- **World Map (top, about 55%):** follows the hero's sprite; the player can drag and pinch to look around the revealed world.
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
- Story progress: the current act and collected dream shards.

**Hall of Champions tab**

One card per hero, newest first. Each card shows:

- Name and epithet, final class and level
- Age at the end, and starting town
- Greatest deed
- How it ended, in whimsical terms: "Swallowed by a mimic pretending to be a smaller mimic" or "Retired to Haunchford to raise geese"

Tapping a card opens that hero's full adventure log.

**Settings**

Mute, separate music and sound effect volume, and the Auto-decide toggle. Settings are remembered between sessions.

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

- Sound effects come from Kenney's CC0 audio packs. Music comes from free sources such as OpenGameArt, checking each track's license and crediting where required.
- Use MP3 files, which play in every browser.
- Audio starts after the player's first tap (the Begin button), since phones block sound until then.
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
| Sound and music | In scope, added in Phase 3 |
| Tuning | Run length, XP curve and drop rates set during Phase 1 playtests |
| Automatic retirement away from town | The hero settles in the last town they visited |
| Hall of Champions logs | The 50 most recent heroes keep their full adventure log; older heroes keep their card, since browser storage is limited |
| Epithets | Added at the end of Phase 1, earned from deeds during the life |
| World map in Phase 2 | The whole dragon is built at once, all 7 regions under fog. Regions not yet playable are sealed by dream-mist until their phase |
| How the map is made | A seeded generator fills in terrain from a coarse dragon outline drawn as text in the data files; towns and landmarks are placed by hand |
| Phase 2 regions | Start with 3 playable regions: the Tailwoods, Hindhill Farms and the Glittering Flank. The Wingshade Fens open at the end of Phase 2; the wing's tip drapes down past the Spine to meet the Flank, so the Fens can be reached without crossing a sealed region |
| Graves and heirlooms | A fallen hero's tombstone stays on the map, marked with their first name (the 30 most recent are kept). Their best item waits beside it as an heirloom, shown by a gold sparkle. The first later hero to pass within 3 tiles pays respects and takes it, remade at their own level; they wear it if it's better, or sell it. Taking one earns the epithet "the Heir" |
| Monster levels | From Phase 2, a monster's level is near the hero's but always within its region's range, so the danger of a rumor depends on where it leads. (In Phase 1, with only the Tailwoods, monsters grew with the hero instead, with titles such as "Elder".) |

