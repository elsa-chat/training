# Repository Guidelines

## Project Structure
- `index.html` is the entry point for the training site.
- `css/` contains global and component styles (`css/styles.css`, `css/components.css`).
- `js/` holds UI behavior (`js/app.js`, `js/components.js`).
- `data/` is the content layer: slide modules live in `data/slides/<topic>/`, the slide registry is `data/slides/index.js`, and the schedule is `data/sessions/index.js`.
- `backlog/` holds work-in-progress or archived scripts.
- `config.js` controls branding strings and titles.

## Build, Test, and Development Commands
- `npm test` runs Playwright in headless mode.
- `npm run test:ui` opens the Playwright UI runner.
- `npm run test:headed` runs tests with a visible browser window.
- Local run: this is a static site; open `index.html` in a browser or serve the repo with any static server.

## Coding Style & Naming Conventions
- Follow the surrounding file’s formatting; most HTML/CSS/JS use 4-space indentation, but keep existing style per file.
- Slide modules define arrays like `slides_welcome` and use kebab-case `id` values (example: `welcome-title` in `data/slides/welcome/welcome.js`).
- File names in `data/slides/` are kebab-case; keep topic folders and file names aligned with the section name.

## Testing Guidelines
- Playwright is configured in `playwright.config.js` with `testDir: ./tests` and outputs to `test-results/` (HTML report in `test-results/html-report`).
- Add or update specs under `tests/` when changing navigation, slide rendering, or schedule logic.

## Commit & Pull Request Guidelines
- Commit messages follow a short type prefix: `feat:`, `fix:`, or `wip:` (see `git log`). Keep the summary concise and present tense.
- PRs should include a brief summary, test command(s) run, and screenshots for UI changes. Link relevant issues if applicable.
