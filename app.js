/* global CONTENT, QUIZ_QUESTIONS, ALERT_WIKI, DECISION_WIZARD */
(function () {
  const tocEl = document.getElementById('toc');
  const contentEl = document.getElementById('content');
  const searchEl = document.getElementById('searchInput');
  const clearSearchEl = document.getElementById('clearSearch');
  const resultsEl = document.getElementById('searchResults');
  const themeToggle = document.getElementById('themeToggle');

  const ROUTES = {
    section: renderSection,
    quiz: renderQuiz,
    alerts: renderAlerts,
    wizard: renderWizard,
    about: renderAbout
  };

  initTheme();
  buildTOC();
  initSearch();
  initRouter();

  function initTheme() {
    const pref = localStorage.getItem('theme') || 'dark';
    setTheme(pref);
    themeToggle.textContent = pref === 'dark' ? '🌙' : '☀️';
    themeToggle.addEventListener('click', () => {
      const next = (localStorage.getItem('theme') || 'dark') === 'dark' ? 'light' : 'dark';
      setTheme(next);
      themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
    });
  }

  function setTheme(mode) {
    document.documentElement.dataset.theme = mode;
    localStorage.setItem('theme', mode);
  }

  function buildTOC() {
    const frag = document.createDocumentFragment();
    CONTENT.forEach(sec => {
      const a = document.createElement('a');
      a.href = `#/section/${sec.id}`;
      a.textContent = sec.title;
      a.setAttribute('data-id', sec.id);
      frag.appendChild(a);
    });
    // interactive modules
    frag.appendChild(makeDivider());
    frag.appendChild(makeLink('#/quiz', 'Quiz: Check Your Understanding'));
    frag.appendChild(makeLink('#/wizard', 'Decision Wizard'));
    frag.appendChild(makeLink('#/alerts', 'Alerts Explorer'));
    tocEl.innerHTML = '';
    tocEl.appendChild(frag);
  }

  function makeDivider() {
    const hr = document.createElement('div');
    hr.style.margin = '8px 4px';
    hr.style.borderTop = '1px solid var(--border)';
    return hr;
  }
  function makeLink(href, text) {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    return a;
  }

  function initSearch() {
    searchEl.addEventListener('input', onSearch);
    clearSearchEl.addEventListener('click', () => {
      searchEl.value = '';
      resultsEl.hidden = true;
      resultsEl.innerHTML = '';
      // unmark highlights
      document.querySelectorAll('mark').forEach(m => {
        const parent = m.parentNode;
        parent.replaceChild(document.createTextNode(m.textContent), m);
        parent.normalize();
      });
    });
  }

  function onSearch() {
    const q = searchEl.value.trim();
    if (!q) { resultsEl.hidden = true; resultsEl.innerHTML = ''; return; }
    const results = [];
    CONTENT.forEach(sec => {
      const txt = stripHtml(sec.html).toLowerCase();
      const idx = txt.indexOf(q.toLowerCase());
      if (idx !== -1) {
        // compute a small snippet
        const snippet = buildSnippet(stripHtml(sec.html), idx, q.length);
        results.push({ id: sec.id, title: sec.title, snippet });
      }
    });
    renderSearchResults(q, results);
  }

  function renderSearchResults(q, results) {
    resultsEl.hidden = false;
    resultsEl.innerHTML = results.map(r => {
      const safe = escapeHtml(r.snippet).replaceAll(new RegExp(escapeRegExp(q), 'ig'), m => `<mark>${m}</mark>`);
      return `<div class="result"><a href="#/section/${r.id}"><strong>${escapeHtml(r.title)}</strong></a><div>${safe}</div></div>`;
    }).join('');
  }

  function buildSnippet(text, idx, len) {
    const start = Math.max(0, idx - 50);
    const end = Math.min(text.length, idx + len + 80);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  }

  function stripHtml(html) {
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent || '';
  }

  function escapeHtml(s) {
    return s.replaceAll(/&/g, '&amp;').replaceAll(/</g, '&lt;').replaceAll(/>/g, '&gt;');
  }
  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function initRouter() {
    window.addEventListener('hashchange', onRoute);
    if (!location.hash) {
      location.hash = `#/section/${CONTENT[0].id}`;
    } else {
      onRoute();
    }
  }

  function onRoute() {
    const hash = location.hash.slice(2); // remove #/
    const [route, param] = hash.split('/');
    // highlight in toc
    Array.from(tocEl.querySelectorAll('a')).forEach(a => a.classList.remove('active'));
    if (route === 'section') {
      const link = tocEl.querySelector(`a[data-id="${param}"]`);
      if (link) link.classList.add('active');
    } else {
      const link = tocEl.querySelector(`a[href="#/${route}"]`);
      if (link) link.classList.add('active');
    }
    const handler = ROUTES[route] || renderNotFound;
    handler(param);
    contentEl.focus();
  }

  function renderSection(id) {
    const sec = CONTENT.find(s => s.id === id) || CONTENT[0];
    contentEl.innerHTML = `
      <article>
        <h2>${sec.title}</h2>
        ${sec.html}
        <div class="toolbar" role="group" aria-label="Quick actions">
          <a class="btn" href="#/quiz">Try the quiz</a>
          <a class="btn" href="#/wizard">Open decision wizard</a>
          <a class="btn" href="#/alerts">Browse alerts</a>
        </div>
      </article>
    `;
    resultsEl.hidden = true;
  }

  function renderQuiz() {
    const frag = [];
    frag.push('<h2>Quiz: Kubernetes Observability</h2>');
    frag.push('<p>Test your understanding of concepts across metrics, logs, traces, and tooling.</p>');
    frag.push('<div class="cards">');
    QUIZ_QUESTIONS.forEach((q, qi) => {
      const options = q.choices.map((c, ci) => `
        <label style="display:block;margin:6px 0;">
          <input type="radio" name="q${qi}" value="${ci}"> ${c}
        </label>
      `).join('');
      frag.push(`
        <div class="card">
          <h4>Q${qi + 1}. ${q.question}</h4>
          ${options}
          <button class="btn" data-check="${qi}">Check</button>
          <div id="exp-${qi}" class="chip" style="display:none;margin-top:8px;"></div>
        </div>
      `);
    });
    frag.push('</div>');
    frag.push('<div style="margin-top:12px;"><button class="btn" id="checkAll">Check all</button> <span id="score" class="chip" style="display:none;">Score</span></div>');
    contentEl.innerHTML = frag.join('');
    resultsEl.hidden = true;
    contentEl.querySelectorAll('[data-check]').forEach(btn => btn.addEventListener('click', () => checkOne(parseInt(btn.dataset.check, 10))));
    document.getElementById('checkAll').addEventListener('click', checkAll);
  }

  function checkOne(idx) {
    const q = QUIZ_QUESTIONS[idx];
    const chosen = contentEl.querySelector(`input[name="q${idx}"]:checked`);
    const exp = document.getElementById(`exp-${idx}`);
    if (!chosen) { exp.style.display = 'block'; exp.textContent = 'Select an answer.'; return; }
    const ok = parseInt(chosen.value, 10) === q.answerIndex;
    exp.style.display = 'inline-block';
    exp.style.background = ok ? '#0f2f1a' : '#2f1a1a';
    exp.style.borderColor = ok ? '#14532d' : '#7f1d1d';
    exp.textContent = ok ? 'Correct! ' + q.explanation : 'Not quite: ' + q.explanation;
  }

  function checkAll() {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q, i) => {
      const chosen = contentEl.querySelector(`input[name="q${i}"]:checked`);
      if (chosen && parseInt(chosen.value, 10) === q.answerIndex) correct++;
      checkOne(i);
    });
    const score = document.getElementById('score');
    score.style.display = 'inline-block';
    score.textContent = `Score: ${correct}/${QUIZ_QUESTIONS.length}`;
  }

  function renderWizard() {
    contentEl.innerHTML = `
      <h2>Decision Wizard: Open-Source or All-in-One?</h2>
      <p>Answer a few questions to get a tailored recommendation for your observability stack.</p>
      <div id="wiz"></div>
      <div id="wizResult" class="card" style="margin-top:10px;display:none"></div>
    `;
    const wiz = document.getElementById('wiz');
    DECISION_WIZARD.forEach((w, wi) => {
      const opts = w.options.map((o, oi) => `<label style="display:block;margin:6px 0;"><input type="radio" name="w${wi}" value="${o.weight}"> ${o.label}</label>`).join('');
      wiz.insertAdjacentHTML('beforeend', `<div class="card"><h4>${w.prompt}</h4>${opts}</div>`);
    });
    const action = document.createElement('button');
    action.className = 'btn';
    action.textContent = 'Get Recommendation';
    action.addEventListener('click', () => {
      let score = 0;
      DECISION_WIZARD.forEach((w, wi) => {
        const chosen = contentEl.querySelector(`input[name="w${wi}"]:checked`);
        score += chosen ? parseInt(chosen.value, 10) : 0;
      });
      const res = document.getElementById('wizResult');
      const recommendation = score >= 0 ? 'All-in-one platform (e.g., Datadog)' : 'Open-source stack (Prometheus + Grafana)';
      const rationale = score >= 0 ? 'You prioritized speed-to-value, prebuilt dashboards, and reduced ops overhead.' : 'You prioritized flexibility, control, and lower licensing costs.';
      res.style.display = 'block';
      res.innerHTML = `<h4>Recommendation: ${recommendation}</h4><p>${rationale}</p><p class="chip">Score: ${score}</p>`;
    });
    contentEl.appendChild(action);
    resultsEl.hidden = true;
  }

  function renderAlerts() {
    contentEl.innerHTML = `
      <h2>Alerts Explorer</h2>
      <div class="toolbar">
        <input id="alertFilter" placeholder="Filter by name or metric" aria-label="Filter alerts"/>
        <select id="severity">
          <option value="">Any severity</option>
          <option value="info">info</option>
          <option value="warning">warning</option>
          <option value="critical">critical</option>
        </select>
      </div>
      <div id="alertTable"></div>
    `;
    const filterEl = document.getElementById('alertFilter');
    const sevEl = document.getElementById('severity');
    const tableEl = document.getElementById('alertTable');
    const render = () => {
      const q = filterEl.value.toLowerCase();
      const s = sevEl.value;
      const rows = ALERT_WIKI.filter(a => (!s || a.severity === s) && (!q || `${a.name} ${a.metric}`.toLowerCase().includes(q)))
        .map(a => `
          <tr>
            <td>${a.name}</td>
            <td><code>${a.metric}</code></td>
            <td><code>${a.example}</code></td>
            <td>${a.tip}</td>
            <td><span class="chip">${a.severity}</span></td>
          </tr>
        `).join('');
      tableEl.innerHTML = `
        <table class="table">
          <thead><tr><th>Alert</th><th>Key Metric</th><th>Threshold / Condition</th><th>Troubleshooting Tip</th><th>Severity</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    };
    filterEl.addEventListener('input', render);
    sevEl.addEventListener('change', render);
    render();
    resultsEl.hidden = true;
  }

  function renderAbout() {
    contentEl.innerHTML = `
      <h2>About this Guide</h2>
      <p>This interactive guide distills a comprehensive report on Kubernetes observability into navigable sections with search, a quiz, a decision wizard, and an alerts explorer.</p>
      <p>Built as a static site: just open <code>index.html</code> or deploy to GitHub Pages.</p>
    `;
    resultsEl.hidden = true;
  }

  function renderNotFound() {
    contentEl.innerHTML = `<h2>Not found</h2><p>The page you requested does not exist.</p>`;
    resultsEl.hidden = true;
  }
})();


