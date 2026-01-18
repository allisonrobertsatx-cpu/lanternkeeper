/**
 * IdeaSeedScreen
 * View and add 1-sentence idea notes
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { IdeaSeed } from '../data/types';

interface Props {
  seeds: IdeaSeed[];
  onAddSeed: (text: string) => void;
  onBack: () => void;
}

export default function IdeaSeedScreen({ seeds, onAddSeed, onBack }: Props) {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const text = input.trim();
    if (text.length > 0) {
      onAddSeed(text);
      setInput('');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Idea Seeds</Text>
        <Text style={styles.subtitle}>Small sparks to revisit later</Text>
      </View>

      {/* Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="One sentence..."
          placeholderTextColor="#555"
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <Pressable style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Seeds List */}
      <FlatList
        data={seeds}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.seedItem}>
            <Text style={styles.seedText}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No seeds planted yet</Text>
        }
      />

      {/* Back */}
      <Pressable style={styles.backButton} onPress={onBack}>
        <Text style={styles.backText}>Back to Emberfall</Text>
      </Pressable>
    </KeyboardAvoidingView>
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
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    color: '#d4a574',
    fontSize: 20,
    fontWeight: '500',
  },
  subtitle: {
    color: '#666',
    fontSize: 13,
    marginTop: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#252540',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ccc',
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#d4a574',
    width: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#1a1a2e',
    fontSize: 24,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 10,
  },
  seedItem: {
    backgroundColor: '#252540',
    padding: 16,
    borderRadius: 12,
  },
  seedText: {
    color: '#ccc',
    fontSize: 15,
    lineHeight: 22,
  },
  emptyText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
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
