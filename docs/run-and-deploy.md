# Run and deploy IPO Lab

## Run locally on Windows

1. Clone or download the repository.
2. Install Python 3.10 or newer and enable **Add Python to PATH**.
3. Double-click `run-local.bat` from the repository root.
4. The browser opens at `http://localhost:8000`.

Keep the terminal window open while using the application. Press Ctrl+C in that window to stop the server.

Do not open `index.html` directly using a `file://` URL. The browser loads JSON files using `fetch()`, which requires an HTTP server.

## Run and validate from a terminal

```bash
python -m pip install -r requirements.txt
python scripts/validate_data.py
python -m pytest -q
node --check app.js
python serve_local.py
```

## GitHub Pages

The workflow at `.github/workflows/pages.yml` validates issuer data, runs the automated test suite and JavaScript syntax check, prepares a small deployment directory containing only the website and required public JSON data, and publishes it to GitHub Pages.

**One-time repository setup:** open **Settings → Pages** and select **GitHub Actions** under “Build and deployment → Source”. The workflow cannot grant itself the elevated permission needed to create a Pages site. After this one-time setting is saved, pushes to `main` trigger deployment.

A failing validator or test blocks publication.

## Local repository workflow

Use a feature branch for changes. Run the validator and tests before committing. Review the Git diff to ensure no credentials, private working files or unverified issuer claims are included. Merge to `main` only after review.
