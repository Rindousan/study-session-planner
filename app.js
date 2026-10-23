import {
  STORAGE_KEY,
  localDate,
  parseDate,
  duration,
  overlaps,
  validTask,
  validSession,
  emptyState,
  monday,
  demoState,
} from "./core.js";
import { loadPlanner, storePlanner } from "./storage.js";
const $ = (s) => document.querySelector(s),
  esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
let state = emptyState(),
  week = monday(new Date()),
  editingTask = null,
  editingSession = null;
function storageError(message) {
  $("#storage-error").textContent = message;
  $("#storage-error").hidden = false;
  $(".local-badge").textContent = "! Storage needs attention";
}
const browserStorage = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, value) => localStorage.setItem(key, value),
};
const loaded = loadPlanner(browserStorage);
state = loaded.state;
if (loaded.error)
  storageError(
    "Your saved planner could not be read. We have not overwritten it. Clear the planner deliberately to reset storage, or reload to try again. Changes remain in memory until storage works.",
  );
let storageBlocked = !$("#storage-error").hidden;
function save(message) {
  const focused = document.activeElement;
  const focusAction = focused?.dataset.action;
  const focusId = focused?.dataset.id;
  if (!storageBlocked) {
    if (storePlanner(browserStorage, state)) {
      $("#storage-error").hidden = true;
      $(".local-badge").textContent = "● Saved on this device";
    } else {
      storageError(
        "Changes are available in this tab, but could not be saved. Browser storage may be blocked or full. Keep this tab open; try clearing unused browser storage and make another change to retry.",
      );
    }
  }
  render();
  // Completion redraws cards; keep the keyboard user's place in the planner.
  if (focusAction) {
    const replacement = [...document.querySelectorAll('[data-action]')].find(
      (control) => control.dataset.action === focusAction && control.dataset.id === focusId,
    );
    (replacement || $("#add-task")).focus();
  }
  $("#notice").textContent = message;
}
const fmt = (d) =>
  parseDate(d).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
