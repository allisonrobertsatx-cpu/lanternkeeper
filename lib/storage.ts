import AsyncStorage from '@react-native-async-storage/async-storage';

const LOG_PREFIX = 'daily-log:';

export interface DailyLog {
  date: string;
  completedQuests: string[];
}

// Get today's date as YYYY-MM-DD
export function getTodayKey(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Get storage key for a date
function getStorageKey(date: string): string {
  return `${LOG_PREFIX}${date}`;
}

// Save daily log
export async function saveDailyLog(log: DailyLog): Promise<void> {
  const key = getStorageKey(log.date);
  await AsyncStorage.setItem(key, JSON.stringify(log));
}

// Load daily log for a specific date
export async function loadDailyLog(date: string): Promise<DailyLog | null> {
  const key = getStorageKey(date);
  const data = await AsyncStorage.getItem(key);
  if (!data) return null;
  return JSON.parse(data) as DailyLog;
}

// Load today's log (convenience)
export async function loadTodayLog(): Promise<DailyLog> {
  const today = getTodayKey();
  const existing = await loadDailyLog(today);
  return existing ?? { date: today, completedQuests: [] };
}

// Mark a quest as completed for today
export async function completeQuest(questId: string): Promise<DailyLog> {
  const log = await loadTodayLog();
  if (!log.completedQuests.includes(questId)) {
    log.completedQuests.push(questId);
    await saveDailyLog(log);
  }
  return log;
}

// Calculate current streak (consecutive days with at least one quest)
export async function calculateStreak(): Promise<number> {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    const log = await loadDailyLog(key);

    if (log && log.completedQuests.length > 0) {
      streak++;
    } else if (i > 0) {
      // Allow today to be incomplete, but break on past empty days
      break;
    }
  }

  return streak;
}
