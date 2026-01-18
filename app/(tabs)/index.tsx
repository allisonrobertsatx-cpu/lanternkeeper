import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

type Emotion = "stuck" | "frustrated" | "inspired" | "alright";

const EMOTION_LABELS: Record<Emotion, string> = {
  stuck: "Stuck",
  frustrated: "Frustrated",
  inspired: "Inspired",
  alright: "Alright",
};

const FEEDBACK: Record<Emotion, string[]> = {
  stuck: [
    "Fog lost a little ground.",
    "That was enough to move.",
    "We didn't rush.",
    "Small steps count.",
    "We're still on the path.",
  ],
  frustrated: [
    "That made space.",
    "We carried it more lightly.",
    "The tension eased.",
    "That mattered.",
    "We kept it kind.",
  ],
  inspired: [
    "That belongs in the world.",
    "We protected something important.",
    "One piece became real.",
    "That's how ideas survive.",
    "We built today.",
  ],
  alright: [
    "Quiet progress.",
    "That was enough.",
    "We'll continue when it makes sense.",
    "Nothing to prove.",
    "This is steady.",
  ],
};

const QUESTS: Record<Emotion, string[]> = {
  stuck: [
    "Open your project for 2 minutes.",
    "Write one sentence about what feels blocked.",
    "Name one small thing you've already built.",
  ],
  frustrated: [
    "Put a hand on your chest. Breathe slowly for 3 breaths.",
    "Stretch your shoulders for 30 seconds.",
    "Say one kind thing to yourself (quietly).",
  ],
  inspired: [
    "Write one mechanic idea.",
    "Build one imperfect thing.",
    "Capture today's idea before it fades.",
  ],
  alright: [
    "Enjoy one simple comfort.",
    "Drink a glass of water.",
    "Rest for 5 minutes without guilt.",
  ],
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [fogCleared, setFogCleared] = useState(false);
  const [leavesCleared, setLeavesCleared] = useState(false);
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [quest, setQuest] = useState<string>("");
  const [questDone, setQuestDone] = useState(false);

  const readyForCheckIn = fogCleared || leavesCleared;

  const pickFeedback = (e: Emotion) => {
    const options = FEEDBACK[e];
    return options[Math.floor(Math.random() * options.length)];
  };

  const pickQuest = (e: Emotion) => {
    const options = QUESTS[e];
    return options[Math.floor(Math.random() * options.length)];
  };

  const onSelectEmotion = (e: Emotion) => {
    setEmotion(e);
    setQuest(pickQuest(e));
    setQuestDone(false);
  };

  const onDone = () => {
    setQuestDone(true);
    setFeedback(pickFeedback(emotion!));
  };

  const resetMorning = () => {
    setFogCleared(false);
    setLeavesCleared(false);
    setEmotion(null);
    setFeedback("");
    setQuest("");
    setQuestDone(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0a0f1a", "#141e30", "#0a0f1a"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* === SCENE === */}
      <View style={[styles.scene, { paddingTop: insets.top + 16 }]}>
        {/* Fog layers */}
        <View
          style={[styles.fog, styles.fog1, fogCleared && styles.fogCleared]}
        />
        <View
          style={[styles.fog, styles.fog2, fogCleared && styles.fogCleared]}
        />
        <View
          style={[styles.fog, styles.fog3, leavesCleared && styles.fogCleared]}
        />

        {/* Lantern glow */}
        <View style={styles.glowOuter} />
        <View style={styles.glowMiddle} />
        <View style={styles.glowInner} />

        {/* Lantern */}
        <View style={styles.lantern}>
          <View style={styles.lanternFlame} />
        </View>

        {/* Aetherling */}
        <View style={styles.aetherling}>
          <View style={styles.aetherlingBody}>
            <View style={styles.ears}>
              <View style={styles.ear} />
              <View style={styles.ear} />
            </View>
            <View style={styles.face}>
              <View style={styles.eyes}>
                <View style={styles.eye} />
                <View style={styles.eye} />
              </View>
              <View style={styles.nose} />
            </View>
          </View>
          <Text style={styles.aetherlingName}>Aetherling</Text>
        </View>

        <Text style={styles.aetherlingLine}>
          {feedback || "Could you help me clear the way?"}
        </Text>

        {/* Scene actions */}
        <View style={styles.sceneActions}>
          <Pressable
            style={[styles.sceneBtn, fogCleared && styles.sceneBtnDone]}
            onPress={() => setFogCleared(true)}
          >
            <Text style={styles.sceneBtnText}>
              {fogCleared ? "Fog cleared" : "Clear fog"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.sceneBtn, leavesCleared && styles.sceneBtnDone]}
            onPress={() => setLeavesCleared(true)}
          >
            <Text style={styles.sceneBtnText}>
              {leavesCleared ? "Leaves swept" : "Brush leaves"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* === RITUAL PANEL === */}
      <View style={[styles.ritual, { paddingBottom: insets.bottom + 20 }]}>
        {/* Emotion chips */}
        {!emotion && (
          <View style={styles.emotionSection}>
            <Text style={styles.sectionLabel}>
              {readyForCheckIn
                ? "How are you feeling"
                : "Clear fog or leaves first"}
            </Text>
            {readyForCheckIn && (
              <View style={styles.emotionRow}>
                {(Object.keys(EMOTION_LABELS) as Emotion[]).map((e) => (
                  <Pressable
                    key={e}
                    style={styles.emotionChip}
                    onPress={() => onSelectEmotion(e)}
                  >
                    <Text style={styles.emotionText}>{EMOTION_LABELS[e]}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Today's small thing */}
        {emotion && !questDone && (
          <View style={styles.questSection}>
            <Text style={styles.sectionLabel}>Today's small thing</Text>
            <View style={styles.questCard}>
              <Text style={styles.questText}>{quest}</Text>
            </View>
            <Pressable style={styles.doneBtn} onPress={onDone}>
              <Text style={styles.doneBtnText}>Done</Text>
            </Pressable>
          </View>
        )}

        {/* Rest */}
        {questDone && (
          <View style={styles.restSection}>
            <Pressable style={styles.restBtn} onPress={resetMorning}>
              <Text style={styles.restBtnText}>Rest here</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0f1a",
  },

  // === SCENE ===
  scene: {
    height: height * 0.48,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  // Fog
  fog: {
    position: "absolute",
    backgroundColor: "rgba(180, 200, 220, 0.04)",
    borderRadius: 100,
  },
  fog1: {
    top: "15%",
    left: -40,
    width: "80%",
    height: 60,
    transform: [{ rotate: "-5deg" }],
  },
  fog2: {
    top: "40%",
    right: -30,
    width: "70%",
    height: 50,
    transform: [{ rotate: "3deg" }],
  },
  fog3: {
    bottom: "20%",
    left: 20,
    width: "60%",
    height: 40,
  },
  fogCleared: {
    opacity: 0.2,
  },

  // Glow
  glowOuter: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 180, 100, 0.04)",
  },
  glowMiddle: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 190, 120, 0.06)",
  },
  glowInner: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 200, 140, 0.08)",
  },

  // Lantern
  lantern: {
    width: 22,
    height: 30,
    backgroundColor: "#2a1a0a",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#4a3020",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  lanternFlame: {
    width: 10,
    height: 14,
    borderRadius: 5,
    backgroundColor: "#f4a040",
  },

  // Aetherling
  aetherling: {
    alignItems: "center",
  },
  aetherlingBody: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#8B4513",
    alignItems: "center",
    justifyContent: "center",
  },
  ears: {
    position: "absolute",
    top: -6,
    flexDirection: "row",
    width: 54,
    justifyContent: "space-between",
  },
  ear: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#A0522D",
    borderWidth: 2,
    borderColor: "#CD853F",
  },
  face: {
    width: 44,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#DEB887",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
  },
  eyes: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 3,
  },
  eye: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1a0a00",
  },
  nose: {
    width: 5,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#1a0a00",
  },
  aetherlingName: {
    marginTop: 8,
    fontSize: 10,
    letterSpacing: 2,
    color: "rgba(255, 200, 150, 0.5)",
    textTransform: "uppercase",
  },
  aetherlingLine: {
    marginTop: 14,
    fontSize: 14,
    color: "rgba(255, 248, 240, 0.55)",
    fontStyle: "italic",
    textAlign: "center",
    paddingHorizontal: 40,
  },

  // Scene actions
  sceneActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  sceneBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    borderWidth: 1,
    borderColor: "rgba(255, 200, 150, 0.1)",
  },
  sceneBtnDone: {
    backgroundColor: "rgba(255, 200, 150, 0.1)",
    borderColor: "rgba(255, 200, 150, 0.2)",
  },
  sceneBtnText: {
    fontSize: 12,
    color: "rgba(255, 248, 240, 0.6)",
    letterSpacing: 0.3,
  },

  // === RITUAL ===
  ritual: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "center",
  },

  sectionLabel: {
    fontSize: 11,
    color: "rgba(255, 200, 150, 0.35)",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textAlign: "center",
    marginBottom: 16,
  },

  // Emotions
  emotionSection: {
    alignItems: "center",
  },
  emotionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  emotionChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 200, 150, 0.08)",
  },
  emotionText: {
    fontSize: 13,
    color: "rgba(255, 248, 240, 0.6)",
  },

  // Quest
  questSection: {
    alignItems: "center",
  },
  questCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 150, 0.06)",
    marginBottom: 20,
    maxWidth: 280,
  },
  questText: {
    fontSize: 15,
    color: "rgba(255, 248, 240, 0.75)",
    textAlign: "center",
    lineHeight: 22,
  },
  doneBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 22,
    backgroundColor: "rgba(255, 200, 150, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 200, 150, 0.15)",
  },
  doneBtnText: {
    fontSize: 13,
    color: "rgba(255, 215, 175, 0.7)",
    letterSpacing: 0.5,
  },

  // Rest
  restSection: {
    alignItems: "center",
  },
  restBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  restBtnText: {
    fontSize: 12,
    color: "rgba(255, 200, 150, 0.4)",
  },
});
