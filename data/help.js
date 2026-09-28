// "How to play", in the Settings panel: a short guide for new players. Each topic opens and
// closes with a tap. `text` is a list of short paragraphs. Keep it friendly and brief, and
// avoid spoiling the story beyond Act 1.

export const helpText = {
  heading: 'How to play',
  hint: 'Tap a topic to open it.',
};

export const helpTopics = [
  {
    title: 'The basics',
    text: [
      'Each hero lives one adventure of about five minutes, from age 18 until they retire or fall. '
        + 'The years tick by as they go: about six seconds for each year of their life.',
      "You don't steer the hero. They walk, fight, loot and level up on their own. Your part is "
        + 'the choices: what to learn, where to go and what to do when something happens. The clock '
        + 'stops while a choice waits, so take your time.',
      "When a hero's life ends, the next hero begins. The world remembers everything they did.",
    ],
  },
  {
    title: 'Choices',
    text: [
      'Skills: every few levels, pick one of three. Each skill has a tag (Might, Arcane, Faith, '
        + "Cunning or Wild), and the tags you favor decide which classes you're offered at levels 5 and 15.",
      'Rumors: in towns and at camp, pick where to go next. The skulls show how dangerous a place '
        + 'is for this hero: one is safe enough, three is a real risk.',
      'Story events: little moments on the road, with two or three things to try. Words like '
        + '"Likely" or "Risky" show the odds, and options in your hero\'s strongest tags go better.',
      'Auto-decide (in Settings, or on any choice card) lets the hero choose for themselves, '
        + 'for relaxed idle play.',
    ],
  },
  {
    title: 'The map',
    text: [
      'The world starts hidden in fog, and every hero lifts a little more of it. Drag to look '
        + 'around, pinch or scroll to zoom, and double-tap to go back to the hero.',
      'A "?" marks something undiscovered nearby. Every town a hero finds becomes a place future '
        + 'heroes can start from, at that town\'s level.',
    ],
  },
  {
    title: 'Towns, retiring and graves',
    text: [
      'In a town, heroes heal, buy potions and better gear, and hear new rumors.',
      'From age 60, a hero arriving in a town can retire there. Retired heroes become mentors, '
        + 'and each hero who starts in that town gets a gift from its newest mentors.',
      'A hero who falls leaves a grave. The next hero to pass by pays their respects and takes '
        + 'the fallen hero\'s best item as an heirloom.',
    ],
  },
  {
    title: 'Dungeons and castles',
    text: [
      'Some rumors lead to dungeons: a few rooms of fights, treasure and surprises, a guardian, '
        + 'and a prize at the end. A panel over the map shows the rooms.',
      'Heroes don\'t heal inside, so if a hero is badly hurt between rooms, you\'ll be asked '
        + 'whether to press on or turn back.',
      'Monster castles are longer and harder, with a boss at the end. Beat one and it stays '
        + 'conquered for every hero after, and its region grows a little safer.',
    ],
  },
  {
    title: 'Dreams, origins and quirks',
    text: [
      "Every hero lives under tonight's dream, which changes their life a little: more treasure, "
        + 'fewer monsters, faster travel and so on. It\'s shown on the New Hero card.',
      'Each hero also has an origin (a small head start and a starting item) and a quirk '
        + '(something odd about them, good or bad). You can reroll a new hero up to three times.',
    ],
  },
  {
    title: 'The story',
    text: [
      'Something is stirring beneath Whimsywild. The ground shakes now and then, and the monsters '
        + 'get stranger every year.',
      'The story moves on as heroes achieve things in the world, not with how many heroes have '
        + 'lived. The Chronicle tab keeps the story so far: tap an act to read it again, and see '
        + "what's next.",
    ],
  },
  {
    title: 'The other tabs',
    text: [
      'Hero: the current hero\'s stats, skills, gear and background.',
      'Chronicle: the story so far, and everything every hero has achieved.',
      'Hall of Champions: a card for every hero who has lived. Tap one to read their whole adventure.',
    ],
  },
  {
    title: 'Saving',
    text: [
      'The game saves by itself, in this browser only. Clearing the browser\'s site data erases it.',
      'To back up your progress, or move it to another device, use "Copy save code" below and '
        + 'keep the code somewhere safe. "Load a save code" brings it back.',
    ],
  },
];
