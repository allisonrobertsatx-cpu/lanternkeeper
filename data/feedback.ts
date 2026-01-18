import type { QuestTier } from './quests';

export interface FeedbackMessage {
  id: string;
  message: string;
}

// Feedback by tier - shown after completing a quest
export const tierFeedback: Record<QuestTier, FeedbackMessage[]> = {
  spark: [
    { id: 'spark-fb-1', message: 'A small light still shines.' },
    { id: 'spark-fb-2', message: 'Every spark matters.' },
    { id: 'spark-fb-3', message: 'You showed up. That counts.' },
  ],
  ember: [
    { id: 'ember-fb-1', message: 'Your flame grows stronger.' },
    { id: 'ember-fb-2', message: 'Steady warmth builds lasting fire.' },
    { id: 'ember-fb-3', message: 'You are finding your rhythm.' },
  ],
  flame: [
    { id: 'flame-fb-1', message: 'Your light burns bright today.' },
    { id: 'flame-fb-2', message: 'You carry the fire within.' },
    { id: 'flame-fb-3', message: 'A beacon for yourself and others.' },
  ],
};

// Streak-based feedback - shown for consecutive days
export const streakFeedback: FeedbackMessage[] = [
  { id: 'streak-1', message: 'One day at a time.' },
  { id: 'streak-2', message: 'Two days strong.' },
  { id: 'streak-3', message: 'Three days — a pattern forms.' },
  { id: 'streak-5', message: 'Five days. The lantern stays lit.' },
  { id: 'streak-7', message: 'A full week. You are the keeper now.' },
];

// Helper to get random feedback for a tier
export function getRandomTierFeedback(tier: QuestTier): string {
  const messages = tierFeedback[tier];
  const index = Math.floor(Math.random() * messages.length);
  return messages[index].message;
}

// Helper to get streak feedback
export function getStreakFeedback(days: number): string | null {
  const match = streakFeedback.find((f) => f.id === `streak-${days}`);
  return match?.message ?? null;
}
