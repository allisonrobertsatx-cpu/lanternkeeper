import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { loadWorldState, WorldState } from "@/lib/storage";

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [worldState, setWorldState] = useState<WorldState | null>(null);

  useEffect(() => {
    loadWorldState().then(setWorldState);
  }, []);

  const handleResetFirstLantern = () => {
    Alert.alert(
      "Reset First Lantern",
      "This will show the First Lantern scene again on next app open.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("first-lantern-seen");
            router.replace("/");
          },
        },
      ]
    );
  };

  const handleResetAll = () => {
    Alert.alert(
      "Reset Everything",
      "This will clear all progress and start fresh. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset All",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace("/");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0a0f1a", "#141e30", "#0a0f1a"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 },
        ]}
      >
        <Text style={styles.title}>Emberfall</Text>
        <Text style={styles.subtitle}>World State</Text>

        {/* Stats */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Progress</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Days visited</Text>
            <Text style={styles.statValue}>
              {worldState?.totalDaysVisited ?? 0}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Regions unlocked</Text>
            <Text style={styles.statValue}>
              {worldState?.unlockedRegions?.length ?? 1}
            </Text>
          </View>
        </View>

        {/* Emotions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Emotion History</Text>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Stuck</Text>
            <Text style={styles.statValue}>
              {worldState?.emotionCounts?.stuck ?? 0}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Frustrated</Text>
            <Text style={styles.statValue}>
              {worldState?.emotionCounts?.frustrated ?? 0}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Inspired</Text>
            <Text style={styles.statValue}>
              {worldState?.emotionCounts?.inspired ?? 0}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Alright</Text>
            <Text style={styles.statValue}>
              {worldState?.emotionCounts?.alright ?? 0}
            </Text>
          </View>
        </View>

        {/* Regions */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Regions</Text>
          {[
            { id: "lantern-clearing", name: "Lantern Clearing", unlock: "Home" },
            { id: "workshop-glade", name: "Workshop Glade", unlock: "3× Inspired" },
            { id: "fog-valley", name: "Fog Valley", unlock: "3× Stuck" },
            { id: "warm-river", name: "Warm River", unlock: "3× Frustrated" },
            { id: "observatory-balcony", name: "Observatory Balcony", unlock: "7 days" },
            { id: "the-long-path", name: "The Long Path", unlock: "14 days" },
          ].map((region) => {
            const unlocked = worldState?.unlockedRegions?.includes(region.id);
            return (
              <View key={region.id} style={styles.regionRow}>
                <View style={styles.regionInfo}>
                  <Text
                    style={[
                      styles.regionName,
                      !unlocked && styles.regionLocked,
                    ]}
                  >
                    {region.name}
                  </Text>
                  <Text style={styles.regionUnlock}>{region.unlock}</Text>
                </View>
                <View
                  style={[
                    styles.regionDot,
                    unlocked && styles.regionDotUnlocked,
                  ]}
                />
              </View>
            );
          })}
        </View>

        {/* Debug */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Debug</Text>
          <Pressable
            style={({ pressed }) => [
              styles.debugButton,
              pressed && styles.debugButtonPressed,
            ]}
            onPress={handleResetFirstLantern}
          >
            <Text style={styles.debugButtonText}>Reset First Lantern</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.debugButton,
              styles.debugButtonDanger,
              pressed && styles.debugButtonPressed,
            ]}
            onPress={handleResetAll}
          >
            <Text style={styles.debugButtonTextDanger}>Reset Everything</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f1a",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "300",
    color: "rgba(255, 248, 240, 0.9)",
    textAlign: "center",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(255, 200, 150, 0.4)",
    textAlign: "center",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 4,
    marginBottom: 28,
  },

  // Card
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 150, 0.06)",
  },
  cardTitle: {
    fontSize: 11,
    color: "rgba(255, 200, 150, 0.4)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 14,
  },

  // Stats
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 200, 150, 0.04)",
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255, 248, 240, 0.6)",
  },
  statValue: {
    fontSize: 14,
    color: "rgba(255, 220, 180, 0.8)",
    fontWeight: "500",
  },

  // Regions
  regionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 200, 150, 0.04)",
  },
  regionInfo: {
    flex: 1,
  },
  regionName: {
    fontSize: 14,
    color: "rgba(255, 248, 240, 0.75)",
    marginBottom: 2,
  },
  regionLocked: {
    color: "rgba(255, 248, 240, 0.35)",
  },
  regionUnlock: {
    fontSize: 11,
    color: "rgba(255, 200, 150, 0.35)",
  },
  regionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255, 200, 150, 0.15)",
    marginLeft: 12,
  },
  regionDotUnlocked: {
    backgroundColor: "#f4a040",
  },

  // Debug buttons
  debugButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    marginBottom: 10,
    alignItems: "center",
  },
  debugButtonDanger: {
    backgroundColor: "rgba(255, 100, 100, 0.08)",
  },
  debugButtonPressed: {
    opacity: 0.7,
  },
  debugButtonText: {
    fontSize: 13,
    color: "rgba(255, 248, 240, 0.6)",
  },
  debugButtonTextDanger: {
    fontSize: 13,
    color: "rgba(255, 150, 150, 0.8)",
  },
});
