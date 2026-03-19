import { GAME_VERSION, PROFILE_STORAGE_KEY } from "./data.js";
import { createProfile } from "./logic.js";

function fallbackState() {
  const defaultProfile = createProfile("牌友");
  return {
    version: GAME_VERSION,
    activeProfileId: defaultProfile.id,
    profiles: [defaultProfile],
    settings: {
      reducedMotion: false,
      sound: false,
      theme: "crimson",
    },
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      return fallbackState();
    }

    const parsed = JSON.parse(raw);
    if (!parsed.profiles?.length) {
      return fallbackState();
    }

    return {
      version: parsed.version ?? GAME_VERSION,
      activeProfileId: parsed.activeProfileId ?? parsed.profiles[0].id,
      profiles: parsed.profiles,
      settings: {
        reducedMotion: Boolean(parsed.settings?.reducedMotion),
        sound: Boolean(parsed.settings?.sound),
        theme: parsed.settings?.theme ?? "crimson",
      },
    };
  } catch {
    return fallbackState();
  }
}

export function saveState(state) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(state));
}

export function exportState(state) {
  return JSON.stringify(state, null, 2);
}

export function importState(raw) {
  const parsed = JSON.parse(raw);
  if (!parsed.profiles?.length) {
    throw new Error("存档中没有可用的角色数据。");
  }
  return parsed;
}
