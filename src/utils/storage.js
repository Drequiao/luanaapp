export function storageGet(key) {
  try { return localStorage.getItem(key); } catch (e) {}
  try { return sessionStorage.getItem(key); } catch (e) {}
  return null;
}

export function storageSet(key, val) {
  try { localStorage.setItem(key, val); return; } catch (e) {}
  try { sessionStorage.setItem(key, val); return; } catch (e) {}
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
