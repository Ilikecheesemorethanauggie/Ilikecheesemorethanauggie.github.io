# Ilikecheesemorethanauggie.github.io

CODE IT! — a tiny local code playground

What this repo contains
- `index.html` — single-page playground titled **CODE IT!**
- `assets/css/styles.css` — styles for the playground
- `assets/js/script.js` — runs JavaScript snippets and shows output/errors

Run locally
1. In the repo root run:

```bash
python -m http.server 8080
```

2. Open `http://localhost:8080` in your browser.

Notes
- The editor executes JavaScript you write in the browser. It uses `Function()` to run the code; do not run untrusted code from unknown sources.
- If you'd like, I can add support for multiple languages, saving snippets, or embedding an actual code runner sandbox.
