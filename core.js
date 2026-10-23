export const STORAGE_KEY = "studywell.v1";
export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function parseDate(value) {
  const d = new Date(`${value}T12:00:00`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    Number.isFinite(+d) &&
    localDate(d) === value
    ? d
    : null;
}
export function minutes(time) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time)
    ? Number(time.slice(0, 2)) * 60 + Number(time.slice(3))
    : NaN;
}
export function duration(session) {
  return (minutes(session.end) - minutes(session.start)) / 60;
}
export function overlaps(a, b) {
  return (
    a.id !== b.id &&
    a.date === b.date &&
    minutes(a.start) < minutes(b.end) &&
    minutes(b.start) < minutes(a.end)
  );
}
export function validTask(t) {
  return (
    t &&
    typeof t.id === "string" &&
    typeof t.title === "string" &&
    t.title.trim().length > 0 &&
    t.title.length <= 100 &&
    typeof t.course === "string" &&
    t.course.trim().length > 0 &&
    t.course.length <= 60 &&
    parseDate(t.deadline) &&
    Number.isFinite(t.effort) &&
    t.effort >= 0.25 &&
    t.effort <= 1000 &&
    typeof t.done === "boolean"
  );
}
export function validSession(s, tasks) {
  return (
    s &&
    typeof s.id === "string" &&
    tasks.some((t) => t.id === s.taskId) &&
    parseDate(s.date) &&
    Number.isFinite(minutes(s.start)) &&
    Number.isFinite(minutes(s.end)) &&
    duration(s) > 0 &&
    typeof s.done === "boolean"
  );
}
export function validState(data) {
  return (
    data &&
    data.version === 1 &&
    typeof data.demo === "boolean" &&
    Array.isArray(data.tasks) &&
    Array.isArray(data.sessions) &&
    data.tasks.every(validTask) &&
    new Set(data.tasks.map((t) => t.id)).size === data.tasks.length &&
    data.sessions.every((s) => validSession(s, data.tasks)) &&
    new Set(data.sessions.map((s) => s.id)).size === data.sessions.length
  );
}
export function emptyState() {
  return { version: 1, demo: false, tasks: [], sessions: [] };
}
export function monday(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  d.setHours(12, 0, 0, 0);
  return d;
}
export function demoState(now = new Date()) {
  const start = monday(now);
  const day = (n) => {
    const d = new Date(start);
    d.setDate(d.getDate() + n);
    return localDate(d);
  };
  return {
    version: 1,
    demo: true,
    tasks: [
      {
        id: "demo-1",
        title: "Explore classification models",
        course: "DAVE3625 · Fictional",
        deadline: day(5),
        effort: 5,
        done: false,
      },
      {
        id: "demo-2",
        title: "Practice matrix operations",
        course: "MATH1000 · Fictional",
        deadline: day(6),
        effort: 3,
        done: false,
      },
      {
        id: "demo-3",
        title: "Read the design chapter",
        course: "DESIGN101 · Fictional",
        deadline: day(4),
        effort: 2,
        done: true,
      },
    ],
    sessions: [
      {
        id: "demo-s1",
        taskId: "demo-1",
        date: day(0),
        start: "09:00",
        end: "10:30",
        done: true,
      },
      {
        id: "demo-s2",
        taskId: "demo-2",
        date: day(1),
        start: "13:00",
        end: "14:00",
        done: false,
      },
      {
        id: "demo-s3",
        taskId: "demo-1",
        date: day(2),
        start: "10:00",
        end: "11:30",
        done: false,
      },
      {
        id: "demo-s4",
        taskId: "demo-2",
        date: day(2),
        start: "11:00",
        end: "12:00",
        done: false,
      },
      {
        id: "demo-s5",
        taskId: "demo-3",
        date: day(4),
        start: "09:00",
        end: "11:00",
        done: true,
      },
    ],
  };
}
