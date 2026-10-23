import { test } from "node:test";
import assert from "node:assert/strict";
import {
  parseDate,
  overlaps,
  duration,
  validState,
  emptyState,
  demoState,
  monday,
  localDate,
  validSession,
} from "../core.js";
import { loadPlanner, storePlanner } from "../storage.js";
test("calendar validation rejects impossible dates and respects leap years", () => {
  assert.equal(parseDate("2026-02-30"), null);
  assert.equal(parseDate("2026-02-29"), null);
  assert.ok(parseDate("2028-02-29"));
  assert.equal(parseDate("bad"), null);
});
test("overlaps include partial and contained sessions, exclude adjacent sessions and other dates", () => {
  const a = { id: "a", date: "2026-10-23", start: "09:00", end: "11:00" };
  assert.ok(overlaps(a, { ...a, id: "b", start: "10:00", end: "12:00" }));
  assert.ok(overlaps(a, { ...a, id: "b", start: "09:30", end: "10:00" }));
  assert.equal(
    overlaps(a, { ...a, id: "b", start: "11:00", end: "12:00" }),
    false,
  );
  assert.equal(overlaps(a, { ...a, id: "b", date: "2026-10-24" }), false);
  assert.equal(overlaps(a, a), false);
});
test("demo and empty state round-trip and corrupt or orphaned data is rejected", () => {
  assert.ok(validState(emptyState()));
  const demo = demoState(new Date("2026-10-23T12:00:00"));
  assert.ok(validState(JSON.parse(JSON.stringify(demo))));
  assert.equal(validState({ ...demo, tasks: [] }), false);
  assert.equal(validState({ ...demo, version: 2 }), false);
  assert.equal(
    validState({ ...demo, tasks: [...demo.tasks, demo.tasks[0]] }),
    false,
  );
});
test("session validation rejects backwards times and missing task references", () => {
  const d = demoState();
  const s = d.sessions[0];
  assert.equal(duration(s), 1.5);
  assert.equal(validSession({ ...s, end: "08:00" }, d.tasks), false);
  assert.equal(validSession({ ...s, start: "25:00" }, d.tasks), false);
  assert.equal(validSession({ ...s, taskId: "missing" }, d.tasks), false);
});
test("week starts on Monday including Sundays and year boundaries", () => {
  assert.equal(
    localDate(monday(new Date("2026-10-25T12:00:00"))),
    "2026-10-19",
  );
  assert.equal(
    localDate(monday(new Date("2027-01-01T12:00:00"))),
    "2026-12-28",
  );
});
test("storage round-trip survives a new load", () => {
  let value = null;
  const storage = {
    getItem: () => value,
    setItem: (_, next) => {
      value = next;
    },
  };
  assert.deepEqual(loadPlanner(storage).state, emptyState());
  const data = demoState();
  assert.ok(storePlanner(storage, data));
  assert.deepEqual(loadPlanner(storage), { state: data, error: false });
});
test("storage failures are reported and corrupt data is not overwritten", () => {
  let writes = 0;
  const corrupt = {
    getItem: () => "{broken",
    setItem: () => {
      writes++;
    },
  };
  assert.equal(loadPlanner(corrupt).error, true);
  assert.equal(writes, 0);
  const blocked = {
    getItem() {
      throw Error("Blocked");
    },
    setItem() {
      throw Error("Quota");
    },
  };
  assert.equal(loadPlanner(blocked).error, true);
  assert.equal(storePlanner(blocked, demoState()), false);
});
