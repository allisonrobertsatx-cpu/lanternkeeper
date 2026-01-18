/**
 * QuestScreen
 * Shows suggested micro-quest based on selected emotion
 * User can tap "Done" to complete
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Emotion, Quest } from '../data/types';

interface Props {
  emotion: Emotion;
  quest: Quest | null;
  feedbackLine: string | null;
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const EMOTION_EMOJI: Record<Emotion, string> = {
  stuck: '🌫️',
  frustrated: '🔥',
  inspired: '✨',
  alright: '🍃',
};

export default function QuestScreen({
  emotion,
  quest,
  feedbackLine,
  onComplete,
  onSkip,
  onBack,
}: Props) {
  // Show feedback after completion
  if (feedbackLine) {
    return (
      <View style={styles.container}>
        <View style={styles.feedbackContainer}>
          <Text style={styles.aetherling}>🦊</Text>
          <Text style={styles.feedbackLine}>{feedbackLine}</Text>
        </View>
        <Pressable style={styles.button} onPress={onBack}>
          <Text style={styles.buttonText}>Return to Emberfall</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Emotion Header */}
      <View style={styles.header}>
        <Text style={styles.emotionEmoji}>{EMOTION_EMOJI[emotion]}</Text>
        <Text style={styles.emotionLabel}>{emotion}</Text>
      </View>

      {/* Quest */}
      <View style={styles.questContainer}>
        <Text style={styles.questLabel}>A small thing</Text>
        <Text style={styles.questText}>{quest?.text ?? 'No quest available'}</Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable style={styles.button} onPress={onComplete}>
          <Text style={styles.buttonText}>Done</Text>
        </Pressable>

        <Pressable style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipText}>Try another</Text>
        </Pressable>

        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backText}>Not now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emotionEmoji: {
    fontSize: 48,
  },
  emotionLabel: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    textTransform: 'capitalize',
  },
  questContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  questLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  questText: {
    color: '#d4a574',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 30,
  },
  actions: {
    gap: 12,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#d4a574',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  skipText: {
    color: '#888',
    fontSize: 14,
  },
  backButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  backText: {
    color: '#555',
    fontSize: 13,
  },
  // Feedback state
  feedbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  aetherling: {
    fontSize: 64,
  },
  feedbackLine: {
    color: '#d4a574',
    fontSize: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
