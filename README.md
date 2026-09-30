# Our day — free family dashboard

A small, build-free family dashboard designed for an iPad Mini 2 on iOS 12.5.7, especially landscape at 1024 × 768 CSS pixels. No subscriptions, remote fonts, analytics, API keys, account connections, or runtime dependencies. All encouragement is original bundled text; no scripture translations or attributed quotations are used.

## Open it locally

Open `index.html` in a desktop browser for a quick look. For reliable storage and offline-cache testing, serve the folder over HTTP instead. If Python 3 is installed, open a terminal in this folder and run:

```
python3 -m http.server 8000
```

Open http://localhost:8000. Stop the server with Ctrl+C. This is only a local preview, not an always-on hosting solution. The iPad installation should use the HTTPS address below.

## Publish for $0 with GitHub Pages

1. Create or sign into a **GitHub Free** account at https://github.com. No paid plan or custom domain is needed.
2. Use **New repository**, name it `family-dashboard`, choose **Public**, check **Add a README file**, and create it. Free Pages hosting requires a public repository.
3. Choose **Add file → Upload files**. Upload `index.html`, `styles.css`, `data.js`, `app.js`, `sw.js`, and `favicon.svg` from this folder directly into the repository root, not inside another folder. Commit the upload to `main`. You may also upload this README and `.nojekyll`; neither is required for these plain static files.
4. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**. Select **main** and **/(root)**, then **Save**.
5. Wait for the Pages deployment to finish (the Actions tab shows progress). Return to **Settings → Pages** and open the displayed site address, normally `https://YOUR-USERNAME.github.io/family-dashboard/`. Use HTTPS and the trailing slash.
6. Open that address in Safari on the iPad. No server needs to run on your computer.

The public site contains only generic Child 1 / Child 2 labels and example tasks in `data.js`. Real names are entered under More → Edit names and stored only in the current device’s browser. They are never included in requests to GitHub. Tasks, notes, and plans entered through the app are stored only in the device's browser; they are not uploaded to GitHub. Do not put private schedules or credentials into files in the public repository. GitHub's free hosting is subject to its published usage limits and future terms; this project needs no paid features.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## Install on the iPad (iOS 12)

1. Open the hosted HTTPS URL in **Safari**, in a normal (not Private) tab.
2. Tap **Share** (square with an upward arrow), then **Add to Home Screen** in the share sheet. You may need to scroll the action row. Name it **Our day**, then tap **Add**.
3. Open **Our day** from the Home Screen and rotate the iPad to landscape. Disable rotation lock if needed.
4. Make your edits in this Home Screen app. Safari and Home Screen storage can differ on older iOS; do not assume the task state transfers between them.
5. Give the first online launch time to finish caching, close and reopen it online, then test an airplane-mode launch. Offline caching is a best effort, not a guarantee on old iOS.

The current Apple guide describes the same Share → Add to Home Screen flow, though modern iPadOS screens differ from iOS 12: https://support.apple.com/guide/ipad/ipad8f1f7a29/ipados

## Guided Access on iOS 12

1. Go to **Settings → General → Accessibility → Guided Access** and turn it on. (Newer iPadOS puts Accessibility directly in Settings.)
2. In **Passcode Settings**, set a Guided Access passcode that the adult remembers.
3. Open the Home Screen dashboard, put it in landscape, and **triple-click the physical Home button**.
4. In **Options**, keep **Touch** enabled so the checkboxes work. Disable **Motion** if you want the orientation fixed. Choose other restrictions as needed.
5. Optionally draw a disabled-touch region over **More** to keep task editing out of ordinary kid use. This is an accidental-edit guard, not app authentication. Check the region after rotating or changing text size.
6. Tap **Start**. To leave, triple-click Home, enter the passcode, and tap **End**.

If the screen sleeps, review **Settings → Display & Brightness → Auto-Lock** and any Guided Access sleep settings available on this version. Choose Never only if desired and available; the app does not override device sleep settings.

Apple's Guided Access reference: https://support.apple.com/111795 (current screenshots and some option names differ from iOS 12).

## Everyday use

