import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { quests, Quest } from '@/data/quests';
import { getRandomTierFeedback } from '@/data/feedback';
import { loadTodayLog, completeQuest, DailyLog } from '@/lib/storage';

const { width, height } = Dimensions.get('window');
const SCENE_HEIGHT = height * 0.48;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [dailyLog, setDailyLog] = useState<DailyLog>({ date: '', completedQuests: [] });
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  useEffect(() => {
    loadTodayLog().then(setDailyLog);
  }, []);

  const handleQuestPress = async (quest: Quest) => {
    if (dailyLog.completedQuests.includes(quest.id)) return;

    const updatedLog = await completeQuest(quest.id);
    setDailyLog(updatedLog);
    setFeedbackMessage(getRandomTierFeedback(quest.tier));

    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const isCompleted = (questId: string) => dailyLog.completedQuests.includes(questId);

  const sparkQuests = quests.filter((q) => q.tier === 'spark');
  const emberQuests = quests.filter((q) => q.tier === 'ember');
  const flameQuests = quests.filter((q) => q.tier === 'flame');

  const emotions = ['Stuck', 'Frustrated', 'Inspired', 'Alright'];

  return (
    <View style={styles.container}>
      {/* Background layers */}
      <LinearGradient
        colors={['#0f1623', '#1a2436', '#0f1623']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Scene area - top half */}
      <View style={[styles.sceneContainer, { paddingTop: insets.top }]}>
        {/* Distant fog layers */}
        <View style={styles.fogDistant} />
        <View style={styles.fogMid} />
        <View style={styles.fogClose} />

        {/* Lantern glow - soft ambient light */}
        <View style={styles.lanternGlowOuter} />
        <View style={styles.lanternGlowInner} />

        {/* Aetherling card */}
        <View style={styles.aetherlingCard}>
          <View style={styles.aetherlingGlow} />
          <Text style={styles.aetherlingSymbol}>{")"}</Text>
          <Text style={styles.aetherlingName}>Aetherling</Text>
          {feedbackMessage ? (
            <Text style={styles.aetherlingMessage}>{feedbackMessage}</Text>
          ) : (
            <Text style={styles.aetherlingMessage}>The clearing is quiet today.</Text>
          )}
        </View>

        {/* Scene actions - fog and leaves */}
        <View style={styles.sceneActions}>
          <Pressable style={({ pressed }) => [styles.sceneAction, pressed && styles.sceneActionPressed]}>
            <View style={styles.actionGlow} />
            <Text style={styles.actionLabel}>Clear fog</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.sceneAction, pressed && styles.sceneActionPressed]}>
            <View style={styles.actionGlow} />
            <Text style={styles.actionLabel}>Brush leaves</Text>
          </Pressable>
        </View>
      </View>

      {/* Ritual panel - bottom half */}
      <View style={styles.ritualPanel}>
        <LinearGradient
          colors={['transparent', 'rgba(15, 22, 35, 0.95)', 'rgba(15, 22, 35, 1)']}
          locations={[0, 0.1, 0.3]}
          style={StyleSheet.absoluteFill}
        />

        <ScrollView
          style={styles.ritualScroll}
          contentContainerStyle={[styles.ritualContent, { paddingBottom: insets.bottom + 90 }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Emotion chips */}
          <View style={styles.emotionSection}>
            <Text style={styles.sectionWhisper}>How are you feeling</Text>
            <View style={styles.emotionChips}>
              {emotions.map((emotion) => (
                <Pressable
                  key={emotion}
                  onPress={() => setSelectedEmotion(emotion)}
                  style={[
                    styles.emotionChip,
                    selectedEmotion === emotion && styles.emotionChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.emotionText,
                      selectedEmotion === emotion && styles.emotionTextSelected,
                    ]}
                  >
                    {emotion}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Quests - subtle, calm */}
          <View style={styles.questSection}>
            <Text style={styles.sectionWhisper}>Small things</Text>

            {sparkQuests.map((quest) => (
              <QuestWhisper
                key={quest.id}
                quest={quest}
                completed={isCompleted(quest.id)}
                onPress={() => handleQuestPress(quest)}
              />
            ))}

            <View style={styles.questDivider} />

            {emberQuests.map((quest) => (
              <QuestWhisper
                key={quest.id}
                quest={quest}
                completed={isCompleted(quest.id)}
                onPress={() => handleQuestPress(quest)}
              />
            ))}

            <View style={styles.questDivider} />

            {flameQuests.map((quest) => (
              <QuestWhisper
                key={quest.id}
                quest={quest}
                completed={isCompleted(quest.id)}
                onPress={() => handleQuestPress(quest)}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function QuestWhisper({
  quest,
  completed,
  onPress,
}: {
  quest: Quest;
  completed: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.questWhisper,
        completed && styles.questWhisperCompleted,
        pressed && !completed && styles.questWhisperPressed,
      ]}
    >
      <View style={styles.questDot}>
        {completed && <View style={styles.questDotFilled} />}
      </View>
      <View style={styles.questTextContainer}>
        <Text style={[styles.questTitle, completed && styles.questTitleCompleted]}>
          {quest.title}
        </Text>
        <Text style={[styles.questHint, completed && styles.questHintCompleted]}>
          {quest.description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1623',
  },

  // Scene - top half
  sceneContainer: {
    height: SCENE_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fogDistant: {
    position: 'absolute',
    top: '15%',
    left: -width * 0.3,
    width: width * 1.6,
    height: 140,
    backgroundColor: 'rgba(180, 200, 220, 0.03)',
    borderRadius: 70,
    transform: [{ rotate: '-3deg' }],
  },
  fogMid: {
    position: 'absolute',
    top: '35%',
    left: -width * 0.2,
    width: width * 1.4,
    height: 100,
    backgroundColor: 'rgba(200, 180, 160, 0.025)',
    borderRadius: 50,
    transform: [{ rotate: '2deg' }],
  },
  fogClose: {
    position: 'absolute',
    bottom: '10%',
    left: -width * 0.1,
    width: width * 1.2,
    height: 80,
    backgroundColor: 'rgba(255, 220, 180, 0.02)',
    borderRadius: 40,
  },
  lanternGlowOuter: {
    position: 'absolute',
    top: '20%',
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255, 180, 120, 0.04)',
    borderRadius: 100,
  },
  lanternGlowInner: {
    position: 'absolute',
    top: '25%',
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 200, 150, 0.06)',
    borderRadius: 50,
  },

  // Aetherling
  aetherlingCard: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 32,
    zIndex: 10,
  },
  aetherlingGlow: {
    position: 'absolute',
    top: 10,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 200, 150, 0.08)',
    borderRadius: 40,
  },
  aetherlingSymbol: {
    fontSize: 40,
    color: 'rgba(255, 220, 180, 0.7)',
    marginBottom: 8,
    fontWeight: '200',
  },
  aetherlingName: {
    fontSize: 11,
    color: 'rgba(255, 220, 180, 0.4)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  aetherlingMessage: {
    fontSize: 15,
    color: 'rgba(255, 248, 240, 0.6)',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 260,
  },

  // Scene actions
  sceneActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  sceneAction: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 150, 0.1)',
    overflow: 'hidden',
  },
  sceneActionPressed: {
    backgroundColor: 'rgba(255, 200, 150, 0.08)',
    borderColor: 'rgba(255, 200, 150, 0.2)',
  },
  actionGlow: {
    position: 'absolute',
    top: -10,
    left: '50%',
    marginLeft: -15,
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 200, 150, 0.1)',
    borderRadius: 15,
  },
  actionLabel: {
    fontSize: 13,
    color: 'rgba(255, 248, 240, 0.5)',
    letterSpacing: 0.5,
  },

  // Ritual panel - bottom half
  ritualPanel: {
    flex: 1,
    marginTop: -20,
  },
  ritualScroll: {
    flex: 1,
  },
  ritualContent: {
    paddingHorizontal: 28,
    paddingTop: 32,
  },

  // Section labels
  sectionWhisper: {
    fontSize: 11,
    color: 'rgba(255, 200, 150, 0.3)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 14,
    marginLeft: 2,
  },

  // Emotions
  emotionSection: {
    marginBottom: 32,
  },
  emotionChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  emotionChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 150, 0.06)',
  },
  emotionChipSelected: {
    backgroundColor: 'rgba(255, 200, 150, 0.08)',
    borderColor: 'rgba(255, 200, 150, 0.2)',
  },
  emotionText: {
    fontSize: 13,
    color: 'rgba(255, 248, 240, 0.4)',
  },
  emotionTextSelected: {
    color: 'rgba(255, 220, 180, 0.8)',
  },

  // Quests
  questSection: {
    marginBottom: 20,
  },
  questDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 200, 150, 0.04)',
    marginVertical: 12,
    marginHorizontal: 20,
  },
  questWhisper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  questWhisperCompleted: {
    opacity: 0.4,
  },
  questWhisperPressed: {
    backgroundColor: 'rgba(255, 200, 150, 0.03)',
    marginHorizontal: -8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  questDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 200, 150, 0.15)',
    marginRight: 14,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questDotFilled: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 200, 150, 0.5)',
  },
  questTextContainer: {
    flex: 1,
  },
  questTitle: {
    fontSize: 14,
    color: 'rgba(255, 248, 240, 0.7)',
    marginBottom: 3,
    lineHeight: 20,
  },
  questTitleCompleted: {
    color: 'rgba(255, 248, 240, 0.35)',
  },
  questHint: {
    fontSize: 12,
    color: 'rgba(255, 248, 240, 0.3)',
    lineHeight: 17,
  },
  questHintCompleted: {
    color: 'rgba(255, 248, 240, 0.15)',
  },
});
