# Studywell — Study Session Planner

A small, responsive study planner. It helps a student turn tasks into scheduled study time and see their progress. The interface and all example data are in English.

**Source:** https://github.com/Rindousan/study-session-planner

## Features

- Create, edit, delete, and complete tasks with a course, deadline, and estimated effort.
- Plan, edit, delete, complete, and reopen study sessions linked to tasks.
- Monday–Sunday weekly view, previous/next navigation, and a return-to-current-week control. On phones, days become a readable vertical agenda.
- Live overlap warnings in the session form and on both affected session cards. Conflicts are permitted so the student can decide how to resolve them. Adjacent sessions do not conflict.
- Overdue task labels and warnings for sessions after a task deadline.
- Progress counts, completed-session hours, and estimated remaining effort on open tasks.
- Explicitly labelled fictional demo, generated relative to the current week. A confirmation protects existing data before replacement. **Clear demo & start empty** deliberately removes it.
- Browser-local persistence, input validation, storage-failure messages, keyboard controls, visible focus styles, and labelled native form fields.

## Run locally

Install Node.js 20 or later. No package installation, build step, framework, or API key is needed.

```sh
git clone https://github.com/Rindousan/study-session-planner.git
cd study-session-planner
node server.js
```

Open **http://127.0.0.1:4173**. Stop the preview with Ctrl+C. `npm start` is equivalent if npm is available. Opening `index.html` directly with `file://` is not supported because the application uses JavaScript modules.

## Tests

```sh
node --test tests/core.test.js
```

`npm test` is equivalent. See [TESTING.md](TESTING.md) for the actual browser checks, test results, and verification limits, and [AI_USE.md](AI_USE.md) for AI involvement and improvements.

## Static deployment

Serve these five files together, preserving their names and relative paths:

```text
index.html
style.css
app.js
core.js
storage.js
```

`server.js` is a local preview utility only; no backend is deployed. Use the repository root as the static source directory, with `index.html` as the entry point and no build command. JavaScript files must be served with a JavaScript MIME type over HTTPS or localhost. The app has no remote assets, fonts, analytics, runtime libraries, or external API calls.


## Data and privacy

Tasks and sessions are JSON in `localStorage` under **`studywell.v1`**, scoped to the current origin and browser profile. Data survives normal reloads. It is not sent to a server, committed to Git, or shared with other visitors. Each visitor starts empty and can load the fictional demo.

Moving from localhost to a published URL starts a separate planner. Clearing browser site data, using another browser/device, or closing a private-browsing session can lose access to data. There is no backup, export/import, encryption, or cloud sync. Do not store sensitive information in this prototype.

If reading storage fails or its contents are invalid, the app displays a warning, keeps an empty working copy in memory, and avoids automatically overwriting the original data. Reload to retry, or deliberately clear/replace the planner. Failed writes leave changes in memory with a warning and retry on the next change. Another-tab changes trigger a reload warning and block further writes from the stale tab.

## Behavior and limitations

- Single student, single browser; no accounts, reminders, calendar integrations, or automatic scheduling.
- Sessions stay within one local calendar day; an end time must be after its start. Dates use local calendar values rather than UTC conversion.
- Duration uses entered wall-clock times. Timezone conversion, overnight sessions, and daylight-saving transition accounting are outside scope.
- Marking a task complete is independent of completing its sessions. Completing all sessions does not automatically complete the task.
- Remaining effort is the sum of `max(estimated hours − completed session hours, 0)` for open tasks. Logged time includes all completed sessions. Overlapping completed sessions are added individually; this is a simple effort log, not unique elapsed time.
- Deleting a task deletes its linked sessions after confirmation. Deletes and planner resets have no undo.
- Native date/time picker appearance varies by browser. Tested in the available Chromium browser, including phone-sized emulation; no physical-device or full screen-reader certification.

## Source structure

| File | Responsibility |
| --- | --- |
| `index.html` | Semantic page, forms, dialogs |
| `style.css` | Responsive styling and focus states |
| `app.js` | UI rendering and user actions |
| `core.js` | Dates, validation, overlaps, demo data |
| `storage.js` | Safe load/save boundary |
| `server.js` | Dependency-free localhost preview, serving only app files |
| `tests/core.test.js` | Node built-in automated tests |

AI assisted the implementation. The student must review the application and submission text before handing it in.
