// Content derived from "Learning Kubernetes Monitoring Fundamentals.txt"
// Structured into sections and interactive datasets

const CONTENT = [
  {
    id: 'strategic-imperative',
    title: '1. Strategic Imperative: The Business Case',
    html: `
      <p>Modern observability has evolved beyond simple uptime checks. Kubernetes introduces ephemeral,
      dynamic workloads, making traditional host-centric monitoring insufficient. A complete approach must
      cover <strong>infrastructure</strong> (nodes), <strong>containers</strong>, <strong>applications</strong>, and the <strong>control plane</strong>.</p>
      <h3>1.1 Benefits</h3>
      <ul>
        <li><strong>Performance & Efficiency</strong>: Track CPU, memory, network, response time to spot bottlenecks and right-size resources.</li>
        <li><strong>Proactive Detection</strong>: Alerts on symptoms reduce MTTR; correlate metrics, logs, and events.</li>
        <li><strong>Capacity & Scale</strong>: Use trends for forecasting and autoscaling decisions.</li>
        <li><strong>Security & Compliance</strong>: Monitor access patterns and anomalous behavior across the cluster.</li>
      </ul>
    `
  },
  {
    id: 'observability-pillars',
    title: '2. Observability Framework: Metrics, Logs, Traces',
    html: `
      <p>The <strong>three pillars</strong> provide complementary views:</p>
      <div class="cards">
        <div class="card"><h4>Metrics</h4><p>Time-series measurements like CPU usage, request rates, and error ratios. Efficient for alerting and trends.</p></div>
        <div class="card"><h4>Logs</h4><p>Timestamped, contextual events for debugging and historical analysis.</p></div>
        <div class="card"><h4>Traces</h4><p>End-to-end request paths across services. Pinpoint latency and dependencies.</p></div>
      </div>
      <h3>Correlation > Isolation</h3>
      <p>Use all three in concert: a metric spike reveals the <em>what</em>; logs and traces reveal the <em>why</em>.
      Compare pod- and node-level metrics to distinguish local vs. systemic issues.</p>
    `
  },
  {
    id: 'collection-architecture',
    title: '3. Multi-Layered Collection Architecture',
    html: `
      <h3>3.1 Control Plane</h3>
      <p>Monitor API server latency, scheduler queues, and etcd health. Control plane issues cascade into workloads.</p>
      <h3>3.2 Nodes & Infrastructure</h3>
      <p><strong>node-exporter</strong> gathers host metrics (CPU, memory, disk, network) via a DaemonSet.</p>
      <h3>3.3 Pods & Containers</h3>
      <p><strong>kube-state-metrics</strong> exposes object state (pods, deployments, services) by watching the API.</p>
      <div class="card">
        <h4>Why both?</h4>
        <p>Host-level metrics show causes; object-state metrics show symptoms. Together they link infrastructure to orchestration behavior.</p>
      </div>
      <h3>3.4 Applications</h3>
      <ul>
        <li><strong>Liveness</strong>: restart unhealthy containers.</li>
        <li><strong>Readiness</strong>: gate traffic until ready.</li>
        <li><strong>Startup</strong>: grace period for slow starters.</li>
      </ul>
    `
  },
  {
    id: 'tooling-ecosystem',
    title: '4. Tooling Ecosystem: Open-Source vs. All-in-One',
    html: `
      <div class="cards">
        <div class="card">
          <h4>Open-Source (Prometheus + Grafana)</h4>
          <ul>
            <li>Flexible, customizable, cost-efficient, requires ops expertise.</li>
            <li>PromQL for analysis; Grafana for dashboards.</li>
          </ul>
        </div>
        <div class="card">
          <h4>All-in-One (e.g., Datadog)</h4>
          <ul>
            <li>Fast time-to-value, prebuilt dashboards, managed complexity.</li>
            <li>Licensing costs; opinionated customization.</li>
          </ul>
        </div>
      </div>
      <h3>OpenTelemetry Collector</h3>
      <p>Vendor-agnostic collection/processing/export for metrics, logs, traces. Decouples instrumentation from backend choice, deployable as DaemonSet or Deployment.</p>
    `
  },
  {
    id: 'operationalizing',
    title: '5. From Data to Action: Alerts, Troubleshooting, Culture',
    html: `
      <h3>5.1 Alerting Strategy</h3>
      <p>Alert on <em>symptoms</em> (e.g., latency), not raw causes. Use Alertmanager for grouping, inhibition, and silencing.</p>
      <h3>5.2 Troubleshooting Workflow</h3>
      <ol>
        <li>Check cluster/control plane.</li>
        <li>Drill into nodes/pods.</li>
        <li>Filter by labels/metadata.</li>
      </ol>
      <div class="card"><h4>Case: CPU Throttling</h4>
      <p>1) total CPU; 2) per-node balance; 3) per-pod requests/limits. Combine node and pod metrics.</p></div>
      <h3>5.3 Culture</h3>
      <ul>
        <li>Standardize labels (e.g., <code>env=production</code>, <code>app=checkout</code>).</li>
        <li>Blameless post-mortems to uncover systemic causes.</li>
        <li>Chaos engineering to build resilience.</li>
      </ul>
    `
  },
  {
    id: 'executive-summary',
    title: '6. Executive Summary & Recommendations',
    html: `
      <p>Observability requires correlating metrics, logs, and traces across control plane, nodes, pods, and apps.
      Choose open-source vs. all-in-one by resourcing and needs; consider OpenTelemetry to avoid lock-in.</p>
      <ul>
        <li>Deploy <strong>node-exporter</strong> and <strong>kube-state-metrics</strong>.</li>
        <li>Start with a small set of <em>symptom-based</em> alerts.</li>
        <li>Adopt a blameless learning culture.</li>
      </ul>
    `
  }
];

