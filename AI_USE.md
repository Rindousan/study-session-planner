# AI use and improvements

Prepared 23 October 2026 for DAVE3625 Oblig 3. This is a factual development record, not a claim of independent student authorship.

## AI contribution

The student supplied the application idea, three core features, assignment context, deadline, privacy constraints, and explicit authorization to implement and test. Codex selected a dependency-free static stack and generated the HTML, CSS, JavaScript, automated tests, and documentation. Codex also ran tests, operated a browser against the local app, inspected desktop/mobile screenshots, and prepared the source repository.

The AI was used for implementation planning, interaction and visual design, code generation, test design, browser verification, and improvements. No AI model is called by the finished application. All demo content is fictional. The student is responsible for reviewing and understanding the code, confirming the submission description, publishing the demo, and submitting it.

## Decisions and improvements

1. **Kept the scope achievable:** plain modules and browser storage avoid backend setup, accounts, credentials, and paid services.
2. **Made conflicts actionable:** overlap warnings appear before saving and on affected sessions; editing a session to an adjacent time removes the flags. Conflicts are warnings rather than a forced scheduling restriction.
3. **Clarified invalid-time feedback:** browser testing showed an overlap message could appear while the session end preceded its start. The warning now waits for a positive duration; native validation still rejects invalid times.
4. **Protected local data:** confirmations precede task deletion, clearing, and replacing a nonempty planner with the demo. Corrupt saved data is not silently overwritten. Storage tests cover blocked access and failed writes.
5. **Improved phone usability:** the seven-column calendar becomes a vertical day-by-day agenda; mobile form layout and absence of horizontal overflow were checked at 390 × 844. A closer screenshot inspection found unnecessary blank space caused by a spanning grid row in the mobile day header. The mobile header was changed to a positioned date gutter and the agenda was inspected again.
6. **Improved keyboard continuity:** completion redraws preserve focus on the corresponding control. Adding a task resets the filter so the new task is visible.
7. **Kept maintenance simple:** pure date/overlap/validation helpers and a separate storage boundary are covered with Node's built-in tests. Source was formatted using Prettier 3.6.2 from the official npm registry; this is not a runtime dependency.

## Review still required from the student

Read and try the app, review the source and this record, and revise the draft description to reflect your own understanding. Do not claim physical-device, cross-browser, screen-reader, or live-hosted testing that has not been performed. See TESTING.md for what was actually verified.
