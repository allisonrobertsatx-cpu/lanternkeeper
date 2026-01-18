/**
 * Feedback Lines
 * Aetherling's responses after completing a quest
 * Calm, dry, warm-under-the-surface
 */

import { Emotion } from './types';

export const FEEDBACK: Record<Emotion, string[]> = {
  // ----------------------------------------
  // STUCK
  // ----------------------------------------
  stuck: [
    'Fog lost a little ground',
    'That was enough to move',
    'We did not rush',
    'Small steps count',
    'We are still on the path',
  ],

  // ----------------------------------------
  // FRUSTRATED
  // ----------------------------------------
  frustrated: [
    'That made space',
    'We carried it more lightly',
    'The tension eased',
    'That mattered',
    'We kept it kind',
  ],

  // ----------------------------------------
  // INSPIRED
  // ----------------------------------------
  inspired: [
    'That belongs in the world',
    'We protected something important',
    'One piece became real',
    'That is how ideas survive',
    'We built today',
  ],

  // ----------------------------------------
  // ALRIGHT
  // ----------------------------------------
  alright: [
    'Quiet progress',
    'That was enough',
    'We will continue when it makes sense',
    'Nothing to prove',
    'This is steady',
  ],
};

/**
 * Get a random feedback line for an emotion
 */
export function getRandomFeedback(emotion: Emotion): string {
  const pool = FEEDBACK[emotion];
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}
