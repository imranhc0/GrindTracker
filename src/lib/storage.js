// Simple LocalStorage wrapper with JSON safety
const KEY_PREFIX = 'gt_';

function getKey(key) {
  return `${KEY_PREFIX}${key}`;
}

export function load(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(getKey(key));
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('LocalStorage load error', key, e);
    return fallback;
  }
}

export function save(key, value) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(getKey(key), JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage save error', key, e);
  }
}

export function remove(key) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(getKey(key));
  } catch (e) {
    console.warn('LocalStorage remove error', key, e);
  }
}

export const STORAGE_KEYS = {
  GOALS: 'goals',
  TASKS: 'tasks',
  LOGS: 'logs',
  LAST_REMINDER: 'last_reminder',
  GAMIFICATION: 'gamification',
};

