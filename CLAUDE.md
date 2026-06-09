# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**HUNTR/X Academy** — a browser-based math trainer for a 7-year-old, themed around the Netflix film **KPop Demon Hunters** (HUNTR/X vs Saja Boys). Contains several mini-games (money, weights, volumes, multiplication, division, 2-step word problems), a parent-driven challenge mode, and a per-task-type summary. Vanilla HTML/CSS/JS — **no bundler, no framework, no Node runtime**. The whole app runs by opening `index.html` in a browser.

## Commands

```bash
# Run the app (any static server works)
python3 -m http.server 8000        # then open http://localhost:8000/
npx serve                           # alternative

# Run tests — open in a browser, there is no CLI runner:
#   test/runner.html
# Or via the server above: http://localhost:8000/test/runner.html
# Click "▶ Прогнати тести знову" to re-run.
```

There is no build, no lint, no `npm test`. `package.json` exists only because the project was created in CodeSandbox; ignore it for tooling decisions.

To run a single test group, temporarily change `describe(...)` → `describe.only(...)` is **not** supported by the custom framework (`test/framework.js`). Either comment out other `describe` blocks or remove other `<script>` tags from `test/runner.html`.

## Architecture

### Module loading model
All `.js` files are loaded as **classic scripts** (not ES modules) from `index.html`. They share a single global scope and communicate through `window.*` globals. Order in `index.html` matters: `script.js` first (defines `state`, `I18N`, `registerGame`, `taskMemory`), then each game module IIFE registers itself, then `init()` runs on `DOMContentLoaded` so all games are present before the first round.

### Game registry pattern
`script.js` exposes `registerGame({ id, icon, getName, newRound, _test })` and `window.Games`. Each game (`weights-game.js`, `volumes-game.js`, `multiplication-game.js`, `division-game.js`, plus the inline money game inside `script.js`) is an IIFE that:
1. Calls `registerGame(...)` to plug itself into the registry.
2. Merges its own I18N keys via `Object.assign(I18N[lang], ADD[lang])`.
3. Exposes pure helpers under its `_test` field for the test suite.

Game cards in the picker modal and the challenge UI are rendered **dynamically** from `Object.values(window.Games)` — to add a new game, create a new file, register it, and add a `<script>` tag in `index.html`. No other wiring needed.

### Central state
`window.state` (in `script.js`) holds: language, profile (name/gender), current `gameMode`, difficulty, per-game `progress`/`goals`, and the `challenge` substate. Persisted to `localStorage`. `state.challenge.attempts` increments on lose and resets on `newRound()` — a win with `attempts === 0` counts as `firstTry` in the final summary.

### I18N
Three languages — `es` (default, gender-neutral), `uk`, `ru` — keyed in `window.I18N[lang]`. Game modules contribute keys at registration time. Personalized win/lose phrases use placeholders `{name}`, `{title}`, `{adj.*}` resolved by `fillPlaceholders()` with gender agreement.

### Challenge mode flow
The 🏆 modal lets a parent pick rounds-per-game and one global difficulty. During a challenge, `body.challenge-active` hides the "Next round" button (CSS-driven) and the engine auto-advances games via flash transitions. The summary breaks results down by 11 task types (buy, countOptions, countInput, weight/volume Count/Build, mult/div Explicit/Word/WordPure/Missing).

### Anti-repeat
`window.taskMemory.accept(key, value, maxRecent)` is the shared sliding window used by every game to avoid repeating recent targets/scenarios. Always go through it when picking new task parameters.

### Test isolation
`window.__TEST_MODE__ = true` (set at the top of `test/runner.html`) blocks the `DOMContentLoaded` → `init()` auto-start in `script.js`. Tests then exercise pure helpers exported on `window._test` (from `script.js`) and `window.Games.<id>._test` (from game modules). UI flows, animations, and WebAudio are intentionally **not** covered — add Playwright if that ever becomes needed.

### Audio
All sound is synthesized in WebAudio at runtime (Karplus-Strong pluck, bell chimes, formant "Ah!", demonic laugh). No audio files. Don't add audio assets — extend the synthesis in `script.js`.

### Money game specifics
Euro banknote images (5/10/20/50/100€) are **base64-embedded** inside `index.html` (~185KB). Coins are inline SVG. Don't extract these to separate files — the single-file-load model is intentional so the game works offline by double-clicking `index.html`.

## Conventions worth knowing

- **Comments and UI strings in the codebase are mixed Ukrainian/English.** Match the surrounding style of the file you're editing.
- When adding new user-facing text, add the key to **all three** languages in `I18N` — `test-common.js` has a completeness check that will fail otherwise.
- When adding a new task type that should appear in the challenge summary, extend both the increment site and the summary renderer; the 11 task-type keys are enumerated in the challenge tests.
- See `test/TEST_CASES.md` for the canonical description of what each test group covers before changing test files.
