# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Interactive Kubernetes Observability Guide** - a static Single Page Application (SPA) built with vanilla HTML, CSS, and JavaScript. It transforms a comprehensive text document about Kubernetes monitoring fundamentals into an engaging, interactive learning experience.

## Technology Stack & Architecture

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+) - no frameworks or build tools
- **Deployment**: Static site optimized for GitHub Pages
- **Architecture**: Client-side SPA with hash-based routing
- **No build process**: Direct browser execution of `index.html`

## Development Commands

**Local Development:**
```bash
# Open the application directly in browser
open index.html
# or serve locally
python -m http.server 8000
```

**No build, lint, or test commands** - this is a vanilla JavaScript project with no build tooling.

## File Structure & Architecture

**Core Application Files:**
- `index.html` (2.3KB) - Main HTML structure and layout
- `app.js` (11.6KB) - Application logic, SPA routing, and interactive features
- `content.js` (9.2KB) - Content data, quiz questions, alerts database, decision wizard
- `styles.css` (4.6KB) - CSS styling with dark/light theme system

**Content Source:**
- `Learning Kubernetes Monitoring Fundamentals.txt` (31KB) - Source material document

## Key Architectural Patterns

**SPA Routing System:**
- Hash-based routing compatible with GitHub Pages (`#/section/strategic-imperative`)
- Route handlers: `section`, `quiz`, `alerts`, `wizard`, `about`
- Navigation handled in `app.js` with `handleRouting()` function

**Interactive Features:**
- **Content Sections**: 5 comprehensive K8s observability sections
- **Search**: Real-time content search with highlighting (`searchContent()`)
- **Knowledge Quiz**: 5 questions with scoring system
- **Decision Wizard**: 3-question tooling assessment with weighted recommendations
- **Alerts Explorer**: Filterable database of common K8s alerts

**Theme System:**
- CSS custom properties for dark/light modes
- localStorage persistence (`toggleTheme()` in app.js)
- Dynamic theme switching with visual indicators

## Content Structure

The educational content is organized into 5 main sections:
1. **Strategic Imperative** - Business case for K8s monitoring
2. **Observability Framework** - Metrics, logs, traces (the three pillars)
3. **Collection Architecture** - Multi-layered monitoring approach
4. **Tooling Ecosystem** - Open-source vs all-in-one solutions
5. **Operationalizing** - Alerts, troubleshooting, organizational culture

## Code Patterns

**JavaScript Architecture:**
- IIFE wrapper for global scope management
- Event-driven with DOM event listeners
- Dynamic content rendering with template literals
- Modular functions for each feature (quiz, search, alerts, wizard)

**CSS Architecture:**
- Component-based styling approach
- Responsive design with flexbox/grid
- CSS custom properties for maintainable theming

## Deployment

**GitHub Pages:**
- Push to main branch and enable Pages in repository settings
- No build step required - serves static files directly

**Local Testing:**
- Open `index.html` directly in browser, or
- Use any static file server (Python, Node.js http-server, etc.)