const hours = (n) => `${Number(n.toFixed(2))} h`;
function render() {
  const td = state.tasks.filter((t) => t.done).length,
    sd = state.sessions.filter((s) => s.done).length;
  $("#task-stat").textContent = `${td} / ${state.tasks.length}`;
  $("#session-stat").textContent = `${sd} / ${state.sessions.length}`;
  $("#task-progress").max = state.tasks.length || 1;
  $("#task-progress").value = td;
  $("#session-progress").max = state.sessions.length || 1;
  $("#session-progress").value = sd;
  $("#time-stat").textContent = hours(
    state.sessions.filter((s) => s.done).reduce((a, s) => a + duration(s), 0),
  );
  $("#remaining-stat").textContent = hours(
    state.tasks
      .filter((t) => !t.done)
      .reduce(
        (a, t) =>
          a +
          Math.max(
            0,
            t.effort -
              state.sessions
                .filter((s) => s.taskId === t.id && s.done)
                .reduce((a, s) => a + duration(s), 0),
          ),
        0,
      ),
  );
  $("#data-label").textContent = state.demo
    ? "Fictional demo planner"
    : "Your personal planner";
  $("#data-note").textContent = state.demo
    ? "Sample courses and sessions — for demonstration only."
    : "Everything stays in this browser.";
  $("#demo").textContent = state.demo
    ? "Reload fictional demo"
    : "Load fictional demo";
  $("#clear").textContent = state.demo
    ? "Clear demo & start empty"
    : "Clear planner";
  const filter = $("#task-filter").value;
  const tasks = state.tasks
    .filter((t) => filter === "all" || (filter === "done" ? t.done : !t.done))
    .sort(
      (a, b) =>
        Number(a.done) - Number(b.done) || a.deadline.localeCompare(b.deadline),
    );
  $("#tasks").innerHTML = tasks.length
    ? tasks
        .map((t) => {
          const logged = state.sessions
            .filter((s) => s.taskId === t.id && s.done)
            .reduce((a, s) => a + duration(s), 0);
          return `<article class="task-card ${t.done ? "done" : ""}"><div class="task-top"><input type="checkbox" data-action="task-complete" data-id="${esc(t.id)}" ${t.done ? "checked" : ""} aria-label="Mark ${esc(t.title)} ${t.done ? "incomplete" : "complete"}"><div class="task-content"><span class="course">${esc(t.course)}</span><h3 class="task-title">${esc(t.title)}</h3><div class="task-meta"><span class="${!t.done && t.deadline < localDate() ? "overdue" : ""}">${!t.done && t.deadline < localDate() ? "Overdue · " : "Due "}${fmt(t.deadline)}</span> · ${hours(t.effort)} estimated<br>${hours(logged)} logged${t.done ? " · Completed" : ""}</div></div></div><div class="task-bottom"><span>${state.sessions.filter((s) => s.taskId === t.id).length} sessions planned</span><div><button class="text-button" data-action="task-edit" data-id="${esc(t.id)}">Edit<span class="sr-only"> ${esc(t.title)}</span></button><button class="text-button danger" data-action="task-delete" data-id="${esc(t.id)}">Delete<span class="sr-only"> ${esc(t.title)}</span></button></div></div></article>`;
        })
        .join("")
    : `<div class="empty"><strong>${state.tasks.length ? "No matching tasks" : "A fresh start."}</strong>${state.tasks.length ? "Try another filter." : "Add your first study task, or explore the fictional demo."}</div>`;
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(week);
    d.setDate(d.getDate() + i);
    return localDate(d);
  });
  $("#week-label").textContent =
    `${fmt(days[0])} – ${fmt(days[6])} ${parseDate(days[6]).getFullYear()}`;
  let count = 0,
    total = 0,
    conflicts = 0;
  $("#week").innerHTML = days
    .map((date) => {
      const sessions = state.sessions
        .filter((s) => s.date === date)
        .sort((a, b) => a.start.localeCompare(b.start));
      return `<section class="day ${date === localDate() ? "today" : ""}" aria-label="${parseDate(date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}"><div class="day-head"><span>${parseDate(date).toLocaleDateString("en-GB", { weekday: "short" })}</span><strong>${parseDate(date).getDate()}</strong></div>${
        sessions.length
          ? sessions
              .map((s) => {
                const t = state.tasks.find((t) => t.id === s.taskId),
                  conflict = state.sessions.some((other) => overlaps(s, other));
                count++;
                total += duration(s);
                if (conflict) conflicts++;
                return `<article class="session ${s.done ? "completed" : ""} ${conflict ? "conflict" : ""}"><div class="session-time">${s.start}–${s.end}</div><div class="session-title">${esc(t.title)}</div><div class="session-course">${esc(t.course)}${s.done ? " · Done" : ""}</div>${conflict ? '<span class="conflict-label">⚠ Time overlap</span>' : ""}${s.date > t.deadline ? '<span class="conflict-label">After task deadline</span>' : ""}<div class="session-actions"><button data-action="session-complete" data-id="${esc(s.id)}" aria-label="${s.done ? "Reopen" : "Complete"} session: ${esc(t.title)}">${s.done ? "↶ Reopen" : "✓ Done"}</button><button data-action="session-edit" data-id="${esc(s.id)}" aria-label="Edit session: ${esc(t.title)}">Edit</button><button data-action="session-delete" data-id="${esc(s.id)}" aria-label="Delete session: ${esc(t.title)}">×</button></div></article>`;
              })
              .join("")
          : '<p class="empty-day">—</p>'
      }</section>`;
    })
    .join("");
  $("#week-summary").textContent =
    `${count} sessions · ${hours(total)} scheduled this week${conflicts ? ` · ${conflicts} sessions with overlapping times` : ""}`;
}
async function confirmAction(title, message) {
  $("#confirm-title").textContent = title;
  $("#confirm-message").textContent = message;
  const d = $("#confirm-dialog");
  d.returnValue = "cancel";
  d.showModal();
  return new Promise((resolve) =>
    d.addEventListener("close", () => resolve(d.returnValue === "confirm"), {
      once: true,
    }),
  );
}
function openTask(id = null) {
  editingTask = id;
  const f = $("#task-form");
  f.reset();
  const t = state.tasks.find((t) => t.id === id);
  $("#task-dialog-title").textContent = t
    ? "Edit study task"
    : "Add study task";
  if (t)
    for (const key of ["title", "course", "deadline", "effort"])
      f.elements[key].value = t[key];
  else f.elements.deadline.value = localDate();
  $("#task-dialog").showModal();
}
function sessionWarning() {
  const f = $("#session-form"),
    s = {
      id: editingSession,
      date: f.elements.date.value,
      start: f.elements.start.value,
      end: f.elements.end.value,
    };
  f.elements.end.setCustomValidity(
    s.end && s.start && s.end <= s.start
      ? "End time must be later than start time."
      : "",
  );
  const collisions =
    duration(s) > 0 ? state.sessions.filter((other) => overlaps(s, other)) : [];
  const task = state.tasks.find((t) => t.id === f.elements.taskId.value);
  let warnings = [];
  if (collisions.length)
    warnings.push(
      `Time overlap with ${collisions.length} existing session${collisions.length > 1 ? "s" : ""}. Saving is allowed; both sessions will be flagged.`,
    );
  if (task && s.date > task.deadline)
    warnings.push("This session is after the task deadline.");
  $("#session-warning").textContent = warnings.join(" ");
  $("#session-warning").hidden = !warnings.length;
}
function openSession(id = null) {
  if (!state.tasks.length) {
    $("#notice").textContent = "Add a study task before planning a session.";
    openTask();
    return;
  }
  editingSession = id;
  const f = $("#session-form");
  f.reset();
  const s = state.sessions.find((s) => s.id === id);
  f.elements.taskId.innerHTML = state.tasks
    .map(
      (t) =>
        `<option value="${esc(t.id)}">${esc(t.title)}${t.done ? " (task complete)" : ""}</option>`,
    )
    .join("");
  $("#session-dialog-title").textContent = s
    ? "Edit study session"
    : "Plan a study session";
  if (s)
    for (const key of ["taskId", "date", "start", "end"])
      f.elements[key].value = s[key];
  else {
    f.elements.date.value = localDate();
    f.elements.start.value = "09:00";
    f.elements.end.value = "10:00";
  }
  sessionWarning();
  $("#session-dialog").showModal();
}
$("#task-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target,
    t = {
      id: editingTask || crypto.randomUUID(),
      title: f.elements.title.value.trim(),
      course: f.elements.course.value.trim(),
      deadline: f.elements.deadline.value,
      effort: Number(f.elements.effort.value),
      done: state.tasks.find((t) => t.id === editingTask)?.done || false,
    };
  if (!validTask(t)) {
    f.elements.title.setCustomValidity(
      "Enter a title and course containing more than spaces, a valid date, and a valid effort.",
    );
    f.reportValidity();
    return;
  }
  if (editingTask)
    state.tasks = state.tasks.map((old) => (old.id === editingTask ? t : old));
  else state.tasks.push(t);
  $("#task-filter").value = "all";
  $("#task-dialog").close();
  save("Task saved.");
});
$("#task-form").addEventListener("input", () =>
  $("#task-form").elements.title.setCustomValidity(""),
);
$("#session-form").addEventListener("input", sessionWarning);
$("#session-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target,
    s = {
      id: editingSession || crypto.randomUUID(),
      taskId: f.elements.taskId.value,
      date: f.elements.date.value,
      start: f.elements.start.value,
      end: f.elements.end.value,
      done: state.sessions.find((s) => s.id === editingSession)?.done || false,
    };
  if (!validSession(s, state.tasks)) return;
  const index = state.sessions.findIndex((old) => old.id === editingSession);
  if (index >= 0) state.sessions[index] = s;
  else state.sessions.push(s);
  week = monday(parseDate(s.date));
  $("#session-dialog").close();
  save("Session saved.");
});
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-action]");
  if (!b) return;
  const { action, id } = b.dataset;
  const t = state.tasks.find((t) => t.id === id),
    s = state.sessions.find((s) => s.id === id);
  if (action === "task-edit") openTask(id);
  if (action === "session-edit") openSession(id);
  if (action === "task-complete") {
    t.done = b.checked;
    save("Task completion updated.");
  }
  if (action === "session-complete") {
    s.done = !s.done;
    save("Session completion updated.");
  }
  if (
    action === "task-delete" &&
    (await confirmAction(
      "Delete this task?",
      "This also deletes all sessions linked to this task. This cannot be undone.",
    ))
  ) {
    state.tasks = state.tasks.filter((t) => t.id !== id);
    state.sessions = state.sessions.filter((s) => s.taskId !== id);
    save("Task and linked sessions deleted.");
  }
  if (
    action === "session-delete" &&
    (await confirmAction(
      "Delete this session?",
      "The task will stay in your planner. This cannot be undone.",
    ))
  ) {
    state.sessions = state.sessions.filter((s) => s.id !== id);
    save("Session deleted.");
  }
});
document
  .querySelectorAll(".close")
  .forEach((b) => (b.onclick = () => b.closest("dialog").close()));
