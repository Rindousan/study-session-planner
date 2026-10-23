# Submission preparation

Deadline supplied by the student: **25 October 2026**. Exact submission time is unknown; check Canvas and aim to finish publication on 24 October for a buffer.

## Short application description — review before submitting

> Studywell is a study session planner that helps students turn coursework into a manageable weekly plan. Users create tasks with a course, deadline, and estimated effort, then schedule study sessions in a weekly view. The app warns about overlapping sessions and sessions after a task deadline. Tasks and sessions can be marked complete, updating a simple progress overview. Data stays in the browser and survives reloads. A clearly labelled fictional demo makes all three core features easy to explore. The responsive prototype uses HTML, CSS, and JavaScript without accounts or external APIs. Generative AI assisted planning, coding, testing, and improvements; the source includes an honest AI-use and testing record.

## Brief demo walkthrough (about 3 minutes)

1. Open the app and choose **Load fictional demo**. Point out the fictional label, three sample tasks, and sample sessions in the current week.
2. Choose **Add task**. Enter “Revise classification”, course “DAVE3625”, a suitable deadline, and 4 estimated hours. Save, then **Edit** to change the effort to 5 hours. This demonstrates task management.
3. Choose **Plan session**, select that task, and schedule a session on a day in the current week from 14:00 to 15:00. Save. Create another on the same date from 14:30 to 15:30. Show the live warning and the overlap flags on both cards. Edit the second to 15:00–16:00 and show that the warnings disappear. This demonstrates scheduling and conflict handling.
4. Mark one session **Done** and the task complete using its checkbox. Show the task/session counts, logged hours, and remaining effort. Explain that task and session completion are separate choices.
5. Reload to demonstrate persistence. Briefly show the phone layout if recording at a narrow browser size.
6. Choose **Clear demo & start empty**, show the confirmation, and confirm if you want to end on an empty planner. Explain that this clears all current demo-mode data, including additions.

Use fictional information throughout the recording. You can reload the demo afterward for reviewers.

## Publish on VibeOff.ai yourself

The public [Post a build page](https://vibeoff.ai/post) was inspected on 23 October 2026 without entering data or publishing. It accepts screenshots/recordings and optional source/live links; it explicitly says a locally running app counts. It is a showcase workflow, not a verified static-code hosting service.

1. Open https://vibeoff.ai/post and sign in yourself, or complete its account fields yourself if needed.
2. Under **The screens**, upload `docs/desktop.png` and `docs/mobile.png`, or record the walkthrough above. The inspected form allows up to eight media files, each up to 8 MB. A short recording showing interactions is useful; inspect screenshots before sharing.
3. Fill **Title** with, for example, “I built a study planner that turns tasks into weekly focus sessions”. Fill **What happened?** with a short account of what you built and why, adapted from the description above.
4. Optionally fill **What made it work?** and **What’s left to make it real** using AI_USE.md and the limitations in README.md. Share the original prompt only after checking it contains no personal information.
5. Expand **Add more details**. Set **AI tools used** to “Codex”; describe the implementation/testing in **How did you make it?**; set **Repo** to **https://github.com/Rindousan/study-session-planner**. Enter only your actual time spent. Leave **Model** blank if uncertain.
6. **Live link** is optional on the inspected form. If the assignment requires an interactive hosted demo, publish the app with a static host first. One option is the public repository's **Settings → Pages → Deploy from a branch → main → /(root) → Save**. After deployment succeeds, the expected project URL is `https://rindousan.github.io/study-session-planner/`; verify the actual URL GitHub reports before using it. Nothing has been published to Pages by the agent. No build command, secrets, backend, or paid service is needed.
7. If you deploy, test the public URL in a private window: load/clear the demo, create a task and session, cause an overlap, complete items, and reload. Hosted browser storage is separate from localhost. Add the verified URL under **Live link**.
8. Choose an audience your assessor can access, review the site's rules and the no-personal-data declaration yourself, and click **Publish it** yourself. Copy the resulting public VibeOff build link and verify it while logged out. Confirm Canvas's exact interpretation of “demo link”; use the VibeOff build or interactive URL it requires.

## Submit through Canvas yourself

1. Check the precise deadline/time and assignment instructions in Canvas.
2. Review the application description above and edit it if needed.
3. Submit **one working demo link**, **the GitHub source URL**, and **the short description** using the assignment's requested format. Include AI_USE.md or its summary if the submission instructions ask for AI-use details.
4. Reopen the submitted links and confirm Canvas shows a completed submission. Save the receipt or confirmation.

The app has no cross-device sync, reminders, overnight sessions, or backups. These are intentional prototype limits. Never upload credentials, personal study records, or confidential information to the public repository or demonstration.
