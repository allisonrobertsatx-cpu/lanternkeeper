import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  completeQuest,
  getTodayKey,
  loadTodayLog,
  loadWorldState,
  recordDailyVisit,
  WorldState,
} from "@/lib/storage";

const { width, height } = Dimensions.get("window");
const SCENE_HEIGHT = height * 0.48;

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

// Initial fog wisp positions (relative to scene)
const FOG_WISPS = [
  { id: 1, x: width * 0.15, y: SCENE_HEIGHT * 0.15, size: 90, rotation: -8 },
  { id: 2, x: width * 0.55, y: SCENE_HEIGHT * 0.12, size: 70, rotation: 5 },
  { id: 3, x: width * 0.3, y: SCENE_HEIGHT * 0.35, size: 100, rotation: -3 },
  { id: 4, x: width * 0.7, y: SCENE_HEIGHT * 0.32, size: 80, rotation: 8 },
  { id: 5, x: width * 0.1, y: SCENE_HEIGHT * 0.55, size: 85, rotation: -5 },
];

// Initial leaf positions
const LEAVES = [
  { id: 1, x: width * 0.2, y: SCENE_HEIGHT * 0.7, rotation: 45 },
  { id: 2, x: width * 0.5, y: SCENE_HEIGHT * 0.75, rotation: -30 },
  { id: 3, x: width * 0.75, y: SCENE_HEIGHT * 0.68, rotation: 60 },
  { id: 4, x: width * 0.35, y: SCENE_HEIGHT * 0.82, rotation: -15 },
  { id: 5, x: width * 0.6, y: SCENE_HEIGHT * 0.85, rotation: 30 },
];

// Interactive fog wisp component
function FogWisp({
  x,
  y,
  size,
  rotation,
  cleared,
  onClear,
}: {
  x: number;
  y: number;
  size: number;
  rotation: number;
  cleared: boolean;
  onClear: () => void;
}) {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (cleared) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -30,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cleared, opacity, scale, translateY]);

  return (
    <Animated.View
      style={[
        styles.fogWisp,
        {
          left: x - size / 2,
          top: y - 25,
          width: size,
          height: 50,
          transform: [
            { rotate: `${rotation}deg` },
            { scale },
            { translateY },
          ],
          opacity,
        },
      ]}
      pointerEvents={cleared ? "none" : "auto"}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onClear}
      />
    </Animated.View>
  );
}