- Tap anywhere in a task row to check it off or undo it. Checkboxes are 38px squares inside touch targets at least 52px tall.
- **More → Edit names**: enter names for the two columns (up to 40 characters each). Blank entries revert to Child 1 / Child 2. Close cancels unsaved changes. Renaming keeps tasks and checkmarks intact. Existing v1 data is migrated without discarding tasks or checkmarks.
- **More → Edit daily tasks**: one task per line for each child; save when finished. Four tasks each is the default uncluttered layout. Additional or long tasks expand the page and remain scrollable.
- Exact unchanged task text keeps its identity and existing checkmark, even after reordering. Renaming a task creates a new unchecked task. Blank lines are ignored. Removing all lines makes an empty list. Close cancels unsaved edits.
- Tasks recur every day. Completion is stored by local date and task ID. Each new local day starts unchecked; yesterday's history remains stored. The date, quote, tasks, and week refresh within 15 seconds while open, and when the page resumes. Correct the iPad clock/time zone if dates look wrong.
- **More → Plan this week**: add dated events, one per line. Weeks run Monday–Sunday. Empty dates show a dash. Plans do not repeat into the next week.
- **Meals** and **Grocery** open editable text notes. Save to retain changes; Close cancels.
- Quotes rotate deterministically through 31 bundled original encouragements, using the local calendar date. They work without an API.

## Persistence and offline limitations

`localStorage` key `family-dashboard-v1` holds names, tasks, dated completions, dated calendar events, meals, and groceries. Ordinary reloads and device restarts preserve it when Safari retains storage. Clearing website data, Private Browsing restrictions, deleting the Home Screen app, changing the hosting origin, or iOS storage eviction may lose it. There is no cloud backup or cross-device sync. Keep a separate copy of important notes. A visible warning replaces the saved status if reads or writes fail.

A small service worker caches the app shell on HTTPS (or localhost). After successful caching, the dashboard can open offline. iOS may evict the cache; reconnect and reload if an offline launch fails. The app still works online when service-worker registration is unavailable. Quotes themselves are always bundled and require no separate network request.

## Update the hosted app

Replace changed files in the GitHub repository. Whenever a cached asset changes, also change `CACHE` in `sw.js`, e.g. `our-day-shell-v2` to `our-day-shell-v3`. Open online to download the update, close every dashboard tab/Home Screen window, then reopen so the waiting worker can activate. The app deliberately avoids forcing an update during editing. Updating files on the same origin retains locally stored data; clearing website data does not.

## Files and future calendar integration

- `index.html`: accessible static structure and Home Screen metadata.
- `styles.css`: system fonts, Flexbox with margins rather than flex-gap, responsive layout.
- `data.js`: initial tasks, original offline quotes, versioned default data.
- `app.js`: ES5-style vanilla JavaScript, storage, date handling, task and note editors.
- `sw.js`: optional cached shell with versioned assets, scoped to this project URL.
- `favicon.svg`: simple dashboard icon; older Safari may ignore the SVG favicon without affecting use.

Calendar data is `{provider:'local', events:[{id, date:'YYYY-MM-DD', title, source:'local'}]}`. Rendering reads it through `eventsForDate()`. A later Google Calendar adapter can normalize events into this shape while leaving the main screen intact. No Google Calendar account is connected in v1. A future adapter must handle authentication, time zones and date boundaries; do not publish private calendar URLs or credentials in this repository.

## Compatibility and verification

The app avoids modules, arrow functions, optional chaining, async/await, CSS Grid, flex-gap, native dialogs, and external libraries. Flexbox, standard DOM methods, JSON and localStorage are used; service-worker support is feature-detected. UI code uses ES5-style syntax; the optional service worker uses Promises supported by its target browsers.

See `TESTING.md` for the tests actually performed and remaining hardware checks. A modern browser test cannot certify Safari 12. Before daily use, test the actual iPad: check a task, reload, reboot, edit and save, launch offline after caching, leave it open across midnight, and test Guided Access. Increase text size to verify comfortable readability; scrolling is intentional when text or content exceeds the baseline screen.
