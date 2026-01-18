/**
 * HomeScreen
 * Shows Aetherling and Emberfall scene
 * Entry point to the core loop
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface Props {
  onStartCheckIn: () => void;
  onOpenIdeaSeeds: () => void;
  alreadyCheckedIn?: boolean;
}

export default function HomeScreen({ onStartCheckIn, onOpenIdeaSeeds, alreadyCheckedIn }: Props) {
  // Different greeting based on check-in status
  const aetherlingLine = alreadyCheckedIn
    ? 'The lantern glows softly'
    : 'The fog is thick today';

  return (
    <View style={styles.container}>
      {/* Emberfall Scene Placeholder */}
      <View style={styles.scene}>
        <Text style={styles.sceneEmoji}>🌲🌫️🏮🌫️🌲</Text>
        <Text style={styles.sceneName}>Emberfall</Text>
      </View>

      {/* Aetherling Placeholder */}
      <View style={styles.aetherling}>
        <Text style={styles.aetherlingEmoji}>🦊</Text>
        <Text style={styles.aetherlingName}>Aetherling</Text>
        <Text style={styles.aetherlingLine}>{aetherlingLine}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Pressable
          style={[styles.button, alreadyCheckedIn && styles.buttonDone]}
          onPress={onStartCheckIn}
        >
          <Text style={[styles.buttonText, alreadyCheckedIn && styles.buttonTextDone]}>
            {alreadyCheckedIn ? 'Check In Again' : 'Check In'}
          </Text>
        </Pressable>

        <Pressable style={styles.buttonSecondary} onPress={onOpenIdeaSeeds}>
          <Text style={styles.buttonTextSecondary}>Idea Seeds</Text>
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
  scene: {
    alignItems: 'center',
    paddingTop: 60,
  },
  sceneEmoji: {
    fontSize: 40,
    letterSpacing: 8,
  },
  sceneName: {
    color: '#8b7355',
    fontSize: 14,
    marginTop: 12,
    letterSpacing: 4,
  },
  aetherling: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  aetherlingEmoji: {
    fontSize: 80,
  },
  aetherlingName: {
    color: '#d4a574',
    fontSize: 18,
    marginTop: 12,
    fontWeight: '500',
  },
  aetherlingLine: {
    color: '#888',
    fontSize: 14,
    marginTop: 8,
    fontStyle: 'italic',
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
  buttonDone: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d4a574',
  },
  buttonTextDone: {
    color: '#d4a574',
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonTextSecondary: {
    color: '#888',
    fontSize: 14,
  },
});