$("#add-task").onclick = () => openTask();
$("#add-session").onclick = () => openSession();
$("#task-filter").onchange = render;
$("#prev-week").onclick = () => {
  week.setDate(week.getDate() - 7);
  render();
};
$("#next-week").onclick = () => {
  week.setDate(week.getDate() + 7);
  render();
};
$("#this-week").onclick = () => {
  week = monday(new Date());
  render();
};
$("#demo").onclick = async () => {
  if (
    (state.tasks.length || state.sessions.length || storageBlocked) &&
    !(await confirmAction(
      "Replace with fictional demo?",
      "This replaces the current planner with clearly labelled fictional sample data. Existing data will be lost.",
    ))
  )
    return;
  state = demoState();
  $("#task-filter").value = "all";
  storageBlocked = false;
  week = monday(new Date());
  save("Fictional demo loaded.");
};
$("#clear").onclick = async () => {
  if (
    !(await confirmAction(
      "Clear planner and start empty?",
      "All tasks and sessions in this browser will be permanently removed.",
    ))
  )
    return;
  state = emptyState();
  $("#task-filter").value = "all";
  storageBlocked = false;
  save("Planner cleared. You can start fresh.");
};
window.addEventListener("storage", (e) => {
  if (e.key === STORAGE_KEY)
    storageError(
      "The planner changed in another tab. Reload this tab before editing to avoid overwriting those changes.",
    );
  if (e.key === STORAGE_KEY) storageBlocked = true;
});
render();
