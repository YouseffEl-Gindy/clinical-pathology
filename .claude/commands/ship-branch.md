---
description: Move uncommitted changes on master onto a new conventionally-named branch (add/edit/fix) and push to remote.
---

# Ship Branch

Only proceed if **both** conditions hold:
1. Current branch is `master` (`git branch --show-current`). If not, stop and tell the user this command only runs from master.
2. There are uncommitted changes (`git status` shows staged, unstaged, and/or untracked files). If the tree is clean, stop and tell the user there's nothing to ship.

If both hold, do the following:

1. **Classify the change type** by reviewing `git status` and `git diff` (and `git diff --stat` for untracked/new files):
   - `add/` — new files or new functionality, nothing pre-existing had its behavior changed
   - `edit/` — modifications/refactors to existing code, no bug being corrected
   - `fix/` — correcting broken or incorrect behavior
   If the diff is mixed, pick whichever type dominates and briefly say why.

2. **Ask the user** for a short kebab-case description of the change (e.g. `patient-search-form`). Do not infer it yourself — always ask. Combine into the branch name: `<type>/<description>`.

3. Create and switch to the new branch from the current (master) state:
   ```
   git checkout -b <type>/<description>
   ```

4. Review `git status` and stage the relevant files explicitly (avoid `git add -A`/`git add .`; check for anything that looks like a secret or credential before staging).

5. Commit with a message that summarizes the *why*, following this repo's commit message style (see `git log`), ending with:
   ```
   Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
   ```

6. Push and set upstream:
   ```
   git push -u origin <type>/<description>
   ```

7. Report the branch name, what was committed, and the remote push result. Mention that `master` itself was left untouched at its prior commit, and that the user is now on the new branch (offer to switch back to `master` with `git checkout master` if they want a clean slate for the next round of changes).

Do not open a pull request as part of this command — only branch, commit, and push, unless the user separately asks for a PR.
