/**
 * Micro-Quests
 * 40 small, kind tasks grouped by emotion
 * No pressure. No guilt. Just one small thing.
 */

import { Quest, Emotion } from './types';

export const QUESTS: Record<Emotion, Quest[]> = {
  // ----------------------------------------
  // STUCK - When you cannot move forward
  // ----------------------------------------
  stuck: [
    { id: 'stuck_01', emotion: 'stuck', text: 'Open your project for 2 minutes' },
    { id: 'stuck_02', emotion: 'stuck', text: 'Write one sentence about what feels blocked' },
    { id: 'stuck_03', emotion: 'stuck', text: 'Change rooms and sit somewhere different' },
    { id: 'stuck_04', emotion: 'stuck', text: 'Name one small thing you have already built' },
    { id: 'stuck_05', emotion: 'stuck', text: 'Sketch a single shape for Atlas' },
    { id: 'stuck_06', emotion: 'stuck', text: 'Describe the fog in Emberfall in one line' },
    { id: 'stuck_07', emotion: 'stuck', text: 'Make one tiny playful experiment' },
    { id: 'stuck_08', emotion: 'stuck', text: 'Stand up and look out a window for 30 seconds' },
    { id: 'stuck_09', emotion: 'stuck', text: 'Write the next true step, even if it feels too small' },
    { id: 'stuck_10', emotion: 'stuck', text: 'Tidy one tiny corner of your workspace' },
  ],

  // ----------------------------------------
  // FRUSTRATED - When it is too much
  // ----------------------------------------
  frustrated: [
    { id: 'frus_01', emotion: 'frustrated', text: 'Put a hand on your chest. Breathe slowly for 3 breaths' },
    { id: 'frus_02', emotion: 'frustrated', text: 'Name one thing you cannot control and let it be' },
    { id: 'frus_03', emotion: 'frustrated', text: 'Stretch your shoulders for 30 seconds' },
    { id: 'frus_04', emotion: 'frustrated', text: 'Write what you wish players would feel' },
    { id: 'frus_05', emotion: 'frustrated', text: 'Take a short walk with no goal' },
    { id: 'frus_06', emotion: 'frustrated', text: 'Say one kind thing to yourself quietly' },
    { id: 'frus_07', emotion: 'frustrated', text: 'Move your body for one song' },
    { id: 'frus_08', emotion: 'frustrated', text: 'Lower your expectations for today by 10 percent' },
    { id: 'frus_09', emotion: 'frustrated', text: 'Write one honest sentence about why this matters' },
    { id: 'frus_10', emotion: 'frustrated', text: 'Step outside and notice one warm detail' },
  ],

  // ----------------------------------------
  // INSPIRED - When the spark is alive
  // ----------------------------------------
  inspired: [
    { id: 'insp_01', emotion: 'inspired', text: 'Write one mechanic idea' },
    { id: 'insp_02', emotion: 'inspired', text: 'Sketch one character' },
    { id: 'insp_03', emotion: 'inspired', text: 'Name one emotion Atlas should hold' },
    { id: 'insp_04', emotion: 'inspired', text: 'Build one imperfect thing' },
    { id: 'insp_05', emotion: 'inspired', text: 'Protect your spark: remove one distraction' },
    { id: 'insp_06', emotion: 'inspired', text: 'Write a tiny piece of lore' },
    { id: 'insp_07', emotion: 'inspired', text: 'Open your engine and change one line' },
    { id: 'insp_08', emotion: 'inspired', text: 'Send one honest appreciation' },
    { id: 'insp_09', emotion: 'inspired', text: 'Capture today idea before it fades' },
    { id: 'insp_10', emotion: 'inspired', text: 'Add one lantern to Emberfall' },
  ],

  // ----------------------------------------
  // ALRIGHT - When things are steady
  // ----------------------------------------
  alright: [
    { id: 'alri_01', emotion: 'alright', text: 'Enjoy one simple comfort' },
    { id: 'alri_02', emotion: 'alright', text: 'Do one kind thing for future you' },
    { id: 'alri_03', emotion: 'alright', text: 'Back up your project' },
    { id: 'alri_04', emotion: 'alright', text: 'Tidy your digital workspace' },
    { id: 'alri_05', emotion: 'alright', text: 'Drink a glass of water' },
    { id: 'alri_06', emotion: 'alright', text: 'Thank yourself for showing up' },
    { id: 'alri_07', emotion: 'alright', text: 'Light a candle or lamp nearby' },
    { id: 'alri_08', emotion: 'alright', text: 'Review one thing you are proud of' },
    { id: 'alri_09', emotion: 'alright', text: 'Rest for 5 minutes without guilt' },
    { id: 'alri_10', emotion: 'alright', text: 'Tell Aetherling what you are building today' },
  ],
};

/**
 * Get a random quest for an emotion
 */
export function getRandomQuest(emotion: Emotion): Quest {
  const pool = QUESTS[emotion];
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

/**
 * Get a different quest (excludes current one)
 */
export function getAnotherQuest(emotion: Emotion, currentId: string): Quest {
  const pool = QUESTS[emotion].filter((q) => q.id !== currentId);
  if (pool.length === 0) return QUESTS[emotion][0];
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
