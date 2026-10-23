import { emptyState, validState, STORAGE_KEY } from "./core.js";

// Return failures to the UI rather than crashing or silently discarding saved data.
export function loadPlanner(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (raw === null) return { state: emptyState(), error: false };
    const state = JSON.parse(raw);
    if (!validState(state)) throw new Error("Invalid planner data");
    return { state, error: false };
  } catch {
    return { state: emptyState(), error: true };
  }
}

export function storePlanner(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