const QUIZ_QUESTIONS = [
  {
    question: 'What do metrics, logs, and traces provide when used together?',
    choices: [
      'A redundant view of the same data',
      'A unified, correlated view from high-level symptoms to root cause',
      'Only historical data for audits',
      'Only real-time alerts without context'
    ],
    answerIndex: 1,
    explanation: 'Metrics show the what; logs and traces add the why and where.'
  },
  {
    question: 'Which tool exposes Kubernetes object state as metrics?',
    choices: ['node-exporter', 'kube-state-metrics', 'Grafana', 'Alertmanager'],
    answerIndex: 1,
    explanation: 'kube-state-metrics watches the API and exposes object state.'
  },
  {
    question: 'Why pair node-exporter with kube-state-metrics?',
    choices: [
      'They are duplicates', 'They collect different, complementary data', 'They both scrape traces', 'To replace Prometheus'
    ],
    answerIndex: 1,
    explanation: 'Host state (causes) + object state (symptoms) accelerates RCA.'
  },
  {
    question: 'Alerting should focus primarily on…',
    choices: ['Causes (CPU spikes)', 'Symptoms (user-impacting signals)', 'Random sampling', 'Rare debug logs'],
    answerIndex: 1,
    explanation: 'Symptoms reduce alert fatigue and are directly actionable.'
  },
  {
    question: 'OpenTelemetry Collector helps by…',
    choices: [
      'Locking you into a vendor', 'Acting as a vendor-agnostic collector/processor/exporter', 'Only collecting logs', 'Replacing Kubernetes'
    ],
    answerIndex: 1,
    explanation: 'It decouples instrumentation from backend choice.'
  }
];

const ALERT_WIKI = [
  {
    name: 'Node CPU Overload',
    metric: 'sum(rate(node_cpu_seconds_total[5m]))',
    example: '> 0.8 for 5m',
    tip: 'Check top pods; scale or tune limits.',
    severity: 'warning'
  },
  {
    name: 'Memory Saturation',
    metric: 'node_memory_MemAvailable_bytes',
    example: '< 15% for 5m',
    tip: 'Inspect node allocation; investigate leaks.',
    severity: 'critical'
  },
  {
    name: 'Pod Restart Loop',
    metric: 'increase(kube_pod_container_status_restarts_total[5m])',
    example: '> 0',
    tip: 'Describe pod; check logs and probes.',
    severity: 'warning'
  },
  {
    name: 'Pod Pending Too Long',
    metric: 'scheduler_pending_pods',
    example: '> 0 for 5m',
    tip: 'Describe pod for scheduling reason; add capacity or adjust requests.',
    severity: 'warning'
  },
  {
    name: 'API Server Latency High',
    metric: 'rate(apiserver_request_duration_seconds{quantile="0.99"}[5m])',
    example: '> 1',
    tip: 'Check etcd and control plane health.',
    severity: 'critical'
  }
];

const DECISION_WIZARD = [
  {
    prompt: 'Team bandwidth for running infrastructure?',
    options: [
      { label: 'Low (prefer managed)', weight: +2 },
      { label: 'Moderate', weight: +1 },
      { label: 'High (DIY friendly)', weight: -2 }
    ]
  },
  {
    prompt: 'Priority: Time-to-value vs. Flexibility?',
    options: [
      { label: 'Time-to-value', weight: +2 },
      { label: 'Balanced', weight: 0 },
      { label: 'Flexibility & control', weight: -2 }
    ]
  },
  {
    prompt: 'Budget for licensing costs?',
    options: [
      { label: 'Comfortable with recurring cost', weight: +1 },
      { label: 'Some budget, cautious', weight: 0 },
      { label: 'Prefer open-source cost profile', weight: -1 }
    ]
  }
];

// Expose globals for app.js
window.CONTENT = CONTENT;
window.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
window.ALERT_WIKI = ALERT_WIKI;
window.DECISION_WIZARD = DECISION_WIZARD;


