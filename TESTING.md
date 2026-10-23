# Testing record

Performed on 23 October 2026. Results below describe checks actually run against this repository; hosted publication remains the student's responsibility.

## Automated checks

`node --test tests/core.test.js`: **7 tests passed, 0 failed**.

| Test | Verified |
| --- | --- |
| Calendar validation | Impossible dates rejected; leap day accepted only in a leap year |
| Overlaps | Partial/contained conflicts detected; adjacency, different dates, and self-comparison excluded |
| Saved-state validation | Demo/empty JSON round-trip; bad version, duplicate task IDs, and orphaned sessions rejected |
| Session validation | Duration calculation, backward end time, invalid time, missing task rejected |
| Week boundaries | Monday start from a Sunday and across a year boundary |
| Storage round-trip | Save then load through a fresh call preserves the planner |
| Storage failure | Invalid JSON and blocked reads report failure; load does not overwrite corrupt data; failed writes return failure |

`node --check app.js`, `node --check core.js`, and `node --check server.js` were also used to check syntax. Node 24.22.1 was available. npm was not on PATH, so tests and the preview were run directly with Node.

## Local browser checks

Used the available Chromium-based in-app browser at `http://127.0.0.1:4173`, with the default desktop viewport and a 390 × 844 mobile viewport. The local preview server required running outside the network sandbox; after restarting it there, browser access worked.

| Flow | Observed result |
| --- | --- |
| Empty planner | Empty-state instructions and zero totals rendered |
| Task creation | Created “Revise classifiers”, DAVE3625, deadline 25 October, 4 hours |
| Task editing | Renamed task and changed effort to 5 hours; card and totals updated |
| Scheduling | Created 09:00–10:30 and 10:00–11:00 sessions on the same date |
| Overlap warnings | Second form warned before save; both saved cards were flagged |
| Conflict resolution | Edited second session to 10:30–11:30; both flags disappeared |
| Completion | Marked a session and task complete; counts became 1/2 and 1/1; 1.5 hours logged |
| Reload persistence | Task edits, sessions, completion, and totals survived reload |
| Invalid task | Whitespace-only title rejected with a validation message |
| Invalid session | End before start prevented save; DOM validity reported “End time must be later than start time.” |
| Past deadline | Fictional task dated 20 October was marked overdue; session after its deadline warned in form and card |
| Text escaping | `<b>Fictional past task</b>` displayed literally in task/session text rather than interpreted markup |
| Keyboard | Tab moved from dialog close control into task title; visible focus styles rendered; focus stayed on session completion control after redraw |
| Demo replacement | Nonempty planner required confirmation; demo label, fictional course labels, sample conflicts, and totals rendered |
| Clear cancellation | Cancel preserved all demo tasks and sessions |
| Clear confirmation | Confirm produced an empty planner; empty state persisted after reload |
| Task deletion | Confirmation explained cascade; deleting a task removed its linked session and reset related totals |
| Session deletion | Deleting a session retained its task and updated totals |
| Week navigation | Next week showed 26 October–1 November with no sessions; This week restored the demo schedule |
| Scheduling without tasks | Plan session opened the task-creation form |
| Mobile | Created a fictional past task/session, inspected form and agenda, and confirmed no horizontal overflow |
| Mobile improvement | Removed excessive empty day space from spanning grid rows; reinspection showed compact agenda days, approximately 70 px when empty and 145 px for one sample session |
| Console | Final available browser warning/error log query returned no entries |

Screenshots of the final fictional demo: [desktop](docs/desktop.png), [mobile](docs/mobile.png). These are visual evidence, not an automated end-to-end test suite. During checkbox testing, an automation locator timed out after the checkbox changed its accessible name; the next snapshot showed it was checked and the totals updated, and reload confirmed persistence. This was not treated as a failed application action.

## Improvements verified

- Invalid times no longer generate misleading overlap feedback; the invalid end time remains rejected.
- Completion redraws preserve keyboard focus on the corresponding control.
- Mobile day headers no longer force many empty grid rows.
- Formatted source and explicit storage-boundary tests make the small implementation easier to maintain.

## Limits and outstanding checks

- No physical phone, Firefox/Safari, full screen-reader, or formal accessibility audit was performed.
- Storage-failure behavior was exercised with automated storage mocks; browser settings were not changed to force quota/privacy failures. The warning UI was reviewed in source.
- Multi-tab stale-write prevention was reviewed in source, not exercised with concurrent browser tabs.
- No live hosted URL, VibeOff post, or Canvas submission was tested. Repeat the core smoke test after publication.
- No claim is made that all possible inputs, daylight-saving transitions, large datasets, or browser environments were tested.

## Publication privacy check

Before the source push, project files and Git history were reviewed and searched for credential patterns, personal paths, and personal-data strings. The source contains fictional demo tasks, public project links, and local development URLs. No passwords, API keys, confidential files, or personal study data were found. The initial commit uses a GitHub no-reply email; new implementation commits use a generic project identity. No browser storage was exported into the source. 
