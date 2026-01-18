export type QuestTier = 'spark' | 'ember' | 'flame';

export interface Quest {
  id: string;
  title: string;
  description: string;
  tier: QuestTier;
}

export const quests: Quest[] = [
  // Spark tier - small, gentle actions
  {
    id: 'spark-1',
    title: 'Take three deep breaths',
    description: 'Pause and breathe slowly, in through your nose and out through your mouth.',
    tier: 'spark',
  },
  {
    id: 'spark-2',
    title: 'Drink a glass of water',
    description: 'Hydrate yourself with a full glass of water.',
    tier: 'spark',
  },
  {
    id: 'spark-3',
    title: 'Look out a window',
    description: 'Take a moment to observe the world outside.',
    tier: 'spark',
  },

  // Ember tier - moderate effort
  {
    id: 'ember-1',
    title: 'Take a 10-minute walk',
    description: 'Step outside and walk around your neighborhood or nearby area.',
    tier: 'ember',
  },
  {
    id: 'ember-2',
    title: 'Tidy one small space',
    description: 'Clear off a desk, nightstand, or countertop.',
    tier: 'ember',
  },
  {
    id: 'ember-3',
    title: 'Reach out to someone',
    description: 'Send a message to a friend or family member.',
    tier: 'ember',
  },

  // Flame tier - more involved
  {
    id: 'flame-1',
    title: 'Prepare a nourishing meal',
    description: 'Cook something simple and healthy for yourself.',
    tier: 'flame',
  },
  {
    id: 'flame-2',
    title: 'Complete a postponed task',
    description: 'Tackle something you have been putting off.',
    tier: 'flame',
  },
  {
    id: 'flame-3',
    title: 'Spend 20 minutes on a hobby',
    description: 'Do something creative or enjoyable just for you.',
    tier: 'flame',
  },
];
