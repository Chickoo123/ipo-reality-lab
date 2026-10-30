# Run and deploy IPO Reality Lab

## Windows: one-click local run

1. Extract the ZIP fully.
2. Open the extracted `ipo-reality-lab-github-ready` folder.
3. Double-click `run-local.bat`.
4. Your browser should open `http://localhost:8000`.

Keep the terminal window open while using the site. Close that window to stop the local server.

If Windows says Python is missing, install Python 3.10+ from https://www.python.org/downloads/ and enable **Add Python to PATH** during installation.

Do not double-click `index.html`. The app loads JSON files using `fetch()`, and browsers block that request from a `file://` page. Use `run-local.bat` or an HTTPS deployment.

## GitHub: deploy the site

1. Open your IPO Reality Lab GitHub repository.
2. Upload the **contents** of this folder to the repository root: `index.html`, `app.js`, `styles.css`, `data/`, `docs/`, `scripts/`, `tests/` and `.github/`.
3. Commit to the `main` branch.
4. Open **Settings → Pages**.
5. Under **Build and deployment → Source**, select **GitHub Actions**.
6. The included `.github/workflows/pages.yml` workflow runs validation and tests, then deploys the site.
7. Open the deployment URL shown in the Actions run or Settings → Pages.

Every push to `main` triggers validation and deployment. A failed validation/test blocks publishing.

## Existing repository caution

The workflow assumes that the project lives in the repository root and the deployment branch is `main`. If your repository uses another default branch or a `docs/` subfolder, adjust the workflow before enabling deployment. Do not overwrite unrelated files in an existing repository.
