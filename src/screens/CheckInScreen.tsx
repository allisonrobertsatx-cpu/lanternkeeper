/**
 * CheckInScreen
 * User selects their current emotion
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Emotion } from '../data/types';

interface Props {
  onSelectEmotion: (emotion: Emotion) => void;
  onBack: () => void;
}

const EMOTIONS: { key: Emotion; label: string; emoji: string }[] = [
  { key: 'stuck', label: 'Stuck', emoji: '🌫️' },
  { key: 'frustrated', label: 'Frustrated', emoji: '🔥' },
  { key: 'inspired', label: 'Inspired', emoji: '✨' },
  { key: 'alright', label: 'Alright', emoji: '🍃' },
];

export default function CheckInScreen({ onSelectEmotion, onBack }: Props) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>How are you feeling</Text>
      </View>

      {/* Emotion Options */}
      <View style={styles.emotions}>
        {EMOTIONS.map((emotion) => (
          <Pressable
            key={emotion.key}
            style={styles.emotionButton}
            onPress={() => onSelectEmotion(emotion.key)}
          >
            <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
            <Text style={styles.emotionLabel}>{emotion.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Back */}
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  title: {
    color: '#d4a574',
    fontSize: 20,
    fontWeight: '500',
  },
  emotions: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  emotionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252540',
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 16,
  },
  emotionEmoji: {
    fontSize: 32,
  },
  emotionLabel: {
    color: '#ccc',
    fontSize: 18,
  },
  backButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  backText: {
    color: '#666',
    fontSize: 14,
  },
});
