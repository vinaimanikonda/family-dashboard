# Verification — September 30, 2026

Passed in installed desktop Chrome with automated browser interaction:

- Default four-task columns fit 1024 × 768 without page overflow; screenshot visually reviewed.
- 375px-wide responsive layout has no horizontal overflow.
- Checking a task persists after reload.
- Editing tasks preserves unchanged tasks' checkmarks and renders literal HTML-like text safely.
- Meal notes and dated weekly events persist after reload.
- Cached app reloads offline and checkboxes continue to work.
- Simulated local midnight resets today's checkboxes, rotates the quote, and retains the previous day's completion record.
- Closing the editor cancels edits; saving an empty task list works.
- Corrupt saved JSON and denied storage writes produce a visible warning.
- No uncaught browser errors during the main flow.
- JavaScript syntax checks passed for app.js and sw.js.

Implementation reviewed for Safari 12 compatibility: ES5-style app syntax, Flexbox without gap, no CSS Grid or external assets, no module scripts, standard checkboxes, feature-detected service worker. All asset paths are relative for GitHub Pages project directories.

Not certified on physical iPad Mini 2 / Safari 12.5.7. The available WebKit test runner could not complete its launch; Chrome testing does not substitute for Safari 12 testing. Home Screen installation, actual device restart persistence, OS cache eviction, touch behavior and Guided Access require an iPad check. Follow the README's device checklist before relying on it daily.

Weekly plans are intentionally empty until entered.

## Private-name update

Verified in the in-app browser: generic column labels, More → Edit names, saved names surviving reload, and matching task-editor labels. Restored generic labels after testing. JavaScript migration check passed: prior column tasks, stable IDs, completion history and notes are preserved, with generic names supplied. Syntax check passed. Scanned all deliverable text for the former personal names; no matches. Removed the old screenshot containing personal labels. Cache version advanced to v2.
