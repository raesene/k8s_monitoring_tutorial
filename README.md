## Kubernetes Observability Guide — Interactive SPA

An interactive, static web app that explains Kubernetes monitoring and observability concepts with search, outline navigation, a quiz, a decision wizard, and an alerts explorer.

### Local use

- Open `index.html` in a modern browser. No build step required.

### GitHub Pages deployment

1. Initialize a repo and push:
   - `git init`
   - `git add .`
   - `git commit -m "Initial: interactive observability guide"`
   - Create a GitHub repo and push `main`
2. In the GitHub repository: Settings → Pages
   - Source: `Deploy from a branch`
   - Branch: `main`, Folder: `/ (root)`
3. Wait for deployment, then open the Pages URL shown.

Notes:
- Routing uses hash fragments (e.g., `#/section/strategic-imperative`), so it works on GitHub Pages without extra configuration.
- For a custom domain, add a `CNAME` file with your domain and configure DNS per GitHub Pages docs.


