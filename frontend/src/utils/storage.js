const STORAGE_PREFIX = "skillbridge_";

export function getStorageItem(key, fallback = null) {
  try {
    const value = localStorage.getItem(`${STORAGE_PREFIX}${key}`);

    if (value === null) return fallback;

    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function setStorageItem(key, value) {
  try {
    localStorage.setItem(
      `${STORAGE_PREFIX}${key}`,
      JSON.stringify(value)
    );

    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(key) {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    return true;
  } catch {
    return false;
  }
}

export function clearAppPreferences() {
  try {
    const keysToRemove = [];

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);

      if (
        key &&
        key.startsWith(STORAGE_PREFIX) &&
        key !== `${STORAGE_PREFIX}access_token` &&
        key !== `${STORAGE_PREFIX}user`
      ) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));

    return true;
  } catch {
    return false;
  }
}