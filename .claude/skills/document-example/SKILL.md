---
name: document-example
description: Document a playground example — write its README (all theory + official React docs links), keep the code clean (descriptive comments only, no theory in code), evaluate code improvements, and update docs/react-docs-coverage.md. Use after creating or modifying any example under src/examples/ or src/projects/, or on demand with /document-example <folder>.
---

# Document an example

Run this for a single example folder (e.g. `src/examples/01-components`). Work **inline** so the user sees every comment and recommendation — this is a learning playground, the teaching value is in the visibility. Do NOT delegate to a subagent unless the user asks to document many examples at once.

If no folder is given, ask which example (or infer it from the one just created/modified).

## Steps

### 1. Read the example
Read every file in the folder: `App.tsx`, `main.tsx`, any `hooks/`, `components/`, CSS. List the React concepts and APIs it actually demonstrates — be precise about what's shown vs. merely mentioned.

### 2. Confirm against the official docs
For each concept, fetch the react.dev markdown twin (append `.md` to the doc URL, e.g. `https://react.dev/learn/passing-props-to-a-component.md`). Use it to (a) confirm the example matches **current React 19** behavior and (b) get the exact page titles + URLs for links. Index: `https://react.dev/llms.txt`.

### 3. Code comments — descriptive only
Keep the example code clean. **All theory, explanation, and "why" belongs in the README, not in the code.** In the code, only leave short *descriptive* comments — a label for what a non-obvious block does — and only when the code isn't already self-explanatory. This codebase is sparse; prefer zero comments over an explanatory one. Never put teaching/theory comments in `.tsx`/`.ts`.

### 4. Evaluate improvements & recommendations
Review the example's code for correctness bugs, simpler/idiomatic alternatives, and React 19 best practices (consult the `.md` docs — e.g. Compiler makes `useCallback`/`useMemo` optional; effects need race-condition guards).
- **Apply** clearly-correct fixes (real bugs, broken types, well-established best practices like `type="button"`). Mention what you changed; if the fix teaches something, add the rationale to the README's Notes (not a code comment).
- **Surface** opinionated/stylistic improvements in chat so the user learns and decides — do NOT write them as code comments and do not silently rewrite working learning code with opinions.

### 5. Write/update the example's README.md
Structure: `# <Concept>` title, a one-line intro, a "What this example shows" section walking each concept with a tiny code snippet, optional "Notes", and a "## Links" list to the official React docs pages it covers. Keep it short and direct. Mirror the tone of existing example READMEs.

### 6. Update the coverage tracker
Edit `docs/react-docs-coverage.md`: for every docs page this example touches, set the status (✅ full / 🟡 partial) and fill in the folder. **Be honest** — 🟡 when only lightly touched (note what's missing in parens). Add a one-line entry under "Notes from what we already learned" if the example surfaced a non-obvious lesson.

### 7. Verify
Run `pnpm typecheck` and `pnpm lint`. If either fails from your edits, fix it before finishing.

## Done when
The example has teaching comments, a concept-accurate README with official doc links, the coverage tracker reflects it honestly (✅/🟡), and typecheck + lint pass. Report a short summary: concepts covered, improvements applied, and recommendations left for the user.