// Interactive leaf component
function Leaf({
  x,
  y,
  rotation,
  cleared,
  onClear,
}: {
  x: number;
  y: number;
  rotation: number;
  cleared: boolean;
  onClear: () => void;
}) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (cleared) {
      const direction = Math.random() > 0.5 ? 1 : -1;
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: direction * (50 + Math.random() * 50),
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -80 - Math.random() * 40,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(spin, {
          toValue: direction * 2,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cleared, opacity, translateX, translateY, spin]);

  const spinInterpolate = spin.interpolate({
    inputRange: [-2, 2],
    outputRange: ["-360deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.leaf,
        {
          left: x - 12,
          top: y - 8,
          transform: [
            { rotate: `${rotation}deg` },
            { translateX },
            { translateY },
            { rotate: spinInterpolate },
          ],
          opacity,
        },
      ]}
      pointerEvents={cleared ? "none" : "auto"}
    >
      <Pressable
        style={styles.leafTouchArea}
        onPress={onClear}
      >
        <View style={styles.leafBody}>
          <View style={styles.leafStem} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

// Animated speech bubble component
function SpeechBubble({ text }: { text: string }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;
  const prevTextRef = useRef(text);

  useEffect(() => {
    if (prevTextRef.current !== text) {
      prevTextRef.current = text;

      fadeAnim.setValue(0);
      slideAnim.setValue(8);
      dotOpacity.setValue(1);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      Animated.sequence([
        Animated.delay(600),
        Animated.timing(dotOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [text, fadeAnim, slideAnim, dotOpacity]);

  return (
    <View style={styles.speechBubbleContainer}>
      <Animated.View style={[styles.newDialogueDot, { opacity: dotOpacity }]} />
      <View style={styles.speechBubble}>
        <View style={styles.bubbleTail} />
        <Animated.Text
          style={[
            styles.speechText,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {text}
        </Animated.Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [clearedFog, setClearedFog] = useState<Set<number>>(new Set());
  const [clearedLeaves, setClearedLeaves] = useState<Set<number>>(new Set());
  const [emotion, setEmotion] = useState<Emotion | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [quest, setQuest] = useState<string>("");
  const [questDone, setQuestDone] = useState(false);
  const [dialogue, setDialogue] = useState("Could you help me clear the way?");
  const [newUnlocks, setNewUnlocks] = useState<string[]>([]);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [worldState, setWorldState] = useState<WorldState | null>(null);

  const fogCleared = clearedFog.size >= 3;
  const leavesCleared = clearedLeaves.size >= 3;
  const readyForCheckIn = fogCleared || leavesCleared;

  // Load saved state on mount
  useEffect(() => {
    async function loadState() {
      const [state, todayLog] = await Promise.all([
        loadWorldState(),
        loadTodayLog(),
      ]);
      setWorldState(state);

      const today = getTodayKey();
      if (state.lastVisitDate === today) {
        setAlreadyCheckedIn(true);
        setClearedFog(new Set(FOG_WISPS.map((f) => f.id)));
        setClearedLeaves(new Set(LEAVES.map((l) => l.id)));
        if (todayLog.completedQuests.length > 0) {
          setQuestDone(true);
          setDialogue("Welcome back, Lanternkeeper.");
        } else {
          setDialogue("You've already visited today.");
        }
      }
    }
    loadState();
  }, []);

  // Update dialogue when fog/leaves are cleared
  useEffect(() => {
    if (!alreadyCheckedIn) {
      if (fogCleared && !leavesCleared && clearedFog.size === 3) {
        setDialogue("The fog thins a little.");
      } else if (leavesCleared && !fogCleared && clearedLeaves.size === 3) {
        setDialogue("Leaves drift away.");
      } else if (fogCleared && leavesCleared) {
        setDialogue("The path is clear.");
      }
    }
  }, [fogCleared, leavesCleared, clearedFog.size, clearedLeaves.size, alreadyCheckedIn]);

  const handleClearFog = useCallback((id: number) => {
    setClearedFog((prev) => {
      if (prev.has(id)) return prev;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const handleClearLeaf = useCallback((id: number) => {
    setClearedLeaves((prev) => {
      if (prev.has(id)) return prev;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // Pan gesture for swiping across multiple elements
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const touchX = event.x;
      const touchY = event.y;

      // Check fog wisps
      FOG_WISPS.forEach((wisp) => {
        if (!clearedFog.has(wisp.id)) {
          const dx = touchX - wisp.x;
          const dy = touchY - wisp.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < wisp.size / 2 + 20) {
            handleClearFog(wisp.id);
          }
        }
      });

      // Check leaves
      LEAVES.forEach((leaf) => {
        if (!clearedLeaves.has(leaf.id)) {
          const dx = touchX - leaf.x;
          const dy = touchY - leaf.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 35) {
            handleClearLeaf(leaf.id);
          }
        }
      });
    })
    .minDistance(0);

  const pickFeedback = (e: Emotion) => {
    const options = FEEDBACK[e];
    return options[Math.floor(Math.random() * options.length)];
  };

  const pickQuest = (e: Emotion) => {
    const options = QUESTS[e];
    return options[Math.floor(Math.random() * options.length)];
  };

  const onSelectEmotion = useCallback(
    async (e: Emotion) => {
      setEmotion(e);
      setQuest(pickQuest(e));
      setQuestDone(false);
      setDialogue("A path appears.");

      const previousRegions = worldState?.unlockedRegions ?? ["lantern-clearing"];
      const updatedState = await recordDailyVisit(e);
      setWorldState(updatedState);
      setAlreadyCheckedIn(true);

      const newlyUnlocked = updatedState.unlockedRegions.filter(
        (r) => !previousRegions.includes(r)
      );
      if (newlyUnlocked.length > 0) {
        setNewUnlocks(newlyUnlocked);
      }
    },
    [worldState]
  );

  const onDone = useCallback(async () => {
    setQuestDone(true);
    const fb = pickFeedback(emotion!);
    setFeedback(fb);

    if (newUnlocks.length > 0) {
      const regionNames: Record<string, string> = {
        "workshop-glade": "Workshop Glade",
        "fog-valley": "Fog Valley",
        "warm-river": "Warm River",
        "observatory-balcony": "Observatory Balcony",
        "the-long-path": "The Long Path",
      };
      const unlockName = regionNames[newUnlocks[0]] ?? newUnlocks[0];
      setDialogue(`New region unlocked: ${unlockName}`);
      setNewUnlocks([]);
    } else {
      setDialogue(fb);
    }

    const questId = `${getTodayKey()}-${emotion}`;
    await completeQuest(questId);
  }, [emotion, newUnlocks]);

  const resetMorning = () => {
    setClearedFog(new Set());
    setClearedLeaves(new Set());
    setEmotion(null);
    setFeedback("");
    setQuest("");
    setQuestDone(false);
    setAlreadyCheckedIn(false);
    setDialogue("Could you help me clear the way?");
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0a0f1a", "#141e30", "#0a0f1a"]}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* === SCENE === */}
      <GestureDetector gesture={panGesture}>
        <View style={[styles.scene, { paddingTop: insets.top + 16 }]}>
          {/* Interactive fog wisps */}
          {FOG_WISPS.map((wisp) => (
            <FogWisp
              key={wisp.id}
              x={wisp.x}
              y={wisp.y}
              size={wisp.size}
              rotation={wisp.rotation}
              cleared={clearedFog.has(wisp.id)}
              onClear={() => handleClearFog(wisp.id)}
            />
          ))}

          {/* Interactive leaves */}
          {LEAVES.map((leaf) => (
            <Leaf
              key={leaf.id}
              x={leaf.x}
              y={leaf.y}
              rotation={leaf.rotation}
              cleared={clearedLeaves.has(leaf.id)}
              onClear={() => handleClearLeaf(leaf.id)}
            />
          ))}

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

          {/* Speech bubble */}
          <SpeechBubble text={dialogue} />

          {/* Progress hints */}
          {!readyForCheckIn && !alreadyCheckedIn && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>
                {clearedFog.size > 0 || clearedLeaves.size > 0
                  ? "Keep going..."
                  : "Swipe to clear the fog and leaves"}
              </Text>
              <View style={styles.progressDots}>
                <View style={styles.progressGroup}>
                  <Text style={styles.progressLabel}>Fog</Text>
                  <View style={styles.dots}>
                    {[1, 2, 3].map((i) => (
                      <View
                        key={`fog-${i}`}
                        style={[
                          styles.dot,
                          clearedFog.size >= i && styles.dotFilled,
                        ]}
                      />
                    ))}
                  </View>
                </View>
                <View style={styles.progressGroup}>
                  <Text style={styles.progressLabel}>Leaves</Text>
                  <View style={styles.dots}>
                    {[1, 2, 3].map((i) => (
                      <View
                        key={`leaf-${i}`}
                        style={[
                          styles.dot,
                          clearedLeaves.size >= i && styles.dotFilled,
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
          )}
        </View>
      </GestureDetector>

      {/* === RITUAL PANEL === */}
      <View style={[styles.ritual, { paddingBottom: insets.bottom + 20 }]}>
        {/* Emotion chips */}
        {!emotion && !alreadyCheckedIn && (
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

        {/* Already checked in today */}
        {!emotion && alreadyCheckedIn && !questDone && (
          <View style={styles.restSection}>
            {worldState && worldState.totalDaysVisited > 0 && (
              <Text style={styles.dayCount}>
                Day {worldState.totalDaysVisited}
              </Text>
            )}
            <Text style={styles.alreadyCheckedIn}>
              You've tended the lantern today.
            </Text>
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
            {worldState && worldState.totalDaysVisited > 0 && (
              <Text style={styles.dayCount}>
                Day {worldState.totalDaysVisited}
              </Text>
            )}
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
    height: SCENE_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  // Fog wisps
  fogWisp: {
    position: "absolute",
    backgroundColor: "rgba(180, 200, 220, 0.08)",
    borderRadius: 50,
  },

  // Leaves
  leaf: {
    position: "absolute",
    zIndex: 15,
  },
  leafTouchArea: {
    padding: 15,
  },
  leafBody: {
    width: 24,
    height: 16,
    backgroundColor: "#8B6914",
    borderRadius: 12,
    borderTopLeftRadius: 3,
  },
  leafStem: {
    position: "absolute",
    bottom: -4,
    left: 10,
    width: 2,
    height: 8,
    backgroundColor: "#5D4A1A",
    borderRadius: 1,
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
    zIndex: 10,
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
    zIndex: 10,
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

  // Speech bubble
  speechBubbleContainer: {
    marginTop: 12,
    alignItems: "center",
    zIndex: 10,
  },
  newDialogueDot: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#f4a040",
    zIndex: 10,
  },
  speechBubble: {
    backgroundColor: "rgba(255, 250, 240, 0.08)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 200, 150, 0.15)",
    maxWidth: 280,
    minHeight: 44,
    justifyContent: "center",
  },
  bubbleTail: {
    position: "absolute",
    top: -6,
    left: "50%",
    marginLeft: -6,
    width: 12,
    height: 12,
    backgroundColor: "rgba(255, 250, 240, 0.08)",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderColor: "rgba(255, 200, 150, 0.15)",
    transform: [{ rotate: "45deg" }],
  },
  speechText: {
    fontSize: 16,
    color: "rgba(255, 248, 240, 0.85)",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 22,
  },

  // Hints
  hintContainer: {
    position: "absolute",
    bottom: 16,
    alignItems: "center",
  },
  hintText: {
    fontSize: 12,
    color: "rgba(255, 200, 150, 0.4)",
    marginBottom: 12,
  },
  progressDots: {
    flexDirection: "row",
    gap: 24,
  },
  progressGroup: {
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 10,
    color: "rgba(255, 200, 150, 0.3)",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 200, 150, 0.15)",
  },
  dotFilled: {
    backgroundColor: "rgba(255, 200, 150, 0.6)",
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
  dayCount: {
    fontSize: 11,
    color: "rgba(255, 200, 150, 0.35)",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  alreadyCheckedIn: {
    fontSize: 14,
    color: "rgba(255, 248, 240, 0.5)",
    fontStyle: "italic",
    textAlign: "center",
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
